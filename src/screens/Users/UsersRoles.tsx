import React, { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";
import { FaPlus, FaEllipsisV, FaFilter, FaRedo, FaSearch, FaEye } from "react-icons/fa";
import RoleDetails from "../../component/Users/UserRole/RoleDetails";
import AddRole from "../../component/Users/UserRole/AddRole";

function UsersRoles() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('userList');
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [showAddRole, setShowAddRole] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const itemsPerPage = 8;

  // Sample data for roles
  const [roles, setRoles] = useState([
    { id: 1, roleName: "Jhon Smith", description: "Super Admin", usersAssigned: "12 users" },
    { id: 2, roleName: "Jhon Smith", description: "Super Admin", usersAssigned: "12 users" },
    { id: 3, roleName: "Jhon Smith", description: "Super Admin", usersAssigned: "12 users" },
    { id: 4, roleName: "Jhon Smith", description: "Super Admin", usersAssigned: "" },
    { id: 5, roleName: "Jhon Smith", description: "Super Admin", usersAssigned: "" },
    { id: 6, roleName: "Sarah Johnson", description: "Content Manager", usersAssigned: "8 users" },
    { id: 7, roleName: "Mike Wilson", description: "Product Manager", usersAssigned: "15 users" },
    { id: 8, roleName: "Emma Davis", description: "Customer Support", usersAssigned: "6 users" },
    { id: 9, roleName: "Alex Brown", description: "SEO Specialist", usersAssigned: "4 users" },
  ]);

  // Pagination logic
  const totalPages = Math.ceil(roles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRoles = roles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewRole = (role: any) => {
    setSelectedRole(role);
    setShowAddRole(false);
    setShowEditRole(false);
  };

  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setShowEditRole(true);
    setShowAddRole(false);
  };

  const handleAddRole = (newRole: any) => {
    setRoles([...roles, { ...newRole, id: roles.length + 1 }]);
    setShowAddRole(false);
    setSelectedRole(null);
  };

  const handleUpdateRole = (updatedRole: any) => {
    setRoles(roles.map(role => role.id === selectedRole.id ? { ...updatedRole, id: role.id } : role));
    setShowEditRole(false);
    setSelectedRole(null);
  };

  const handleBackToList = () => {
    setSelectedRole(null);
    setShowAddRole(false);
    setShowEditRole(false);
  };

  // Base style for table cells with gradient underlines
  const tdBase = "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  // If showing Add Role form
  if (showAddRole) {
    return <AddRole onSave={handleAddRole} onCancel={handleBackToList} />;
  }

  // If showing Edit Role form
  if (showEditRole && selectedRole) {
    return <AddRole onSave={handleUpdateRole} onCancel={handleBackToList} editRole={selectedRole} />;
  }

  // If showing Role Details
  if (selectedRole && !showAddRole && !showEditRole) {
    return (
      <RoleDetails 
        role={selectedRole} 
        onBack={handleBackToList}
        onEdit={() => handleEditRole(selectedRole)}
      />
    );
  }

  // Default view - Role List
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Role Management</h2>

          {/* Add New Role Button */}
          <button
            onClick={() => setShowAddRole(true)}
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
            Add New Role
          </button>
        </div>
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

      {/* Table */}
      <div className="rounded-t-3xl overflow-hidden mt-6">
        <table className="w-full text-sm border-separate border-spacing-y-3">
          {/* HEADER */}
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left">Role Name</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Users Assigned</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {currentRoles.map((role, index) => (
              <tr key={index} className="bg-white shadow-sm hover:shadow-md transition">
                <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                  {role.roleName}
                </td>

                <td className={tdBase}>
                  {role.description}
                </td>

                <td className={tdBase}>
                  {role.usersAssigned || '-'}
                </td>

                {/* ACTION - Eye Icon and Three Dots */}
                <td className="relative p-4 rounded-r-xl">
                  {/* Right gradient border */}
                  <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                  {/* Bottom gradient border */}
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />

                  <div className="flex items-center justify-center gap-3 relative">
                    {/* Eye Icon for View Details */}
                    <button
                      onClick={() => handleViewRole(role)}
                      className="text-gray-400 hover:text-teal-600 transition-colors"
                      title="View Details"
                    >
                      <FaEye size={18} />
                    </button>

                  </div>
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

export default UsersRoles;