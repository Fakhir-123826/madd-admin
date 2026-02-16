import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    role: "",
    roleDescription: "",
    email: "",
    phone: "",
    status: true,
    groups: [] as string[],
  });

  const [availableGroups] = useState([
    "Marketing Team",
    "Vendor Support",
    "Warehouse Staff",
    "Content Team",
    "Sales Team",
    "IT Department",
    "HR Department",
    "Customer Support",
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGroupToggle = (group: string) => {
    setFormData(prev => ({
      ...prev,
      groups: prev.groups.includes(group)
        ? prev.groups.filter(g => g !== group)
        : [...prev.groups, group]
    }));
  };

  const handleStatusToggle = () => {
    setFormData(prev => ({ ...prev, status: !prev.status }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically save to backend
    console.log("Saving user:", {
      ...formData,
      id: Date.now(),
      lastLogin: "Just now",
      joiningDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      group: formData.groups[0] || "No Group",
      assignedGroups: formData.groups,
      status: formData.status ? "Active" : "Inactive",
    });
    
    // Navigate back to users list
    navigate('/userlist');
  };

  const handleCancel = () => {
    navigate('/userlist');
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-4 rounded-t-2xl flex items-center gap-4 shadow-lg">
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white font-semibold text-xl tracking-wide">
            Add New User
          </h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8 border-x border-b border-gray-200">
          <form onSubmit={handleSubmit}>
            
            {/* User Info Section */}
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
              <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
              User Information
            </h2>

            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Username */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter username"
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                  />
                  {formData.username && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                  )}
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    placeholder="Enter role"
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                  />
                  {formData.role && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email address"
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                  />
                  {formData.email && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                  />
                  {formData.phone && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                  )}
                </div>
              </div>

              {/* Role Description - Full Width */}
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Role Description
                  <span className="text-gray-400 text-xs ml-2">(100 words max)</span>
                </label>
                <textarea
                  name="roleDescription"
                  value={formData.roleDescription}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the user's role and responsibilities..."
                  className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white resize-none"
                />
              </div>
            </div>

            {/* Groups Section */}
            <div className="mb-8">
              <h3 className="text-md font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <span className="w-1 h-5 bg-green-500 rounded-full"></span>
                Groups ({formData.groups.length} selected)
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                {availableGroups.map((group, index) => (
                  <label 
                    key={index} 
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      formData.groups.includes(group) 
                        ? 'bg-teal-50 border border-teal-200' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.groups.includes(group)}
                      onChange={() => handleGroupToggle(group)}
                      className="w-5 h-5 text-teal-500 rounded focus:ring-teal-400"
                    />
                    <span className={`text-sm font-medium ${
                      formData.groups.includes(group) ? 'text-teal-700' : 'text-gray-700'
                    }`}>
                      {group}
                    </span>
                  </label>
                ))}
              </div>

              {/* Save Groups Button */}
              <div className="mt-4">
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:from-teal-600 hover:to-green-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Save Groups
                </button>
              </div>
            </div>

            {/* Status Section with Toggle Switch */}
            <div className="mb-8">
              <h3 className="text-md font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                Status
              </h3>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 w-fit">
                <span className={`text-sm font-medium ${!formData.status ? 'text-red-600' : 'text-gray-500'}`}>
                  Inactive
                </span>
                
                <button
                  type="button"
                  onClick={handleStatusToggle}
                  className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${
                    formData.status ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                      formData.status ? "translate-x-7" : "translate-x-0"
                    }`}
                  ></span>
                </button>
                
                <span className={`text-sm font-medium ${formData.status ? 'text-teal-600' : 'text-gray-500'}`}>
                  Active
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-8 py-3.5 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:from-teal-600 hover:to-green-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUser;