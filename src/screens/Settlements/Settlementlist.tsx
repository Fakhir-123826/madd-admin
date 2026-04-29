import { useState, useRef, useEffect } from "react";
import {
    FaEllipsisV,
    FaEye,
    FaSync,
    FaSearch,
    FaTimes,
    FaExclamationTriangle,
    FaMoneyBillWave,
    FaCheckCircle,
    FaHourglassHalf,
    FaTimesCircle,
    FaFilePdf,
    FaBuilding,
    FaCalendar,
    FaDollarSign,
} from "react-icons/fa";
import {
    FiShield,
    FiAlertCircle,
    FiCheck,
    FiX,
    FiClock,
    FiCalendar,
    FiDollarSign,
    FiCreditCard,
    FiDownload,
} from "react-icons/fi";
import {
    useGetSettlementsQuery,
    useApproveSettlementMutation,
    useUpdateSettlementStatusMutation,
    type Settlement,
    type SettlementStatus,
} from "../../app/api/SettlementSlices/SettlementApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router";
import PageHeader from "../../component/PageHeader/Pageheaderfilterbar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vendor {
    id: number;
    uuid: string;
    company_name: string;
    company_slug?: string;
    user?: {
        email: string;
    };
}

interface Settlement {
    id: number;
    settlement_number: string;
    vendor_id: number;
    vendor: Vendor;
    period_start: string;
    period_end: string;
    gross_sales: number;
    total_refunds: number;
    total_commissions: number;
    total_shipping_fees: number;
    total_tax_collected: number;
    gateway_fees: number;
    adjustment_amount: number;
    net_payout: number;
    currency_code: string;
    status: SettlementStatus;
    payment_method?: string;
    payment_reference?: string;
    notes?: string;
    approved_by?: number;
    approved_at?: string;
    paid_at?: string;
    created_at: string;
    updated_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

const fmtDateTime = (d: string) =>
    new Date(d).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

const fmtPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price || 0);

const statusStyle = (status: SettlementStatus) => {
    switch (status) {
        case "pending":
            return "bg-yellow-50 text-yellow-600 border-yellow-200";
        case "approved":
            return "bg-blue-50 text-blue-600 border-blue-200";
        case "paid":
            return "bg-emerald-50 text-emerald-600 border-emerald-200";
        case "disputed":
            return "bg-red-50 text-red-600 border-red-200";
        default:
            return "bg-gray-100 text-gray-500 border-gray-200";
    }
};

const statusIcon = (status: SettlementStatus) => {
    switch (status) {
        case "pending":
            return <FiClock className="text-xs" />;
        case "approved":
            return <FiCheck className="text-xs" />;
        case "paid":
            return <FaCheckCircle className="text-xs" />;
        case "disputed":
            return <FiX className="text-xs" />;
        default:
            return null;
    }
};

// ─── Tabs config ──────────────────────────────────────────────────────────────

const STATUS_TABS = [
    { key: "", label: "All Settlements" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "paid", label: "Paid" },
    { key: "disputed", label: "Disputed" },
];

// ─── Approve Modal ────────────────────────────────────────────────────────────

