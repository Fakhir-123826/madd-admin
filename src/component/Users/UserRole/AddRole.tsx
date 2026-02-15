import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function AddRole() {
  const navigate = useNavigate();
  const location = useLocation();
  const editRole = location.state?.role;

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    roleName: editRole?.roleName || "Super Admin",
    roleDescription: editRole?.roleDescription || "",
    permissions: {
      catalog: { view: true, edit: false, delete: false },
      stores: { view: true, edit: false, delete: false },
      orders: { view: true, edit: false, delete: false }
    }
  });

  const handlePermissionChange = (category: string, permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [category]: {
          ...prev.permissions[category as keyof typeof prev.permissions],
          [permission]:
            !prev.permissions[category as keyof typeof prev.permissions][
              permission as keyof typeof prev.permissions[keyof typeof prev.permissions]
            ]
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      navigate("/usersroles");
    }, 2500);
  };

  const handleCancel = () => {
    navigate("/usersroles");
  };

  // 🔥 Smooth Premium Toggle
  const Toggle = ({
    checked,
    onChange
  }: {
    checked: boolean;
    onChange: () => void;
  }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-14 h-7 rounded-full transition-all duration-500 ease-in-out ${
        checked
          ? "bg-gradient-to-r from-teal-500 to-green-500 shadow-md shadow-teal-300/50"
          : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-500 ease-in-out ${
          checked ? "translate-x-7 scale-105" : ""
        }`}
      />
    </button>
  );

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
            {editRole ? "Edit Role" : "Add New Role"}
          </h1>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit}>
            {/* Role Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.roleName}
                onChange={(e) =>
                  setFormData({ ...formData, roleName: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-300"
                required
              />
            </div>

            {/* Role Description */}
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Description{" "}
                <span className="text-gray-400 text-xs">(100 words max)</span>
              </label>
              <textarea
                rows={4}
                value={formData.roleDescription}
                onChange={(e) =>
                  setFormData({ ...formData, roleDescription: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-300 resize-none"
              />
            </div>

            {/* Permissions */}
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
              Permissions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {["catalog", "stores", "orders"].map((section) => (
                <div
                  key={section}
                  className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-gray-700 mb-5 text-sm uppercase tracking-wider">
                    {section} Permissions:
                  </h3>

                  <div className="space-y-5">
                    {["view", "edit", "delete"].map((perm) => (
                      <div
                        key={perm}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-700 capitalize">
                          {perm}{" "}
                          {section === "catalog"
                            ? "Products"
                            : section === "stores"
                            ? "Stores"
                            : "Orders"}
                        </span>
                        <Toggle
                          checked={
                            formData.permissions[
                              section as keyof typeof formData.permissions
                            ][perm as "view" | "edit" | "delete"]
                          }
                          onChange={() =>
                            handlePermissionChange(section, perm)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-10 border-t mt-10">
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
                {editRole ? "Update Role" : "Save Role"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 🔥 Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[400px] text-center relative shadow-xl animate-[scaleIn_0.3s_ease-out]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-sky-500 flex items-center justify-center text-white text-4xl shadow-md">
              ✓
            </div>

            <h2 className="text-xl font-semibold mb-2">Role Created!</h2>
            <p className="text-gray-600">
              New role “{formData.roleName}” has been created
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddRole;
