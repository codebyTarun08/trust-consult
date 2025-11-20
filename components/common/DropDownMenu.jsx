
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { logout } from '@/app/redux/slices/authSlice'
import { useSelector,useDispatch } from 'react-redux'
import Image from 'next/image';
// The following imports are ignored for this component as per your request.
// import { logout } from '@/app/redux/slices/authSlice';
// import { useSelector, useDispatch } from 'react-redux';
// The `next/link` import has been removed to fix the compilation error.

const DropDownMenu = ({ setShow }) => {
  // Use a ref to reference the dropdown element
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.profile);
  // Mocking the Redux state and dispatch for demonstration
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.1, delay: 0.1 } },
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    }

    // Add event listener for clicks outside the dropdown
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShow]); // Re-run effect if setShow changes

  return (
    <motion.div
      ref={dropdownRef} // Attach the ref to the root element of the dropdown
      className='absolute right-0 top-0 w-full mt-2 h-fit p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden'
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <div className='flex flex-col items-center justify-center p-2 mb-4'>
        <Image
          width={100}
          height={100}
          className='w-24 h-24 object-cover rounded-full border-4 border-purple-500/50 shadow-lg object-center transform transition-transform duration-300 hover:scale-105'
          src={user?.image}
          alt={`${user?.firstName}`}
        />
        <p className='text-2xl flex gap-2 text-white font-bold mt-4'>
           <span>Hello</span>
           <span className='bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600'>{user?.firstName}!</span>
        </p>
      </div>

      <motion.ul
        className='flex flex-col p-2 text-gray-300'
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <li className='p-3 my-1 hover:bg-gray-700 rounded-md transition-colors duration-200 cursor-pointer'>
          {/* Using a standard anchor tag as Link is not available in this environment */}
          <a href='/dashboard/profile'>
            Dashboard
          </a>
        </li>
        <li
          onClick={()=>dispatch(logout())}
          className='p-3 my-1 hover:bg-gray-700 rounded-md transition-colors duration-200 cursor-pointer'
        >
          Logout
        </li>
      </motion.ul>
    </motion.div>
  );
};

export default DropDownMenu;
