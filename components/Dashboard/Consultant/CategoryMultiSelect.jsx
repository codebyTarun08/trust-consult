"use client";
import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";

const CategoryMultiSelect = ({
  name,
  categories = [], // all available categories
  selected = [],   // pre-selected category IDs
  setSelected,     // setter to pass changes up
  setValue
}) => {
  const [selectedCategories, setSelectedCategories] = useState(selected);

  useEffect(() => {
      setValue(name, selectedCategories)
  }, [selectedCategories, name, setValue]);
  useEffect(() => {
    setSelectedCategories(selected);
  }, [selected]);
  //Handle select change
  const handleSelectAdd = (e) => {
    let cat = e.target.value.trim()
    if(!selected.includes(cat)){
      const newSelected = [...selected,cat]
      setSelectedCategories(newSelected);
      setSelected(newSelected)
    }
  };

  // Handle chip delete
  const handleDelete = (id) => {
    const updated = selectedCategories.filter((catId) => catId !== id);
    setSelectedCategories(updated);
    setSelected(updated);
  };

  return (
    <div className="my-2">
      <label className="text-cyan-900 text-sm my-1">Categories</label>

      {/* Chips */}
      <div className="W-11/12 flex flex-wrap gap-2 mb-2">
        {selectedCategories.map((catId) => {
          const category = categories.find((c) => c._id === catId);
          return (
            <div
              key={catId}
              className="flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-600 w-fit cursor-pointer"
            >
              {category?.name}
              <button
                type="button"
                onClick={() => handleDelete(catId)}
                //className="focus:outline-none"
              >
                <MdClose className="text-sm text-red-600 cursor-pointer" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Multi-select dropdown */}
      <div className="flex w-full flex-wrap gap-y-2 border-b border-richblack-100/35 bg-richblack-700 rounded-xl p-2">
      <select
        name={name}
        value={selectedCategories}
        onChange={handleSelectAdd}
        className="flex-1 bg-transparent p-2 text-cyan-600 outline-none"
      >
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      </div>
    </div>
  );
};

export default CategoryMultiSelect;
