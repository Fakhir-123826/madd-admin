import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { 
  useGetProfileQuery, 
  useUpdateProfileMutation, 
  useChangePasswordMutation 
} from "../app/api/AuthSlices/AuthSlices";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaCamera, FaSave, FaKey, FaSpinner } from "react-icons/fa";

interface ProfileFormData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

interface PasswordFormData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

const Profile = () => {
  const { data: profileData, isLoading: isFetching } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>();
  const { 
    register: registerPass, 
    handleSubmit: handleSubmitPass, 
    reset: resetPass, 
    formState: { errors: passErrors } 
  } = useForm<PasswordFormData>();

  useEffect(() => {
    if (profileData?.data) {
      reset({
        first_name: profileData.data.first_name,
        last_name: profileData.data.last_name,
        phone: profileData.data.phone || "",
        email: profileData.data.email,
      });
    }
  }, [profileData, reset]);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const onUpdateProfile = async (data: ProfileFormData) => {
    try {
      await updateProfile(data).unwrap();
      showToast("success", "Profile updated successfully!");
    } catch (err: any) {
      showToast("error", err?.data?.message || "Failed to update profile.");
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    try {
      await changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
        new_password_confirmation: data.new_password_confirmation,
      }).unwrap();
      showToast("success", "Password changed successfully!");
      resetPass();
      setIsPassModalOpen(false);
    } catch (err: any) {
      showToast("error", err?.data?.message || "Failed to change password.");
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      {/* Custom Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-500 animate-in slide-in-from-right-full ${
          toast.type === "success" 
            ? "bg-white border-emerald-100 text-emerald-600" 
            : "bg-white border-rose-100 text-rose-600"
        }`}>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
            toast.type === "success" ? "bg-emerald-50" : "bg-rose-50"
          }`}>
            {toast.type === "success" ? <FaSave /> : <FaLock />}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">{toast.type === "success" ? "Success!" : "Error"}</p>
            <p className="text-xs text-gray-500">{toast.text}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="ml-4 text-gray-300 hover:text-gray-500 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Card */}
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600"></div>
        <div className="relative pt-16 pb-8 px-8 flex flex-col md:flex-row items-end gap-6">
          <div className="relative group">
            <div className="h-32 w-32 rounded-2xl bg-white p-1 shadow-xl">
              <div className="h-full w-full rounded-xl bg-gradient-to-br from-sky-100 to-blue-50 flex items-center justify-center text-blue-600 text-4xl font-bold border border-blue-100">
                {profileData?.data?.first_name?.[0]}{profileData?.data?.last_name?.[0]}
              </div>
            </div>
            <button className="absolute -bottom-2 -right-2 p-2.5 bg-white rounded-xl shadow-lg border border-gray-100 hover:bg-gray-50 transition-all hover:scale-110">
              <FaCamera className="text-blue-600 text-sm" />
            </button>
          </div>
          
          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              {profileData?.data?.first_name} {profileData?.data?.last_name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                <FaEnvelope className="text-blue-400" /> {profileData?.data?.email}
              </span>
              {profileData?.data?.phone && (
                <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                  <FaPhone className="text-blue-400" /> {profileData?.data?.phone}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 pb-2">
            {profileData?.data?.roles?.map((role: string) => (
              <span key={role} className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-md shadow-blue-200">
                {role.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <FaUser className="text-blue-600 text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Account Details</h2>
                <p className="text-xs text-gray-400 mt-0.5">Manage your personal information and contact details</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">First Name</label>
                  <input
                    {...register("first_name", { required: "First name is required" })}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    placeholder="Enter first name"
                  />
                  {errors.first_name && <p className="text-xs text-rose-500 ml-1">{errors.first_name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Last Name</label>
                  <input
                    {...register("last_name", { required: "Last name is required" })}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    placeholder="Enter last name"
                  />
                  {errors.last_name && <p className="text-xs text-rose-500 ml-1">{errors.last_name.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email (Read Only)</label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    {...register("email")}
                    disabled
                    className="w-full pl-12 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-not-allowed text-gray-400 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                <div className="relative group">
                  <FaPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    {...register("phone")}
                    className="w-full pl-12 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-500 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isUpdating ? <FaSpinner className="animate-spin" /> : <FaSave className="text-lg" />}
                  Save Information
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Password */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-indigo-50 rounded-xl">
                <FaLock className="text-indigo-600 text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Security</h2>
                <p className="text-xs text-gray-400 mt-0.5">Update your account password</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500 leading-relaxed">
                For your security, we recommend using a strong password that you don't use elsewhere.
              </p>
              <button
                onClick={() => setIsPassModalOpen(true)}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 group"
              >
                <FaKey className="text-lg group-hover:rotate-12 transition-transform" />
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !isChangingPassword && setIsPassModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <FaLock className="text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Update Password</h2>
                    <p className="text-indigo-100 text-xs mt-0.5 font-medium">Secure your account</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPassModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitPass(onChangePassword)} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Current Password</label>
                <input
                  type="password"
                  {...registerPass("current_password", { required: "Current password is required" })}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  placeholder="Enter current password"
                />
                {passErrors.current_password && <p className="text-xs text-rose-500 ml-1">{passErrors.current_password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">New Password</label>
                <input
                  type="password"
                  {...registerPass("new_password", { 
                    required: "New password is required",
                    minLength: { value: 8, message: "Min 8 characters" }
                  })}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  placeholder="Min. 8 characters"
                />
                {passErrors.new_password && <p className="text-xs text-rose-500 ml-1">{passErrors.new_password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Confirm New Password</label>
                <input
                  type="password"
                  {...registerPass("new_password_confirmation", { required: "Please confirm password" })}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  placeholder="Re-enter new password"
                />
                {passErrors.new_password_confirmation && <p className="text-xs text-rose-500 ml-1">{passErrors.new_password_confirmation.message}</p>}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPassModalOpen(false)}
                  disabled={isChangingPassword}
                  className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-[2] px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isChangingPassword ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  Update Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
