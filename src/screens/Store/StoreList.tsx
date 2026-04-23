import { FaEllipsisV, FaCheckCircle, FaTimesCircle, FaGlobe, FaEye, FaEdit, FaTrash, FaPowerOff, FaPlay, FaStop } from "react-icons/fa";
import AddButton from "../../component/AddButton";
import Searchbar from "../../component/Searchbar";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    useGetStoresQuery,
    useDeleteStoreMutation,
    useActivateStoreMutation,
    useDeactivateStoreMutation,
} from "../../app/api/StoreSlices/StoreApi";
import { ROUTES } from "../../router";

// ============ TYPES ============
interface Store {
    id: number;
    uuid: string;
    store_name: string;
    store_slug: string;
    country: { code: string; name: string };
    language: { code: string; name: string };
    currency: { code: string; symbol: string };
    status: string;
    status_label: string;
    is_demo: boolean;
    subdomain: string;
    has_custom_domain: boolean;
    domain: {
        domain: string;
        is_primary: boolean;
        dns_verified: boolean;
        ssl_status: string;
    } | null;
    vendor: { id: string; name: string; slug: string } | null;
    created_at: string;
}

// ============ STATUS STYLE ============
const statusStyle = (status: string) => {
    switch (status) {
        case "active":      return "bg-green-100 text-green-600";
        case "inactive":    return "bg-red-100 text-red-600";
        case "suspended":   return "bg-purple-100 text-purple-600";
        case "maintenance": return "bg-yellow-100 text-yellow-600";
        default:            return "bg-gray-100 text-gray-500";
    }
};

const sslStyle = (status: string) => {
    switch (status) {
        case "active":  return "bg-green-100 text-green-600";
        case "pending": return "bg-yellow-100 text-yellow-600";
        case "failed":  return "bg-red-100 text-red-600";
        default:        return "bg-gray-100 text-gray-500";
    }
};

