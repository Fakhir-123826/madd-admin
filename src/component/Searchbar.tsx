
// import { FaFilter, FaRedo, FaSearch } from 'react-icons/fa'

// const Searchbar = () => {
//     return (
//         <div>
//             {/* FILTER BAR */}
//             <div className="flex items-center overflow-hidden h-[52px] py-10">

//                 <div className="flex items-center bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-[52px] w-[60%]">

//                     {/* ICON */}
//                     <div className="px-5 flex items-center border-r border-gray-200 text-gray-600">
//                         <FaFilter />
//                     </div>

//                     {/* FILTER BY */}
//                     <div className="px-5 flex items-center border-r border-gray-200 text-sm font-medium text-gray-700">
//                         Filter By
//                     </div>

//                     {/* STATUS */}
//                     <div className="relative border-r border-gray-200">
//                         <select className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700">
//                             <option>Status</option>
//                         </select>
//                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
//                             ▾
//                         </span>
//                     </div>

//                     {/* LOCATION */}
//                     <div className="relative border-r border-gray-200">
//                         <select className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700">
//                             <option>Location</option>
//                         </select>
//                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
//                             ▾
//                         </span>
//                     </div>

//                     {/* PICKUP */}
//                     <div className="relative border-r border-gray-200">
//                         <select className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700">
//                             <option>Pickup</option>
//                         </select>
//                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
//                             ▾
//                         </span>
//                     </div>

//                     {/* RESET */}
//                     <button className="px-5 flex items-center gap-2 text-sm text-blue-500 hover:underline cursor-pointer">
//                         <FaRedo className="text-xs" />
//                         Reset Filter
//                     </button>
//                 </div>

//                 <div className="ml-auto relative mr-2">
//                     <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
//                     <input
//                         placeholder="Search here..."
//                         className="
//                         w-70
//                         h-[48px]
//                         pl-11 pr-4
//                         text-sm
//                         border border-gray-200
//                         rounded-xl
//                         bg-white
//                         outline-none
//                         focus:ring-2 focus:ring-blue-400
//                         shadow-lg
//                         "
//                     />
//                 </div>
//             </div>



//         </div>
//     )
// }

// export default Searchbar





import { FaSearch } from "react-icons/fa";
import { FiFilter, FiRefreshCw } from "react-icons/fi";

const Searchbar = () => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <FiFilter className="text-gray-500 text-lg" />
        <h3 className="text-lg font-semibold text-gray-800">
          Filters
        </h3>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>

          <div className="flex items-center px-3 border border-gray-300 rounded-lg bg-white">
            <FaSearch className="text-gray-400 text-sm" />

            <input
              placeholder="Search here..."
              className="w-full px-2 py-3 outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>

          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
            <option value="">All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>

          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
            <option value="">All Locations</option>
          </select>
        </div>

        {/* Pickup */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup
          </label>

          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
            <option value="">All Pickup</option>
          </select>
        </div>

        {/* Reset */}
        <div className="flex items-end">
          <button
            className="
              w-full h-[50px]
              border border-gray-300
              rounded-lg
              bg-white
              hover:bg-gray-100
              flex items-center justify-center gap-2
              text-sm font-medium text-gray-700
              transition
            "
          >
            <FiRefreshCw />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;