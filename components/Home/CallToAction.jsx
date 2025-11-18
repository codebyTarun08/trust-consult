// import React from 'react';

// // Data object for the call-to-action content.
// const ctaData = {
//     title: 'Ready to Get Started?',
//     subtitle: 'Join thousands of users getting expert help, fast.',
//     mainMessage: 'Start Your Journey With Us, Become A Consultant!',
//     buttons: [
//         {
//             text: 'Join As Consultant',
//             link: '/signup',
//             isPrimary: true,
//         },
//         {
//             text: 'Login Now',
//             link: '/login',
//             isPrimary: false,
//         },
//     ],
// };

// const CallToAction = () => {
//     return (
//         <section className='container mx-auto px-4 py-20 text-center'>
//             <div className='flex flex-col items-center max-w-4xl mx-auto'>
//                 <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 font-sans'>
//                     <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600">
//                         {ctaData.title}
//                     </span>
//                 </h1>
//                 <div className='flex gap-5 flex-row-reverse'>
//                     {/* Image Section - Using a placeholder for demonstration */}
//                     <div className='w-full max-w-xl mx-auto mb-10 w-2/3'>
//                         <img
//                             src="/HomeImages/explaining-data-whiteboard.jpg"
//                             alt="Consultant Team"
//                             className='rounded-2xl shadow-xl w-full h-auto'
//                         />
//                     </div>

//                     {/* Buttons Section - Dynamically rendered */}
//                     <div className='flex flex-col gap-4 justify-center'>
//                         <p className='text-lg md:text-xl text-gray-700 mb-2'>{ctaData.subtitle}</p>
//                         <p className='text-xl md:text-2xl font-bold text-blue-600 mb-8'>{ctaData.mainMessage}</p>
//                         {ctaData.buttons.map((button, index) => (
//                             <button
//                                 key={index}
//                                 href={button.link}
//                                 className={`
//                                     rounded-full font-semibold transition-all duration-300 transform hover:scale-105
//                                     ${button.isPrimary
//                                         ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
//                                         : 'bg-white text-blue-600 border border-blue-600 shadow-md hover:bg-gray-100'
//                                     }
//                                 `}
//                             >
//                                 {button.text}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default CallToAction;


"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Data object for the call-to-action content.
const ctaData = {
    title: 'Ready to Get Started?',
    subtitle: 'Join thousands of users getting expert help, fast.',
    mainMessage: 'Start Your Journey With Us, Become A Consultant!',
    buttons: [
        {
            text: 'Join As Consultant',
            link: '/auth/signup',
            isPrimary: true,
        },
        {
            text: 'Login Now',
            link: '/auth/login',
            isPrimary: false,
        },
    ],
    features: [
        {
            title: "Expertise at Your Fingertips",
            description: "Access a wide network of verified professionals across various industries.",
            icon: "M13 10.748V3a1 1 0 011-1h1a1 1 0 011 1v7.748l2.257-1.393a1 1 0 011.168.125l.89.89a1 1 0 01.125 1.168L18 16a1 1 0 01-1 1h-2a1 1 0 01-1-1v-4.748l-2.257 1.393a1 1 0 01-1.168-.125l-.89-.89a1 1 0 01-.125-1.168L13 10.748z"
        },
        {
            title: "Secure and Transparent",
            description: "Our platform ensures secure transactions and clear communication every step of the way.",
            icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        },
        {
            title: "Flexible Scheduling",
            description: "Easily book appointments that fit your schedule, from anywhere in the world.",
            icon: "M10 18a8 8 0 100-16 8 8 0 000 16z"
        }
    ]
};

const CallToAction = () => {
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    };

    return (
        <section className='container mx-auto md:px-4 py-20 text-center text-gray-200'>
            <motion.div
                className='flex flex-col items-center max-w-6xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-richblack-800 via-richblue-700 to-gray-900 shadow-2xl border border-gray-700'
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.h1
                    className='text-xl md:text-2xl lg:text-4xl font-extrabold mb-4 font-sans leading-tight'
                    variants={itemVariants}
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-pink-800">
                        {ctaData.title}
                    </span>
                </motion.h1>

                <div className='flex flex-col-reverse lg:flex-row items-center justify-between gap-12 my-10'>
                    {/* Content Section */}
                    <div className='flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2'>
                        <motion.p
                            className='md:text-lg text-gray-400 mb-4'
                            variants={itemVariants}
                        >
                            {ctaData.subtitle}
                        </motion.p>
                        <motion.p
                            className='text-xl md:text-xl font-bold text-blue-400 mb-8'
                            variants={itemVariants}
                        >
                            {ctaData.mainMessage}
                        </motion.p>

                        {/* Buttons Section */}
                        <motion.div
                            className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full'
                            variants={itemVariants}
                        >
                            {ctaData.buttons.map((button, index) => (
                                <a
                                    key={index}
                                    href={button.link}
                                    className={`
                                        w-full sm:w-auto text-center px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105
                                        ${button.isPrimary
                                            ? 'bg-pink-500/60 border-pink-500 shadow-lg hover:bg-pink-600'
                                            : 'bg-pink-200 text-pink-500 border border-pink-500 shadow-md hover:'
                                        }
                                    `}
                                >
                                    {button.text}
                                </a>
                            ))}
                        </motion.div>
                    </div>

                    {/* Image Section */}
                    <motion.div
                        className='w-full lg:w-1/2 flex justify-center'
                        variants={imageVariants}
                    >
                        <Image
                            unoptimized
                            width={100}
                            height={100}
                            src={"/HomeImages/explaining-data-whiteboard.jpg"||"https://placehold.co/600x400/374151/9CA3AF?text=Consultant+Team"}
                            alt="Consultant Team"
                            className='rounded-3xl shadow-2xl w-full h-auto'
                        />
                    </motion.div>
                </div>
                
                {/* New Features Section */}
                <div className="mt-16 w-full">
                    <h2 className="text-3xl font-bold text-gray-200 mb-8">Why TrustConsult?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {ctaData.features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-prime-5/30 p-6 rounded-xl border border-gray-600 shadow-md text-center"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 mx-auto mb-4 text-green-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={feature.icon}
                                    />
                                </svg>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default CallToAction;
