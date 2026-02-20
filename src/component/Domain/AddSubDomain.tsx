import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiArrowLeft } from "react-icons/fi";

const AddSubdomain: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    subdomainName: "",
    destination: "",
    ssl: "on",
    status: "active"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const toggleSSL = () => {
    setFormData({
      ...formData,
      ssl: formData.ssl === "on" ? "off" : "on"
    });
  };

  const toggleStatus = () => {
    setFormData({
      ...formData,
      status: formData.status === "active" ? "inactive" : "active"
    });
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-4 md:p-8">
      <div className="mx-auto">
        
        {/* Header with Gradient - Same as AddDnsRecord */}
        <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-4 rounded-t-2xl flex items-center gap-4 shadow-lg">
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-white font-semibold text-xl tracking-wide">
            Add New Subdomain
          </h1>
        </div>

        {/* Main Form Card - Same as AddDnsRecord */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8 border-x border-b border-gray-200">
          <form onSubmit={handleSubmit}>
            
            {/* Subdomain Info Section */}
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
              <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
              Subdomain Information
            </h2>

            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Subdomain Name - Full Width */}
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Subdomain Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="subdomainName"
                    value={formData.subdomainName}
                    onChange={handleChange}
                    placeholder="e.g., blog, shop, mail"
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white"
                    required
                  />
                  {formData.subdomainName && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  This will create subdomain like: blog.yourdomain.com
                </p>
              </div>

              {/* Domain Selection */}
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Select Domain <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="domain"
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white"
                    required
                  >
                    <option value="">Select a domain</option>
                    <option value="jhonsmith.com">jhonsmith.com</option>
                    <option value="myshop.com">myshop.com</option>
                    <option value="test.com">test.com</option>
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Destination URL or IP - Full Width */}
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Destination URL or IP Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g., 192.168.1.20 or https://destination.com"
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white"
                    required
                  />
                  {formData.destination && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Enter the IP address or URL where this subdomain should point to
                </p>
              </div>
            </div>

            {/* Additional Settings Section */}
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
              <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
              Additional Settings
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* SSL Toggle */}
              <div className="col-span-2 md:col-span-1 bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      SSL Certificate
                    </label>
                    <p className="text-xs text-gray-500">Enable SSL for secure connection</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${formData.ssl === "on" ? "text-teal-600" : "text-gray-400"}`}>
                      On
                    </span>
                    <div 
                      onClick={toggleSSL}
                      className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-300 ${
                        formData.ssl === "on" ? "bg-teal-500" : "bg-gray-300"
                      }`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                        formData.ssl === "on" ? "right-1" : "left-1"
                      }`} />
                    </div>
                    <span className={`text-sm font-medium ${formData.ssl === "off" ? "text-gray-700" : "text-gray-400"}`}>
                      Off
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="col-span-2 md:col-span-1 bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Subdomain Status
                    </label>
                    <p className="text-xs text-gray-500">Activate or deactivate this subdomain</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${formData.status === "active" ? "text-teal-600" : "text-gray-400"}`}>
                      Active
                    </span>
                    <div 
                      onClick={toggleStatus}
                      className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-300 ${
                        formData.status === "active" ? "bg-teal-500" : "bg-gray-300"
                      }`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                        formData.status === "active" ? "right-1" : "left-1"
                      }`} />
                    </div>
                    <span className={`text-sm font-medium ${formData.status === "inactive" ? "text-gray-700" : "text-gray-400"}`}>
                      Inactive
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Same as AddDnsRecord */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-8 py-3.5 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:from-teal-600 hover:to-green-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                Add Subdomain
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSubdomain;