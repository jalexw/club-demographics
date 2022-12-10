import { Gender, genders, PersonalDetails } from "@/member";
import React, { FC, useCallback, FormEventHandler, Dispatch, SetStateAction} from "react";

export interface UploadCSVFormProps {
  setData: Dispatch<SetStateAction<PersonalDetails[]>>
}

const UploadCSVForm: FC<UploadCSVFormProps> = ({ setData }) => {
  const handleFileUpload: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      // Don't refresh the page when file is uploaded
      e.preventDefault();
      // Get the file from the form
      const formFileList: FileList = e.currentTarget["csv-file"].files;
      if (!formFileList || formFileList.length === 0) {
        console.log("No CSV file selected")
        return;
      }
      const file: File = formFileList[0];
      // Get the file contents as a string
      const text: string = await file.text()
      const lines: string[] = text.split("\r\n")
      if (!lines || lines.length === 0) {
        console.log("No lines in file")
        return;
      }
      const data = lines.map(line => line.split(","))
      if (data.some(line => line.length !== 3)) {
        console.log("Invalid CSV file")
        return;
      }
      try {
        const typedData: PersonalDetails[] = data.map((line, index) => {
          const dob = new Date(line[1])
          const gender = line[2]
          if (!(genders as readonly string[]).includes(gender)) {
            throw new Error(`Please supply gender as one of ${genders.join(", ")} at line ${index}`)
          }

          return ({
            name: line[0],
            dob,
            gender: line[2] as Gender
          })
        })
        setData(typedData);
      } catch (parseError) {
        console.log("Invalid CSV file: ", parseError)
        return;
      }
    },
    [setData]
  )

  return (
    <form onSubmit={handleFileUpload} className="flex flex-col justify-start">
      <div className="flex flex-row justify-center items-center align-center">
        <input type="file" name="csv-file" />
        <button
          className="border bg-green-600 text-white p-2 rounded-lg font-bold"
          type="submit"
        >
          Upload
        </button>
      </div>
    </form>
  )
}

export default UploadCSVForm;