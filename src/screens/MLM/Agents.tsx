// src/screens/MLM/Agents.tsx
import { useState } from "react";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaCheckCircle,
    FaTimesCircle,
    FaUserCheck,
    FaSearch,
    FaTimes,
    FaSync,
    FaShieldAlt,
} from "react-icons/fa";
import {
    useGetAgentsQuery,
    useDeleteAgentMutation,
    useVerifyAgentMutation,
    type MlmAgent,
} from "../../app/api/MlmSlices/MlmApi";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 15;

const Agents = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState("");
    const [filterKyc, setFilterKyc] = useState("");
    const [filterLevel, setFilterLevel] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [selectedAgent, setSelectedAgent] = useState<MlmAgent | null>(null);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const { data, isLoading, refetch, isFetching } = useGetAgentsQuery({
        page,
        per_page: ITEMS_PER_PAGE,
        status: filterStatus || undefined,
        kyc_status: filterKyc || undefined,
        level: filterLevel ? parseInt(filterLevel) : undefined,
        search: search || undefined,
    });
    const [deleteAgent] = useDeleteAgentMutation();
    const [verifyAgent] = useVerifyAgentMutation();

    const agents = data?.data ?? [];
    const meta = data?.meta;

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDelete = async (id: number, hasDownline: boolean) => {
        if (hasDownline) {
            showToast("error", "Cannot delete agent with downline members");
            return;
        }
        if (confirm("Are you sure you want to delete this agent?")) {
            try {
                await deleteAgent(id).unwrap();
                showToast("success", "Agent deleted successfully");
                refetch();
            } catch (error: any) {
                showToast("error", error?.data?.message || "Failed to delete agent");
            }
        }
    };

    const handleVerify = async (id: number) => {
        try {
            await verifyAgent(id).unwrap();
            showToast("success", "Agent KYC verified successfully");
            setShowVerifyModal(false);
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to verify agent");
        }
    };

    const statusOptions = ["active", "inactive", "suspended"];
    const kycOptions = ["pending", "verified", "rejected"];
    const levelOptions = [1, 2, 3, 4, 5, 6];

    const totalPages = meta?.last_page || 1;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const maxVisible = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        return (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                    Showing {meta?.from || 0} to {meta?.to || 0} of {meta?.total || 0} agents
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1 || isFetching}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                    >
                        ← Previous
                    </button>
                    {startPage > 1 && (
                        <>
                            <button onClick={() => handlePageChange(1)} className="px-3 py-1 rounded-md hover:bg-gray-100">1</button>
                            {startPage > 2 && <span className="px-1">...</span>}
                        </>
                    )}
                    {[...Array(endPage - startPage + 1)].map((_, i) => {
                        const pageNum = startPage + i;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-1 rounded-md transition ${page === pageNum ? "bg-gradient-to-r from-teal-400 to-green-400 text-white" : "hover:bg-gray-100"}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="px-1">...</span>}
                            <button onClick={() => handlePageChange(totalPages)} className="px-3 py-1 rounded-md hover:bg-gray-100">
                                {totalPages}
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages || isFetching}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                    >
                        Next →
                    </button>
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
            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">MLM Agents</h2>
                    <p className="text-sm text-gray-500">Manage all multi-level marketing agents</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => refetch()} className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 transition">
                        <FaSync className="text-sm" />
                    </button>
                    <button
                        onClick={() => navigate("/mlm/agents/add")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium hover:opacity-90 transition"
                    >
                        <FaPlus className="text-xs" /> Add Agent
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400"
                    >
                        <option value="">All Status</option>
                        {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                    <select
                        value={filterKyc}
                        onChange={(e) => { setFilterKyc(e.target.value); setPage(1); }}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400"
                    >
                        <option value="">All KYC</option>
                        {kycOptions.map(k => <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>)}
                    </select>
                    <select
                        value={filterLevel}
                        onChange={(e) => { setFilterLevel(e.target.value); setPage(1); }}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400"
                    >
                        <option value="">All Levels</option>
                        {levelOptions.map(l => <option key={l} value={l}>Level {l}</option>)}
                    </select>
                </div>
                <div className="relative flex-1 max-w-sm">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && setSearch(searchInput)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-400"
                    />
                </div>
                {search && (
                    <button onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }} className="text-gray-400 hover:text-gray-600">
                        <FaTimes />
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
                                <th className="px-4 py-4 text-left font-semibold text-sm">Level</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Parent</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Territory</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Commission Rate</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Status</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">KYC</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Downline</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Total Earned</th>
                                <th className="px-4 py-4 text-center font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {agents.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-12 text-gray-400">No agents found</td>
                                </tr>
                            ) : (
                                agents.map((agent) => (
                                    <tr key={agent.id} className="hover:bg-gray-50/60 transition border-b border-gray-100">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-green-400 flex items-center justify-center text-white font-semibold">
                                                    {agent.user?.full_name?.charAt(0) || "A"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{agent.user?.full_name || `Agent #${agent.id}`}</p>
                                                    <p className="text-xs text-gray-400">{agent.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded-md bg-teal-100 text-teal-700 text-xs font-medium">Level {agent.level}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 text-sm">{agent.parent?.user?.full_name || "—"}</td>
                                        <td className="px-4 py-3 text-gray-600 text-sm">{agent.territory_code} ({agent.territory_type})</td>
                                        <td className="px-4 py-3 text-gray-600 text-sm">{agent.commission_rate}%</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${agent.status === "active" ? "bg-emerald-100 text-emerald-700" : agent.status === "inactive" ? "bg-gray-100 text-gray-500" : "bg-red-100 text-red-700"}`}>
                                                {agent.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${agent.kyc_status === "verified" ? "bg-emerald-100 text-emerald-700" : agent.kyc_status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                                                {agent.kyc_status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 text-sm">{agent.downline_count || 0} members</td>
                                        <td className="px-4 py-3 text-gray-800 font-semibold">${(agent.total_commissions_earned || 0).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/mlm/agents/${agent.id}`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <FaEye className="text-sm" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/mlm/agents/edit/${agent.id}`)}
                                                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="text-sm" />
                                                </button>
                                                {agent.kyc_status === "pending" && (
                                                    <button
                                                        onClick={() => { setSelectedAgent(agent); setShowVerifyModal(true); }}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                                        title="Verify KYC"
                                                    >
                                                        <FaUserCheck className="text-sm" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(agent.id, (agent.downline_count || 0) > 0)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <FaTrash className="text-sm" />
                                                </button>
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

            {/* Verify KYC Modal */}
            {showVerifyModal && selectedAgent && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setShowVerifyModal(false)} />
                    <div className="relative min-h-screen flex items-center justify-center p-4">
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                            <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
                                <h2 className="text-lg font-bold">Verify Agent KYC</h2>
                                <button onClick={() => setShowVerifyModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaShieldAlt className="text-teal-500 text-2xl" />
                                    <div>
                                        <p className="font-medium text-gray-800">{selectedAgent.user?.full_name}</p>
                                        <p className="text-sm text-gray-500">{selectedAgent.user?.email}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-6">Are you sure you want to verify this agent's KYC documents?</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowVerifyModal(false)} className="flex-1 py-2 rounded-lg border">Cancel</button>
                                    <button onClick={() => handleVerify(selectedAgent.id)} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white">Verify</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Agents;