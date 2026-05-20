// src/pages/Product/ProductList.tsx

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
    Package,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    DollarSign,
    Layers,
    X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
    useGetVendorProductsQuery,
    useDeleteVendorProductMutation,
    useForceSyncProductMutation,
    useSyncAllVendorProductsMutation,
    type VendorProduct,
} from '../../../app/api/ProductSlices/ProductApi';
import { useGetVendorsQuery } from '../../../app/api/VendorSlices/VendorApi';
import { useGetStoresByVendorQuery } from '../../../app/api/MagentoSlices/StoreSlice';
import SearchableSelect from '../../../component/SearchableSelect';

export const ProductList: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [selectedVendorUuid, setSelectedVendorUuid] = useState<string>('');
    const [selectedStoreUuid, setSelectedStoreUuid] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterSyncStatus, setFilterSyncStatus] = useState<string>('all');
    const [filterTypeId, setFilterTypeId] = useState<string>('all');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [selectedProductUuid, setSelectedProductUuid] = useState<string | null>(null);
    const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
    const [syncingProductId, setSyncingProductId] = useState<string | null>(null);

    const perPage = 10;

    const { data: vendors, isLoading: vendorsLoading, error: vendorsError } = useGetVendorsQuery();

    const { data: storesData } = useGetStoresByVendorQuery(selectedVendorUuid, {
        skip: !selectedVendorUuid,
    });
    const availableStores = storesData?.data?.stores || [];

    const {
        data: productsData,
        isLoading: productsLoading,
        isFetching,
        refetch,
    } = useGetVendorProductsQuery(
        {
            vendor_uuid: selectedVendorUuid,
            store_uuid: selectedStoreUuid || undefined,
            page: currentPage,
            per_page: perPage,
            search: debouncedSearch,
            status: filterStatus !== 'all' ? filterStatus === 'active' : undefined,
            sync_status: filterSyncStatus !== 'all' ? filterSyncStatus : undefined,
            type_id: filterTypeId !== 'all' ? filterTypeId : undefined,
            sort_by: sortBy,
            sort_order: sortOrder,
        },
        { skip: !selectedVendorUuid }
    );

    const [deleteProduct, { isLoading: deleting }] = useDeleteVendorProductMutation();
    const [forceSyncProduct, { isLoading: syncing }] = useForceSyncProductMutation();
    const [syncAllProducts, { isLoading: syncingAll }] = useSyncAllVendorProductsMutation();

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
        setSelectedStoreUuid('');
    }, [selectedVendorUuid]);

    const handleDelete = async (uuid: string) => {
        if (!selectedVendorUuid) return;
        try {
            await deleteProduct({ vendor_uuid: selectedVendorUuid, product_uuid: uuid }).unwrap();
            toast.success('Product deleted successfully');
            setDeleteConfirm(null);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to delete product');
        }
    };

    const handleSyncSingle = async (productUuid: string) => {
        if (!selectedVendorUuid) return;
        setSyncingProductId(productUuid);
        try {
            const result = await forceSyncProduct({
                vendor_uuid: selectedVendorUuid,
                product_uuid: productUuid
            }).unwrap();
            toast.success(result.message || 'Product synced successfully');
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to sync product');
        } finally {
            setSyncingProductId(null);
        }
    };

    const handleSyncAll = async () => {
        if (!selectedVendorUuid) {
            toast.error('Please select a vendor first');
            return;
        }
        try {
            const result = await syncAllProducts({ vendor_uuid: selectedVendorUuid }).unwrap();
            toast.success(result.message || 'Products synced from Magento successfully');
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to sync products');
        }
    };

    const handleViewProduct = (uuid: string) => {
        setSelectedProductUuid(uuid);
        setIsViewDrawerOpen(true);
    };

    const getStatusBadge = (status: boolean) => {
        if (status) {
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

    const getSyncStatusBadge = (status: string) => {
        const config = {
            synced: { icon: CheckCircle, class: 'bg-green-100 text-green-800', label: 'Synced' },
            pending: { icon: Clock, class: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
            failed: { icon: AlertCircle, class: 'bg-red-100 text-red-800', label: 'Failed' },
            updating: { icon: RefreshCw, class: 'bg-blue-100 text-blue-800', label: 'Updating' },
        };
        const { icon: Icon, class: className, label } = config[status as keyof typeof config] || config.pending;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
                <Icon className="w-3 h-3" />
                {label}
            </span>
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const isLoading = productsLoading || isFetching;

    // Get unique values for filters
    const products = productsData?.data?.data || [];
    const uniqueTypeIds = [...new Set(products.map(p => p.type_id).filter(Boolean))];
    const uniqueSyncStatuses = [...new Set(products.map(p => p.sync_status).filter(Boolean))];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Package className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Manage your product catalog
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleSyncAll}
                                disabled={syncingAll || !selectedVendorUuid}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {syncingAll ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-4 h-4" />
                                )}
                                Sync from Magento
                            </button>
                            <button
                                onClick={() => {
                                    if (selectedVendorUuid) {
                                        window.location.href = `/admin/products/add?vendor=${selectedVendorUuid}&store=${selectedStoreUuid}`;
                                    } else {
                                        toast.error('Please select a vendor first');
                                    }
                                }}
                                disabled={!selectedVendorUuid}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4" />
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vendor and Store Selection */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <SearchableSelect
                            options={vendors?.data?.map(v => ({ value: v.uuid, label: v.company_name })) || []}
                            value={selectedVendorUuid}
                            onChange={(value) => setSelectedVendorUuid(value)}
                            placeholder="Select Vendor..."
                            isLoading={vendorsLoading}
                        />
                        <SearchableSelect
                            options={availableStores.map(s => ({ value: s.uuid, label: s.store_name }))}
                            value={selectedStoreUuid}
                            onChange={(value) => setSelectedStoreUuid(value)}
                            placeholder="Filter by Store (Optional)"
                            disabled={!selectedVendorUuid}
                            clearable
                        />
                        {vendorsError && (
                            <p className="text-sm text-red-500 col-span-2">Failed to load vendors. Please check your API.</p>
                        )}
                    </div>
                </div>

                {selectedVendorUuid && (
                    <>
                        {/* Filters */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Filter className="w-5 h-5 text-gray-500" />
                                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
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
                                            placeholder="Name or SKU..."
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
                                        {uniqueSyncStatuses.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Type
                                    </label>
                                    <select
                                        value={filterTypeId}
                                        onChange={(e) => setFilterTypeId(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="all">All</option>
                                        {uniqueTypeIds.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <label className="text-sm font-medium text-gray-700">Sort By:</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="created_at">Created Date</option>
                                            <option value="name">Name</option>
                                            <option value="price">Price</option>
                                            <option value="quantity">Quantity</option>
                                        </select>
                                        <button
                                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            {sortOrder === 'asc' ? '↑' : '↓'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                SKU
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Sync Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={9} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                                                        <p className="text-sm text-gray-500">Loading products...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : products.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <Package className="w-12 h-12 text-gray-300" />
                                                        <p className="text-gray-500">No products found</p>
                                                        <button
                                                            onClick={handleSyncAll}
                                                            className="mt-2 text-sm text-purple-600 hover:text-purple-700"
                                                        >
                                                            Sync from Magento
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            products.map((product: VendorProduct) => (
                                                <tr key={product.uuid} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {product.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                ID: {product.magento_product_id || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">{product.sku}</div>
                                                        {product.magento_sku && product.magento_sku !== product.sku && (
                                                            <div className="text-xs text-gray-400">Magento: {product.magento_sku}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            <Layers className="w-3 h-3" />
                                                            {product.type_id}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1">
                                                            <DollarSign className="w-3 h-3 text-gray-400" />
                                                            <span className="font-medium text-gray-900">{formatPrice(product.price)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-sm ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {product.quantity > 0 ? `${product.quantity} units` : 'Out of Stock'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(product.status)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getSyncStatusBadge(product.sync_status)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-500">
                                                            {formatDate(product.created_at)}
                                                        </div>
                                                        {product.last_synced_at && (
                                                            <div className="text-xs text-gray-400">
                                                                Synced: {formatDate(product.last_synced_at)}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleSyncSingle(product.uuid)}
                                                                disabled={syncingProductId === product.uuid}
                                                                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                                                                title="Sync with Magento"
                                                            >
                                                                {syncingProductId === product.uuid ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <RefreshCw className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => handleViewProduct(product.uuid)}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="View Details"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => window.location.href = `/admin/products/edit/${product.uuid}?vendor=${selectedVendorUuid}&store=${selectedStoreUuid}`}
                                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(product.uuid)}
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
                            {productsData?.data && productsData.data.total > 0 && (
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        Showing {((currentPage - 1) * perPage) + 1} to{' '}
                                        {Math.min(currentPage * perPage, productsData.data.total)} of{' '}
                                        {productsData.data.total} results
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
                                            Page {currentPage} of {productsData.data.last_page}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(productsData.data.last_page, p + 1))}
                                            disabled={currentPage === productsData.data.last_page}
                                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* View Product Drawer */}
            {isViewDrawerOpen && selectedProductUuid && productsData?.data?.data && (
                <ProductViewDrawer
                    product={productsData.data.data.find(p => p.uuid === selectedProductUuid)!}
                    onClose={() => setIsViewDrawerOpen(false)}
                    vendorUuid={selectedVendorUuid}
                    onSync={() => handleSyncSingle(selectedProductUuid)}
                    isSyncing={syncingProductId === selectedProductUuid}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete this product? This will also delete it from Magento. This action cannot be undone.
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

// Product View Drawer Component
interface ProductViewDrawerProps {
    product: VendorProduct;
    onClose: () => void;
    vendorUuid: string;
    onSync: () => void;
    isSyncing: boolean;
}

const ProductViewDrawer: React.FC<ProductViewDrawerProps> = ({ product, onClose, onSync, isSyncing }) => {
    const productData = product.product_data || {};
    const images = productData.media_gallery || [];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getSyncStatusBadge = (status: string) => {
        const config = {
            synced: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
            updating: 'bg-blue-100 text-blue-800',
        };
        return config[status as keyof typeof config] || config.pending;
    };

    return (
        <div className="fixed inset-0 overflow-hidden z-50">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
                <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                    <div className="relative w-screen max-w-2xl">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                            {/* Header */}
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={onSync}
                                        disabled={isSyncing}
                                        className="flex items-center gap-2 px-3 py-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {isSyncing ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <RefreshCw className="w-4 h-4" />
                                        )}
                                        Sync Now
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 px-6 py-6 space-y-6">
                                {/* Product Images */}
                                {images.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
                                        <div className="grid grid-cols-4 gap-3">
                                            {images.slice(0, 4).map((img: any, idx: number) => {
                                                const imgUrl = img.content
                                                    ? `data:${img.content.type};base64,${img.content.base64_encoded_data}`
                                                    : img.file || '';
                                                return (
                                                    <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                        <img src={imgUrl} alt={img.label} className="w-full h-full object-cover" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Basic Info */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-500">Product Name</label>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">SKU</label>
                                                <p className="font-medium text-gray-900">{product.sku}</p>
                                            </div>
                                            {product.magento_sku && (
                                                <div>
                                                    <label className="text-sm text-gray-500">Magento SKU</label>
                                                    <p className="font-medium text-gray-900">{product.magento_sku}</p>
                                                </div>
                                            )}
                                            <div>
                                                <label className="text-sm text-gray-500">Product Type</label>
                                                <p className="font-medium text-gray-900 capitalize">{product.type_id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Stock */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Stock</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-500">Price</label>
                                                <p className="font-medium text-gray-900">{formatPrice(product.price)}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Quantity</label>
                                                <p className={`font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {product.quantity} units
                                                </p>
                                            </div>
                                            {productData.special_price && (
                                                <div>
                                                    <label className="text-sm text-gray-500">Special Price</label>
                                                    <p className="font-medium text-red-600">{formatPrice(productData.special_price)}</p>
                                                </div>
                                            )}
                                            {productData.weight && (
                                                <div>
                                                    <label className="text-sm text-gray-500">Weight</label>
                                                    <p className="font-medium text-gray-900">{productData.weight}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Product Status</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {product.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Sync Status</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSyncStatusBadge(product.sync_status)}`}>
                                                {product.sync_status}
                                            </span>
                                        </div>
                                        {product.last_synced_at && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Last Synced</span>
                                                <span className="text-sm text-gray-900">{formatDate(product.last_synced_at)}</span>
                                            </div>
                                        )}
                                        {product.sync_errors && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Sync Errors</span>
                                                <span className="text-sm text-red-600">{JSON.stringify(product.sync_errors)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                {productData.description && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{productData.description}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Short Description */}
                                {productData.short_description && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Short Description</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-700">{productData.short_description}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Meta Info */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Meta Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Created At</span>
                                            <span className="text-sm text-gray-900">{formatDate(product.created_at)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Updated At</span>
                                            <span className="text-sm text-gray-900">{formatDate(product.updated_at)}</span>
                                        </div>
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

export default ProductList;