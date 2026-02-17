import React, { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormData {
  ruleName: string;
  country: string;
  appliesTo: string;
  taxRate: string;
  category: string;
  selectedCategories: string[];
  allCategories: boolean;
  status: "Active" | "Inactive";
}

const AddRule: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    ruleName: "",
    country: "",
    appliesTo: "",
    taxRate: "",
    category: "",
    selectedCategories: ["Beauty", "Electronics", "Clothing"],
    allCategories: true,
    status: "Active",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    if (category && !formData.selectedCategories.includes(category)) {
      setFormData((prev) => ({
        ...prev,
        selectedCategories: [...prev.selectedCategories, category],
        category: "",
      }));
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.filter(
        (cat) => cat !== categoryToRemove
      ),
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.ruleName.trim()) {
      newErrors.ruleName = "Rule name is required";
    }
    if (!formData.country) {
      newErrors.country = "Country is required";
    }
    if (!formData.appliesTo) {
      newErrors.appliesTo = "This field is required";
    }
    if (!formData.taxRate.trim()) {
      newErrors.taxRate = "Tax rate is required";
    } else if (isNaN(Number(formData.taxRate))) {
      newErrors.taxRate = "Tax rate must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Here you would typically send data to your backend
      setShowSuccessModal(true);
      
      // Auto close after 2 seconds and navigate back
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate(-1);
      }, 2000);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "Active" ? "Inactive" : "Active",
    }));
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate(-1);
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
            Add New Tax Rule
          </h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8 border-x border-b border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Rule Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Rule Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ruleName"
                value={formData.ruleName}
                onChange={handleChange}
                placeholder="Enter rule name"
                className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white ${
                  errors.ruleName ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.ruleName && (
                <p className="text-red-500 text-xs mt-1">{errors.ruleName}</p>
              )}
            </div>

            {/* Country / Region */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Country / Region <span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white appearance-none ${
                  errors.country ? "border-red-500" : "border-gray-200"
                }`}
              >
                <option value="">Select country</option>
                <option value="America">America</option>
                <option value="UK">UK</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>

            {/* Applies to */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Applies to <span className="text-red-500">*</span>
              </label>
              <select
                name="appliesTo"
                value={formData.appliesTo}
                onChange={handleChange}
                className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white appearance-none ${
                  errors.appliesTo ? "border-red-500" : "border-gray-200"
                }`}
              >
                <option value="">Select category</option>
                <option value="products">Products, electronic etc</option>
                <option value="services">Services</option>
                <option value="digital">Digital Products</option>
              </select>
              {errors.appliesTo && (
                <p className="text-red-500 text-xs mt-1">{errors.appliesTo}</p>
              )}
            </div>

            {/* Tax Rate */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tax Rate <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  placeholder="Enter tax rate"
                  className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white ${
                    errors.taxRate ? "border-red-500" : "border-gray-200"
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  PKR
                </span>
              </div>
              {errors.taxRate && (
                <p className="text-red-500 text-xs mt-1">{errors.taxRate}</p>
              )}
            </div>

            {/* Applies to Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Applies to Category
              </label>
              <select
                value={formData.category}
                onChange={handleCategorySelect}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white appearance-none mb-3"
              >
                <option value="">Select category to add</option>
                <option value="Products">Products</option>
                <option value="Beauty">Beauty</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Furniture">Furniture</option>
              </select>

              {/* Category Tags */}
              {formData.selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.selectedCategories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-teal-100 text-teal-700 text-sm px-4 py-2 rounded-full font-medium flex items-center gap-2"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => removeCategory(category)}
                        className="hover:text-teal-900"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* All Categories Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-bold text-gray-700">
                All Categories
              </span>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, allCategories: !prev.allCategories }))}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                  formData.allCategories ? "bg-teal-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                    formData.allCategories ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Status - Single Toggle */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Status
              </label>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={toggleStatus}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                    formData.status === "Active" ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                      formData.status === "Active" ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${
                  formData.status === "Active" ? "text-teal-600" : "text-gray-500"
                }`}>
                  {formData.status}
                </span>
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
                Add Rule
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

            {/* Success Content - Heading Bold, Message Normal */}
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Rule Added!
            </h2>
            
            <p className="text-gray-600 mb-2 text-lg font-normal">
              Tax Rule <span className="font-semibold text-teal-600">“{formData.ruleName || "New Rule"}”</span>
            </p>
            <p className="text-gray-500 font-normal mb-4">
              has been successfully added.
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-green-500 h-1 rounded-full animate-[progress_2s_ease-in-out]"></div>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Redirecting to rules list...
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

export default AddRule;