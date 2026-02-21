import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";

interface FormData {
  providerName: string;
  apiKey: string;
  currency: string;
  callbackUrl: string;
  status: boolean; // true for Active, false for Inactive
  mode: boolean; // true for Live, false for Sandbox
}

const AddProvider: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    providerName: "Stripe",
    apiKey: "",
    currency: "",
    callbackUrl: "",
    status: true,
    mode: false, // false for Sandbox
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleStatus = () => {
    setFormData(prev => ({ ...prev, status: !prev.status }));
  };

  const toggleMode = () => {
    setFormData(prev => ({ ...prev, mode: !prev.mode }));
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.apiKey.trim()) {
      newErrors.apiKey = "API Key is required";
    }
    if (!formData.currency.trim()) {
      newErrors.currency = "Currency is required";
    }
    if (!formData.callbackUrl.trim()) {
      newErrors.callbackUrl = "Callback URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestConnection = () => {
    console.log("Testing connection with:", formData);
    alert("Connection test successful! (Demo)");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log("Saving provider:", {
        ...formData,
        status: formData.status ? "Active" : "Inactive",
        mode: formData.mode ? "Live" : "Sandbox",
      });
      
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/payment-providers');
      }, 2000);
    }
  };

  const handleCancel = () => {
    navigate('/payment-providers');
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/payment-providers');
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
            Add New Provider
          </h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8 border-x border-b border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Provider Information Section */}
            <div>
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
                <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
                Provider Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Provider Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Provider Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="providerName"
                      value={formData.providerName}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white appearance-none"
                    >
                      <option value="Stripe">Stripe</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Razorpay">Razorpay</option>
                      <option value="PayStack">PayStack</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Currency */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Currency Supported <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      placeholder="e.g., USD, EUR, PKR"
                      className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white ${
                        errors.currency ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {formData.currency && !errors.currency && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                    )}
                  </div>
                  {errors.currency && (
                    <p className="text-red-500 text-xs mt-1">{errors.currency}</p>
                  )}
                </div>

                {/* API Key - Full Width */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    API Key <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="apiKey"
                      value={formData.apiKey}
                      onChange={handleChange}
                      placeholder="Enter your API key"
                      className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white ${
                        errors.apiKey ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {formData.apiKey && !errors.apiKey && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                    )}
                  </div>
                  {errors.apiKey && (
                    <p className="text-red-500 text-xs mt-1">{errors.apiKey}</p>
                  )}
                </div>

                {/* Callback URL - Full Width */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Callback URL <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="callbackUrl"
                      value={formData.callbackUrl}
                      onChange={handleChange}
                      placeholder="https://yourdomain.com/callback"
                      className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white ${
                        errors.callbackUrl ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {formData.callbackUrl && !errors.callbackUrl && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                    )}
                  </div>
                  {errors.callbackUrl && (
                    <p className="text-red-500 text-xs mt-1">{errors.callbackUrl}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status and Mode Toggles - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Toggle */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                  Status
                </h2>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 w-full">
                  <span className={`text-sm font-medium ${!formData.status ? 'text-red-600' : 'text-gray-500'}`}>
                    Inactive
                  </span>
                  
                  <button
                    type="button"
                    onClick={toggleStatus}
                    className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${
                      formData.status ? "bg-teal-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                        formData.status ? "translate-x-7" : "translate-x-0"
                      }`}
                    ></span>
                  </button>
                  
                  <span className={`text-sm font-medium ${formData.status ? 'text-teal-600' : 'text-gray-500'}`}>
                    Active
                  </span>
                </div>
              </div>

              {/* Mode Toggle */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                  Mode
                </h2>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 w-full">
                  <span className={`text-sm font-medium ${!formData.mode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Sandbox
                  </span>
                  
                  <button
                    type="button"
                    onClick={toggleMode}
                    className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${
                      formData.mode ? "bg-teal-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                        formData.mode ? "translate-x-7" : "translate-x-0"
                      }`}
                    ></span>
                  </button>
                  
                  <span className={`text-sm font-medium ${formData.mode ? 'text-teal-600' : 'text-gray-500'}`}>
                    Live
                  </span>
                </div>
              </div>
            </div>

            {/* Test Connection Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleTestConnection}
                className="w-full py-3.5 border-2 border-teal-500 text-teal-500 rounded-xl hover:bg-teal-50 transition-all duration-200 font-medium"
              >
                Test Connection
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-4">
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
                Add Provider
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
              Provider Added!
            </h2>
            
            <p className="text-gray-600 mb-2 text-lg font-normal">
              <span className="font-semibold text-teal-600">{formData.providerName}</span> has been successfully added.
            </p>
            <p className="text-gray-500 font-normal mb-4">
              You can now accept payments through {formData.providerName}.
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

export default AddProvider;