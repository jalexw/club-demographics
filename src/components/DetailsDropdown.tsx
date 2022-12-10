import type { FC, PropsWithChildren } from "react"

export interface DetailsDropdownProps extends PropsWithChildren {
  title: string
}

const DetailsDropdown: FC<DetailsDropdownProps> = ({ title, children }) => {

  return (
    <details className="w-full my-4 bg-gray-50 border-gray-200 border-2 rounded-lg">
      <summary className="py-2">{ title }</summary>
      <hr className="border border-gray-200 w-full" />
      <div className="w-full p-4">
        { children }
      </div>
    </details>
  )
}

export default DetailsDropdown;
