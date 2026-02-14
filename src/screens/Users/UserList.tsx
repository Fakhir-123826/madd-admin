import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { FaPlus, FaEllipsisV, FaFilter, FaRedo, FaSearch } from "react-icons/fa";
import UserDetails from "../../component/Users/UserDetails";
import AddUser from "../..//component/Users/AddUser";

function UserList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const itemsPerPage = 8;

  const [users, setUsers] = useState([
    {
      id: 1,
      username: "Jhon Smith",
      email: "Info@gmail.com",
      phone: "+91 35356 99",
      role: "Admin",
      group: "Marketing Team",
      lastLogin: "26 Jul 2025",
      joiningDate: "23 June 2025",
      status: "Active",
      roleDescription: "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gal...",
      assignedGroups: ["Marketing Team", "Vendor Support", "Warehouse Staff"]
    },
    {
      id: 2,
      username: "Apparel",
      email: "apparel@gmail.com",
      phone: "+91 35357 00",
      role: "Editor",
      group: "Men's Clothing",
      lastLogin: "25 Jul 2025",
      joiningDate: "24 June 2025",
      status: "Disabled",
      roleDescription: "Editor role description...",
      assignedGroups: ["Content Team", "Product Team"]
    },
    {
      id: 3,
      username: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+91 35358 11",
      role: "Manager",
      group: "Women's Fashion",
      lastLogin: "24 Jul 2025",
      joiningDate: "25 June 2025",
      status: "Active",
      roleDescription: "Manager role description...",
      assignedGroups: ["Women's Fashion", "Sales Team"]
    },
    {
      id: 4,
      username: "Mike Wilson",
      email: "mike.w@email.com",
      phone: "+91 35359 22",
      role: "Viewer",
      group: "Customer Support",
      lastLogin: "23 Jul 2025",
      joiningDate: "26 June 2025",
      status: "Disabled",
      roleDescription: "Viewer role description...",
      assignedGroups: ["Customer Support"]
    },
    {
      id: 5,
      username: "Emma Davis",
      email: "emma.d@email.com",
      phone: "+91 35360 33",
      role: "Admin",
      group: "IT Department",
      lastLogin: "22 Jul 2025",
      joiningDate: "27 June 2025",
      status: "Active",
      roleDescription: "Admin role description...",
      assignedGroups: ["IT Department", "Security Team"]
    },
    {
      id: 6,
      username: "Alex Brown",
      email: "alex.b@email.com",
      phone: "+91 35361 44",
      role: "Editor",
      group: "Content Team",
      lastLogin: "21 Jul 2025",
      joiningDate: "28 June 2025",
      status: "Active",
      roleDescription: "Editor role description...",
      assignedGroups: ["Content Team", "SEO Team"]
    },
    {
      id: 7,
      username: "Lisa White",
      email: "lisa.w@email.com",
      phone: "+91 35362 55",
      role: "Manager",
      group: "HR Department",
      lastLogin: "20 Jul 2025",
      joiningDate: "29 June 2025",
      status: "Disabled",
      roleDescription: "Manager role description...",
      assignedGroups: ["HR Department", "Recruitment"]
    },
    {
      id: 8,
      username: "Tom Harris",
      email: "tom.h@email.com",
      phone: "+91 35363 66",
      role: "Viewer",
      group: "Sales Team",
      lastLogin: "19 Jul 2025",
      joiningDate: "30 June 2025",
      status: "Active",
      roleDescription: "Viewer role description...",
      assignedGroups: ["Sales Team"]
    },
    {
      id: 9,
      username: "Anna Lee",
      email: "anna.l@email.com",
      phone: "+91 35364 77",
      role: "Admin",
      group: "Marketing Team",
      lastLogin: "18 Jul 2025",
      joiningDate: "01 July 2025",
      status: "Active",
      roleDescription: "Admin role description...",
      assignedGroups: ["Marketing Team", "Social Media"]
    },
  ]);

  const statusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "Disabled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowAddUser(false);
  };

  const handleAddUser = (newUser: any) => {
    setUsers([...users, { ...newUser, id: users.length + 1 }]);
    setShowAddUser(false);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
    setShowAddUser(false);
  };

  // Base style for table cells with gradient underlines
  const tdBase = "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  // If Add User is shown
  if (showAddUser) {
    return (
      <div className="bg-white rounded-xl    shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBackToList}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Add New User</h1>
        </div>
        <AddUser onSave={handleAddUser} onCancel={handleBackToList} />
      </div>
    );
  }

  // If user details are shown
  if (selectedUser) {
    return (
      <div className="bg-white shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBackToList}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">User Details</h1>
        </div>
        <UserDetails user={selectedUser} onBack={handleBackToList} />
      </div>
    );
  }

  // Default view - User List
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">User Management</h2>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
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
          Add User
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

          {/* Status Dropdown */}
          <div className="relative border-r border-gray-200">
            <select className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700">
              <option>Status</option>
              <option>Active</option>
              <option>Disabled</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
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

          {/* Email Dropdown */}
          <div className="relative border-r border-gray-200">
            <select className="h-[52px] px-5 pr-9 text-sm bg-transparent outline-none appearance-none cursor-pointer text-gray-700">
              <option>Email</option>
              <option>A-Z</option>
              <option>Z-A</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
          </div>

          {/* Reset Filter Button */}
          <button className="px-5 flex items-center gap-2 text-sm text-blue-500 hover:underline">
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
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Group</th>
              <th className="p-4 text-left">Last Login</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={index} className="bg-white shadow-sm hover:shadow-md transition">
                <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                  {user.username}
                </td>

                <td className={tdBase}>
                  {user.email}
                </td>

                <td className={tdBase}>
                  {user.role}
                </td>

                <td className={tdBase}>
                  {user.group}
                </td>

                <td className={tdBase}>
                  {user.lastLogin}
                </td>

                <td className={tdBase}>
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle(user.status)}`}
                  >
                    {user.status}
                  </span>
                </td>

                {/* ACTION - Three Dots Icon */}
                <td className="relative p-4 rounded-r-xl text-right">
                  {/* Right gradient border */}
                  <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                  {/* Bottom gradient border */}
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />

                  <button
                    onClick={() => handleViewUser(user)}
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
}

export default UserList;