import React from 'react'
import { FaFilter, FaRedo } from 'react-icons/fa'
import { IoSearch } from 'react-icons/io5'

function FilterBar() {
  return (
    <div className="flex items-center overflow-hidden h-[52px] py-10">
      {/* Left Side Filters */}
      <div className="flex items-center bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-[52px] w-[60%]">
        
        {/* Filter Icon */}
        <div className="px-5 flex items-center border-r border-gray-200 text-gray-600">
          <FaFilter />
        </div>

        {/* Filter By Text */}
        <div className="px-5 flex items-center border-r border-gray-200 text-sm font-medium text-gray-700">
          Filter By
        </div>

        {/* Status Dropdown */}
        <div className="relative border-r border-gray-200">
          <select className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700">
            <option>Status</option>
            <option>Delivered</option>
            <option>Shipped</option>
            <option>Cancelled</option>
            <option>Pending</option>
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            ▾
          </span>
        </div>

        {/* Date Dropdown */}
        <div className="relative border-r border-gray-200">
          <select className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700">
            <option>Date</option>
            <option>Today</option>
            <option>Yesterday</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            ▾
          </span>
        </div>

        {/* Customer Dropdown */}
        <div className="relative border-r border-gray-200">
          <select className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700">
            <option>Customer</option>
            <option>Jhon Smith</option>
            <option>Alice Johnson</option>
            <option>Mike Wilson</option>
            <option>Sarah Brown</option>
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            ▾
          </span>
        </div>

        {/* Reset Filter Button */}
        <button className="px-5 flex items-center gap-2 text-sm text-blue-500 hover:underline">
          <FaRedo className="text-xs" />
          Reset Filter
        </button>
      </div>

      {/* Search Box */}
      <div className="ml-auto relative mr-2">
        <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search here..."
          className="
            w-70
            h-[48px]
            pl-11 pr-4
            text-sm
            border border-gray-200
            rounded-xl
            bg-white
            outline-none
            focus:ring-2 focus:ring-blue-400
            shadow-lg
          "
        />
      </div>
    </div>
  )
}

export default FilterBar