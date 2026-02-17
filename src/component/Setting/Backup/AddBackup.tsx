import React, { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackupFormData {
  backupType: string;
  infoText: string;
}

const AddBackup: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState<BackupFormData>({
    backupType: "",
    infoText: "",
  });

  const [errors, setErrors] = useState<Partial<BackupFormData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof BackupFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<BackupFormData> = {};
    
    if (!formData.backupType) {
      newErrors.backupType = "Backup type is required";
    }
    if (!formData.infoText.trim()) {
      newErrors.infoText = "Info text is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log("Starting backup with:", formData);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/backups');
      }, 2000);
    }
  };

  const handleCancel = () => {
    navigate('/backups');
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/backups');
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-4 md:p-8">
      <div className="w-full">
        
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-4 rounded-t-2xl flex items-center gap-4 shadow-lg">
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white font-semibold text-xl tracking-wide">
            Create New Backup
          </h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8 border-x border-b border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Backup Information Section */}
            <div>
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
                <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
                Backup Information
              </h2>

              {/* Backup Type */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Backup Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="backupType"
                    value={formData.backupType}
                    onChange={handleChange}
                    className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white appearance-none ${
                      errors.backupType ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <option value="">Select backup type</option>
                    <option value="Database">Database</option>
                    <option value="Full Backup">Full Backup</option>
                    <option value="Files only">Files only</option>
                    <option value="Settings only">Settings only</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    ▼
                  </span>
                </div>
                {errors.backupType && (
                  <p className="text-red-500 text-xs mt-1">{errors.backupType}</p>
                )}
              </div>

              {/* Info Text */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Info Text <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="infoText"
                    value={formData.infoText}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter backup description or notes..."
                    className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white resize-none ${
                      errors.infoText ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {formData.infoText && !errors.infoText && (
                    <span className="absolute right-4 top-4 text-green-500">✓</span>
                  )}
                </div>
                {errors.infoText && (
                  <p className="text-red-500 text-xs mt-1">{errors.infoText}</p>
                )}
              </div>
            </div>

            {/* Note Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-amber-500 font-bold text-lg">!</span>
                <div>
                  <h3 className="text-sm font-bold text-amber-800 mb-1">Important Note</h3>
                  <p className="text-xs text-amber-700">
                    Creating a backup may take several minutes. Do not close the browser
                    or shut down the server during this process.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-8">
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
                Start Backup
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[450px] text-center relative shadow-2xl animate-fadeIn">
            
            {/* Close button */}
            <button
              onClick={handleCloseSuccessModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white text-4xl shadow-lg">
              ✓
            </div>

            {/* Success Content */}
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Backup Started!
            </h2>
            
            <p className="text-gray-600 mb-2 text-lg font-normal">
              Your backup has been <span className="font-semibold text-teal-600">initiated</span>
            </p>
            <p className="text-gray-500 font-normal mb-4">
              You'll be notified when it's complete.
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-green-500 h-1 rounded-full animate-progress"></div>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Redirecting to backups list...
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

export default AddBackup;