import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlus, FaEllipsisV, FaFilter, FaRedo, FaSearch } from "react-icons/fa";

function UsersGroup() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Filter states
    const [filters, setFilters] = useState({
        status: "",
        name: "",
        email: ""
    });

    const [groups, setGroups] = useState([
        {
            id: "1",
            groupName: "Marketing Team",
            description: "Handles promotions and campaigns",
            usersCount: 12,
            defaultRole: "Manager",
            status: "Active",
        },
        {
            id: "2",
            groupName: "Sales Team",
            description: "Handles sales and customer inquiries",
            usersCount: 8,
            defaultRole: "Sales Rep",
            status: "Active",
        },
        {
            id: "3",
            groupName: "Content Writers",
            description: "Creates and manages content",
            usersCount: 5,
            defaultRole: "Editor",
            status: "Active",
        },
        {
            id: "4",
            groupName: "Product Managers",
            description: "Oversees product development",
            usersCount: 4,
            defaultRole: "Product Lead",
            status: "Active",
        },
        {
            id: "5",
            groupName: "Customer Support",
            description: "Handles customer queries",
            usersCount: 15,
            defaultRole: "Support Agent",
            status: "Inactive",
        },
        {
            id: "6",
            groupName: "Design Team",
            description: "Creates designs and graphics",
            usersCount: 6,
            defaultRole: "Designer",
            status: "Active",
        },
        {
            id: "7",
            groupName: "HR Department",
            description: "Manages hiring and employee relations",
            usersCount: 3,
            defaultRole: "HR Manager",
            status: "Active",
        },
        {
            id: "8",
            groupName: "Finance Team",
            description: "Handles budgeting and accounting",
            usersCount: 4,
            defaultRole: "Accountant",
            status: "Active",
        },
        {
            id: "9",
            groupName: "IT Support",
            description: "Technical support and infrastructure",
            usersCount: 7,
            defaultRole: "Tech Lead",
            status: "Active",
        },
    ]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const resetFilters = () => {
        setFilters({
            status: "",
            name: "",
            email: ""
        });
    };

    // Filter groups based on filters
    const filteredGroups = groups.filter(group => {
        if (filters.status && group.status !== filters.status) {
            return false;
        }
        if (filters.name && !group.groupName.toLowerCase().includes(filters.name.toLowerCase())) {
            return false;
        }
        return true;
    });

    const statusStyle = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-600";
            case "Inactive":
                return "bg-red-100 text-red-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentGroups = filteredGroups.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewGroup = (group: any) => {
        navigate(`/group/${group.id}`, { state: { group } });
    };

    const handleAddGroup = () => {
        navigate('/addgroup');
    };

    // Base style for table cells with gradient underlines
    const tdBase = "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold">Groups Management</h2>
                </div>
                <button
                    onClick={handleAddGroup}
                    className="
                        flex items-center gap-3
                        px-6 py-1
                        rounded-full
                        bg-gradient-to-r from-teal-400 to-green-500
                        text-white text-sm font-medium
                        shadow-md
                        hover:from-teal-500 hover:to-green-600
                        transition-all
                        hover:cursor-pointer
                    "
                >
                    <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
                        <FaPlus className="text-teal-500 text-sm" />
                    </span>
                    Add Group
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6">
                <button
                    onClick={() => navigate('/userlist')}
                    className={`pb-2 transition-colors ${location.pathname === '/userlist'
                            ? 'text-teal-600 border-b-2 border-teal-500 font-medium'
                            : 'text-gray-500 hover:text-teal-600'
                        }`}
                >
                    User List
                </button>
                <button
                    onClick={() => navigate('/usersroles')}
                    className={`pb-2 transition-colors ${location.pathname === '/usersroles'
                            ? 'text-teal-600 border-b-2 border-teal-500 font-medium'
                            : 'text-gray-500 hover:text-teal-600'
                        }`}
                >
                    Roles
                </button>
                <button
                    onClick={() => navigate('/usersgroup')}
                    className={`pb-2 transition-colors ${location.pathname === '/usersgroup'
                            ? 'text-teal-600 border-b-2 border-teal-500 font-medium'
                            : 'text-gray-500 hover:text-teal-600'
                        }`}
                >
                    Groups
                </button>
            </div>

            {/* Filter Bar - EXACT same as UserList */}
            <div className="flex items-center overflow-hidden h-[52px] pt-6.5 py-10">
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
                        <select 
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700"
                        >
                            <option value="">Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
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

                    {/* Email Dropdown */}
                    <div className="relative border-r border-gray-200">
                        <select 
                            name="email"
                            value={filters.email}
                            onChange={handleFilterChange}
                            className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700"
                        >
                            <option value="">Email</option>
                            <option value="A-Z">A-Z</option>
                            <option value="Z-A">Z-A</option>
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
                            <th className="p-4 text-left">Group Name</th>
                            <th className="p-4 text-left">Description</th>
                            <th className="p-4 text-left">Users in Group</th>
                            <th className="p-4 text-left">Default Role</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {currentGroups.map((group, index) => (
                            <tr key={index} className="bg-white shadow-sm hover:shadow-md transition">
                                <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                                    {group.groupName}
                                </td>

                                <td className={tdBase}>
                                    {group.description}
                                </td>

                                <td className={tdBase}>
                                    <span className="font-semibold">{group.usersCount}</span> users
                                </td>

                                <td className={tdBase}>
                                    {group.defaultRole}
                                </td>

                                <td className={tdBase}>
                                    <span
                                        className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle(
                                            group.status
                                        )}`}
                                    >
                                        {group.status}
                                    </span>
                                </td>

                                {/* ACTION - Three Dots Icon */}
                                <td className="relative p-4 rounded-r-xl text-right">
                                    {/* Right gradient border */}
                                    <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                                    {/* Bottom gradient border */}
                                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />

                                    <button
                                        onClick={() => handleViewGroup(group)}
                                        className="relative text-gray-400 cursor-pointer hover:text-gray-600"
                                    >
                                        <FaEllipsisV size={18} />
                                    </button>
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
                        className={`px-3 py-1 rounded-md ${currentPage === i + 1
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
}

export default UsersGroup;