const ApproveModal = ({
    isOpen,
    onClose,
    settlement,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    settlement: Settlement | null;
    onSuccess: () => void;
}) => {
    const [approveSettlement, { isLoading: isApproving }] = useApproveSettlementMutation();
    const [notes, setNotes] = useState("");
    const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const showMsg = (type: "success" | "error", msg: string) => {
        setModalToast({ type, msg });
        setTimeout(() => setModalToast(null), 3000);
    };

    const handleApprove = async () => {
        if (!settlement) return;
        try {
            await approveSettlement({
                id: settlement.id,
                data: { notes: notes || undefined },
            }).unwrap();
            showMsg("success", `Settlement #${settlement.settlement_number} approved`);
            setTimeout(() => { onSuccess(); onClose(); }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to approve settlement");
        }
    };

    if (!isOpen || !settlement) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {modalToast && (
                <div className={`fixed top-5 right-5 z-[60] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${modalToast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{modalToast.type === "success" ? "✓" : "✕"}</span>
                    {modalToast.msg}
                </div>
            )}
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
                    <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Approve Settlement</h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Settlement #{settlement.settlement_number}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="bg-gray-50 rounded-xl p-3 flex justify-between text-sm">
                            <span className="text-gray-500">Net Payout:</span>
                            <span className="font-semibold text-teal-600">{fmtPrice(settlement.net_payout)}</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Approval Notes (Optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any notes about this approval..."
                                rows={3}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={isApproving}
                                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                            >
                                {isApproving ? "Approving..." : "Approve Settlement"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Payment Modal ────────────────────────────────────────────────────────────

const PaymentModal = ({
    isOpen,
    onClose,
    settlement,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    settlement: Settlement | null;
    onSuccess: () => void;
}) => {
    const [updateStatus, { isLoading: isUpdating }] = useUpdateSettlementStatusMutation();
    const [paymentReference, setPaymentReference] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "paypal" | "stripe" | "manual">("bank_transfer");
    const [notes, setNotes] = useState("");
    const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const showMsg = (type: "success" | "error", msg: string) => {
        setModalToast({ type, msg });
        setTimeout(() => setModalToast(null), 3000);
    };

    const handleMarkAsPaid = async () => {
        if (!settlement) return;
        if (!paymentReference.trim()) {
            showMsg("error", "Please provide a payment reference");
            return;
        }
        try {
            await updateStatus({
                id: settlement.id,
                status: "paid",
                data: {
                    payment_reference: paymentReference,
                    payment_method: paymentMethod,
                    notes: notes || undefined,
                },
            }).unwrap();
            showMsg("success", `Settlement #${settlement.settlement_number} marked as paid`);
            setTimeout(() => { onSuccess(); onClose(); }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to mark as paid");
        }
    };

    if (!isOpen || !settlement) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {modalToast && (
                <div className={`fixed top-5 right-5 z-[60] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${modalToast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{modalToast.type === "success" ? "✓" : "✕"}</span>
                    {modalToast.msg}
                </div>
            )}
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="h-1 bg-gradient-to-r from-emerald-400 to-green-400 rounded-t-2xl" />
                    <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Mark as Paid</h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Settlement #{settlement.settlement_number}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="bg-gray-50 rounded-xl p-3 flex justify-between text-sm">
                            <span className="text-gray-500">Net Payout:</span>
                            <span className="font-semibold text-teal-600">{fmtPrice(settlement.net_payout)}</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Payment Method *
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value as any)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            >
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="paypal">PayPal</option>
                                <option value="stripe">Stripe</option>
                                <option value="manual">Manual</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Payment Reference *
                            </label>
                            <input
                                type="text"
                                value={paymentReference}
                                onChange={(e) => setPaymentReference(e.target.value)}
                                placeholder="Transaction ID / Reference Number"
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Internal notes..."
                                rows={2}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleMarkAsPaid}
                                disabled={isUpdating || !paymentReference.trim()}
                                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-green-400 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                            >
                                {isUpdating ? "Processing..." : "Mark as Paid"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Dispute Modal ────────────────────────────────────────────────────────────

const DisputeModal = ({
    isOpen,
    onClose,
    settlement,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    settlement: Settlement | null;
    onSuccess: () => void;
}) => {
    const [updateStatus, { isLoading: isUpdating }] = useUpdateSettlementStatusMutation();
    const [reason, setReason] = useState("");
    const [notes, setNotes] = useState("");
    const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const showMsg = (type: "success" | "error", msg: string) => {
        setModalToast({ type, msg });
        setTimeout(() => setModalToast(null), 3000);
    };

    const handleDispute = async () => {
        if (!settlement) return;
        if (!reason.trim()) {
            showMsg("error", "Please provide a reason for dispute");
            return;
        }
        try {
            await updateStatus({
                id: settlement.id,
                status: "disputed",
                data: { reason, notes: notes || undefined },
            }).unwrap();
            showMsg("success", `Settlement #${settlement.settlement_number} marked as disputed`);
            setTimeout(() => { onSuccess(); onClose(); }, 1500);
        } catch (e: any) {
            showMsg("error", e?.data?.message || "Failed to mark as disputed");
        }
    };

    if (!isOpen || !settlement) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {modalToast && (
                <div className={`fixed top-5 right-5 z-[60] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${modalToast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{modalToast.type === "success" ? "✓" : "✕"}</span>
                    {modalToast.msg}
                </div>
            )}
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="h-1 bg-gradient-to-r from-red-400 to-red-500 rounded-t-2xl" />
                    <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Dispute Settlement</h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Settlement #{settlement.settlement_number}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="bg-red-50 rounded-xl p-3 text-sm text-red-600">
                            ⚠️ Disputing this settlement will require review before payment.
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for Dispute *
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="e.g., Incorrect calculation, Missing transactions, Wrong period..."
                                rows={3}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Additional Details (Optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Internal notes about the dispute..."
                                rows={2}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDispute}
                                disabled={isUpdating || !reason.trim()}
                                className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition disabled:opacity-50"
                            >
                                {isUpdating ? "Processing..." : "Confirm Dispute"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Settlement Detail Drawer ─────────────────────────────────────────────────

const SettlementDetailDrawer = ({
    settlement,
    onClose,
}: {
    settlement: Settlement | null;
    onClose: () => void;
}) => {
    if (!settlement) return null;

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
            <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
                <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Settlement Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xl font-bold text-gray-800">{settlement.settlement_number}</p>
                            <p className="text-sm text-gray-500">{fmtDateTime(settlement.created_at)}</p>
                        </div>
                        <div className="text-right">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(settlement.status)}`}>
                                {statusIcon(settlement.status)}
                                {settlement.status}
                            </span>
                        </div>
                    </div>

                    {/* Vendor Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FaBuilding className="text-teal-500" /> Vendor Information
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold text-lg">
                                    {(settlement.vendor?.company_name ?? "V").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{settlement.vendor?.company_name || `Vendor #${settlement.vendor_id}`}</p>
                                    <p className="text-xs text-gray-500">{settlement.vendor?.user?.email || "—"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Period Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FaCalendar className="text-teal-500" /> Settlement Period
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Period Start:</span>
                                <span className="text-gray-700">{fmtDate(settlement.period_start)}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-gray-500">Period End:</span>
                                <span className="text-gray-700">{fmtDate(settlement.period_end)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FaDollarSign className="text-teal-500" /> Financial Summary
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Gross Sales:</span>
                                <span className="text-gray-700">{fmtPrice(settlement.gross_sales)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Refunds:</span>
                                <span className="text-red-500">-{fmtPrice(settlement.total_refunds)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Commissions ({settlement.total_commissions > 0 ? settlement.total_commissions : 0}):</span>
                                <span className="text-gray-700">{fmtPrice(settlement.total_commissions)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Gateway Fees:</span>
                                <span className="text-gray-700">{fmtPrice(settlement.gateway_fees)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tax Collected:</span>
                                <span className="text-gray-700">{fmtPrice(settlement.total_tax_collected)}</span>
                            </div>
                            {settlement.adjustment_amount !== 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Adjustments:</span>
                                    <span className={settlement.adjustment_amount > 0 ? "text-green-600" : "text-red-500"}>
                                        {fmtPrice(settlement.adjustment_amount)}
                                    </span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-2 mt-2">
                                <div className="flex justify-between font-semibold">
                                    <span className="text-gray-800">Net Payout:</span>
                                    <span className="text-teal-600 text-lg">{fmtPrice(settlement.net_payout)}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-gray-500">Currency:</span>
                                    <span className="text-gray-600">{settlement.currency_code}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    {(settlement.payment_method || settlement.payment_reference) && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FiCreditCard className="text-teal-500" /> Payment Information
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                {settlement.payment_method && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Payment Method:</span>
                                        <span className="text-gray-600 capitalize">{settlement.payment_method.replace(/_/g, " ")}</span>
                                    </div>
                                )}
                                {settlement.payment_reference && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Reference:</span>
                                        <span className="text-gray-600 font-mono text-xs">{settlement.payment_reference}</span>
                                    </div>
                                )}
                                {settlement.paid_at && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Paid At:</span>
                                        <span className="text-gray-600">{fmtDateTime(settlement.paid_at)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {settlement.notes && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
                            <div className="bg-yellow-50 rounded-xl p-3">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{settlement.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="pt-2 border-t border-gray-100">
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Settlement ID:</span>
                                <span className="text-gray-600">{settlement.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Created:</span>
                                <span className="text-gray-600">{fmtDateTime(settlement.created_at)}</span>
                            </div>
                            {settlement.approved_at && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Approved:</span>
                                    <span className="text-gray-600">{fmtDateTime(settlement.approved_at)}</span>
                                </div>
                            )}
                            {settlement.paid_at && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Paid:</span>
                                    <span className="text-gray-600">{fmtDateTime(settlement.paid_at)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// ─── Row Action Menu ──────────────────────────────────────────────────────────

const RowMenu = ({
    settlement,
    onView,
    onApprove,
    onPay,
    onDispute,
}: {
    settlement: Settlement;
    onView: () => void;
    onApprove: () => void;
    onPay: () => void;
    onDispute: () => void;
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const canApprove = settlement.status === "pending";
    const canPay = settlement.status === "approved";
    const canDispute = settlement.status === "pending" || settlement.status === "approved";

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)}
                className="text-gray-400 hover:text-gray-600 p-1 transition cursor-pointer">
                <FaEllipsisV className="text-sm" />
            </button>
            {open && (
                <div className="absolute right-0 top-7 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 text-sm">
                    <button onClick={() => { onView(); setOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 cursor-pointer">
                        <FaEye className="inline mr-2 text-xs" /> View Details
                    </button>
                    {canApprove && (
                        <button onClick={() => { onApprove(); setOpen(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-teal-50 text-teal-600 cursor-pointer">
                            <FiCheck className="inline mr-2 text-xs" /> Approve
                        </button>
                    )}
                    {canPay && (
                        <button onClick={() => { onPay(); setOpen(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-emerald-600 cursor-pointer">
                            <FaCheckCircle className="inline mr-2 text-xs" /> Mark as Paid
                        </button>
                    )}
                    {canDispute && (
                        <button onClick={() => { onDispute(); setOpen(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer">
                            <FiAlertCircle className="inline mr-2 text-xs" /> Dispute
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PER_PAGE = 15;

const SettlementList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [activeStatus, setActiveStatus] = useState<string>("");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);

    const { data, isLoading, error, refetch, isFetching } = useGetSettlementsQuery({
        page,
        per_page: PER_PAGE,
        status: activeStatus || undefined,
        search: search || undefined,
    });

    const settlements: Settlement[] = data?.data?.data ?? [];
    const summary = data?.summary;
    const meta = data?.meta;

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleReset = () => {
        setSearch("");
        setSearchInput("");
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSuccess = () => {
        refetch();
    };

    // Generate pagination buttons
    const renderPaginationButtons = () => {
        if (!meta || meta.last_page <= 1) return null;

        const currentPage = meta.current_page;
        const lastPage = meta.last_page;
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(lastPage, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                    Showing {meta.from || 0} to {meta.to || 0} of {meta.total} settlements
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isFetching}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                    >
                        ← Previous
                    </button>

                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => handlePageChange(1)}
                                className="px-3 py-1 rounded-md hover:bg-gray-100 cursor-pointer"
                            >
                                1
                            </button>
                            {startPage > 2 && <span className="px-1">...</span>}
                        </>
                    )}

                    {pages.map(pageNum => (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 rounded-md cursor-pointer transition ${pageNum === currentPage
                                ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            {pageNum}
                        </button>
                    ))}

                    {endPage < lastPage && (
                        <>
                            {endPage < lastPage - 1 && <span className="px-1">...</span>}
                            <button
                                onClick={() => handlePageChange(lastPage)}
                                className="px-3 py-1 rounded-md hover:bg-gray-100 cursor-pointer"
                            >
                                {lastPage}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === lastPage || isFetching}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                    >
                        Next →
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white min-h-screen p-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            {/* Stats Summary */}
            {/* Stats Summary */}
            <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {isLoading || !summary ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-xl px-4 py-3 animate-pulse">
                            <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
                            <div className="h-6 w-24 bg-gray-300 rounded mb-2" />
                            <div className="h-2 w-16 bg-gray-200 rounded" />
                        </div>
                    ))
                ) : (
                    <>
                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl px-4 py-3">
                            <span className="text-xs text-gray-500">Pending</span>
                            <p className="text-xl font-bold text-yellow-600">{fmtPrice(summary.total_pending || 0)}</p>
                            <p className="text-xs text-gray-400">{summary.pending_count || 0} settlements</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl px-4 py-3">
                            <span className="text-xs text-gray-500">Approved</span>
                            <p className="text-xl font-bold text-blue-600">{fmtPrice(summary.total_approved || 0)}</p>
                            <p className="text-xs text-gray-400">{summary.approved_count || 0} settlements</p>
                        </div>
                        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl px-4 py-3">
                            <span className="text-xs text-gray-500">Paid</span>
                            <p className="text-xl font-bold text-emerald-600">{fmtPrice(summary.total_paid || 0)}</p>
                            <p className="text-xs text-gray-400">{summary.paid_count || 0} settlements</p>
                        </div>
                        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl px-4 py-3">
                            <span className="text-xs text-gray-500">Disputed</span>
                            <p className="text-xl font-bold text-red-600">{fmtPrice(summary.total_disputed || 0)}</p>
                            <p className="text-xs text-gray-400">{summary.disputed_count || 0} settlements</p>
                        </div>
                    </>
                )}
            </div>

            {/* PageHeader */}
            <PageHeader
                title="Settlement Management"
                addButtonLabel="Generate Settlement"
                onAdd={() => navigate(ROUTES.MAGENTO_SETTLEMENT_GENERATE)}
                tabs={STATUS_TABS}
                activeTab={activeStatus}
                onTabChange={(tab) => { setActiveStatus(tab); setPage(1); }}
                filters={[]}
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                onSearchSubmit={() => { setSearch(searchInput); setPage(1); }}
                onResetFilters={handleReset}
                searchPlaceholder="Search by vendor name..."
            />

            {/* Loading Overlay */}
            {/* {isFetching && (
                <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
                    <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
                </div>
            )} */}

            {/* Table */}
            <div className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto min-h-[500px]">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                                {["Settlement #", "Vendor", "Period", "Gross Sales", "Deductions", "Net Payout", "Status", "Period End", ""].map((col, i) => (
                                    <th key={i} className="px-4 py-4 text-left font-semibold text-sm whitespace-nowrap">{col}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="bg-white">
                            {isLoading || isFetching ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-16">
                                        <div className="flex items-center justify-center gap-3 text-gray-400">
                                            <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-teal-500" />
                                            <span className="text-sm">Loading settlements…</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-16 text-red-400 text-sm">
                                        Error loading settlements. Please try again.
                                    </td>
                                </tr>
                            ) : settlements.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-16 text-gray-300 text-sm">
                                        <FaMoneyBillWave className="text-4xl mx-auto mb-3 opacity-30" />
                                        No settlements found.
                                    </td>
                                </tr>
                            ) : (
                                settlements.map((settlement, idx) => (
                                    <tr key={settlement.id} className="hover:bg-gray-50/60 transition"
                                        style={{ borderBottom: idx < settlements.length - 1 ? "1px solid #f3f4f6" : "none" }}>

                                        {/* Settlement Number */}
                                        <td className="relative pl-5 pr-4 py-3">
                                            <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-teal-400 to-teal-300" />
                                            <div>
                                                <span className="font-mono text-teal-600 text-sm font-semibold block">
                                                    {settlement.settlement_number}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    ID: {settlement.id}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Vendor */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold text-xs">
                                                    {(settlement.vendor?.company_name ?? "V").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-gray-700 text-sm font-medium truncate max-w-[150px]">
                                                        {settlement.vendor?.company_name || `Vendor #${settlement.vendor_id}`}
                                                    </p>
                                                    <p className="text-xs text-gray-400 truncate max-w-[150px]">
                                                        {settlement.vendor?.user?.email || "—"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Period */}
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="text-xs text-gray-500">{fmtDate(settlement.period_start)}</p>
                                                <p className="text-xs text-gray-400">→ {fmtDate(settlement.period_end)}</p>
                                            </div>
                                        </td>

                                        {/* Gross Sales */}
                                        <td className="px-4 py-3">
                                            <span className="font-semibold text-gray-800">{fmtPrice(settlement.gross_sales)}</span>
                                        </td>

                                        {/* Deductions */}
                                        <td className="px-4 py-3">
                                            <div className="text-xs">
                                                <p className="text-red-500">Refunds: {fmtPrice(settlement.total_refunds)}</p>
                                                <p className="text-gray-500">Fees: {fmtPrice(settlement.gateway_fees)}</p>
                                                <p className="text-gray-500">Commission: {fmtPrice(settlement.total_commissions)}</p>
                                            </div>
                                        </td>

                                        {/* Net Payout */}
                                        <td className="px-4 py-3">
                                            <span className="font-bold text-teal-600">{fmtPrice(settlement.net_payout)}</span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle(settlement.status)}`}>
                                                {statusIcon(settlement.status)}
                                                {settlement.status}
                                            </span>
                                        </td>

                                        {/* Period End */}
                                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                                            {fmtDate(settlement.period_end)}
                                        </td>

                                        {/* Actions */}
                                        <td className="relative pl-4 pr-5 py-3 text-right">
                                            <span className="absolute right-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-green-400 to-green-300" />
                                            <RowMenu
                                                settlement={settlement}
                                                onView={() => { setSelectedSettlement(settlement); setIsDrawerOpen(true); }}
                                                onApprove={() => { setSelectedSettlement(settlement); setIsApproveModalOpen(true); }}
                                                onPay={() => { setSelectedSettlement(settlement); setIsPaymentModalOpen(true); }}
                                                onDispute={() => { setSelectedSettlement(settlement); setIsDisputeModalOpen(true); }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {renderPaginationButtons()}
            </div>

            {/* Modals */}
            <ApproveModal
                isOpen={isApproveModalOpen}
                onClose={() => { setIsApproveModalOpen(false); setSelectedSettlement(null); }}
                settlement={selectedSettlement}
                onSuccess={handleSuccess}
            />

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => { setIsPaymentModalOpen(false); setSelectedSettlement(null); }}
                settlement={selectedSettlement}
                onSuccess={handleSuccess}
            />

            <DisputeModal
                isOpen={isDisputeModalOpen}
                onClose={() => { setIsDisputeModalOpen(false); setSelectedSettlement(null); }}
                settlement={selectedSettlement}
                onSuccess={handleSuccess}
            />

            <SettlementDetailDrawer
                settlement={isDrawerOpen ? selectedSettlement : null}
                onClose={() => { setIsDrawerOpen(false); setSelectedSettlement(null); }}
            />
        </div>
    );
};

export default SettlementList;