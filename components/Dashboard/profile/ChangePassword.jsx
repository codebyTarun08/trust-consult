import React from 'react'
import {useForm} from "react-hook-form"
import { useSelector,useDispatch } from 'react-redux'
import { useRouter } from "next/navigation";
import { changePassword } from '@/services/userService';
const ChangePassword = () => {
    const dispatch =  useDispatch();
    const router = useRouter();
    const {user} = useSelector((state)=>(state.profile));
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const submitHandler = async (data)=>{
        try {
            data.email=user?.email;
           // console.log("data: ",data)
            const response = await dispatch(changePassword(data));
           // console.log(response);
        } catch (error) {
            console.log("error in change Password: ",error);
        }
    }
//   return (
//     <div >
//         <form className='flex flex-col' onSubmit={handleSubmit(submitHandler)}>
//              <div className="flex flex-col justify-around items-center my-auto mx-auto gap-4">
//                 <span className="flex flex-col gap-4">
//                   <label htmlFor="oldPassword" className="">Old Password</label>
//                   <input
//                     name="oldPassword"
//                     id="oldPassword"    
//                     type="Password"
//                     placeholder="Old Password"
//                     {...register("oldPassword", { required: "Old Password is required" })}
//                     className="bg-richblack-700 rounded-xl w-full p-3 text-richblack-5
//                             border-b border-richblack-100/35"
//                   />
//                   {errors.oldPassword && <p>{errors.oldPassword.message}</p>}
//                 </span>
//                 <span className="flex flex-col gap-4">
//                   <label htmlFor="newPassword" className="">New Password</label>
//                   <input
//                     name="newPassword"
//                     id="newPassword"
//                     type="Password"
//                     placeholder="New Password"
//                     {...register("newPassword", { required: "New Password is required" })}
//                     className="bg-richblack-700 rounded-xl w-full p-3 text-richblack-5
//                             border-b border-richblack-100/35"
//                   />
//                   {errors.newPassword && <p>{errors.newPassword.message}</p>}
//                 </span>
//                 <span className="flex flex-col gap-4">
//                   <label htmlFor="cnfNewPassword" className="">Confirm New Password</label>
//                   <input
//                     name="cnfNewPassword"
//                     id="cnfNewPassword"
//                     type="Password"
//                     placeholder="Confirm New Password"
//                     {...register("cnfNewPassword", { required: "Confirm New Password is required" })}
//                     className="bg-richblack-700 rounded-xl w-full p-3 text-richblack-5
//                             border-b border-richblack-100/35"
//                   />
//                   {errors.cnfNewPassword && <p>{errors.cnfNewPassword.message}</p>}
//                 </span>
//               </div>
//         </form>
//     </div>
//   )
  return (
    <div className='p-6 md:p-12'>
      <h2 className='text-richblack-5 font-semibold text-2xl mb-6'>Change Password</h2>
      <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-y-6'>
        <div className="flex flex-col gap-y-4">
          <label className='w-full'>
            <p className="text-sm text-cyan-900 mb-2">Old Password</p>
            <input
              type="password"
              placeholder="Enter your current password"
              {...register("oldPassword", { required: true })}
              className="w-full bg-richblack-700 rounded-lg p-3 text-richblack-5 border-b-2 border-richblack-700 focus:outline-none focus:border-richblack-500 transition-all duration-200"
            />
            {errors.oldPassword && (
              <span className="text-xs text-pink-200 mt-1">
                Old Password is required.
              </span>
            )}
          </label>
          <label className='w-full'>
            <p className="text-sm text-cyan-900 mb-2">New Password</p>
            <input
              type="password"
              placeholder="Create a new password"
              {...register("newPassword", { required: true, })} //minLength: 6 
              className="w-full bg-richblack-700 rounded-lg p-3 text-richblack-5 border-b-2 border-richblack-700 focus:outline-none focus:border-richblack-500 transition-all duration-200"
            />
            {errors.newPassword && (
              <span className="text-xs text-pink-200 mt-1">
                {errors.newPassword.type === "required" && "New Password is required."}
                {/* {errors.newPassword.type === "minLength" && "New Password must be at least 6 characters."} */}
              </span>
            )}
          </label>
          <label className='w-full'>
            <p className="text-sm text-cyan-900 mb-2">Confirm New Password</p>
            <input
              type="password"
              placeholder="Confirm your new password"
              {...register("cnfNewPassword", { required: true })}
              className="w-full bg-richblack-700 rounded-lg p-3 text-richblack-5 border-b-2 border-richblack-700 focus:outline-none focus:border-richblack-500 transition-all duration-200"
            />
            {errors.cnfNewPassword && (
              <span className="text-xs text-pink-200 mt-1">
                Confirming the new password is required.
              </span>
            )}
          </label>
        </div>
        <div className='flex items-center gap-x-4 mt-6'>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg font-medium text-richblack-50 bg-richblack-700 transition-all duration-200 hover:bg-richblack-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-[10px] md:px-6 md:py-3 rounded-lg text-richblack-800 font-semibold bg-cyan-200 transition-all duration-200 hover:bg-cyan-500 hover:text-white"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChangePassword