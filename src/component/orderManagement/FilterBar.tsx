import React from "react";

import { FaFilter, FaRedo } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";

function FilterBar() {
  return (
    <div className="w-full flex items-center justify-between gap-4">
      
      {/* Left Side Filters */}
      <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
        
        {/* Filter Icon */}
        <div className="px-4 py-3 border-r border-gray-300 flex items-center gap-2 text-gray-600">
          <FaFilter />
        </div>

        
        {/* Filter Icon */}
        <div className="px-4 py-3 border-r border-gray-300 flex items-center gap-2 text-gray-600">
          <span className="font-medium">Filter By</span>
        </div>

        {/* Status */}
        <div className="px-6 py-3 border-r border-gray-300 flex items-center gap-2 cursor-pointer hover:bg-gray-50">
          <span>Status</span>
          <FiChevronDown />
        </div>

        {/* Date */}
        <div className="px-6 py-3 border-r border-gray-300 flex items-center gap-2 cursor-pointer hover:bg-gray-50">
          <span>Date</span>
          <FiChevronDown />
        </div>

        {/* Customer */}
        <div className="px-6 py-3 border-r border-gray-300 flex items-center gap-2 cursor-pointer hover:bg-gray-50">
          <span>Customer</span>
          <FiChevronDown />
        </div>

        {/* Reset Filter */}
        <div className="px-6 py-3 flex items-center gap-2 text-blue-500 cursor-pointer hover:bg-gray-50">
          <FaRedo className="text-sm" />
          <span>Reset Filter</span>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative w-[280px]">
        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search here..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

    </div>
  );
}

export default FilterBar;