import { FaEllipsisV, FaCheckCircle, FaTimesCircle, FaGlobe } from "react-icons/fa";
import AddButton from "../../component/AddButton";
import Searchbar from "../../component/Searchbar";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetStoresQuery } from "../../app/api/StoreSlices/StoreApi";

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

// ============ COMPONENT ============
const StoreList = () => {
    const tdBase =
        "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

    const ITEMS_PER_PAGE = 8;
    const [page, setPage] = useState(1);

    const navigate = useNavigate();
    const location = useLocation();

    const { data, isLoading, isError } = useGetStoresQuery({});

    const stores: Store[] = data?.data ?? [];
    const totalPages = Math.ceil(stores.length / ITEMS_PER_PAGE);
    const paginated = stores.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="bg-white shadow-sm p-6">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Stores Management 123</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Total: <span className="font-semibold text-gray-600">{data?.meta?.total ?? 0}</span></span>
                    <span>Active: <span className="font-semibold text-green-600">{data?.meta?.active ?? 0}</span></span>
                    <span>Inactive: <span className="font-semibold text-red-500">{data?.meta?.inactive ?? 0}</span></span>
                    <AddButton
                        label="Add New Store"
                        type="button"
                        onClick={() => navigate("/CreateStore")}
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

            <Searchbar />

            {/* TABLE */}
            <div className="rounded-t-3xl overflow-x-auto mt-4">
                <table className="w-full text-sm border-separate border-spacing-y-2">
                    <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                        <tr>
                            <th className="p-4 text-left">Store Name</th>
                            <th className="p-4 text-left">Vendor</th>
                            <th className="p-4 text-left">Country</th>
                            <th className="p-4 text-left">Currency</th>
                            <th className="p-4 text-left">Language</th>
                            <th className="p-4 text-left">Domain</th>
                            <th className="p-4 text-left">DNS</th>
                            <th className="p-4 text-left">SSL</th>
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
                                    No stores found.
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
                                        ? <FaCheckCircle className="text-green-500" />
                                        : <FaTimesCircle className="text-red-400" />
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

                                {/* ACTION */}
                                <td className="relative p-4 text-right rounded-r-xl">
                                    <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                                    <FaEllipsisV
                                        onClick={() => navigate("/store")}
                                        className="relative text-gray-400 cursor-pointer hover:text-gray-600"
                                    />
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
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
        </div>
    );
};

export default StoreList;