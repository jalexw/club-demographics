import type { FC } from "react"

import type { PersonalDetails } from "@/member"

import Row from "./Row";

export interface MemberTableProps {
  members: PersonalDetails[];
}

const MemberTable: FC<MemberTableProps> = ({ members }) => {
  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th>Name</th>
          <th>DOB</th>
          <th>Gender</th>
        </tr>
      </thead>
      <tbody>
        {
          members.map((member, index) => (
            <Row
              key={`member-${index}`}
              name={member.name}
              dob={member.dob}
              gender={member.gender}
            />
          ))
        }
      </tbody>
    </table>
  )
}

export default MemberTable;
