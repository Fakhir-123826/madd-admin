// Create a new file: ProductEditModal.tsx

import { useState, useEffect } from "react";
import Input from "../../component/Inputs Feilds/Input";
import AddButton from "../../component/AddButton";
import { useUpdateProductMutation, useDeleteProductMutation } from "../../app/api/ProductSlices/ProductApi";
import { useGetVendorsQuery } from "../../app/api/VendorSlices/VendorApi";

interface Product {
    id: number;
    uuid: string;
    name: string;
    sku: string;
    magento_sku: string;
    description?: string;
    short_description?: string;
    price: number;
    formatted_price?: string;
    special_price?: number;
    quantity: number;
    is_in_stock: boolean;
    weight?: number;
    status: "active" | "inactive" | "draft";
    type_id: string;
    is_featured?: boolean;
    vendor_id: number;
    store_id?: number;
    vendor?: { id: number; name: string; company_name?: string };
    store?: { id: number; store_name: string };
}

interface ProductEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSuccess: () => void;
    isAdmin?: boolean;
}

const ProductEditModal = ({ isOpen, onClose, product, onSuccess, isAdmin = false }: ProductEditModalProps) => {
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        description: "",
        short_description: "",
        price: "",
        special_price: "",
        quantity: "",
        weight: "",
        status: "active" as "active" | "inactive" | "draft",
        is_in_stock: true,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                sku: product.sku || product.magento_sku || "",
                description: product.description || "",
                short_description: product.short_description || "",
                price: product.price?.toString() || "",
                special_price: product.special_price?.toString() || "",
                quantity: product.quantity?.toString() || "0",
                weight: product.weight?.toString() || "",
                status: product.status || "active",
                is_in_stock: product.is_in_stock ?? true,
            });
        }
    }, [product]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.name.trim()) newErrors.name = "Product name is required";
        if (!formData.sku.trim()) newErrors.sku = "SKU is required";
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required";
        if (!formData.quantity || parseInt(formData.quantity) < 0) newErrors.quantity = "Valid quantity is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        if (!product) return;
        
        const payload = {
            name: formData.name,
            sku: formData.sku,
            description: formData.description || undefined,
            short_description: formData.short_description || undefined,
            price: parseFloat(formData.price),
            special_price: formData.special_price ? parseFloat(formData.special_price) : undefined,
            quantity: parseInt(formData.quantity),
            weight: formData.weight ? parseFloat(formData.weight) : undefined,
            status: formData.status,
        };
        
        try {
            const result = await updateProduct({ uuid: product.uuid, data: payload }).unwrap();
            if (result.success) {
                setToast({ type: "success", message: "Product updated successfully!" });
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            }
        } catch (error: any) {
            setToast({ type: "error", message: error?.data?.message || "Failed to update product" });
        }
    };

    const handleDelete = async () => {
        if (!product) return;
        
        try {
            const result = await deleteProduct(product.uuid).unwrap();
            if (result.success) {
                setToast({ type: "success", message: "Product deleted successfully!" });
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            }
        } catch (error: any) {
            setToast({ type: "error", message: error?.data?.message || "Failed to delete product" });
        }
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {toast && (
                <div className={`fixed top-5 right-5 z-[60] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.message}
                </div>
            )}
            
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                    <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
                    
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Edit Product</h2>
                            <p className="text-sm text-gray-500 mt-0.5">{product.name}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-0.5 cursor-pointer">✕</button>
                    </div>
                    
                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {!showDeleteConfirm ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Product Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        error={errors.name}
                                    />
                                    <Input
                                        label="SKU"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        required
                                        error={errors.sku}
                                    />
                                </div>
                                
                                {/* Descriptions */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Short Description</label>
                                    <textarea
                                        name="short_description"
                                        rows={2}
                                        value={formData.short_description}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Full Description</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                                    />
                                </div>
                                
                                {/* Pricing & Inventory */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        error={errors.price}
                                    />
                                    <Input
                                        label="Special Price"
                                        name="special_price"
                                        type="number"
                                        step="0.01"
                                        value={formData.special_price}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        label="Quantity"
                                        name="quantity"
                                        type="number"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        required
                                        error={errors.quantity}
                                    />
                                    <Input
                                        label="Weight (kg)"
                                        name="weight"
                                        type="number"
                                        step="0.01"
                                        value={formData.weight}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                {/* Status & Stock */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-700">Status</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="active"
                                                    checked={formData.status === "active"}
                                                    onChange={handleChange}
                                                />
                                                Active
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="inactive"
                                                    checked={formData.status === "inactive"}
                                                    onChange={handleChange}
                                                />
                                                Inactive
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="draft"
                                                    checked={formData.status === "draft"}
                                                    onChange={handleChange}
                                                />
                                                Draft
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                                        <span className="text-sm font-semibold text-gray-700">In Stock</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="is_in_stock"
                                                checked={formData.is_in_stock}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500 transition"></div>
                                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                                        </label>
                                    </div>
                                </div>
                                
                                {/* Buttons */}
                                <div className="flex justify-between gap-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                        Delete Product
                                    </button>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition disabled:bg-teal-300"
                                        >
                                            {isUpdating ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            /* Delete Confirmation */
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Product</h3>
                                <p className="text-gray-500 mb-6">
                                    Are you sure you want to delete <strong>{product.name}</strong>?<br />
                                    This action cannot be undone.
                                </p>
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:bg-red-300"
                                    >
                                        {isDeleting ? "Deleting..." : "Confirm Delete"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductEditModal;