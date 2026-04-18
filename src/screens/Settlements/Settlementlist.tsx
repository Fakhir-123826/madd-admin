import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaEllipsisV, FaCheckCircle, FaTimesCircle, FaMoneyBillWave,
    FaHourglassHalf, FaExclamationTriangle, FaPlus, FaSync, FaSearch,
} from "react-icons/fa";
import {
    useGetSettlementsQuery,
    useApproveSettlementMutation,
    type Settlement,
    type SettlementStatus,
} from "../../app/api/SettlementSlices/SettlementApi";
import { router } from "../../router";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_TABS: { label: string; value: SettlementStatus | "" }[] = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Paid", value: "paid" },
    { label: "Disputed", value: "disputed" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusStyle = (status: SettlementStatus) => {
    switch (status) {
        case "pending": return "bg-yellow-100 text-yellow-600";
        case "approved": return "bg-blue-100 text-blue-600";
        case "paid": return "bg-green-100 text-green-700";
        case "disputed": return "bg-red-100 text-red-600";
        default: return "bg-gray-100 text-gray-500";
    }
};

const statusIcon = (status: SettlementStatus) => {
    switch (status) {
        case "pending": return <FaHourglassHalf className="text-yellow-500 text-xs" />;
        case "approved": return <FaCheckCircle className="text-blue-500 text-xs" />;
        case "paid": return <FaCheckCircle className="text-green-600 text-xs" />;
        case "disputed": return <FaTimesCircle className="text-red-500 text-xs" />;
        default: return null;
    }
};

// Controller uses net_payout, not net_amount
const fmt = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount ?? 0);

const fmtDate = (date?: string | null) =>
    date
        ? new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : "—";

// ─── Summary Card ─────────────────────────────────────────────────────────────

