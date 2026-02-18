import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFilter, FaRedo, FaSearch, FaFileExport } from "react-icons/fa";

const Earning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter states
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    level: ""
  });

  const data = [
    { name: "Jhon Smith", level: "Bronze", amount: "3535$", period: "2 months", status: "Pending" },
    { name: "Jhon Smith", level: "Bronze", amount: "3535$", period: "2 months", status: "Active" },
    { name: "Jhon Smith", level: "Bronze", amount: "3535$", period: "2 months", status: "Pending" },
    { name: "Jhon Smith", level: "Bronze", amount: "3535$", period: "2 months", status: "Pending" },
    { name: "Jhon Smith", level: "Bronze", amount: "3535$", period: "2 months", status: "Active" },
    { name: "Jhon Smith", level: "Bronze", amount: "3535$", period: "2 months", status: "Active" },
    { name: "Sarah Johnson", level: "Silver", amount: "4520$", period: "3 months", status: "Active" },
    { name: "Mike Wilson", level: "Gold", amount: "6780$", period: "4 months", status: "Pending" },
    { name: "Emma Davis", level: "Bronze", amount: "2890$", period: "1 month", status: "Active" },
  ];

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      name: "",
      status: "",
      level: ""
    });
    setCurrentPage(1);
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Filter data based on filters
  const filteredData = data.filter(item => {
    if (filters.status && item.status !== filters.status) return false;
    if (filters.level && item.level !== filters.level) return false;
    if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExport = () => {
    console.log("Exporting as PDF...");
  };

  // Base style for table cells with gradient underlines
  const tdBase = "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  // Set active tab based on current path
  const getActiveTabFromPath = () => {
    if (location.pathname === '/reports') return 'earning';
    if (location.pathname === '/membergrowth') return 'growth';
    if (location.pathname === '/levelwise') return 'levelwise';
    return 'earning';
  };

  const [activeTab] = useState(getActiveTabFromPath());

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Earning Reports</h2>
        
        <button
          onClick={handleExport}
          className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium shadow-md hover:from-teal-500 hover:to-green-600 transition-all"
        >
          <span className="relative -left-5 flex items-center justify-center w-8 h-8 rounded-full bg-white">
            <FaFileExport className="text-teal-500 text-sm" />
          </span>
          Export as PDF
        </button>
      </div>

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

      {/* Filter Bar */}
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

          {/* Name Dropdown */}
          <div className="relative border-r border-gray-200">
            <select 
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700"
            >
              <option value="">Name</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
          </div>

          {/* Status Dropdown */}
          <div className="relative border-r border-gray-200">
            <select 
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700"
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
          </div>

          {/* Level Dropdown */}
          <div className="relative border-r border-gray-200">
            <select 
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
              className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700"
            >
              <option value="">Level</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
          </div>

          {/* Reset Filter Button */}
          <button 
            onClick={resetFilters}
            className="px-5 flex items-center gap-2 text-sm text-blue-500 hover:underline"
          >
            <FaRedo className="text-xs" />
            Reset Filter
          </button>
        </div>

        {/* Search Box */}
        <div className="ml-auto relative mr-2">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-70 h-[48px] pl-11 pr-4 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-t-3xl overflow-hidden mt-6">
        <table className="w-full text-sm border-separate border-spacing-y-3">
          {/* HEADER - Gradient background */}
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left rounded-l-xl">User Name</th>
              <th className="p-4 text-left">Level in MLM</th>
              <th className="p-4 text-left">Commission Amount</th>
              <th className="p-4 text-left">Period</th>
              <th className="p-4 text-left rounded-r-xl">Status</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index} className="bg-white shadow-sm hover:shadow-md transition relative">
                <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                  {item.name}
                </td>

                <td className={tdBase}>
                  {item.level}
                </td>

                <td className={tdBase}>
                  {item.amount}
                </td>

                <td className={tdBase}>
                  {item.period}
                </td>

                <td className="relative p-4 rounded-r-xl">
                  {/* Right gradient border */}
                  <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                  {/* Bottom gradient border */}
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                  
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-600">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
        >
          ← Back
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === i + 1
                ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Earning;