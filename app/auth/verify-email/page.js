"use client"
import React, { useState,useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux';
//npm i react-otp-input
import OTPInput from 'react-otp-input';
import { RxCountdownTimer } from "react-icons/rx";
import { sendOtp, signupUser } from "@/services/userService"
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi';
import Loading from '@/components/common/Loading';
const Page = () => {
    const {signupData,loading} = useSelector((state)=>(state.auth))
    const [otp,setOtp] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(()=>{
         if(!signupData){
            router.replace('/auth/signup')
         }
    },[signupData,router]);
    const submitHandler=(event)=>{
        event.preventDefault();
        
        const formData = {...signupData,otp}

        dispatch(signupUser( formData, router))
    }
  return (
    <div className='text-white bg-gray-900 flex justify-center items-center min-h-[calc(100vh-3.5rem)] '>
        {
            loading?(
               <Loading/>
            ):(
                <div
                className='w-[500px] flex flex-col space-y-9 p-8 transition-all duration-300 bg-richblue-400/50 backdrop-blur-xl rounded-xl'>
                    <div className='flex flex-col text-center gap-1'>
                    <h1>Verify Email</h1>
                    <p>A verification code has been sent to you. Enter the code below</p>
                    </div>

                    <form
                    onSubmit={submitHandler}
                    className='flex flex-col justify-center items-center' 
                    >
                        <OTPInput
                         inputStyle={{width:"40px" , height:"50px" , borderRadius: "5px", borderBottom: "1px solid" , borderColor: "#6E727F"}}
                         value={otp}
                         onChange={setOtp}
                         numInputs={6}
                         renderSeparator={<span>.........</span>}
                         renderInput={(props)=><input {...props} className='bg-richblack-900'
                         /> }
                        />

                        <button
                        type='submit'
                        className='mt-6 transition-all duration-200 hover:scale-95 w-full rounded-[8px] bg-amber-300 py-[12px] px-[12px] font-medium text-richblack-900 cursor-pointer'>
                            Verify Email
                        </button>
                    </form>
                    <div className='flex justify-between'>
                        <Link href="/auth/login" className='flex gap-1 items-center'>
                                <BiArrowBack />
                                <p className='font-inter text-white items-center text-sm hover:text-blue-100 transition-all duration-200 hover:scale-100'>Back to login</p>
                        </Link>
                        <button 
                        onClick={()=>dispatch(sendOtp(signupData.email , router))}
                        className='text-blue-300 flex items-center gap-2 cursor-pointer'>
                            <RxCountdownTimer />
                            Resend it
                        </button>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default Page