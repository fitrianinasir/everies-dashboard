import React from 'react'

const Navbar = () => {
  return (
    <div className='flex flex-row justify-end'>
      <div className="flex items-center">
        <img src="/images/profile.jpg" alt="" className='w-[30px] h-[30px] rounded-full'/>
        <span className='text-sm ml-2'>Fitriani Nasir</span>
      </div>
    </div>
  )
}

export default Navbar