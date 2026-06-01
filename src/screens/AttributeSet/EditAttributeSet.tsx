// src/screens/AttributeSet/EditAttributeSet.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    X,
    Loader2,
    Layers,
    CheckCircle,
    AlertCircle,
    RefreshCw,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
    useGetAttributeSetQuery,
    useUpdateAttributeSetMutation,
    useSyncSingleAttributeSetMutation,
} from '../../app/api/AttributeSetSlices/AttributeSetApi';

export const EditAttributeSet: React.FC = () => {
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>(); // Changed from id to uuid
    const [searchParams] = useSearchParams();
    const vendorUuid = searchParams.get('vendor') || '';

    const [formData, setFormData] = useState({
        attribute_set_name: '',
        sort_order: 0,
        description: '',
        local_display_name: '',
        local_notes: '',
        is_active: true,
        sync_to_magento: false,
    });
    
    const [isSyncing, setIsSyncing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Use uuid instead of id
    const { data: attributeSetData, isLoading: isLoadingAttributeSet, refetch } = useGetAttributeSetQuery(
        { vendor_uuid: vendorUuid, id: uuid! }, // The API expects 'id' but we pass uuid
        { skip: !vendorUuid || !uuid }
    );
    
    const [updateAttributeSet, { isLoading: isUpdating }] = useUpdateAttributeSetMutation();
    const [syncSingleAttributeSet] = useSyncSingleAttributeSetMutation();

    useEffect(() => {
        if (attributeSetData?.data) {
            const attrSet = attributeSetData.data;
            setFormData({
                attribute_set_name: attrSet.attribute_set_name,
                sort_order: attrSet.sort_order,
                description: attrSet.description || '',
                local_display_name: attrSet.local_display_name || '',
                local_notes: attrSet.local_notes || '',
                is_active: attrSet.is_active,
                sync_to_magento: false,
            });
        }
    }, [attributeSetData]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.attribute_set_name.trim()) {
            newErrors.attribute_set_name = 'Attribute set name is required';
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
            const updateData: any = {};
            
            if (formData.attribute_set_name !== attributeSetData?.data?.attribute_set_name) {
                updateData.attribute_set_name = formData.attribute_set_name;
            }
            if (formData.sort_order !== attributeSetData?.data?.sort_order) {
                updateData.sort_order = formData.sort_order;
            }
            if (formData.description !== attributeSetData?.data?.description) {
                updateData.description = formData.description;
            }
            if (formData.local_display_name !== attributeSetData?.data?.local_display_name) {
                updateData.local_display_name = formData.local_display_name;
            }
            if (formData.local_notes !== attributeSetData?.data?.local_notes) {
                updateData.local_notes = formData.local_notes;
            }
            if (formData.is_active !== attributeSetData?.data?.is_active) {
                updateData.is_active = formData.is_active;
            }
            updateData.sync_to_magento = formData.sync_to_magento;
            
            if (Object.keys(updateData).length === 0) {
                toast.error('No changes to update');
                return;
            }
            
            const result = await updateAttributeSet({
                vendor_uuid: vendorUuid,
                id: uuid!, // Pass the uuid as id parameter
                data: updateData,
            }).unwrap();
            
            toast.success(result.message || 'Attribute set updated successfully');
            
            if (formData.sync_to_magento && attributeSetData?.data?.magento_attr_set_id) {
                toast.success('Changes synced to Magento');
            }
            
            navigate(`/attribute-set-lists?vendor=${vendorUuid}`);
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update attribute set');
            if (error?.data?.errors) {
                setErrors(error.data.errors);
            }
        }
    };

    const handleSyncFromMagento = async () => {
        if (!attributeSetData?.data?.magento_attr_set_id) {
            toast.error('This attribute set is not linked to a Magento ID');
            return;
        }
        
        setIsSyncing(true);
        try {
            const result = await syncSingleAttributeSet({
                vendor_uuid: vendorUuid,
                magentoAttrSetId: attributeSetData.data.magento_attr_set_id,
            }).unwrap();
            
            toast.success('Attribute set synced from Magento successfully');
            await refetch();
            
            if (result.data) {
                setFormData({
                    attribute_set_name: result.data.attribute_set_name,
                    sort_order: result.data.sort_order,
                    description: result.data.description || '',
                    local_display_name: result.data.local_display_name || '',
                    local_notes: result.data.local_notes || '',
                    is_active: result.data.is_active,
                    sync_to_magento: false,
                });
            }
        } catch (error: any) {
            toast.error(error?.data?.error || 'Failed to sync from Magento');
        } finally {
            setIsSyncing(false);
        }
    };

    if (isLoadingAttributeSet) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
                    <p className="mt-2 text-gray-500">Loading attribute set...</p>
                </div>
            </div>
        );
    }

    const attributeSet = attributeSetData?.data;
    const isLinkedToMagento = !!attributeSet?.magento_attr_set_id;

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
                                    <h1 className="text-2xl font-bold text-gray-900">Edit Attribute Set</h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Update attribute set details
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {isLinkedToMagento && (
                                <button
                                    type="button"
                                    onClick={handleSyncFromMagento}
                                    disabled={isSyncing}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    {isSyncing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-4 h-4" />
                                    )}
                                    Sync from Magento
                                </button>
                            )}
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isUpdating}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                            >
                                {isUpdating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        {/* Magento Info Banner */}
                        {isLinkedToMagento && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-medium text-blue-900">
                                            Linked to Magento
                                        </h3>
                                        <p className="text-xs text-blue-700 mt-1">
                                            This attribute set is synced with Magento ID: {attributeSet.magento_attr_set_id}
                                            <br />
                                            Changes can be synced back to Magento by enabling the option below.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Display Name */}
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

                            {/* Attribute Set Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Attribute Set Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.attribute_set_name}
                                    onChange={(e) => setFormData({ ...formData, attribute_set_name: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {errors.attribute_set_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.attribute_set_name}</p>
                                )}
                                {isLinkedToMagento && (
                                    <p className="mt-1 text-xs text-yellow-600">
                                        Warning: Changing this name will require syncing to Magento to take effect.
                                    </p>
                                )}
                            </div>

                            {/* Magento ID */}
                            {isLinkedToMagento && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Magento ID
                                    </label>
                                    <input
                                        type="text"
                                        value={attributeSet.magento_attr_set_id}
                                        disabled
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
                                    />
                                </div>
                            )}

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
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Status & Sync Options</h2>
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
                                    
                                    {isLinkedToMagento && (
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.sync_to_magento}
                                                onChange={(e) => setFormData({ ...formData, sync_to_magento: e.target.checked })}
                                                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                            />
                                            <span className="text-sm text-gray-700">
                                                Sync changes to Magento
                                            </span>
                                        </label>
                                    )}
                                </div>
                                
                                {formData.sync_to_magento && isLinkedToMagento && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                                            <p className="text-xs text-blue-800">
                                                The attribute set name and sort order will be updated in Magento.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sync Status Info */}
                            {attributeSet?.sync_status && (
                                <div className="border-t border-gray-200 pt-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Sync Information</h2>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Sync Status</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                attributeSet.sync_status === 'synced' ? 'bg-green-100 text-green-800' :
                                                attributeSet.sync_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {attributeSet.sync_status}
                                            </span>
                                        </div>
                                        {attributeSet.last_synced_at && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Last Synced</span>
                                                <span className="text-sm text-gray-900">
                                                    {new Date(attributeSet.last_synced_at).toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                        {attributeSet.sync_error_message && (
                                            <div className="mt-2 p-2 bg-red-50 rounded-lg">
                                                <p className="text-sm text-red-600">{attributeSet.sync_error_message}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Statistics */}
                            <div className="border-t border-gray-200 pt-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500">Total Attributes</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {attributeSet?.assigned_attribute_ids?.length || 0}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500">Created</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {attributeSet?.created_at ? new Date(attributeSet.created_at).toLocaleDateString() : 'N/A'}
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