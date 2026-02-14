import React, { useState } from 'react';
import { ArrowLeft } from "lucide-react";

interface AddRoleProps {
  onSave: (role: any) => void;
  onCancel: () => void;
  editRole?: any;
}

function AddRole({ onSave, onCancel, editRole }: AddRoleProps) {
  const [formData, setFormData] = useState({
    roleName: editRole?.roleName || "Super Admin",
    roleDescription: editRole?.roleDescription || "",
    permissions: {
      catalog: {
        view: true,
        edit: true,
        delete: true
      },
      stores: {
        view: true,
        edit: true,
        delete: true
      },
      orders: {
        view: true,
        edit: true,
        delete: true
      }
    }
  });

  const handlePermissionChange = (category: string, permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [category]: {
          ...prev.permissions[category as keyof typeof prev.permissions],
          [permission]: !prev.permissions[category as keyof typeof prev.permissions][permission as keyof typeof prev.permissions[keyof typeof prev.permissions]]
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: Date.now(),
      usersAssigned: "0 users"
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Edit Role</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Role Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role Name
          </label>
          <input
            type="text"
            value={formData.roleName}
            onChange={(e) => setFormData({...formData, roleName: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Role Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role Description <span className="text-gray-400">(100 words max)</span>
          </label>
          <textarea
            value={formData.roleDescription}
            onChange={(e) => setFormData({...formData, roleDescription: e.target.value})}
            rows={4}
            placeholder="Description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Permissions Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Permissions</h2>
          
          {/* Catalog Permissions */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-3">Catalog Permissions:</h3>
            <div className="space-y-3 ml-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.permissions.catalog.view}
                  onChange={() => handlePermissionChange('catalog', 'view')}
                  className="w-4 h-4 text-teal-500 rounded focus:ring-teal-400"
                />
                <span className="text-gray-700">View Products</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.permissions.catalog.edit}
                  onChange={() => handlePermissionChange('catalog', 'edit')}
                  className="w-4 h-4 text-teal-500 rounded focus:ring-teal-400"
                />
                <span className="text-gray-700">Edit Products</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.permissions.catalog.delete}
                  onChange={() => handlePermissionChange('catalog', 'delete')}
                  className="w-4 h-4 text-teal-500 rounded focus:ring-teal-400"
                />
                <span className="text-gray-700">Delete Products</span>
              </label>
            </div>
          </div>

          {/* Stores Permissions */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-3">Stores Permissions:</h3>
            <div className="space-y-3 ml-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.permissions.stores.view}
                  onChange={() => handlePermissionChange('stores', 'view')}
                  className="w-4 h-4 text-teal-500 rounded focus:ring-teal-400"
                />
                <span className="text-gray-700">View Stores</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.permissions.stores.edit}
                  onChange={() => handlePermissionChange('stores', 'edit')}
                  className="w-4 h-4 text-teal-500 rounded focus:ring-teal-400"
                />
                <span className="text-gray-700">Edit Stores</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.permissions.stores.delete}
                  onChange={() => handlePermissionChange('stores', 'delete')}
                  className="w-4 h-4 text-teal-500 rounded focus:ring-teal-400"
                />
                <span className="text-gray-700">Delete Stores</span>
              </label>
            </div>
          </div>

          {/* Orders Permissions */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-3">Orders Permissions:</h3>
            <div className="space-y-3 ml-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.permissions.orders.view}
                  onChange={() => handlePermissionChange('orders', 'view')}
                  className="w-4 h-4 text-teal-500 rounded focus:ring-teal-400"
                />
                <span className="text-gray-700">View Orders</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.permissions.orders.edit}
                  onChange={() => handlePermissionChange('orders', 'edit')}
                  className="w-4 h-4 text-teal-500 rounded focus:ring-teal-400"
                />
                <span className="text-gray-700">Edit Orders</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.permissions.orders.delete}
                  onChange={() => handlePermissionChange('orders', 'delete')}
                  className="w-4 h-4 text-teal-500 rounded focus:ring-teal-400"
                />
                <span className="text-gray-700">Delete Orders</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-teal-400 to-green-400 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRole;