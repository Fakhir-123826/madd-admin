// src/screens/AttributeSet/CreateAttributeSet.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    X,
    Loader2,
    Layers,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCreateAttributeSetMutation, useGetAttributeSetsQuery } from '../../app/api/AttributeSetSlices/AttributeSetApi';
import { useGetVendorsQuery } from '../../app/api/VendorSlices/VendorApi';
import SearchableSelect from '../../component/SearchableSelect';
import type { AttributeSet } from '../../app/api/AttributeSetSlices/AttributeSetApi';

export const CreateAttributeSet: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const vendorUuidFromUrl = searchParams.get('vendor');

    const [formData, setFormData] = useState({
        vendor_uuid: vendorUuidFromUrl || '',
        attribute_set_name: '',
        sort_order: 0,
        skeleton_id: 4, // Default to "Default" attribute set
        description: '',
        local_display_name: '',
        local_notes: '',
        is_active: true,
        sync_to_magento: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const { data: vendors, isLoading: vendorsLoading } = useGetVendorsQuery();
    const [createAttributeSet, { isLoading: isCreating }] = useCreateAttributeSetMutation();

    // Fetch existing attribute sets for "Based On" dropdown
    const { data: existingAttributeSets } = useGetAttributeSetsQuery(
        { vendor_uuid: formData.vendor_uuid, per_page: 100 },
        { skip: !formData.vendor_uuid }
    );

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.vendor_uuid) {
            newErrors.vendor_uuid = 'Please select a vendor';
        }
        if (!formData.attribute_set_name.trim()) {
            newErrors.attribute_set_name = 'Attribute set name is required';
        }
        if (!formData.skeleton_id) {
            newErrors.skeleton_id = 'Please select a base attribute set';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const submitData = {
                attribute_set_name: formData.attribute_set_name,
                sort_order: formData.sort_order,
                entity_type_id: 4,
                skeleton_id: formData.skeleton_id,
                description: formData.description || undefined,
                local_display_name: formData.local_display_name || undefined,
                local_notes: formData.local_notes || undefined,
                is_active: formData.is_active,
            };

            const result = await createAttributeSet({
                vendor_uuid: formData.vendor_uuid,
                data: submitData,
            }).unwrap();

            toast.success(result.message || 'Attribute set created successfully');
            navigate(`/attribute-set-lists?vendor=${formData.vendor_uuid}`);
        } catch (error: any) {
            toast.error(error?.data?.error || error?.data?.message || 'Failed to create attribute set');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Layers className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Create Attribute Set</h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Create a new product attribute set for Magento
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isCreating}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                            >
                                {isCreating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Create Attribute Set
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="space-y-6">
                            {/* Vendor Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vendor *
                                </label>
                                <SearchableSelect
                                    options={vendors?.data?.map((v: any) => ({ value: v.uuid, label: v.company_name })) || []}
                                    value={formData.vendor_uuid}
                                    onChange={(value) => {
                                        setFormData({ ...formData, vendor_uuid: value });
                                        // Clear skeleton_id when vendor changes
                                        setFormData(prev => ({ ...prev, skeleton_id: 4 }));
                                    }}
                                    placeholder="Select Vendor..."
                                    disabled={!!vendorUuidFromUrl}
                                />
                                {errors.vendor_uuid && (
                                    <p className="mt-1 text-sm text-red-600">{errors.vendor_uuid}</p>
                                )}
                            </div>

                            {/* Based On Dropdown - Only show if vendor is selected */}
                            {formData.vendor_uuid && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Based On *
                                    </label>
                                    <SearchableSelect
                                        value={String(formData.skeleton_id)}
                                        onChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                skeleton_id: parseInt(value),
                                            })
                                        }
                                        placeholder="Select Attribute Set"
                                        options={[
                                            {
                                                value: "4",
                                                label: "Default (Default Attribute Set)",
                                            },
                                            ...(existingAttributeSets?.data
                                                ?.filter((set: AttributeSet) => set.magento_attr_set_id)
                                                .map((set: AttributeSet) => ({
                                                    value: String(set.magento_attr_set_id),
                                                    label: `${set.attribute_set_name} (ID: ${set.magento_attr_set_id})`,
                                                })) || []),
                                        ]}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Copy attributes and groups from an existing attribute set
                                    </p>
                                    {errors.skeleton_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.skeleton_id}</p>
                                    )}
                                </div>
                            )}

                            {/* Attribute Set Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Attribute Set Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.attribute_set_name}
                                    onChange={(e) => setFormData({ ...formData, attribute_set_name: e.target.value })}
                                    placeholder="e.g., Electronics, Clothing, Furniture"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {errors.attribute_set_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.attribute_set_name}</p>
                                )}
                            </div>

                            {/* Display Name (Local only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Display Name (Local)
                                </label>
                                <input
                                    type="text"
                                    value={formData.local_display_name}
                                    onChange={(e) => setFormData({ ...formData, local_display_name: e.target.value })}
                                    placeholder="Optional friendly name for internal reference"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Only used locally, does not sync to Magento
                                </p>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    value={formData.sort_order}
                                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Determines display order. Lower numbers appear first.
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    placeholder="Optional description of this attribute set"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Internal Notes
                                </label>
                                <textarea
                                    value={formData.local_notes}
                                    onChange={(e) => setFormData({ ...formData, local_notes: e.target.value })}
                                    rows={2}
                                    placeholder="Private notes for internal reference"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            {/* Options */}
                            <div className="border-t border-gray-200 pt-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Options</h2>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                        />
                                        <span className="text-sm text-gray-700">Active (visible in system)</span>
                                    </label>
                                </div>

                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                                        <p className="text-xs text-blue-800">
                                            This attribute set will be created in Magento automatically.
                                            The local record will only be created after successful Magento sync.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-medium text-purple-900">About Attribute Sets</h3>
                                        <p className="text-xs text-purple-700 mt-1">
                                            Attribute sets define which attributes are available for products.
                                            Each product must be assigned to an attribute set.
                                            The "Based On" field determines which attributes and groups to copy.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};