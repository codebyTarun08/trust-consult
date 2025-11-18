"use client"
import React from 'react'
import { useState } from 'react';
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";
import {sendOtp, signupUser} from '@/services/userService';
import {useDispatch } from 'react-redux';
import {setSignupData} from "@/app/redux/slices/authSlice"
const SignupForm = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [showPassword,setShowPassword]=useState(false);
    const [showCnfPassword,setCnfShowPassword]=useState(false)
    const [formData, setFormData] = useState({
        firstName:"",
        lastName:"",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        role: ""
    });
    const [role,setRole] = useState("Client")
    const changeHandler = (event) => {
        setFormData((prevData) => {
            return {
                ...prevData,
                [event.target.name]: event.target.value
            }
        })
    }
    const submitHandler =async (event) => {
        event.preventDefault();
        try {
            const signupData = {
                ...formData,
                role
            };
            dispatch(setSignupData(signupData))
            dispatch(sendOtp(formData.email,router))
            //dispatch(signupUser(signupData,router))
            setFormData({
                firstName:"",
                lastName:"",
                email: "",
                password: "",
                confirmPassword: "",
                phoneNumber: "",
                role: ""
            })
            setRole("Client")
        } catch (error) {
            console.log("Error in signup form", error);
        }
    }
    return (
        <div className='my-10 flex flex-col gap-y-5 px-4'>
            <div className='flex sm:flex-row h-auto sm:h-14 py-2 justify-evenly border-b border-gray-600 text-cyan-500 bg-richblack-800 w-full sm:w-4/5 rounded-xl gap-2 sm:gap-0'>
                <button 
                    onClick={()=>setRole("Client")}
                    className={`${role==="Client" ? "bg-richblack-900 py-1 px-4 rounded-xl":"text-red-800"} transition-all duration-200 border-b border-gray-600`}       
                >Client</button>
                <button
                    onClick={()=>setRole("Consultant")}
                    className={`${role==="Consultant"?"bg-richblack-900 py-1 px-4 rounded-xl":"text-red-800"} transition-all duration-200 border-b border-gray-600`}
                >Consultant</button>
            </div>
            <form
                onSubmit={submitHandler}
                className='flex flex-col gap-y-5'>
                <div className='flex flex-col sm:flex-row gap-4'>
                    <label className='flex-1'>
                        <p className='text-[0.875rem] leading-[1.5rem] mb-1 font-extrabold font-inter'>First Name<sup className='text-pink-400'>*</sup></p>
                        <input
                            type='text'
                            name='firstName'
                            value={formData.firstName}
                            placeholder='Enter First Name'
                            className='py-2 bg-richblack-800 text-cyan-600 w-full px-5 rounded-md border-b-[1px] border-b-slate-500'
                            onChange={changeHandler}
                        />
                    </label>
                    <label className='flex-1'>
                        <p className='text-[0.875rem] leading-[1.5rem] mb-1 font-extrabold font-inter'>Last Name<sup className='text-pink-400'>*</sup></p>
                        <input
                            type='text'
                            name='lastName'
                            value={formData.lastName}
                            placeholder='Enter Last Name'
                            className='py-2 bg-richblack-800 text-cyan-600 w-full px-5 rounded-md border-b-[1px] border-b-slate-500'
                            onChange={changeHandler}
                        />
                    </label>
                </div>
                <label>
                    <p className='text-[0.875rem] leading-[1.5rem] mb-1 font-extrabold font-inter'>Enter Email<sup className='text-pink-400'>*</sup></p>
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        placeholder='Enter Email Address'
                        className='py-2 bg-richblack-800 text-cyan-600 w-full px-5 rounded-md border-b-[1px] border-b-richblack-200'
                        onChange={changeHandler}
                    />
                </label>

                <label>
                    <p className='text-[0.875rem] leading-[1.5rem] mb-1 font-extrabold font-inter'>Enter Phone Number<sup className='text-pink-400'>*</sup></p>
                    <input
                        type='number'
                        name='phoneNumber'
                        value={formData.phoneNumber}
                        placeholder='Enter Phone Number'
                        className='py-2 bg-richblack-800 text-cyan-600 w-full px-5 rounded-md border-b-[1px] border-b-richblack-200'
                        onChange={changeHandler}
                    />
                </label>

                <div className='flex flex-col sm:flex-row gap-4 relative'>
                    <label className='flex-1'>
                        <p className='text-[0.875rem] leading-[1.5rem] mb-1 font-extrabold font-inter'>Password<sup className='text-pink-400'>*</sup></p>
                    <input
                        type={`${showPassword?"text":"password"}`}
                        name='password'
                        value={formData.password}
                        placeholder='Enter Password'
                        className='py-2 bg-richblack-800 text-cyan-600 px-5 rounded-md border-b-[1px] border-b-richblack-200 w-full'
                        onChange={changeHandler} />
                        <span
                            className='absolute top-[36px] right-6 sm:right-[325px] text-cyan-600 cursor-pointer z-10 '
                            onClick={()=>{setShowPassword(!showPassword)}}
                        >
                            {
                            showPassword ? (<AiFillEye fontSize='1.3rem'/>) : (<AiFillEyeInvisible fontSize='1.3rem'/>)
                            }
                        </span>
                    </label>
                    <label className='flex-1'>
                    <p className='text-[0.875rem] leading-[1.5rem] mb-1 font-extrabold font-inter'>Confirm Password<sup className='text-pink-400'>*</sup></p>
                    <input
                        type={`${showCnfPassword?"text":"password"}`}
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        placeholder='Enter Confirm Password'
                        className='py-2 bg-richblack-800 text-cyan-600 w-full px-5 rounded-md border-b-[1px] border-b-richblack-200'
                        onChange={changeHandler} />
                        <span
                            className='absolute top-[120px] right-6 sm:right-28 text-cyan-600 cursor-pointer z-10'
                            onClick={()=>{setCnfShowPassword(!showCnfPassword)}}
                        >
                            {
                            showCnfPassword ? (<AiFillEye fontSize='1.3rem'/>) : (<AiFillEyeInvisible fontSize='1.3rem'/>)
                            }
                        </span>
                    </label>
                </div>
                <button className='px-10 py-4 bg-blue-300 cursor-pointer w-full sm:w-4/5 rounded-xl active:scale-95 transition-all duration-200'>
                    Signup
                </button>
            </form>
            
        </div>
    )
}

export default SignupForm