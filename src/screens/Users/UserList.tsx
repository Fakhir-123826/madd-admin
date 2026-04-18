import { useState } from "react";
import { FaEllipsisV, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useGetUsersQuery } from "../../app/api/UserSlices/UserApi";

// ============ TYPES ============
interface User {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    user_type: string;
    status: string;
    is_email_verified: boolean;
    is_phone_verified: boolean;
    is_kyc_verified: boolean;
    country_code: string;
    roles: string[];
    vendor: { company_name: string } | null;
    created_at: string;
}

// ============ STATUS STYLES ============
const statusStyle = (status: string) => {
    switch (status) {
        case "active":    return "bg-green-100 text-green-600";
        case "suspended": return "bg-red-100 text-red-600";
        case "pending":   return "bg-yellow-100 text-yellow-600";
        case "banned":    return "bg-gray-200 text-gray-600";
        default:          return "bg-gray-100 text-gray-500";
    }
};

const userTypeStyle = (type: string) => {
    switch (type) {
        case "super_admin": return "bg-purple-100 text-purple-600";
        case "vendor":      return "bg-blue-100 text-blue-600";
        case "customer":    return "bg-teal-100 text-teal-600";
        case "mlm_agent":   return "bg-orange-100 text-orange-500";
        default:            return "bg-gray-100 text-gray-500";
    }
};

// ============ COMPONENT ============
const UserList = () => {
    const tdBase =
        "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

    const ITEMS_PER_PAGE = 8;
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useGetUsersQuery({});

    const users: User[] = data?.data ?? [];
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const paginated = users.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="bg-white shadow-sm p-6 rounded-xl">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">User Management</h2>
                <div className="text-sm text-gray-400">
                    Total: <span className="font-semibold text-gray-600">{data?.meta?.total ?? 0}</span>
                </div>
            </div>

            {/* TABLE */}
            <div className="rounded-t-3xl overflow-x-auto">
                <table className="w-full text-sm border-separate border-spacing-y-3">
                    <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Phone</th>
                            <th className="p-4 text-left">Type</th>
                            <th className="p-4 text-left">Country</th>
                            <th className="p-4 text-left">Email Verified</th>
                            <th className="p-4 text-left">KYC</th>
                            <th className="p-4 text-left">Vendor</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Created</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* LOADER */}
                        {isLoading ? (
                            <tr>
                                <td colSpan={11} className="text-center py-10">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500" />
                                        <span className="text-gray-500">Loading users...</span>
                                    </div>
                                </td>
                            </tr>

                        ) : isError ? (
                            <tr>
                                <td colSpan={11} className="text-center py-10 text-red-500">
                                    Error loading users. Please try again.
                                </td>
                            </tr>

                        ) : paginated.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="text-center py-10 text-gray-400">
                                    No users found.
                                </td>
                            </tr>

                        ) : paginated.map((user) => (
                            <tr key={user.id} className="bg-white shadow-sm hover:shadow-md transition">

                                {/* Avatar + Name */}
                                <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=4F46E5&color=ffffff`}
                                            className="w-7 h-7 rounded-full"
                                            alt={user.full_name}
                                        />
                                        <span>{user.full_name}</span>
                                    </div>
                                </td>

                                <td className={tdBase}>{user.email}</td>

                                <td className={tdBase}>{user.phone ?? "—"}</td>

                                <td className={tdBase}>
                                    <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${userTypeStyle(user.user_type)}`}>
                                        {user.user_type.replace("_", " ")}
                                    </span>
                                </td>

                                <td className={tdBase}>{user.country_code ?? "—"}</td>

                                <td className={tdBase}>
                                    {user.is_email_verified
                                        ? <FaCheckCircle className="text-green-500" />
                                        : <FaTimesCircle className="text-red-400" />
                                    }
                                </td>

                                <td className={tdBase}>
                                    {user.is_kyc_verified
                                        ? <FaCheckCircle className="text-green-500" />
                                        : <FaTimesCircle className="text-red-400" />
                                    }
                                </td>

                                <td className={tdBase}>
                                    {user.vendor?.company_name ?? "—"}
                                </td>

                                <td className={tdBase}>
                                    <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${statusStyle(user.status)}`}>
                                        {user.status}
                                    </span>
                                </td>

                                <td className={tdBase}>
                                    {new Date(user.created_at).toLocaleDateString("en-GB", {
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

export default UserList;