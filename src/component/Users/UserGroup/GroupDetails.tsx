import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, X, Check, UserPlus } from "lucide-react";
import { FaEye } from "react-icons/fa";

function GroupDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const group = location.state?.group;

  // If no group data, redirect to groups list
  if (!group) {
    navigate('/usersgroup');
    return null;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    groupName: group.groupName,
    description: group.description,
    defaultRole: group.defaultRole || "Member",
  });

  // Sample assigned users data
  const [assignedUsers, setAssignedUsers] = useState([
    { id: 1, name: "John Smith", email: "john.smith@example.com", role: "Manager", avatar: "JS" },
    { id: 2, name: "Sarah Johnson", email: "sarah.j@example.com", role: "Editor", avatar: "SJ" },
    { id: 3, name: "Mike Wilson", email: "mike.w@example.com", role: "Sales Rep", avatar: "MW" },
    { id: 4, name: "Emma Davis", email: "emma.d@example.com", role: "Designer", avatar: "ED" },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    navigate('/usersgroup');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm({
      groupName: group.groupName,
      description: group.description,
      defaultRole: group.defaultRole || "Member",
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    // Here you would save the changes
    console.log("Saving group:", form);
    setIsEditing(false);
  };

  const handleRemoveUser = (userId: number) => {
    setAssignedUsers(assignedUsers.filter(user => user.id !== userId));
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
              title="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-white font-semibold text-lg tracking-wide">
              {isEditing ? "Edit Group" : "Group Details"}
            </h1>
          </div>

          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-teal-600 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Pencil size={16} />
              Edit Group
            </button>
          )}
        </div>

        <div className="p-6 md:p-8">

          {/* ================= VIEW MODE ================= */}
          {!isEditing && (
            <>
              {/* Group Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-teal-50 p-5 rounded-xl border border-teal-100">
                  <p className="text-xs uppercase tracking-wider text-teal-600 font-semibold mb-2">Group Name</p>
                  <p className="font-bold text-xl text-gray-800">{group.groupName}</p>
                </div>
                <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                  <p className="text-xs uppercase tracking-wider text-green-600 font-semibold mb-2">Total Members</p>
                  <p className="font-bold text-xl text-gray-800">{group.usersCount || assignedUsers.length} users</p>
                </div>
                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                  <p className="text-xs uppercase tracking-wider text-purple-600 font-semibold mb-2">Default Role</p>
                  <p className="font-bold text-xl text-gray-800">{group.defaultRole || "Member"}</p>
                </div>
              </div>

              {/* Description Card */}
              <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-teal-500 rounded-full"></span>
                  Group Description
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {form.description}
                </p>
              </div>

              {/* Assigned Users Section */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                  Assigned Users ({assignedUsers.length})
                </h3>
                
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-4 text-left font-medium text-gray-600">User</th>
                        <th className="p-4 text-left font-medium text-gray-600">Email</th>
                        <th className="p-4 text-left font-medium text-gray-600">Role in Group</th>
                        <th className="p-4 text-center font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedUsers.map((user, index) => (
                        <tr key={user.id} className="border-t border-gray-200 hover:bg-white transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-green-400 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                {user.avatar}
                              </div>
                              <span className="font-medium text-gray-800">{user.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{user.email}</td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button className="text-gray-400 hover:text-teal-600 transition-colors mx-2">
                              <FaEye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ================= EDIT MODE ================= */}
          {isEditing && (
            <>
              {/* Group Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="groupName"
                  value={form.groupName}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-gray-50"
                  placeholder="Enter group name"
                />
              </div>

              {/* Description Textarea */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Group Description <span className="text-gray-400 text-xs">(100 words max)</span>
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-gray-50 resize-none"
                  placeholder="Enter group description"
                />
              </div>

              {/* Default Role Select */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Default Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="defaultRole"
                  value={form.defaultRole}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-gray-50"
                >
                  <option value="Manager">Manager</option>
                  <option value="Sales Rep">Sales Rep</option>
                  <option value="Editor">Editor</option>
                  <option value="Product Lead">Product Lead</option>
                  <option value="Support Agent">Support Agent</option>
                  <option value="Designer">Designer</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Tech Lead">Tech Lead</option>
                </select>
              </div>

              {/* Assigned Users Section - Editable */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                    Assigned Users ({assignedUsers.length})
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600 transition-all">
                    <UserPlus size={16} />
                    Add Users
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-4 text-left font-medium text-gray-600">User</th>
                        <th className="p-4 text-left font-medium text-gray-600">Email</th>
                        <th className="p-4 text-left font-medium text-gray-600">Role in Group</th>
                        <th className="p-4 text-center font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedUsers.map((user) => (
                        <tr key={user.id} className="border-t border-gray-200 hover:bg-white transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-green-400 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                {user.avatar}
                              </div>
                              <span className="font-medium text-gray-800">{user.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{user.email}</td>
                          <td className="p-4">
                            <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white">
                              <option>Manager</option>
                              <option>Editor</option>
                              <option>Viewer</option>
                            </select>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleRemoveUser(user.id)}
                              className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <X size={18} />
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Check size={18} />
                  Save Changes
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default GroupDetails;