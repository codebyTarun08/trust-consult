import React from 'react'

const HighLightText = ({text}) => {

  return (
    <span>
        <p className='text-4xl font-semibold font-inter bg-gradient-to-br from-pink-400 via-red-400 to-red-700 inline-block text-transparent bg-clip-text capitalize'>{text}</p>
    </span>
  )
}

export default HighLightText