"use client"
import React, {useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import DropDownMenu from './DropDownMenu'
import { CiLogin } from "react-icons/ci";
import { FaUserPlus } from 'react-icons/fa'
import { FaCalendarCheck } from 'react-icons/fa'
import { IoBookOutline } from "react-icons/io5"
const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [show, setShow] = useState(false); // avatar dropdown
  const [menuOpen, setMenuOpen] = useState(false); // mobile nav

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-prime-5 text-gray-400 font-inter font-light border-b-[1px] border-richblack-100/50 backdrop-blur-3xl">
      <nav className="flex items-center justify-between w-11/12 max-w-maxContent py-3 mx-auto">
        <Link href="/" className="flex items-center">
          <Image
            src="https://res.cloudinary.com/drqabv2wq/image/upload/v1763268627/Trustconsult-logo-new-2_kja9lt.png"
            alt="Logo"
            width={160}
            height={40}
            priority
            style={{ height: "auto", width: "auto" }}
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          <Link href="/">
            <li className="hover:text-white transition">Home</li>
          </Link>
          <Link href="/about">
            <li className="hover:text-white transition">About</li>
          </Link>
          <Link href="/contact">
            <li className="hover:text-white transition">Contact Us</li>
          </Link>
          <Link href="/book">
            <li className="text-xl flex items-center justify-center text-cyan-300 font-inter font-semibold rounded-md py-1 px-2 bg-richblack-800 border-b-[1px] border-b-richblack-400/60 shadow-md shadow-cyan-100/40 hover:scale-95 transition-all duration-200">
              <FaCalendarCheck className="text-sm inline mr-2" />
              <span>Book Now</span>
            </li>
          </Link>

        </ul>

        {/* Right side */}
        <div className="flex items-center gap-x-4">
          {/* Desktop auth / avatar */}
          <div className="hidden md:flex items-center gap-x-4">
            {!token && (
              <>
                <Link href="/auth/login">
                  <button className=" cursor-pointer px-4 py-2 flex items-center justify-center bg-cyan-400/40 rounded-md text-white font-bold border-b-[1px] border-b-slate-700 active:scale-95 transition-all duration-200">
                    <CiLogin className="inline mr-2" />
                    <span>Login</span>
                  </button>
                </Link>

                <Link href="/auth/signup">
                  <button className="cursor-pointer px-4 py-2 flex items-center justify-center bg-cyan-400/40 rounded-md text-white font-bold border-b-[1px] border-b-slate-700 active:scale-95 transition-all duration-200">
                    <FaUserPlus className="inline mr-2" />
                    <span>Signup</span>
                  </button>
                </Link>
              </>
            )}

            {token && (
              <div className="flex items-center gap-x-4">
                {user?.role !== "Admin" && (
                  <Link href="/bookings">
                    <button className="px-4 py-2 cursor-pointer bg-cyan-400/40 rounded-md text-white font-bold border-b-[1px] border-b-slate-700 active:scale-95 transition-all duration-200">
                      <IoBookOutline className="inline mr-2" />
                      {user?.role === "Client" ? "My Requests" : "My Bookings"}
                    </button>
                  </Link>
                )}

                <div className="relative">
                  <button
                    aria-label="User menu"
                    onClick={() => setShow((s) => !s)}
                    className="rounded-full overflow-hidden w-10 h-10 border-4 border-green-100/20 shadow-lg"
                  >
                    <Image
                      //unoptimized
                      width={100}
                      height={100}
                      src={user?.image}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {show && (
                    <div className="absolute right-0 mt-2 w-58 bg-richblack-800 text-white rounded-md shadow-lg">
                      <DropDownMenu setShow={setShow} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md focus:outline-none"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((s) => !s)}
          >
            <svg
              className="w-6 h-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="fixed inset-x-0 top-[64px] bg-prime-5/95 backdrop-blur-sm md:hidden z-40 shadow-md">
            <div className="flex flex-col gap-4 p-4">
              <Link href="/">
                <button onClick={() => setMenuOpen(false)} className="text-left">Home</button>
              </Link>
              <Link href="/about">
                <button onClick={() => setMenuOpen(false)} className="text-left">About</button>
              </Link>
              <Link href="/contact">
                <button onClick={() => setMenuOpen(false)} className="text-left">Contact Us</button>
              </Link>
              <Link href="/book">
                <button onClick={() => setMenuOpen(false)} className="text-left flex items-center justify-center text-cyan-300 font-semibold"><FaCalendarCheck className="inline mr-2" />Book Now</button>
              </Link>

              {!token ? (
                <div className="flex gap-2 mt-2">
                  <Link href="/auth/login">
                    <button onClick={() => setMenuOpen(false)} className="w-full flex items-center justify-center text-center px-4 py-2 bg-cyan-400/40 rounded-md text-white font-bold">
                      <CiLogin className="inline mr-2" />
                      Login
                    </button>
                  </Link>
                  <Link href="/auth/signup">
                    <button onClick={() => setMenuOpen(false)} className="w-full flex items-center justify-center px-4 py-2 bg-cyan-400/40 rounded-md text-white font-bold">
                      <FaUserPlus className="inline mr-2" />
                      Signup
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex justify-between gap-2 mt-2">
                  {user?.role !== "Admin" && (
                    <Link href="/bookings">
                      <button onClick={() => setMenuOpen(false)} className="w-full cursor-pointer px-4 py-2 bg-cyan-400/40 rounded-md text-white font-bold">
                        <IoBookOutline className="inline mr-2" />
                        {user?.role === "Client" ? "My Requests" : "My Bookings"}
                      </button>
                    </Link>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    <Image width={100} height={100} src={user?.image} alt="User Avatar" className="w-10 h-10 object-cover rounded-full" />
                    <div>
                      <div className="text-white font-medium">{user?.firstName + " " + user?.lastName || "User"}</div>
                      <button
                        className="cursor-pointer text-sm text-cyan-200"
                        // onClick={() => {
                        //   setMenuOpen(false);
                        //   setShow(true);
                        // }
                        onClick={()=>(window.location.href="/dashboard/profile"  )}
                      >
                        My Account
                      </button>
                    </div>
                  </div>
                  {/* inline dropdown for mobile */}
                  {show && (
                    <div className="mt-2">
                      <DropDownMenu setShow={(val) => { setShow(val); setMenuOpen(false); }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar