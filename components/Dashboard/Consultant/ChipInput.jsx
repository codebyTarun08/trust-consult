"use client";
import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";

const ChipInput = ({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
  expertise = [],
}) => {
  const [chips, setChips] = useState(expertise);

  // Keep form state in sync when chips change
  useEffect(() => {
    setValue(name, chips);
  }, [chips, name, setValue]);

  // Initialize when expertise prop changes
  useEffect(() => {
    if (expertise?.length > 0) {
      setChips(expertise);
    }
  }, [expertise]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const chipValue = event.target.value.trim();
      if (chipValue && !chips.includes(chipValue)) {
        const newChips = [...chips, chipValue];
        setChips(newChips);
        event.target.value = "";
      }
    }
  };

  const handleDeleteChip = (chipIndex) => {
    const newChips = chips.filter((_, index) => index !== chipIndex);
    setChips(newChips);
  };

  return (
    <div className="my-2">
      <label htmlFor={name} className="text-cyan-900 text-sm my-1">
        {label}
      </label>
      <div className="W-11/12 flex flex-wrap gap-2 my-2">
           {chips.length > 0 &&
          chips.map((chip, index) => (
            <span
              key={index}
              className=" flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-600 w-fit cursor-pointer"
            >
              {chip}
              <button
                type="button"
                className="ml-2 focus:outline-none"
                onClick={() => handleDeleteChip(index)}
              >
                <MdClose className="text-sm text-red-600 cursor-pointer" />
              </button>
            </span>
          ))}
      </div>
      <div className="flex w-full flex-wrap gap-y-2 border-b border-richblack-100/35 bg-richblack-700 rounded-xl p-2">
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent p-2 text-cyan-600 outline-none"
        />
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
};

export default ChipInput;
