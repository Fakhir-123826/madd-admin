import React, { useState } from "react";

interface AddUserProps {
  onSave: (user: any) => void;
  onCancel: () => void;
}

function AddUser({ onSave, onCancel }: AddUserProps) {
  const [formData, setFormData] = useState({
    username: "",
    role: "",
    roleDescription: "",
    email: "",
    phone: "",
    status: true, // Changed to boolean: true for Active, false for Inactive
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
    onSave({
      ...formData,
      id: Date.now(),
      lastLogin: "Just now",
      joiningDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      group: formData.groups[0] || "No Group",
      assignedGroups: formData.groups,
      status: formData.status ? "Active" : "Inactive", // Convert back to string for saving
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-6">User Info</h2>

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="User Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              placeholder="Enter URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Role Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Description <span className="text-gray-400">(100 words max)</span>
            </label>
            <textarea
              name="roleDescription"
              value={formData.roleDescription}
              onChange={handleChange}
              rows={4}
              placeholder="Description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
        </div>

        {/* Groups Section */}
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-3">Groups</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableGroups.map((group, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.groups.includes(group)}
                  onChange={() => handleGroupToggle(group)}
                  className="w-4 h-4 text-teal-500 rounded focus:ring-teal-400"
                />
                <span className="text-sm text-gray-700">{group}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Groups Button */}
        <div className="mb-6">
          <button
            type="button"
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors hover:cursor-pointer"
          >
            Save Groups
          </button>
        </div>

        {/* Status Section with Toggle Switch */}
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-3">Status</h3>
          <div className="flex items-center gap-4">
            <span className={`text-sm ${!formData.status ? 'text-red-500' : 'text-gray-700'}`}>Inactive</span>
            <button
              type="button"
              onClick={handleStatusToggle}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                formData.status ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                  formData.status ? "translate-x-6" : ""
                }`}
              ></span>
            </button>
            <span className={`text-sm ${formData.status ? 'text-blue-700' : 'text-gray-500'}`}>Active</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-teal-400 to-green-400 text-white rounded-lg hover:opacity-90 transition-opacity hover:cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUser;