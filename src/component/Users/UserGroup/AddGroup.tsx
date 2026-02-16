import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function AddGroup() {
  const navigate = useNavigate();
  const location = useLocation();
  const editGroup = location.state?.group;

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    groupName: editGroup?.groupName || "",
    groupDescription: editGroup?.groupDescription || "",
    defaultRole: editGroup?.defaultRole || "",
    members: editGroup?.members || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      navigate("/usersgroup");
    }, 2500);
  };

  const handleCancel = () => {
    navigate("/usersgroup");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-4 flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white font-semibold text-xl">
            {editGroup ? "Edit Group" : "Add New Group"}
          </h1>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit}>
            {/* Group Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.groupName}
                onChange={(e) =>
                  setFormData({ ...formData, groupName: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-300"
                placeholder="Enter group name"
                required
              />
            </div>

            {/* Group Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Description{" "}
                <span className="text-gray-400 text-xs">(100 words max)</span>
              </label>
              <textarea
                rows={4}
                value={formData.groupDescription}
                onChange={(e) =>
                  setFormData({ ...formData, groupDescription: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-300 resize-none"
                placeholder="Enter group description"
              />
            </div>

            {/* Default Role */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Role <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.defaultRole}
                onChange={(e) =>
                  setFormData({ ...formData, defaultRole: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-300 bg-white"
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
            </div>

            {/* Assigned Users Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
                Assign Users
              </h2>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <p className="text-gray-500 text-center py-8">
                  User selection interface will be integrated here
                  {/* This is where you'd add a multi-select user picker */}
                </p>
                
                {/* Example of how users might appear */}
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-green-400 rounded-full flex items-center justify-center text-white font-semibold">
                        JS
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">John Smith</p>
                        <p className="text-xs text-gray-500">john.smith@example.com</p>
                      </div>
                    </div>
                    <button className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                        SJ
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Sarah Johnson</p>
                        <p className="text-xs text-gray-500">sarah.j@example.com</p>
                      </div>
                    </div>
                    <button className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                  </div>
                </div>
                
                <button className="mt-4 w-full py-3 border-2 border-dashed border-teal-400 text-teal-600 rounded-xl hover:bg-teal-50 transition-all duration-300 font-medium">
                  + Add Users to Group
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:from-teal-600 hover:to-green-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                {editGroup ? "Update Group" : "Save Group"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[400px] text-center relative shadow-xl animate-[scaleIn_0.3s_ease-out]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-teal-500 flex items-center justify-center text-white text-4xl shadow-md">
              ✓
            </div>

            <h2 className="text-xl font-semibold mb-2">Group Created!</h2>
            <p className="text-gray-600">
              New group “{formData.groupName}” has been created
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddGroup;