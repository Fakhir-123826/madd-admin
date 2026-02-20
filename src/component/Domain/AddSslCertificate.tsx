import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUploadCloud, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const AddSslCertificate: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState("myshop.com");
  const [autoInstall, setAutoInstall] = useState(false);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleAutoInstall = () => {
    setAutoInstall(true);
    console.log("Auto SSL installation started for:", selectedDomain);
    // Simulate installation process
    setTimeout(() => {
      setAutoInstall(false);
      // Show success message or redirect
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-4 md:p-8">
      <div className="mx-auto">
        
        {/* Header with Gradient - Same as other forms */}
        <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-4 rounded-t-2xl flex items-center gap-4 shadow-lg">
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-white font-semibold text-xl tracking-wide">
            Install SSL Certificate
          </h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8 border-x border-b border-gray-200">
          
          {/* Domain Selection Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
              <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
              Domain Information
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {/* Domain Selection */}
              <div className="col-span-2 md:col-span-1 space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Select Domain <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white"
                  >
                    <option value="myshop.com">myshop.com</option>
                    <option value="jhonsmith.com">jhonsmith.com</option>
                    <option value="test.com">test.com</option>
                  </select>
                  <FiArrowLeft className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Current Status */}
              <div className="col-span-2 md:col-span-1 space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Current Status
                </label>
                <div className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 bg-gray-50 flex items-center gap-3">
                  <FiAlertCircle className="text-red-500" size={18} />
                  <span className="text-sm text-gray-700">Not Installed</span>
                  <span className="ml-auto bg-red-100 text-red-600 text-xs px-3 py-1.5 rounded-full font-medium">
                    Inactive
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Auto SSL Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
              <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
              Auto SSL (Recommended)
            </h2>

            <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-teal-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-teal-100 p-3 rounded-full">
                  <FiCheckCircle className="text-teal-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">
                    Let's Encrypt SSL
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    We'll install a free SSL certificate for your domain using Let's Encrypt.
                    This process usually takes less than a minute and automatically renews.
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleAutoInstall}
                      disabled={autoInstall}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:from-teal-600 hover:to-green-600 transition-all duration-300 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {autoInstall ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Installing...
                        </>
                      ) : (
                        'Auto Install SSL'
                      )}
                    </button>
                    <span className="text-xs text-gray-500">
                      ✓ Free & automatically renewed
                    </span>
                  </div>

                  <div className="mt-4 bg-white/50 rounded-lg p-3 border border-teal-200">
                    <p className="text-xs text-gray-600 flex items-center gap-2">
                      <FiAlertCircle className="text-teal-500" size={14} />
                      Auto SSL works only if your domain is correctly pointed to our server with valid A/AAAA records.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Upload Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
              <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
              Manual Certificate Upload
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* CRT File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 hover:border-teal-400 transition-all duration-300 cursor-pointer group">
                <FiUploadCloud className="mx-auto text-gray-400 group-hover:text-teal-500 transition-colors" size={32} />
                <p className="text-sm font-medium text-gray-700 mt-3 mb-1">
                  Certificate File
                </p>
                <p className="text-xs text-gray-400">
                  .crt or .pem
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Drag & drop or click to upload
                </p>
              </div>

              {/* KEY File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 hover:border-teal-400 transition-all duration-300 cursor-pointer group">
                <FiUploadCloud className="mx-auto text-gray-400 group-hover:text-teal-500 transition-colors" size={32} />
                <p className="text-sm font-medium text-gray-700 mt-3 mb-1">
                  Private Key File
                </p>
                <p className="text-xs text-gray-400">
                  .key
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Drag & drop or click to upload
                </p>
              </div>

              {/* CA Bundle Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 hover:border-teal-400 transition-all duration-300 cursor-pointer group">
                <FiUploadCloud className="mx-auto text-gray-400 group-hover:text-teal-500 transition-colors" size={32} />
                <p className="text-sm font-medium text-gray-700 mt-3 mb-1">
                  CA Bundle (Optional)
                </p>
                <p className="text-xs text-gray-400">
                  .ca-bundle
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Drag & drop or click to upload
                </p>
              </div>

            </div>

            {/* Manual Upload Help Text */}
            <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600 flex items-center gap-2">
                <FiAlertCircle className="text-gray-400" size={14} />
                If you have purchased an SSL certificate from a third-party provider, upload the files here.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
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
              Install Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSslCertificate;