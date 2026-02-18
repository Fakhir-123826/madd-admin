import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFilter, FaRedo, FaSearch, FaFileExport } from "react-icons/fa";

const LevelWise = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [filters, setFilters] = useState({
    level: "",
    name: ""
  });

  const data = [
    { level: "Bronze", members: "3535", earnings: "3535$" },
    { level: "Silver", members: "3535", earnings: "3535$" },
    { level: "Gold", members: "3535", earnings: "3535$" },
    { level: "Platinum", members: "3535", earnings: "3535$" },
    { level: "Diamond", members: "3535", earnings: "3535$" },
    { level: "Ruby", members: "3535", earnings: "3535$" },
    { level: "Emerald", members: "3535", earnings: "3535$" },
    { level: "Sapphire", members: "3535", earnings: "3535$" },
    { level: "Pearl", members: "3535", earnings: "3535$" },
  ];

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      level: "",
      name: ""
    });
    setCurrentPage(1);
  };

  const filteredData = data.filter(item => {
    if (
      filters.level &&
      !item.level.toLowerCase().includes(filters.level.toLowerCase())
    )
      return false;
    return true;
  });

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

  const getActiveTabFromPath = () => {
    if (location.pathname === "/reports") return "earning";
    if (location.pathname === "/membergrowth") return "growth";
    if (location.pathname === "/levelwise") return "levelwise";
    return "levelwise";
  };

  const [activeTab] = useState(getActiveTabFromPath());

  const tdBase =
    "relative p-4 text-gray-600 text-center after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Level-wise Report</h2>

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

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => navigate("/reports")}
          className={`pb-2 transition-colors ${
            activeTab === "earning"
              ? "text-teal-600 border-b-2 border-teal-500 font-medium"
              : "text-gray-500 hover:text-teal-600"
          }`}
        >
          Earning
        </button>

        <button
          onClick={() => navigate("/membergrowth")}
          className={`pb-2 transition-colors ${
            activeTab === "growth"
              ? "text-teal-600 border-b-2 border-teal-500 font-medium"
              : "text-gray-500 hover:text-teal-600"
          }`}
        >
          Member Growth
        </button>

        <button
          onClick={() => navigate("/levelwise")}
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-[52px] w-[60%]">
          <div className="px-5 flex items-center border-r border-gray-200 text-gray-600">
            <FaFilter />
          </div>

          <div className="px-5 flex items-center border-r border-gray-200 text-sm font-medium text-gray-700">
            Filter By
          </div>

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
              <option value="Platinum">Platinum</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              ▾
            </span>
          </div>

          <button
            onClick={resetFilters}
            className="px-5 flex items-center gap-2 text-sm text-blue-500 hover:underline"
          >
            <FaRedo className="text-xs" />
            Reset Filter
          </button>
        </div>

        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-72 h-[48px] pl-11 pr-4 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl overflow-hidden">
        <table className="w-full table-fixed text-sm border-separate border-spacing-y-3">
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-center w-1/3 rounded-l-xl">
                Level
              </th>
              <th className="p-4 text-center w-1/3">
                Member Count
              </th>
              <th className="p-4 text-center w-1/3 rounded-r-xl">
                Total Earnings per Level
              </th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={index}
                className="bg-white shadow-sm hover:shadow-md transition duration-200"
              >
                <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                  {item.level}
                </td>

                <td className={tdBase}>
                  {item.members}
                </td>

                <td className="relative p-4 text-center rounded-r-xl">
                  <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                  {item.earnings}
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

export default LevelWise;
