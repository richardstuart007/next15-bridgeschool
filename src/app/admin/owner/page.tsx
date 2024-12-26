import Table from '@/src/ui/admin/owner/table'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'owner'
}
//
//  Exported Function
//
export default async function Page() {
  return (
    <div className='w-full md:p-6'>
      <Suspense fallback={<div>Loading...</div>}>
        <Table />
      </Suspense>
    </div>
  )
}