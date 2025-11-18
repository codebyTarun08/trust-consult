
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form"
import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import ChipInput from "./ChipInput";
import CategoryMultiSelect from "./CategoryMultiSelect";
import TimeSlotsInput from "./TimeSLotsInput";
import { createProfile, getConsultant } from "@/services/consultantService";
const CompleteProfile = () => {
  const dispatch = useDispatch();
  const {consultant,user} = useSelector((state)=>(state.profile));
    const [categories, setCategories] = useState([]); // fetched from API
    const [selectedCategories, setSelectedCategories] = useState(consultant?.categories);
    const [availabilitySlots,setAvailabilitySlots] = useState(consultant?.availability?.timeSlots)
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState:{errors}
  }=useForm();

    useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/admin/getAllCategories");
      const data = await res.json();
      await dispatch(getConsultant());
      setCategories(data.categories);
    }
    fetchCategories();
  }, []);

  const submitHandler = async (data)=>{
    try {
      const consultantId = user?._id;
      const formData = {...data,consultantId};
      //console.log("CONSULTANT PROFILE ",formData)
      await dispatch(createProfile(formData));
    } catch (error) {
      console.log("Consultant Profile Updation error",error)
    }
  }
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(submitHandler)} className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="bio" className="text-cyan-900 text-sm sm:text-base">Bio</label>
          <textarea
            name="bio"
            id="bio"
            defaultValue={consultant?.bio}
            placeholder="Enter The Bio"
            rows={4}
            className="bg-richblack-700 rounded-xl w-full p-3 text-cyan-600 border-b border-richblack-100/35 resize-none"
            {...register("bio", { required: "Bio is required" })}
          />
          {errors.bio && <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>}
        </div>

        <div className="w-full">
          <ChipInput
            label="expertise"
            name="expertise"
            placeholder="Enter Expertise and Press Enter"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            expertise={consultant?.expertise}
          />
        </div>

        <div className="w-full">
          <CategoryMultiSelect
            name="categories"
            categories={categories}
            selected={consultant?.categories}
            setSelected={setSelectedCategories}
            setValue={setValue}
          />
        </div>

        <div className="w-full">
          <TimeSlotsInput
            name="timeSlots"
            setValue={setValue}
            slots={consultant?.availability?.timeSlots}
            setSlots={setAvailabilitySlots}
          />
        </div>

        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 my-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  )
}

export default CompleteProfile

