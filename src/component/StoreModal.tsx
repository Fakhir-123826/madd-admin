import { useState, useEffect } from "react";
import { FaTimes, FaSave, FaStore, FaGlobe, FaLanguage, FaMoneyBillWave, FaBuilding } from "react-icons/fa";
import { useGetVendorsForStoreQuery } from "../app/api/StoreSlices/StoreApi";

interface StoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    store: any;
    onSave: (formData: any) => Promise<void>;
}

const StoreModal = ({ isOpen, onClose, store, onSave }: StoreModalProps) => {
    const [formData, setFormData] = useState({
        vendor_id: "",
        store_name: "",
        store_slug: "",
        subdomain: "",
        country_code: "",
        language_code: "en",
        currency_code: "USD",
        status: "inactive",
        contact_email: "",
        contact_phone: "",
        primary_color: "#14B8A6",
        secondary_color: "#10B981",
        description: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        timezone: "UTC",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch vendors for dropdown
    const { data: vendorsData, isLoading: isLoadingVendors } = useGetVendorsForStoreQuery(undefined, {
        skip: !isOpen, // Only fetch when modal is open
    });

    const vendors = vendorsData?.data || [];

    useEffect(() => {
        if (store) {
            setFormData({
                vendor_id: store.vendor?.id?.toString() || store.vendor_id?.toString() || "",
                store_name: store.store_name || "",
                store_slug: store.store_slug || "",
                subdomain: store.subdomain || "",
                country_code: store.country?.code || store.country_code || "",
                language_code: store.language?.code || store.language_code || "en",
                currency_code: store.currency?.code || store.currency_code || "USD",
                status: store.status || "inactive",
                contact_email: store.contact_email || "",
                contact_phone: store.contact_phone || "",
                primary_color: store.primary_color || "#14B8A6",
                secondary_color: store.secondary_color || "#10B981",
                description: store.description || "",
                address: store.address || "",
                city: store.city || "",
                state: store.state || "",
                zip_code: store.zip_code || "",
                timezone: store.timezone || "UTC",
            });
        } else {
            // Reset form when adding new store
            setFormData({
                vendor_id: "",
                store_name: "",
                store_slug: "",
                subdomain: "",
                country_code: "",
                language_code: "en",
                currency_code: "USD",
                status: "inactive",
                contact_email: "",
                contact_phone: "",
                primary_color: "#14B8A6",
                secondary_color: "#10B981",
                description: "",
                address: "",
                city: "",
                state: "",
                zip_code: "",
                timezone: "UTC",
            });
        }
    }, [store]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const submitData = {
                vendor_id: parseInt(formData.vendor_id),
                store_name: formData.store_name,
                store_slug: formData.store_slug,
                country_code: formData.country_code,
                language_code: formData.language_code,
                currency_code: formData.currency_code,
                timezone: formData.timezone,
                subdomain: formData.subdomain || undefined,
                status: formData.status as "active" | "inactive" | "pending",
                primary_color: formData.primary_color,
                secondary_color: formData.secondary_color,
                contact_email: formData.contact_email || undefined,
                contact_phone: formData.contact_phone || undefined,
                description: formData.description || undefined,
                address: formData.address ? {
                    line1: formData.address,
                    city: formData.city,
                    state: formData.state,
                    postal_code: formData.zip_code,
                } : undefined,
            };
            await onSave(submitData);
            onClose();
        } catch (err: any) {
            setError(err?.data?.message || "Failed to save store");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white z-10">
                        <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    {store ? "Edit Store" : "Add New Store"}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {store ? "Update store information" : "Create a new store"}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
                                {error}
                            </div>
                        )}

                        {/* Vendor Selection */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FaBuilding className="text-teal-500" /> Vendor Information
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Vendor *
                                </label>
                                <select
                                    name="vendor_id"
                                    value={formData.vendor_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                    disabled={isLoadingVendors}
                                >
                                    <option value="">Select a vendor</option>
                                    {vendors.map((vendor: any) => (
                                        <option key={vendor.id} value={vendor.id}>
                                            {vendor.company_name} {vendor.status === "active" ? "✓" : ""}
                                        </option>
                                    ))}
                                </select>
                                {isLoadingVendors && (
                                    <p className="text-xs text-gray-400 mt-1">Loading vendors...</p>
                                )}
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FaStore className="text-teal-500" /> Basic Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Store Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="store_name"
                                        value={formData.store_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                        placeholder="Enter store name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Store Slug
                                    </label>
                                    <input
                                        type="text"
                                        name="store_slug"
                                        value={formData.store_slug}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                        placeholder="store-url-slug"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Used in URL path</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subdomain
                                    </label>
                                    <input
                                        type="text"
                                        name="subdomain"
                                        value={formData.subdomain}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                        placeholder="store"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">store.yourdomain.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Localization */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FaGlobe className="text-teal-500" /> Localization
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Country *
                                    </label>
                                    <select
                                        name="country_code"
                                        value={formData.country_code}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                    >
                                        <option value="">Select Country</option>
                                        <option value="US">United States</option>
                                        <option value="GB">United Kingdom</option>
                                        <option value="CA">Canada</option>
                                        <option value="AU">Australia</option>
                                        <option value="DE">Germany</option>
                                        <option value="FR">France</option>
                                        <option value="IN">India</option>
                                        <option value="PK">Pakistan</option>
                                        <option value="AE">UAE</option>
                                        <option value="SA">Saudi Arabia</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Language
                                    </label>
                                    <select
                                        name="language_code"
                                        value={formData.language_code}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                        <option value="it">Italian</option>
                                        <option value="pt">Portuguese</option>
                                        <option value="ar">Arabic</option>
                                        <option value="zh">Chinese</option>
                                        <option value="ja">Japanese</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Currency
                                    </label>
                                    <select
                                        name="currency_code"
                                        value={formData.currency_code}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="JPY">JPY (¥)</option>
                                        <option value="CNY">CNY (¥)</option>
                                        <option value="AED">AED (د.إ)</option>
                                        <option value="SAR">SAR (﷼)</option>
                                        <option value="PKR">PKR (Rs)</option>
                                        <option value="INR">INR (₹)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Address Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                        placeholder="Street address"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                        placeholder="City"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                        placeholder="State/Province"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ZIP / Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        name="zip_code"
                                        value={formData.zip_code}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                        placeholder="ZIP code"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Timezone
                                    </label>
                                    <select
                                        name="timezone"
                                        value={formData.timezone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                    >
                                        <option value="UTC">UTC</option>
                                        <option value="America/New_York">Eastern Time (ET)</option>
                                        <option value="America/Chicago">Central Time (CT)</option>
                                        <option value="America/Denver">Mountain Time (MT)</option>
                                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                        <option value="Europe/London">London (GMT)</option>
                                        <option value="Europe/Paris">Paris (CET)</option>
                                        <option value="Asia/Dubai">Dubai (GST)</option>
                                        <option value="Asia/Karachi">Karachi (PKT)</option>
                                        <option value="Asia/Kolkata">Mumbai (IST)</option>
                                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        name="contact_email"
                                        value={formData.contact_email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                        placeholder="store@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="contact_phone"
                                        value={formData.contact_phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                        placeholder="+1234567890"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Status & Branding */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Status & Branding</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Primary Color
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            name="primary_color"
                                            value={formData.primary_color}
                                            onChange={handleChange}
                                            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            name="primary_color"
                                            value={formData.primary_color}
                                            onChange={handleChange}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Secondary Color
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            name="secondary_color"
                                            value={formData.secondary_color}
                                            onChange={handleChange}
                                            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            name="secondary_color"
                                            value={formData.secondary_color}
                                            onChange={handleChange}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                placeholder="Store description..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StoreModal;