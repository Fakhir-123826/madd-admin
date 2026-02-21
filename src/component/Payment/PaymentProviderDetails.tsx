import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiEdit2, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { X } from "lucide-react";

const PaymentProviderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider;

  // State for modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // If no provider data, redirect to list
  if (!provider) {
    navigate('/payment-providers');
    return null;
  }

  const handleBack = () => {
    navigate('/payment-providers');
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    // Here you would typically delete from backend
    console.log("Deleting provider:", provider);
    setShowSuccessModal(true);
    
    // Auto close success modal and redirect after 2 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate('/payment-providers');
    }, 2000);
  };


  const handleTestConnection = () => {
    console.log("Testing connection for:", provider.name);
    alert("Connection test successful! (Demo)");
  };

  return (
    <div className="p-6 bg-white rounded-xl min-h-screen">
      
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-200 rounded-lg transition"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          Payment Provider Management
        </h1>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-400 to-green-400 px-6 py-4">
          <h2 className="text-white font-semibold text-lg">
            Provider Details
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 bg-gray-50">
          
          <div className="grid grid-cols-4 gap-y-6 gap-x-10 text-sm">
            
            {/* Row 1 */}
            <div>
              <p className="text-gray-500">Provider Name</p>
              <p className="font-medium text-gray-800 mt-1">{provider.name}</p>
            </div>

            <div>
              <p className="text-gray-500">Type</p>
              <p className="font-medium text-gray-800 mt-1">
                {provider.type}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Mode</p>
              <p className="font-medium text-gray-800 mt-1">{provider.mode}</p>
            </div>

            <div>
              <p className="text-gray-500">Update Status</p>
              <span className={`inline-block mt-2 px-4 py-1 rounded-full text-xs font-medium ${
                provider.status === "Active" 
                  ? "bg-green-100 text-green-600" 
                  : "bg-red-100 text-red-600"
              }`}>
                {provider.status}
              </span>
            </div>

            {/* Row 2 */}
            <div>
              <p className="text-gray-500">Region</p>
              <p className="font-medium text-gray-800 mt-1">Global</p>
            </div>

            <div>
              <p className="text-gray-500">Currency</p>
              <p className="font-medium text-gray-800 mt-1">USDT</p>
            </div>

            <div>
              <p className="text-gray-500">API Key</p>
              <p className="font-medium text-gray-800 mt-1">
                #768usgd46
              </p>
            </div>

            <div>
              <p className="text-gray-500">Webhook URL</p>
              <p className="font-medium text-gray-800 mt-1">
                URL Here
              </p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-6 text-xs text-gray-500">
            Last updated: 23 July 2025
          </div>

          {/* Buttons */}
          <div className="mt-6 flex items-center justify-between">
            
            {/* Left Button */}
            <button 
              onClick={handleTestConnection}
              className="px-5 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
            >
              Test Connection
            </button>

            {/* Right Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={handleDeleteClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
              >
                <FiTrash2 size={16} />
                Delete Provider
              </button>

              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition"
              >
                <FiEdit2 size={16} />
                Edit provider
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[400px] text-center relative shadow-2xl animate-fadeIn">
            
            {/* Close button */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Bin Icon */}
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center">
              <FiTrash2 className="text-red-500" size={40} />
            </div>

            {/* Confirmation Text */}
            <p className="text-gray-700 text-lg font-bold mb-2">
              Are you sure want to delete this Provider?
            </p>
            <p className="text-gray-500 text-sm mb-8">
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-8 py-2.5 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium w-24"
              >
                No
              </button>

              <button
                onClick={handleConfirmDelete}
                className="px-8 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md w-24"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[450px] text-center relative shadow-2xl animate-fadeIn">
            
            {/* Close button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Tick Icon */}
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white text-4xl shadow-lg">
              ✓
            </div>

            {/* Success Content */}
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Provider Deleted!
            </h2>
            
            <p className="text-gray-600 text-lg mb-2">
              Provider <span className="font-semibold text-teal-600">“{provider.name}”</span>
            </p>
            <p className="text-gray-500 mb-4">
              has been successfully deleted.
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-green-500 h-1 rounded-full animate-progress"></div>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Redirecting to providers list...
            </p>
          </div>
        </div>
      )}

      {/* Add custom animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-progress {
          animation: progress 2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentProviderDetails;