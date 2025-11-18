import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createCategory,updateCategory } from "@/services/adminService";

const CategoryModal = ({ setCategoryModal, isEdit = false, categoryData = {} }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Prefill form in edit mode
  useEffect(() => {
    if (isEdit && categoryData) {
      reset({
        name: categoryData.name || "",
        description: categoryData.description || "",
      });
    }
  }, [isEdit, categoryData, reset]);

  const submitHandler = async (data) => {
    try {
      if (isEdit) {
        // only update description
        dispatch(updateCategory({ id: categoryData._id, description: data.description }));
      } else {
        dispatch(createCategory(data));
      }
      setCategoryModal(false); // close modal after success
    } catch (error) {
      console.log("error in category operation: ", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-auto bg-white/20 backdrop-blur-sm">
            <div className="p-6 md:p-12 bg-richblack-800 rounded-lg w-11/12 max-w-md">
                <h2 className="text-richblack-5 font-semibold text-2xl mb-6">
                    {isEdit ? "Update Category" : "Create Category"}
                </h2>

                <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-y-6">
                    {/* Name field: only editable in create mode */}
                    <label className="w-full">
                    <p className="text-sm text-cyan-900 mb-2">Category Name</p>
                    <input
                        type="text"
                        placeholder="Enter category name"
                        {...register("name", { required: !isEdit })}
                        className="w-full bg-richblack-700 rounded-lg p-3 text-richblack-5 border-b-2 border-richblack-700 
                                focus:outline-none focus:border-richblack-500 transition-all duration-200"
                        disabled={isEdit} // disable in update mode
                    />
                    {errors.name && !isEdit && (
                        <span className="text-xs text-pink-200 mt-1">Category Name is required.</span>
                    )}
                    </label>

                    {/* Description field */}
                    <label className="w-full">
                    <p className="text-sm text-cyan-900 mb-2">
                        {isEdit ? "Update Category Description" : "New Category Description"}
                    </p>
                    <textarea
                        placeholder="Enter category description"
                        {...register("description", { required: true })}
                        className="w-full bg-richblack-700 rounded-lg p-3 text-richblack-5 border-b-2 border-richblack-700 
                                focus:outline-none focus:border-richblack-500 transition-all duration-200"
                    />
                    {errors.description && (
                        <span className="text-xs text-pink-200 mt-1">Description is required.</span>
                    )}
                    </label>

                    {/* Buttons */}
                    <div className="flex items-center gap-x-4 mt-6">
                    <button
                        type="submit"
                        className="px-6 py-3 rounded-lg text-richblack-800 font-semibold bg-cyan-200 
                                transition-all duration-200 hover:bg-cyan-500 hover:text-white cursor-pointer"
                    >
                        {isEdit ? "Update Category" : "Create Category"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setCategoryModal(false)}
                        className="px-6 py-3 rounded-lg text-white font-semibold border border-richblack-200 cursor-pointer bg-red-700"
                    >
                        Cancel
                    </button>
                    </div>
                </form>
         </div>
    </div>

  );
};

export default CategoryModal;
