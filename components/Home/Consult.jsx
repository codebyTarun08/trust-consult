import React from 'react'
import Image from 'next/image'
import { consultingData } from '@/utils/fields'
import HighLightText from '../HighLightText'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
const Consult = () => {
   return (
      <section className='flex flex-col md:flex-row w-[99%] md:w-11/12 my-20'>
         <div className='w-full md:w-1/2 flex justify-center'>
            <Image src="/HomeImages/consult-home.png" alt="" width={400} height={100} />
         </div>
         <div className='flex flex-col w-full md:w-1/2 gap-y-3 items-center justify-center'>
            <h2 className='text-center lg:text-left mt-5 text-3xl font-crimson'>
               <HighLightText text={"Grow More By Consulting More"} />
            </h2>
            {consultingData.map((item, index) => (
               <div key={index} className="flex flex-col gap-2 rounded-lg shadow-inner border border-gray-700 hover:bg-opacity-70 transition-all duration-300 hover:scale-95 p-5 bg-prime-5/30 bg-opacity-50">
                  <h3 className='font-semibold text-lg text-pink-500'>{item.title}</h3>
                  <span className='flex justify-center gap-2'>
                     <FontAwesomeIcon icon={faCircleCheck} className='text-blue-300 mt-1' />
                     <p className='text-gray-300 text-sm'>{item.description}</p>
                  </span>
               </div>
            ))}
         </div>
      </section>
   )
}

export default Consult
        // <section className='flex flex-row w-11/12 my-20'>

        //     <div className='tab2 flex flex-col w-1/2 gap-y-3'>
        //      <h2 className='font- mt-5 text-3xl font-crimson'>
        //       <HighLightText text={"Grow More By Consulting More"} />
        //     </h2>
        //      <p className='font-semibold text-lg'>Unlock Expertise, Accelerate Progress</p>
        //      <p>Stop guessing and start growing—get personalized advice from verified consultants in business, tech, health, and more.</p>
        //      <p className='font-semibold text-lg'>Smarter Decisions, Faster Results</p>
        //      <p>Whether you're launching a startup or shaping your career, the right guidance makes all the difference.</p>
        //      <p className='font-semibold text-lg'>Every Session, A Step Forward</p>
        //      <p>Book sessions with top consultants, gain clarity, and turn your goals into results—one conversation at a time.</p>
        //   </div>
        // </section>