"use client"
import React from 'react'
import Link from 'next/link'
import * as Icons from 'react-icons/vsc';
import { usePathname } from 'next/navigation';
const SidebarLink = ({link,label,icon}) => {
  let Icon = Icons[icon];
  const pathName = usePathname();
  let matchRoute = (route)=>(pathName === route);
  return (
    <Link href={link} className={`relative transition-all duration-200 flex items-center px-2 py-3 sm:py-4 my-1 ${matchRoute(link) ? 'bg-blue-500' : ''}`}>
      <span className={`absolute left-0 w-1 sm:w-2 h-full ${matchRoute(link) ? 'bg-blue-200' : 'bg-teal-500'}`}/>
      <span className='flex items-center gap-2 sm:gap-4 ml-3 sm:ml-5'>
        {Icon && <Icon className='text-gray-300 text-lg sm:text-base'/>}
        <span className='text-white text-sm sm:text-base'>{label}</span>
      </span>
    </Link>
  )
}

export default SidebarLink