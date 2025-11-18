// "use client"
// import React from 'react'
// import { SidebarLinks } from '@/utils/SidebarLinks'
// import SidebarLink from './SidebarLink'
// import { useDispatch, useSelector } from 'react-redux'
// import { logout } from '@/app/redux/slices/authSlice'
// const Sidebar = () => {
//   const dispatch = useDispatch();
//   const {user} = useSelector((state)=>(state.profile));
//   const [open, setOpen] = React.useState(false);

//   // close sidebar on larger screens
//   React.useEffect(() => {
//     const onResize = () => {
//       if (window.innerWidth >= 768) setOpen(false);
//     };
//     window.addEventListener('resize', onResize);
//     return () => window.removeEventListener('resize', onResize);
//   }, []);

//   return (
//     <>
//       {/* Mobile toggle button */}
//       <button
//         className="md:hidden fixed top-24 left-4 z-50 p-2 bg-white rounded-md shadow hover:opacity-90"
//         aria-label="Open sidebar"
//         onClick={() => setOpen(true)}
//       >
//         <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       </button>

//       {/* Overlay (mobile) */}
//       <div
//         className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
//         onClick={() => setOpen(false)}
//       />

//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 z-50 h-full w-64 md:w-56 sm:w-full bg-prime-5 overflow-y-auto transition-transform duration-300
//                     ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:h-screen`}
//       >
//         <div className="py-10 px-4 sm:px-2">
//           {/* Close button shown inside drawer on mobile */}
//           <div className="md:hidden mb-4 flex justify-end">
//             <button
//               className="p-2 rounded bg-white/80 hover:bg-white"
//               aria-label="Close sidebar"
//               onClick={() => setOpen(false)}
//             >
//               <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {SidebarLinks.map((link, index) => {
//             if (link.role && user?.role !== link.role) return null;
//             return (
//               <div key={index} onClick={() => setOpen(false)}>
//                 <SidebarLink link={link.href} label={link.label} icon={link.icon} />
//               </div>
//             );
//           })}
//         </div>

//         <div className="h-[1px] bg-gray-500 w-3/4 mx-auto" />

//         <button
//           className="cursor-pointer mx-auto text-white px-6 sm:px-4 py-2 rounded-md bg-blue-200 mt-5 hover:bg-red-500 block transition-all duration-200 text-sm sm:text-xs"
//           onClick={() => {
//             dispatch(logout());
//             setOpen(false);
//           }}
//         >
//           Logout
//         </button>

//         <div className="text-gray-400 text-xs sm:text-[10px] text-center mt-5 px-2">&copy; 2025 TrustConsult</div>
//       </aside>
//     </>
//   )
// }

// export default Sidebar


"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/app/redux/slices/authSlice';
import { SidebarLinks } from '@/utils/SidebarLinks';
import SidebarLink from './SidebarLink'; // Assuming this component exists

// --- Constants for better readability ---
// Consider moving these to a separate config/style file if used across multiple components
const SIDEBAR_WIDTH = 'w-64 md:w-56';
const DESKTOP_BREAKPOINT = 768; // Tailwind's 'md' breakpoint

const Sidebar = () => {
  const dispatch = useDispatch();
  // Using destructuring and optional chaining for safer access
  const userRole = useSelector((state) => state.profile?.user?.role);
  const [isOpen, setIsOpen] = useState(false);

  // --- Effect to handle window resize for desktop view ---
  useEffect(() => {
    const onResize = () => {
      // Close sidebar/drawer if screen size becomes desktop
      if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    // Closes the drawer when a link is clicked (important for mobile UX)
    setIsOpen(false);
  };

  return (
    <>
      {/* 1. Mobile Open Toggle Button */}
      {/* Positioned outside the sidebar, visible only on mobile */}
      <button
        className="fixed top-22 left-4 z-40 p-2 bg-black rounded-lg shadow-lg hover:shadow-xl transition-all md:hidden"
        aria-label="Toggle sidebar menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        {/* Hamburger Icon */}
        <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* 2. Overlay (Mobile Drawer Background) */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden 
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`
        }
        aria-hidden="true" // Hide from screen readers when invisible
        onClick={() => setIsOpen(false)}
      />

      {/* 3. Sidebar Main Content */}
      <aside
        className={`fixed top-0 left-0 h-full bg-prime-5 overflow-y-auto z-50 transition-transform duration-300
          ${SIDEBAR_WIDTH}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:static md:min-h-screen md:translate-x-0 md:-z-0` // Static on desktop, full height
        }
      >
        <div className="py-8 px-4 flex flex-col h-full">
          {/* Close Button - visible ONLY inside the drawer on mobile */}
          <div className="md:hidden mb-6 flex justify-end">
            <button
              className="p-2 rounded-full bg-pink-900/80 hover:bg-pink-950 text-red-300 transition-colors"
              aria-label="Close sidebar menu"
              onClick={() => setIsOpen(false)}
            >
              {/* X Icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links Section */}
          <nav className="flex-grow space-y-2">
            {SidebarLinks.map((link, index) => {
              // Conditionally render links based on user role
              if (link.role && userRole !== link.role) return null;
              
              return (
                <div key={index} onClick={handleLinkClick}>
                  {/* Assuming SidebarLink handles active state and routing */}
                  <SidebarLink link={link.href} label={link.label} icon={link.icon} />
                </div>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="my-6">
            <div className="h-[1px] bg-gray-600 w-full mx-auto" />
          </div>

          {/* Logout Button */}
          <button
            className="w-full text-white px-6 py-2 rounded-lg bg-blue-600 font-medium mt-4 hover:bg-red-600 transition-all duration-200 text-sm shadow-md"
            onClick={handleLogout}
          >
            Logout
          </button>

          {/* Footer/Copyright */}
          <div className="text-gray-400 text-xs text-center mt-6 pt-2">
            &copy; 2025 TrustConsult
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;