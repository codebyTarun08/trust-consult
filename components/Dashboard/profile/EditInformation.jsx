"use client"
import { useForm } from "react-hook-form"
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfileData } from "@/services/userService"
const EditInformation = () => {
    const {user} = useSelector((state)=>(state.profile));
    const dispatch=useDispatch();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();
    const submitHandler = async (data) => {
        try {
            const response =await dispatch(updateProfileData(data))
            //console.log("Response Of Profile Updation: ",response)
        } catch (error) {
            console.log(error)
        }
        //console.log("Data",data);
    }
  return (
    <div className='w-11/12 mx-auto font-inter'>
        <form onSubmit={handleSubmit(submitHandler)}>
            <div className="flex justify-around items-center my-5 mx-auto gap-4">
                <span className="flex flex-col w-2/5">
                    <label htmlFor="firstName" className="text-cyan-900 text-sm my-1">First Name</label>
                    <input
                        name="firstName"
                        id="firstName"
                        type="text"
                        placeholder="First Name"
                        {...register("firstName", { required: "First Name is required" })}
                        defaultValue={user?.firstName}
                        className="bg-richblack-700 rounded-xl w-full p-3 text-cyan-600
                        border-b border-richblack-100/35"
                    />
                    {errors.firstName && <p>{errors.firstName.message}</p>}
                </span>
                <span className="flex flex-col w-2/5">
                    <label htmlFor="lastName" className="text-cyan-900 text-sm my-1">Last Name</label>
                    <input
                        name="lastName"
                        id="lastName"
                        type="text"
                        defaultValue={user?.lastName}
                        placeholder="Last Name"
                        {...register("lastName", { required: "Last Name is required" })}
                        className="bg-richblack-700 rounded-xl w-full p-3
                        border-b border-richblack-100/35 text-cyan-600"

                    />
                    {errors.lastName && <p>{errors.lastName.message}</p>}
                </span>
            </div>
            <div className="flex justify-around items-center my-auto mx-auto gap-4">
                <span className="flex flex-col w-2/5">
                    <label htmlFor="email" className="text-cyan-900 text-sm my-1">Email</label>
                    <input
                        name="email"
                        id="email "
                        type="text"
                        placeholder="Email"
                        {...register("email", { required: "Email is required" })}
                        defaultValue={user?.email}
                        className="bg-richblack-700 rounded-xl w-full p-3 text-cyan-600
                        border-b border-richblack-100/35"
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </span>
                <span className="flex flex-col w-2/5">
                    <label htmlFor="phoneNumber" className="text-cyan-900 text-sm my-1">Contact Number</label>
                    <input
                        name="phoneNumber"
                        id="phoneNumber"
                        type="text"
                        defaultValue={user?.phoneNumber}
                        placeholder="Contact Number"
                        {...register("phoneNumber", { required: "Contact Number is required" })}
                        className="bg-richblack-700 rounded-xl w-full p-3 text-cyan-600
                        border-b border-richblack-100/35"

                    />
                    {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
                </span>
            </div>
            <div className="mx-10 my-5">
             <button type="submit" className="bg-yellow-300 cursor-pointer text-black px-2 py-2 rounded-md">Save Changes</button>
            </div>
        </form>
    </div>
  )
}

export default EditInformation