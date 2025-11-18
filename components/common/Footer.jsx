import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className='bg-prime-5 text-gray-300 py-12 px-4 font-inter border-t-orange-100/20 border-t-2'>
            <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 '>
                {/* Logo and Socials Section */}
                <div className='flex flex-col items-center md:items-start md:border-r md:border-r-gray-700 md:pr-10'>
                <Image
                    src="https://res.cloudinary.com/drqabv2wq/image/upload/v1763268627/Trustconsult-logo-new-2_kja9lt.png"
                    alt="Logo"
                    width={160}
                    height={40}
                    priority
                    style={{ height: "auto", width: "auto" }}
                />
                    <div className='flex space-x-6'>
                        <a href="#" aria-label="Facebook" className='hover:text-white transition-colors duration-300'>
                            <FaFacebook size={24} />
                        </a>
                        <a href="#" aria-label="Instagram" className='hover:text-white transition-colors duration-300'>
                            <FaInstagram size={24} />
                        </a>
                        <a href="#" aria-label="YouTube" className='hover:text-white transition-colors duration-300'>
                            <FaYoutube size={24} />
                        </a>
                    </div>
                </div>

                {/* Main Links Section */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto'>
                    {/* Contacts Column */}
                    <div>
                        <h4 className='font-semibold text-white mb-4 uppercase tracking-wide'>Contacts</h4>
                        <ul className='space-y-2 text-sm'>
                            <li>Address: 123 Street, City, Country</li>
                            <li>Phone: +1 (123) 456-7890</li>
                            <li>Email: contact@example.com</li>
                            <li>Hours: Mon-Fri, 9am-5pm</li>
                        </ul>
                    </div>

                    {/* Categories Column */}
                    <div>
                        <h4 className='font-semibold text-white mb-4 uppercase tracking-wide'>Categories</h4>
                        <ul className='space-y-2 text-sm'>
                            <li className='hover:text-white transition-colors duration-300 cursor-pointer'>Tech & IT</li>
                            <li className='hover:text-white transition-colors duration-300 cursor-pointer'>Finance</li>
                            <li className='hover:text-white transition-colors duration-300 cursor-pointer'>Career</li>
                            <li className='hover:text-white transition-colors duration-300 cursor-pointer'>Healthcare</li>
                            <li className='hover:text-white transition-colors duration-300 cursor-pointer'>Laws</li>
                        </ul>
                    </div>

                    {/* About/Additional Links Column */}
                    <div>
                        <h4 className='font-semibold text-white mb-4 uppercase tracking-wide'>Company</h4>
                        <ul className='space-y-2 text-sm'>
                            <li className='hover:text-white transition-colors duration-300 cursor-pointer'>About Us</li>
                            <li className='hover:text-white transition-colors duration-300 cursor-pointer'>Privacy Policy</li>
                            <li className='hover:text-white transition-colors duration-300 cursor-pointer'>Terms of Service</li>
                            <li className='hover:text-white transition-colors duration-300 cursor-pointer'>Blog</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className='max-w-7xl mx-auto border-t border-t-gray-700 mt-8 pt-6 text-center text-sm text-gray-500'>
                © {new Date().getFullYear()} TrustConsult. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;