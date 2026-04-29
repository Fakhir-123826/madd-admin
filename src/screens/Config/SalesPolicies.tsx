// src/screens/Config/SalesPolicies.tsx
import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSync, FaEye } from "react-icons/fa";
import {
    useGetSalesPoliciesQuery,
    useCreateSalesPolicyMutation,
    useUpdateSalesPolicyMutation,
    useDeleteSalesPolicyMutation,
    type SalesPolicy,
} from "../../app/api/ConfigSlices/ConfigApi";

const SalesPolicies = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<SalesPolicy | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const { data, isLoading, refetch } = useGetSalesPoliciesQuery();
    const [createPolicy, { isLoading: isCreating }] = useCreateSalesPolicyMutation();
    const [updatePolicy, { isLoading: isUpdating }] = useUpdateSalesPolicyMutation();
    const [deletePolicy] = useDeleteSalesPolicyMutation();

    const policies = data?.data ?? [];

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = async (formData: Partial<SalesPolicy>) => {
        try {
            if (selectedPolicy) {
                await updatePolicy({ id: selectedPolicy.id, data: formData }).unwrap();
                showToast("success", "Sales policy updated successfully");
            } else {
                await createPolicy(formData).unwrap();
                showToast("success", "Sales policy created successfully");
            }
            setIsModalOpen(false);
            setSelectedPolicy(null);
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to save sales policy");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this sales policy?")) {
            try {
                await deletePolicy(id).unwrap();
                showToast("success", "Sales policy deleted successfully");
                refetch();
            } catch (error: any) {
                showToast("error", error?.data?.message || "Failed to delete sales policy");
            }
        }
    };

    const filteredPolicies = policies.filter(policy =>
        policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

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
                    <h2 className="text-lg font-semibold text-gray-800">Sales Policies</h2>
                    <p className="text-sm text-gray-500">Manage return, refund, and warranty policies</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => refetch()} className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 transition">
                        <FaSync className="text-sm" />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedPolicy(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium hover:opacity-90 transition"
                    >
                        <FaPlus className="text-xs" /> Add Policy
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-sm">
                <input
                    type="text"
                    placeholder="Search by policy name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPolicies.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        No sales policies found
                    </div>
                ) : (
                    filteredPolicies.map((policy) => (
                        <div key={policy.id} className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:border-teal-200">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 text-lg">{policy.name}</h3>
                                    <p className="text-xs text-gray-400">Slug: {policy.slug}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => {
                                            setSelectedPolicy(policy);
                                            setIsViewModalOpen(true);
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        title="View Details"
                                    >
                                        <FaEye className="text-sm" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedPolicy(policy);
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                                        title="Edit"
                                    >
                                        <FaEdit className="text-sm" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(policy.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                        title="Delete"
                                    >
                                        <FaTrash className="text-sm" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                                {policy.description || "No description provided"}
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${policy.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                    {policy.is_active ? "Active" : "Inactive"}
                                </span>
                                <span className="text-xs text-gray-400">
                                    Updated: {new Date(policy.updated_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Sales Policy Modal */}
            <SalesPolicyModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedPolicy(null); }}
                policy={selectedPolicy}
                onSave={handleSubmit}
                isLoading={isCreating || isUpdating}
            />

            {/* View Policy Modal */}
            <ViewPolicyModal
                isOpen={isViewModalOpen}
                onClose={() => { setIsViewModalOpen(false); setSelectedPolicy(null); }}
                policy={selectedPolicy}
            />
        </div>
    );
};

// Sales Policy Modal Component
const SalesPolicyModal = ({ isOpen, onClose, policy, onSave, isLoading }: any) => {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        content: "",
        is_active: true,
    });

    React.useEffect(() => {
        if (policy) {
            setFormData({
                name: policy.name,
                slug: policy.slug,
                description: policy.description || "",
                content: policy.content || "",
                is_active: policy.is_active,
            });
        } else {
            setFormData({
                name: "",
                slug: "",
                description: "",
                content: "",
                is_active: true,
            });
        }
    }, [policy]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const generateSlug = () => {
        const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full">
                    <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
                        <h2 className="text-lg font-bold">{policy ? "Edit Sales Policy" : "Add Sales Policy"}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Policy Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={() => !formData.slug && generateSlug()}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Slug *</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    required
                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400"
                                />
                                <button type="button" onClick={generateSlug} className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                                    Generate
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Short Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Policy Content *</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows={8}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 font-mono text-sm"
                                placeholder="Detailed policy content..."
                            />
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm font-medium">Active</span>
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

// View Policy Modal
const ViewPolicyModal = ({ isOpen, onClose, policy }: any) => {
    if (!isOpen || !policy) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white z-10">
                        <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">{policy.name}</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-xs text-gray-500">Slug</span>
                            <p className="text-sm text-gray-700">{policy.slug}</p>
                        </div>
                        {policy.description && (
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                                <p className="text-gray-600">{policy.description}</p>
                            </div>
                        )}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">Policy Content</h3>
                            <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700">
                                {policy.content}
                            </div>
                        </div>
                        <div className="flex justify-between pt-4 border-t">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${policy.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                {policy.is_active ? "Active" : "Inactive"}
                            </span>
                            <span className="text-xs text-gray-400">
                                Created: {new Date(policy.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesPolicies;