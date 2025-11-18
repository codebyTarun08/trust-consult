"use client"
import React from 'react'
import { useState } from 'react'
import Link from 'next/link';
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import {loginUser} from '@/services/userService';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
const LoginForm = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [showPassword,setShowPassword] = useState(false);
    const [formData,setFormData] = useState({
        email:"",
        password:""
    });
    const changeHandler = (event) => {
        setFormData((prevData)=>{
            return {
                ...prevData,
                [event.target.name]:event.target.value
            }
        })
    }
    const submitHandler =async (event)=>{
        event.preventDefault();
        //console.log(formData);
        try {
            dispatch(loginUser(formData,router))
        } catch (error) {
            console.log("Error logging in:", error);
        }
    }

return (
    <div className='my-10'>
            <form
            onSubmit={submitHandler}
            className='flex flex-col gap-y-5'>
                    <label>
                            <p className='font-bold font-inter my-0.5'>Enter Email<sup className='text-pink-400'>*</sup></p>
                            <input
                            type='email'
                            name='email'
                            value={formData.email}
                            placeholder='Enter Email Address'
                            className='py-2 bg-richblack-800 text-cyan-600 w-full sm:w-4/5 px-5 rounded-md border-b-[1px] border-b-slate-500'
                            onChange={changeHandler}
                            />
                    </label>
                    
                    <label className='relative'>
                            <p className='font-bold font-inter my-0.5'>Password<sup className='text-pink-400'>*</sup></p>
                            <input
                            type={`${showPassword?"text":"password"}`}
                            name='password'
                            value={formData.password}
                            placeholder='Enter Password Here'
                             className='py-2 bg-richblack-800 text-cyan-600 w-full sm:w-4/5 px-5 rounded-md border-b-[1px] border-b-slate-500'
                            onChange={changeHandler}/>
                            <Link href='reset-password'><p className='text-sm mt-2 text-cyan-600 italic font-cursive'>Forgot Password?</p></Link>
                            <span
                             className='absolute top-[35px] right-5 sm:right-28 text-cyan-600 cursor-pointer z-10'
                             onClick={()=>{setShowPassword(!showPassword)}}
                            >
                                    {
                                            showPassword ? (<AiFillEye fontSize='1.3rem'/>) : (<AiFillEyeInvisible fontSize='1.3rem'/>)
                                    }
                            </span>
                    </label>
                    <button className='px-10 py-2 bg-blue-200 w-full sm:w-4/5 rounded-xl active:scale-95 transition-all duration-200 cursor-pointer'>
                            Login
                    </button>
            </form>
    </div>
)
}

export default LoginForm