import React, { useState } from "react";
import { ArrowLeft, Pencil, X, Check, Save } from "lucide-react";

interface RoleDetailsProps {
  role: any;
  onBack: () => void;
  onSave?: (updatedRole: any) => void;
}

function RoleDetails({ role, onBack, onSave }: RoleDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    roleName: role.roleName,
    description: role.description || "Lorem ipsum, placeholder or dummy text used in typesetting and graphic design for previewing layouts. It features scrambled Latin text, which emphasizes the design over content of the layout.",
  });
  const [permissions, setPermissions] = useState({
    catalog: { view: true, edit: true, delete: false },
    stores: { view: true, edit: true, delete: false },
    orders: { view: true, edit: true, delete: false }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePermissionToggle = (category: string, permission: string) => {
    setPermissions((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permission]: !prev[category][permission]
      }
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...role,
        ...form,
        permissions
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({
      roleName: role.roleName,
      description: role.description || "Lorem ipsum, placeholder or dummy text used in typesetting and graphic design for previewing layouts. It features scrambled Latin text, which emphasizes the design over content of the layout.",
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
              title="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-white font-semibold text-lg tracking-wide">
              {isEditing ? "Edit Role" : "Role Details"}
            </h1>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-teal-600 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Pencil size={16} />
              Edit Role
            </button>
          )}
        </div>

        <div className="p-6 md:p-8">

          {/* ================= VIEW MODE ================= */}
          {!isEditing && (
            <>
              {/* Role Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-teal-50 p-5 rounded-xl border border-teal-100">
                  <p className="text-xs uppercase tracking-wider text-teal-600 font-semibold mb-2">Role Name</p>
                  <p className="font-bold text-xl text-gray-800">{role.roleName}</p>
                </div>
                <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                  <p className="text-xs uppercase tracking-wider text-green-600 font-semibold mb-2">Assigned Users</p>
                  <p className="font-bold text-xl text-gray-800">{role.usersAssigned || "0 users"}</p>
                </div>
              </div>

              {/* Description Card */}
              <div className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-teal-500 rounded-full"></span>
                  Role Description
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {form.description}
                </p>
              </div>

              <PermissionsView permissions={permissions} />
            </>
          )}

          {/* ================= EDIT MODE ================= */}
          {isEditing && (
            <>
              {/* Role Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="roleName"
                  value={form.roleName}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-gray-50"
                  placeholder="Enter role name"
                />
              </div>

              {/* Description Textarea */}
              <div className="mb-10">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role Description <span className="text-gray-400 text-xs">(100 words max)</span>
                </label>
                <textarea
                  name="description"
                  rows={5}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-gray-50 resize-none"
                  placeholder="Enter role description"
                />
              </div>

              <PermissionsEdit permissions={permissions} onToggle={handlePermissionToggle} />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-10 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg order-2 sm:order-1"
                >
                  <X size={18} />
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg order-1 sm:order-2"
                >
                  <Save size={18} />
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

/* View Permissions with Better UI */
function PermissionsView({ permissions }: any) {
  const categories = [
    { title: "Catalog Permissions:", key: "catalog", items: ["View Products", "Edit Products", "Delete Products"] },
    { title: "Stores Permissions:", key: "stores", items: ["View Stores", "Edit Stores", "Delete Stores"] },
    { title: "Orders Permissions:", key: "orders", items: ["View Orders", "Edit Orders", "Delete Orders"] }
  ];

  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-5 flex items-center gap-2">
        <span className="w-1 h-6 bg-green-500 rounded-full"></span>
        Permissions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.key} className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <p className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">
              {cat.title}
            </p>
            <div className="space-y-3">
              {cat.items.map((item, idx) => {
                const permKey = item.split(' ')[0].toLowerCase();
                const isActive = permissions[cat.key]?.[permKey] || 
                                (permKey === 'delete' ? false : true);
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-teal-500' : 'bg-gray-300'
                    }`}>
                      {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Edit Permissions with Toggle */
function PermissionsEdit({ permissions, onToggle }: any) {
  const categories = [
    { title: "Catalog Permissions", key: "catalog", items: ["view", "edit", "delete"] },
    { title: "Stores Permissions", key: "stores", items: ["view", "edit", "delete"] },
    { title: "Orders Permissions", key: "orders", items: ["view", "edit", "delete"] }
  ];

  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-5 flex items-center gap-2">
        <span className="w-1 h-6 bg-green-500 rounded-full"></span>
        Permissions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.key} className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <p className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">
              {cat.title}:
            </p>
            <div className="space-y-4">
              {cat.items.map((perm) => (
                <div key={perm} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">{perm} Products</span>
                  <Toggle 
                    enabled={permissions[cat.key]?.[perm] || false} 
                    onToggle={() => onToggle(cat.key, perm)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Improved Toggle Switch */
function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
        enabled ? "bg-teal-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${
          enabled ? "translate-x-6" : ""
        }`}
      />
    </button>
  );
}

export default RoleDetails;