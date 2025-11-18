"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "@/app/redux/slices/categorySlice";
import { FaPlus } from "react-icons/fa6";
import { deactivateCategory, getCategories } from "@/services/adminService";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import CategoryModal from "@/components/Dashboard/Admin/CategoryModal";

export default function CategoryPage() {
  const dispatch = useDispatch();
  const { category, loading } = useSelector((state) => state.category);

  const [categoryModal, setCategoryModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filter, setFilter] = useState("All"); // Default filter

  // Fetch categories only once (if not already loaded)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        dispatch(setLoading(true));
        await dispatch(getCategories());
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (category.length === 0) {
      fetchCategories();
    }
  }, [dispatch, category.length]);

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsUpdate(false);
    setCategoryModal(true);
  };

  const handleUpdate = (cat) => {
    setSelectedCategory(cat);
    setIsUpdate(true);
    setCategoryModal(true);
  };

  const handleDeactivate = (cat) => {
    dispatch(setLoading(true));
    dispatch(deactivateCategory({ id: cat._id }));
    dispatch(setLoading(false));
  };

  // Apply filter
  const filteredCategories = category.filter((cat) => {
    if (filter === "All") return true;
    if (filter === "Activated") return cat.isActive === true;
    if (filter === "Deactivated") return cat.isActive === false;
    return true;
  });

  return (
    <div className="mt-10 md:mt-0 text-white font-inter min-h-[calc(100vh-3.5rem)] flex flex-col items-center">
      <div className="w-full md:w-11/12">
        <h3 className="text-xl mb-2">Category Page</h3>
        <div className="w-full mt-4 border-b border-richblack-400"></div>

        {/* Actions: Create + Filter */}
        <div className="mt-6 w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-4 rounded-lg">
          <button
            className="w-full md:w-auto cursor-pointer font-semibold bg-blue-600 px-4 py-2 rounded-lg flex justify-center items-center gap-x-3 text-white transition-shadow hover:shadow-lg"
            onClick={handleCreate}
          >
            <FaPlus />
            <span className="hidden sm:inline">Create New Category</span>
            <span className="sm:hidden">Create</span>
          </button>

          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 rounded-lg text-white font-semibold cursor-pointer bg-black/60 transition-all duration-300 border border-richblack-200"
          >
            <option value="All">All</option>
            <option value="Activated">Activated</option>
            <option value="Deactivated">Deactivated</option>
          </select>
        </div>

        {/* Table / Card responsive container */}
        <div className="w-full border border-richblack-400 rounded-lg overflow-hidden transition-all duration-300">
          {loading ? (
            <p className="p-6 text-gray-500">Loading...</p>
          ) : (
            <>
              {/* Desktop / Tablet: table */}
              <div className="hidden md:block w-full overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-black/50 backdrop-blur-3xl">
                    <tr>
                      <th className="px-6 py-5 text-left text-xs font-medium uppercase tracking-wider">
                        S.No.
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-medium uppercase tracking-wider">
                        Category Name
                      </th>
                      <th className="px-6 py-5 text-center text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat, index) => (
                        <tr
                          key={cat._id}
                          className={index % 2 === 0 ? "bg-richblue-700/30" : "bg-black/15"}
                        >
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium">{cat.name}</div>
                            <div className="text-xs text-gray-500 mt-1 max-w-xl">
                              {cat.description.split(" ").slice(0, 20).join(" ")}
                              {cat.description.split(" ").length > 20 ? "..." : ""}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm font-medium">
                            <div className="flex justify-center items-center space-x-2">
                              <button
                                onClick={() => handleUpdate(cat)}
                                className="p-2 rounded-lg flex items-center gap-1 text-yellow-500 cursor-pointer transition-all duration-300 hover:bg-yellow-300/10"
                              >
                                <AiFillEdit />
                                Update
                              </button>
                              <button
                                onClick={() => handleDeactivate(cat)}
                                className="p-2 rounded-lg flex items-center gap-1 text-red-500 cursor-pointer transition-all duration-300 hover:bg-red-300/10"
                              >
                                <MdDelete className="inline-block mr-1" />
                                Deactivate
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-8 text-gray-500">
                          No categories found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile: card list */}
              <div className="md:hidden w-full flex flex-col gap-3 p-4">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat, index) => (
                    <div
                      key={cat._id}
                      className="bg-black/20 border border-richblack-400 rounded-lg p-4 flex flex-col"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-semibold">{index + 1}. {cat.name}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {cat.description.split(" ").slice(0, 25).join(" ")}
                            {cat.description.split(" ").length > 25 ? "..." : ""}
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-md bg-black/40 text-gray-200">
                          {cat.isActive ? "Active" : "Deactivated"}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col sm:flex-row sm:space-x-2 gap-2">
                        <button
                          onClick={() => handleUpdate(cat)}
                          className="w-full sm:w-auto px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-yellow-500 bg-yellow-300/5 hover:bg-yellow-300/10 transition"
                        >
                          <AiFillEdit />
                          <span>Update</span>
                        </button>
                        <button
                          onClick={() => handleDeactivate(cat)}
                          className="w-full sm:w-auto px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-red-500 bg-red-300/5 hover:bg-red-300/10 transition"
                        >
                          <MdDelete />
                          <span>Deactivate</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">No categories found.</div>
                )}
              </div>
            </>
          )}
        </div>

        {categoryModal && (
          <CategoryModal
            setCategoryModal={setCategoryModal}
            isEdit={isUpdate}
            categoryData={selectedCategory}
          />
        )}
      </div>
    </div>
  );
}
