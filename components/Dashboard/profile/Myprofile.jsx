import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
const Myprofile = () => {
  const { user } = useSelector((state) => state.profile);

  return (
    <div className="w-[99%] md:w-11/12 flex flex-col gap-6 p-6  bg-richblack-900/50 rounded-xl shadow-lg border border-gray-200/40 mt-4 font-inter ">
      {/* Header with Title and Edit Button */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 px-5">
        <h1 className="text-2xl font-bold text-blue-200">My Profile</h1>
        <Link
          href="/dashboard/setting"
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Edit
        </Link>
      </div>

      {/* Profile Details Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <Image 
            width={100}
            height={100}
            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-blue-200/60  shadow-lg"
            src={user?.image || 'https://placehold.co/160x160/F3F4F6/9CA3AF?text=User'}
            alt={`${user?.firstName}'s profile picture`}
          />
        </div>

        {/* User Information */}
        <div className="flex flex-col gap-4 text-center md:text-left w-full">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg font-semibold text-blue-400">{user?.firstName} {user?.lastName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg font-semibold text-blue-400">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Contact Number</p>
            <p className="text-lg font-semibold text-blue-400">{user?.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Role</p>
            <p className="text-lg font-semibold text-blue-400">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
