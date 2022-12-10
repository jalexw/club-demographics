import { useMemo, useState } from 'react'

import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'

// Types
import { encodeRow, PersonalDetails } from '@/member'

// Custom Components
import DetailsDropdown from '@/components/DetailsDropdown'
import MemberTable from '@/components/MemberTable'
import UploadCSVForm from '@/components/UploadCSVForm'


const Home: NextPage = () => {
  const [members, setMembers] = useState<PersonalDetails[]>([])
  const [waitlist, setWaitlist] = useState<PersonalDetails[]>([])

  // Combine each member's D.O.B and Gender into a HTTP query string
  const stringEncodedMembers = useMemo(() => {
    if (!members || members.length === 0) return "";
    // Encode each member as a string
    const encodedMembers: (`${string}-${string}`)[] = members.map(encodeRow);
    const queryEncoded: string = encodedMembers.map(
      (encodedMember) => `row[]=${encodedMember}`
    ).join("&");
    return queryEncoded
  }, [members])

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

        {
          members.length > 0 ? (
            <DetailsDropdown
              title="Current Club Demographic"
            >
              <img
                src={`/api/population_pyramid?title=${"Current Club Demographic"}&${stringEncodedMembers}`}
                alt="Current Club Demographic Population Pyramid"
                width={1920}
                height={1080}
              />
            </DetailsDropdown>
          ) : (<></>)
        }
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
