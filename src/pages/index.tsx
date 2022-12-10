import { useState } from 'react'


import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'

// Custom Components
import DetailsDropdown from '@/components/DetailsDropdown'
import MemberTable from '@/components/MemberTable'

// Types
import type { PersonalDetails } from '@/member'
import UploadCSVForm from '@/components/UploadCSVForm'

const Home: NextPage = () => {
  const [members, setMembers] = useState<PersonalDetails[]>([])
  const [waitlist, setWaitlist] = useState<PersonalDetails[]>([])


  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Club Demographics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-start px-10 text-center">
        <h1 className="text-center text-2xl m-4">Club Demographic Analysis Tool</h1>

        

        <DetailsDropdown
          title="Club Members List"
        >
          {
            members.length === 0 ? (
              <UploadCSVForm setData={setMembers} />
            ) : (
              <MemberTable members={members} />
            )
          }
          
        </DetailsDropdown>

        <DetailsDropdown
          title="Membership Waitlist"
        >
          {
            waitlist.length === 0 ? (
              <UploadCSVForm setData={setWaitlist} />
            ) : (
              <MemberTable members={waitlist} />
            )
          }
        </DetailsDropdown>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <p>
          Built by J. Alex Whitman for{' '}
          <a
            href="https://ashburngolfclub.com/"
            className="text-blue-600 hover:text-blue-500 underline"
          >
            Ashburn Golf Club
          </a>
        </p>
      </footer>
    </div>
  )
}

export default Home
