import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";

interface FormData {
  zoneName: string;
  country: string;
  shippingRule: "flat" | "weight" | "free";
  weight: string;
  price: string;
  status: boolean;
}

const AddShipping: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    zoneName: "",
    country: "",
    shippingRule: "weight",
    weight: "",
    price: "",
    status: true,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRuleChange = (rule: "flat" | "weight" | "free") => {
    setFormData((prev) => ({ ...prev, shippingRule: rule }));
  };

  const toggleStatus = () => {
    setFormData((prev) => ({ ...prev, status: !prev.status }));
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.zoneName.trim()) {
      newErrors.zoneName = "Zone name is required";
    }
    if (!formData.country) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Saving shipping provider:", {
        ...formData,
        status: formData.status ? "Active" : "Inactive",
      });

      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/shipping-mangement");
      }, 2000);
    }
  };

  const handleCancel = () => {
    navigate("/shipping-mangement");
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/shipping-mangement");
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-4 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-4 rounded-t-2xl flex items-center gap-4 shadow-lg">
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white font-semibold text-xl tracking-wide">
            Add Shipping Provider
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8 border-x border-b border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Zone Information */}
            <div>
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800">
                <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
                Zone Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Zone Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Zone Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="zoneName"
                      value={formData.zoneName}
                      onChange={handleChange}
                      placeholder="e.g., North America"
                      className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white ${
                        errors.zoneName ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {formData.zoneName && !errors.zoneName && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                        ✓
                      </span>
                    )}
                  </div>
                  {errors.zoneName && (
                    <p className="text-red-500 text-xs mt-1">{errors.zoneName}</p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full border-2 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all duration-200 bg-white appearance-none ${
                        errors.country ? "border-red-500" : "border-gray-200"
                      }`}
                    >
                      <option value="">Select country</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      ▼
                    </span>
                  </div>
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Rule - FIXED & ALIGNED */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                Shipping Rule
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => handleRuleChange("flat")}
                  className={`w-full py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                    formData.shippingRule === "flat"
                      ? "bg-teal-500 text-white border-teal-500 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:border-teal-400 hover:bg-gray-100"
                  }`}
                >
                  Flat Rate
                </button>

                <button
                  type="button"
                  onClick={() => handleRuleChange("weight")}
                  className={`w-full py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                    formData.shippingRule === "weight"
                      ? "bg-teal-500 text-white border-teal-500 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:border-teal-400 hover:bg-gray-100"
                  }`}
                >
                  Weight Based
                </button>

                <button
                  type="button"
                  onClick={() => handleRuleChange("free")}
                  className={`w-full py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                    formData.shippingRule === "free"
                      ? "bg-teal-500 text-white border-teal-500 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:border-teal-400 hover:bg-gray-100"
                  }`}
                >
                  Free Shipping
                </button>
              </div>
            </div>

            {/* Weight & Price */}
            {formData.shippingRule === "weight" && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                  Weight Configuration
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Weight
                    </label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="e.g., 5 kg"
                      className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Price
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g., 4 USDT"
                      className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Status */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                Status
              </h2>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 w-fit">
                <span
                  className={`text-sm font-medium ${
                    !formData.status ? "text-red-600" : "text-gray-500"
                  }`}
                >
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
                  />
                </button>

                <span
                  className={`text-sm font-medium ${
                    formData.status ? "text-teal-600" : "text-gray-500"
                  }`}
                >
                  Active
                </span>
              </div>
            </div>

            {/* Buttons */}
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
                Add Provider
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-[420px] text-center relative shadow-2xl animate-fadeIn">
            <button
              onClick={handleCloseSuccessModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white text-4xl shadow-lg">
              ✓
            </div>

            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Provider Added!
            </h2>

            <p className="text-gray-600">
              Shipping provider{" "}
              <span className="font-semibold text-teal-600">
                “{formData.zoneName || "New Zone"}”
              </span>{" "}
              has been successfully added.
            </p>

            <div className="w-full bg-gray-200 h-1 rounded-full mt-6 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-green-500 h-1 rounded-full animate-progress" />
            </div>
          </div>
        </div>
      )}

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

export default AddShipping;