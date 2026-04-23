import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiShield, FiLock } from "react-icons/fi";
import { 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useGetUserQuery,
  useDeleteUserMutation
} from '../../app/api/UserSlices/UserApi';
import { ROUTES } from '../../router';

interface CreateUserPayload {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  phone?: string;  // Make phone optional for updates
  user_type: string;
  country_code: string;
  locale: string;
  timezone: string;
  status: string;
  roles: string[];
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  user_type: string;
  status: string;
  country_code: string;
  locale: string;
  timezone: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  is_kyc_verified: boolean;
}

// Store original data to detect changes
interface OriginalUserData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_type: string;
  status: string;
  country_code: string;
  locale: string;
  timezone: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  is_kyc_verified: boolean;
}

const UserCreate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const { data: userData, isLoading: isLoadingUser } = useGetUserQuery(id!, {
    skip: !isEditMode,
  });
  
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    user_type: "user",
    status: "active",
    country_code: "PK",
    locale: "en",
    timezone: "UTC",
    is_email_verified: false,
    is_phone_verified: false,
    is_kyc_verified: false,
  });

  const [originalData, setOriginalData] = useState<OriginalUserData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // Load user data for edit mode
  useEffect(() => {
    if (userData?.data?.user && isEditMode) {
      const user = userData.data.user;
      console.log("Loading user data:", user);
      
      const newFormData = {
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        password: "",
        phone: user.phone || "",
        user_type: user.user_type || "user",
        status: user.status || "active",
        country_code: user.country_code || "PK",
        locale: user.locale || "en",
        timezone: user.timezone || "UTC",
        is_email_verified: user.is_email_verified || false,
        is_phone_verified: user.is_phone_verified || false,
        is_kyc_verified: user.is_kyc_verified || false,
      };
      
      setFormData(newFormData);
      
      // Store original data to detect changes
      setOriginalData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        user_type: user.user_type || "user",
        status: user.status || "active",
        country_code: user.country_code || "PK",
        locale: user.locale || "en",
        timezone: user.timezone || "UTC",
        is_email_verified: user.is_email_verified || false,
        is_phone_verified: user.is_phone_verified || false,
        is_kyc_verified: user.is_kyc_verified || false,
      });
    }
  }, [userData, isEditMode]);

  // Transform the form data to match the API payload
  const transformFormData = (data: FormData): CreateUserPayload => {
    const payload: CreateUserPayload = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      user_type: data.user_type,
      country_code: data.country_code || 'PK',
      locale: data.locale || 'en',
      timezone: data.timezone || 'UTC',
      status: data.status,
      roles: [data.user_type],
    };
    
    // For edit mode, only include phone if it has changed
    if (isEditMode) {
      if (data.phone && originalData && data.phone !== originalData.phone) {
        payload.phone = data.phone;
      }
    } else {
      // For create mode, always include phone
      if (data.phone) {
        payload.phone = data.phone;
      }
    }
    
    // Only include password for create mode or if changed in edit mode
    if (!isEditMode || data.password) {
      payload.password = data.password;
    }
    
    return payload;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.first_name?.trim()) {
      newErrors.first_name = "First name is required";
    }
    
    if (!formData.last_name?.trim()) {
      newErrors.last_name = "Last name is required";
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Only validate password for create mode
    if (!isEditMode) {
      if (!formData.password?.trim()) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      const payload = transformFormData(formData);
      console.log("Sending payload:", payload);
      
      if (isEditMode) {
        await updateUser({ id: id!, data: payload }).unwrap();
        showToast("success", "User updated successfully!");
      } else {
        await createUser(payload).unwrap();
        showToast("success", "User created successfully!");
      }
      
      setTimeout(() => {
        navigate(ROUTES.USER_LIST);
      }, 1500);
    } catch (error: any) {
      console.error('Failed to save user:', error);
      if (error?.data?.errors) {
        const backendErrors = error.data.errors;
        const formattedErrors: Record<string, string> = {};
        Object.keys(backendErrors).forEach(key => {
          formattedErrors[key] = backendErrors[key][0];
        });
        setErrors(formattedErrors);
        showToast("error", "Please fix the validation errors");
      } else {
        showToast("error", error?.data?.message || 'Failed to save user');
      }
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteUser(id).unwrap();
      showToast("success", "User deleted successfully!");
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      showToast("error", error?.data?.message || "Failed to delete user");
    }
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  if (isLoadingUser) {
    return (
      <div className="bg-white shadow-sm p-6 rounded-xl">
        <div className="text-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading user details...</p>
        </div>
      </div>
    );
  }

  const isLoading = isCreating || isUpdating || isDeleting;

  return (
    <div className="bg-white shadow-sm p-6 rounded-xl">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
            ${toast.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
            }`}
        >
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.msg}
        </div>
      )}

      {/* HEADER WITH BACK BUTTON */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(ROUTES.USER_LIST)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            ←
          </button>
          <h2 className="text-lg font-semibold">
            {isEditMode ? "Edit User" : "Create New User"}
          </h2>
        </div>
      </div>

      {/* FORM */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-1 h-8 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-full" />
          <h2 className="text-sm font-semibold pl-4">User Information</h2>
        </div>

        {/* FIRST NAME + LAST NAME */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                className="mt-1 w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
            </div>
            {errors.first_name && (
              <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
                className="mt-1 w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
            </div>
            {errors.last_name && (
              <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
            )}
          </div>
        </div>

        {/* EMAIL + PHONE */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="mt-1 w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">
              Phone Number
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="mt-1 w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-xs font-medium text-gray-700">
            Password {!isEditMode && <span className="text-red-500">*</span>}
            {isEditMode && <span className="text-gray-400 text-xs ml-2">(Leave blank to keep current password)</span>}
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isEditMode ? "Enter new password (optional)" : "Enter password (min 8 characters)"}
              className="mt-1 w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* COUNTRY CODE + USER TYPE */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-gray-700">
              Country Code <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="country_code"
                value={formData.country_code}
                onChange={handleChange}
                className="mt-1 w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none bg-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.25rem',
                }}
                disabled={isLoading}
              >
                <option value="PK">Pakistan (PK)</option>
                <option value="US">United States (US)</option>
                <option value="UK">United Kingdom (UK)</option>
                <option value="AE">UAE (AE)</option>
                <option value="SA">Saudi Arabia (SA)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">
              User Type
            </label>
            <div className="relative">
              <FiShield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                className="mt-1 w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none bg-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.25rem',
                }}
                disabled={isLoading}
              >
                <option value="user">User</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            {errors.user_type && (
              <p className="text-red-500 text-xs mt-1">{errors.user_type}</p>
            )}
          </div>
        </div>

        {/* STATUS + LOCALE */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              disabled={isLoading}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">
              Locale
            </label>
            <select
              name="locale"
              value={formData.locale}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              disabled={isLoading}
            >
              <option value="en">English (en)</option>
              <option value="es">Spanish (es)</option>
              <option value="fr">French (fr)</option>
              <option value="de">German (de)</option>
            </select>
          </div>
        </div>

        {/* TIMEZONE */}
        <div>
          <label className="text-xs font-medium text-gray-700">
            Timezone
          </label>
          <select
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            disabled={isLoading}
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Asia/Karachi">Asia/Karachi</option>
          </select>
        </div>

        {/* Verification Section */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Verification Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_email_verified"
                checked={formData.is_email_verified}
                onChange={handleChange}
                className="w-4 h-4 text-teal-500 focus:ring-teal-500"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-700">Email Verified</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_phone_verified"
                checked={formData.is_phone_verified}
                onChange={handleChange}
                className="w-4 h-4 text-teal-500 focus:ring-teal-500"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-700">Phone Verified</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_kyc_verified"
                checked={formData.is_kyc_verified}
                onChange={handleChange}
                className="w-4 h-4 text-teal-500 focus:ring-teal-500"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-700">KYC Verified</span>
            </label>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
          <button
            onClick={() => navigate('/users')}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            )}
            {isEditMode ? "Update User" : "Create User"}
          </button>

          {isEditMode && (
            <button
              onClick={() => setOpen(true)}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              Delete User
            </button>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[400px] rounded-xl bg-white shadow-xl relative transform transition-all">
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-500 rounded-t-xl" />
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                ✕
              </button>
              <div className="text-center pt-8 pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Delete User</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Are you sure you want to delete <span className="font-medium text-gray-700">{formData.first_name} {formData.last_name}</span>?
                  <br />
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCreate;