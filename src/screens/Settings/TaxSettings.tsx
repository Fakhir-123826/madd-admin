// src/screens/Settings/TaxSettings.tsx
import { useState, useEffect } from "react";
import { FaSave, FaSync, FaFileInvoiceDollar, FaCalculator } from "react-icons/fa";
import { useGetTaxSettingsQuery, useUpdateSettingsMutation } from "../../app/api/SettingsSlices/SettingsApi";
import Input from "../../component/Inputs Feilds/Input";

const TaxSettings = () => {
    const { data, isLoading, refetch } = useGetTaxSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

    const [formData, setFormData] = useState({
        tax_calculation_method: "total" as "unit" | "row" | "total",
        tax_based_on: "shipping" as "shipping" | "billing" | "origin",
        default_tax_class: "",
        display_prices_with_tax: false,
        display_tax_totals: true,
    });

    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    useEffect(() => {
        if (data?.data) {
            setFormData({
                tax_calculation_method: data.data.tax_calculation_method || "total",
                tax_based_on: data.data.tax_based_on || "shipping",
                default_tax_class: data.data.default_tax_class || "",
                display_prices_with_tax: data.data.display_prices_with_tax ?? false,
                display_tax_totals: data.data.display_tax_totals ?? true,
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
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateSettings({
                group: "tax",
                settings: formData,
            }).unwrap();
            showToast("success", "Tax settings updated successfully");
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to update tax settings");
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
                        <FaFileInvoiceDollar className="text-2xl text-teal-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Tax Configuration</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">Tax Calculation Method</label>
                            <select
                                name="tax_calculation_method"
                                value={formData.tax_calculation_method}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                            >
                                <option value="unit">Per Unit</option>
                                <option value="row">Per Row</option>
                                <option value="total">Per Total</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">Tax Based On</label>
                            <select
                                name="tax_based_on"
                                value={formData.tax_based_on}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                            >
                                <option value="shipping">Shipping Address</option>
                                <option value="billing">Billing Address</option>
                                <option value="origin">Store Origin</option>
                            </select>
                        </div>

                        <Input
                            label="Default Tax Class"
                            name="default_tax_class"
                            value={formData.default_tax_class}
                            onChange={handleChange}
                            placeholder="Standard, Reduced, Zero"
                        />

                        <div className="col-span-2">
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                                <div>
                                    <span className="text-sm font-semibold text-gray-700">Display Prices With Tax</span>
                                    <p className="text-xs text-gray-500 mt-1">Show product prices including tax</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="display_prices_with_tax"
                                        checked={formData.display_prices_with_tax}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500 transition"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                                </label>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                                <div>
                                    <span className="text-sm font-semibold text-gray-700">Display Tax Totals</span>
                                    <p className="text-xs text-gray-500 mt-1">Show tax breakdown in cart and checkout</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="display_tax_totals"
                                        checked={formData.display_tax_totals}
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

export default TaxSettings;