import { useState } from "react";
import { FaEllipsisV, FaStore } from "react-icons/fa";
import {
    useGetVendorsQuery,
    useApproveVendorMutation,
    useSuspendVendorMutation,
    useActivateVendorMutation,
} from "../../app/api/VendorSlices/VendorApi";

// ================= STATUS STYLE =================
const statusStyle = (status: string) => {
    switch (status) {
        case "active":
            return "bg-green-100 text-green-600";
        case "pending":
            return "bg-yellow-100 text-yellow-600";
        case "inactive":
        case "suspended":
            return "bg-red-100 text-red-600";
        default:
            return "bg-gray-100 text-gray-500";
    }
};

const kycStyle = (status: string) => {
    switch (status) {
        case "verified":
            return "bg-blue-100 text-blue-600";
        case "pending":
            return "bg-orange-100 text-orange-500";
        case "rejected":
            return "bg-red-100 text-red-600";
        default:
            return "bg-gray-100 text-gray-500";
    }
};

// ================= TYPES =================
interface Vendor {
    id: string; // Keeping as string but will convert to number when needed
    company_name: string;
    country_code: string;
    address?: {
        city?: string;
        line1?: string;
    };
    contact?: {
        email?: string | null;
        phone?: string | null;
    };
    status: string;
    kyc_status: string;
    plan?: {
        name?: string;
    };
    stores?: any[];
    created_at: string;
}

