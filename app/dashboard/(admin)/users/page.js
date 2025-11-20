"use client";
import { getAllUsers } from "@/services/adminService";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
const Page = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await dispatch(getAllUsers())
        setUsers(result);
        //console.log("Fetched users:", result);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (users.length === 0) {
      fetchUsers();
    }
  }, [dispatch, users.length,isClient]);

  const filteredUsers = users.filter((u) =>
    isClient ? u.role === "Client" : u.role === "Consultant"
  );

  return (
    <div className="mt-10 md:mt-0 text-white min-h-[calc(100vh-3.5rem)] font-inter px-4 sm:px-8">
      <h3 className="text-xl">All Users</h3>
      <div className="w-full max-w-6xl mt-4 border-b border-richblack-400"></div>

      {/* Toggle Buttons */}
      <div className="flex justify-center sm:justify-around items-center transition-all duration-200 text-richblack-200 my-5 gap-4">
        <button
          onClick={() => setIsClient(true)}
          className={`relative pb-2 cursor-pointer transition-all duration-200
            ${isClient ? "text-richblack-5 font-semibold" : ""} 
            ${isClient ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-yellow-500' : ""}`}
        >
          Client
        </button>
        <button
          onClick={() => setIsClient(false)}
          className={`relative pb-2 cursor-pointer transition-all duration-200
            ${!isClient ? "text-richblack-5 font-semibold" : ""} 
            ${!isClient ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-yellow-500' : ""}`}
        >
          Consultant
        </button>
      </div>

      {/* Users Container */}
      <div className="w-full max-w-6xl border border-richblack-400 rounded-lg overflow-hidden transition-all duration-300">
        {loading ? (
          <div className="p-8 bg-gray-900 text-center text-lg font-inter text-blue-200 flex items-center justify-center">
            <span>Loading...</span>
          </div>
        ) : filteredUsers.length > 0 ? (
          <>
            {/* Desktop/tablet view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-black/50 backdrop-blur-3xl">
                  <tr>
                    <th className="px-6 py-5 text-left text-xs font-medium uppercase tracking-wider">
                      S.No.
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-medium uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-medium uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-medium uppercase tracking-wider">
                      Phone Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, index) => (
                    <tr
                      key={u._id}
                      className={index % 2 === 0 ? "bg-richblue-700/30" : "bg-black/15"}
                    >
                      <td className="px-6 py-4 text-sm text-gray-500 w-16">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium flex items-center gap-4">
                          <Image           
                            width={100}
                            height={100}
                            className="w-12 h-12 object-cover rounded-full object-center"
                            src={u?.image}
                            alt={`${u?.firstName || "User"} avatar`}
                          />
                          <p className="truncate">{(u.firstName || "") + " " + (u.lastName || "")}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-medium">
                        <div className="flex justify-center items-center space-x-2 break-words">
                          {u.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-center text-sm font-medium">
                          {u.phoneNumber || "-"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view: stacked cards */}
            <div className="sm:hidden flex flex-col gap-3 p-3">
              {filteredUsers.map((u, index) => (
                <div
                  key={u._id}
                  className="bg-black/20 rounded-lg p-3 flex items-center gap-4"
                >
                  <div className="shrink-0">
                    <Image
                     
                      width={100}
                      height={100}
                      className="w-12 h-12 object-cover rounded-full"
                      src={u?.image}
                      alt={`${u?.firstName || "User"} avatar`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold truncate">{(u.firstName || "") + " " + (u.lastName || "")}</p>
                      <span className="text-xs text-gray-400">#{index + 1}</span>
                    </div>
                    <div className="text-sm text-gray-300 break-words">{u.email}</div>
                    <div className="text-sm text-gray-300 mt-1">{u.phoneNumber || "-"}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="p-4 text-center">No users</p>
        )}
      </div>
    </div>
  );
};

export default Page;
