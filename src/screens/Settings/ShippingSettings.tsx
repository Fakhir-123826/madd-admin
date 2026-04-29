// src/screens/Settings/ShippingSettings.tsx
import { useState, useEffect } from "react";
import { FaSave, FaSync, FaTruck, FaBoxOpen } from "react-icons/fa";
import { useGetShippingSettingsQuery, useUpdateSettingsMutation } from "../../app/api/SettingsSlices/SettingsApi";
import Input from "../../component/Inputs Feilds/Input";

const ShippingSettings = () => {
    const { data, isLoading, refetch } = useGetShippingSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

    const [formData, setFormData] = useState({
        default_carrier: null as number | null,
        free_shipping_threshold: 0,
        shipping_tax_class: "",
        international_shipping_enabled: false,
    });

    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    useEffect(() => {
        if (data?.data) {
            setFormData({
                default_carrier: data.data.default_carrier || null,
                free_shipping_threshold: data.data.free_shipping_threshold || 0,
                shipping_tax_class: data.data.shipping_tax_class || "",
                international_shipping_enabled: data.data.international_shipping_enabled ?? false,
            });
        }
    }, [data]);

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value === "" ? null : parseFloat(value) || value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateSettings({
                group: "shipping",
                settings: formData,
            }).unwrap();
            showToast("success", "Shipping settings updated successfully");
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to update shipping settings");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <FaTruck className="text-2xl text-teal-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Shipping Configuration</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Free Shipping Threshold"
                            name="free_shipping_threshold"
                            type="number"
                            step="0.01"
                            value={formData.free_shipping_threshold}
                            onChange={handleChange}
                            placeholder="e.g., 50 for orders over $50"
                            icon={<FaBoxOpen className="text-gray-400" />}
                        />
                        <Input
                            label="Shipping Tax Class"
                            name="shipping_tax_class"
                            value={formData.shipping_tax_class}
                            onChange={handleChange}
                            placeholder="Tax class for shipping"
                        />
                        <div className="col-span-2">
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                                <div>
                                    <span className="text-sm font-semibold text-gray-700">International Shipping</span>
                                    <p className="text-xs text-gray-500 mt-1">Allow shipping to international addresses</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="international_shipping_enabled"
                                        checked={formData.international_shipping_enabled}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500 transition"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition flex items-center gap-2"
                >
                    <FaSync className="text-sm" /> Reset
                </button>
                <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2.5 bg-gradient-to-r from-teal-400 to-green-400 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                >
                    {isUpdating ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <FaSave />}
                    Save Changes
                </button>
            </div>
        </form>
    );
};

export default ShippingSettings;