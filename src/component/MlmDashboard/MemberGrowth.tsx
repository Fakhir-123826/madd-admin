import React, { useState, useEffect } from "react";
import { FaFileExport } from "react-icons/fa";
import { FiFilter, FiSearch, FiDownload } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import MemberGrowthChart from "./MemberGrowthChart";
import MemberGrowthOverview from "./MemberGrowthOverview";

const MemberGrowth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("growth");

  // Update active tab based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/reports') {
      setActiveTab("earning");
    } else if (path === '/membergrowth') {
      setActiveTab("growth");
    } else if (path === '/levelwise') {
      setActiveTab("levelwise");
    }
  }, [location]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}

        <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Member Growth Over Time</h2>
              
              <button
                className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium shadow-md hover:from-teal-500 hover:to-green-600 transition-all"
              >
                <span className="relative -left-5 flex items-center justify-center w-8 h-8 rounded-full bg-white">
                  <FaFileExport className="text-teal-500 text-sm" />
                </span>
                Export as PDF
              </button>
            </div>




      <div>
        {/* Tabs with Navigation */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <button
            onClick={() => navigate('/reports')}
            className={`pb-2 transition-colors ${
              activeTab === "earning"
                ? "text-teal-600 border-b-2 border-teal-500 font-medium"
                : "text-gray-500 hover:text-teal-600"
            }`}
          >
            Earning
          </button>
          <button
            onClick={() => navigate('/membergrowth')}
            className={`pb-2 transition-colors ${
              activeTab === "growth"
                ? "text-teal-600 border-b-2 border-teal-500 font-medium"
                : "text-gray-500 hover:text-teal-600"
            }`}
          >
            Member Growth
          </button>
          <button
            onClick={() => navigate('/levelwise')}
            className={`pb-2 transition-colors ${
              activeTab === "levelwise"
                ? "text-teal-600 border-b-2 border-teal-500 font-medium"
                : "text-gray-500 hover:text-teal-600"
            }`}
          >
            Level-wise
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex items-center overflow-hidden h-[52px] mb-6">
          {/* Left Side Filters */}
          <div className="flex items-center bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-[52px] w-[60%]">
            
            {/* Filter Icon */}
            <div className="px-5 flex items-center border-r border-gray-200 text-gray-600">
              <FiFilter className="text-gray-500" />
            </div>

            {/* Filter By Text */}
            <div className="px-5 flex items-center border-r border-gray-200 text-sm font-medium text-gray-700">
              Filter By
            </div>

            {/* Name Dropdown */}
            <div className="relative border-r border-gray-200">
              <select className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700">
                <option>Name</option>
                <option>A-Z</option>
                <option>Z-A</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
            </div>

            {/* Status Dropdown */}
            <div className="relative border-r border-gray-200">
              <select className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700">
                <option>Status</option>
                <option>Active</option>
                <option>Pending</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
            </div>

            {/* Country Code Dropdown */}
            <div className="relative border-r border-gray-200">
              <select className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700">
                <option>Country Code</option>
                <option>+92</option>
                <option>+1</option>
                <option>+44</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
            </div>

            {/* Reset Filter Button */}
            <button className="px-5 flex items-center gap-2 text-sm text-blue-500 hover:underline">
              <span className="text-xs">↻</span>
              Reset Filter
            </button>
          </div>

          {/* Search Box */}
          <div className="ml-auto relative mr-2">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search here..."
              className="w-70 h-[48px] pl-11 pr-4 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
            />
          </div>
        </div>

        {/* Section Header */}
        {/* <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">
            Member Growth Over Time
          </h3>

          <button className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium shadow-md hover:from-teal-500 hover:to-green-600 transition-all">
            <span className="relative -left-5 flex items-center justify-center w-8 h-8 rounded-full bg-white">
              <FiDownload className="text-teal-500 text-sm" />
            </span>
            Export as PDF
          </button>
        </div> */}



        <div className="mt-10">
            <MemberGrowthChart />
        </div>



        <div className="mt-10">
            <MemberGrowthOverview />
        </div>
      </div>
    </div>
  );
};

export default MemberGrowth;