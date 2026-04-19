import { useState } from "react";
import { FaEllipsisV, FaStore } from "react-icons/fa";
import {
    useGetVendorsQuery,
    useApproveVendorMutation,
    useSuspendVendorMutation,
    useActivateVendorMutation,
} from "../../app/api/VendorSlices/VendorApi";

// ============ STATUS STYLE ============
const statusStyle = (status: string) => {
    switch (status) {
        case "active": return "bg-green-100 text-green-600";
        case "pending": return "bg-yellow-100 text-yellow-600";
        case "inactive":
        case "suspended": return "bg-red-100 text-red-600";
        default: return "bg-gray-100 text-gray-500";
    }
};

const kycStyle = (status: string) => {
    switch (status) {
        case "verified": return "bg-blue-100 text-blue-600";
        case "pending": return "bg-orange-100 text-orange-500";
        case "rejected": return "bg-red-100 text-red-600";
        default: return "bg-gray-100 text-gray-500";
    }
};

// ============ TYPES ============
interface Vendor {
    id: number;  // This is the numeric ID from database
    uuid: string;  // This is the UUID string
    company_name: string;
    country_code: string;
    address?: { city?: string; line1?: string };
    contact?: { email?: string | null; phone?: string | null };
    status: string;
    kyc_status: string;
    plan?: { name?: string };
    stores?: any[];
    created_at: string;
}

// ============ COMPONENT ============
const VendorList = () => {
    const tdBase = "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

    const ITEMS_PER_PAGE = 8;
    const [page, setPage] = useState(1);
    const [openActionModal, setOpenActionModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState<string | null>(null);

    // ================= API =================
    const { data, isLoading, isError, refetch } = useGetVendorsQuery();
    const [approveVendor] = useApproveVendorMutation();
    const [suspendVendor] = useSuspendVendorMutation();
    const [activateVendor] = useActivateVendorMutation();
    // Debug: Log the actual IDs from your database
    console.log("=== VENDORS DATA ===");
    console.log("Full response:", data);
    console.log("Vendors array:", data?.data);
    console.log("First vendor ID:", data?.data?.[0]?.id);
    console.log("First vendor company:", data?.data?.[0]?.company_name);
    console.log("All vendor IDs:", data?.data?.map((v: any) => v.id));

    const vendors: Vendor[] = data?.data ?? [];
    const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);
    const paginated = vendors.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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

    // Update your handlers to pass string IDs directly

    // Update your handlers to use the numeric ID
    const handleApprove = async () => {
        if (!selectedVendor) return;
        setLoading("approve");
        try {
            // Use the numeric ID, not the UUID
            await approveVendor(selectedVendor.id).unwrap();
            await refetch();
            closeModal();
        } catch (error) {
            console.error("Approve error:", error);
        } finally {
            setLoading(null);
        }
    };

    const handleSuspend = async () => {
        if (!selectedVendor) return;
        setLoading("suspend");
        try {
            await suspendVendor({
                id: selectedVendor.id, // Use numeric ID
                data: { reason: "Admin suspended vendor" },
            }).unwrap();
            await refetch();
            closeModal();
        } catch (error) {
            console.error("Suspend error:", error);
        } finally {
            setLoading(null);
        }
    };

    const handleActivate = async () => {
        if (!selectedVendor) return;
        setLoading("activate");
        try {
            await activateVendor(selectedVendor.id).unwrap(); // Use numeric ID
            await refetch();
            closeModal();
        } catch (error) {
            console.error("Activate error:", error);
        } finally {
            setLoading(null);
        }
    };
    // Helper function to safely format date
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid date";
            return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        } catch {
            return "Invalid date";
        }
    };

    return (
        <div className="bg-white shadow-sm p-6 rounded-xl">
            {/* HEADER WITH CREATE BUTTON */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Vendor Management</h2>
                <button
                    onClick={() => {/* Add navigation */ }}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white hover:opacity-90 transition-opacity"
                >
                    Create Vendor
                </button>
            </div>

            {/* TABLE - Keep the same as before */}
            <div className="rounded-t-3xl overflow-x-auto">
                <table className="w-full text-sm border-separate border-spacing-y-3">
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
                                        <span className="text-gray-500">Loading vendors...</span>
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
                            paginated.map((vendor) => (
                                <tr key={vendor.id} className="bg-white shadow-sm hover:shadow-md transition">
                                    <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                                        {vendor.company_name}
                                    </td>
                                    <td className={tdBase}>{vendor.country_code ?? "—"}</td>
                                    <td className={tdBase}>{vendor.address?.city ?? "—"}</td>
                                    <td className={tdBase}>{vendor.contact?.email ?? "—"}</td>
                                    <td className={tdBase}>{vendor.plan?.name ?? "—"}</td>
                                    <td className={tdBase}>
                                        <div className="flex items-center gap-1">
                                            <FaStore className="text-teal-400 text-xs" />
                                            {vendor.stores?.length ?? 0}
                                        </div>
                                    </td>
                                    <td className={tdBase}>
                                        <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${kycStyle(vendor.kyc_status)}`}>
                                            {vendor.kyc_status}
                                        </span>
                                    </td>
                                    <td className={tdBase}>
                                        <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${statusStyle(vendor.status)}`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className={tdBase}>{formatDate(vendor.created_at)}</td>
                                    <td className="relative p-4 rounded-r-xl text-right">
                                        <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                                        <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                                        <FaEllipsisV
                                            onClick={() => openModal(vendor)}
                                            className="relative text-gray-400 cursor-pointer hover:text-gray-600"
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION - Keep the same */}
            {totalPages > 1 && !isLoading && (
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

            {/* ACTION MODAL - Keep the same */}
            {openActionModal && selectedVendor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-[500px] rounded-xl bg-white shadow-xl relative transform transition-all">
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
                            {/* Current Status Badge */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-teal-50 to-green-50 border border-teal-100">
                                <span className="text-sm font-medium text-gray-700">Current Status:</span>
                                <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${statusStyle(selectedVendor.status)}`}>
                                    {selectedVendor.status}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {/* Approve Button - Static */}
                                <button
                                    onClick={handleApprove}
                                    disabled={loading === "approve"}
                                    className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 transition-all disabled:opacity-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                            {loading === "approve" ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                            ) : (
                                                <span className="text-lg">✓</span>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-semibold text-gray-800">Approve Vendor</h3>
                                            <p className="text-xs text-gray-500">Approve vendor for full access</p>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">
                                        {loading === "approve" ? "Processing..." : "Click to Approve"}
                                    </span>
                                </button>

                                {/* Activate Button - Static */}
                                <button
                                    onClick={handleActivate}
                                    disabled={loading === "activate"}
                                    className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 transition-all disabled:opacity-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            {loading === "activate" ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            ) : (
                                                <span className="text-lg">▶</span>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-semibold text-gray-800">Activate Vendor</h3>
                                            <p className="text-xs text-gray-500">Activate vendor for platform access</p>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded">
                                        {loading === "activate" ? "Processing..." : "Click to Activate"}
                                    </span>
                                </button>

                                {/* Suspend Button - Static */}
                                <button
                                    onClick={handleSuspend}
                                    disabled={loading === "suspend"}
                                    className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 border border-red-200 transition-all disabled:opacity-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                            {loading === "suspend" ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                            ) : (
                                                <span className="text-lg">⛔</span>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-semibold text-gray-800">Suspend Vendor</h3>
                                            <p className="text-xs text-gray-500">Temporarily suspend vendor access</p>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-red-200 text-red-700 px-2 py-1 rounded">
                                        {loading === "suspend" ? "Processing..." : "Click to Suspend"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                            <button
                                onClick={closeModal}
                                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
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

export default VendorList;