const SummaryCard = ({
    label, amount, count, color,
}: {
    label: string; amount: number; count: number; color: string;
}) => (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${color} flex flex-col gap-1`}>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-800">{fmt(amount)}</p>
        <p className="text-xs text-gray-400">{count} settlement{count !== 1 ? "s" : ""}</p>
    </div>
);

// ─── Action Menu ──────────────────────────────────────────────────────────────

const ActionMenu = ({
    settlement, onApprove, onPay, onDispute, onView,
}: {
    settlement: Settlement;
    onApprove: () => void;
    onPay: () => void;
    onDispute: () => void;
    onView: () => void;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="text-gray-400 hover:text-gray-600 transition p-1"
            >
                <FaEllipsisV />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-7 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 text-sm">
                        <button
                            onClick={() => { onView(); setOpen(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-600"
                        >
                            View Details
                        </button>
                        {settlement.status === "pending" && (
                            <button
                                onClick={() => { onApprove(); setOpen(false); }}
                                className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600"
                            >
                                Approve
                            </button>
                        )}
                        {settlement.status === "approved" && (
                            <button
                                onClick={() => { onPay(); setOpen(false); }}
                                className="w-full text-left px-4 py-2 hover:bg-green-50 text-green-600"
                            >
                                Mark as Paid
                            </button>
                        )}
                        {(settlement.status === "pending" || settlement.status === "approved") && (
                            <button
                                onClick={() => { onDispute(); setOpen(false); }}
                                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500"
                            >
                                Dispute
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const SettlementList = () => {
    const navigate = useNavigate();
    const tdBase = "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

    const [activeStatus, setActiveStatus] = useState<SettlementStatus | "">("");
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const { data, isLoading, isError, refetch } = useGetSettlementsQuery({
        page,
        status: activeStatus || undefined,
        search: search || undefined,
    });

    // Approve needs no body — just id. The inline quick-approve on the list.
    const [approve] = useApproveSettlementMutation();

    const settlements: Settlement[] = data?.data?.data ?? [];
    const summary = data?.summary;
    const lastPage = data?.meta?.last_page ?? 1;

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    const handleApprove = async (id: number) => {
        try {
            await approve({ id }).unwrap();
            showToast("success", "Settlement approved successfully.");
        } catch {
            showToast("error", "Failed to approve settlement.");
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="bg-white shadow-sm p-6 min-h-screen">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Settlement Management</h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => refetch()}
                        className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 hover:border-teal-300 transition"
                    >
                        <FaSync className="text-xs" />
                    </button>
                    <button
                        onClick={() => navigate(ROUTES.MAGENTO_SETTLEMENT_GENERATE)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium shadow hover:shadow-md transition"
                    >
                        <FaPlus className="text-xs" />
                        Generate Settlement
                    </button>
                </div>
            </div>

            {/* Summary Cards — controller returns net_payout in summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <SummaryCard label="Pending" amount={summary?.total_pending ?? 0} count={summary?.pending_count ?? 0} color="border-yellow-400" />
                <SummaryCard label="Approved" amount={summary?.total_approved ?? 0} count={summary?.approved_count ?? 0} color="border-blue-400" />
                <SummaryCard label="Paid" amount={summary?.total_paid ?? 0} count={summary?.paid_count ?? 0} color="border-green-400" />
                <SummaryCard label="Disputed" amount={summary?.total_disputed ?? 0} count={0} color="border-red-400" />
            </div>

            {/* Status Tabs */}
            <div className="flex gap-6 border-b border-gray-100 mb-4">
                {STATUS_TABS.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => { setActiveStatus(tab.value); setPage(1); }}
                        className={`pb-2 text-sm transition-colors border-b-2 -mb-px ${activeStatus === tab.value
                            ? "border-teal-500 text-teal-600 font-medium"
                            : "border-transparent text-gray-400 hover:text-teal-500"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search — controller searches vendor company_name & company_slug */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-4 max-w-sm">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                    <input
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        placeholder="Search by vendor name…"
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 placeholder:text-gray-300"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium"
                >
                    Search
                </button>
                {search && (
                    <button
                        type="button"
                        onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-400 hover:text-gray-600"
                    >
                        Clear
                    </button>
                )}
            </form>

            {/* Table */}
            <div className="rounded-t-3xl overflow-x-auto mt-4">
                <table className="w-full text-sm border-separate border-spacing-y-2">
                    <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                        <tr>
                            <th className="p-4 text-left">#</th>
                            <th className="p-4 text-left">Vendor</th>
                            <th className="p-4 text-left">Period</th>
                            <th className="p-4 text-left">Gross Sales</th>
                            <th className="p-4 text-left">Deductions</th>
                            <th className="p-4 text-left">Net Payout</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Period End</th>
                            <th className="p-4" />
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={9} className="text-center py-12">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500" />
                                        <span className="text-gray-400 text-sm">Loading settlements…</span>
                                    </div>
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={9} className="text-center py-12 text-red-400 text-sm">
                                    <FaExclamationTriangle className="inline mr-2" />
                                    Error loading settlements. Please try again.
                                </td>
                            </tr>
                        ) : settlements.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-16 text-gray-300">
                                    <FaMoneyBillWave className="text-4xl mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">No settlements found.</p>
                                </td>
                            </tr>
                        ) : settlements.map(s => (
                            <tr key={s.id} className="bg-white shadow-sm hover:shadow-md transition">

                                {/* Settlement Number */}
                                <td className={`${tdBase} rounded-l-xl text-xs text-gray-400 font-mono`}>
                                    {s.settlement_number}
                                </td>

                                {/* Vendor — controller uses company_name not name */}
                                <td className={`${tdBase} font-medium text-black`}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold text-sm">
                                            {(s.vendor?.company_name ?? "V").charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p>{s.vendor?.company_name ?? `Vendor #${s.vendor_id}`}</p>
                                            <p className="text-xs text-gray-400">{s.vendor?.user?.email ?? "—"}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Period */}
                                <td className={tdBase}>
                                    <div>
                                        <p className="text-xs text-gray-500">{fmtDate(s.period_start)}</p>
                                        <p className="text-xs text-gray-400">→ {fmtDate(s.period_end)}</p>
                                    </div>
                                </td>

                                {/* Gross Sales */}
                                <td className={`${tdBase} text-gray-700`}>
                                    {fmt(s.gross_sales)}
                                </td>

                                {/* Deductions: refunds + commissions + fees */}
                                <td className={`${tdBase} text-red-400 text-xs`}>
                                    <div>
                                        <p>Refunds: {fmt(s.total_refunds)}</p>
                                        <p>Fees: {fmt(s.gateway_fees)}</p>
                                        <p>Commission: {fmt(s.total_commissions)}</p>
                                    </div>
                                </td>

                                {/* Net Payout — controller field is net_payout */}
                                <td className={`${tdBase} font-bold text-teal-600`}>
                                    {fmt(s.net_payout)}
                                </td>

                                {/* Status */}
                                <td className={tdBase}>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium capitalize ${statusStyle(s.status)}`}>
                                        {statusIcon(s.status)}
                                        {s.status}
                                    </span>
                                </td>

                                {/* Period End */}
                                <td className={tdBase}>
                                    {fmtDate(s.period_end)}
                                </td>

                                {/* Actions */}
                                <td className="relative p-4 text-right rounded-r-xl">
                                    <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                                    <ActionMenu
                                        settlement={s}
                                        onView={() => navigate(ROUTES.MAGENTO_SETTLEMENT_DETAIL(s.id))}
                                        onApprove={() => handleApprove(s.id)}
                                        onPay={() => handlePay(s.id)}
                                        onDispute={() => handleDisputeOpen(s.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {/* Pagination - Only show if settlements exist */}
            {settlements.length > 0 && (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-600">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
                    >
                        ← Back
                    </button>
                    {[...Array(lastPage)].map((_, i) => (
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
                        disabled={page === lastPage}
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

export default SettlementList;