// ============ ACTION MENU COMPONENT ============
const ActionMenu = ({
    store,
    onView,
    onEdit,
    onDelete,
    onActivate,
    onDeactivate,
}: {
    store: Store;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onActivate: () => void;
    onDeactivate: () => void;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                title="Actions"
            >
                <FaEllipsisV className="text-sm" />
            </button>

            {open && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    
                    {/* Menu */}
                    <div className="absolute right-0 top-6 z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 text-sm">
                        <button
                            onClick={() => {
                                onView();
                                setOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 cursor-pointer flex items-center gap-2"
                        >
                            <FaEye className="text-xs" /> View Details
                        </button>
                        
                        <button
                            onClick={() => {
                                onEdit();
                                setOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-teal-50 text-teal-700 cursor-pointer flex items-center gap-2"
                        >
                            <FaEdit className="text-xs" /> Edit
                        </button>

                        {store.status === "active" ? (
                            <button
                                onClick={() => {
                                    onDeactivate();
                                    setOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-yellow-50 text-yellow-600 cursor-pointer flex items-center gap-2"
                            >
                                <FaStop className="text-xs" /> Deactivate
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    onActivate();
                                    setOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-green-50 text-green-600 cursor-pointer flex items-center gap-2"
                            >
                                <FaPlay className="text-xs" /> Activate
                            </button>
                        )}

                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                            onClick={() => {
                                onDelete();
                                setOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer flex items-center gap-2"
                        >
                            <FaTrash className="text-xs" /> Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

// ============ DELETE CONFIRMATION MODAL ============
const DeleteModal = ({
    isOpen,
    onClose,
    storeName,
    onConfirm,
    isDeleting,
}: {
    isOpen: boolean;
    onClose: () => void;
    storeName: string;
    onConfirm: () => void;
    isDeleting: boolean;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-[400px] rounded-xl bg-white shadow-xl relative transform transition-all">
                <div className="relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-500 rounded-t-xl" />
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                    <div className="text-center pt-8 pb-4">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <FaTrash className="text-red-500 text-2xl" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Delete Store</h2>
                        <p className="text-sm text-gray-500 mt-2">
                            Are you sure you want to delete <span className="font-medium text-gray-700">{storeName}</span>?
                            <br />
                            This action cannot be undone.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 p-6 pt-0">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                Deleting...
                            </>
                        ) : (
                            "Yes, Delete"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============ TOAST NOTIFICATION ============
const Toast = ({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
            ${type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
        >
            <span>{type === "success" ? "✓" : "✕"}</span>
            {message}
        </div>
    );
};

// ============ MAIN COMPONENT ============
const StoreList = () => {
    const tdBase =
        "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

    const ITEMS_PER_PAGE = 8;
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    
    // Modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    const { data, isLoading, isError, refetch } = useGetStoresQuery({});
    const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();
    const [activateStore, { isLoading: isActivating }] = useActivateStoreMutation();
    const [deactivateStore, { isLoading: isDeactivating }] = useDeactivateStoreMutation();

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
    };

    const stores: Store[] = data?.data ?? [];
    
    // Filter stores by search term
    const filteredStores = stores.filter((store) =>
        store.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.subdomain?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const totalPages = Math.ceil(filteredStores.length / ITEMS_PER_PAGE);
    const paginated = filteredStores.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    // Handlers
    const handleViewDetails = (store: Store) => {
        navigate(`/store/${store.uuid}`);
    };

    const handleEdit = (store: Store) => {
        navigate(`ROUTES.EDIT_STORE(store.id)`);
    };

    const handleDeleteClick = (store: Store) => {
        setSelectedStore(store);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedStore) return;
        try {
            await deleteStore(selectedStore.id).unwrap();
            showToast(`${selectedStore.store_name} deleted successfully`, "success");
            refetch();
            setDeleteModalOpen(false);
            setSelectedStore(null);
        } catch (error: any) {
            showToast(error?.data?.message || "Failed to delete store", "error");
        }
    };

    const handleActivate = async (store: Store) => {
        try {
            await activateStore(store.id).unwrap();
            showToast(`${store.store_name} activated successfully`, "success");
            refetch();
        } catch (error: any) {
            showToast(error?.data?.message || "Failed to activate store", "error");
        }
    };

    const handleDeactivate = async (store: Store) => {
        try {
            await deactivateStore(store.id).unwrap();
            showToast(`${store.store_name} deactivated successfully`, "success");
            refetch();
        } catch (error: any) {
            showToast(error?.data?.message || "Failed to deactivate store", "error");
        }
    };

    // Reset page when search changes
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setPage(1);
    };

    return (
        <div className="bg-white shadow-sm p-6 rounded-xl">
            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Stores Management</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Total: <span className="font-semibold text-gray-600">{data?.meta?.total ?? 0}</span></span>
                    <span>Active: <span className="font-semibold text-green-600">{data?.meta?.active ?? 0}</span></span>
                    <span>Inactive: <span className="font-semibold text-red-500">{data?.meta?.inactive ?? 0}</span></span>
                    <AddButton
                        label="Add New Store"
                        type="button"
                        onClick={() => navigate(ROUTES.CREATE_STORE)}
                    />
                </div>
            </div>

            {/* TABS */}
            <div className="flex gap-6 border-b border-gray-200 mb-4">
                <button
                    onClick={() => navigate('/storeList')}
                    className={`pb-2 transition-colors ${location.pathname === '/storeList'
                        ? 'text-teal-600 border-b-2 border-teal-500 font-medium'
                        : 'text-gray-500 hover:text-teal-600'
                    }`}
                >
                    View Data in List
                </button>
                <button
                    onClick={() => navigate('/storeCardList')}
                    className={`pb-2 transition-colors ${location.pathname === '/storeCardList'
                        ? 'text-teal-600 border-b-2 border-teal-500 font-medium'
                        : 'text-gray-500 hover:text-teal-600'
                    }`}
                >
                    View Data in Cards
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by store name, vendor or subdomain..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
            </div>

            {/* TABLE */}
            <div className="rounded-t-3xl overflow-x-auto mt-4">
                <table className="w-full text-sm border-separate border-spacing-y-2">
                    <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                        <tr>
                            <th className="p-4 text-left rounded-l-xl">Store Name</th>
                            <th className="p-4 text-left">Vendor</th>
                            <th className="p-4 text-left">Country</th>
                            <th className="p-4 text-left">Currency</th>
                            <th className="p-4 text-left">Language</th>
                            <th className="p-4 text-left">Domain</th>
                            <th className="p-4 text-left">DNS</th>
                            <th className="p-4 text-left">SSL</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Created</th>
                            <th className="p-4 text-center rounded-r-xl">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* LOADER */}
                        {isLoading ? (
                            <tr>
                                <td colSpan={11} className="text-center py-10">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500" />
                                        <span className="text-gray-500">Loading stores...</span>
                                    </div>
                                </td>
                            </tr>

                        ) : isError ? (
                            <tr>
                                <td colSpan={11} className="text-center py-10 text-red-500">
                                    Error loading stores. Please try again.
                                </td>
                            </tr>

                        ) : paginated.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="text-center py-10 text-gray-400">
                                    {searchTerm ? "No stores match your search." : "No stores found."}
                                </td>
                            </tr>

                        ) : paginated.map((store) => (
                            <tr key={store.uuid} className="bg-white shadow-sm hover:shadow-md transition">
                                {/* Store Name */}
                                <td className={`${tdBase} font-medium text-black rounded-l-xl`}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center">
                                            <FaGlobe className="text-teal-500 text-sm" />
                                        </div>
                                        <div>
                                            <p>{store.store_name}</p>
                                            <p className="text-xs text-gray-400">{store.subdomain}</p>
                                        </div>
                                    </div>
                                </td>

                                <td className={tdBase}>
                                    {store.vendor?.name ?? "—"}
                                </td>

                                <td className={tdBase}>
                                    <div>
                                        <p>{store.country?.name ?? "—"}</p>
                                        <p className="text-xs text-gray-400">{store.country?.code}</p>
                                    </div>
                                </td>

                                <td className={tdBase}>
                                    {store.currency?.symbol} {store.currency?.code}
                                </td>

                                <td className={tdBase}>
                                    {store.language?.name ?? "—"}
                                </td>

                                <td className={tdBase}>
                                    {store.domain?.domain
                                        ? <span className="text-xs text-blue-500">{store.domain.domain}</span>
                                        : "—"
                                    }
                                </td>

                                {/* DNS */}
                                <td className={tdBase}>
                                    {store.domain?.dns_verified
                                        ? <FaCheckCircle className="text-green-500" title="DNS Verified" />
                                        : <FaTimesCircle className="text-red-400" title="DNS Not Verified" />
                                    }
                                </td>

                                {/* SSL */}
                                <td className={tdBase}>
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${sslStyle(store.domain?.ssl_status ?? "")}`}>
                                        {store.domain?.ssl_status ?? "—"}
                                    </span>
                                </td>

                                {/* Status */}
                                <td className={tdBase}>
                                    <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${statusStyle(store.status)}`}>
                                        {store.status_label ?? store.status}
                                    </span>
                                </td>

                                <td className={tdBase}>
                                    {new Date(store.created_at).toLocaleDateString("en-GB", {
                                        day: "2-digit", month: "short", year: "numeric"
                                    })}
                                </td>

                                {/* ACTION BUTTON */}
                                <td className="relative p-4 text-center rounded-r-xl">
                                    <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                                    <ActionMenu
                                        store={store}
                                        onView={() => handleViewDetails(store)}
                                        onEdit={() => handleEdit(store)}
                                        onDelete={() => handleDeleteClick(store)}
                                        onActivate={() => handleActivate(store)}
                                        onDeactivate={() => handleDeactivate(store)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-600">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
                    >
                        ← Back
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded-md ${page === i + 1
                                ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                                : "hover:bg-gray-100"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
                    >
                        Next →
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setSelectedStore(null);
                }}
                storeName={selectedStore?.store_name || ""}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default StoreList;