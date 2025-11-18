// "use client"
// import React from 'react'
// import { motion } from 'framer-motion';
// const page = () => {
//  return (
//     <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 py-12">
//       {/* Container */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="max-w-4xl bg-richblack-700 shadow-lg rounded-2xl p-10"
//       >
//         {/* Heading */}
//         <h1 className="text-4xl font-bold text-center text-gray-600 mb-6">
//           About <span className="text-blue-200">TrustConsult</span>
//         </h1>
//         <p className="text-center text-gray-400 text-lg mb-10">
//           Building trust between consultants and clients through secure
//           technology.
//         </p>

//         {/* Mission & Vision */}
//         <div className="grid md:grid-cols-2 gap-8 mb-12">
//           <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
//             <h2 className="text-2xl font-semibold text-gray-400 mb-3">
//               Our Mission
//             </h2>
//             <p className="text-gray-400 leading-relaxed">
//               To provide a transparent and secure platform where clients can
//               connect with consultants with confidence. We focus on trust,
//               security, and seamless collaboration.
//             </p>
//           </div>
//           <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
//             <h2 className="text-2xl font-semibold text-gray-400 mb-3">
//               Our Vision
//             </h2>
//             <p className="text-gray-400 leading-relaxed">
//               To revolutionize how consultancy services are delivered online by
//               ensuring authenticity, accountability, and user satisfaction.
//             </p>
//           </div>
//         </div>

//         {/* Values */}
//         <div>
//           <h2 className="text-2xl font-semibold text-blue-200 text-center mb-6">
//             Our Core Values
//           </h2>
//           <div className="grid md:grid-cols-3 gap-6">
//             {[
//               {
//                 title: "Trust",
//                 desc: "We prioritize honesty and reliability in every interaction.",
//               },
//               {
//                 title: "Innovation",
//                 desc: "We continuously evolve to deliver the best digital experience.",
//               },
//               {
//                 title: "Security",
//                 desc: "We safeguard your data with modern and scalable solutions.",
//               },
//             ].map((value, index) => (
//               <div
//                 key={index}
//                 className="p-6 bg-blue-50 rounded-xl text-center shadow-sm hover:shadow-md transition"
//               >
//                 <h3 className="text-xl font-semibold text-blue-700 mb-2">
//                   {value.title}
//                 </h3>
//                 <p className="text-gray-800">{value.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Footer */}
//         <p className="text-center text-gray-400 text-sm mt-12">
//           &copy; {new Date().getFullYear()} TrustConsult. All rights reserved.
//         </p>
//       </motion.div>
//     </div>
//   );
// }

// export default page


"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/common/Footer';
import Image from 'next/image';
const page = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-20 px-4 md:px-8 overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-5xl mx-auto mb-20"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          About <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">TrustConsult</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light mb-8 max-w-3xl mx-auto">
          We are dedicated to building a transparent and secure bridge between clients and consultants.
        </p>
        <div className="flex justify-center items-center gap-4">
          <a href="#" className="inline-block bg-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-purple-700 transition-transform duration-300 transform hover:scale-105">
            Get Started
          </a>
          <a href="#" className="inline-block text-purple-400 font-semibold py-3 px-8 rounded-full border border-purple-400 hover:bg-purple-900 transition-colors duration-300">
            Learn More
          </a>
        </div>
      </motion.div>

      {/* Mission & Vision Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="max-w-6xl w-full grid md:grid-cols-2 gap-12 mb-20"
      >
        <div className="bg-gray-950 p-8 rounded-2xl border border-gray-700 shadow-xl transition-transform duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-blue-400 mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            Our mission is to create a secure, transparent platform where clients can confidently find and collaborate with top-tier consultants. We believe that technology should enable trust, not complicate it, and our platform is built on this core principle.
          </p>
        </div>
        <div className="bg-gray-950 p-8 rounded-2xl border border-gray-700 shadow-xl transition-transform duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">Our Vision</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            Our vision is to revolutionize the consultancy industry by setting a new standard for online professional services. We aim to be the go-to platform that ensures authenticity, accountability, and unparalleled user satisfaction for every project.
          </p>
        </div>
      </motion.div>

      {/* Core Values Section */}
      <div className="max-w-6xl w-full mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
          Our Core Values
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Trust",
              desc: "We build our relationships on a foundation of integrity, ensuring every interaction is honest and reliable.",
            },
            {
              title: "Innovation",
              desc: "We continuously evolve, leveraging cutting-edge technology to deliver the most efficient and user-friendly experience.",
            },
            {
              title: "Security",
              desc: "We protect your data with state-of-the-art encryption and robust security protocols, so you can focus on your work.",
            },
            {
              title: "Transparency",
              desc: "Every process, from fee structures to project milestones, is clear and open for all parties.",
            },
            {
              title: "Excellence",
              desc: "We strive for perfection in every aspect, from our platform's performance to our customer support.",
            },
            {
              title: "Empowerment",
              desc: "We empower both consultants and clients to achieve their goals with the best tools and resources.",
            },
          ].map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-gray-950 p-6 rounded-xl border border-gray-700 shadow-lg text-center transition-transform duration-300 hover:scale-105"
            >
              <h3 className="text-xl font-bold text-purple-400 mb-2">{value.title}</h3>
              <p className="text-gray-400 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Team Section */}
      <div className="max-w-6xl w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-500">
          Meet Our Team
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Jane Doe", title: "CEO" },
            { name: "John Smith", title: "CTO" },
            { name: "Emily White", title: "Lead Designer" },
            { name: "Michael Brown", title: "Head of Operations" },
          ].map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-gray-800 p-6 rounded-xl border border-gray-850 hover:scale-95 transition-all duration-700 shadow-lg text-center flex flex-col items-center"
            >
              {/* <img
                src={`https://placehold.co/100x100/374151/9CA3AF?text=${member.name.split(' ').map(n => n[0]).join('')}`}
                alt={member.name}
                className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-gray-800 hover:border-purple-400 transition"
              /> */}
              <Image
                unoptimized
                src={`https://placehold.co/100x100/374151/9CA3AF?text=${member.name.split(' ').map(n => n[0]).join('')}`}
                width={100}
                height={100}
                alt={member.name}
                className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-gray-800 hover:border-purple-400 transition"
              />

              <h3 className="text-xl font-semibold text-white">{member.name}</h3>
              <p className="text-sm text-purple-400 mt-1">{member.title}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
    <Footer/>
    </>
  );
};

export default page;
