// src/pages/AttributeSet/AttributeSetList.tsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    RefreshCw,
    Eye,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Layers,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    X,
    Tag,
    Hash,
    Calendar,
    List,
    Grid,
    ArrowUpDown,
    Download,
    Upload,
    Copy,
    Link,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
    useGetAttributeSetsQuery,
    useDeleteAttributeSetMutation,
    useSyncAttributeSetsMutation,
    useGetAttributeSetQuery,
    useUpdateAttributeSetMutation,
    useSyncSingleAttributeSetMutation,
    type AttributeSet,
} from '../../app/api/AttributeSetSlices/AttributeSetApi';
import { useGetVendorsQuery } from '../../app/api/VendorSlices/VendorApi';
import SearchableSelect from '../../component/SearchableSelect';

export const AttributeSetList: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [selectedVendorUuid, setSelectedVendorUuid] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterSyncStatus, setFilterSyncStatus] = useState<string>('all');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [selectedAttributeSetId, setSelectedAttributeSetId] = useState<string | null>(null);
    const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const [syncMagentoId, setSyncMagentoId] = useState<string>('');

    const perPage = 12;

    const { data: vendors, isLoading: vendorsLoading, error: vendorsError } = useGetVendorsQuery();

    const {
        data: attributeSetsData,
        isLoading: attributeSetsLoading,
        isFetching,
        refetch,
    } = useGetAttributeSetsQuery(
        {
            vendor_uuid: selectedVendorUuid,
            page: currentPage,
            per_page: perPage,
            search: debouncedSearch,
            sync_status: filterSyncStatus !== 'all' ? filterSyncStatus : undefined,
            is_active: filterStatus !== 'all' ? filterStatus === 'active' : undefined,
            sort_by: sortBy,
            sort_order: sortOrder,
        },
        { skip: !selectedVendorUuid }
    );

    const { data: attributeSetDetail, refetch: refetchAttributeSet } = useGetAttributeSetQuery(
        { vendor_uuid: selectedVendorUuid, id: selectedAttributeSetId! },
        { skip: !selectedAttributeSetId || !selectedVendorUuid }
    );

    const [deleteAttributeSet, { isLoading: deleting }] = useDeleteAttributeSetMutation();
    const [syncAttributeSets, { isLoading: syncing }] = useSyncAttributeSetsMutation();
    const [syncSingleAttributeSet, { isLoading: syncingSingle }] = useSyncSingleAttributeSetMutation();
    const [updateAttributeSet] = useUpdateAttributeSetMutation();

    useEffect(() => {
        const vendorFromUrl = searchParams.get('vendor');
        if (vendorFromUrl) {
            setSelectedVendorUuid(vendorFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedVendorUuid, filterStatus, filterSyncStatus]);

    const handleDelete = async (id: string) => {
        if (!selectedVendorUuid) return;
        try {
            await deleteAttributeSet({ vendor_uuid: selectedVendorUuid, id }).unwrap();
            toast.success('Attribute set deleted successfully');
            setDeleteConfirm(null);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to delete attribute set');
        }
    };

    const handleSync = async () => {
        if (!selectedVendorUuid) {
            toast.error('Please select a vendor first');
            return;
        }
        try {
            const result = await syncAttributeSets({ vendor_uuid: selectedVendorUuid }).unwrap();
            toast.success(result.message || 'Attribute sets synced successfully');
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to sync attribute sets');
        }
    };

    const handleSyncSingle = async () => {
        if (!selectedVendorUuid || !syncMagentoId) {
            toast.error('Please enter a Magento Attribute Set ID');
            return;
        }
        try {
            const result = await syncSingleAttributeSet({
                vendor_uuid: selectedVendorUuid,
                magentoAttrSetId: parseInt(syncMagentoId),
            }).unwrap();
            toast.success('Attribute set synced from Magento successfully');
            setIsSyncModalOpen(false);
            setSyncMagentoId('');
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.error || 'Failed to sync attribute set');
        }
    };

    const handleViewAttributeSet = (id: string) => {
        setSelectedAttributeSetId(id);
        setIsViewDrawerOpen(true);
        refetchAttributeSet();
    };

    const handleEditAttributeSet = (id: string) => {
        setSelectedAttributeSetId(id);
        setIsEditDrawerOpen(true);
        refetchAttributeSet();
    };

    const getSyncStatusBadge = (status: string) => {
        switch (status) {
            case 'synced':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        Synced
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3" />
                        Pending
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3" />
                        Failed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {status}
                    </span>
                );
        }
    };

    const getStatusBadge = (isActive: boolean) => {
        if (isActive) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3" />
                    Active
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <XCircle className="w-3 h-3" />
                Inactive
            </span>
        );
    };

    const isLoading = attributeSetsLoading || isFetching;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Layers className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Attribute Sets</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Manage Magento product attribute sets and their attributes
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsSyncModalOpen(true)}
                                disabled={!selectedVendorUuid}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download className="w-4 h-4" />
                                Import from Magento
                            </button>
                            <button
                                onClick={handleSync}
                                disabled={syncing || !selectedVendorUuid}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {syncing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-4 h-4" />
                                )}
                                Bulk Sync
                            </button>
                            <button
                                onClick={() => {
                                    if (selectedVendorUuid) {
                                        window.location.href = `/admin/attribute-sets/add?vendor=${selectedVendorUuid}`;
                                    } else {
                                        toast.error('Please select a vendor first');
                                    }
                                }}
                                disabled={!selectedVendorUuid}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4" />
                                Create Attribute Set
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vendor Selection */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 gap-6">
                        <SearchableSelect
                            options={vendors?.data?.map(v => ({ value: v.uuid, label: v.company_name })) || []}
                            value={selectedVendorUuid}
                            onChange={(value) => setSelectedVendorUuid(value)}
                            placeholder="Select Vendor..."
                        />
                        {vendorsError && (
                            <p className="text-sm text-red-500">Failed to load vendors. Please check your API.</p>
                        )}
                    </div>
                </div>

                {selectedVendorUuid && (
                    <>
                        {/* Filters */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-gray-500" />
                                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        <Grid className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Attribute set name..."
                                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="all">All</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sync Status
                                    </label>
                                    <select
                                        value={filterSyncStatus}
                                        onChange={(e) => setFilterSyncStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="all">All</option>
                                        <option value="synced">Synced</option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sort By
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="created_at">Created Date</option>
                                            <option value="attribute_set_name">Name</option>
                                            <option value="sort_order">Sort Order</option>
                                            <option value="last_synced_at">Last Synced</option>
                                        </select>
                                        <button
                                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <ArrowUpDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content - Table View */}
                        {viewMode === 'table' && (
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Attribute Set
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Magento ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Attributes
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Sync Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Last Synced
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {isLoading ? (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                                                            <p className="text-sm text-gray-500">Loading attribute sets...</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : attributeSetsData?.data?.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <Layers className="w-12 h-12 text-gray-300" />
                                                            <p className="text-gray-500">No attribute sets found</p>
                                                            <div className="flex gap-2 mt-2">
                                                                <button
                                                                    onClick={handleSync}
                                                                    className="text-sm text-purple-600 hover:text-purple-700"
                                                                >
                                                                    Bulk Sync from Magento
                                                                </button>
                                                                <span className="text-gray-300">|</span>
                                                                <button
                                                                    onClick={() => setIsSyncModalOpen(true)}
                                                                    className="text-sm text-purple-600 hover:text-purple-700"
                                                                >
                                                                    Import Specific ID
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                attributeSetsData?.data.map((attributeSet: AttributeSet) => (
                                                    <tr key={attributeSet.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <div className="font-medium text-gray-900">
                                                                    {attributeSet.local_display_name || attributeSet.attribute_set_name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {attributeSet.attribute_set_name}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1 text-sm text-gray-900">
                                                                <Hash className="w-3 h-3 text-gray-400" />
                                                                {attributeSet.magento_attr_set_id || 'Not synced'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1 text-sm text-gray-900">
                                                                <Tag className="w-3 h-3 text-gray-400" />
                                                                {attributeSet.attribute_count || attributeSet.assigned_attribute_ids?.length || 0} attributes
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {getStatusBadge(attributeSet.is_active)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {getSyncStatusBadge(attributeSet.sync_status)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                                <Calendar className="w-3 h-3" />
                                                                {attributeSet.last_synced_at
                                                                    ? new Date(attributeSet.last_synced_at).toLocaleDateString()
                                                                    : 'Never'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleViewAttributeSet(attributeSet.id)}
                                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="View Details"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEditAttributeSet(attributeSet.id)}
                                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteConfirm(attributeSet.id)}
                                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {attributeSetsData?.meta && attributeSetsData.meta.total > 0 && (
                                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            Showing {((currentPage - 1) * perPage) + 1} to{' '}
                                            {Math.min(currentPage * perPage, attributeSetsData.meta.total)} of{' '}
                                            {attributeSetsData.meta.total} results
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <span className="px-4 py-2 text-sm text-gray-700">
                                                Page {currentPage} of {attributeSetsData.meta.last_page}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(attributeSetsData.meta.last_page, p + 1))}
                                                disabled={currentPage === attributeSetsData.meta.last_page}
                                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Content - Grid View */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isLoading ? (
                                    <div className="col-span-3 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-2">Loading attribute sets...</p>
                                    </div>
                                ) : attributeSetsData?.data?.length === 0 ? (
                                    <div className="col-span-3 py-12 text-center">
                                        <Layers className="w-12 h-12 text-gray-300 mx-auto" />
                                        <p className="text-gray-500 mt-2">No attribute sets found</p>
                                    </div>
                                ) : (
                                    attributeSetsData?.data.map((attributeSet: AttributeSet) => (
                                        <div key={attributeSet.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 bg-purple-100 rounded-lg">
                                                            <Layers className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">
                                                                {attributeSet.local_display_name || attributeSet.attribute_set_name}
                                                            </h3>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {attributeSet.attribute_set_name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {getSyncStatusBadge(attributeSet.sync_status)}
                                                </div>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500">Magento ID:</span>
                                                        <span className="font-medium text-gray-900">
                                                            {attributeSet.magento_attr_set_id || '—'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500">Attributes:</span>
                                                        <span className="font-medium text-gray-900">
                                                            {attributeSet.attribute_count || attributeSet.assigned_attribute_ids?.length || 0}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500">Sort Order:</span>
                                                        <span className="font-medium text-gray-900">
                                                            {attributeSet.sort_order}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500">Status:</span>
                                                        {getStatusBadge(attributeSet.is_active)}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                                    <div className="text-xs text-gray-500">
                                                        Last synced: {attributeSet.last_synced_at
                                                            ? new Date(attributeSet.last_synced_at).toLocaleDateString()
                                                            : 'Never'}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleViewAttributeSet(attributeSet.id)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="View"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditAttributeSet(attributeSet.id)}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(attributeSet.id)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* View Attribute Set Drawer */}
            {isViewDrawerOpen && attributeSetDetail?.data && (
                <AttributeSetViewDrawer
                    attributeSet={attributeSetDetail.data}
                    vendorUuid={selectedVendorUuid}
                    onClose={() => setIsViewDrawerOpen(false)}
                />
            )}

            {/* Edit Attribute Set Drawer */}
            {isEditDrawerOpen && attributeSetDetail?.data && (
                <AttributeSetEditDrawer
                    attributeSet={attributeSetDetail.data}
                    vendorUuid={selectedVendorUuid}
                    onClose={() => setIsEditDrawerOpen(false)}
                    onSuccess={() => {
                        setIsEditDrawerOpen(false);
                        refetch();
                    }}
                />
            )}

            {/* Sync Single Modal */}
            {isSyncModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Import from Magento</h3>
                            <button
                                onClick={() => setIsSyncModalOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <p className="text-gray-500 mb-4">
                            Enter the Magento Attribute Set ID to import a specific attribute set.
                        </p>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Magento Attribute Set ID
                            </label>
                            <input
                                type="number"
                                value={syncMagentoId}
                                onChange={(e) => setSyncMagentoId(e.target.value)}
                                placeholder="e.g., 10"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsSyncModalOpen(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSyncSingle}
                                disabled={syncingSingle || !syncMagentoId}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                            >
                                {syncingSingle && <Loader2 className="w-4 h-4 animate-spin" />}
                                Import
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete this attribute set? This action cannot be undone.
                            {attributeSetDetail?.data?.magento_attr_set_id && (
                                <span className="block mt-2 text-sm text-yellow-600">
                                    Note: This will only delete the local record. The Magento attribute set will remain unchanged.
                                </span>
                            )}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// View Drawer Component
interface AttributeSetViewDrawerProps {
    attributeSet: AttributeSet;
    vendorUuid: string;
    onClose: () => void;
}

const AttributeSetViewDrawer: React.FC<AttributeSetViewDrawerProps> = ({ attributeSet, vendorUuid, onClose }) => {
    const [showAttributes, setShowAttributes] = useState(false);
    const [attributes, setAttributes] = useState<any[]>([]);
    const [loadingAttributes, setLoadingAttributes] = useState(false);

    // In the AttributeSetViewDrawer component, uncomment and implement:
    const fetchAttributes = async () => {
        if (!attributeSet.magento_attr_set_id) return;
        setLoadingAttributes(true);
        try {
            // Use the API hook or direct API call
            const response = await fetch(`/api/v1/admin/attribute-sets/${vendorUuid}/${attributeSet.id}/attributes`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setAttributes(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch attributes:', error);
        } finally {
            setLoadingAttributes(false);
        }
    };

    useEffect(() => {
        if (showAttributes && attributeSet.magento_attr_set_id) {
            fetchAttributes();
        }
    }, [showAttributes]);

    return (
        <div className="fixed inset-0 overflow-hidden z-50">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
                <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                    <div className="relative w-screen max-w-2xl">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                            {/* Header */}
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between sticky top-0">
                                <h2 className="text-xl font-semibold text-gray-900">Attribute Set Details</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 px-6 py-6 space-y-6">
                                {/* Basic Info */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-500">Display Name</label>
                                                <p className="font-medium text-gray-900">
                                                    {attributeSet.local_display_name || attributeSet.attribute_set_name}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Magento Name</label>
                                                <p className="font-medium text-gray-900">{attributeSet.attribute_set_name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Magento ID</label>
                                                <p className="font-medium text-gray-900">
                                                    {attributeSet.magento_attr_set_id || 'Not synced'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Sort Order</label>
                                                <p className="font-medium text-gray-900">{attributeSet.sort_order}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Entity Type</label>
                                                <p className="font-medium text-gray-900">{attributeSet.magento_entity_type_code}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Entity Type ID</label>
                                                <p className="font-medium text-gray-900">{attributeSet.entity_type_id}</p>
                                            </div>
                                        </div>
                                        {attributeSet.description && (
                                            <div>
                                                <label className="text-sm text-gray-500">Description</label>
                                                <p className="font-medium text-gray-900">{attributeSet.description}</p>
                                            </div>
                                        )}
                                        {attributeSet.local_notes && (
                                            <div>
                                                <label className="text-sm text-gray-500">Notes</label>
                                                <p className="font-medium text-gray-900">{attributeSet.local_notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Status Info */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Status Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Status</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${attributeSet.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {attributeSet.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Sync Status</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${attributeSet.sync_status === 'synced' ? 'bg-green-100 text-green-800' :
                                                    attributeSet.sync_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {attributeSet.sync_status}
                                            </span>
                                        </div>
                                        {attributeSet.last_synced_at && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Last Synced</span>
                                                <span className="font-medium text-gray-900">
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

                                {/* Attributes Section */}
                                {attributeSet.magento_attr_set_id && (
                                    <div>
                                        <button
                                            onClick={() => setShowAttributes(!showAttributes)}
                                            className="w-full flex items-center justify-between text-lg font-medium text-gray-900 mb-4 hover:text-purple-600 transition-colors"
                                        >
                                            <span>Assigned Attributes</span>
                                            <span className="text-sm">{showAttributes ? '▼' : '▶'}</span>
                                        </button>

                                        {showAttributes && (
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                {loadingAttributes ? (
                                                    <div className="flex justify-center py-4">
                                                        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                                                    </div>
                                                ) : attributes.length > 0 ? (
                                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                                        {attributes.map((attr, idx) => (
                                                            <div key={idx} className="p-2 bg-white rounded border border-gray-200">
                                                                <p className="font-medium text-gray-900">{attr.attribute_code || attr.code}</p>
                                                                <p className="text-sm text-gray-500">ID: {attr.attribute_id}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-center py-4">No attributes assigned</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Metadata */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Local UUID</span>
                                            <span className="font-mono text-sm text-gray-900">{attributeSet.uuid || attributeSet.id}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Created At</span>
                                            <span className="font-medium text-gray-900">
                                                {new Date(attributeSet.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Updated At</span>
                                            <span className="font-medium text-gray-900">
                                                {new Date(attributeSet.updated_at).toLocaleString()}
                                            </span>
                                        </div>
                                        {attributeSet.deleted_at && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Deleted At</span>
                                                <span className="font-medium text-gray-900">
                                                    {new Date(attributeSet.deleted_at).toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Edit Drawer Component
interface AttributeSetEditDrawerProps {
    attributeSet: AttributeSet;
    vendorUuid: string;
    onClose: () => void;
    onSuccess: () => void;
}

const AttributeSetEditDrawer: React.FC<AttributeSetEditDrawerProps> = ({
    attributeSet,
    vendorUuid,
    onClose,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        local_display_name: attributeSet.local_display_name || '',
        attribute_set_name: attributeSet.attribute_set_name,
        sort_order: attributeSet.sort_order,
        description: attributeSet.description || '',
        local_notes: attributeSet.local_notes || '',
        is_active: attributeSet.is_active,
        sync_to_magento: false,
    });
    const [loading, setLoading] = useState(false);
    const [updateAttributeSet] = useUpdateAttributeSetMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updateData: any = {};
            if (formData.local_display_name !== attributeSet.local_display_name)
                updateData.local_display_name = formData.local_display_name;
            if (formData.attribute_set_name !== attributeSet.attribute_set_name)
                updateData.attribute_set_name = formData.attribute_set_name;
            if (formData.sort_order !== attributeSet.sort_order)
                updateData.sort_order = formData.sort_order;
            if (formData.description !== attributeSet.description)
                updateData.description = formData.description;
            if (formData.local_notes !== attributeSet.local_notes)
                updateData.local_notes = formData.local_notes;
            updateData.is_active = formData.is_active;
            updateData.sync_to_magento = formData.sync_to_magento;

            await updateAttributeSet({
                vendor_uuid: vendorUuid,
                id: attributeSet.id,
                data: updateData,
            }).unwrap();
            toast.success('Attribute set updated successfully');
            onSuccess();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update attribute set');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 overflow-hidden z-50">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
                <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                    <div className="relative w-screen max-w-2xl">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                            {/* Header */}
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between sticky top-0">
                                <h2 className="text-xl font-semibold text-gray-900">Edit Attribute Set</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Display Name (Local)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.local_display_name}
                                            onChange={(e) => setFormData({ ...formData, local_display_name: e.target.value })}
                                            placeholder="Optional display name for local reference"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            A friendly name for internal use only (does not sync to Magento)
                                        </p>
                                    </div>

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
                                        <p className="text-xs text-gray-500 mt-1">
                                            {attributeSet.magento_attr_set_id
                                                ? 'Changing this will require syncing to Magento'
                                                : 'This name will be used when creating in Magento'}
                                        </p>
                                    </div>

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
                                    </div>

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
                                </div>

                                {/* Toggle Options */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                        />
                                        <span className="text-sm text-gray-700">Active (visible in system)</span>
                                    </label>

                                    {attributeSet.magento_attr_set_id && (
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

                                {/* Info Box for Synced Sets */}
                                {attributeSet.magento_attr_set_id && (
                                    <div className="bg-blue-50 rounded-lg p-3">
                                        <p className="text-sm text-blue-800">
                                            <strong>Info:</strong> This attribute set is linked to Magento ID {attributeSet.magento_attr_set_id}.
                                            {formData.sync_to_magento
                                                ? ' Changes will be pushed to Magento.'
                                                : ' Enable "Sync to Magento" to push changes.'}
                                        </p>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                    >
                                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};