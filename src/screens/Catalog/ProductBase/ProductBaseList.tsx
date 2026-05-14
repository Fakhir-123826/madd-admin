import { useState, useRef, useEffect } from "react";
import {
    FaEllipsisV, FaEye, FaEdit, FaStar, FaRegStar, FaDollarSign, 
    FaBoxes, FaStore, FaUser, FaChartLine, FaImage,
} from "react-icons/fa";
import { FiShield, FiAlertCircle, FiCheck, FiClock, FiPackage } from "react-icons/fi";
import {
    useGetProductsQuery,
    useGetPendingProductsQuery,
    useGetProductStatisticsQuery,
    useApproveProductMutation,
    useRejectProductMutation,
    useDeleteProductMutation,
    useFeatureProductMutation,
    useUnfeatureProductMutation,
} from "../../../app/api/ProductSlices/ProductApi";
import { useGetVendorsQuery } from "../../../app/api/VendorSlices/VendorApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../router";
import PageHeader from "../../../component/PageHeader/Pageheaderfilterbar";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import ProductEditModal from "../../../component/ModalPopup/ProductEditModal";

// ========== TYPES ==========
interface Vendor {
    id: number;
    uuid: string;
    name: string;
    company_name?: string;
    stores?: Store[];
}

interface Store {
    id: number;
    uuid: string;
    store_name: string;
    store_slug: string;
    status: string;
}

interface ProductImage {
    media_type: string;
    label: string;
    position: number;
    disabled: boolean;
    types: string[];
    content?: {
        base64_encoded_data: string;
        type: string;
        name: string;
    };
    file?: string;
}

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
    compare_price?: number;
    quantity: number;
    is_in_stock: boolean;
    weight?: number;
    status: "active" | "inactive" | "draft";
    type_id: string;
    is_featured?: boolean;
    vendor_id: number;
    store_id?: number;
    vendor?: Vendor;
    store?: Store;
    images?: ProductImage[];
    stats?: {
        total_sold: number;
        total_revenue: number;
        views_count: number;
    };
    created_at: string;
    updated_at: string;
}

interface PendingProduct {
    id: number;
    vendor_id: number;
    status: string;
    notes?: string;
    created_at: string;
    vendor?: Vendor;
    product?: Product;
}

// ========== CONSTANTS ==========
const TABS = [
    { key: "all", label: "All Products" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
    { key: "deleted", label: "Deleted" },
];

const ITEMS_PER_PAGE = 10;

// ========== HELPER FUNCTIONS ==========
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
        case "active": return "bg-emerald-50 text-emerald-600 border-emerald-200";
        case "inactive": return "bg-gray-50 text-gray-500 border-gray-200";
        case "draft": return "bg-yellow-50 text-yellow-600 border-yellow-200";
        default: return "bg-gray-100 text-gray-500 border-gray-200";
    }
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};

const getProductTypeLabel = (typeId: string) => {
    const types: Record<string, string> = {
        simple: "Simple",
        downloadable: "Downloadable",
        bundle: "Bundle",
        configurable: "Configurable",
        giftcard: "Gift Card",
        virtual: "Virtual",
    };
    return types[typeId] || typeId;
};

// ========== MODALS & DRAWERS ==========
const ImageLightbox = ({ images, initialIndex, onClose }: any) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const currentImage = images[currentIndex];
    const imageUrl = currentImage?.content
        ? `data:${currentImage.content.type};base64,${currentImage.content.base64_encoded_data}`
        : currentImage?.file || '';

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex]);

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
            <div className="relative max-w-5xl max-h-screen p-4" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl z-10">✕</button>
                {images.length > 1 && (
                    <>
                        <button onClick={handlePrevious} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl">←</button>
                        <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl">→</button>
                    </>
                )}
                <img src={imageUrl} alt={currentImage?.label} className="max-w-full max-h-screen object-contain" />
                <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
};

const PendingApprovalModal = ({ isOpen, onClose, pendingProduct, onSuccess }: any) => {
    const [approveProduct, { isLoading: isApproving }] = useApproveProductMutation();
    const [rejectProduct, { isLoading: isRejecting }] = useRejectProductMutation();
    const [rejectReason, setRejectReason] = useState("");
    const [approveNotes, setApproveNotes] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [toast, setToast] = useState<any>(null);

    const showToast = (type: string, msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleApprove = async () => {
        if (!pendingProduct) return;
        try {
            await approveProduct({ id: pendingProduct.id, notes: approveNotes || undefined }).unwrap();
            showToast("success", "Product approved successfully");
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (e: any) {
            showToast("error", e?.data?.message || "Failed to approve");
        }
    };

    const handleReject = async () => {
        if (!pendingProduct) return;
        if (!rejectReason.trim()) {
            showToast("error", "Please provide a reason for rejection");
            return;
        }
        try {
            await rejectProduct({ id: pendingProduct.id, reason: rejectReason }).unwrap();
            showToast("success", "Product rejected");
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (e: any) {
            showToast("error", e?.data?.message || "Failed to reject");
        }
    };

    if (!isOpen || !pendingProduct) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {toast && (
                <div className={`fixed top-5 right-5 z-[60] px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
                    toast.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                    {toast.type === "success" ? "✓" : "✕"} {toast.msg}
                </div>
            )}
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
                    <div className="px-6 py-4 border-b flex justify-between">
                        <div>
                            <h2 className="text-lg font-bold">Product Approval</h2>
                            <p className="text-sm text-gray-500">{pendingProduct.product?.name || `Draft #${pendingProduct.id}`}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400">✕</button>
                    </div>
                    <div className="p-6 space-y-4">
                        {!showRejectInput ? (
                            <>
                                <textarea
                                    value={approveNotes}
                                    onChange={(e) => setApproveNotes(e.target.value)}
                                    placeholder="Approval notes (optional)"
                                    rows={3}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400"
                                />
                                <div className="flex gap-3">
                                    <button onClick={() => setShowRejectInput(true)} className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                        Reject
                                    </button>
                                    <button onClick={handleApprove} disabled={isApproving} className="flex-1 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50">
                                        {isApproving ? "Approving..." : "Approve"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Rejection reason *"
                                    rows={3}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400"
                                />
                                <div className="flex gap-3">
                                    <button onClick={() => setShowRejectInput(false)} className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                                        Back
                                    </button>
                                    <button onClick={handleReject} disabled={isRejecting} className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">
                                        {isRejecting ? "Rejecting..." : "Confirm"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatusManagementModal = ({ isOpen, onClose, product, onSuccess }: any) => {
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    const [featureProduct, { isLoading: isFeaturing }] = useFeatureProductMutation();
    const [unfeatureProduct, { isLoading: isUnfeaturing }] = useUnfeatureProductMutation();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [toast, setToast] = useState<any>(null);

    const showToast = (type: string, msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDelete = async () => {
        if (!product) return;
        try {
            await deleteProduct(product.uuid).unwrap();
            showToast("success", `${product.name} deleted`);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (e: any) {
            showToast("error", e?.data?.message || "Delete failed");
        }
    };

    const handleFeature = async () => {
        if (!product) return;
        try {
            await featureProduct(product.uuid).unwrap();
            showToast("success", `${product.name} featured`);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (e: any) {
            showToast("error", e?.data?.message || "Failed to feature");
        }
    };

    const handleUnfeature = async () => {
        if (!product) return;
        try {
            await unfeatureProduct(product.uuid).unwrap();
            showToast("success", `${product.name} unfeatured`);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (e: any) {
            showToast("error", e?.data?.message || "Failed to unfeature");
        }
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {toast && (
                <div className={`fixed top-5 right-5 z-[60] px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
                    toast.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                    {toast.type === "success" ? "✓" : "✕"} {toast.msg}
                </div>
            )}
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
                    <div className="px-6 py-4 border-b flex justify-between">
                        <div>
                            <h2 className="text-lg font-bold">Manage Product</h2>
                            <p className="text-sm text-gray-500">{product.name}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400">✕</button>
                    </div>
                    
                    <div className="p-6 space-y-3">
                        {product.status === "active" && !showDeleteConfirm && (
                            product.is_featured ? (
                                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-xl">
                                    <div>
                                        <p className="font-semibold">Unfeature Product</p>
                                        <p className="text-xs text-gray-500">Remove from featured</p>
                                    </div>
                                    <button onClick={handleUnfeature} disabled={isUnfeaturing} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                                        {isUnfeaturing ? "..." : "Unfeature"}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                                    <div>
                                        <p className="font-semibold">Feature Product</p>
                                        <p className="text-xs text-gray-500">Showcase on homepage</p>
                                    </div>
                                    <button onClick={handleFeature} disabled={isFeaturing} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                                        {isFeaturing ? "..." : "Feature"}
                                    </button>
                                </div>
                            )
                        )}

                        {!showDeleteConfirm ? (
                            <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
                                <div>
                                    <p className="font-semibold">Delete Product</p>
                                    <p className="text-xs text-gray-500">Permanently remove</p>
                                </div>
                                <button onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                    Delete
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 bg-red-50 rounded-xl space-y-3">
                                <p className="text-sm">Delete <strong>{product.name}</strong>? This action cannot be undone.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 bg-gray-200 rounded-lg">Cancel</button>
                                    <button onClick={handleDelete} disabled={isDeleting} className="flex-1 py-2 bg-red-500 text-white rounded-lg">
                                        {isDeleting ? "Deleting..." : "Confirm"}
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

const ProductDetailDrawer = ({ product, onClose }: any) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    
    if (!product) return null;
    
    const images = product.images || [];
    
    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
            <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-white shadow-2xl flex flex-col">
                <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-lg font-bold">Product Details</h2>
                    <button onClick={onClose} className="text-gray-400">✕</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Images */}
                    <div>
                        <h3 className="font-semibold mb-3">Product Images</h3>
                        {images.length > 0 ? (
                            <div className="flex gap-3 flex-wrap">
                                {images.map((img: any, idx: number) => {
                                    const imgUrl = img.content 
                                        ? `data:${img.content.type};base64,${img.content.base64_encoded_data}`
                                        : img.file || '';
                                    return (
                                        <div
                                            key={idx}
                                            className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 border-2 hover:border-teal-400"
                                            onClick={() => {
                                                setSelectedImageIndex(idx);
                                                setLightboxOpen(true);
                                            }}
                                        >
                                            <img src={imgUrl} alt={img.label} className="w-full h-full object-cover" />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400">No images</div>
                        )}
                    </div>
                    
                    {/* Basic Info */}
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-green-400 flex items-center justify-center">
                            <FaBoxes className="text-white text-2xl" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold">{product.name}</h3>
                            <p className="text-sm text-gray-500">SKU: {product.sku || product.magento_sku}</p>
                            <div className="flex gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(product.status)}`}>
                                    {product.status}
                                </span>
                                {product.is_featured && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                        <FaStar className="inline mr-1" /> Featured
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Pricing */}
                    <div>
                        <h3 className="font-semibold mb-3">Pricing</h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                            <div>
                                <p className="text-xs text-gray-400">Price</p>
                                <p className="text-xl font-bold text-teal-600">{formatPrice(product.price)}</p>
                            </div>
                            {product.special_price && (
                                <div>
                                    <p className="text-xs text-gray-400">Special Price</p>
                                    <p className="text-red-500">{formatPrice(product.special_price)}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-gray-400">Stock</p>
                                <p className={product.is_in_stock ? "text-emerald-600" : "text-red-500"}>
                                    {product.is_in_stock ? `${product.quantity} units` : "Out of Stock"}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Stats */}
                    {product.stats && (
                        <div>
                            <h3 className="font-semibold mb-3">Statistics</h3>
                            <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-4 text-center">
                                <div>
                                    <p className="text-xs text-gray-400">Sold</p>
                                    <p className="font-bold">{product.stats.total_sold}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Revenue</p>
                                    <p className="font-bold">{formatPrice(product.stats.total_revenue)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Views</p>
                                    <p className="font-bold">{product.stats.views_count}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Description */}
                    {product.description && (
                        <div>
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">{product.description}</p>
                        </div>
                    )}
                    
                    {/* Vendor & Store */}
                    <div>
                        <h3 className="font-semibold mb-3">Organization</h3>
                        <div className="space-y-2">
                            {product.vendor && (
                                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                                    <FaUser className="text-teal-500" />
                                    <div>
                                        <p className="text-xs text-gray-400">Vendor</p>
                                        <p className="font-medium">{product.vendor.company_name || product.vendor.name}</p>
                                    </div>
                                </div>
                            )}
                            {product.store && (
                                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                                    <FaStore className="text-teal-500" />
                                    <div>
                                        <p className="text-xs text-gray-400">Store</p>
                                        <p className="font-medium">{product.store.store_name}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Meta Info */}
                    <div className="border-t pt-4 text-xs space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Created:</span>
                            <span>{formatDate(product.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Updated:</span>
                            <span>{formatDate(product.updated_at)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {lightboxOpen && (
                <ImageLightbox
                    images={images}
                    initialIndex={selectedImageIndex}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </>
    );
};

// ========== ROW ACTION MENU ==========
const RowMenu = ({ onView, onEdit, onStatusManage, onApprove, isPending = false, disabled = false }: any) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    if (disabled) return null;

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)} className="p-1">
                <FaEllipsisV className="text-gray-500" />
            </button>
            {open && (
                <div className="absolute right-0 top-7 z-30 bg-white rounded-xl shadow-lg border py-1 w-44 text-sm">
                    <button onClick={() => { onView(); setOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600">
                        <FaEye className="inline mr-2" /> View Details
                    </button>
                    <button onClick={() => { onEdit(); setOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-teal-50 text-teal-600">
                        <FaEdit className="inline mr-2" /> Edit Product
                    </button>
                    {isPending && onApprove && (
                        <button onClick={() => { onApprove(); setOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-emerald-600">
                            <FiCheck className="inline mr-2" /> Review & Approve
                        </button>
                    )}
                    <button onClick={() => { onStatusManage(); setOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-600">
                        <FiShield className="inline mr-2" /> Manage
                    </button>
                </div>
            )}
        </div>
    );
};

// ========== MAIN PRODUCT LIST COMPONENT ==========
const ProductList = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const isAdmin = user?.roles?.includes('admin') || user?.roles?.includes('super_admin');
    
    // State
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [selectedVendorUuid, setSelectedVendorUuid] = useState<string>("");
    const [selectedStoreUuid, setSelectedStoreUuid] = useState<string>("");
    const [availableStores, setAvailableStores] = useState<Store[]>([]);
    const [toast, setToast] = useState<any>(null);
    
    // Modal states
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
    const [selectedPending, setSelectedPending] = useState<PendingProduct | null>(null);
    
    // API calls
    const { data: vendorsData, isLoading: vendorsLoading } = useGetVendorsQuery({});
    const vendors = vendorsData?.data || [];
    
    // Auto-select first vendor for admin
    useEffect(() => {
        if (isAdmin && vendors.length > 0 && !selectedVendorUuid) {
            setSelectedVendorUuid(vendors[0].uuid);
        }
    }, [isAdmin, vendors, selectedVendorUuid]);
    
    // Update stores when vendor changes
    useEffect(() => {
        if (selectedVendorUuid && vendorsData?.data) {
            const selectedVendor = vendorsData.data.find((v: Vendor) => v.uuid === selectedVendorUuid);
            setAvailableStores(selectedVendor?.stores || []);
            setSelectedStoreUuid(""); // Reset store selection
        }
    }, [selectedVendorUuid, vendorsData]);
    
    // Fetch products
    const { 
        data, 
        isLoading: productsLoading, 
        error, 
        refetch 
    } = useGetProductsQuery({
        status: activeTab !== "all" && activeTab !== "pending" ? activeTab : undefined,
        vendor_uuid: isAdmin ? selectedVendorUuid : undefined,
        store_uuid: selectedStoreUuid || undefined,
        page: page,
        per_page: ITEMS_PER_PAGE,
    }, {
        skip: isAdmin && !selectedVendorUuid, // Skip if admin hasn't selected vendor
    });
    
    const { data: pendingData, refetch: refetchPending } = useGetPendingProductsQuery({});
    const { data: statsData } = useGetProductStatisticsQuery();
    
    // Derived data
    const products: Product[] = data?.data ?? [];
    const pendingProducts: PendingProduct[] = pendingData?.data ?? [];
    const stats = statsData?.data;
    const totalPages = data?.meta?.last_page || 1;
    const currentPage = data?.meta?.current_page || 1;
    
    // Loading state
    const isLoading = vendorsLoading || (isAdmin && !selectedVendorUuid) || productsLoading;
    
    // Handlers
    const showToast = (type: string, msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };
    
    const handleReset = () => {
        setFilterStatus("");
        setSearch("");
        setSearchInput("");
        setSelectedStoreUuid("");
        setPage(1);
    };
    
    const handleVendorChange = (vendorUuid: string) => {
        setSelectedVendorUuid(vendorUuid);
        setSelectedStoreUuid("");
        setPage(1);
    };
    
    const handleStoreChange = (storeUuid: string) => {
        setSelectedStoreUuid(storeUuid);
        setPage(1);
    };
    
    const handleSuccess = () => {
        refetch();
        refetchPending();
        showToast("success", "Operation completed successfully");
    };
    
    const statuses = [...new Set(products.map(p => p.status).filter(Boolean))];
    
    const filters = [
        {
            label: "Status",
            options: statuses,
            value: filterStatus,
            onChange: (v: string) => { setFilterStatus(v); setPage(1); }
        }
    ];
    
    return (
        <div className="bg-white min-h-screen p-6">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
                    toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                    {toast.type === "success" ? "✓" : "✕"} {toast.msg}
                </div>
            )}
            
            {/* Statistics Summary */}
            {stats && (
                <div className="mb-6 flex gap-4 flex-wrap">
                    <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl px-4 py-2">
                        <p className="text-xs text-gray-500">Total Products</p>
                        <p className="text-xl font-bold text-teal-600">{stats.total}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl px-4 py-2">
                        <p className="text-xs text-gray-500">Active</p>
                        <p className="text-xl font-bold text-emerald-600">{stats.active}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-4 py-2">
                        <p className="text-xs text-gray-500">Inactive</p>
                        <p className="text-xl font-bold text-gray-600">{stats.inactive}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl px-4 py-2">
                        <p className="text-xs text-gray-500">Draft</p>
                        <p className="text-xl font-bold text-yellow-600">{stats.draft}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl px-4 py-2">
                        <p className="text-xs text-gray-500">Pending</p>
                        <p className="text-xl font-bold text-purple-600">{stats.pending_approval}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl px-4 py-2">
                        <p className="text-xs text-gray-500">Total Value</p>
                        <p className="text-xl font-bold text-blue-600">{formatPrice(stats.total_value)}</p>
                    </div>
                </div>
            )}
            
            {/* Vendor Filter - Required for Admin */}
            {isAdmin && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Vendor <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedVendorUuid}
                                onChange={(e) => handleVendorChange(e.target.value)}
                                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-teal-400 bg-white"
                                disabled={vendorsLoading}
                            >
                                {vendors.map((vendor: Vendor) => (
                                    <option key={vendor.uuid} value={vendor.uuid}>
                                        {vendor.company_name || vendor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold mb-2">Store (Optional)</label>
                            <select
                                value={selectedStoreUuid}
                                onChange={(e) => handleStoreChange(e.target.value)}
                                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-teal-400 bg-white disabled:bg-gray-100"
                                disabled={!selectedVendorUuid || availableStores.length === 0}
                            >
                                <option value="">All Stores</option>
                                {availableStores.map((store: Store) => (
                                    <option key={store.uuid} value={store.uuid}>
                                        {store.store_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Page Header with Tabs and Search */}
            <PageHeader
                title="Product Management"
                addButtonLabel="Add New Product"
                onAdd={() => navigate(ROUTES.CREATE_PRODUCT_BASE)}
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={(tab: string) => { setActiveTab(tab); setPage(1); }}
                filters={activeTab !== "pending" ? filters : []}
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                onSearchSubmit={() => { setSearch(searchInput); setPage(1); }}
                onResetFilters={handleReset}
                searchPlaceholder="Search by name, SKU, vendor..."
            />
            
            {/* Products Table */}
            <div className="rounded-2xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto min-h-[500px]">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                                {activeTab === "pending" ? (
                                    ["Product", "SKU", "Vendor", "Type", "Submitted", "Status", "Notes", ""].map((col, i) => (
                                        <th key={i} className="px-4 py-4 text-left font-semibold text-sm">{col}</th>
                                    ))
                                ) : (
                                    ["Image", "Product", "SKU", "Vendor", "Type", "Price", "Stock", "Status", "Created", ""].map((col, i) => (
                                        <th key={i} className="px-4 py-4 text-left font-semibold text-sm">{col}</th>
                                    ))
                                )}
                            </tr>
                        </thead>
                        
                        <tbody className="bg-white">
                            {/* Loading State */}
                            {isLoading && (
                                <tr>
                                    <td colSpan={10} className="text-center py-16">
                                        <div className="flex justify-center items-center gap-3 text-gray-400">
                                            <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-teal-500" />
                                            <span>Loading products...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            
                            {/* Error State */}
                            {!isLoading && error && (
                                <tr>
                                    <td colSpan={10} className="text-center py-16 text-red-400">
                                        Error loading products. Please try again.
                                    </td>
                                </tr>
                            )}
                            
                            {/* No Vendor Selected */}
                            {!isLoading && !error && isAdmin && !selectedVendorUuid && (
                                <tr>
                                    <td colSpan={10} className="text-center py-16 text-gray-400">
                                        Please select a vendor to view products
                                    </td>
                                </tr>
                            )}
                            
                            {/* Pending Products Tab */}
                            {!isLoading && !error && activeTab === "pending" && !(isAdmin && !selectedVendorUuid) && (
                                pendingProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-16 text-gray-400">
                                            No pending products found
                                        </td>
                                    </tr>
                                ) : (
                                    pendingProducts.map((pending: PendingProduct, idx: number) => (
                                        <tr key={pending.id} className="hover:bg-gray-50/60 transition border-b last:border-b-0">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-semibold text-gray-800">{pending.product?.name || `Draft #${pending.id}`}</p>
                                                    <p className="text-xs text-gray-400">ID: {pending.id}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs">{pending.product?.sku || '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{pending.vendor?.company_name || pending.vendor?.name || "—"}</td>
                                            <td className="px-4 py-3 text-gray-500 text-xs">{getProductTypeLabel(pending.product?.type_id || 'simple')}</td>
                                            <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(pending.created_at)}</td>
                                            <td className="px-4 py-3">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-600 border border-yellow-200">
                                                    <FiClock className="inline mr-1" /> Pending
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{pending.notes || "—"}</td>
                                            <td className="px-4 py-3 text-right">
                                                <RowMenu
                                                    onView={() => { setSelectedPending(pending); setIsPendingModalOpen(true); }}
                                                    onEdit={() => {}}
                                                    onStatusManage={() => {}}
                                                    onApprove={() => { setSelectedPending(pending); setIsPendingModalOpen(true); }}
                                                    isPending={true}
                                                    disabled={isLoading}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )
                            )}
                            
                            {/* Products Tab */}
                            {!isLoading && !error && activeTab !== "pending" && !(isAdmin && !selectedVendorUuid) && (
                                products.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center py-16 text-gray-400">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product: Product, idx: number) => {
                                        const mainImage = product.images?.[0];
                                        const imageUrl = mainImage?.content 
                                            ? `data:${mainImage.content.type};base64,${mainImage.content.base64_encoded_data}`
                                            : mainImage?.file || '';
                                        
                                        return (
                                            <tr 
                                                key={product.uuid} 
                                                className="hover:bg-gray-50/60 transition cursor-pointer border-b last:border-b-0"
                                                onClick={() => { setSelectedProduct(product); setIsDrawerOpen(true); }}
                                            >
                                                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                    {imageUrl ? (
                                                        <img src={imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <FaImage className="text-gray-300" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{product.name}</p>
                                                        {product.is_featured && (
                                                            <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                                                                <FaStar className="text-xs" /> Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500 text-xs">{product.sku || product.magento_sku}</td>
                                                <td className="px-4 py-3 text-gray-600 text-xs">{product.vendor?.company_name || product.vendor?.name || "—"}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
                                                        {getProductTypeLabel(product.type_id)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <span className="font-semibold">{formatPrice(product.price)}</span>
                                                        {product.special_price && (
                                                            <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(product.special_price)}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-xs font-medium ${product.is_in_stock ? "text-emerald-600" : "text-red-500"}`}>
                                                        {product.is_in_stock ? `${product.quantity} units` : "Out of Stock"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(product.status)}`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(product.created_at)}</td>
                                                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <RowMenu
                                                        onView={() => { setSelectedProduct(product); setIsDrawerOpen(true); }}
                                                        onEdit={() => { setSelectedProductForEdit(product); setIsEditModalOpen(true); }}
                                                        onStatusManage={() => { setSelectedProduct(product); setIsStatusModalOpen(true); }}
                                                        disabled={isLoading}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })
                                )
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 py-6 text-sm">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setPage(currentPage - 1)}
                            className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
                        >
                            ← Previous
                        </button>
                        
                        {(() => {
                            const pages = [];
                            let startPage = Math.max(1, currentPage - 2);
                            let endPage = Math.min(totalPages, startPage + 4);
                            
                            if (endPage - startPage < 4) {
                                startPage = Math.max(1, endPage - 4);
                            }
                            
                            for (let i = startPage; i <= endPage; i++) {
                                pages.push(i);
                            }
                            
                            return pages.map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-3 py-1 rounded-md transition ${
                                        currentPage === pageNum
                                            ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                                            : "hover:bg-gray-100"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            ));
                        })()}
                        
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setPage(currentPage + 1)}
                            className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
            
            {/* Modals */}
            <StatusManagementModal
                isOpen={isStatusModalOpen}
                onClose={() => { setIsStatusModalOpen(false); setSelectedProduct(null); }}
                product={selectedProduct}
                onSuccess={handleSuccess}
            />
            
            <PendingApprovalModal
                isOpen={isPendingModalOpen}
                onClose={() => { setIsPendingModalOpen(false); setSelectedPending(null); }}
                pendingProduct={selectedPending}
                onSuccess={handleSuccess}
            />
            
            <ProductDetailDrawer
                product={isDrawerOpen ? selectedProduct : null}
                onClose={() => { setIsDrawerOpen(false); setSelectedProduct(null); }}
            />
            
            <ProductEditModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setSelectedProductForEdit(null); }}
                product={selectedProductForEdit}
                onSuccess={handleSuccess}
                isAdmin={isAdmin}
            />
        </div>
    );
};

export default ProductList;