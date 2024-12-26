import '@/src/global.css'
import { inter } from '@/src/fonts'
import { Metadata } from 'next'
import { UserProvider } from '@/UserContext'
import { table_fetch } from '@/src/lib/tables/tableGeneric/table_fetch'

export const metadata: Metadata = {
  title: {
    template: '%s | Bridge School Dashboard',
    default: 'Bridge School Dashboard'
  },
  description: 'next15 Bridge School.',
  metadataBase: new URL('https://next15-bridgeschool.vercel.app/')
}

//-------------------------------------------------------------------------------
//  Get the database name (Server-side function)
async function getDatabaseName(): Promise<string> {
  const rows = await table_fetch({
    table: 'database',
    whereColumnValuePairs: [{ column: 'd_did', value: 1 }]
  })

  const row = rows[0]
  const dbName = row?.d_name ?? 'Unknown'

  return dbName
}
//-------------------------------------------------------------------------------

// This is the actual component that will be rendered on the server
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const d_name = await getDatabaseName()

  // Ensure no null prototype or non-plain objects
  if (Object.prototype.toString.call(d_name) !== '[object String]') {
    throw new Error('d_name is not a plain string')
  }
  const clientData = { d_name: String(d_name) }

  return (
    <html lang='en'>
      <body
        className={`${inter.className} antialiased ${clientData.d_name === 'Dev' ? 'bg-yellow-100' : 'bg-blue-100'}`}
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
