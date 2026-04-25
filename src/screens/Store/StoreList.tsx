import { useState, useRef, useEffect } from "react";
import {
    FaEllipsisV,
    FaCheckCircle,
    FaTimesCircle,
    FaStore,
    FaEye,
    FaEdit,
    FaTrash,
    FaPlay,
    FaStop,
    FaGlobe,
    FaLanguage,
    FaMoneyBillWave,
    FaShieldAlt,
    FaChartLine
} from "react-icons/fa";
import {
    FiShield,
    FiAlertCircle,
    FiUserCheck,
    FiEye,
    FiMapPin,
    FiMail,
    FiPhone,
    FiCalendar,
    FiGlobe,
    FiServer,
    FiCheck,
    FiX
} from "react-icons/fi";
import {
    useGetStoresQuery,
    useGetStoreQuery,
    useCreateStoreMutation,
    useUpdateStoreMutation,
    useDeleteStoreMutation,
    useForceDeleteStoreMutation,
    useRestoreStoreMutation,
    useActivateStoreMutation,
    useDeactivateStoreMutation,
    useAddStoreDomainMutation,
    useGetStoreStatsQuery,
    useGetStoresByVendorQuery,
    useBulkStatusUpdateMutation,
} from "../../app/api/StoreSlices/StoreApi";
import StoreModal from "../../component/StoreModal";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router";
import PageHeader from "../../component/PageHeader/Pageheaderfilterbar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Country {
    code: string;
    name: string;
}

interface Language {
    code: string;
    name: string;
}

interface Currency {
    code: string;
    symbol: string;
}

interface Domain {
    domain: string;
    is_primary: boolean;
    dns_verified: boolean;
    ssl_status: string;
}

interface Vendor {
    id: string;
    name: string;
    slug: string;
}

interface Store {
    id: number;
    uuid: string;
    store_name: string;
    store_slug: string;
    country: Country;
    language: Language;
    currency: Currency;
    status: string;
    status_label: string;
    is_demo: boolean;
    subdomain: string;
    has_custom_domain: boolean;
    domain: Domain | null;
    vendor: Vendor | null;
    created_at: string;
    updated_at: string;
    activated_at?: string;
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
        case "suspended":
            return "bg-yellow-50 text-yellow-600 border-yellow-200";
        case "maintenance":
            return "bg-orange-50 text-orange-600 border-orange-200";
        default:
            return "bg-gray-100 text-gray-500 border-gray-200";
    }
};

const sslStyle = (status: string) => {
    switch (status) {
        case "active":
            return "bg-emerald-100 text-emerald-700";
        case "pending":
            return "bg-yellow-100 text-yellow-700";
        case "failed":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-500";
    }
};

// ─── Tabs config ──────────────────────────────────────────────────────────────

const TABS = [
    { key: "all", label: "All Stores" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
    { key: "suspended", label: "Suspended" },
    { key: "maintenance", label: "Maintenance" },
];

// ─── Status Management Modal ──────────────────────────────────────────────────

const StatusManagementModal = ({
    isOpen,
    onClose,
    store,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    store: Store | null;
    onSuccess: () => void;
}) => {
    const [activateStore, { isLoading: isActivating }] = useActivateStoreMutation();
    const [deactivateStore, { isLoading: isDeactivating }] = useDeactivateStoreMutation();
    const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();
    const [forceDeleteStore, { isLoading: isForceDeleting }] = useForceDeleteStoreMutation();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showForceDeleteConfirm, setShowForceDeleteConfirm] = useState(false);
    const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const showMsg = (type: "success" | "error", msg: string) => {
        setModalToast({ type, msg });
        setTimeout(() => setModalToast(null), 3000);
    };

    const handleActivate = async () => {
        if (!store) return;
        try {
            await activateStore(store.uuid).unwrap();
            showMsg("success", `${store.store_name} has been activated`);
            setTimeout(() => { onSuccess(); onClose(); }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to activate");
        }
    };

    const handleDeactivate = async () => {
        if (!store) return;
        try {
            await deactivateStore(store.uuid).unwrap();
            showMsg("success", `${store.store_name} has been deactivated`);
            setTimeout(() => { onSuccess(); onClose(); }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to deactivate");
        }
    };

    const handleDelete = async () => {
        if (!store) return;
        try {
            await deleteStore(store.uuid).unwrap();
            showMsg("success", `${store.store_name} has been deleted`);
            setTimeout(() => { onSuccess(); onClose(); }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to delete");
        }
    };

    const handleForceDelete = async () => {
        if (!store) return;
        try {
            await forceDeleteStore(store.uuid).unwrap();
            showMsg("success", `${store.store_name} has been permanently deleted`);
            setTimeout(() => { onSuccess(); onClose(); }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to permanently delete");
        }
    };

    if (!isOpen || !store) return null;

    const isActive = store.status === "active";
    const isInactive = store.status === "inactive";
    const isSuspended = store.status === "suspended";
    const isMaintenance = store.status === "maintenance";

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
                            <h2 className="text-lg font-bold text-gray-800">Manage Store Status</h2>
                            <p className="text-sm text-gray-500 mt-0.5">{store.store_name}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-0.5 cursor-pointer">✕</button>
                    </div>

                    <div className="px-6 pt-4">
                        <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                            <span className="text-sm text-gray-500">Current Status</span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(store.status)}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {store.status_label || store.status}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 space-y-3">
                        {/* Activate - for inactive/suspended/maintenance */}
                        {(isInactive || isSuspended || isMaintenance) && !showDeleteConfirm && !showForceDeleteConfirm && (
                            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <FaPlay className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Activate Store</p>
                                        <p className="text-xs text-gray-500">Make store live</p>
                                    </div>
                                </div>
                                <button onClick={handleActivate} disabled={isActivating}
                                    className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition disabled:opacity-50 cursor-pointer">
                                    {isActivating ? "..." : "Activate"}
                                </button>
                            </div>
                        )}

                        {/* Deactivate - for active stores */}
                        {isActive && !showDeleteConfirm && !showForceDeleteConfirm && (
                            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <FaStop className="text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Deactivate Store</p>
                                        <p className="text-xs text-gray-500">Take store offline</p>
                                    </div>
                                </div>
                                <button onClick={handleDeactivate} disabled={isDeactivating}
                                    className="px-4 py-1.5 rounded-lg bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition disabled:opacity-50 cursor-pointer">
                                    {isDeactivating ? "..." : "Deactivate"}
                                </button>
                            </div>
                        )}

                        {/* Delete options */}
                        {!showDeleteConfirm && !showForceDeleteConfirm && (
                            <>
                                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                                            <FiAlertCircle className="text-red-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">Soft Delete</p>
                                            <p className="text-xs text-gray-500">Move to trash (can restore)</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowDeleteConfirm(true)}
                                        className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition cursor-pointer">
                                        Delete
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-red-100 rounded-xl border border-red-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-red-200 flex items-center justify-center">
                                            <FiAlertCircle className="text-red-700" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">Force Delete</p>
                                            <p className="text-xs text-gray-500">Permanently delete (cannot restore)</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowForceDeleteConfirm(true)}
                                        className="px-4 py-1.5 rounded-lg bg-red-700 text-white text-sm font-medium hover:bg-red-800 transition cursor-pointer">
                                        Force Delete
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Soft Delete Confirmation */}
                        {showDeleteConfirm && (
                            <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-3">
                                <p className="text-sm text-gray-700">
                                    Are you sure you want to delete <strong>{store.store_name}</strong>?
                                    This store can be restored later.
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

                        {/* Force Delete Confirmation */}
                        {showForceDeleteConfirm && (
                            <div className="p-4 bg-red-100 rounded-xl border border-red-300 space-y-3">
                                <p className="text-sm text-gray-700 font-semibold">
                                    ⚠️ PERMANENT ACTION ⚠️
                                </p>
                                <p className="text-sm text-gray-700">
                                    Are you sure you want to <strong>permanently delete</strong> <strong>{store.store_name}</strong>?
                                    This action <strong>CANNOT</strong> be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowForceDeleteConfirm(false)}
                                        className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition cursor-pointer">
                                        Cancel
                                    </button>
                                    <button onClick={handleForceDelete} disabled={isForceDeleting}
                                        className="flex-1 py-2 rounded-lg bg-red-700 text-white text-sm font-medium hover:bg-red-800 transition disabled:opacity-50 cursor-pointer">
                                        {isForceDeleting ? "Deleting..." : "Confirm Force Delete"}
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

// ─── Row Action Menu ──────────────────────────────────────────────────────────

const RowMenu = ({
    onView,
    onEdit,
    onStatusManage,
}: {
    onView: () => void;
    onEdit: () => void;
    onStatusManage: () => void;
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
            <button onClick={() => setOpen(!open)}
                className="text-gray-400 hover:text-gray-600 p-1 transition cursor-pointer">
                <FaEllipsisV className="text-sm" />
            </button>
            {open && (
                <div className="absolute right-0 top-7 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 text-sm">
                    <button onClick={() => { onView(); setOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 cursor-pointer">
                        <FaEye className="inline mr-2 text-xs" /> View Details
                    </button>
                    <button onClick={() => { onStatusManage(); setOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-600 cursor-pointer">
                        <FiShield className="inline mr-2 text-xs" /> Manage Status
                    </button>
                    <button onClick={() => { onEdit(); setOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-teal-50 text-teal-700 cursor-pointer">
                        <FaEdit className="inline mr-2 text-xs" /> Edit
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── Store Detail Drawer ─────────────────────────────────────────────────────

const StoreDetailDrawer = ({
    store,
    onClose,
}: {
    store: Store | null;
    onClose: () => void;
}) => {
    const { data: statsData } = useGetStoreStatsQuery(store?.uuid || "", {
        skip: !store?.uuid,
    });

    if (!store) return null;

    const stats = statsData?.data;

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
            <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
                <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Store Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-green-400 flex items-center justify-center">
                            <FaStore className="text-white text-2xl" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-800">{store.store_name}</p>
                            <p className="text-sm text-gray-500">{store.store_slug}</p>
                            <div className="flex gap-2 mt-2">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(store.status)}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {store.status_label || store.status}
                                </span>
                                {store.is_demo && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-600">
                                        Demo Store
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Vendor Info */}
                    {store.vendor && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FiUserCheck className="text-teal-500" /> Vendor
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="font-medium text-gray-800">{store.vendor.name}</p>
                                <p className="text-xs text-gray-400">ID: {store.vendor.id}</p>
                            </div>
                        </div>
                    )}

                    {/* Domain & Subdomain */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FiGlobe className="text-teal-500" /> Domain Information
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-400 mb-1">Subdomain</p>
                                <p className="text-sm font-medium text-gray-700">{store.subdomain || "—"}</p>
                            </div>
                            {store.domain && (
                                <>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs text-gray-400 mb-1">Custom Domain</p>
                                        <p className="text-sm font-medium text-teal-600">{store.domain.domain}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                                            <p className="text-xs text-gray-400 mb-1">DNS Verified</p>
                                            {store.domain.dns_verified ? (
                                                <FaCheckCircle className="text-emerald-500 text-lg mx-auto" />
                                            ) : (
                                                <FaTimesCircle className="text-red-400 text-lg mx-auto" />
                                            )}
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                                            <p className="text-xs text-gray-400 mb-1">SSL Status</p>
                                            <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${sslStyle(store.domain.ssl_status)}`}>
                                                {store.domain.ssl_status || "—"}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Localization */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FiGlobe className="text-teal-500" /> Localization
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <FaLanguage className="text-teal-500 mx-auto mb-1" />
                                <p className="text-xs text-gray-400">Language</p>
                                <p className="text-sm font-medium">{store.language?.name || "—"}</p>
                                <p className="text-xs text-gray-400">{store.language?.code}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <FaMoneyBillWave className="text-teal-500 mx-auto mb-1" />
                                <p className="text-xs text-gray-400">Currency</p>
                                <p className="text-sm font-medium">{store.currency?.code || "—"}</p>
                                <p className="text-xs text-gray-400">{store.currency?.symbol}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <FiMapPin className="text-teal-500 mx-auto mb-1" />
                                <p className="text-xs text-gray-400">Country</p>
                                <p className="text-sm font-medium">{store.country?.name || "—"}</p>
                                <p className="text-xs text-gray-400">{store.country?.code}</p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    {stats && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FaChartLine className="text-teal-500" /> Statistics
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-400">Total Products</p>
                                    <p className="text-xl font-bold text-teal-600">{stats.products?.total || 0}</p>
                                    <p className="text-xs text-gray-500">Active: {stats.products?.active || 0}</p>
                                </div>
                                <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-400">Total Orders</p>
                                    <p className="text-xl font-bold text-teal-600">{stats.orders?.total || 0}</p>
                                    <p className="text-xs text-gray-500">Completed: {stats.orders?.completed || 0}</p>
                                </div>
                                <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-400">Total Revenue</p>
                                    <p className="text-xl font-bold text-teal-600">${stats.revenue?.total || 0}</p>
                                    <p className="text-xs text-gray-500">Last 30 days: ${stats.revenue?.last_30_days || 0}</p>
                                </div>
                                <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-400">Average Rating</p>
                                    <p className="text-xl font-bold text-teal-600">{stats.ratings?.average || 0}</p>
                                    <p className="text-xs text-gray-500">{stats.ratings?.total_reviews || 0} reviews</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Meta Info */}
                    <div className="pt-2 border-t border-gray-100">
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Store ID:</span>
                                <span className="text-gray-600">{store.uuid?.slice(0, 8)}...</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Created:</span>
                                <span className="text-gray-600">{fmtDate(store.created_at)}</span>
                            </div>
                            {store.activated_at && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Activated:</span>
                                    <span className="text-gray-600">{fmtDate(store.activated_at)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-400">Has Custom Domain:</span>
                                <span className="text-gray-600">{store.has_custom_domain ? "Yes" : "No"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const StoreList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterCountry, setFilterCountry] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);

    const { data, isLoading, error, refetch } = useGetStoresQuery({});
    const [updateStore] = useUpdateStoreMutation();

    const stores: Store[] = data?.data ?? [];
    const meta = data?.meta;

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSaveStore = async (formData: Partial<Store>) => {
        try {
            if (selectedStore) {
                await updateStore({ uuid: selectedStore.uuid, data: formData }).unwrap();
                showToast("success", "Store updated successfully!");
            }
            refetch();
            setIsEditModalOpen(false);
            setSelectedStore(null);
        } catch (e: any) {
            showToast("error", e?.data?.message || "Failed to save store");
            throw e;
        }
    };

    const handleReset = () => {
        setFilterStatus("");
        setFilterCountry("");
        setSearch("");
        setSearchInput("");
        setPage(1);
    };

    // Derived values for filters
    const statuses = [...new Set(stores.map(s => s.status).filter(Boolean))];
    const countries = [...new Set(stores.map(s => s.country?.code).filter(Boolean))];

    // Filtering logic
    const filtered = stores.filter(store => {
        const matchStatus = !filterStatus || store.status === filterStatus;
        const matchCountry = !filterCountry || store.country?.code === filterCountry;
        const matchSearch = !search ||
            store.store_name?.toLowerCase().includes(search.toLowerCase()) ||
            store.store_slug?.toLowerCase().includes(search.toLowerCase()) ||
            store.vendor?.name?.toLowerCase().includes(search.toLowerCase()) ||
            store.subdomain?.toLowerCase().includes(search.toLowerCase());

        let matchTab = true;
        if (activeTab !== "all") {
            matchTab = store.status === activeTab;
        }

        return matchStatus && matchCountry && matchSearch && matchTab;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    // Filters config for PageHeader
    const filters = [
        { label: "Status", options: statuses, value: filterStatus, onChange: (v: string) => { setFilterStatus(v); setPage(1); } },
        { label: "Country", options: countries, value: filterCountry, onChange: (v: string) => { setFilterCountry(v); setPage(1); } },
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
            <div className="mb-6 flex gap-4">
                <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl px-4 py-2">
                    <span className="text-xs text-gray-500">Total Stores</span>
                    <p className="text-xl font-bold text-teal-600">{meta?.total_records || stores.length}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl px-4 py-2">
                    <span className="text-xs text-gray-500">Active</span>
                    <p className="text-xl font-bold text-emerald-600">{meta?.active || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-xl px-4 py-2">
                    <span className="text-xs text-gray-500">Inactive</span>
                    <p className="text-xl font-bold text-gray-600">{meta?.inactive || 0}</p>
                </div>
            </div>

            {/* PageHeader */}
            <PageHeader
                title="Store Management"
                addButtonLabel="Add New Store"
                onAdd={() => navigate(ROUTES.CREATE_STORE)}
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={(tab) => { setActiveTab(tab); setPage(1); }}
                filters={filters}
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                onSearchSubmit={() => { setSearch(searchInput); setPage(1); }}
                onResetFilters={handleReset}
                searchPlaceholder="Search by store name, vendor, subdomain..."
            />

            {/* Table */}
            <div className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto min-h-[500px]">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                                {["Store", "Vendor", "Country", "Currency", "Language", "Domain", "Status", "Created", ""].map((col, i) => (
                                    <th key={i} className="px-4 py-4 text-left font-semibold text-sm whitespace-nowrap">{col}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="bg-white">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-16">
                                        <div className="flex items-center justify-center gap-3 text-gray-400">
                                            <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-teal-500" />
                                            <span className="text-sm">Loading stores…</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-16 text-red-400 text-sm">
                                        Error loading stores. Please try again.
                                    </td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-16 text-gray-300 text-sm">
                                        No stores found.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((store, idx) => (
                                    <tr
                                        key={store.uuid}
                                        className="hover:bg-gray-50/60 transition"
                                        style={{ borderBottom: idx < paginated.length - 1 ? "1px solid #f3f4f6" : "none" }}
                                    >
                                        {/* Store */}
                                        <td className="relative pl-5 pr-4 py-3">
                                            <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-teal-400 to-teal-300" />
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-green-400 flex items-center justify-center">
                                                    <FaStore className="text-white text-xs" />
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-800 text-sm block">{store.store_name}</span>
                                                    <span className="text-xs text-gray-400">{store.subdomain}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Vendor */}
                                        <td className="px-4 py-3 text-gray-600 text-xs">{store.vendor?.name || "—"}</td>

                                        {/* Country */}
                                        <td className="px-4 py-3 text-gray-600 text-xs">{store.country?.name || "—"}</td>

                                        {/* Currency */}
                                        <td className="px-4 py-3 text-gray-600 text-xs">
                                            {store.currency?.code || "—"}
                                            {store.currency?.symbol ? ` (${store.currency.symbol})` : ""}
                                        </td>

                                        {/* Language */}
                                        <td className="px-4 py-3 text-gray-600 text-xs">{store.language?.name || "—"}</td>

                                        {/* Domain */}
                                        <td className="px-4 py-3">
                                            {store.domain?.domain ? (
                                                <div className="text-xs">
                                                    <p className="text-blue-600">{store.domain.domain}</p>
                                                    <div className="flex gap-1 mt-1 items-center">
                                                        {store.domain.dns_verified ? (
                                                            <FaCheckCircle className="text-emerald-500 text-xs" title="DNS Verified" />
                                                        ) : (
                                                            <FaTimesCircle className="text-red-400 text-xs" title="DNS Not Verified" />
                                                        )}
                                                        <span className={`text-xs px-1.5 py-0.5 rounded ${sslStyle(store.domain.ssl_status)}`}>
                                                            {store.domain.ssl_status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : "—"}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(store.status)}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                {store.status_label || store.status}
                                            </span>
                                        </td>

                                        {/* Created */}
                                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmtDate(store.created_at)}</td>

                                        {/* Actions */}
                                        <td className="relative pl-4 pr-5 py-3 text-right">
                                            <span className="absolute right-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-green-400 to-green-300" />
                                            <RowMenu
                                                onView={() => { setSelectedStore(store); setIsDrawerOpen(true); }}
                                                onEdit={() => { setSelectedStore(store); setIsEditModalOpen(true); }}
                                                onStatusManage={() => { setSelectedStore(store); setIsStatusModalOpen(true); }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-600">
                        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer">
                            ← Back
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded-md cursor-pointer ${page === i + 1 ? "bg-gradient-to-r from-teal-400 to-green-400 text-white" : "hover:bg-gray-100"}`}>
                                {i + 1}
                            </button>
                        ))}
                        <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer">
                            Next →
                        </button>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <StoreModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setSelectedStore(null); }}
                store={selectedStore}
                onSave={handleSaveStore}
            />

            {/* Status Management Modal */}
            <StatusManagementModal
                isOpen={isStatusModalOpen}
                onClose={() => { setIsStatusModalOpen(false); setSelectedStore(null); }}
                store={selectedStore}
                onSuccess={refetch}
            />

            {/* View Details Drawer */}
            <StoreDetailDrawer
                store={isDrawerOpen ? selectedStore : null}
                onClose={() => { setIsDrawerOpen(false); setSelectedStore(null); }}
            />
        </div>
    );
};

export default StoreList;