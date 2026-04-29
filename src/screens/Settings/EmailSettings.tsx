// src/screens/Settings/EmailSettings.tsx
import { useState, useEffect } from "react";
import { FaSave, FaSync, FaEnvelope, FaMailBulk, FaServer, FaLock } from "react-icons/fa";
import { useGetEmailSettingsQuery, useUpdateSettingsMutation } from "../../app/api/SettingsSlices/SettingsApi";
import Input from "../../component/Inputs Feilds/Input";

const EmailSettings = () => {
    const { data, isLoading, refetch } = useGetEmailSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

    const [formData, setFormData] = useState({
        mail_driver: "log" as "smtp" | "ses" | "sendmail" | "log",
        mail_host: "",
        mail_port: 587,
        mail_username: "",
        mail_password: "",
        mail_encryption: "tls" as "tls" | "ssl" | null,
        mail_from_address: "",
        mail_from_name: "",
    });

    const [testEmail, setTestEmail] = useState("");
    const [sendingTest, setSendingTest] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    useEffect(() => {
        if (data?.data) {
            setFormData({
                mail_driver: data.data.mail_driver || "log",
                mail_host: data.data.mail_host || "",
                mail_port: data.data.mail_port || 587,
                mail_username: data.data.mail_username || "",
                mail_password: data.data.mail_password || "",
                mail_encryption: data.data.mail_encryption || "tls",
                mail_from_address: data.data.mail_from_address || "",
                mail_from_name: data.data.mail_from_name || "",
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
                group: "email",
                settings: formData,
            }).unwrap();
            showToast("success", "Email settings updated successfully");
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to update email settings");
        }
    };

    const sendTestEmail = async () => {
        if (!testEmail) {
            showToast("error", "Please enter a test email address");
            return;
        }

        setSendingTest(true);
        try {
            // You'll need to add a test email endpoint in your backend
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/settings/test-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ email: testEmail }),
            });
            
            if (response.ok) {
                showToast("success", `Test email sent to ${testEmail}`);
                setTestEmail("");
            } else {
                throw new Error("Failed to send test email");
            }
        } catch (error: any) {
            showToast("error", error?.message || "Failed to send test email");
        } finally {
            setSendingTest(false);
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

            {/* Mail Configuration */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <FaServer className="text-2xl text-teal-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Mail Configuration</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">Mail Driver</label>
                            <select
                                name="mail_driver"
                                value={formData.mail_driver}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                            >
                                <option value="smtp">SMTP</option>
                                <option value="ses">Amazon SES</option>
                                <option value="sendmail">Sendmail</option>
                                <option value="log">Log (Development Only)</option>
                            </select>
                        </div>

                        {formData.mail_driver === "smtp" && (
                            <>
                                <Input
                                    label="SMTP Host"
                                    name="mail_host"
                                    value={formData.mail_host}
                                    onChange={handleChange}
                                    placeholder="smtp.gmail.com"
                                />
                                <Input
                                    label="SMTP Port"
                                    name="mail_port"
                                    type="number"
                                    value={formData.mail_port}
                                    onChange={handleChange}
                                    placeholder="587"
                                />
                                <Input
                                    label="SMTP Username"
                                    name="mail_username"
                                    value={formData.mail_username}
                                    onChange={handleChange}
                                    placeholder="your-email@example.com"
                                />
                                <Input
                                    label="SMTP Password"
                                    name="mail_password"
                                    type="password"
                                    value={formData.mail_password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                />
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Encryption</label>
                                    <select
                                        name="mail_encryption"
                                        value={formData.mail_encryption || ""}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    >
                                        <option value="tls">TLS</option>
                                        <option value="ssl">SSL</option>
                                        <option value="">None</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Sender Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <FaEnvelope className="text-2xl text-teal-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Sender Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="From Email Address"
                            name="mail_from_address"
                            type="email"
                            value={formData.mail_from_address}
                            onChange={handleChange}
                            required
                            placeholder="noreply@example.com"
                        />
                        <Input
                            label="From Name"
                            name="mail_from_name"
                            value={formData.mail_from_name}
                            onChange={handleChange}
                            required
                            placeholder="Your Store Name"
                        />
                    </div>
                </div>
            </div>

            {/* Test Email */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <FaMailBulk className="text-2xl text-teal-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Test Email Configuration</h3>
                    </div>

                    <div className="flex gap-3">
                        <Input
                            label="Send Test Email To"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            type="email"
                            placeholder="admin@example.com"
                            className="flex-1"
                        />
                        <button
                            type="button"
                            onClick={sendTestEmail}
                            disabled={sendingTest}
                            className="mt-7 px-6 py-2 bg-gradient-to-r from-teal-400 to-green-400 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {sendingTest ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <FaEnvelope />}
                            Send Test
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Test your email configuration by sending a test email</p>
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

export default EmailSettings;