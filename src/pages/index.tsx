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

      <main className="flex w-full flex-1 flex-col items-center justify-start px-10">
        <h1 className="text-center text-2xl m-4">Club Demographic Analysis Tool</h1>

        <DetailsDropdown title="Instructions">
          <p className="font-bold">
            This tool is designed to help you analyze the current and future demographic makeup of your club:
          </p>
          <ul className="list-disc pl-8">
            <li>
              Generate a population pyramid to see your club's current demographic makeup.
            </li>
            <li>
              Simulate different waitlist selection criteria.
            </li>
            <li>
              Predict population pyramids for future years based on your waitlist and selection criteria.
            </li>
          </ul>
          <p className="font-bold mt-8">
            To import your club members and waitlist, please export your lists as .CSV files and upload them below:
          </p>
          <ul className="list-disc pl-8">
            <li>
              "CSV" stands for "Comma Separated Values", a spreadsheet format.
            </li>
            <li>
              Microsoft Excel, Google Sheets, or any other spreadsheet software can export to CSV.
            </li>
            <li>
              Columns are separated by commas, and rows are separated by newlines.
            </li>
            <li>
              Each row represents a person, and each column represents a piece of information about them.
            </li>
            <li>
              Your CSV files should have three columns, in the following order:
              <ol className="list-decimal pl-8">
                <li>Name (cells can be left blank)</li>
                <li>Date of Birth (any valid date format)</li>
                <li>Gender (each cell must be one of "Male", "Female", or "NonBinary")</li>
              </ol>
            </li>
            <li>
              No "header" row should be included.
            </li>
            <li>
              The waitlist should be in descending order of priority.
            </li>
          </ul>
          <p className="font-bold mt-8">
            Here is an example of what the text inside your CSV file might look like:
          </p>
          <code className="bg-gray-200">John Smith,2000-01-01,Male</code><br/>
          <code className="bg-gray-200">Jane Doe,1999-12-31,Female</code><br/>
          <code className="bg-gray-200">Dylan Hernandez,1980-07-07,Male</code><br/>
          <code className="bg-gray-200">...</code>
        </DetailsDropdown>

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
