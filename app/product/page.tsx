import React from 'react'
import Sidebar from '../components/sidebar/sidebar'

const Product = () => {
  return (
    <div className="flex">
      <div className="w-1/5 h-screen">
        <Sidebar activate={"product"}/>
      </div>
      <div className="w-full h-screen p-5">
        Product
      </div>
    </div>
  )
}

export default Product