const VendorList = () => {
    const tdBase = "relative p-4 text-gray-600";
    const borderStyle = "border-b border-gray-100";
    const ITEMS_PER_PAGE = 8;

    const [page, setPage] = useState(1);
    const [openActionModal, setOpenActionModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState<string | null>(null); // Track loading state

    // ================= API =================
    const { data, isLoading, isError, refetch } = useGetVendorsQuery();
    const [approveVendor] = useApproveVendorMutation();
    const [suspendVendor] = useSuspendVendorMutation();
    const [activateVendor] = useActivateVendorMutation();

    const vendors: Vendor[] = data?.data || [];
    const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);
    const paginated = vendors.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    // Helper function to safely convert string to number
    const toNumberId = (id: string): number => {
        const num = Number(id);
        if (isNaN(num)) {
            throw new Error(`Invalid ID format: ${id}`);
        }
        return num;
    };

    // ================= HANDLERS =================
    const openModal = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        setOpenActionModal(true);
    };

    const closeModal = () => {
        setSelectedVendor(null);
        setOpenActionModal(false);
        setLoading(null);
    };

    const handleApprove = async () => {
        if (!selectedVendor) return;

        setLoading("approve");
        try {
            // Convert string id to number
            const numericId = toNumberId(selectedVendor.id);
            await approveVendor(numericId).unwrap();
            alert("Vendor approved successfully");
            await refetch();
            closeModal();
        } catch (error) {
            console.log("Approve error:", error);
            alert("Failed to approve vendor");
        } finally {
            setLoading(null);
        }
    };

    const handleSuspend = async () => {
        if (!selectedVendor) return;

        setLoading("suspend");
        try {
            // Convert string id to number
            const numericId = toNumberId(selectedVendor.id);
            await suspendVendor({
                id: numericId,
                data: {
                    reason: "Admin suspended vendor",
                },
            }).unwrap();
            alert("Vendor suspended successfully");
            await refetch();
            closeModal();
        } catch (error) {
            console.log("Suspend error:", error);
            alert("Failed to suspend vendor");
        } finally {
            setLoading(null);
        }
    };

    const handleActivate = async () => {
        if (!selectedVendor) return;

        setLoading("activate");
        try {
            // Convert string id to number
            const numericId = toNumberId(selectedVendor.id);
            await activateVendor(numericId).unwrap();
            alert("Vendor activated successfully");
            await refetch();
            closeModal();
        } catch (error) {
            console.log("Activate error:", error);
            alert("Failed to activate vendor");
        } finally {
            setLoading(null);
        }
    };

    // Helper function to safely format date
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return "Invalid date";
            }
            return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        } catch (error) {
            return "Invalid date";
        }
    };

    return (
        <div className="bg-white shadow-sm p-6 rounded-xl">
            {/* HEADER WITH CREATE BUTTON */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                    Vendor Management
                </h2>
                <button
                    onClick={() => {
                        /* Add navigation */
                    }}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white hover:opacity-90 transition-opacity"
                >
                    Create Vendor
                </button>
            </div>

            {/* TABLE */}
            <div className="rounded-t-3xl overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                        <tr>
                            <th className="p-4 text-left rounded-l-xl">Company Name</th>
                            <th className="p-4 text-left">Country</th>
                            <th className="p-4 text-left">City</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Plan</th>
                            <th className="p-4 text-left">Stores</th>
                            <th className="p-4 text-left">KYC</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Created</th>
                            <th className="p-4 text-center rounded-r-xl">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={10} className="text-center py-10">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500" />
                                        <span className="text-gray-500">
                                            Loading vendors...
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={10} className="text-center py-10 text-red-500">
                                    Error loading vendors. Please try again.
                                </td>
                            </tr>
                        ) : paginated.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-10 text-gray-400">
                                    No vendors found.
                                </td>
                            </tr>
                        ) : (
                            paginated.map((vendor, index) => (
                                <tr
                                    key={vendor.id}
                                    className={`bg-white hover:bg-gray-50 transition ${index !== paginated.length - 1 ? borderStyle : ""
                                        }`}
                                >
                                    <td
                                        className={`${tdBase} font-medium rounded-l-xl text-black`}
                                    >
                                        {vendor.company_name}
                                    </td>
                                    <td className={tdBase}>
                                        {vendor.country_code || "—"}
                                    </td>
                                    <td className={tdBase}>
                                        {vendor.address?.city || "—"}
                                    </td>
                                    <td className={tdBase}>
                                        {vendor.contact?.email || "—"}
                                    </td>
                                    <td className={tdBase}>
                                        {vendor.plan?.name || "—"}
                                    </td>
                                    <td className={tdBase}>
                                        <div className="flex items-center gap-1">
                                            <FaStore className="text-teal-400 text-xs" />
                                            {vendor.stores?.length || 0}
                                        </div>
                                    </td>
                                    <td className={tdBase}>
                                        <span
                                            className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${kycStyle(
                                                vendor.kyc_status
                                            )}`}
                                        >
                                            {vendor.kyc_status}
                                        </span>
                                    </td>
                                    <td className={tdBase}>
                                        <span
                                            className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${statusStyle(
                                                vendor.status
                                            )}`}
                                        >
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className={tdBase}>
                                        {formatDate(vendor.created_at)}
                                    </td>
                                    <td className="p-4 text-center rounded-r-xl">
                                        <button
                                            onClick={() => openModal(vendor)}
                                            className="text-gray-500 hover:text-black transition"
                                        >
                                            <FaEllipsisV />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && !isLoading && (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-600">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 transition"
                    >
                        ← Back
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded-md transition ${page === i + 1
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
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 transition"
                    >
                        Next →
                    </button>
                </div>
            )}

            {/* ACTION MODAL */}
            {openActionModal && selectedVendor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-[400px] rounded-xl bg-white shadow-xl relative transform transition-all">
                        <div className="relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-xl" />

                            <button
                                onClick={closeModal}
                                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
                            >
                                ✕
                            </button>

                            <h2 className="text-lg font-semibold text-center pt-6 pb-2">
                                Vendor Actions
                            </h2>
                            <p className="text-sm text-gray-500 text-center pb-4">
                                {selectedVendor.company_name}
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-teal-50 to-green-50 border border-teal-100">
                                <span className="text-sm font-medium text-gray-700">
                                    Current Status:
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${statusStyle(
                                        selectedVendor.status
                                    )}`}
                                >
                                    {selectedVendor.status}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleApprove}
                                    disabled={
                                        loading !== null ||
                                        selectedVendor.status === "active" ||
                                        selectedVendor.kyc_status === "verified"
                                    }
                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${loading === "approve"
                                            ? "bg-gray-100 cursor-wait"
                                            : selectedVendor.status === "active" ||
                                                selectedVendor.kyc_status === "verified"
                                                ? "bg-gray-100 cursor-not-allowed opacity-50"
                                                : "bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${loading === "approve"
                                                    ? "bg-gray-200"
                                                    : selectedVendor.status === "active" ||
                                                        selectedVendor.kyc_status === "verified"
                                                        ? "bg-gray-200"
                                                        : "bg-green-100"
                                                }`}
                                        >
                                            {loading === "approve" ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600" />
                                            ) : (
                                                <span className="text-lg">✓</span>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-semibold text-gray-800">
                                                Approve Vendor
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                Approve vendor for full access
                                            </p>
                                        </div>
                                    </div>
                                    {(selectedVendor.status === "active" ||
                                        selectedVendor.kyc_status === "verified") && (
                                            <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">
                                                Completed
                                            </span>
                                        )}
                                </button>

                                <button
                                    onClick={handleActivate}
                                    disabled={
                                        loading !== null || selectedVendor.status === "active"
                                    }
                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${loading === "activate"
                                            ? "bg-gray-100 cursor-wait"
                                            : selectedVendor.status === "active"
                                                ? "bg-gray-100 cursor-not-allowed opacity-50"
                                                : "bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${loading === "activate"
                                                    ? "bg-gray-200"
                                                    : selectedVendor.status === "active"
                                                        ? "bg-gray-200"
                                                        : "bg-blue-100"
                                                }`}
                                        >
                                            {loading === "activate" ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                                            ) : (
                                                <span className="text-lg">▶</span>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-semibold text-gray-800">
                                                Activate Vendor
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                Activate vendor for platform access
                                            </p>
                                        </div>
                                    </div>
                                    {selectedVendor.status === "active" && (
                                        <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded">
                                            Active
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={handleSuspend}
                                    disabled={
                                        loading !== null || selectedVendor.status === "suspended"
                                    }
                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${loading === "suspend"
                                            ? "bg-gray-100 cursor-wait"
                                            : selectedVendor.status === "suspended"
                                                ? "bg-gray-100 cursor-not-allowed opacity-50"
                                                : "bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 border border-red-200"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${loading === "suspend"
                                                    ? "bg-gray-200"
                                                    : selectedVendor.status === "suspended"
                                                        ? "bg-gray-200"
                                                        : "bg-red-100"
                                                }`}
                                        >
                                            {loading === "suspend" ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                                            ) : (
                                                <span className="text-lg">⛔</span>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-semibold text-gray-800">
                                                Suspend Vendor
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                Temporarily suspend vendor access
                                            </p>
                                        </div>
                                    </div>
                                    {selectedVendor.status === "suspended" && (
                                        <span className="text-xs bg-red-200 text-red-700 px-2 py-1 rounded">
                                            Suspended
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                            <button
                                onClick={closeModal}
                                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorList;