// src/screens/Settings/SystemSettings.tsx
import { useState, useEffect } from "react";
import {
    FaSave,
    FaSync,
    FaGlobe,
    FaLanguage,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaClock,
    FaCalendar,
    FaShieldAlt,
    FaDatabase,
} from "react-icons/fa";
import {
    useGetSystemSettingsQuery,
    useUpdateSettingsMutation,
} from "../../app/api/SettingsSlices/SettingsApi";
import Input from "../../component/Inputs Feilds/Input";

const SystemSettings = () => {
    const { data, isLoading, refetch } = useGetSystemSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

    const [generalForm, setGeneralForm] = useState({
        site_name: "",
        site_logo: "",
        site_favicon: "",
        contact_email: "",
        contact_phone: "",
        address: "",
        default_currency: "USD",
        default_language: "en",
        timezone: "UTC",
        date_format: "Y-m-d",
        time_format: "H:i:s",
    });

    const [apiForm, setApiForm] = useState({
        api_rate_limit: 100,
        api_rate_limit_per_minute: 60,
        webhook_retry_attempts: 3,
        webhook_retry_delay: 60,
        enable_api_logging: true,
    });

    const [securityForm, setSecurityForm] = useState({
        two_factor_required: false,
        session_timeout: 120,
        max_login_attempts: 5,
        lockout_duration: 30,
        password_expiry_days: null as number | null,
        require_email_verification: true,
        require_phone_verification: false,
    });

    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
    const [activeSection, setActiveSection] = useState<"general" | "api" | "security">("general");

    useEffect(() => {
        if (data?.data) {
            const { general, api, security } = data.data;
            setGeneralForm({
                site_name: general.site_name || "",
                site_logo: general.site_logo || "",
                site_favicon: general.site_favicon || "",
                contact_email: general.contact_email || "",
                contact_phone: general.contact_phone || "",
                address: general.address || "",
                default_currency: general.default_currency || "USD",
                default_language: general.default_language || "en",
                timezone: general.timezone || "UTC",
                date_format: general.date_format || "Y-m-d",
                time_format: general.time_format || "H:i:s",
            });
            setApiForm({
                api_rate_limit: api.api_rate_limit || 100,
                api_rate_limit_per_minute: api.api_rate_limit_per_minute || 60,
                webhook_retry_attempts: api.webhook_retry_attempts || 3,
                webhook_retry_delay: api.webhook_retry_delay || 60,
                enable_api_logging: api.enable_api_logging ?? true,
            });
            setSecurityForm({
                two_factor_required: security.two_factor_required || false,
                session_timeout: security.session_timeout || 120,
                max_login_attempts: security.max_login_attempts || 5,
                lockout_duration: security.lockout_duration || 30,
                password_expiry_days: security.password_expiry_days || null,
                require_email_verification: security.require_email_verification ?? true,
                require_phone_verification: security.require_phone_verification || false,
            });
        }
    }, [data]);

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setGeneralForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleApiChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setApiForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : parseInt(value) || value,
        }));
    };

    const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setSecurityForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value === "" ? null : parseInt(value) || value,
        }));
    };

    const handleSubmit = async (section: string, formData: any) => {
        try {
            await updateSettings({
                group: section as any,
                settings: formData,
            }).unwrap();
            showToast("success", `${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully`);
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || `Failed to update ${section} settings`);
        }
    };

    const timezones = [
        "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
        "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Dubai", "Asia/Karachi",
        "Asia/Kolkata", "Asia/Tokyo", "Australia/Sydney",
    ];

    const currencies = [
        { code: "USD", name: "US Dollar" },
        { code: "EUR", name: "Euro" },
        { code: "GBP", name: "British Pound" },
        { code: "JPY", name: "Japanese Yen" },
        { code: "CNY", name: "Chinese Yuan" },
        { code: "AED", name: "UAE Dirham" },
        { code: "SAR", name: "Saudi Riyal" },
        { code: "PKR", name: "Pakistani Rupee" },
        { code: "INR", name: "Indian Rupee" },
    ];

    const languages = [
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "fr", name: "French" },
        { code: "de", name: "German" },
        { code: "it", name: "Italian" },
        { code: "pt", name: "Portuguese" },
        { code: "ar", name: "Arabic" },
        { code: "zh", name: "Chinese" },
        { code: "ja", name: "Japanese" },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            {/* Section Navigation */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveSection("general")}
                    className={`px-4 py-2 text-sm font-medium transition-all rounded-t-lg
                        ${activeSection === "general"
                            ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                            : "text-gray-500 hover:text-teal-600"
                        }`}
                >
                    <FaGlobe className="inline mr-2" /> General
                </button>
                <button
                    onClick={() => setActiveSection("api")}
                    className={`px-4 py-2 text-sm font-medium transition-all rounded-t-lg
                        ${activeSection === "api"
                            ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                            : "text-gray-500 hover:text-teal-600"
                        }`}
                >
                    <FaDatabase className="inline mr-2" /> API Settings
                </button>
                <button
                    onClick={() => setActiveSection("security")}
                    className={`px-4 py-2 text-sm font-medium transition-all rounded-t-lg
                        ${activeSection === "security"
                            ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                            : "text-gray-500 hover:text-teal-600"
                        }`}
                >
                    <FaShieldAlt className="inline mr-2" /> Security
                </button>
            </div>

            {/* General Settings Form */}
            {activeSection === "general" && (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit("general", generalForm); }} className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">General Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Site Name"
                                    name="site_name"
                                    value={generalForm.site_name}
                                    onChange={handleGeneralChange}
                                    required
                                    placeholder="Store Name"
                                />
                                <Input
                                    label="Site Logo URL"
                                    name="site_logo"
                                    value={generalForm.site_logo}
                                    onChange={handleGeneralChange}
                                    placeholder="https://example.com/logo.png"
                                />
                                <Input
                                    label="Site Favicon URL"
                                    name="site_favicon"
                                    value={generalForm.site_favicon}
                                    onChange={handleGeneralChange}
                                    placeholder="https://example.com/favicon.ico"
                                />
                                <Input
                                    label="Contact Email"
                                    name="contact_email"
                                    type="email"
                                    value={generalForm.contact_email}
                                    onChange={handleGeneralChange}
                                    required
                                    placeholder="admin@example.com"
                                />
                                <Input
                                    label="Contact Phone"
                                    name="contact_phone"
                                    value={generalForm.contact_phone}
                                    onChange={handleGeneralChange}
                                    placeholder="+1 234 567 8900"
                                />
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Address</label>
                                    <textarea
                                        name="address"
                                        value={generalForm.address}
                                        onChange={handleGeneralChange}
                                        rows={3}
                                        placeholder="Street, City, State, ZIP"
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Default Currency</label>
                                    <select
                                        name="default_currency"
                                        value={generalForm.default_currency}
                                        onChange={handleGeneralChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    >
                                        {currencies.map(currency => (
                                            <option key={currency.code} value={currency.code}>
                                                {currency.code} - {currency.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Default Language</label>
                                    <select
                                        name="default_language"
                                        value={generalForm.default_language}
                                        onChange={handleGeneralChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    >
                                        {languages.map(lang => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Timezone</label>
                                    <select
                                        name="timezone"
                                        value={generalForm.timezone}
                                        onChange={handleGeneralChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    >
                                        {timezones.map(tz => (
                                            <option key={tz} value={tz}>{tz}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Date Format</label>
                                    <Input
                                        name="date_format"
                                        value={generalForm.date_format}
                                        onChange={handleGeneralChange}
                                        placeholder="Y-m-d"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Time Format</label>
                                    <Input
                                        name="time_format"
                                        value={generalForm.time_format}
                                        onChange={handleGeneralChange}
                                        placeholder="H:i:s"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

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
            )}

            {/* API Settings Form */}
            {activeSection === "api" && (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit("api", apiForm); }} className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">API Configuration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="API Rate Limit (per minute)"
                                    name="api_rate_limit_per_minute"
                                    type="number"
                                    value={apiForm.api_rate_limit_per_minute}
                                    onChange={handleApiChange}
                                    min={10}
                                    max={500}
                                />
                                <Input
                                    label="API Rate Limit (per day)"
                                    name="api_rate_limit"
                                    type="number"
                                    value={apiForm.api_rate_limit}
                                    onChange={handleApiChange}
                                    min={100}
                                    max={10000}
                                />
                                <Input
                                    label="Webhook Retry Attempts"
                                    name="webhook_retry_attempts"
                                    type="number"
                                    value={apiForm.webhook_retry_attempts}
                                    onChange={handleApiChange}
                                    min={1}
                                    max={10}
                                />
                                <Input
                                    label="Webhook Retry Delay (seconds)"
                                    name="webhook_retry_delay"
                                    type="number"
                                    value={apiForm.webhook_retry_delay}
                                    onChange={handleApiChange}
                                    min={5}
                                    max={3600}
                                />
                                <div className="col-span-2">
                                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                                        <div>
                                            <span className="text-sm font-semibold text-gray-700">Enable API Logging</span>
                                            <p className="text-xs text-gray-500 mt-1">Log all API requests and responses</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="enable_api_logging"
                                                checked={apiForm.enable_api_logging}
                                                onChange={handleApiChange}
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
            )}

            {/* Security Settings Form */}
            {activeSection === "security" && (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit("security", securityForm); }} className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Session Timeout (minutes)"
                                    name="session_timeout"
                                    type="number"
                                    value={securityForm.session_timeout}
                                    onChange={handleSecurityChange}
                                    min={5}
                                    max={720}
                                />
                                <Input
                                    label="Max Login Attempts"
                                    name="max_login_attempts"
                                    type="number"
                                    value={securityForm.max_login_attempts}
                                    onChange={handleSecurityChange}
                                    min={3}
                                    max={20}
                                />
                                <Input
                                    label="Lockout Duration (minutes)"
                                    name="lockout_duration"
                                    type="number"
                                    value={securityForm.lockout_duration}
                                    onChange={handleSecurityChange}
                                    min={5}
                                    max={60}
                                />
                                <Input
                                    label="Password Expiry Days (optional)"
                                    name="password_expiry_days"
                                    type="number"
                                    value={securityForm.password_expiry_days || ""}
                                    onChange={handleSecurityChange}
                                    min={30}
                                    max={365}
                                    placeholder="Leave empty for no expiry"
                                />
                                <div className="col-span-2">
                                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                                        <div>
                                            <span className="text-sm font-semibold text-gray-700">Require Two-Factor Authentication</span>
                                            <p className="text-xs text-gray-500 mt-1">All admin users must enable 2FA</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="two_factor_required"
                                                checked={securityForm.two_factor_required}
                                                onChange={handleSecurityChange}
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
                                            <span className="text-sm font-semibold text-gray-700">Require Email Verification</span>
                                            <p className="text-xs text-gray-500 mt-1">New users must verify their email address</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="require_email_verification"
                                                checked={securityForm.require_email_verification}
                                                onChange={handleSecurityChange}
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
                                            <span className="text-sm font-semibold text-gray-700">Require Phone Verification</span>
                                            <p className="text-xs text-gray-500 mt-1">Users must verify their phone number</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="require_phone_verification"
                                                checked={securityForm.require_phone_verification}
                                                onChange={handleSecurityChange}
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
            )}
        </div>
    );
};

export default SystemSettings;