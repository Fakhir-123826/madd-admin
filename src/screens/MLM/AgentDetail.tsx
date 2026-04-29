// src/screens/MLM/AgentDetail.tsx
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft, FaEdit, FaUserCheck, FaShieldAlt,
    FaMoneyBillWave, FaUsers, FaMapMarkerAlt, FaPhone,
} from "react-icons/fa";
import { useState } from "react";
import {
    useGetAgentQuery,
    useVerifyAgentMutation,
} from "../../app/api/MlmSlices/MlmApi";

const fmtMoney = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v || 0);

const AgentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading, refetch } = useGetAgentQuery(Number(id));
    const [verifyAgent, { isLoading: verifying }] = useVerifyAgentMutation();

    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const agent = data?.data;

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleVerify = async () => {
        try {
            await verifyAgent(Number(id)).unwrap();
            showToast("success", "Agent KYC verified successfully");
            setShowVerifyModal(false);
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to verify agent");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="text-center py-20 text-gray-400">
                <p className="text-lg">Agent not found</p>
                <button onClick={() => navigate("/mlm/agents")} className="mt-4 text-teal-500 hover:underline text-sm">
                    ← Back to agents
                </button>
            </div>
        );
    }

    const statusColor = {
        active: "bg-emerald-100 text-emerald-700",
        inactive: "bg-gray-100 text-gray-500",
        suspended: "bg-red-100 text-red-700",
    }[agent.status] ?? "bg-gray-100 text-gray-500";

    const kycColor = {
        verified: "bg-emerald-100 text-emerald-700",
        pending: "bg-yellow-100 text-yellow-700",
        rejected: "bg-red-100 text-red-700",
    }[agent.kyc_status] ?? "bg-gray-100 text-gray-500";

    return (
        <div className="max-w-4xl mx-auto space-y-6">
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
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/mlm/agents")}
                        className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 transition">
                        <FaArrowLeft className="text-sm" />
                    </button>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Agent Details</h2>
                        <p className="text-sm text-gray-500">#{agent.id}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {agent.kyc_status === "pending" && (
                        <button onClick={() => setShowVerifyModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition">
                            <FaUserCheck className="text-xs" /> Verify KYC
                        </button>
                    )}
                    <button onClick={() => navigate(`/mlm/agents/edit/${agent.id}`)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition">
                        <FaEdit className="text-xs" /> Edit
                    </button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-teal-400 to-green-400 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                            {agent.user?.full_name?.charAt(0) || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-800">{agent.user?.full_name || `Agent #${agent.id}`}</h3>
                            <p className="text-sm text-gray-500">{agent.user?.email}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="px-2 py-1 rounded-md bg-teal-100 text-teal-700 text-xs font-medium">
                                    Level {agent.level}
                                </span>
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColor}`}>
                                    {agent.status}
                                </span>
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${kycColor}`}>
                                    KYC: {agent.kyc_status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-4 border border-teal-100">
                    <FaMoneyBillWave className="text-teal-500 mb-2" />
                    <p className="text-xs text-gray-500">Total Earned</p>
                    <p className="text-lg font-bold text-teal-700">{fmtMoney(agent.total_commissions_earned)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <FaUsers className="text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Downline</p>
                    <p className="text-lg font-bold text-gray-700">{agent.downline_count ?? 0}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <FaUsers className="text-emerald-400 mb-2" />
                    <p className="text-xs text-gray-500">Active Downline</p>
                    <p className="text-lg font-bold text-gray-700">{agent.active_downline ?? 0}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Vendors Recruited</p>
                    <p className="text-lg font-bold text-gray-700">{agent.total_vendors_recruited ?? 0}</p>
                </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Agent Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                    <h4 className="font-semibold text-gray-800">Agent Info</h4>
                    <InfoRow icon={<FaMapMarkerAlt className="text-teal-400" />} label="Territory" value={`${agent.territory_code} (${agent.territory_type})`} />
                    <InfoRow icon={<FaShieldAlt className="text-teal-400" />} label="Commission Rate" value={`${agent.commission_rate}%`} />
                    <InfoRow icon={<FaPhone className="text-teal-400" />} label="Phone" value={agent.phone || "—"} />
                    <InfoRow label="Parent Agent" value={agent.parent?.user?.full_name || "Root (no parent)"} />
                    <InfoRow label="Member Since" value={new Date(agent.created_at).toLocaleDateString()} />
                </div>

                {/* Children */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h4 className="font-semibold text-gray-800 mb-4">Direct Downline ({agent.children?.length ?? 0})</h4>
                    {agent.children && agent.children.length > 0 ? (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {agent.children.map((child: any) => (
                                <button key={child.id}
                                    onClick={() => navigate(`/mlm/agents/${child.id}`)}
                                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition text-left">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-green-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                        {child.user?.full_name?.charAt(0) || "A"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{child.user?.full_name}</p>
                                        <p className="text-xs text-gray-400">Level {child.level} · {child.status}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm text-center py-8">No direct downline members</p>
                    )}
                </div>
            </div>

            {/* Recent Commissions */}
            {agent.recent_commissions && agent.recent_commissions.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h4 className="font-semibold text-gray-800">Recent Commissions</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 text-xs text-gray-500">
                                    <th className="px-4 py-2 text-left">Amount</th>
                                    <th className="px-4 py-2 text-left">Source</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agent.recent_commissions.map((c: any) => (
                                    <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="px-4 py-2 font-semibold text-teal-600 text-sm">${c.amount.toLocaleString()}</td>
                                        <td className="px-4 py-2 capitalize text-gray-600 text-sm">{c.source_type}</td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.status === "paid" ? "bg-emerald-100 text-emerald-700" :
                                                    c.status === "approved" ? "bg-blue-100 text-blue-700" :
                                                        c.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                            "bg-red-100 text-red-700"
                                                }`}>{c.status}</span>
                                        </td>
                                        <td className="px-4 py-2 text-gray-400 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Verify Modal */}
            {showVerifyModal && (
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
                                        <p className="font-medium text-gray-800">{agent.user?.full_name}</p>
                                        <p className="text-sm text-gray-500">{agent.user?.email}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-6">Are you sure you want to verify this agent's KYC documents?</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowVerifyModal(false)} className="flex-1 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
                                    <button onClick={handleVerify} disabled={verifying}
                                        className="flex-1 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white disabled:opacity-50">
                                        {verifying ? "Verifying…" : "Verify"}
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

const InfoRow = ({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-center gap-3">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="text-xs text-gray-400 w-28 flex-shrink-0">{label}</span>
        <span className="text-sm text-gray-700 font-medium">{value}</span>
    </div>
);

export default AgentDetail;