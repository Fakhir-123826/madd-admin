// src/screens/MLM/Commissions.tsx
import { useState } from "react";
import {
    FaSync,
    FaTimes,
    FaMoneyBillWave,
    FaCheckCircle,
    FaTimesCircle,
    FaHourglassHalf,
} from "react-icons/fa";
import {
    useGetCommissionsQuery,
    useProcessCommissionsMutation,
    useApproveCommissionMutation,
    useRejectCommissionMutation,
    usePayCommissionMutation,
    type MlmCommission,
} from "../../app/api/MlmSlices/MlmApi";

const ITEMS_PER_PAGE = 15;

const Commissions = () => {
    const [page, setPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [processModalOpen, setProcessModalOpen] = useState(false);
    const [periodStart, setPeriodStart] = useState("");
    const [periodEnd, setPeriodEnd] = useState("");
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const { data, isLoading, refetch, isFetching } = useGetCommissionsQuery({
        page,
        per_page: ITEMS_PER_PAGE,
        status: filterStatus || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
    });
    const [processCommissions] = useProcessCommissionsMutation();
    const [approveCommission] = useApproveCommissionMutation();
    const [rejectCommission] = useRejectCommissionMutation();
    const [payCommission] = usePayCommissionMutation();

    // FIX: backend wraps paginator in `data`, so shape is data.data (array) + data.meta
    // The API response is: { success, data: { data: [], meta: {} }, summary: {} }
    const commissions: MlmCommission[] = data?.data?.data ?? data?.data ?? [];
    const summary = data?.summary;
    const meta = (data?.data as any)?.meta ?? data?.meta;

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleProcessCommissions = async () => {
        if (!periodStart || !periodEnd) {
            showToast("error", "Please select both start and end dates");
            return;
        }
        try {
            const result = await processCommissions({ period_start: periodStart, period_end: periodEnd }).unwrap();
            showToast(
                "success",
                `Processed ${result.data.commissions_created} commissions totalling $${result.data.total_amount}`
            );
            setProcessModalOpen(false);
            setPeriodStart("");
            setPeriodEnd("");
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to process commissions");
        }
    };

    const handleApprove = async (id: number) => {
        setActionLoading(id);
        try {
            await approveCommission(id).unwrap();
            showToast("success", "Commission approved");
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to approve commission");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: number) => {
        const reason = prompt("Please provide a reason for rejection:");
        if (!reason) return;
        setActionLoading(id);
        try {
            await rejectCommission({ id, reason }).unwrap();
            showToast("success", "Commission rejected");
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to reject commission");
        } finally {
            setActionLoading(null);
        }
    };

    const handlePay = async (id: number) => {
        if (!confirm("Mark this commission as paid?")) return;
        setActionLoading(id);
        try {
            await payCommission(id).unwrap();
            showToast("success", "Commission marked as paid");
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to pay commission");
        } finally {
            setActionLoading(null);
        }
    };

    const statusOptions = ["pending", "approved", "paid", "rejected"];
    const totalPages = meta?.last_page || 1;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":  return <FaHourglassHalf className="text-yellow-500" />;
            case "approved": return <FaCheckCircle className="text-blue-500" />;
            case "paid":     return <FaCheckCircle className="text-emerald-500" />;
            case "rejected": return <FaTimesCircle className="text-red-500" />;
            default: return null;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "pending":  return "bg-yellow-100 text-yellow-700";
            case "approved": return "bg-blue-100 text-blue-700";
            case "paid":     return "bg-emerald-100 text-emerald-700";
            case "rejected": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-500";
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const maxVisible = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        if (endPage - startPage + 1 < maxVisible) startPage = Math.max(1, endPage - maxVisible + 1);

        return (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                    Showing {meta?.from || 0} to {meta?.to || 0} of {meta?.total || 0} commissions
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => handlePageChange(page - 1)} disabled={page === 1 || isFetching}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40">← Previous</button>
                    {startPage > 1 && <button onClick={() => handlePageChange(1)} className="px-3 py-1 rounded-md hover:bg-gray-100">1</button>}
                    {startPage > 2 && <span className="px-1">...</span>}
                    {[...Array(endPage - startPage + 1)].map((_, i) => {
                        const pageNum = startPage + i;
                        return (
                            <button key={pageNum} onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-1 rounded-md ${page === pageNum ? "bg-gradient-to-r from-teal-400 to-green-400 text-white" : "hover:bg-gray-100"}`}>
                                {pageNum}
                            </button>
                        );
                    })}
                    {endPage < totalPages && <span className="px-1">...</span>}
                    {endPage < totalPages && (
                        <button onClick={() => handlePageChange(totalPages)} className="px-3 py-1 rounded-md hover:bg-gray-100">{totalPages}</button>
                    )}
                    <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages || isFetching}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40">Next →</button>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 border-l-4 border-yellow-400">
                        <p className="text-xs text-gray-500">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">${(summary.total_pending || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border-l-4 border-blue-400">
                        <p className="text-xs text-gray-500">Approved</p>
                        <p className="text-2xl font-bold text-blue-600">${(summary.total_approved || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border-l-4 border-emerald-400">
                        <p className="text-xs text-gray-500">Paid</p>
                        <p className="text-2xl font-bold text-emerald-600">${(summary.total_paid || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl p-4 border-l-4 border-teal-400">
                        <p className="text-xs text-gray-500">Total Commissions</p>
                        <p className="text-2xl font-bold text-teal-600">${(summary.total_commissions || 0).toLocaleString()}</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Commissions</h2>
                    <p className="text-sm text-gray-500">Manage MLM agent commissions</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => refetch()} className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500">
                        <FaSync className="text-sm" />
                    </button>
                    <button onClick={() => setProcessModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium hover:opacity-90">
                        <FaMoneyBillWave className="text-xs" /> Process Commissions
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
                <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                    className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400">
                    <option value="">All Status</option>
                    {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400" />
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400" />
                {(dateFrom || dateTo || filterStatus) && (
                    <button onClick={() => { setFilterStatus(""); setDateFrom(""); setDateTo(""); setPage(1); }}
                        className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm">
                        <FaTimes /> Clear
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                                <th className="px-4 py-4 text-left font-semibold text-sm">Agent</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Amount</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Level</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Source</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Status</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Date</th>
                                <th className="px-4 py-4 text-center font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {commissions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-gray-400">No commissions found</td>
                                </tr>
                            ) : (
                                commissions.map((commission: MlmCommission) => (
                                    <tr key={commission.id} className="hover:bg-gray-50/60 transition border-b border-gray-100">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-green-400 flex items-center justify-center text-white text-xs font-semibold">
                                                    {commission.agent?.user?.full_name?.charAt(0) || "A"}
                                                </div>
                                                <span className="text-gray-700 text-sm">
                                                    {commission.agent?.user?.full_name || `Agent #${commission.agent_id}`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-teal-600">
                                            ${commission.amount.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded-md bg-teal-100 text-teal-700 text-xs">
                                                Level {commission.level}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 capitalize text-gray-600 text-sm">{commission.source_type}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getStatusStyle(commission.status)}`}>
                                                {getStatusIcon(commission.status)} {commission.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {new Date(commission.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {commission.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(commission.id)}
                                                            disabled={actionLoading === commission.id}
                                                            className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs hover:bg-emerald-600 disabled:opacity-50">
                                                            {actionLoading === commission.id ? "..." : "Approve"}
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(commission.id)}
                                                            disabled={actionLoading === commission.id}
                                                            className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600 disabled:opacity-50">
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {commission.status === "approved" && (
                                                    <button
                                                        onClick={() => handlePay(commission.id)}
                                                        disabled={actionLoading === commission.id}
                                                        className="px-3 py-1 rounded-lg bg-blue-500 text-white text-xs hover:bg-blue-600 disabled:opacity-50">
                                                        {actionLoading === commission.id ? "..." : "Mark Paid"}
                                                    </button>
                                                )}
                                                {commission.status === "paid" && (
                                                    <span className="text-xs text-emerald-600 font-medium">✓ Paid</span>
                                                )}
                                                {commission.status === "rejected" && (
                                                    <span className="text-xs text-red-600 font-medium">✕ Rejected</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {renderPagination()}
            </div>

            {/* Process Commissions Modal */}
            {processModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setProcessModalOpen(false)} />
                    <div className="relative min-h-screen flex items-center justify-center p-4">
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                            <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
                                <h2 className="text-lg font-bold">Process Commissions</h2>
                                <button onClick={() => setProcessModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Period Start *</label>
                                    <input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Period End *</label>
                                    <input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400" />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => setProcessModalOpen(false)}
                                        className="flex-1 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
                                    <button onClick={handleProcessCommissions}
                                        className="flex-1 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white hover:opacity-90">
                                        Process
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Commissions;