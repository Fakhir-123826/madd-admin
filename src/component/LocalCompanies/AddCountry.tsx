import React, { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Language {
  id: number;
  name: string;
}

const AddCountry: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    countryName: "",
    countryCode: "",
    currency: "",
    status: true, // true for Active, false for Inactive
    isDefault: false,
  });

  const [languageInput, setLanguageInput] = useState("");
  const [languages, setLanguages] = useState<Language[]>([
    { id: 1, name: "English" },
    // { id: 2, name: "Urdu" },
  ]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addLanguage = () => {
    if (languageInput.trim()) {
      const newLanguage = {
        id: Date.now(),
        name: languageInput.trim()
      };
      setLanguages([...languages, newLanguage]);
      setLanguageInput("");
    }
  };

  const removeLanguage = (id: number) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLanguage();
    }
  };

  const toggleStatus = () => {
    setFormData(prev => ({ ...prev, status: !prev.status }));
  };

  const toggleDefault = () => {
    setFormData(prev => ({ ...prev, isDefault: !prev.isDefault }));
  };

  const validateForm = () => {
    if (!formData.countryName.trim()) return false;
    if (!formData.countryCode.trim()) return false;
    if (!formData.currency.trim()) return false;
    if (languages.length === 0) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log("Saving country:", {
        ...formData,
        languages: languages.map(l => l.name),
        status: formData.status ? "Active" : "Inactive"
      });
      
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/country-management');
      }, 2000);
    } else {
      alert("Please fill all required fields");
    }
  };

  const handleCancel = () => {
    navigate('/country-management');
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-4 md:p-8">
      <div className="w-full">
        
        {/* Header with Gradient - Full Width */}
        <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-4 rounded-t-2xl flex items-center gap-4 shadow-lg">
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white font-semibold text-xl tracking-wide">
            Add New Country
          </h1>
        </div>

        {/* Main Form Card - Full Width */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8 border-x border-b border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Country Information Section */}
            <div>
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
                <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
                Country Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Country Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Country Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="countryName"
                      value={formData.countryName}
                      onChange={handleChange}
                      placeholder="Enter country name"
                      className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                      required
                    />
                    {formData.countryName && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                    )}
                  </div>
                </div>

                {/* Country Code */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Country Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      placeholder="e.g., +92"
                      className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                      required
                    />
                    {formData.countryCode && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                    )}
                  </div>
                </div>

                {/* Currency - Full Width on mobile, spans both columns on desktop */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Default Currency <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      placeholder="e.g., PKR, USD, EUR"
                      className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                      required
                    />
                    {formData.currency && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Supported Languages Section */}
            <div>
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                Supported Languages <span className="text-red-500">*</span>
              </h2>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter language name"
                    className="flex-1 border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white"
                  />
                  <button
                    type="button"
                    onClick={addLanguage}
                    disabled={!languageInput.trim()}
                    className={`
                      px-6 py-3.5 rounded-xl font-medium transition-all duration-200 whitespace-nowrap
                      ${languageInput.trim()
                        ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white hover:from-teal-600 hover:to-green-600 shadow-md hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    Add Language
                  </button>
                </div>

                {/* Language Tags */}
                {languages.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {languages.map((lang) => (
                      <span
                        key={lang.id}
                        className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {lang.name}
                        <button
                          type="button"
                          onClick={() => removeLanguage(lang.id)}
                          className="hover:text-teal-900"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mt-4 text-center">
                    No languages added. Add at least one language.
                  </p>
                )}
              </div>
            </div>

            {/* Status and Default Toggles - Side by Side on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Toggle */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
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

              {/* Is Default Toggle */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                  Is Default
                </h2>

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
                Save Country
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
              onClick={() => setShowSuccessModal(false)}
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
              Country Added!
            </h2>
            
            <p className="text-gray-600 mb-2 text-lg font-normal">
              <span className="font-semibold text-teal-600">“{formData.countryName || "New Country"}”</span>
            </p>
            <p className="text-gray-500 font-normal mb-4">
              has been successfully added.
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-green-500 h-1 rounded-full animate-[progress_2s_ease-in-out]"></div>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Redirecting to countries list...
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

export default AddCountry;