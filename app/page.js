"use client";
import React from "react";
import { motion } from "framer-motion";
import HighLightText from "@/components/HighLightText";
import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import Image from "next/image";
import Category from "@/components/Home/Category";
import Consult from "@/components/Home/Consult";
import CallToAction from "@/components/Home/CallToAction";
import Footer from "@/components/common/Footer";

const Home = () => {
  // Variants for animations
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <>
      <div className="font-inter text-white flex justify-center bg-gray-900 scroll-smooth">
        <div className="w-11/12 max-w-maxContent flex justify-center items-center flex-col mt-10 md:mt-20 relative px-4 md:px-0">
          <div className="rounded-full shadow-circle2 flex items-center justify-center absolute left-5 top-60 -z-10 opacity-70"></div>

          {/* Hero Section */}
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col md:flex-row w-full gap-8 md:gap-0 relative my-10 md:my-20"
          >
            {/* Left Content */}
            <motion.div
              variants={fadeUp}
              className="tab1 flex flex-col w-full md:w-1/2 gap-y-3 md:gap-y-5"
            >
              <h1 className="text-center lg:text-left text-2xl md:text-3xl lg:text-4xl font-crimson font-bold bg-gradient-to-r from-[#FF5FA2] via-[#FF4F81] to-[#FCA14B] text-transparent bg-clip-text">
                Find the Right Consultant in Minutes
              </h1>

              <p className="text-center lg:text-left font-crimson font-semibold w-full md:w-3/5 my-5 md:my-10 text-pink text-sm md:text-base">
                From legal advice to career coaching, book trusted experts in just
                a few clicks
              </p>
              <div className="flex sm:flex-row gap-4 justify-center items-center lg:justify-start">
                <motion.div whileHover={{ scale: 0.95 }}>
                  <CTAButton
                    text={"Browse Consultants"}
                    flag={true}
                    linkto={"/book"}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 0.95 }}>
                  <CTAButton
                    text={"Book An Appointment"}
                    flag={false}
                    linkto={"/book"}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              variants={fadeUp}
              className="w-full md:w-1/2 flex justify-center tab2"
            >
              <Image
                src="/HomeImages/2nd.png"
                width={400}
                height={100}
                alt="Consultant"
                className="w-full max-w-sm md:max-w-none"
              />
            </motion.div>
          </motion.section>

          <div className="rounded-full shadow-circle1 flex items-center justify-center absolute top-[650px] -z-10 opacity-70"></div>

          {/* CTA Button */}
          <Link href="/book">
            <motion.button
              whileHover={{ scale: 0.95, boxShadow: "0px 4px 20px rgba(255,0,0,0.4)" }}
              transition={{ duration: 0.2 }}
              className="w-48 md:w-52 h-12 md:h-14 bg-gradient-to-tr bg-cyan-400/40 font-inter text-white rounded-full border-b-2 border-b-red-300 my-5 md:my-10 cursor-pointer text-sm md:text-base"
            >
              Book Appointment
            </motion.button>
          </Link>

          {/* Video Section */}
          <motion.video
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            src="/banner.mp4"
            className="w-full md:w-4/5 shadow-[20px_20px_30px_10px_rgba(66,170,245,0.3)] rounded-xl"
            muted
            autoPlay
            loop
          ></motion.video>

          {/* Consult Section */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="w-full"
          >
            <Consult />
          </motion.div>

          {/* Category Section */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="w-full"
          >
            <Category />
          </motion.div>

          {/* Optional Call to Action */}
          <CallToAction />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
