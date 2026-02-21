import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiArrowLeft } from "react-icons/fi";

const AddDnsRecord: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    recordType: "",
    host: "",
    value: "",
    ttl: ""
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

  return (
    <div className="min-h-screen bg-white rounded-xl p-4 md:p-8">
      <div className=" mx-auto">
        
        {/* Header with Gradient - Same as AddUser */}
        <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-4 rounded-t-2xl flex items-center gap-4 shadow-lg">
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-white font-semibold text-xl tracking-wide">
            Add New DNS Record
          </h1>
        </div>

        {/* Main Form Card - Same as AddUser */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8 border-x border-b border-gray-200">
          <form onSubmit={handleSubmit}>
            
            {/* DNS Record Info Section */}
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
              <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
              DNS Record Information
            </h2>

            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Record Type */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Record Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="recordType"
                    value={formData.recordType}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white"
                    required
                  >
                    <option value="">Select Record Type</option>
                    <option value="A">A - IPv4 Address</option>
                    <option value="AAAA">AAAA - IPv6 Address</option>
                    <option value="CNAME">CNAME - Canonical Name</option>
                    <option value="TXT">TXT - Text Record</option>
                    <option value="MX">MX - Mail Exchange</option>
                    <option value="NS">NS - Name Server</option>
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  {formData.recordType && (
                    <span className="absolute right-12 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                  )}
                </div>
              </div>

              {/* TTL */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  TTL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="ttl"
                    value={formData.ttl}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white"
                    required
                  >
                    <option value="">Select TTL</option>
                    <option value="3600">1 Hour (3600)</option>
                    <option value="7200">2 Hours (7200)</option>
                    <option value="14400">4 Hours (14400)</option>
                    <option value="43200">12 Hours (43200)</option>
                    <option value="86400">24 Hours (86400)</option>
                    <option value="172800">48 Hours (172800)</option>
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  {formData.ttl && (
                    <span className="absolute right-12 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  TTL determines how long the record is cached
                </p>
              </div>

              {/* Host - Full Width */}
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Host <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="host"
                    value={formData.host}
                    onChange={handleChange}
                    placeholder="e.g., www, @, mail"
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white"
                    required
                  />
                  {formData.host && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">Use @ for root domain</p>
              </div>

              {/* Value - Full Width */}
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Value <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="Enter IP address or target"
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white"
                    required
                  />
                  {formData.value && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Same as AddUser */}
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
                Add Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDnsRecord;