import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, UserPlus, X, Check, Users, Info } from "lucide-react";

interface Member {
  username: string;
  role: string;
}

interface GroupData {
  groupName?: string;
  groupDescription?: string;
  defaultRole?: string;
  members?: Member[];
}

function AddGroup() {
  const navigate = useNavigate();
  const location = useLocation();
  const editGroup = location.state?.group as GroupData | undefined;

  const [showModal, setShowModal] = useState(false);
  // Removed unused modalMessage state

  const [formData, setFormData] = useState({
    groupName: editGroup?.groupName || "",
    groupDescription: editGroup?.groupDescription || "",
    defaultRole: editGroup?.defaultRole || "",
    members: editGroup?.members || [] as Member[]
  });

  const [newUser, setNewUser] = useState<Member>({
    username: "",
    role: ""
  });

  // Word count function
  const getWordCount = (text: string) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.role) return;

    setFormData({
      ...formData,
      members: [...formData.members, newUser]
    });

    setNewUser({ username: "", role: "" });
  };

  const handleRemoveUser = (index: number) => {
    const updatedMembers = formData.members.filter((_, i) => i !== index);
    setFormData({ ...formData, members: updatedMembers });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add validation for at least one member
    if (formData.members.length === 0) {
      alert("Please add at least one member to the group");
      return;
    }
    
    console.log("Final Data:", formData);
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      navigate("/usersgroup");
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/usersgroup");
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen rounded-xl bg-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-4 rounded-t-2xl flex items-center gap-4 shadow-lg">
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white font-semibold text-xl tracking-wide">
            {editGroup ? "Edit Group" : "Create New Group"}
          </h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8 border-x border-b border-gray-200">
          <form onSubmit={handleSubmit}>

            {/* Group Info Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
                <Info size={20} className="text-teal-500" />
                Group Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Group Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Group Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.groupName}
                      onChange={(e) =>
                        setFormData({ ...formData, groupName: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                      placeholder="e.g., Marketing Team"
                      required
                    />
                    {formData.groupName && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                        ✓
                      </span>
                    )}
                  </div>
                </div>

                {/* Default Role */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.defaultRole}
                      onChange={(e) =>
                        setFormData({ ...formData, defaultRole: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white appearance-none"
                      required
                    >
                      <option value="">Select default role</option>
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
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      ▼
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Description
                <span className="text-gray-400 text-xs ml-2">(100 words max)</span>
              </label>
              <textarea
                rows={4}
                value={formData.groupDescription}
                onChange={(e) =>
                  setFormData({ ...formData, groupDescription: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white resize-none"
                placeholder="Describe the purpose of this group, its responsibilities, and any other relevant information..."
              />
              <p className="text-xs text-gray-400 mt-1">
                {getWordCount(formData.groupDescription)}/100 words approx
              </p>
            </div>

            {/* Assign Users Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
                <Users size={20} className="text-teal-500" />
                Assign Members ({formData.members.length})
              </h2>

              {/* Add User Form */}
              <div className="bg-gradient-to-r from-teal-50 to-green-50 p-6 rounded-xl border border-teal-100 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-5 py-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                      placeholder="Enter username"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Role in Group
                    </label>
                    <input
                      type="text"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-5 py-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                      placeholder="e.g., Team Lead"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddUser}
                    disabled={!newUser.username || !newUser.role}
                    className={`
                      flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium
                      transition-all duration-200 shadow-md hover:shadow-lg
                      ${!newUser.username || !newUser.role
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-teal-500 to-green-500 text-white hover:from-teal-600 hover:to-green-600'
                      }
                    `}
                  >
                    <UserPlus size={18} />
                    Add Member
                  </button>
                </div>
              </div>

              {/* Members List */}
              {formData.members.length > 0 ? (
                <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Role</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formData.members.map((member, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-green-400 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                {getInitials(member.username)}
                              </div>
                              <span className="font-medium text-gray-800">{member.username}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveUser(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                              title="Remove member"
                            >
                              <X size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <Users size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No members added yet</p>
                  <p className="text-sm text-gray-400 mt-1">Add members using the form above</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-8 py-3.5 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-medium"
              >
                <X size={18} />
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:from-teal-600 hover:to-green-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                <Check size={18} />
                {editGroup ? "Update Group" : "Create Group"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[400px] text-center relative shadow-2xl animate-[scaleIn_0.3s_ease-out]">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white text-4xl shadow-lg">
              ✓
            </div>

            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              {editGroup ? "Group Updated!" : "Group Created!"}
            </h2>
            
            <p className="text-gray-600 mb-4">
              <span className="font-semibold text-teal-600">“{formData.groupName}”</span> has been saved successfully.
            </p>

            <p className="text-sm text-gray-400">
              Redirecting to groups list...
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-green-500 h-1 rounded-full animate-[progress_2s_ease-in-out]"></div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animations */}
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default AddGroup;