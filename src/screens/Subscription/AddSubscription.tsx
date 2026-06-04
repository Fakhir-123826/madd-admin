// src/pages/SubscriptionList/AddSubscription.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import {
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from "../../app/api/SubscriptionSclices/SubscriptionSclices";
import type { Subscription } from "../../model/susbcription/ISubscription";

const AddSubscription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!location.state?.subscription;
  const existingSubscription = location.state?.subscription as Subscription | null;

  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation();
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();

  const [formData, setFormData] = useState({
    subscription_name: "",
    billing_type: "",
    price: "",
    feature: [] as string[],
    status: 1, // 1 = Active, 0 = Inactive
    description: "",
    duration_days: 30,
  });

  const [newFeature, setNewFeature] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Load data in edit mode
  useEffect(() => {
    if (isEditMode && existingSubscription) {
      setFormData({
        subscription_name: existingSubscription.subscription_name || "",
        billing_type: existingSubscription.billing_type || "",
        price: existingSubscription.price?.toString() || "",
        feature: Array.isArray(existingSubscription.feature) 
          ? existingSubscription.feature 
          : existingSubscription.feature 
            ? JSON.parse(existingSubscription.feature) 
            : [],
        status: Number(existingSubscription.status) === 1 ? 1 : 0,
        description: existingSubscription.description || "",
        duration_days: existingSubscription.duration_days || 30,
      });
    }
  }, [isEditMode, existingSubscription]);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, status: parseInt(e.target.value) }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.feature.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        feature: [...prev.feature, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      feature: prev.feature.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.subscription_name.trim()) {
      showToast("error", "Subscription name is required");
      return;
    }
    if (!formData.billing_type) {
      showToast("error", "Billing type is required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showToast("error", "Valid price is required");
      return;
    }

    try {
      const subscriptionData = {
        subscription_name: formData.subscription_name,
        billing_type: formData.billing_type,
        price: parseFloat(formData.price),
        feature: JSON.stringify(formData.feature),
        status: formData.status,
        description: formData.description,
        duration_days: formData.duration_days,
      };

      if (isEditMode && existingSubscription) {
        await updateSubscription({ 
          id: existingSubscription.id, 
          data: subscriptionData 
        }).unwrap();
        showToast("success", "Subscription updated successfully!");
      } else {
        await createSubscription(subscriptionData).unwrap();
        showToast("success", "Subscription created successfully!");
      }

      // Navigate back after 1 second
      setTimeout(() => {
        navigate("/SubscriptionList");
      }, 1000);
    } catch (error: any) {
      showToast("error", error?.data?.message || "Failed to save subscription");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
            ${
              toast.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
        >
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/SubscriptionList")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4 cursor-pointer"
        >
          <FaArrowLeft className="text-sm" />
          <span className="text-sm font-medium">Back to Subscriptions</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEditMode ? "Edit Subscription" : "Add New Subscription"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode
                ? "Update subscription details"
                : "Create a new subscription plan"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Subscription Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subscription Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subscription_name"
                  value={formData.subscription_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Premium Plan, Basic Plan"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                  required
                />
              </div>

              {/* Billing Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Billing Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="billing_type"
                  value={formData.billing_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                  required
                >
                  <option value="">Select billing type</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Duration Days */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleInputChange}
                  placeholder="30"
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Number of days this subscription is valid for
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={handleStatusChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Features
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addFeature()}
                    placeholder="Add a feature (e.g., 24/7 Support)"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2.5 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-100 transition-colors cursor-pointer"
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  {formData.feature.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                  {formData.feature.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">
                      No features added yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description - Full Width */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe the subscription plan..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/SubscriptionList")}
              className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <FaTimes />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-400 to-green-400 text-white rounded-xl hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {(isCreating || isUpdating) ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <FaSave />
                  {isEditMode ? "Update Subscription" : "Create Subscription"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscription;