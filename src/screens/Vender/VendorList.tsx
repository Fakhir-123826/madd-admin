import { useState } from "react";
import { FaEllipsisV, FaStore } from "react-icons/fa";
import { useGetVendorsQuery } from "../../app/api/VendorSlices/VendorApi";

// ============ STATUS STYLE ============
const statusStyle = (status: string) => {
    switch (status) {
        case "active":   return "bg-green-100 text-green-600";
        case "pending":  return "bg-yellow-100 text-yellow-600";
        case "inactive": return "bg-red-100 text-red-600";
        default:         return "bg-gray-100 text-gray-500";
    }
};

const kycStyle = (status: string) => {
    switch (status) {
        case "verified":  return "bg-blue-100 text-blue-600";
        case "pending":   return "bg-orange-100 text-orange-500";
        case "rejected":  return "bg-red-100 text-red-600";
        default:          return "bg-gray-100 text-gray-500";
    }
};

// ============ TYPES ============
interface Vendor {
    id: string;
    company_name: string;
    country_code: string;
    address: { city: string; line1: string };
    contact: { email: string | null; phone: string | null };
    status: string;
    kyc_status: string;
    plan: { name: string };
    stores: any[];
    created_at: string;
}

// ============ COMPONENT ============
const VendorList = () => {
    const tdBase =
        "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

    const ITEMS_PER_PAGE = 8;
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useGetVendorsQuery({});

    const vendors: Vendor[] = data?.data ?? [];
    const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);
    const paginated = vendors.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="bg-white shadow-sm p-6 rounded-xl">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Vendor Management</h2>
            </div>

            {/* TABLE */}
            <div className="rounded-t-3xl overflow-x-auto">
                <table className="w-full text-sm border-separate border-spacing-y-3">
                    <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                        <tr>
                            <th className="p-4 text-left">Company Name</th>
                            <th className="p-4 text-left">Country</th>
                            <th className="p-4 text-left">City</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Plan</th>
                            <th className="p-4 text-left">Stores</th>
                            <th className="p-4 text-left">KYC</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Created</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* LOADER */}
                        {isLoading ? (
                            <tr>
                                <td colSpan={10} className="text-center py-10">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500" />
                                        <span className="text-gray-500">Loading vendors...</span>
                                    </div>
                                </td>
                            </tr>

                        // ERROR
                        ) : isError ? (
                            <tr>
                                <td colSpan={10} className="text-center py-10 text-red-500">
                                    Error loading vendors. Please try again.
                                </td>
                            </tr>

                        // EMPTY
                        ) : paginated.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-10 text-gray-400">
                                    No vendors found.
                                </td>
                            </tr>

                        // DATA
                        ) : paginated.map((vendor) => (
                            <tr key={vendor.id} className="bg-white shadow-sm hover:shadow-md transition">

                                <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                                    {vendor.company_name}
                                </td>

                                <td className={tdBase}>
                                    {vendor.country_code ?? "—"}
                                </td>

                                <td className={tdBase}>
                                    {vendor.address?.city ?? "—"}
                                </td>

                                <td className={tdBase}>
                                    {vendor.contact?.email ?? "—"}
                                </td>

                                <td className={tdBase}>
                                    {vendor.plan?.name ?? "—"}
                                </td>

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

                                <td className={tdBase}>
                                    {new Date(vendor.created_at).toLocaleDateString("en-GB", {
                                        day: "2-digit", month: "short", year: "numeric"
                                    })}
                                </td>

                                {/* ACTION */}
                                <td className="relative p-4 rounded-r-xl text-right">
                                    <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                                    <FaEllipsisV className="relative text-gray-400 cursor-pointer hover:text-gray-600" />
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
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
        </div>
    );
};

export default VendorList;