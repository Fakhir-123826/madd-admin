import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiX, FiChevronDown } from "react-icons/fi";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

const AddDnsRecord: React.FC<Props> = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the add-dns-record route
  const isRouteOpen = location.pathname === '/add-dns-record';
  const [isModalOpen, setIsModalOpen] = useState(propIsOpen || isRouteOpen);

  useEffect(() => {
    // Update modal state when route changes
    setIsModalOpen(propIsOpen || isRouteOpen);
  }, [propIsOpen, isRouteOpen]);

  const handleClose = () => {
    setIsModalOpen(false);
    if (propOnClose) {
      propOnClose();
    } else {
      // If used as a route, navigate back
      navigate(-1);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Modal */}
      <div className="bg-white w-[450px] rounded-2xl shadow-2xl p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiX size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Add New DNS Record
        </h2>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {/* Record Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Record Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white">
                <option value="">Select Record Type</option>
                <option value="A">A - IPv4 Address</option>
                <option value="AAAA">AAAA - IPv6 Address</option>
                <option value="CNAME">CNAME - Canonical Name</option>
                <option value="TXT">TXT - Text Record</option>
                <option value="MX">MX - Mail Exchange</option>
                <option value="NS">NS - Name Server</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Host */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Host <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., www, @, mail"
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Use @ for root domain</p>
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter IP address or target"
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white"
              />
            </div>
          </div>

          {/* TTL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TTL <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white">
                <option value="">Select TTL</option>
                <option value="3600">1 Hour (3600)</option>
                <option value="7200">2 Hours (7200)</option>
                <option value="14400">4 Hours (14400)</option>
                <option value="43200">12 Hours (43200)</option>
                <option value="86400">24 Hours (86400)</option>
                <option value="172800">48 Hours (172800)</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-5 py-3 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-5 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:from-teal-600 hover:to-green-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Add Record
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddDnsRecord;