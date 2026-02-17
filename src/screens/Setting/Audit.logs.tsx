import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaRedo, FaSearch } from "react-icons/fa";

interface Log {
  id: number;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  ip: string;
  status: "Success" | "Failed";
}

const logs: Log[] = [
  {
    id: 1,
    timestamp: "2025-08-14 10:15",
    user: "Jhon Smith",
    role: "Admin",
    action: "Updated vendor info",
    module: "Vendors",
    ip: "192.168.1.45",
    status: "Success",
  },
  {
    id: 2,
    timestamp: "2025-08-14 10:15",
    user: "Jhon Smith",
    role: "Admin",
    action: "Updated vendor info",
    module: "Vendors",
    ip: "192.168.1.45",
    status: "Success",
  },
  {
    id: 3,
    timestamp: "2025-08-14 10:15",
    user: "Jhon Smith",
    role: "Admin",
    action: "Updated vendor info",
    module: "Vendors",
    ip: "192.168.1.45",
    status: "Failed",
  },
  {
    id: 4,
    timestamp: "2025-08-14 10:15",
    user: "Jhon Smith",
    role: "Admin",
    action: "Updated vendor info",
    module: "Vendors",
    ip: "192.168.1.45",
    status: "Success",
  },
];

const AuditLogs = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    module: "",
    status: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  const statusStyle = (status: string) => {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-600";
      case "Failed":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const resetFilters = () => {
    setFilters({
      module: "",
      status: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Filter logs based on filters and search
  const filteredLogs = logs.filter(log => {
    // Apply filters
    if (filters.module && log.module !== filters.module) return false;
    if (filters.status && log.status !== filters.status) return false;
    
    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        log.user.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        log.module.toLowerCase().includes(searchLower) ||
        log.ip.includes(searchTerm)
      );
    }
    
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Base style for table cells with gradient underlines
  const tdBase = "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Audit Logs</h2>
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

          {/* Module Dropdown */}
          <div className="relative border-r border-gray-200">
            <select 
              name="module"
              value={filters.module}
              onChange={handleFilterChange}
              className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700"
            >
              <option value="">Module</option>
              <option value="Vendors">Vendors</option>
              <option value="Products">Products</option>
              <option value="Orders">Orders</option>
              <option value="Users">Users</option>
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
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
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
            placeholder="Search by user, action, module or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 h-[48px] pl-11 pr-4 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-t-3xl overflow-hidden mt-6">
        <table className="w-full text-sm border-separate border-spacing-y-3">
          {/* HEADER - Gradient background */}
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left rounded-l-xl">Timestamp</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Action Performed</th>
              <th className="p-4 text-left">Module</th>
              <th className="p-4 text-left">IP Address</th>
              <th className="p-4 text-left rounded-r-xl">Status</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {currentLogs.length > 0 ? (
              currentLogs.map((log, index) => (
                <tr key={index} className="bg-white shadow-sm hover:shadow-md transition">
                  <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                    {log.timestamp}
                  </td>

                  <td className={tdBase}>
                    {log.user}
                  </td>

                  <td className={tdBase}>
                    {log.role}
                  </td>

                  <td className={tdBase}>
                    {log.action}
                  </td>

                  <td className={tdBase}>
                    {log.module}
                  </td>

                  <td className={tdBase}>
                    {log.ip}
                  </td>

                  <td className={`${tdBase} rounded-r-xl`}>
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No logs found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION - Only show if there are results */}
      {filteredLogs.length > 0 && (
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
      )}
    </div>
  );
};

export default AuditLogs;