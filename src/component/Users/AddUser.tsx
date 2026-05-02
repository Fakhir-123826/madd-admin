import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../app/api/UserSlices/UserApi"; // Adjust path as needed

function AddUser() {
  const navigate = useNavigate();
  const [createUser, { isLoading, error }] = useCreateUserMutation();
  
  const [formData, setFormData] = useState({
    first_name: "",      // Changed from username
    last_name: "",       // Added last_name
    email: "",
    phone: "",
    user_type: "customer", // Changed from role (admin/vendor/customer/mlm_agent)
    country_code: "PK",
    password: "",
    status: "active",
    roles: [] as string[],
    // roleDescription removed — not in API
    groups: [] as string[], // This is frontend only — backend uses roles
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

  // Map groups to roles (if needed)
  const groupToRoleMap: Record<string, string> = {
    "Marketing Team": "admin",
    "Vendor Support": "vendor",
    "Warehouse Staff": "vendor",
    "Content Team": "admin",
    "Sales Team": "vendor",
    "IT Department": "admin",
    "HR Department": "admin",
    "Customer Support": "customer",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGroupToggle = (group: string) => {
    setFormData(prev => {
      const newGroups = prev.groups.includes(group)
        ? prev.groups.filter(g => g !== group)
        : [...prev.groups, group];
      
      // Automatically assign roles based on groups
      const newRoles = newGroups.map(g => groupToRoleMap[g]).filter(Boolean);
      
      return {
        ...prev,
        groups: newGroups,
        roles: [...new Set(newRoles)], // Remove duplicates
      };
    });
  };

  const handleStatusToggle = () => {
    setFormData(prev => ({
      ...prev,
      status: prev.status === "active" ? "suspended" : "active"
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      alert("Please fill all required fields: First Name, Last Name, Email, Password");
      return;
    }

    // Prepare data for API
    const userData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone || null,
      password: formData.password,
      user_type: formData.user_type,
      country_code: formData.country_code,
      status: formData.status,
      roles: formData.roles.length > 0 ? formData.roles : [formData.user_type],
    };

    try {
      const response = await createUser(userData).unwrap();
      console.log("User created successfully:", response);
      alert("User created successfully!");
      navigate('/userlist');
    } catch (err: any) {
      console.error("Failed to create user:", err);
      const errorMessage = err?.data?.message || err?.message || "Failed to create user. Please try again.";
      alert(errorMessage);
    }
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
              {/* First Name */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter first name"
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                  />
                  {formData.first_name && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                  )}
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter last name"
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                  />
                  {formData.last_name && (
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
                  Phone number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    placeholder="Enter password (min 8 characters)"
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                  />
                </div>
              </div>

              {/* User Type (Role) */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  User Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                >
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                  <option value="mlm_agent">MLM Agent</option>
                </select>
              </div>

              {/* Country Code */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Country Code <span className="text-red-500">*</span>
                </label>
                <select
                  name="country_code"
                  value={formData.country_code}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                >
                  <option value="PK">Pakistan (PK)</option>
                  <option value="US">United States (US)</option>
                  <option value="UK">United Kingdom (UK)</option>
                  <option value="AE">UAE (AE)</option>
                  <option value="SA">Saudi Arabia (SA)</option>
                </select>
              </div>
            </div>

            {/* Groups Section (Frontend only — maps to roles) */}
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
              
              {/* Display assigned roles */}
              {formData.roles.length > 0 && (
                <div className="mt-3 text-sm text-gray-500">
                  Assigned Roles: <span className="font-medium text-teal-600">{formData.roles.join(", ")}</span>
                </div>
              )}
            </div>

            {/* Status Section with Toggle Switch */}
            <div className="mb-8">
              <h3 className="text-md font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                Status
              </h3>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 w-fit">
                <span className={`text-sm font-medium ${formData.status === 'suspended' ? 'text-red-600' : 'text-gray-500'}`}>
                  Inactive
                </span>
                
                <button
                  type="button"
                  onClick={handleStatusToggle}
                  className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${
                    formData.status === "active" ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                      formData.status === "active" ? "translate-x-7" : "translate-x-0"
                    }`}
                  ></span>
                </button>
                
                <span className={`text-sm font-medium ${formData.status === 'active' ? 'text-teal-600' : 'text-gray-500'}`}>
                  Active
                </span>
              </div>
            </div>

            {/* Loading/Error States */}
            {isLoading && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-xl text-center">
                Creating user... Please wait.
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-center">
                Failed to create user. Check console for details.
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-3.5 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-medium disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:from-teal-600 hover:to-green-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUser;