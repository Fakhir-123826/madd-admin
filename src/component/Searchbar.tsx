import React from 'react'
import { FaFilter, FaRedo, FaSearch } from 'react-icons/fa'

const Searchbar = () => {
    return (
        <div>
            {/* FILTER BAR */}
            <div className="flex items-center overflow-hidden h-[52px] py-10">

                <div className="flex items-center bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-[52px] w-[60%]">

                    {/* ICON */}
                    <div className="px-5 flex items-center border-r border-gray-200 text-gray-600">
                        <FaFilter />
                    </div>

                    {/* FILTER BY */}
                    <div className="px-5 flex items-center border-r border-gray-200 text-sm font-medium text-gray-700">
                        Filter By
                    </div>

                    {/* STATUS */}
                    <div className="relative border-r border-gray-200">
                        <select className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700">
                            <option>Status</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            ▾
                        </span>
                    </div>

                    {/* LOCATION */}
                    <div className="relative border-r border-gray-200">
                        <select className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700">
                            <option>Location</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            ▾
                        </span>
                    </div>

                    {/* PICKUP */}
                    <div className="relative border-r border-gray-200">
                        <select className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700">
                            <option>Pickup</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            ▾
                        </span>
                    </div>

                    {/* RESET */}
                    <button className="px-5 flex items-center gap-2 text-sm text-blue-500 hover:underline">
                        <FaRedo className="text-xs" />
                        Reset Filter
                    </button>
                </div>

                <div className="ml-auto relative mr-2">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
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



        </div>
    )
}

export default Searchbar