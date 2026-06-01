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
    FolderTree,
    CheckCircle,
    XCircle,
    Menu,
    ChevronDown,
    ChevronRight as ChevronRightIcon,
    X,
    Link as LinkIcon,
    Unlink,
    Package,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
    useGetCategoriesQuery,
    useGetCategoryTreeQuery,
    useDeleteCategoryMutation,
    useSyncCategoriesMutation,
    useGetCategoryQuery,
    useUpdateCategoryMutation,
    useCreateCategoryMutation,
    useAssignProductToCategoryMutation,
    useRemoveProductFromCategoryMutation,
    useGetCategoryProductsQuery,
    type Category,
    type CategoryTree,
} from '../../app/api/CategorySlices/CategoryApi';
import { useGetVendorsQuery } from '../../app/api/VendorSlices/VendorApi';
import SearchableSelect from '../../component/SearchableSelect';

export const CategoryList: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [selectedVendorUuid, setSelectedVendorUuid] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterMenu, setFilterMenu] = useState<string>('all');
    const [sortBy, setSortBy] = useState('position');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [selectedCategoryUuid, setSelectedCategoryUuid] = useState<string | null>(null);
    const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
    const [isAssignProductDrawerOpen, setIsAssignProductDrawerOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');
    const [expandedTreeNodes, setExpandedTreeNodes] = useState<Set<string>>(new Set());

    const perPage = 10;

    const { data: vendors, isLoading: vendorsLoading, error: vendorsError } = useGetVendorsQuery();

    const {
        data: categoriesData,
        isLoading: categoriesLoading,
        isFetching,
        refetch,
    } = useGetCategoriesQuery(
        {
            vendor_uuid: selectedVendorUuid,
            page: currentPage,
            per_page: perPage,
            search: debouncedSearch || undefined, // Send undefined instead of empty string
            is_active: filterStatus !== 'all' ? filterStatus === 'active' : undefined,
            include_in_menu: filterMenu !== 'all' ? filterMenu === 'in_menu' : undefined,
            sort_by: sortBy,
            sort_order: sortOrder,
        },
        { skip: !selectedVendorUuid }
    );

    const { data: treeData, refetch: refetchTree } = useGetCategoryTreeQuery(
        { vendor_uuid: selectedVendorUuid, depth: 5 },
        { skip: !selectedVendorUuid || viewMode !== 'tree' }
    );

    const { data: categoryDetail, refetch: refetchCategory } = useGetCategoryQuery(
        { vendor_uuid: selectedVendorUuid, uuid: selectedCategoryUuid! },
        { skip: !selectedCategoryUuid || !selectedVendorUuid }
    );

    const { data: categoryProducts, refetch: refetchProducts } = useGetCategoryProductsQuery(
        { vendor_uuid: selectedVendorUuid, uuid: selectedCategoryUuid! },
        { skip: !selectedCategoryUuid || !selectedVendorUuid }
    );

    const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();
    const [syncCategories, { isLoading: syncing }] = useSyncCategoriesMutation();
    const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
    const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
    const [assignProduct, { isLoading: assigning }] = useAssignProductToCategoryMutation();
    const [removeProduct, { isLoading: removing }] = useRemoveProductFromCategoryMutation();

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
    }, [selectedVendorUuid, viewMode]);

    const handleDelete = async (uuid: string) => {
        if (!selectedVendorUuid) return;
        try {
            await deleteCategory({ vendor_uuid: selectedVendorUuid, uuid }).unwrap();
            toast.success('Category deleted successfully');
            setDeleteConfirm(null);
            refetch();
            if (viewMode === 'tree') refetchTree();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to delete category');
        }
    };

    const handleSync = async () => {
        if (!selectedVendorUuid) {
            toast.error('Please select a vendor first');
            return;
        }
        try {
            const result = await syncCategories({ vendor_uuid: selectedVendorUuid }).unwrap();
            toast.success(result.message || 'Categories synced successfully');
            refetch();
            if (viewMode === 'tree') refetchTree();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to sync categories');
        }
    };

    const handleViewCategory = (uuid: string) => {
        setSelectedCategoryUuid(uuid);
        setIsViewDrawerOpen(true);
        refetchCategory();
        refetchProducts();
    };

    const handleEditCategory = (uuid: string) => {
        setSelectedCategoryUuid(uuid);
        setIsEditDrawerOpen(true);
        refetchCategory();
    };

    const toggleTreeNode = (uuid: string) => {
        const newExpanded = new Set(expandedTreeNodes);
        if (newExpanded.has(uuid)) {
            newExpanded.delete(uuid);
        } else {
            newExpanded.add(uuid);
        }
        setExpandedTreeNodes(newExpanded);
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

    const getMenuBadge = (includeInMenu: boolean) => {
        if (includeInMenu) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <Menu className="w-3 h-3" />
                    In Menu
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                <Menu className="w-3 h-3" />
                Hidden
            </span>
        );
    };

    const renderTree = (nodes: CategoryTree[]) => {
        return nodes.map((node) => (
            <div key={node.uuid} className="ml-4">
                <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg group">
                    <div className="flex items-center gap-2 flex-1">
                        <button
                            onClick={() => toggleTreeNode(node.uuid)}
                            className="p-0.5 hover:bg-gray-200 rounded"
                        >
                            {node.children && node.children.length > 0 ? (
                                expandedTreeNodes.has(node.uuid) ? (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                                )
                            ) : (
                                <div className="w-5" />
                            )}
                        </button>
                        <FolderTree className="w-4 h-4 text-blue-500" />
                        <div>
                            <span className="font-medium text-gray-900">{node.name}</span>
                            <span className="ml-2 text-xs text-gray-500">(ID: {node.magento_id})</span>
                        </div>
                        <div className="flex gap-1 ml-2">
                            {getStatusBadge(node.is_active)}
                            {getMenuBadge(node.include_in_menu)}
                            {node.children_count > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    {node.children_count} children
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => handleViewCategory(node.uuid)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Details"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleEditCategory(node.uuid)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Edit"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setDeleteConfirm(node.uuid)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {expandedTreeNodes.has(node.uuid) && node.children && node.children.length > 0 && (
                    <div className="ml-6 border-l-2 border-gray-200 pl-2">
                        {renderTree(node.children)}
                    </div>
                )}
            </div>
        ));
    };

    const isLoading = categoriesLoading || isFetching;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FolderTree className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Manage your product categories
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'list'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    List View
                                </button>
                                <button
                                    onClick={() => setViewMode('tree')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'tree'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Tree View
                                </button>
                            </div>
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
                                Sync All
                            </button>
                            <button
                                onClick={() => {
                                    if (selectedVendorUuid) {
                                        setIsCreateDrawerOpen(true);
                                    } else {
                                        toast.error('Please select a vendor first');
                                    }
                                }}
                                disabled={!selectedVendorUuid}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4" />
                                Add Category
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
                        {/* Filters - Only show in list view */}
                        {viewMode === 'list' && (
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
                                                placeholder="Name or slug..."
                                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <SearchableSelect
                                            value={filterStatus}
                                            onChange={(value) => setFilterStatus(value)}
                                            placeholder="Select status"
                                            options={[
                                                { value: "all", label: "All" },
                                                { value: "active", label: "Active" },
                                                { value: "inactive", label: "Inactive" },
                                            ]}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Menu Visibility
                                        </label>
                                        <SearchableSelect
                                            value={filterMenu}
                                            onChange={(value) => setFilterMenu(value)}
                                            placeholder="Select menu status"
                                            options={[
                                                { value: "all", label: "All" },
                                                { value: "in_menu", label: "In Menu" },
                                                { value: "hidden", label: "Hidden" },
                                            ]}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sort By
                                        </label>
                                        <div className="flex gap-2">
                                            <SearchableSelect
                                                value={sortBy}
                                                onChange={(value) => setSortBy(value)}
                                                placeholder="Sort by"
                                                options={[
                                                    { value: "position", label: "Position" },
                                                    { value: "name", label: "Name" },
                                                    { value: "level", label: "Level" },
                                                    { value: "created_at", label: "Created Date" },
                                                ]}
                                            />
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
                        )}

                        {/* Tree View */}
                        {viewMode === 'tree' && (
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold text-gray-900">Category Tree</h2>
                                        <button
                                            onClick={() => refetchTree()}
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="border rounded-lg p-4">
                                        {treeData?.data && treeData.data.length > 0 ? (
                                            renderTree(treeData.data)
                                        ) : (
                                            <div className="text-center py-12">
                                                <FolderTree className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500">No categories found</p>
                                                <button
                                                    onClick={handleSync}
                                                    className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                                                >
                                                    Sync from Magento
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* List View Table */}
                        {viewMode === 'list' && (
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Category
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Slug
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Menu
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Position
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Level
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
                                                            <p className="text-sm text-gray-500">Loading categories...</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : categoriesData?.data?.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <FolderTree className="w-12 h-12 text-gray-300" />
                                                            <p className="text-gray-500">No categories found</p>
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
                                                categoriesData?.data.map((category: Category) => (
                                                    <tr key={category.uuid} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <div className="font-medium text-gray-900">
                                                                    {category.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    ID: {category.magento_id || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900">{category.slug}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {getStatusBadge(category.is_active)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {getMenuBadge(category.include_in_menu)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900">{category.position}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900">Level {category.level}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleViewCategory(category.uuid)}
                                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="View Details"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEditCategory(category.uuid)}
                                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteConfirm(category.uuid)}
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
                                {categoriesData?.meta && categoriesData.meta.total > 0 && (
                                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            Showing {((currentPage - 1) * perPage) + 1} to{' '}
                                            {Math.min(currentPage * perPage, categoriesData.meta.total)} of{' '}
                                            {categoriesData.meta.total} results
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
                                                Page {currentPage} of {categoriesData.meta.last_page}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(categoriesData.meta.last_page, p + 1))}
                                                disabled={currentPage === categoriesData.meta.last_page}
                                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Create Category Drawer */}
            {isCreateDrawerOpen && (
                <CategoryCreateDrawer
                    vendorUuid={selectedVendorUuid}
                    onClose={() => setIsCreateDrawerOpen(false)}
                    onSuccess={() => {
                        setIsCreateDrawerOpen(false);
                        refetch();
                        if (viewMode === 'tree') refetchTree();
                    }}
                />
            )}

            {/* View Category Drawer */}
            {isViewDrawerOpen && categoryDetail?.data && (
                <CategoryViewDrawer
                    category={categoryDetail.data}
                    products={categoryProducts?.data || []}
                    vendorUuid={selectedVendorUuid}
                    onClose={() => setIsViewDrawerOpen(false)}
                    onAssignProduct={() => {
                        setIsViewDrawerOpen(false);
                        setIsAssignProductDrawerOpen(true);
                    }}
                    onRemoveProduct={() => {
                        refetchProducts();
                    }}
                />
            )}

            {/* Edit Category Drawer */}
            {isEditDrawerOpen && categoryDetail?.data && (
                <CategoryEditDrawer
                    category={categoryDetail.data}
                    vendorUuid={selectedVendorUuid}
                    onClose={() => setIsEditDrawerOpen(false)}
                    onSuccess={() => {
                        setIsEditDrawerOpen(false);
                        refetch();
                        if (viewMode === 'tree') refetchTree();
                    }}
                />
            )}

            {/* Assign Product Drawer */}
            {isAssignProductDrawerOpen && selectedCategoryUuid && (
                <AssignProductDrawer
                    vendorUuid={selectedVendorUuid}
                    categoryUuid={selectedCategoryUuid}
                    onClose={() => setIsAssignProductDrawerOpen(false)}
                    onSuccess={() => {
                        setIsAssignProductDrawerOpen(false);
                        refetchProducts();
                        toast.success('Product assigned successfully');
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete this category? This action cannot be undone.
                            All associated products will be unassigned.
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

// Category Create Drawer Component
interface CategoryCreateDrawerProps {
    vendorUuid: string;
    onClose: () => void;
    onSuccess: () => void;
}

const CategoryCreateDrawer: React.FC<CategoryCreateDrawerProps> = ({ vendorUuid, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        parent_id: '',
        is_active: true,
        include_in_menu: true,
        description: '',
        meta_title: '',
        meta_description: '',
        position: 0,
    });
    const [loading, setLoading] = useState(false);
    const [createCategory] = useCreateCategoryMutation();
    const { data: categories } = useGetCategoriesQuery(
        { vendor_uuid: vendorUuid, per_page: 100 },
        { skip: !vendorUuid }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createCategory({
                vendor_uuid: vendorUuid,
                data: formData,
            }).unwrap();
            toast.success('Category created successfully');
            onSuccess();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    const parentOptions = [
        { value: '', label: 'None (Root Category)' },
        ...(categories?.data?.map(c => ({ value: c.uuid, label: `${c.name} (Level ${c.level})` })) || [])
    ];

    return (
        <div className="fixed inset-0 overflow-hidden z-50">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
                <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                    <div className="relative w-screen max-w-2xl">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Create Category</h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                                        <SearchableSelect
                                            value={formData.parent_id}
                                            onChange={(value) =>
                                                setFormData({ ...formData, parent_id: value })
                                            }
                                            placeholder="Select Parent"
                                            options={parentOptions}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                            <input
                                                type="number"
                                                value={formData.position}
                                                onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                                            <input
                                                type="text"
                                                value={formData.meta_title}
                                                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                            <input
                                                type="text"
                                                value={formData.meta_description}
                                                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">Active</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.include_in_menu}
                                                onChange={(e) => setFormData({ ...formData, include_in_menu: e.target.checked })}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">Include in Menu</span>
                                        </label>
                                    </div>
                                </div>

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
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Create Category
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

// Category View Drawer Component
interface CategoryViewDrawerProps {
    category: Category;
    products: any[];
    vendorUuid: string;
    onClose: () => void;
    onAssignProduct: () => void;
    onRemoveProduct: () => void;
}

const CategoryViewDrawer: React.FC<CategoryViewDrawerProps> = ({
    category, products, vendorUuid, onClose, onAssignProduct, onRemoveProduct
}) => {
    const [removeProduct] = useRemoveProductFromCategoryMutation();
    const [removingSku, setRemovingSku] = useState<string | null>(null);

    const handleRemoveProduct = async (sku: string) => {
        setRemovingSku(sku);
        try {
            await removeProduct({
                vendor_uuid: vendorUuid,
                category_uuid: category.uuid,
                sku: sku,
            }).unwrap();
            toast.success('Product removed from category');
            onRemoveProduct();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to remove product');
        } finally {
            setRemovingSku(null);
        }
    };

    return (
        <div className="fixed inset-0 overflow-hidden z-50">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
                <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                    <div className="relative w-screen max-w-2xl">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between sticky top-0">
                                <h2 className="text-xl font-semibold text-gray-900">Category Details</h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 px-6 py-6 space-y-6">
                                {/* Basic Info */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-500">Name</label>
                                                <p className="font-medium text-gray-900">{category.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Slug</label>
                                                <p className="font-medium text-gray-900">{category.slug}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Magento ID</label>
                                                <p className="font-medium text-gray-900">{category.magento_id || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Position</label>
                                                <p className="font-medium text-gray-900">{category.position}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Level</label>
                                                <p className="font-medium text-gray-900">{category.level}</p>
                                            </div>
                                        </div>
                                        {category.description && (
                                            <div>
                                                <label className="text-sm text-gray-500">Description</label>
                                                <p className="font-medium text-gray-900 mt-1">{category.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Status</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {category.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Include in Menu</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.include_in_menu ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                                                {category.include_in_menu ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* SEO */}
                                {(category.meta_title || category.meta_description) && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Information</h3>
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            {category.meta_title && (
                                                <div>
                                                    <label className="text-sm text-gray-500">Meta Title</label>
                                                    <p className="font-medium text-gray-900">{category.meta_title}</p>
                                                </div>
                                            )}
                                            {category.meta_description && (
                                                <div>
                                                    <label className="text-sm text-gray-500">Meta Description</label>
                                                    <p className="font-medium text-gray-900">{category.meta_description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Products */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Products</h3>
                                        <button
                                            onClick={onAssignProduct}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <LinkIcon className="w-3 h-3" />
                                            Assign Product
                                        </button>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                                        {products && products.length > 0 ? (
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">SKU</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Position</th>
                                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {products.map((product: any) => (
                                                        <tr key={product.sku}>
                                                            <td className="px-4 py-2 text-sm text-gray-900">{product.sku}</td>
                                                            <td className="px-4 py-2 text-sm text-gray-500">{product.position}</td>
                                                            <td className="px-4 py-2 text-right">
                                                                <button
                                                                    onClick={() => handleRemoveProduct(product.sku)}
                                                                    disabled={removingSku === product.sku}
                                                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                                >
                                                                    {removingSku === product.sku ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <Unlink className="w-4 h-4" />
                                                                    )}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                                <p className="text-sm text-gray-500">No products assigned</p>
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

// Category Edit Drawer Component
interface CategoryEditDrawerProps {
    category: Category;
    vendorUuid: string;
    onClose: () => void;
    onSuccess: () => void;
}

const CategoryEditDrawer: React.FC<CategoryEditDrawerProps> = ({ category, vendorUuid, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: category.name,
        parent_id: category.parent?.uuid || '',
        is_active: category.is_active,
        include_in_menu: category.include_in_menu,
        description: category.description || '',
        meta_title: category.meta_title || '',
        meta_description: category.meta_description || '',
        position: category.position,
    });
    const [loading, setLoading] = useState(false);
    const [updateCategory] = useUpdateCategoryMutation();
    const { data: categories } = useGetCategoriesQuery(
        { vendor_uuid: vendorUuid, per_page: 100 },
        { skip: !vendorUuid }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updateData: any = {};
            if (formData.name !== category.name) updateData.name = formData.name;
            if (formData.parent_id !== (category.parent?.uuid || '')) updateData.parent_id = formData.parent_id || null;
            if (formData.is_active !== category.is_active) updateData.is_active = formData.is_active;
            if (formData.include_in_menu !== category.include_in_menu) updateData.include_in_menu = formData.include_in_menu;
            if (formData.description !== category.description) updateData.description = formData.description;
            if (formData.meta_title !== category.meta_title) updateData.meta_title = formData.meta_title;
            if (formData.meta_description !== category.meta_description) updateData.meta_description = formData.meta_description;
            if (formData.position !== category.position) updateData.position = formData.position;

            await updateCategory({
                vendor_uuid: vendorUuid,
                uuid: category.uuid,
                data: updateData,
            }).unwrap();
            toast.success('Category updated successfully');
            onSuccess();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update category');
        } finally {
            setLoading(false);
        }
    };

    const parentOptions = [
        { value: '', label: 'None (Root Category)' },
        ...(categories?.data?.filter(c => c.uuid !== category.uuid).map(c => ({ value: c.uuid, label: `${c.name} (Level ${c.level})` })) || [])
    ];

    return (
        <div className="fixed inset-0 overflow-hidden z-50">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
                <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                    <div className="relative w-screen max-w-2xl">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Edit Category</h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                                        <SearchableSelect
                                            value={formData.parent_id}
                                            onChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    parent_id: value,
                                                })
                                            }
                                            placeholder="Select Parent"
                                            options={parentOptions}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                            <input
                                                type="number"
                                                value={formData.position}
                                                onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                                            <input
                                                type="text"
                                                value={formData.meta_title}
                                                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                            <input
                                                type="text"
                                                value={formData.meta_description}
                                                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">Active</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.include_in_menu}
                                                onChange={(e) => setFormData({ ...formData, include_in_menu: e.target.checked })}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">Include in Menu</span>
                                        </label>
                                    </div>
                                </div>

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
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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

// Assign Product Drawer Component
interface AssignProductDrawerProps {
    vendorUuid: string;
    categoryUuid: string;
    onClose: () => void;
    onSuccess: () => void;
}

const AssignProductDrawer: React.FC<AssignProductDrawerProps> = ({ vendorUuid, categoryUuid, onClose, onSuccess }) => {
    const [sku, setSku] = useState('');
    const [position, setPosition] = useState(0);
    const [loading, setLoading] = useState(false);
    const [assignProduct] = useAssignProductToCategoryMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await assignProduct({
                vendor_uuid: vendorUuid,
                category_uuid: categoryUuid,
                data: { sku, position },
            }).unwrap();
            onSuccess();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to assign product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 overflow-hidden z-50">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
                <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Assign Product to Category</h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product SKU *</label>
                                    <input
                                        type="text"
                                        value={sku}
                                        onChange={(e) => setSku(e.target.value)}
                                        required
                                        placeholder="Enter product SKU"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                    <input
                                        type="number"
                                        value={position}
                                        onChange={(e) => setPosition(parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

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
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Assign Product
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