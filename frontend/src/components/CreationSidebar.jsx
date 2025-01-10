import React from 'react'
import { Link } from 'react-router-dom'
import { FaUsers,FaUserSecret } from "react-icons/fa6";
import { GiFarmer } from "react-icons/gi";
import { FaCodeBranch, FaCloudUploadAlt } from "react-icons/fa";


function CreationSidebar() {
  return (
    <div className=' text-sm'>
      
      <div className='flex flex-col gap-2'>
        <span className='hidden lg:block my-2 text-gray-900 font-bold'>Creation</span>
        <Link to='/creation/users' className='flex items-center justify-center lg:justify-start gap-4 text-gray-200 py-2 md:px-2 rounded-md hover:bg-slate-300 hover:text-black'>
       <FaUsers className='w-7 h-7' />
        <span className='hidden lg:block '>Users</span>
        </Link>

        <Link to='/creation/branches' className='flex items-center justify-center lg:justify-start gap-4 text-gray-200 py-2 md:px-2 rounded-md hover:bg-slate-300 hover:text-black'>
       <FaCodeBranch className='w-7 h-7' />
        <span className='hidden lg:block '>Branches</span>
        </Link>
        <Link to='/creation/managers' className='flex items-center justify-center lg:justify-start gap-4 text-gray-200 py-2 md:px-2 rounded-md hover:bg-slate-300 hover:text-black'>
       <FaUserSecret className='w-7 h-7' />
        <span className='hidden lg:block '>Managers</span>
        </Link>
        <Link to='/creation/customers' className='flex items-center justify-center lg:justify-start gap-4 text-gray-200 py-2 md:px-2 rounded-md hover:bg-slate-300 hover:text-black'>
       <GiFarmer className='w-7 h-7' />
        <span className='hidden lg:block '>Customers</span>
        </Link>
        <Link to='/creation/bulk-upload' className='flex items-center justify-center lg:justify-start gap-4 text-gray-200 py-2 md:px-2 rounded-md hover:bg-slate-300 hover:text-black'>
       <FaCloudUploadAlt className='w-7 h-7' />
        <span className='hidden lg:block '>Bulk Upload</span>
        </Link>

      </div>
    </div>
  )
}

export default CreationSidebar