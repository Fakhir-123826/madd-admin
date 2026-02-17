import React, { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddCurrency: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    countryCode: "",
    currencySymbol: "",
    conversionRate: "",
    status: true, // true for Active, false for Inactive
    isDefault: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof typeof formData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleStatus = () => {
    setFormData(prev => ({ ...prev, status: !prev.status }));
  };

  const toggleDefault = () => {
    setFormData(prev => ({ ...prev, isDefault: !prev.isDefault }));
  };

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {};
    
    if (!formData.countryCode.trim()) {
      newErrors.countryCode = "Country code is required";
    }
    if (!formData.currencySymbol.trim()) {
      newErrors.currencySymbol = "Currency symbol is required";
    }
    if (!formData.conversionRate.trim()) {
      newErrors.conversionRate = "Conversion rate is required";
    } else if (isNaN(Number(formData.conversionRate))) {
      newErrors.conversionRate = "Conversion rate must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const data = {
        ...formData,
        conversionRate: `1 USD = ${formData.conversionRate} ${formData.countryCode}`,
      };
      console.log("Currency Data:", data);
      
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/currency-management');
      }, 2000);
    }
  };

  const handleCancel = () => {
    navigate('/currency-management');
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/currency-management');
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
            Add New Currency
          </h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8 border-x border-b border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Country Code */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Country Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  placeholder="e.g., PKR, USD, EUR"
                  className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white ${
                    errors.countryCode ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {formData.countryCode && !errors.countryCode && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                )}
              </div>
              {errors.countryCode && (
                <p className="text-red-500 text-xs mt-1">{errors.countryCode}</p>
              )}
            </div>

            {/* Currency Symbol */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Currency Symbol <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="currencySymbol"
                  value={formData.currencySymbol}
                  onChange={handleChange}
                  placeholder="e.g., $, Rs, €"
                  className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white ${
                    errors.currencySymbol ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {formData.currencySymbol && !errors.currencySymbol && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                )}
              </div>
              {errors.currencySymbol && (
                <p className="text-red-500 text-xs mt-1">{errors.currencySymbol}</p>
              )}
            </div>

            {/* Conversion Rate */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Conversion Rate <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="conversionRate"
                  value={formData.conversionRate}
                  onChange={handleChange}
                  placeholder="Enter rate"
                  className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white ${
                    errors.conversionRate ? "border-red-500" : "border-gray-200"
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  per USD
                </span>
              </div>
              {errors.conversionRate && (
                <p className="text-red-500 text-xs mt-1">{errors.conversionRate}</p>
              )}
              {formData.conversionRate && !errors.conversionRate && (
                <p className="text-xs text-gray-500 mt-2">
                  1 USD = {formData.conversionRate} {formData.countryCode || "PKR"}
                </p>
              )}
            </div>

            {/* Status and Default Toggles - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Status Toggle */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Status
                </label>

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

              {/* Is Default Toggle */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Is Default
                </label>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 w-full">
                  <span className={`text-sm font-medium ${!formData.isDefault ? 'text-gray-500' : 'text-gray-500'}`}>
                    No
                  </span>
                  
                  <button
                    type="button"
                    onClick={toggleDefault}
                    className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${
                      formData.isDefault ? "bg-teal-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                        formData.isDefault ? "translate-x-7" : "translate-x-0"
                      }`}
                    ></span>
                  </button>
                  
                  <span className={`text-sm font-medium ${formData.isDefault ? 'text-teal-600' : 'text-gray-500'}`}>
                    Yes
                  </span>
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
                Add Currency
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[450px] text-center relative shadow-2xl animate-[scaleIn_0.3s_ease-out]">
            
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
              Currency Added!
            </h2>
            
            <p className="text-gray-600 mb-2 text-lg font-normal">
              Currency <span className="font-semibold text-teal-600">“{formData.countryCode || "New Currency"}”</span>
            </p>
            <p className="text-gray-500 font-normal mb-4">
              has been successfully added.
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-green-500 h-1 rounded-full animate-[progress_2s_ease-in-out]"></div>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Redirecting to currencies list...
            </p>
          </div>
        </div>
      )}

      {/* Add custom animations */}
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AddCurrency;