// src/screens/Config/Couriers.tsx
import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSync, FaTruck, FaStar, FaPlug } from "react-icons/fa";
import {
    useGetCouriersQuery,
    useCreateCourierMutation,
    useUpdateCourierMutation,
    useDeleteCourierMutation,
    useTestCourierConnectionMutation,
    type Courier,
} from "../../app/api/ConfigSlices/ConfigApi";

const Couriers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [testingId, setTestingId] = useState<number | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const { data, isLoading, refetch } = useGetCouriersQuery();
    const [createCourier, { isLoading: isCreating }] = useCreateCourierMutation();
    const [updateCourier, { isLoading: isUpdating }] = useUpdateCourierMutation();
    const [deleteCourier] = useDeleteCourierMutation();
    const [testConnection] = useTestCourierConnectionMutation();

    const couriers = data?.data ?? [];

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = async (formData: Partial<Courier>) => {
        try {
            if (selectedCourier) {
                await updateCourier({ id: selectedCourier.id, data: formData }).unwrap();
                showToast("success", "Courier updated successfully");
            } else {
                await createCourier(formData).unwrap();
                showToast("success", "Courier created successfully");
            }
            setIsModalOpen(false);
            setSelectedCourier(null);
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to save courier");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this courier?")) {
            try {
                await deleteCourier(id).unwrap();
                showToast("success", "Courier deleted successfully");
                refetch();
            } catch (error: any) {
                showToast("error", error?.data?.message || "Failed to delete courier");
            }
        }
    };

    const handleTestConnection = async (id: number) => {
        setTestingId(id);
        try {
            await testConnection(id).unwrap();
            showToast("success", "Connection test successful!");
        } catch (error: any) {
            showToast("error", error?.data?.message || "Connection test failed");
        } finally {
            setTestingId(null);
        }
    };

    const filteredCouriers = couriers.filter(courier =>
        courier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courier.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    const defaultCourier = couriers.find(c => c.is_default);

    return (
        <div>
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Shipping Couriers</h2>
                    <p className="text-sm text-gray-500">Manage shipping carriers and services</p>
                    {defaultCourier && (
                        <p className="text-xs text-teal-600 mt-1">Default Courier: {defaultCourier.name}</p>
                    )}
                </div>
                <div className="flex gap-3">
                    <button onClick={() => refetch()} className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 transition">
                        <FaSync className="text-sm" />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedCourier(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium hover:opacity-90 transition"
                    >
                        <FaPlus className="text-xs" /> Add Courier
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-sm">
                <input
                    type="text"
                    placeholder="Search by courier name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCouriers.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        No couriers found
                    </div>
                ) : (
                    filteredCouriers.map((courier) => (
                        <div key={courier.id} className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:border-teal-200">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-green-400 flex items-center justify-center">
                                        <FaTruck className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-lg">{courier.name}</h3>
                                        <p className="text-xs text-gray-400">Code: {courier.code}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleTestConnection(courier.id)}
                                        disabled={testingId === courier.id}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        title="Test Connection"
                                    >
                                        {testingId === courier.id ? (
                                            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                                        ) : (
                                            <FaPlug className="text-sm" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedCourier(courier);
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                                        title="Edit"
                                    >
                                        <FaEdit className="text-sm" />
                                    </button>
                                    {!courier.is_default && (
                                        <button onClick={() => handleDelete(courier.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                                            <FaTrash className="text-sm" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {courier.description || "No description provided"}
                            </p>

                            <div className="space-y-1 mb-3 text-xs">
                                {courier.tracking_url && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">Tracking URL:</span>
                                        <span className="text-gray-600 truncate">{courier.tracking_url}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="flex gap-2">
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${courier.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                        {courier.is_active ? "Active" : "Inactive"}
                                    </span>
                                    {courier.is_default && (
                                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1">
                                            <FaStar className="text-xs" /> Default
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-gray-400">
                                    Updated: {new Date(courier.updated_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Courier Modal */}
            <CourierModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedCourier(null); }}
                courier={selectedCourier}
                onSave={handleSubmit}
                isLoading={isCreating || isUpdating}
                couriers={couriers}
            />
        </div>
    );
};

// Courier Modal Component
const CourierModal = ({ isOpen, onClose, courier, onSave, isLoading, couriers }: any) => {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        api_url: "",
        api_key: "",
        api_secret: "",
        tracking_url: "",
        is_default: false,
        is_active: true,
        config: {},
    });

    React.useEffect(() => {
        if (courier) {
            setFormData({
                name: courier.name,
                code: courier.code,
                description: courier.description || "",
                api_url: courier.api_url || "",
                api_key: courier.api_key || "",
                api_secret: courier.api_secret || "",
                tracking_url: courier.tracking_url || "",
                is_default: courier.is_default,
                is_active: courier.is_active,
                config: courier.config || {},
            });
        } else {
            setFormData({
                name: "",
                code: "",
                description: "",
                api_url: "",
                api_key: "",
                api_secret: "",
                tracking_url: "",
                is_default: false,
                is_active: true,
                config: {},
            });
        }
    }, [courier]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.is_default && !courier?.is_default) {
            const hasDefault = couriers.some((c: Courier) => c.is_default && c.id !== courier?.id);
            if (hasDefault && !confirm("This will remove default from the existing default courier. Continue?")) {
                return;
            }
        }
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
                        <h2 className="text-lg font-bold">{courier ? "Edit Courier" : "Add Courier"}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Code *</label>
                                <input type="text" name="code" value={formData.code} onChange={handleChange} required placeholder="fedex, ups, dhl" className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">API URL</label>
                            <input type="url" name="api_url" value={formData.api_url} onChange={handleChange} placeholder="https://api.courier.com/v1" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">API Key</label>
                                <input type="password" name="api_key" value={formData.api_key} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">API Secret</label>
                                <input type="password" name="api_secret" value={formData.api_secret} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tracking URL Template</label>
                            <input type="text" name="tracking_url" value={formData.tracking_url} onChange={handleChange} placeholder="https://courier.com/track/{tracking_number}" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span>Set as Default Courier</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="is_default" checked={formData.is_default} onChange={handleChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span>Active</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5"></div>
                            </label>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border">Cancel</button>
                            <button type="submit" disabled={isLoading} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white">
                                {isLoading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Couriers;