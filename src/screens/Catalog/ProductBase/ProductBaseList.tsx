// src/pages/Product/ProductList.tsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
    DollarSign,
    Calendar,
    X,
    TrendingUp,
    TrendingDown,
    Tag,
    Layers,
    AlertCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
    useGetVendorsQuery,
} from '../../../app/api/CustomerSlices/CustomerApi';
import {
    useGetVendorProductsQuery,
    useDeleteVendorProductMutation,
    useSyncAllVendorProductsMutation,
    useGetVendorProductQuery,
    type VendorProduct,
} from '../../../app/api/ProductSlices/ProductApi';
import SearchableSelect from '../../../component/SearchableSelect';

export const ProductList: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [selectedVendorUuid, setSelectedVendorUuid] = useState<string>('');
    const [selectedStoreUuid, setSelectedStoreUuid] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterSyncStatus, setFilterSyncStatus] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [priceMin, setPriceMin] = useState<string>('');
    const [priceMax, setPriceMax] = useState<string>('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [selectedProductUuid, setSelectedProductUuid] = useState<string | null>(null);
    const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);
    const [showSyncErrorsModal, setShowSyncErrorsModal] = useState(false);
    const [syncErrors, setSyncErrors] = useState<any[]>([]);

    const perPage = 10;

    const { data: vendors, isLoading: vendorsLoading, error: vendorsError } = useGetVendorsQuery();

    // Manually trigger fetch when vendor is selected
    useEffect(() => {
        if (selectedVendorUuid) {
            // console.log('Vendor selected, setting shouldFetch to true');
            setShouldFetch(true);
            setCurrentPage(1);
        } else {
            setShouldFetch(false);
        }
    }, [selectedVendorUuid]);

    // Build query parameters
    const queryParams = {
        vendor_uuid: selectedVendorUuid,
        store_uuid: selectedStoreUuid || undefined,
        page: currentPage,
        per_page: perPage,
        search: debouncedSearch || undefined,
        status: filterStatus !== 'all' ? filterStatus === 'active' : undefined,
        sync_status: filterSyncStatus !== 'all' ? filterSyncStatus : undefined,
        type_id: filterType !== 'all' ? filterType : undefined,
        min_price: priceMin ? parseFloat(priceMin) : undefined,
        max_price: priceMax ? parseFloat(priceMax) : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
    };

    // console.log('Query params before API call:', queryParams);
    // console.log('shouldFetch:', shouldFetch);

    // Only call the API when shouldFetch is true AND vendor_uuid is not empty
    const {
        data: productsData,
        isLoading: productsLoading,
        isFetching,
        error: productsError,
        refetch,
    } = useGetVendorProductsQuery(queryParams, {
        skip: !shouldFetch || !selectedVendorUuid,
        refetchOnMountOrArgChange: true,
    });

    // Debug API response
    useEffect(() => {
        if (productsData) {
            // console.log('Products API Response - Full:', productsData);
            // console.log('Products API Response - Data structure:', productsData.data);
        }
        if (productsError) {
            // console.error('Products API Error:', productsError);
        }
    }, [productsData, productsError]);

    // Refetch when filters change
    useEffect(() => {
        if (shouldFetch && selectedVendorUuid) {
            // console.log('Filters changed, refetching products');
            refetch();
        }
    }, [currentPage, debouncedSearch, filterStatus, filterSyncStatus, filterType, sortBy, sortOrder, priceMin, priceMax, selectedStoreUuid]);

    const { data: productDetail, refetch: refetchProduct } = useGetVendorProductQuery(
        { vendor_uuid: selectedVendorUuid, product_uuid: selectedProductUuid! },
        { skip: !selectedProductUuid || !selectedVendorUuid }
    );

    const [deleteProduct, { isLoading: deleting }] = useDeleteVendorProductMutation();
    const [syncAllProducts, { isLoading: syncing }] = useSyncAllVendorProductsMutation();

    useEffect(() => {
        const vendorFromUrl = searchParams.get('vendor');
        const storeFromUrl = searchParams.get('store');

        if (vendorFromUrl) {
            setSelectedVendorUuid(vendorFromUrl);
        }
        if (storeFromUrl) {
            setSelectedStoreUuid(storeFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleDelete = async (productUuid: string) => {
        if (!selectedVendorUuid) return;
        try {
            await deleteProduct({ vendor_uuid: selectedVendorUuid, product_uuid: productUuid }).unwrap();
            toast.success('Product deleted successfully');
            setDeleteConfirm(null);
            refetch();
        } catch (error: any) {
            // console.error('Delete error:', error);
            toast.error(error?.data?.message || 'Failed to delete product');
        }
    };

    const handleSync = async () => {
        console.log('🔄 handleSync called with vendor:', selectedVendorUuid);
        alert('Sync started - check console for details'); // Debug alert

        if (!selectedVendorUuid) {
            toast.error('Please select a vendor first');
            return;
        }

        const syncToastId = toast.loading('Syncing products from Magento...');

        try {
            const result = await syncAllProducts({
                vendor_uuid: selectedVendorUuid,
                store_uuid: selectedStoreUuid || undefined,
            }).unwrap();


            // Dismiss loading toast
            toast.dismiss(syncToastId);

            // Show success message with details
            if (result.data) {
                const { synced, failed, skipped, total_in_magento } = result.data;

                if (failed > 0) {
                    // Show warning toast with summary
                    toast.custom((t) => (
                        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col`}>
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">
                                            Sync Completed with Issues
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {result.message}
                                        </p>
                                    </div>
                                    <div className="ml-auto pl-3">
                                        <button
                                            onClick={() => toast.dismiss(t.id)}
                                            className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-b-lg">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-green-600">{synced}</p>
                                        <p className="text-xs text-gray-500">Synced</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-red-600">{failed}</p>
                                        <p className="text-xs text-gray-500">Failed</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-600">{skipped || 0}</p>
                                        <p className="text-xs text-gray-500">Skipped</p>
                                    </div>
                                </div>
                                <div className="mt-3 text-center">
                                    <p className="text-xs text-gray-500">Total in Magento: {total_in_magento}</p>
                                </div>
                                {failed > 0 && result.data.errors && result.data.errors.length > 0 && (
                                    <button
                                        onClick={() => {
                                            setSyncErrors(result.data.errors);
                                            setShowSyncErrorsModal(true);
                                            toast.dismiss(t.id);
                                        }}
                                        className="mt-3 w-full text-sm text-red-600 hover:text-red-700 font-medium"
                                    >
                                        View {failed} Error{failed !== 1 ? 's' : ''}
                                    </button>
                                )}
                            </div>
                        </div>
                    ), { duration: 8000 });
                } else {
                    toast.success(
                        `✅ Sync completed: ${synced} products synced successfully${skipped ? `, ${skipped} skipped` : ''}`,
                        { duration: 5000 }
                    );
                }
            } else {
                toast.success(result.message || 'Products synced successfully');
            }

            // Refresh the product list
            setTimeout(() => {
                refetch();
            }, 2000);

        } catch (error: any) {
            console.error('Sync error:', error);
            toast.dismiss(syncToastId);
            toast.error(error?.data?.message || 'Failed to sync products');
        }
    };

    const handleViewProduct = (productUuid: string) => {
        setSelectedProductUuid(productUuid);
        setIsViewDrawerOpen(true);
        refetchProduct();
    };

    const handleEditProduct = (productUuid: string) => {
        navigate(`/admin/products/edit/${productUuid}?vendor=${selectedVendorUuid}`);
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

    const getSyncStatusBadge = (syncStatus: string) => {
        const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
            synced: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Synced' },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Pending' },
            failed: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Failed' },
            updating: { color: 'bg-blue-100 text-blue-800', icon: RefreshCw, label: 'Updating' },
        };
        const config = statusConfig[syncStatus] || statusConfig.pending;
        const Icon = config.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </span>
        );
    };

    const getProductTypeBadge = (typeId: string) => {
        const types: Record<string, { color: string; label: string }> = {
            simple: { color: 'bg-blue-100 text-blue-800', label: 'Simple' },
            configurable: { color: 'bg-purple-100 text-purple-800', label: 'Configurable' },
            bundle: { color: 'bg-orange-100 text-orange-800', label: 'Bundle' },
            grouped: { color: 'bg-indigo-100 text-indigo-800', label: 'Grouped' },
            virtual: { color: 'bg-teal-100 text-teal-800', label: 'Virtual' },
            downloadable: { color: 'bg-pink-100 text-pink-800', label: 'Downloadable' },
        };
        const config = types[typeId] || { color: 'bg-gray-100 text-gray-600', label: typeId };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                <Tag className="w-3 h-3" />
                {config.label}
            </span>
        );
    };

    const isLoading = productsLoading || isFetching;

    // Helper function to get products array from response
    const getProductsArray = (data: any): VendorProduct[] => {
        if (!data) return [];
        if (data.data?.data) return data.data.data;
        if (data.data && Array.isArray(data.data)) return data.data;
        if (data.data && data.data.data && Array.isArray(data.data.data)) return data.data.data;
        if (Array.isArray(data)) return data;
        return [];
    };

    const products = getProductsArray(productsData);
    const total = productsData?.data?.total || productsData?.total || 0;
    const lastPage = productsData?.data?.last_page || productsData?.last_page || 1;

    // Get unique product types from data for filter
    const productTypes = products.length > 0
        ? [...new Set(products.map(p => p.type_id))]
        : [];

    // console.log('Final render state:', {
    //     selectedVendorUuid,
    //     shouldFetch,
    //     hasProductsData: !!productsData,
    //     productsCount: products.length,
    //     isLoading,
    //     productsError: !!productsError,
    //     total,
    //     apiCallMade: productsData !== undefined || productsError !== undefined
    // });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Manage your product catalog from Magento
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
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
                                Sync Products
                            </button>
                            <button
                                onClick={() => {
                                    if (selectedVendorUuid) {
                                        navigate(`/CreateProductBase`);
                                    } else {
                                        toast.error("Please select a vendor first");
                                    }
                                }}
                                disabled={!selectedVendorUuid}
                                className="
                                  flex items-center
                                  rounded-full
                                    bg-[linear-gradient(90deg,#12B5E5_0%,#1D8FEF_50%,#2563EB_100%)]
                                   text-white text-sm font-medium
                                   shadow-md
                                 hover:opacity-90
                               transition-all
                                  disabled:opacity-50
                            disabled:cursor-not-allowed
                                cursor-pointer
                             pr-6"
                            >
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white m-1">
                                    <Plus className="text-blue-500 w-4 h-4" />
                                </span>

                                <span className="px-2">Add Product</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vendor Selection */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SearchableSelect
                            options={vendors?.map(v => ({ value: v.uuid, label: v.company_name })) || []}
                            value={selectedVendorUuid}
                            onChange={(value) => {
                                // console.log('Vendor selected:', value);
                                setSelectedVendorUuid(value);
                                setSelectedStoreUuid('');
                                setCurrentPage(1);
                            }}
                            placeholder="Select Vendor..."
                        />
                        {selectedVendorUuid && vendors && (
                            <SearchableSelect
                                options={
                                    vendors
                                        .find(v => v.uuid === selectedVendorUuid)
                                        ?.stores?.map(s => ({ value: s.uuid, label: s.store_name })) || []
                                }
                                value={selectedStoreUuid}
                                onChange={(value) => setSelectedStoreUuid(value)}
                                placeholder="Filter by Store (Optional)"
                                clearable
                            />
                        )}
                        {vendorsError && (
                            <p className="text-sm text-red-500 col-span-2">Failed to load vendors. Please check your API.</p>
                        )}
                    </div>
                </div>

                {selectedVendorUuid && (
                    <>
                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-5 h-5 text-gray-500" />
                                        <h2 className="text-lg font-semibold text-gray-900">Advanced Filters</h2>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setFilterStatus('all');
                                            setFilterSyncStatus('all');
                                            setFilterType('all');
                                            setPriceMin('');
                                            setPriceMax('');
                                            setSortBy('created_at');
                                            setSortOrder('desc');
                                            setSearchTerm('');
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        Reset All
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="all">All</option>
                                            <option value="synced">Synced</option>
                                            <option value="pending">Pending</option>
                                            <option value="failed">Failed</option>
                                            <option value="updating">Updating</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Type
                                        </label>
                                        <select
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="all">All</option>
                                            {productTypes.map(type => (
                                                <option key={type} value={type}>
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Price
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="number"
                                                value={priceMin}
                                                onChange={(e) => setPriceMin(e.target.value)}
                                                placeholder="0"
                                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Price
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="number"
                                                value={priceMax}
                                                onChange={(e) => setPriceMax(e.target.value)}
                                                placeholder="No max"
                                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sort By
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="created_at">Created Date</option>
                                                <option value="name">Name</option>
                                                <option value="price">Price</option>
                                                <option value="quantity">Quantity</option>
                                                <option value="updated_at">Updated Date</option>
                                            </select>
                                            <button
                                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                {sortOrder === 'asc' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Products Table */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price & Stock
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Sync
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
                                                <td colSpan={7} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                                        <p className="text-sm text-gray-500">Loading products...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : productsError ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <AlertCircle className="w-12 h-12 text-red-300" />
                                                        <p className="text-red-500 font-medium">Error loading products</p>
                                                        <p className="text-sm text-gray-500">{(productsError as any)?.data?.message || (productsError as any)?.message || 'Please check the console for details'}</p>
                                                        <button
                                                            onClick={() => refetch()}
                                                            className="mt-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                                        >
                                                            Try Again
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : products.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <Package className="w-12 h-12 text-gray-300" />
                                                        <p className="text-gray-500">No products found</p>
                                                        <button
                                                            onClick={handleSync}
                                                            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
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
                                                                SKU: {product.sku}
                                                            </div>
                                                            {product.magento_sku && (
                                                                <div className="text-xs text-gray-400">
                                                                    Magento SKU: {product.magento_sku}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1 font-semibold text-gray-900">
                                                            <DollarSign className="w-4 h-4 text-gray-500" />
                                                            {typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                            <Layers className="w-3 h-3" />
                                                            Stock: {product.quantity}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getProductTypeBadge(product.type_id)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(product.status)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getSyncStatusBadge(product.sync_status)}
                                                        {product.last_synced_at && (
                                                            <div className="text-xs text-gray-400 mt-1">
                                                                {new Date(product.last_synced_at).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(product.created_at).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleViewProduct(product.uuid)}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="View Details"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditProduct(product.uuid)}
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
                            {total > 0 && (
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        Showing {((currentPage - 1) * perPage) + 1} to{' '}
                                        {Math.min(currentPage * perPage, total)} of {total} results
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
                                            Page {currentPage} of {lastPage}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(lastPage, p + 1))}
                                            disabled={currentPage === lastPage}
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
            {isViewDrawerOpen && productDetail?.data && (
                <div className="fixed inset-0 overflow-hidden z-50">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsViewDrawerOpen(false)} />
                        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                            <div className="relative w-screen max-w-2xl">
                                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
                                        <button onClick={() => setIsViewDrawerOpen(false)} className="p-2 hover:bg-gray-200 rounded-lg">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        <pre className="text-sm overflow-auto">{JSON.stringify(productDetail.data, null, 2)}</pre>
                                    </div>
                                </div>
                            </div>
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
                            Are you sure you want to delete this product? This action cannot be undone.
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

            {/* Sync Errors Modal */}
            {showSyncErrorsModal && syncErrors.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white rounded-t-lg">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Sync Errors ({syncErrors.length})
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowSyncErrorsModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {syncErrors.map((error, index) => (
                                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-red-800">
                                                SKU: <span className="font-mono">{error.sku}</span>
                                            </p>
                                            <p className="text-sm text-red-700 mt-1 break-words">{error.error}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            <button
                                onClick={() => setShowSyncErrorsModal(false)}
                                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;