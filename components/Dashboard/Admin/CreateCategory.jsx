import React from 'react'
import {useForm} from "react-hook-form"
import { useSelector,useDispatch } from 'react-redux'
import { useRouter } from "next/navigation";
import { createCategory } from '@/services/adminService';
const CreateCategory= () => {
    const dispatch =  useDispatch();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const submitHandler = async (data)=>{
        try {
           dispatch(createCategory(data));
        } catch (error) {
            console.log("error in create category: ",error);
        }
    }
  return (
    <div className='p-6 md:p-12'>
      <h2 className='text-richblack-5 font-semibold text-2xl mb-6'>Create Category</h2>
      <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-y-6'>
        <div className="flex flex-col gap-y-4">
          <label className='w-full'>
            <p className="text-sm text-cyan-900 mb-2">Category Name</p>
            <input
              type="text"
              placeholder="Enter category name"
              {...register("name", { required: true })}
              className="w-full bg-richblack-700 rounded-lg p-3 text-richblack-5 border-b-2 border-richblack-700 focus:outline-none focus:border-richblack-500 transition-all duration-200"
            />
            {errors.name && (
              <span className="text-xs text-pink-200 mt-1">
                Category Name is required.
              </span>
            )}
          </label>
          <label className='w-full'>
            <p className="text-sm text-cyan-900 mb-2">New Category Description</p>
            <textarea
              placeholder="Enter new category description"
              {...register("description", { required: true, })} //minLength: 6
              className="w-full bg-richblack-700 rounded-lg p-3 text-richblack-5 border-b-2 border-richblack-700 focus:outline-none focus:border-richblack-500 transition-all duration-200"
            />
            {errors.description && (
              <span className="text-xs text-pink-200 mt-1">
                {errors.newCategoryDescription.type === "required" && "New Category Description is required."}
                {/* {errors.newPassword.type === "minLength" && "New Password must be at least 6 characters."} */}
              </span>
            )}
          </label>

        </div>
        <div className='flex items-center gap-x-4 mt-6'>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg text-richblack-800 font-semibold bg-cyan-200 transition-all duration-200 hover:bg-cyan-500 hover:text-white"
          >
            Create Category
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateCategory