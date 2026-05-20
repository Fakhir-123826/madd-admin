import React, { useState, useEffect, useRef } from "react";
import {
    FaStore,
    FaEye,
    FaEdit,
    FaTrash,
    FaPlay,
    FaStop,
    FaGlobe,
    FaLanguage,
    FaMoneyBillWave,
    FaSync,
    FaCheckCircle,
    FaTimesCircle,
    FaChartLine,
    FaEllipsisV,
} from "react-icons/fa";
import {
    FiShield,
    FiAlertCircle,
    FiUserCheck,
    FiMapPin,
    FiMail,
    FiPhone,
    FiCalendar,
    FiGlobe,
    FiServer,
    FiCheck,
    FiX,
    FiRefreshCw,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    useGetStoresQuery,
    useGetStoresByVendorQuery,
    useUpdateStoreMutation,
    useDeleteStoreMutation,
    useForceDeleteStoreMutation,
    useRestoreStoreMutation,
    useActivateStoreMutation,
    useDeactivateStoreMutation,
    useAddStoreDomainMutation,
    useGetStoreStatsQuery,
    useBulkStatusUpdateMutation,
    useSyncStoreMutation,
    useSyncStoresFromMagentoMutation,
} from "../../app/api/StoreSlices/StoreApi";

import { useGetVendorsQuery } from "../../app/api/VendorSlices/VendorApi";

import SearchableSelect from "../../component/SearchableSelect";
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
    id: number;
    uuid: string;
    name: string;
    company_name: string;
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
    magento_store_id?: number;
    magento_store_group_id?: number;
    sync_status?: "synced" | "pending" | "failed";
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
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "inactive":
            return "bg-gray-50 text-gray-600 border-gray-200";
        case "suspended":
            return "bg-yellow-50 text-yellow-700 border-yellow-200";
        case "maintenance":
            return "bg-orange-50 text-orange-700 border-orange-200";
        default:
            return "bg-gray-100 text-gray-600 border-gray-200";
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
    const [restoreStore, { isLoading: isRestoring }] = useRestoreStoreMutation();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showForceDeleteConfirm, setShowForceDeleteConfirm] = useState(false);
    const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

    const showMsg = (type: "success" | "error", msg: string) => {
        toast[type](msg);
    };

    const handleActivate = async () => {
        if (!store) return;
        try {
            await activateStore(store.uuid).unwrap();
            showMsg("success", `${store.store_name} has been activated`);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to activate");
        }
    };

    const handleDeactivate = async () => {
        if (!store) return;
        try {
            await deactivateStore(store.uuid).unwrap();
            showMsg("success", `${store.store_name} has been deactivated`);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to deactivate");
        }
    };

    const handleDelete = async () => {
        if (!store) return;
        try {
            await deleteStore(store.uuid).unwrap();
            showMsg("success", `${store.store_name} has been deleted`);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to delete");
        }
    };

    const handleForceDelete = async () => {
        if (!store) return;
        try {
            await forceDeleteStore(store.uuid).unwrap();
            showMsg("success", `${store.store_name} has been permanently deleted`);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to permanently delete");
        }
    };

    const handleRestore = async () => {
        if (!store) return;
        try {
            await restoreStore(store.uuid).unwrap();
            showMsg("success", `${store.store_name} has been restored`);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to restore");
        }
    };

    if (!isOpen || !store) return null;

    const isActive = store.status === "active";
    const isInactive = store.status === "inactive";
    const isSuspended = store.status === "suspended";
    const isMaintenance = store.status === "maintenance";
    const isDeleted = store.deleted_at;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl" />
                    <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Manage Store</h2>
                            <p className="text-sm text-gray-500 mt-0.5">{store.store_name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 mt-0.5 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="px-6 pt-4">
                        <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                            <span className="text-sm text-gray-500">Current Status</span>
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(
                                    store.status
                                )}`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {store.status_label || store.status}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 space-y-3">
                        {isDeleted ? (
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                                        <FiRefreshCw className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Restore Store</p>
                                        <p className="text-xs text-gray-500">Restore from trash</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowRestoreConfirm(true)}
                                    className="px-4 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition cursor-pointer"
                                >
                                    Restore
                                </button>
                            </div>
                        ) : (
                            <>
                                {(isInactive || isSuspended || isMaintenance) && (
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
                                        <button
                                            onClick={handleActivate}
                                            disabled={isActivating}
                                            className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition disabled:opacity-50 cursor-pointer"
                                        >
                                            {isActivating ? "..." : "Activate"}
                                        </button>
                                    </div>
                                )}

                                {isActive && (
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
                                        <button
                                            onClick={handleDeactivate}
                                            disabled={isDeactivating}
                                            className="px-4 py-1.5 rounded-lg bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition disabled:opacity-50 cursor-pointer"
                                        >
                                            {isDeactivating ? "..." : "Deactivate"}
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                                            <FiAlertCircle className="text-red-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">Move to Trash</p>
                                            <p className="text-xs text-gray-500">Soft delete (can restore)</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-red-100 rounded-xl border border-red-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-red-200 flex items-center justify-center">
                                            <FiAlertCircle className="text-red-700" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">Permanent Delete</p>
                                            <p className="text-xs text-gray-500">Cannot be undone</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowForceDeleteConfirm(true)}
                                        className="px-4 py-1.5 rounded-lg bg-red-700 text-white text-sm font-medium hover:bg-red-800 transition cursor-pointer"
                                    >
                                        Force Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Confirmation Modals */}
                    {(showDeleteConfirm || showForceDeleteConfirm || showRestoreConfirm) && (
                        <div className="px-6 pb-6">
                            <div
                                className={`p-4 rounded-xl border space-y-3 ${showForceDeleteConfirm
                                    ? "bg-red-100 border-red-300"
                                    : showRestoreConfirm
                                        ? "bg-blue-50 border-blue-200"
                                        : "bg-red-50 border-red-200"
                                    }`}
                            >
                                <p className="text-sm text-gray-700">
                                    {showForceDeleteConfirm
                                        ? `⚠️ PERMANENT ACTION: Are you sure you want to permanently delete ${store.store_name}? This action CANNOT be undone.`
                                        : showRestoreConfirm
                                            ? `Are you sure you want to restore ${store.store_name}?`
                                            : `Are you sure you want to delete ${store.store_name}? This store can be restored later.`}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteConfirm(false);
                                            setShowForceDeleteConfirm(false);
                                            setShowRestoreConfirm(false);
                                        }}
                                        className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (showDeleteConfirm) handleDelete();
                                            if (showForceDeleteConfirm) handleForceDelete();
                                            if (showRestoreConfirm) handleRestore();
                                        }}
                                        disabled={isDeleting || isForceDeleting || isRestoring}
                                        className={`flex-1 py-2 rounded-lg text-white text-sm font-medium transition disabled:opacity-50 cursor-pointer ${showForceDeleteConfirm
                                            ? "bg-red-700 hover:bg-red-800"
                                            : showRestoreConfirm
                                                ? "bg-blue-500 hover:bg-blue-600"
                                                : "bg-red-500 hover:bg-red-600"
                                            }`}
                                    >
                                        {isDeleting || isForceDeleting || isRestoring
                                            ? "..."
                                            : showForceDeleteConfirm
                                                ? "Confirm Force Delete"
                                                : showRestoreConfirm
                                                    ? "Confirm Restore"
                                                    : "Confirm Delete"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                        <button
                            onClick={onClose}
                            className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition cursor-pointer"
                        >
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
    onSync,
    isSyncing,
}: {
    onView: () => void;
    onEdit: () => void;
    onStatusManage: () => void;
    onSync: () => void;
    isSyncing: boolean;
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
            <button
                onClick={() => setOpen(!open)}
                className="text-gray-400 hover:text-gray-600 p-1 transition cursor-pointer"
            >
                <FaEllipsisV className="text-sm" />
            </button>
            {open && (
                <div className="absolute right-0 top-7 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 text-sm">
                    <button
                        onClick={() => {
                            onView();
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 cursor-pointer"
                    >
                        <FaEye className="inline mr-2 text-xs" /> View Details
                    </button>
                    <button
                        onClick={() => {
                            onStatusManage();
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-600 cursor-pointer"
                    >
                        <FiShield className="inline mr-2 text-xs" /> Manage Status
                    </button>
                    <button
                        onClick={() => {
                            onEdit();
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-teal-50 text-teal-700 cursor-pointer"
                    >
                        <FaEdit className="inline mr-2 text-xs" /> Edit
                    </button>
                    <button
                        onClick={() => {
                            onSync();
                            setOpen(false);
                        }}
                        disabled={isSyncing}
                        className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-indigo-600 cursor-pointer disabled:opacity-50"
                    >
                        <FaSync className={`inline mr-2 text-xs ${isSyncing ? "animate-spin" : ""}`} /> Sync
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
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Store Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                            <FaStore className="text-white text-2xl" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-800">{store.store_name}</p>
                            <p className="text-sm text-gray-500">{store.store_slug}</p>
                            <div className="flex gap-2 mt-2">
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(
                                        store.status
                                    )}`}
                                >
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

                    {/* Magento Sync Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FiServer className="text-blue-500" /> Magento Integration
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Magento Store ID:</span>
                                <span className="text-gray-700 font-medium">
                                    {store.magento_store_id || "—"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Magento Group ID:</span>
                                <span className="text-gray-700 font-medium">
                                    {store.magento_store_group_id || "—"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Sync Status:</span>
                                <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${store.sync_status === "synced"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : store.sync_status === "pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {store.sync_status === "synced" && <FiCheck className="text-xs" />}
                                    {store.sync_status === "pending" && <FiRefreshCw className="text-xs animate-spin" />}
                                    {store.sync_status || "Unknown"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Vendor Info */}
                    {store.vendor && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FiUserCheck className="text-blue-500" /> Vendor
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="font-medium text-gray-800">{store.vendor.company_name || store.vendor.name}</p>
                                <p className="text-xs text-gray-400">ID: {store.vendor.uuid}</p>
                            </div>
                        </div>
                    )}

                    {/* Domain & Subdomain */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FiGlobe className="text-blue-500" /> Domain Information
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-400 mb-1">Subdomain</p>
                                <p className="text-sm font-medium text-gray-700">
                                    {store.subdomain || "—"}
                                </p>
                            </div>
                            {store.domain && (
                                <>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs text-gray-400 mb-1">Custom Domain</p>
                                        <p className="text-sm font-medium text-blue-600">
                                            {store.domain.domain}
                                        </p>
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
                                            <span
                                                className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${sslStyle(
                                                    store.domain.ssl_status
                                                )}`}
                                            >
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
                            <FiGlobe className="text-blue-500" /> Localization
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <FaLanguage className="text-blue-500 mx-auto mb-1" />
                                <p className="text-xs text-gray-400">Language</p>
                                <p className="text-sm font-medium">{store.language?.name || "—"}</p>
                                <p className="text-xs text-gray-400">{store.language?.code}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <FaMoneyBillWave className="text-blue-500 mx-auto mb-1" />
                                <p className="text-xs text-gray-400">Currency</p>
                                <p className="text-sm font-medium">{store.currency?.code || "—"}</p>
                                <p className="text-xs text-gray-400">{store.currency?.symbol}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <FiMapPin className="text-blue-500 mx-auto mb-1" />
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
                                <FaChartLine className="text-blue-500" /> Statistics
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-400">Total Products</p>
                                    <p className="text-xl font-bold text-blue-600">
                                        {stats.products?.total || 0}
                                    </p>
                                    <p className="text-xs text-gray-500">Active: {stats.products?.active || 0}</p>
                                </div>
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-400">Total Orders</p>
                                    <p className="text-xl font-bold text-blue-600">
                                        {stats.orders?.total || 0}
                                    </p>
                                    <p className="text-xs text-gray-500">Completed: {stats.orders?.completed || 0}</p>
                                </div>
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-400">Total Revenue</p>
                                    <p className="text-xl font-bold text-blue-600">
                                        ${stats.revenue?.total || 0}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Last 30 days: ${stats.revenue?.last_30_days || 0}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-400">Average Rating</p>
                                    <p className="text-xl font-bold text-blue-600">
                                        {stats.ratings?.average || 0}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {stats.ratings?.total_reviews || 0} reviews
                                    </p>
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

// ─── Sync Modal ──────────────────────────────────────────────────────────────

const SyncStoreModal = ({
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
    const [syncStore, { isLoading: isSyncing }] = useSyncStoreMutation();
    const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
    const [syncMessage, setSyncMessage] = useState("");

    const handleSync = async () => {
        if (!store) return;

        setSyncStatus("syncing");
        setSyncMessage("Syncing store with Magento...");

        try {
            const result = await syncStore(store.uuid).unwrap();
            setSyncStatus("success");
            setSyncMessage(result.message || "Store synced successfully!");
            toast.success(`Store ${store.store_name} synced successfully`);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (error: any) {
            setSyncStatus("error");
            setSyncMessage(error?.data?.message || "Failed to sync store");
            toast.error(error?.data?.message || "Failed to sync store");
        }
    };

    if (!isOpen || !store) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl" />
                    <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Sync Store with Magento</h2>
                            <p className="text-sm text-gray-500 mt-0.5">{store.store_name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 mt-0.5 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="bg-blue-50 rounded-xl p-4">
                            <p className="text-sm text-gray-700">
                                This will fetch the latest store data from Magento and update the local database.
                                The process will:
                            </p>
                            <ul className="mt-2 text-sm text-gray-600 space-y-1 list-disc list-inside">
                                <li>Retrieve store configuration from Magento</li>
                                <li>Update local store records with Magento data</li>
                                <li>Merge existing data to prevent duplicates</li>
                                <li>Sync store groups and website assignments</li>
                            </ul>
                        </div>

                        {syncStatus !== "idle" && (
                            <div
                                className={`rounded-xl p-4 ${syncStatus === "syncing"
                                    ? "bg-yellow-50 border border-yellow-200"
                                    : syncStatus === "success"
                                        ? "bg-emerald-50 border border-emerald-200"
                                        : "bg-red-50 border border-red-200"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {syncStatus === "syncing" && (
                                        <FaSync className="text-yellow-600 animate-spin" />
                                    )}
                                    {syncStatus === "success" && (
                                        <FaCheckCircle className="text-emerald-600" />
                                    )}
                                    {syncStatus === "error" && (
                                        <FiAlertCircle className="text-red-600" />
                                    )}
                                    <p
                                        className={`text-sm font-medium ${syncStatus === "syncing"
                                            ? "text-yellow-700"
                                            : syncStatus === "success"
                                                ? "text-emerald-700"
                                                : "text-red-700"
                                            }`}
                                    >
                                        {syncMessage}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={isSyncing}
                                className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSync}
                                disabled={isSyncing || syncStatus === "success"}
                                className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                            >
                                {isSyncing ? (
                                    <>
                                        <FaSync className="animate-spin" />
                                        Syncing...
                                    </>
                                ) : (
                                    <>
                                        <FaSync />
                                        Sync Now
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const StoreList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all");
    const [selectedVendorUuid, setSelectedVendorUuid] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterCountry, setFilterCountry] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);

    // ✅ FIXED: Normalize vendors data from API
    const { data: vendorsResponse, isLoading: vendorsLoading, error: vendorsError } = useGetVendorsQuery();

    // Normalize vendors response - handle different response structures
    const getVendorsList = () => {
        if (!vendorsResponse) return [];

        // If it's an array, use it directly
        if (Array.isArray(vendorsResponse)) {
            return vendorsResponse;
        }

        // If it has data property
        if (vendorsResponse.data && Array.isArray(vendorsResponse.data)) {
            return vendorsResponse.data;
        }

        // If it has vendors property
        if (vendorsResponse.vendors && Array.isArray(vendorsResponse.vendors)) {
            return vendorsResponse.vendors;
        }

        return [];
    };

    const vendors = getVendorsList();

    // Replace the existing stores data extraction with this:
    const {
        data: storesResponse,
        isLoading: storesLoading,
        error: storesError,
        refetch
    } = useGetStoresByVendorQuery(
        selectedVendorUuid,
        { skip: !selectedVendorUuid }
    );
    // Normalize stores response - FIXED to handle your API structure
    const getStoresList = () => {
        if (!storesResponse) return [];

        // If storesResponse has data property with stores array
        if (storesResponse.data && storesResponse.data.stores) {
            return storesResponse.data.stores;
        }

        // If storesResponse has stores property directly
        if (storesResponse.stores && Array.isArray(storesResponse.stores)) {
            return storesResponse.stores;
        }

        // If storesResponse is an array
        if (Array.isArray(storesResponse)) {
            return storesResponse;
        }

        return [];
    };

    const stores: Store[] = getStoresList();

    // Extract vendor info from the response structure
    const getVendorInfo = () => {
        if (!storesResponse) return null;

        // If vendor info is in data.vendor
        if (storesResponse.data && storesResponse.data.vendor) {
            return storesResponse.data.vendor;
        }

        // If vendor info is directly in response
        if (storesResponse.vendor) {
            return storesResponse.vendor;
        }

        return null;
    };

    // Extract totals from the response structure
    const getTotalStores = () => {
        if (!storesResponse) return 0;

        // If total_stores is in data
        if (storesResponse.data && storesResponse.data.total_stores !== undefined) {
            return storesResponse.data.total_stores;
        }

        // If total_stores is directly in response
        if (storesResponse.total_stores !== undefined) {
            return storesResponse.total_stores;
        }

        return stores.length;
    };

    const getActiveStores = () => {
        if (!storesResponse) return 0;

        if (storesResponse.data && storesResponse.data.active_stores !== undefined) {
            return storesResponse.data.active_stores;
        }

        if (storesResponse.active_stores !== undefined) {
            return storesResponse.active_stores;
        }

        return stores.filter(s => s.status === 'active').length;
    };

    const getMaxStoresAllowed = () => {
        if (!storesResponse) return 10;

        if (storesResponse.data && storesResponse.data.max_stores_allowed !== undefined) {
            return storesResponse.data.max_stores_allowed;
        }

        if (storesResponse.max_stores_allowed !== undefined) {
            return storesResponse.max_stores_allowed;
        }

        return 10;
    };

    const vendorInfo = getVendorInfo();
    const totalStores = getTotalStores();
    const activeStores = getActiveStores();
    const maxStoresAllowed = getMaxStoresAllowed();

    const [syncStoresFromMagento, { isLoading: isSyncingFromMagento }] = useSyncStoresFromMagentoMutation();

    const showToast = (type: "success" | "error", msg: string) => {
        toast[type](msg);
    };

    const handleReset = () => {
        setFilterStatus("");
        setFilterCountry("");
        setSearch("");
        setSearchInput("");
        setPage(1);
    };

    // Handle sync from Magento
    const handleSyncFromMagento = async () => {
        if (!selectedVendorUuid) {
            toast.error('Please select a vendor first');
            return;
        }

        try {
            const result = await syncStoresFromMagento({ vendor_uuid: selectedVendorUuid }).unwrap();
            if (result.success) {
                toast.success(result.message || 'Stores synced successfully from Magento');
                refetch(); // Refresh the stores list
            } else {
                toast.error(result.message || 'Sync failed');
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to sync stores from Magento');
        }
    };

    // Derived values for filters
    const statuses = [...new Set(stores.map((s: Store) => s.status).filter(Boolean))];
    const countries = [...new Set(stores.map((s: Store) => s.country?.code).filter(Boolean))];

    // Filtering logic
    const filtered = stores.filter((store: Store) => {
        const matchStatus = !filterStatus || store.status === filterStatus;
        const matchCountry = !filterCountry || store.country?.code === filterCountry;
        const matchSearch =
            !search ||
            store.store_name?.toLowerCase().includes(search.toLowerCase()) ||
            store.store_slug?.toLowerCase().includes(search.toLowerCase()) ||
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
        {
            label: "Status",
            options: statuses,
            value: filterStatus,
            onChange: (v: string) => {
                setFilterStatus(v);
                setPage(1);
            },
        },
        {
            label: "Country",
            options: countries,
            value: filterCountry,
            onChange: (v: string) => {
                setFilterCountry(v);
                setPage(1);
            },
        },
    ];

    // Vendor options for dropdown
    const vendorOptions =
        vendors?.map((v: any) => ({
            value: v.uuid || v.id,
            label: v.company_name || v.name || v.business_name || "Unnamed Vendor",
        })) || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FaStore className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Store Management</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Manage stores, domains, and sync with Magento
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vendor Selection */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiUserCheck className="w-5 h-5 text-gray-500" />
                        Select Vendor
                    </h2>
                    {vendorsLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-blue-500" />
                            <span className="ml-2 text-gray-500">Loading vendors...</span>
                        </div>
                    ) : vendorsError ? (
                        <div className="text-red-500 text-center py-4">
                            Failed to load vendors. Please refresh the page.
                        </div>
                    ) : (
                        <SearchableSelect
                            options={vendorOptions}
                            value={selectedVendorUuid}
                            onChange={(value) => {
                                setSelectedVendorUuid(value);
                                setPage(1);
                                setActiveTab("all");
                                handleReset();
                            }}
                            placeholder="Select a vendor to view stores..."
                        />
                    )}
                </div>

                {selectedVendorUuid && (
                    <>
                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Stores</p>
                                        <p className="text-2xl font-bold text-gray-900">{totalStores}</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <FaStore className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    Limit: {maxStoresAllowed} stores
                                </p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Active Stores</p>
                                        <p className="text-2xl font-bold text-emerald-600">{activeStores}</p>
                                    </div>
                                    <div className="p-3 bg-emerald-100 rounded-lg">
                                        <FaPlay className="w-6 h-6 text-emerald-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Inactive Stores</p>
                                        <p className="text-2xl font-bold text-gray-600">
                                            {totalStores - activeStores}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-100 rounded-lg">
                                        <FaStop className="w-6 h-6 text-gray-600" />
                                    </div>
                                </div>
                            </div>

                            {/* 👇 REPLACE THE EXISTING VENDOR CARD WITH THIS */}
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Vendor</p>
                                        <p className="text-lg font-semibold text-gray-900 truncate">
                                            {vendorInfo?.company_name || vendorInfo?.name || "—"}
                                        </p>
                                        {vendorInfo?.contact_email && (
                                            <p className="text-xs text-gray-400 mt-1">{vendorInfo.contact_email}</p>
                                        )}
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <FiUserCheck className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Vendor Dropdown - Place BEFORE PageHeader */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Vendor
                                    </label>
                                    <SearchableSelect
                                        options={vendorOptions}
                                        value={selectedVendorUuid}
                                        onChange={(value) => {
                                            setSelectedVendorUuid(value);
                                            setPage(1);
                                            setActiveTab("all");
                                            handleReset();
                                        }}
                                        placeholder="Choose a vendor to view stores..."
                                        isLoading={vendorsLoading}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* PageHeader with Tabs and Filters */}
                        <PageHeader
                            title=""
                            addButtonLabel="Add New Store"
                            onAdd={() => navigate(`${ROUTES.CREATE_STORE}?vendor=${selectedVendorUuid}`)}
                            tabs={TABS}
                            activeTab={activeTab}
                            onTabChange={(tab) => {
                                setActiveTab(tab);
                                setPage(1);
                            }}
                            filters={filters}
                            searchValue={searchInput}
                            onSearchChange={setSearchInput}
                            onSearchSubmit={() => {
                                setSearch(searchInput);
                                setPage(1);
                            }}
                            onResetFilters={handleReset}
                            searchPlaceholder="Search by store name, slug, subdomain..."




                        />

                        {/* Sync Button */}
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={handleSyncFromMagento}
                                disabled={isSyncingFromMagento || !selectedVendorUuid}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {isSyncingFromMagento ? (
                                    <FaSync className="w-4 h-4 animate-spin" />
                                ) : (
                                    <FaSync className="w-4 h-4" />
                                )}
                                Sync from Magento
                            </button>
                        </div>

                        {/* Store Table */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Store
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Country
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Currency
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Language
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Domain
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
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {storesLoading ? (
                                            <tr>
                                                <td colSpan={9} className="px-6 py-12 text-center">
                                                    <div className="flex items-center justify-center gap-3 text-gray-400">
                                                        <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-blue-500" />
                                                        <span className="text-sm">Loading stores...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : storesError ? (
                                            <tr>
                                                <td colSpan={9} className="px-6 py-12 text-center text-red-400 text-sm">
                                                    Error loading stores. Please try again.
                                                </td>
                                            </tr>
                                        ) : paginated.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="px-6 py-12 text-center text-gray-400 text-sm">
                                                    No stores found for this vendor.
                                                </td>
                                            </tr>
                                        ) : (
                                            paginated.map((store: Store) => (
                                                <tr key={store.uuid} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                                                <FaStore className="text-white text-sm" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900 text-sm">
                                                                    {store.store_name}
                                                                </p>
                                                                <p className="text-xs text-gray-500">{store.subdomain}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {store.country?.name || "—"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {store.currency?.code || "—"}
                                                        {store.currency?.symbol ? ` (${store.currency.symbol})` : ""}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {store.language?.name || "—"}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {store.domain?.domain ? (
                                                            <div>
                                                                <p className="text-sm text-blue-600">{store.domain.domain}</p>
                                                                <div className="flex gap-1 mt-1">
                                                                    {store.domain.dns_verified ? (
                                                                        <FaCheckCircle className="text-emerald-500 text-xs" title="DNS Verified" />
                                                                    ) : (
                                                                        <FaTimesCircle className="text-red-400 text-xs" title="DNS Not Verified" />
                                                                    )}
                                                                    <span
                                                                        className={`text-xs px-1.5 py-0.5 rounded ${sslStyle(
                                                                            store.domain.ssl_status
                                                                        )}`}
                                                                    >
                                                                        {store.domain.ssl_status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            "—"
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(
                                                                store.status
                                                            )}`}
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                            {store.status_label || store.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${store.sync_status === "synced"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : store.sync_status === "pending"
                                                                    ? "bg-yellow-100 text-yellow-700"
                                                                    : "bg-gray-100 text-gray-600"
                                                                }`}
                                                        >
                                                            {store.sync_status === "synced" && <FiCheck className="text-xs" />}
                                                            {store.sync_status === "pending" && (
                                                                <FaSync className="text-xs animate-spin" />
                                                            )}
                                                            {store.sync_status || "Unknown"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {fmtDate(store.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <RowMenu
                                                            onView={() => {
                                                                setSelectedStore(store);
                                                                setIsDrawerOpen(true);
                                                            }}
                                                            onEdit={() => {
                                                                setSelectedStore(store);
                                                                setIsEditModalOpen(true);
                                                            }}
                                                            onStatusManage={() => {
                                                                setSelectedStore(store);
                                                                setIsStatusModalOpen(true);
                                                            }}
                                                            onSync={() => {
                                                                setSelectedStore(store);
                                                                setIsSyncModalOpen(true);
                                                            }}
                                                            isSyncing={store.sync_status === "pending"}
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
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
                                        {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} stores
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPage(page - 1)}
                                            disabled={page === 1}
                                            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPage(page + 1)}
                                            disabled={page === totalPages}
                                            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            <StatusManagementModal
                isOpen={isStatusModalOpen}
                onClose={() => {
                    setIsStatusModalOpen(false);
                    setSelectedStore(null);
                }}
                store={selectedStore}
                onSuccess={refetch}
            />

            <SyncStoreModal
                isOpen={isSyncModalOpen}
                onClose={() => {
                    setIsSyncModalOpen(false);
                    setSelectedStore(null);
                }}
                store={selectedStore}
                onSuccess={refetch}
            />

            <StoreDetailDrawer
                store={isDrawerOpen ? selectedStore : null}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setSelectedStore(null);
                }}
            />
        </div>
    );
};

export default StoreList;