import { useState, useRef, useEffect } from "react";
import {
    FaEllipsisV,
    FaCheckCircle,
    FaTimesCircle,
    FaEye,
    FaEdit,
    FaTrash,
    FaStar,
    FaRegStar,
    FaDollarSign,
    FaBoxes,
    FaStore,
    FaUser,
    FaChartLine,
    FaImage,
} from "react-icons/fa";
import {
    FiShield,
    FiAlertCircle,
    FiCheck,
    FiX,
    FiClock,
    FiCalendar,
    FiTag,
    FiPackage,
} from "react-icons/fi";
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

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface ImageContent {
    base64_encoded_data: string;
    type: string;
    name: string;
}

interface ProductImage {
    media_type: string;
    label: string;
    position: number;
    disabled: boolean;
    types: string[];
    content?: ImageContent;
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
    main_image?: string;
    categories?: string[];
    attributes?: any[];
    seo?: {
        meta_title?: string;
        meta_description?: string;
    };
    rating?: {
        average: number;
        total: number;
        distribution: number[];
    };
    stats?: {
        total_sold: number;
        total_revenue: number;
        views_count: number;
    };
    created_at: string;
    updated_at: string;
    last_synced_at?: string;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

const statusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
        case "active":
            return "bg-emerald-50 text-emerald-600 border-emerald-200";
        case "inactive":
            return "bg-gray-50 text-gray-500 border-gray-200";
        case "draft":
            return "bg-yellow-50 text-yellow-600 border-yellow-200";
        default:
            return "bg-gray-100 text-gray-500 border-gray-200";
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

// ─── Tabs config ──────────────────────────────────────────────────────────────

const TABS = [
    { key: "all", label: "All Products" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
    { key: "deleted", label: "Deleted" },
];

// ─── Image Lightbox Modal ────────────────────────────────────────────────────

const ImageLightbox = ({ images, initialIndex, onClose }: { images: ProductImage[]; initialIndex: number; onClose: () => void }) => {
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
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10"
                >
                    ✕
                </button>
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-3xl"
                        >
                            ←
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-3xl"
                        >
                            →
                        </button>
                    </>
                )}
                <img src={imageUrl} alt={currentImage?.label || 'Product image'} className="max-w-full max-h-screen object-contain" />
                <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
};

// ─── Pending Approval Modal ───────────────────────────────────────────────────

const PendingApprovalModal = ({
    isOpen,
    onClose,
    pendingProduct,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    pendingProduct: PendingProduct | null;
    onSuccess: () => void;
}) => {
    const [approveProduct, { isLoading: isApproving }] = useApproveProductMutation();
    const [rejectProduct, { isLoading: isRejecting }] = useRejectProductMutation();
    const [rejectReason, setRejectReason] = useState("");
    const [approveNotes, setApproveNotes] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const showMsg = (type: "success" | "error", msg: string) => {
        setModalToast({ type, msg });
        setTimeout(() => setModalToast(null), 3000);
    };

    const handleApprove = async () => {
        if (!pendingProduct) return;
        try {
            await approveProduct({ id: pendingProduct.id, notes: approveNotes || undefined }).unwrap();
            showMsg("success", `Product has been approved`);
            setTimeout(() => { onSuccess(); onClose(); }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to approve");
        }
    };

    const handleReject = async () => {
        if (!pendingProduct) return;
        if (!rejectReason.trim()) {
            showMsg("error", "Please provide a reason for rejection");
            return;
        }
        try {
            await rejectProduct({ id: pendingProduct.id, reason: rejectReason }).unwrap();
            showMsg("success", `Product has been rejected`);
            setTimeout(() => { onSuccess(); onClose(); }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to reject");
        }
    };

    if (!isOpen || !pendingProduct) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {modalToast && (
                <div className={`fixed top-5 right-5 z-[60] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${modalToast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{modalToast.type === "success" ? "✓" : "✕"}</span>
                    {modalToast.msg}
                </div>
            )}
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
                    <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Product Approval</h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {pendingProduct.product?.name || `Draft #${pendingProduct.id}`}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-0.5 cursor-pointer">✕</button>
                    </div>

                    <div className="p-6 space-y-4">
                        {!showRejectInput ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Approval Notes (Optional)
                                    </label>
                                    <textarea
                                        value={approveNotes}
                                        onChange={(e) => setApproveNotes(e.target.value)}
                                        placeholder="Add any notes about this approval..."
                                        rows={3}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowRejectInput(true)}
                                        className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition cursor-pointer"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        disabled={isApproving}
                                        className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition disabled:opacity-50 cursor-pointer"
                                    >
                                        {isApproving ? "Approving..." : "Approve"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rejection Reason *
                                    </label>
                                    <textarea
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Please provide a reason for rejection..."
                                        rows={3}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-400 resize-none"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowRejectInput(false)}
                                        className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition cursor-pointer"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={isRejecting}
                                        className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-50 cursor-pointer"
                                    >
                                        {isRejecting ? "Rejecting..." : "Confirm Rejection"}
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

// ─── Status Management Modal ──────────────────────────────────────────────────

const StatusManagementModal = ({
    isOpen,
    onClose,
    product,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSuccess: () => void;
}) => {
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    const [featureProduct, { isLoading: isFeaturing }] = useFeatureProductMutation();
    const [unfeatureProduct, { isLoading: isUnfeaturing }] = useUnfeatureProductMutation();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const showMsg = (type: "success" | "error", msg: string) => {
        setModalToast({ type, msg });
        setTimeout(() => setModalToast(null), 3000);
    };

    const handleDelete = async () => {
        if (!product) return;
        try {
            await deleteProduct(product.uuid).unwrap();
            showMsg("success", `${product.name} has been deleted`);
            setTimeout(() => { onSuccess(); onClose(); }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to delete");
        }
    };

    const handleFeature = async () => {
        if (!product) return;
        try {
            await featureProduct(product.uuid).unwrap();
            showMsg("success", `${product.name} has been featured`);
            setTimeout(() => { onSuccess(); onClose(); }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to feature product");
        }
    };

    const handleUnfeature = async () => {
        if (!product) return;
        try {
            await unfeatureProduct(product.uuid).unwrap();
            showMsg("success", `${product.name} has been unfeatured`);
            setTimeout(() => { onSuccess(); onClose(); }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to unfeature product");
        }
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {modalToast && (
                <div className={`fixed top-5 right-5 z-[60] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${modalToast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{modalToast.type === "success" ? "✓" : "✕"}</span>
                    {modalToast.msg}
                </div>
            )}
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
                    <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Manage Product</h2>
                            <p className="text-sm text-gray-500 mt-0.5">{product.name}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-0.5 cursor-pointer">✕</button>
                    </div>

                    <div className="px-6 pt-4">
                        <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                            <span className="text-sm text-gray-500">Current Status</span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(product.status)}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {product.status?.charAt(0).toUpperCase() + product.status?.slice(1)}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 space-y-3">
                        {product.status === "active" && !showDeleteConfirm && (
                            product.is_featured ? (
                                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
                                            <FaRegStar className="text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">Unfeature Product</p>
                                            <p className="text-xs text-gray-500">Remove from featured products</p>
                                        </div>
                                    </div>
                                    <button onClick={handleUnfeature} disabled={isUnfeaturing}
                                        className="px-4 py-1.5 rounded-lg bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition disabled:opacity-50 cursor-pointer">
                                        {isUnfeaturing ? "..." : "Unfeature"}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                                            <FaStar className="text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">Feature Product</p>
                                            <p className="text-xs text-gray-500">Showcase on homepage</p>
                                        </div>
                                    </div>
                                    <button onClick={handleFeature} disabled={isFeaturing}
                                        className="px-4 py-1.5 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition disabled:opacity-50 cursor-pointer">
                                        {isFeaturing ? "..." : "Feature"}
                                    </button>
                                </div>
                            )
                        )}

                        {!showDeleteConfirm ? (
                            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                                        <FiAlertCircle className="text-red-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Delete Product</p>
                                        <p className="text-xs text-gray-500">Permanently remove product</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowDeleteConfirm(true)}
                                    className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition cursor-pointer">
                                    Delete
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-3">
                                <p className="text-sm text-gray-700">
                                    Are you sure you want to delete <strong>{product.name}</strong>?
                                    This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition cursor-pointer">
                                        Cancel
                                    </button>
                                    <button onClick={handleDelete} disabled={isDeleting}
                                        className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-50 cursor-pointer">
                                        {isDeleting ? "Deleting..." : "Confirm Delete"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                        <button onClick={onClose} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition cursor-pointer">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Product Detail Drawer ───────────────────────────────────────────────────

const ProductDetailDrawer = ({
    product,
    onClose,
}: {
    product: Product | null;
    onClose: () => void;
}) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    if (!product) return null;

    const images = product.images || [];
    const hasImages = images.length > 0;
    const mainImage = hasImages ? images[0] : null;
    const mainImageUrl = mainImage?.content
        ? `data:${mainImage.content.type};base64,${mainImage.content.base64_encoded_data}`
        : mainImage?.file || '';

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
            <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-white shadow-2xl flex flex-col">
                <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Product Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Product Images */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FaImage className="text-teal-500" /> Product Images
                        </h3>
                        {hasImages ? (
                            <div className="flex gap-3 flex-wrap">
                                {images.map((img, idx) => {
                                    const imgUrl = img.content
                                        ? `data:${img.content.type};base64,${img.content.base64_encoded_data}`
                                        : img.file || '';
                                    return (
                                        <div
                                            key={idx}
                                            className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition border-2 border-transparent hover:border-teal-400"
                                            onClick={() => handleImageClick(idx)}
                                        >
                                            <img src={imgUrl} alt={img.label} className="w-full h-full object-cover" />
                                            {img.types?.includes('image') && img.types?.includes('small_image') && img.types?.includes('thumbnail') && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-teal-500 text-white text-xs text-center py-0.5">
                                                    Main
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-xl p-8 text-center">
                                <FaImage className="text-gray-300 text-4xl mx-auto mb-2" />
                                <p className="text-gray-400 text-sm">No images available</p>
                            </div>
                        )}
                    </div>

                    {/* Header */}
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-green-400 flex items-center justify-center">
                            <FaBoxes className="text-white text-2xl" />
                        </div>
                        <div className="flex-1">
                            <p className="text-lg font-bold text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-500">SKU: {product.sku || product.magento_sku}</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(product.status)}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {product.status?.charAt(0).toUpperCase() + product.status?.slice(1)}
                                </span>
                                {product.is_featured && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                        <FaStar className="text-xs" /> Featured
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                    <FiPackage className="text-xs" /> {getProductTypeLabel(product.type_id)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FaDollarSign className="text-teal-500" /> Pricing
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                            <div>
                                <p className="text-xs text-gray-400">Price</p>
                                <p className="text-lg font-bold text-teal-600">{product.formatted_price || formatPrice(product.price)}</p>
                            </div>
                            {product.special_price && (
                                <div>
                                    <p className="text-xs text-gray-400">Special Price</p>
                                    <p className="text-sm font-medium text-red-500">{formatPrice(product.special_price)}</p>
                                </div>
                            )}
                            {product.compare_price && (
                                <div>
                                    <p className="text-xs text-gray-400">Compare Price</p>
                                    <p className="text-sm text-gray-500 line-through">{formatPrice(product.compare_price)}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-gray-400">Stock Quantity</p>
                                <p className={`text-sm font-medium ${product.is_in_stock ? "text-emerald-600" : "text-red-500"}`}>
                                    {product.is_in_stock ? `${product.quantity} units` : "Out of Stock"}
                                </p>
                            </div>
                            {product.weight && (
                                <div>
                                    <p className="text-xs text-gray-400">Weight</p>
                                    <p className="text-sm text-gray-600">{product.weight} kg</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    {product.stats && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FaChartLine className="text-teal-500" /> Statistics
                            </h3>
                            <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-4">
                                <div className="text-center">
                                    <p className="text-xs text-gray-400">Total Sold</p>
                                    <p className="text-sm font-bold text-gray-700">{product.stats.total_sold}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-400">Total Revenue</p>
                                    <p className="text-sm font-bold text-gray-700">{formatPrice(product.stats.total_revenue)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-400">Views</p>
                                    <p className="text-sm font-bold text-gray-700">{product.stats.views_count}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rating */}
                    {product.rating && product.rating.total > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Rating</h3>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            star <= Math.round(product.rating!.average) ? (
                                                <FaStar key={star} className="text-yellow-400 text-sm" />
                                            ) : (
                                                <FaRegStar key={star} className="text-yellow-400 text-sm" />
                                            )
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{product.rating.average.toFixed(1)}</span>
                                    <span className="text-xs text-gray-400">({product.rating.total} reviews)</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {product.description && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">
                                {product.description}
                            </p>
                        </div>
                    )}

                    {product.short_description && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Short Description</h3>
                            <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
                                {product.short_description}
                            </p>
                        </div>
                    )}

                    {/* SEO */}
                    {product.seo && (product.seo.meta_title || product.seo.meta_description) && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">SEO Information</h3>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                {product.seo.meta_title && (
                                    <div>
                                        <p className="text-xs text-gray-400">Meta Title</p>
                                        <p className="text-sm text-gray-700">{product.seo.meta_title}</p>
                                    </div>
                                )}
                                {product.seo.meta_description && (
                                    <div>
                                        <p className="text-xs text-gray-400">Meta Description</p>
                                        <p className="text-sm text-gray-600">{product.seo.meta_description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Vendor & Store */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Organization</h3>
                        <div className="space-y-3">
                            {product.vendor && (
                                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                                    <FaUser className="text-teal-500" />
                                    <div>
                                        <p className="text-xs text-gray-400">Vendor</p>
                                        <p className="text-sm font-medium">{product.vendor.company_name || product.vendor.name}</p>
                                    </div>
                                </div>
                            )}
                            {product.store && (
                                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                                    <FaStore className="text-teal-500" />
                                    <div>
                                        <p className="text-xs text-gray-400">Store</p>
                                        <p className="text-sm font-medium">{product.store.store_name}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="pt-2 border-t border-gray-100">
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Product ID:</span>
                                <span className="text-gray-600 font-mono">{product.uuid?.slice(0, 8)}...</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Magento SKU:</span>
                                <span className="text-gray-600">{product.magento_sku || '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Created:</span>
                                <span className="text-gray-600">{fmtDate(product.created_at)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Last Updated:</span>
                                <span className="text-gray-600">{fmtDate(product.updated_at)}</span>
                            </div>
                            {product.last_synced_at && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Last Synced:</span>
                                    <span className="text-gray-600">{fmtDate(product.last_synced_at)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Lightbox */}
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

// ─── Row Action Menu ──────────────────────────────────────────────────────────

const RowMenu = ({
    onView,
    onEdit,
    onStatusManage,
    isPending = false,
    onApprove,
}: {
    onView: () => void;
    onEdit: () => void;
    onStatusManage: () => void;
    isPending?: boolean;
    onApprove?: () => void;
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)}>
                <FaEllipsisV className="text-sm" />
            </button>
            {open && (
                <div className="absolute right-0 top-7 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 text-sm">
                    <button onClick={() => { onView(); setOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 cursor-pointer">
                        <FaEye className="inline mr-2 text-xs" /> View Details
                    </button>
                    <button onClick={() => { onEdit(); setOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-teal-50 text-teal-600 cursor-pointer">
                        <FaEdit className="inline mr-2 text-xs" /> Edit Product
                    </button>
                    {isPending && onApprove && (
                        <button onClick={() => { onApprove(); setOpen(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-emerald-600 cursor-pointer">
                            <FiCheck className="inline mr-2 text-xs" /> Review & Approve
                        </button>
                    )}
                    <button onClick={() => { onStatusManage(); setOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-600 cursor-pointer">
                        <FiShield className="inline mr-2 text-xs" /> Manage
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const ProductList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all");
    const [filterStatus, setFilterStatus] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    // Vendor and Store filters
    const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
    const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
    const [availableStores, setAvailableStores] = useState<Store[]>([]);

    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
    const [selectedPending, setSelectedPending] = useState<PendingProduct | null>(null);

    // Get current user from Redux store
    const { user } = useSelector((state: RootState) => state.auth);
    const isAdminOrSuperAdmin = user?.roles?.includes('admin') || user?.roles?.includes('super_admin');

    // Fetch vendors for dropdown
    const { data: vendorsData, isLoading: vendorsLoading } = useGetVendorsQuery({}, { skip: !isAdminOrSuperAdmin });

    // Fetch products with filters
    const { data, isLoading, error, refetch } = useGetProductsQuery({
        status: activeTab !== "all" && activeTab !== "pending" ? activeTab : undefined,
        vendor_id: selectedVendorId || undefined,
        store_id: selectedStoreId || undefined,
        page: page,
        per_page: ITEMS_PER_PAGE,
    });

    const { data: pendingData, refetch: refetchPending } = useGetPendingProductsQuery({});
    const { data: statsData } = useGetProductStatisticsQuery();

    const products: Product[] = data?.data ?? [];
    const pendingProducts: PendingProduct[] = pendingData?.data ?? [];
    const stats = statsData?.data;
    const meta = data?.meta;
    const totalPages = meta?.last_page || 1;
    const currentPage = meta?.current_page || 1;

    const vendors = vendorsData?.data || [];

    // Update available stores when vendor changes
    useEffect(() => {
        if (selectedVendorId && vendorsData?.data) {
            const selectedVendor = vendorsData.data.find((v: Vendor) => v.id === selectedVendorId);
            if (selectedVendor && selectedVendor.stores) {
                setAvailableStores(selectedVendor.stores);
            } else {
                setAvailableStores([]);
            }
        } else {
            setAvailableStores([]);
        }
        // Reset store selection when vendor changes
        setSelectedStoreId(null);
    }, [selectedVendorId, vendorsData]);

    // Reset to first page when filters change
    useEffect(() => {
        setPage(1);
    }, [selectedVendorId, selectedStoreId, activeTab, filterStatus, search]);

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleReset = () => {
        setFilterStatus("");
        setSearch("");
        setSearchInput("");
        setSelectedVendorId(null);
        setSelectedStoreId(null);
        setPage(1);
    };

    // ─── Product Edit ───────────────────────────────────────────────────
    const handleEditProduct = (product: Product) => {
        setSelectedProductForEdit(product);
        setIsEditModalOpen(true);
    };

    const handleVendorChange = (vendorId: number) => {
        setSelectedVendorId(vendorId);
    };

    const handleStoreChange = (storeId: number) => {
        setSelectedStoreId(storeId);
    };

    const handleApproveClick = (pending: PendingProduct) => {
        setSelectedPending(pending);
        setIsPendingModalOpen(true);
    };

    const handleSuccess = () => {
        refetch();
        refetchPending();
    };

    const statuses = [...new Set(products.map(p => p.status).filter(Boolean))];

    const filters = [
        { label: "Status", options: statuses, value: filterStatus, onChange: (v: string) => { setFilterStatus(v); setPage(1); } },
    ];

    return (
        <div className="bg-white min-h-screen p-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            {/* Stats Summary */}
            {stats && (
                <div className="mb-6 flex gap-4 flex-wrap">
                    <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl px-4 py-2">
                        <span className="text-xs text-gray-500">Total Products</span>
                        <p className="text-xl font-bold text-teal-600">{stats.total}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl px-4 py-2">
                        <span className="text-xs text-gray-500">Active</span>
                        <p className="text-xl font-bold text-emerald-600">{stats.active}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-4 py-2">
                        <span className="text-xs text-gray-500">Inactive</span>
                        <p className="text-xl font-bold text-gray-600">{stats.inactive}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl px-4 py-2">
                        <span className="text-xs text-gray-500">Draft</span>
                        <p className="text-xl font-bold text-yellow-600">{stats.draft}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl px-4 py-2">
                        <span className="text-xs text-gray-500">Pending Approval</span>
                        <p className="text-xl font-bold text-purple-600">{stats.pending_approval}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl px-4 py-2">
                        <span className="text-xs text-gray-500">Total Value</span>
                        <p className="text-xl font-bold text-blue-600">{formatPrice(stats.total_value)}</p>
                    </div>
                </div>
            )}

            {/* Vendor and Store Filters (Admin only) */}
            {isAdminOrSuperAdmin && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Vendor <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedVendorId || ''}
                                onChange={(e) => handleVendorChange(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400 bg-white"
                                disabled={vendorsLoading}
                            >
                                <option value="" disabled>Select Vendor</option>
                                {vendors.map((vendor: Vendor) => (
                                    <option key={vendor.id} value={vendor.id}>
                                        {vendor.company_name || vendor.name}
                                    </option>
                                ))}
                            </select>
                            {!selectedVendorId && (
                                <p className="text-red-500 text-sm mt-1">Please select a vendor to view products</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Store
                            </label>
                            <select
                                value={selectedStoreId || ''}
                                onChange={(e) => handleStoreChange(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                disabled={!selectedVendorId || availableStores.length === 0}
                            >
                                <option value="">All Stores</option>
                                {availableStores.map((store: Store) => (
                                    <option key={store.id} value={store.id}>
                                        {store.store_name}
                                    </option>
                                ))}
                            </select>
                            {selectedVendorId && availableStores.length === 0 && !vendorsLoading && (
                                <p className="text-yellow-500 text-sm mt-1">No stores found for this vendor</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* PageHeader */}
            <PageHeader
                title="Product Management"
                addButtonLabel="Add New Product"
                onAdd={() => navigate(ROUTES.CREATE_PRODUCT_BASE)}
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={(tab) => { setActiveTab(tab); setPage(1); }}
                filters={activeTab !== "pending" ? filters : []}
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                onSearchSubmit={() => { setSearch(searchInput); setPage(1); }}
                onResetFilters={handleReset}
                searchPlaceholder="Search by product name, SKU, vendor..."
            />

            {/* Table */}
            <div className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto min-h-[500px]">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                                {activeTab === "pending" ? (
                                    ["Product", "SKU", "Vendor", "Type", "Submitted", "Status", "Notes", ""].map((col, i) => (
                                        <th key={i} className="px-4 py-4 text-left font-semibold text-sm whitespace-nowrap">{col}</th>
                                    ))
                                ) : (
                                    ["Image", "Product", "SKU", "Vendor", "Type", "Price", "Stock", "Status", "Created", ""].map((col, i) => (
                                        <th key={i} className="px-4 py-4 text-left font-semibold text-sm whitespace-nowrap">{col}</th>
                                    ))
                                )}
                            </tr>
                        </thead>

                        <tbody className="bg-white">
                            {isLoading && activeTab !== "pending" ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-16">
                                        <div className="flex items-center justify-center gap-3 text-gray-400">
                                            <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-teal-500" />
                                            <span className="text-sm">Loading products…</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-16 text-red-400 text-sm">
                                        Error loading products. Please try again.
                                    </td>
                                </tr>
                            ) : isAdminOrSuperAdmin && !selectedVendorId ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-16 text-gray-400 text-sm">
                                        Please select a vendor to view products
                                    </td>
                                </tr>
                            ) : activeTab === "pending" ? (
                                pendingProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-16 text-gray-400 text-sm">
                                            No pending products found
                                        </td>
                                    </tr>
                                ) : (
                                    pendingProducts.map((pending: PendingProduct, idx: number) => (
                                        <tr key={pending.id} className="hover:bg-gray-50/60 transition"
                                            style={{ borderBottom: idx < pendingProducts.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                                            <td className="relative pl-5 pr-4 py-3">
                                                <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-teal-400 to-teal-300" />
                                                <div>
                                                    <span className="font-semibold text-gray-800 text-sm block">
                                                        {pending.product?.name || `Draft #${pending.id}`}
                                                    </span>
                                                    <span className="text-xs text-gray-400">ID: {pending.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs">{pending.product?.sku || '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{pending.vendor?.company_name || pending.vendor?.name || "—"}</td>
                                            <td className="px-4 py-3 text-gray-500 text-xs">{getProductTypeLabel(pending.product?.type_id || 'simple')}</td>
                                            <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmtDate(pending.created_at)}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-yellow-50 text-yellow-600 border-yellow-200">
                                                    <FiClock className="text-xs" /> Pending
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{pending.notes || "—"}</td>
                                            <td className="relative pl-4 pr-5 py-3 text-right">
                                                <span className="absolute right-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-green-400 to-green-300" />
                                                <RowMenu
                                                    onView={() => { setSelectedPending(pending); setIsPendingModalOpen(true); }}
                                                    onEdit={() => {}}
                                                    onStatusManage={() => {}}
                                                    isPending={true}
                                                    onApprove={() => handleApproveClick(pending)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )
                            ) : (
                                products.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center py-16 text-gray-400 text-sm">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product: Product, idx: number) => {
                                        const mainImage = product.images?.find(img => img.types?.includes('image') && img.types?.includes('small_image')) || product.images?.[0];
                                        const imageUrl = mainImage?.content
                                            ? `data:${mainImage.content.type};base64,${mainImage.content.base64_encoded_data}`
                                            : mainImage?.file || '';

                                        return (
                                            <tr key={product.uuid} className="hover:bg-gray-50/60 transition cursor-pointer"
                                                style={{ borderBottom: idx < products.length - 1 ? "1px solid #f3f4f6" : "none" }}
                                                onClick={() => { setSelectedProduct(product); setIsDrawerOpen(true); }}>
                                                <td className="relative pl-5 pr-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                    <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-teal-400 to-teal-300" />
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
                                                        <span className="font-semibold text-gray-800 text-sm block">{product.name}</span>
                                                        {product.is_featured && (
                                                            <span className="inline-flex items-center gap-1 text-xs text-yellow-600 mt-1">
                                                                <FaStar className="text-xs" /> Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500 text-xs">{product.sku || product.magento_sku}</td>
                                                <td className="px-4 py-3 text-gray-600 text-xs">{product.vendor?.company_name || product.vendor?.name || "—"}</td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
                                                        {getProductTypeLabel(product.type_id)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <span className="font-semibold text-gray-800">{product.formatted_price || formatPrice(product.price)}</span>
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
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(product.status)}`}>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                        {product.status?.charAt(0).toUpperCase() + product.status?.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmtDate(product.created_at)}</td>
                                                <td className="relative pl-4 pr-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <span className="absolute right-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-green-400 to-green-300" />
                                                    <RowMenu
                                                        onView={() => { setSelectedProduct(product); setIsDrawerOpen(true); }}
                                                        onEdit={() => { handleEditProduct(product); }}
                                                        onStatusManage={() => { setSelectedProduct(product); setIsStatusModalOpen(true); }}
                                                        isPending={false}
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
                    <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-600">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setPage(currentPage - 1)}
                            className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                        >
                            ← Previous
                        </button>
                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={i}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-3 py-1 rounded-md cursor-pointer transition ${currentPage === pageNum
                                        ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <>
                                <span className="px-2">...</span>
                                <button
                                    onClick={() => setPage(totalPages)}
                                    className="px-3 py-1 rounded-md hover:bg-gray-100 cursor-pointer"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setPage(currentPage + 1)}
                            className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            {/* Status Management Modal */}
            <StatusManagementModal
                isOpen={isStatusModalOpen}
                onClose={() => { setIsStatusModalOpen(false); setSelectedProduct(null); }}
                product={selectedProduct}
                onSuccess={handleSuccess}
            />

            {/* Pending Approval Modal */}
            <PendingApprovalModal
                isOpen={isPendingModalOpen}
                onClose={() => { setIsPendingModalOpen(false); setSelectedPending(null); }}
                pendingProduct={selectedPending}
                onSuccess={handleSuccess}
            />

            {/* Product Detail Drawer */}
            <ProductDetailDrawer
                product={isDrawerOpen ? selectedProduct : null}
                onClose={() => { setIsDrawerOpen(false); setSelectedProduct(null); }}
            />

            {/* Product Edit Modal */}
            <ProductEditModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setSelectedProductForEdit(null); }}
                product={selectedProductForEdit}
                onSuccess={handleSuccess}
                isAdmin={isAdminOrSuperAdmin}
            />
        </div>
    );
};

export default ProductList;