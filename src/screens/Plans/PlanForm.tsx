// src/screens/Plans/PlanForm.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave, FaTimes, FaPlus, FaTrash, FaDollarSign, FaPercent } from "react-icons/fa";
import {
    useGetPlanQuery,
    useCreatePlanMutation,
    useUpdatePlanMutation,
    type Plan,
} from "../../app/api/PlanSlices/PlanApi";
import Input from "../../component/Inputs Feilds/Input";

const PlanForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const { data: planData, isLoading: isLoadingPlan } = useGetPlanQuery(id!, {
        skip: !isEdit,
    });
    const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
    const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();

    const [formData, setFormData] = useState({
        subscription_name: "",
        billing_type: "monthly" as "monthly" | "yearly" | "one-time",
        price: "",
        feature: [] as string[],
        status: true,
        description: "",
        setup_fee: "",
        transaction_fee_percentage: "",
        commission_rate: "",
        max_products: "",
        max_stores: "",
        max_users: "",
        trial_period_days: "",
    });

    const [newFeature, setNewFeature] = useState("");
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    useEffect(() => {
        if (planData) {
            setFormData({
                subscription_name: planData.subscription_name,
                billing_type: planData.billing_type,
                price: planData.price.toString(),
                feature: planData.feature || [],
                status: planData.status === 1,
                description: planData.description || "",
                setup_fee: planData.setup_fee?.toString() || "",
                transaction_fee_percentage: planData.transaction_fee_percentage?.toString() || "",
                commission_rate: planData.commission_rate?.toString() || "",
                max_products: planData.max_products?.toString() || "",
                max_stores: planData.max_stores?.toString() || "",
                max_users: planData.max_users?.toString() || "",
                trial_period_days: planData.trial_period_days?.toString() || "",
            });
        }
    }, [planData]);

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const addFeature = () => {
        if (newFeature.trim()) {
            setFormData(prev => ({
                ...prev,
                feature: [...prev.feature, newFeature.trim()],
            }));
            setNewFeature("");
        }
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            feature: prev.feature.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            subscription_name: formData.subscription_name,
            billing_type: formData.billing_type,
            price: parseFloat(formData.price),
            feature: formData.feature,
            status: formData.status,
            description: formData.description || undefined,
            setup_fee: formData.setup_fee ? parseFloat(formData.setup_fee) : undefined,
            transaction_fee_percentage: formData.transaction_fee_percentage ? parseFloat(formData.transaction_fee_percentage) : undefined,
            commission_rate: formData.commission_rate ? parseFloat(formData.commission_rate) : undefined,
            max_products: formData.max_products ? parseInt(formData.max_products) : undefined,
            max_stores: formData.max_stores ? parseInt(formData.max_stores) : undefined,
            max_users: formData.max_users ? parseInt(formData.max_users) : undefined,
            trial_period_days: formData.trial_period_days ? parseInt(formData.trial_period_days) : undefined,
        };

        try {
            if (isEdit && id) {
                await updatePlan({ id: parseInt(id), data: payload }).unwrap();
                showToast("success", "Plan updated successfully");
            } else {
                await createPlan(payload).unwrap();
                showToast("success", "Plan created successfully");
            }
            setTimeout(() => navigate("/plans"), 1500);
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to save plan");
        }
    };

    if (isEdit && isLoadingPlan) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                {/* Toast */}
                {toast && (
                    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                        ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                        <span>{toast.type === "success" ? "✓" : "✕"}</span>
                        {toast.msg}
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {isEdit ? "Edit Subscription Plan" : "Create New Plan"}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {isEdit ? "Update plan details and pricing" : "Add a new subscription plan for vendors"}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/plans")}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
                    >
                        <FaTimes className="text-sm" /> Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Plan Name *"
                                    name="subscription_name"
                                    value={formData.subscription_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Starter, Professional, Enterprise"
                                />
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Billing Type *</label>
                                    <select
                                        name="billing_type"
                                        value={formData.billing_type}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    >
                                        <option value="monthly">Monthly Subscription</option>
                                        <option value="yearly">Yearly Subscription</option>
                                        <option value="one-time">One Time Payment</option>
                                    </select>
                                </div>
                                <Input
                                    label="Price *"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    placeholder="0.00"
                                    icon={<FaDollarSign className="text-gray-400" />}
                                />
                                <Input
                                    label="Setup Fee"
                                    name="setup_fee"
                                    type="number"
                                    step="0.01"
                                    value={formData.setup_fee}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    icon={<FaDollarSign className="text-gray-400" />}
                                />
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Brief description of the plan..."
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Features</h3>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && addFeature()}
                                    placeholder="Add a feature (e.g., Unlimited Products)"
                                    className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                />
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="px-4 py-2 rounded-xl bg-teal-500 text-white hover:bg-teal-600 transition"
                                >
                                    <FaPlus className="text-sm" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.feature.map((feature, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                                        <span className="text-gray-700">{feature}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <FaTrash className="text-sm" />
                                        </button>
                                    </div>
                                ))}
                                {formData.feature.length === 0 && (
                                    <p className="text-sm text-gray-400 text-center py-4">No features added yet</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Limits & Fees */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Limits & Fees</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Max Products"
                                    name="max_products"
                                    type="number"
                                    value={formData.max_products}
                                    onChange={handleChange}
                                    placeholder="Unlimited"
                                />
                                <Input
                                    label="Max Stores"
                                    name="max_stores"
                                    type="number"
                                    value={formData.max_stores}
                                    onChange={handleChange}
                                    placeholder="Unlimited"
                                />
                                <Input
                                    label="Max Users"
                                    name="max_users"
                                    type="number"
                                    value={formData.max_users}
                                    onChange={handleChange}
                                    placeholder="Unlimited"
                                />
                                <Input
                                    label="Trial Period (days)"
                                    name="trial_period_days"
                                    type="number"
                                    value={formData.trial_period_days}
                                    onChange={handleChange}
                                    placeholder="0 = No trial"
                                />
                                <Input
                                    label="Transaction Fee (%)"
                                    name="transaction_fee_percentage"
                                    type="number"
                                    step="0.01"
                                    value={formData.transaction_fee_percentage}
                                    onChange={handleChange}
                                    placeholder="0"
                                    icon={<FaPercent className="text-gray-400" />}
                                />
                                <Input
                                    label="Commission Rate (%)"
                                    name="commission_rate"
                                    type="number"
                                    step="0.01"
                                    value={formData.commission_rate}
                                    onChange={handleChange}
                                    placeholder="0"
                                    icon={<FaPercent className="text-gray-400" />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                                <div>
                                    <span className="text-sm font-semibold text-gray-700">Active Plan</span>
                                    <p className="text-xs text-gray-500 mt-1">Make this plan available for vendors</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="status"
                                        checked={formData.status}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500 transition"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pb-6">
                        <button
                            type="button"
                            onClick={() => navigate("/plans")}
                            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating || isUpdating}
                            className="px-6 py-2.5 bg-gradient-to-r from-teal-400 to-green-400 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {isCreating || isUpdating ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaSave /> Save Plan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlanForm;