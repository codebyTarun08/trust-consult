import React from 'react'
import { fieldData } from '@/utils/fields'
const Category = () => {
    return (
        <section className='flex justify-center w-full md:px-4'>
            <div className='w-full border border-gray-700 max-w-6xl p-10 rounded-xl shadow-2xl bg-gradient-to-br from-richblue-800 to-gray-800 text-white'>
                <h1 className='text-3xl sm:text-4xl font-bold text-center mb-12'>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-200">
                        Our Professional Consultant Categories
                    </span>
                </h1>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {fieldData.map((field) => (
                        <div key={field.id} className='bg-prime-5/30 text-[15px] bg-opacity-50 p-6 rounded-lg shadow-inner border border-gray-700 hover:bg-opacity-70 transition-all duration-300 hover:scale-95'>
                            <div className='flex items-center space-x-4 mb-4'>
                                <h2 className='text-xl font-semibold text-blue-50'>{field.title}</h2>
                            </div>
                            <p className='text-gray-400'>{field.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Category