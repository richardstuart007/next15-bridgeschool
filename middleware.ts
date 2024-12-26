import {
  Routes_App,
  Routes_LoginRegister,
  Routes_Prefix_auth,
  Routes_AfterLogin_redirect,
  Routes_Prefix_admin,
  Routes_Login
} from '@/routes'
import { writeLogging } from '@/src/lib/tables/tableSpecific/logging'
import { isAdmin } from '@/src/lib/tables/tableSpecific/sessions'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest): Promise<NextResponse> {
  const functionName = 'middleware'
  const { nextUrl } = req
  //
  //  Requested path name
  //
  const pathnameNew = req.nextUrl.pathname
  //
  //  Current path name
  //
  const pathnameCurrentobj = req.headers.get('referer')
  let pathnameCurrent = '/'
  if (pathnameCurrentobj) {
    const previousUrl = new URL(pathnameCurrentobj)
    pathnameCurrent = previousUrl.pathname
  }
  //
  //  Flags
  //
  const isPrefixApiAuth = pathnameNew.startsWith(Routes_Prefix_auth)
  const isAppRoute = Routes_App.includes(pathnameNew)
  const wasLoginRegisterRoute = Routes_LoginRegister.includes(pathnameCurrent)
  const isPrefixAdminRoute = pathnameNew.startsWith(Routes_Prefix_admin)
  //
  //  Login status (Auth not working yet)
  //
  const allCookies = await cookies()
  const cookie = allCookies.get('SessionId')
  const isLoggedInCookie = !!cookie
  //-------------------------------------------------------------------------------------------------
  //  Allow all API routes
  //-------------------------------------------------------------------------------------------------
  if (isPrefixApiAuth) return NextResponse.next()
  //-------------------------------------------------------------------------------------------------
  //  Allow App route
  //-------------------------------------------------------------------------------------------------
  if (isAppRoute) return NextResponse.next()
  //-------------------------------------------------------------------------------------------------
  //  Login/Register
  //-------------------------------------------------------------------------------------------------
  if (wasLoginRegisterRoute) {
    //
    // If not logged in then do not redirect
    //
    if (!isLoggedInCookie) return NextResponse.next()
    //
    // Logged in and already redirected
    //
    if (pathnameNew === Routes_AfterLogin_redirect) return NextResponse.next()
    //
    //  Logged in then Redirect to dashboard
    //
    return NextResponse.redirect(new URL(Routes_AfterLogin_redirect, nextUrl))
  }
  //-------------------------------------------------------------------------------------------------
  //  If no change in path, allow
  //-------------------------------------------------------------------------------------------------
  if (pathnameNew === pathnameCurrent) return NextResponse.next()
  //-------------------------------------------------------------------------------------------------
  //  Admin route
  //-------------------------------------------------------------------------------------------------
  if (isPrefixAdminRoute) {
    //
    //  Not logged in
    //
    if (!isLoggedInCookie) {
      //
      //  Logging
      //
      writeLogging(functionName, `Admin Route not logged in: Redirect ${Routes_Login}`, 'W')
      return NextResponse.redirect(new URL(Routes_Login, nextUrl))
    }
    //
    //  Not authorised ()
    //
    const isAdminAuthorised = await isAdmin()
    if (!isAdminAuthorised) {
      writeLogging(
        functionName,
        `Admin Route not Authorised: Redirect ${Routes_AfterLogin_redirect}`,
        'W'
      )
      return NextResponse.redirect(new URL(Routes_AfterLogin_redirect, nextUrl))
    }
    //
    //  Authorised
    //
    return NextResponse.next()
  }
  //-------------------------------------------------------------------------------------------------
  //  Allow others
  //-------------------------------------------------------------------------------------------------
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
