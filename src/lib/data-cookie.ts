'use server'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
// ----------------------------------------------------------------------
//  Update Cookie information
// ----------------------------------------------------------------------
export async function updateCookieSessionId(sessionId: number): Promise<NextResponse> {
  const functionName = 'updateCookieSessionId'
  try {
    //
    //  Cookiename
    //
    const cookieName = 'SessionId'
    //
    //  Write the cookie
    //
    const JSON_cookie = JSON.stringify(sessionId)
    const response = NextResponse.next()
    response.cookies.set(cookieName, JSON_cookie, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/'
    })
    //
    //  Return response to apply the cookie
    //
    return response
    //
    //  Errors
    //
  } catch (error) {
    console.error(`${functionName}:`, error)
    throw new Error(`${functionName}: Failed`)
  }
}
// ----------------------------------------------------------------------
//  Delete Cookie
// ----------------------------------------------------------------------
export async function deleteCookie(cookieName: string = 'SessionId'): Promise<NextResponse> {
  const functionName = 'deleteCookie'
  try {
    const response = NextResponse.next()
    response.cookies.delete(cookieName)
    //
    //  Return response to apply the cookie deletion
    //
    return response
    //
    //  Errors
    //
  } catch (error) {
    console.error(`${functionName}:`, error)
    throw new Error(`${functionName}: Failed`)
  }
}
// ----------------------------------------------------------------------
//  Get Cookie information
// ----------------------------------------------------------------------
export async function getCookieSessionId(cookieName: string = 'SessionId'): Promise<string | null> {
  const functionName = 'getCookieSessionId'
  try {
    const allCookies = await cookies()
    const cookie = allCookies.get(cookieName) // Await the promise to resolve
    if (!cookie) return null
    //
    //  Get value
    //
    const decodedCookie = decodeURIComponent(cookie.value)
    if (!decodedCookie) return null
    //
    //  Convert to JSON
    //
    const JSON_cookie = JSON.parse(decodedCookie)
    if (!JSON_cookie) return null
    //
    //  Return JSON
    //
    return JSON_cookie
    //
    //  Errors
    //
  } catch (error) {
    console.error(`${functionName}:`, error)
    return null
  }
}
