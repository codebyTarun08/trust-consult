"use client"
import Myprofile from '@/components/Dashboard/profile/Myprofile'
import HighLightText from '@/components/HighLightText'
import React from 'react'
import { useSelector } from 'react-redux'

const Page = () => {
  const {user} = useSelector((state)=>(state.profile))
  
  
  return (
    <div className='mt-10 lg:mt-0 ml-5 md:ml-0 text-white h-[calc(100vh-3.5rem)]'>
        <span className='flex gap-2 items-center'>
          <HighLightText text={user?.firstName} />
          <p className='text-2xl '> Profile Page</p>
        </span>
        <div className='w-11/12 mt-4 border-b border-richblack-400'></div>
        
        <div>
          <Myprofile />
        </div>
    </div>
  )
}

export default Page