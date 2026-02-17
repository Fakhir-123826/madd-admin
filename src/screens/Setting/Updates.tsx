import React, { useState } from "react";
import { RefreshCw, Download, X } from "lucide-react";

const Updates = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCheckUpdates = () => {
    // Simulate checking for updates
    setShowUpdateModal(true);
  };

  const handleUpdateNow = () => {
    setIsUpdating(true);
    setShowUpdateModal(false);
    
    // Simulate update process
    setTimeout(() => {
      setIsUpdating(false);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-6">Updates</h2>

      {/* Main Card */}
      <div className="border-2 border-gray-100 rounded-xl p-6">
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Version */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Current Version
            </p>
            <p className="mt-2 text-xl font-semibold text-gray-800">v2.1.4</p>
          </div>

          {/* Last Update Date */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Last Update Date
            </p>
            <p className="mt-2 text-lg font-medium text-gray-700">
              23 July 2025
            </p>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Status
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Up-to-date
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200" />

        {/* Release Notes */}
        <div>
          <p className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-teal-500 rounded-full"></span>
            Release Notes
          </p>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">•</span>
                Added export to PDF in reports
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">•</span>
                Improved tree view performance
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">•</span>
                Fixed login bug for partner users
              </li>
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => setShowUpdateModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 border-2 border-teal-500 text-teal-500 rounded-xl hover:bg-teal-50 transition-all duration-200 font-medium"
          >
            <Download size={16} />
            Update Now
          </button>

          <button
            onClick={handleCheckUpdates}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:from-teal-600 hover:to-green-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            <RefreshCw size={16} />
            Check for updates
          </button>
        </div>
      </div>

      {/* Update Available Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px] text-center relative shadow-2xl animate-fadeIn">
            
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
              <Download className="text-teal-600" size={28} />
            </div>

            <h3 className="text-xl font-semibold mb-2">Update Available</h3>
            <p className="text-gray-600 mb-4">
              Version <span className="font-semibold text-teal-600">v2.2.0</span> is ready to install
            </p>
            
            <div className="bg-gray-50 rounded-xl p-3 mb-5 text-left">
              <p className="text-xs font-bold text-gray-500 mb-2">What's new:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• New dashboard widgets</li>
                <li>• Performance improvements</li>
                <li>• Bug fixes</li>
              </ul>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-5 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-medium"
              >
                Later
              </button>
              <button
                onClick={handleUpdateNow}
                className="px-5 py-2 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-lg hover:from-teal-600 hover:to-green-600 font-medium shadow-md"
              >
                Update Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Updating Modal */}
      {isUpdating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-[350px] text-center shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-teal-500"></div>
            </div>
            <h3 className="text-lg font-semibold mb-1">Updating...</h3>
            <p className="text-sm text-gray-500">Please wait while we install the latest version</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-[350px] text-center shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white text-3xl">
              ✓
            </div>
            <h3 className="text-lg font-semibold mb-1">Update Complete!</h3>
            <p className="text-sm text-gray-500">Your system is now up-to-date</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Updates;