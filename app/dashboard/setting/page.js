"use client"
import ChangeProfilePicture from '@/components/Dashboard/profile/ChangeProfilePicture'
import ChangePassword from '@/components/Dashboard/profile/ChangePassword'
import EditInformation from '@/components/Dashboard/profile/EditInformation'
import CompleteProfile from '@/components/Dashboard/Consultant/CompleteProfile'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
const Page = () => {
  const { user } = useSelector((state) => (state.profile));
  const [isAccount, setIsAccount] = useState(true);
  return (
    <div className='mt-10 md:mt-0 min-h-[calc(100vh-3.5rem)] text-white font-inter'>
      <p className='text-xl ml-5'>Settings Page</p>
      <div className='w-11/12 mt-4 ml-5 border-b border-richblack-400'></div>

      <div className="mt-10 md:w-11/12 w-[99%] border border-richblack-400 p-6 rounded-lg bg-richblack-900/50 ">
        {/* <div className='flex items-center gap-x-2 rounded-full border border-richblack-700 bg-richblack-800 p-1 text-richblack-200'>
  <button
    onClick={() => setIsAccount(true)}
    className={`
      flex-1 px-5 py-2 transition-all duration-200 rounded-full
      ${isAccount ? 'bg-richblack-700 text-richblack-5' : 'hover:bg-richblack-700 hover:text-richblack-5'}
    `}
  >
    Account Information
  </button>
  <button
    onClick={() => setIsAccount(false)}
    className={`
      flex-1 px-5 py-2 transition-all duration-200 rounded-full
      ${!isAccount ? 'bg-richblack-700 text-richblack-5' : 'hover:bg-richblack-700 hover:text-richblack-5'}
    `}
  >
    Change Password
  </button>
</div> */}
        <div className='flex justify-around items-center text-richblack-200'>
          <button
            onClick={() => setIsAccount(true)}
            className={` cursor-pointer
      relative pb-2 transition-all duration-200
      ${isAccount ? 'text-richblack-5 font-semibold' : ''}
      ${isAccount ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-yellow-500' : ''}
    `}
          >
            Account Information
          </button>
          <button
            onClick={() => setIsAccount(false)}
            className={` cursor-pointer
      relative pb-2 transition-all duration-200
      ${!isAccount ? 'text-richblack-5 font-semibold' : ''}
      ${!isAccount ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-yellow-500' : ''}
    `}
          >
            Change Password
          </button>
        </div>
        {
          isAccount && (
            <>
              <ChangeProfilePicture />
              <div className='w-5/6 mx-auto mt-4 border-b border-richblack-400'></div>
              <EditInformation />
            </>
          )
        }
        {
          !isAccount && (
            <>
              <ChangePassword/>
            </>
          )
        }
      </div>
      {
        user?.role === "Consultant" &&(
          <div className='my-10'>
            <p className='text-xl ml-5'>Add Necessary Field for Consultant</p>
            <div className='w-11/12 ml-5 mt-4 border-b border-richblack-400'></div>

            <div className="mt-10 md:w-11/12 w-[99%] border border-richblack-400 p-6 rounded-lg bg-richblack-900/50 ">
              <CompleteProfile consultantId={user?._id}/>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Page