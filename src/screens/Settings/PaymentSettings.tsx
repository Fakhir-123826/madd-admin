// src/screens/Settings/PaymentSettings.tsx
import { useState, useEffect } from "react";
import { FaSave, FaSync, FaStripe, FaPaypal, FaUniversity, FaCreditCard } from "react-icons/fa";
import { useGetPaymentSettingsQuery, useUpdateSettingsMutation } from "../../app/api/SettingsSlices/SettingsApi";
import Input from "../../component/Inputs Feilds/Input";

const PaymentSettings = () => {
    const { data, isLoading, refetch } = useGetPaymentSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

    const [formData, setFormData] = useState({
        stripe_enabled: false,
        stripe_key: "",
        stripe_webhook_secret: "",
        paypal_enabled: false,
        paypal_client_id: "",
        paypal_mode: "sandbox" as "sandbox" | "live",
        bank_transfer_enabled: false,
        bank_transfer_details: {
            bank_name: "",
            account_name: "",
            account_number: "",
            sort_code: "",
            iban: "",
            swift: "",
        },
        default_payment_method: "stripe",
    });

    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    useEffect(() => {
        if (data?.data) {
            setFormData({
                stripe_enabled: data.data.stripe_enabled ?? false,
                stripe_key: data.data.stripe_key || "",
                stripe_webhook_secret: data.data.stripe_webhook_secret || "",
                paypal_enabled: data.data.paypal_enabled ?? false,
                paypal_client_id: data.data.paypal_client_id || "",
                paypal_mode: data.data.paypal_mode || "sandbox",
                bank_transfer_enabled: data.data.bank_transfer_enabled ?? false,
                bank_transfer_details: {
                    bank_name: data.data.bank_transfer_details?.bank_name || "",
                    account_name: data.data.bank_transfer_details?.account_name || "",
                    account_number: data.data.bank_transfer_details?.account_number || "",
                    sort_code: data.data.bank_transfer_details?.sort_code || "",
                    iban: data.data.bank_transfer_details?.iban || "",
                    swift: data.data.bank_transfer_details?.swift || "",
                },
                default_payment_method: data.data.default_payment_method || "stripe",
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

    const handleBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            bank_transfer_details: {
                ...prev.bank_transfer_details,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateSettings({
                group: "payment",
                settings: formData,
            }).unwrap();
            showToast("success", "Payment settings updated successfully");
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to update payment settings");
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

            {/* Stripe Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <FaStripe className="text-2xl text-purple-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Stripe Configuration</h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="stripe_enabled"
                                checked={formData.stripe_enabled}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500 transition"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                            <span className="ml-3 text-sm text-gray-600">Enabled</span>
                        </label>
                    </div>

                    {formData.stripe_enabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <Input
                                label="Publishable Key"
                                name="stripe_key"
                                value={formData.stripe_key}
                                onChange={handleChange}
                                placeholder="pk_test_..."
                            />
                            <Input
                                label="Secret Key"
                                name="stripe_key"
                                type="password"
                                value={formData.stripe_key}
                                onChange={handleChange}
                                placeholder="sk_test_..."
                            />
                            <div className="col-span-2">
                                <Input
                                    label="Webhook Secret"
                                    name="stripe_webhook_secret"
                                    value={formData.stripe_webhook_secret}
                                    onChange={handleChange}
                                    placeholder="whsec_..."
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* PayPal Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <FaPaypal className="text-2xl text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800">PayPal Configuration</h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="paypal_enabled"
                                checked={formData.paypal_enabled}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500 transition"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                            <span className="ml-3 text-sm text-gray-600">Enabled</span>
                        </label>
                    </div>

                    {formData.paypal_enabled && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <Input
                                    label="Client ID"
                                    name="paypal_client_id"
                                    value={formData.paypal_client_id}
                                    onChange={handleChange}
                                    placeholder="PayPal Client ID"
                                />
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Mode</label>
                                    <select
                                        name="paypal_mode"
                                        value={formData.paypal_mode}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    >
                                        <option value="sandbox">Sandbox (Test Mode)</option>
                                        <option value="live">Live Mode</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Bank Transfer Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <FaUniversity className="text-2xl text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Bank Transfer Configuration</h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="bank_transfer_enabled"
                                checked={formData.bank_transfer_enabled}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500 transition"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                            <span className="ml-3 text-sm text-gray-600">Enabled</span>
                        </label>
                    </div>

                    {formData.bank_transfer_enabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <Input
                                label="Bank Name"
                                name="bank_name"
                                value={formData.bank_transfer_details.bank_name}
                                onChange={handleBankDetailsChange}
                                placeholder="Bank Name"
                            />
                            <Input
                                label="Account Name"
                                name="account_name"
                                value={formData.bank_transfer_details.account_name}
                                onChange={handleBankDetailsChange}
                                placeholder="Account Holder Name"
                            />
                            <Input
                                label="Account Number"
                                name="account_number"
                                value={formData.bank_transfer_details.account_number}
                                onChange={handleBankDetailsChange}
                                placeholder="Account Number"
                            />
                            <Input
                                label="Sort Code"
                                name="sort_code"
                                value={formData.bank_transfer_details.sort_code}
                                onChange={handleBankDetailsChange}
                                placeholder="Sort Code"
                            />
                            <Input
                                label="IBAN"
                                name="iban"
                                value={formData.bank_transfer_details.iban}
                                onChange={handleBankDetailsChange}
                                placeholder="IBAN"
                            />
                            <Input
                                label="SWIFT/BIC Code"
                                name="swift"
                                value={formData.bank_transfer_details.swift}
                                onChange={handleBankDetailsChange}
                                placeholder="SWIFT/BIC Code"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Default Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FaCreditCard className="text-2xl text-teal-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Default Payment Method</h3>
                    </div>
                    <select
                        name="default_payment_method"
                        value={formData.default_payment_method}
                        onChange={handleChange}
                        className="w-full md:w-1/2 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                    >
                        {formData.stripe_enabled && <option value="stripe">Stripe</option>}
                        {formData.paypal_enabled && <option value="paypal">PayPal</option>}
                        {formData.bank_transfer_enabled && <option value="bank_transfer">Bank Transfer</option>}
                    </select>
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

export default PaymentSettings;