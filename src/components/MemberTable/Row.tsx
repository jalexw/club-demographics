import type { FC } from "react"

import type { PersonalDetails } from "@/member"

export interface RowProps extends PersonalDetails {}

const Row: FC<RowProps> = ({ name, dob, gender }) => {
  const nameText = name ? (
    <span className="text-gray-900 font-medium">
      { name }
    </span>
  ) : (
    <span className="text-gray-500 italic">
      N/A
    </span>
  )

  return (
    <tr>
      <td>{ nameText } </td>
      <td>
        <span className="text-gray-900 font-medium">
          { dob.toDateString() }
        </span>
      </td>
      <td>
        <span className="text-gray-900 font-medium">
          { gender }
        </span>
      </td>
    </tr>
  )
}

export default Row;
