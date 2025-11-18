import React from 'react'
import Link from 'next/link'
const CTAButton = ({text,flag,linkto}) => {
  return (
    <div>
        <Link href={linkto}>
         <button className={`${flag?"bg-sky-600 text-richblack-5":"bg-richblack-800"} px-4 py-2 rounded-md border-b-[1px] border-b-richblack-50 cursor-pointer hover:shadow-sm hover:shadow-richblack-5 hover:scale-95 transition-all duration-200 text-white`}>
          {text}
         </button>
        </Link>
    </div>
  )
}

export default CTAButton