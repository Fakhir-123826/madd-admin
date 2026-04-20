import { useNavigate, useParams } from "react-router-dom";
import {
    FaChevronLeft, FaCheckCircle, FaTimesCircle, FaHourglassHalf,
    FaDownload, FaSpinner, FaMoneyBillWave, FaCalendarAlt, FaUser,
    FaReceipt, FaExchangeAlt,
} from "react-icons/fa";
import { useState } from "react";
import {
    useGetSettlementQuery,
    useApproveSettlementMutation,
    useMarkAsPaidMutation,
    useDisputeSettlementMutation,
    useLazyGetStatementUrlQuery,
    type SettlementStatus,
    type PaymentMethod,
} from "../../app/api/SettlementSlices/SettlementApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusStyle = (status: SettlementStatus) => {
    switch (status) {
        case "pending":  return "bg-yellow-100 text-yellow-600";
        case "approved": return "bg-blue-100 text-blue-600";
        case "paid":     return "bg-green-100 text-green-700";
        case "disputed": return "bg-red-100 text-red-600";
        default:         return "bg-gray-100 text-gray-500";
    }
};

const statusIcon = (status: SettlementStatus) => {
    switch (status) {
        case "pending":  return <FaHourglassHalf className="text-yellow-500" />;
        case "approved": return <FaCheckCircle className="text-blue-500" />;
        case "paid":     return <FaCheckCircle className="text-green-600" />;
        case "disputed": return <FaTimesCircle className="text-red-500" />;
        default:         return null;
    }
};

const fmt = (amount?: number | null) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount ?? 0);

const fmtDate = (date?: string | null) =>
    date
        ? new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : "—";

// ─── Sub-components ───────────────────────────────────────────────────────────

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</span>
        <span className="text-sm text-gray-700 font-medium text-right">{value}</span>
    </div>
);

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center text-white shadow-sm">
            {icon}
        </div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-widest">{title}</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-teal-100 to-transparent" />
    </div>
);

// ─── Pay Modal — payment_reference + payment_method REQUIRED by controller ───

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "paypal",        label: "PayPal" },
    { value: "stripe",        label: "Stripe" },
    { value: "manual",        label: "Manual" },
];

const PayModal = ({
    onConfirm, onCancel, isLoading,
}: {
    onConfirm: (ref: string, method: PaymentMethod, notes?: string) => void;
    onCancel: () => void;
    isLoading: boolean;
}) => {
    const [ref,    setRef]    = useState("");
    const [method, setMethod] = useState<PaymentMethod>("bank_transfer");
    const [notes,  setNotes]  = useState("");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
                <div>
                    <h3 className="text-base font-semibold text-gray-800">Mark as Paid</h3>
                    <p className="text-xs text-gray-400 mt-1">Provide payment details to confirm.</p>
                </div>

                {/* Payment Reference — REQUIRED */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Payment Reference <span className="text-teal-500">*</span>
                    </label>
                    <input
                        value={ref}
                        onChange={e => setRef(e.target.value)}
                        placeholder="e.g. TXN-2024-001234"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700
                                   focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder:text-gray-300 transition"
                    />
                </div>

                {/* Payment Method — REQUIRED, enum: bank_transfer|paypal|stripe|manual */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Payment Method <span className="text-teal-500">*</span>
                    </label>
                    <select
                        value={method}
                        onChange={e => setMethod(e.target.value as PaymentMethod)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700
                                   focus:outline-none focus:ring-2 focus:ring-teal-300 transition bg-white"
                    >
                        {PAYMENT_METHODS.map(pm => (
                            <option key={pm.value} value={pm.value}>{pm.label}</option>
                        ))}
                    </select>
                </div>

                {/* Notes — optional */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes (optional)</label>
                    <textarea
                        rows={2}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Any additional notes…"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700
                                   focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder:text-gray-300 resize-none transition"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => onConfirm(ref, method, notes || undefined)}
                        disabled={isLoading || !ref.trim()}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium
                                   disabled:opacity-50 hover:from-teal-500 hover:to-green-500 transition flex items-center justify-center gap-2"
                    >
                        {isLoading && <FaSpinner className="animate-spin text-xs" />}
                        Confirm Payment
                    </button>
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-gray-300 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Dispute Modal — controller validates 'reason' not 'notes' ────────────────

const DisputeModal = ({
    onConfirm, onCancel, isLoading,
}: {
    onConfirm: (reason: string) => void;
    onCancel: () => void;
    isLoading: boolean;
}) => {
    const [reason, setReason] = useState("");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
                <div>
                    <h3 className="text-base font-semibold text-gray-800">Dispute Settlement</h3>
                    <p className="text-xs text-gray-400 mt-1">Provide a clear reason for disputing.</p>
                </div>
                <div className="flex flex-col gap-1.5">
                    {/* Field name must be 'reason' — controller: $request->validate(['reason' => 'required|string']) */}
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Reason <span className="text-teal-500">*</span>
                    </label>
                    <textarea
                        rows={4}
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="Explain the dispute reason…"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700
                                   focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder:text-gray-300 resize-none transition"
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => onConfirm(reason)}
                        disabled={isLoading || !reason.trim()}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-400 to-red-500 text-white text-sm font-medium
                                   disabled:opacity-50 hover:from-red-500 hover:to-red-600 transition flex items-center justify-center gap-2"
                    >
                        {isLoading && <FaSpinner className="animate-spin text-xs" />}
                        Submit Dispute
                    </button>
                    <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-gray-300 transition">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const SettlementDetail = () => {
    const navigate = useNavigate();
    const { id }   = useParams<{ id: string }>();

    // show() returns { settlement, transaction_summary, orders_count, total_orders_value }
    const { data, isLoading, isError } = useGetSettlementQuery(id ?? "");
    const [approve, { isLoading: approving }] = useApproveSettlementMutation();
    const [pay,     { isLoading: paying }]    = useMarkAsPaidMutation();
    const [dispute, { isLoading: disputing }] = useDisputeSettlementMutation();
    const [triggerStatement]                  = useLazyGetStatementUrlQuery();

    const [showPay,      setShowPay]      = useState(false);
    const [showDispute,  setShowDispute]  = useState(false);
    const [downloading,  setDownloading]  = useState(false);
    const [toast, setToast]               = useState<{ type: "success" | "error"; msg: string } | null>(null);

    // Destructure the nested response shape from show()
    const settlement       = data?.data?.settlement;
    const txSummary        = data?.data?.transaction_summary;
    const ordersCount      = data?.data?.orders_count ?? 0;
    const totalOrdersValue = data?.data?.total_orders_value ?? 0;

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    const handleApprove = async () => {
        if (!id) return;
        try {
            await approve({ id }).unwrap();
            showToast("success", "Settlement approved successfully.");
        } catch {
            showToast("error", "Failed to approve settlement.");
        }
    };

    const handlePay = async (ref: string, method: PaymentMethod, notes?: string) => {
        if (!id) return;
        try {
            await pay({ id, data: { payment_reference: ref, payment_method: method, notes } }).unwrap();
            showToast("success", "Settlement marked as paid.");
            setShowPay(false);
        } catch {
            showToast("error", "Failed to mark as paid.");
        }
    };

    const handleDispute = async (reason: string) => {
        if (!id) return;
        try {
            // Sends { reason: string } — matches controller validation
            await dispute({ id, data: { reason } }).unwrap();
            showToast("success", "Settlement disputed.");
            setShowDispute(false);
        } catch {
            showToast("error", "Failed to dispute settlement.");
        }
    };

    // downloadStatement returns JSON { download_url, filename } — open in new tab
    const handleDownload = async () => {
        if (!id) return;
        setDownloading(true);
        try {
            const res = await triggerStatement(id).unwrap();
            if (res.data?.download_url) {
                window.open(res.data.download_url, "_blank");
            } else {
                showToast("error", "Download URL not available.");
            }
        } catch {
            showToast("error", "Failed to get statement URL.");
        } finally {
            setDownloading(false);
        }
    };

    // ── Loading / Error ───────────────────────────────────────────────────────

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 text-gray-400">
                    <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
                    <span className="text-sm">Loading settlement…</span>
                </div>
            </div>
        );
    }

    if (isError || !settlement) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-red-400 text-sm">
                Failed to load settlement details.
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────

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

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/settlements")}
                        className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-600 hover:border-teal-300 transition">
                        <FaChevronLeft className="text-xs" />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-800">Settlement Details</h1>
                        <p className="text-xs text-gray-400">
                            {settlement.settlement_number} · {settlement.currency_code}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={handleDownload} disabled={downloading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-teal-300 hover:text-teal-600 transition disabled:opacity-50"
                    >
                        {downloading ? <FaSpinner className="animate-spin text-xs" /> : <FaDownload className="text-xs" />}
                        Statement
                    </button>

                    {settlement.status === "pending" && (
                        <button onClick={handleApprove} disabled={approving}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition disabled:opacity-50">
                            {approving ? <FaSpinner className="animate-spin text-xs" /> : <FaCheckCircle className="text-xs" />}
                            Approve
                        </button>
                    )}

                    {/* Pay requires a modal for payment_reference + payment_method */}
                    {settlement.status === "approved" && (
                        <button onClick={() => setShowPay(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium shadow hover:shadow-md transition">
                            <FaMoneyBillWave className="text-xs" />
                            Mark as Paid
                        </button>
                    )}

                    {(settlement.status === "pending" || settlement.status === "approved") && (
                        <button onClick={() => setShowDispute(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm hover:bg-red-50 transition">
                            <FaTimesCircle className="text-xs" />
                            Dispute
                        </button>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Financial Hero */}
                    <div className="bg-gradient-to-br from-teal-400 to-green-400 rounded-2xl p-6 text-white shadow">
                        <p className="text-xs uppercase tracking-widest opacity-80 mb-1">Net Payout</p>
                        {/* net_payout is the correct field from controller */}
                        <p className="text-4xl font-bold">{fmt(settlement.net_payout)}</p>
                        <div className="grid grid-cols-3 gap-4 mt-5 text-sm">
                            <div>
                                <p className="text-xs opacity-70">Gross Sales</p>
                                <p className="font-semibold">{fmt(settlement.gross_sales)}</p>
                            </div>
                            <div>
                                <p className="text-xs opacity-70">Total Refunds</p>
                                <p className="font-semibold">-{fmt(settlement.total_refunds)}</p>
                            </div>
                            <div>
                                <p className="text-xs opacity-70">Gateway Fees</p>
                                <p className="font-semibold">-{fmt(settlement.gateway_fees)}</p>
                            </div>
                            <div>
                                <p className="text-xs opacity-70">Commission</p>
                                <p className="font-semibold">-{fmt(settlement.total_commissions)}</p>
                            </div>
                            <div>
                                <p className="text-xs opacity-70">Shipping Fees</p>
                                <p className="font-semibold">{fmt(settlement.total_shipping_fees)}</p>
                            </div>
                            <div>
                                <p className="text-xs opacity-70">Tax Collected</p>
                                <p className="font-semibold">{fmt(settlement.total_tax_collected)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Summary — from show() transaction_summary */}
                    {txSummary && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                            <SectionHeader icon={<FaExchangeAlt className="text-xs" />} title="Transaction Summary" />
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { label: "Sales",       value: txSummary.sales,       color: "text-green-600" },
                                    { label: "Refunds",     value: txSummary.refunds,     color: "text-red-500" },
                                    { label: "Commissions", value: txSummary.commissions, color: "text-orange-500" },
                                    { label: "Adjustments", value: txSummary.adjustments, color: "text-blue-500" },
                                    { label: "Fees",        value: txSummary.fees,        color: "text-purple-500" },
                                ].map(item => (
                                    <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
                                        <p className={`text-sm font-bold ${item.color}`}>{fmt(item.value)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Orders Summary — from show() orders_count & total_orders_value */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <SectionHeader icon={<FaReceipt className="text-xs" />} title="Orders" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-teal-50 rounded-xl p-4">
                                <p className="text-xs text-teal-500 uppercase tracking-wide mb-1">Total Orders</p>
                                <p className="text-2xl font-bold text-teal-700">{ordersCount}</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4">
                                <p className="text-xs text-green-500 uppercase tracking-wide mb-1">Orders Value</p>
                                <p className="text-2xl font-bold text-green-700">{fmt(totalOrdersValue)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Settlement Info */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <SectionHeader icon={<FaCalendarAlt className="text-xs" />} title="Settlement Info" />
                        <InfoRow label="Status" value={
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium capitalize ${statusStyle(settlement.status)}`}>
                                {statusIcon(settlement.status)}
                                {settlement.status}
                            </span>
                        } />
                        <InfoRow label="Settlement #"    value={settlement.settlement_number} />
                        <InfoRow label="Period Start"    value={fmtDate(settlement.period_start)} />
                        <InfoRow label="Period End"      value={fmtDate(settlement.period_end)} />
                        <InfoRow label="Currency"        value={settlement.currency_code} />
                        <InfoRow label="Payment Method"  value={settlement.payment_method ?? "—"} />
                        <InfoRow label="Payment Ref"     value={settlement.payment_reference ?? "—"} />
                        <InfoRow label="Approved By"     value={settlement.approvedBy?.full_name ?? "—"} />
                        <InfoRow label="Created"         value={fmtDate(settlement.created_at)} />
                    </div>

                    {/* Timeline */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <SectionHeader icon={<FaCalendarAlt className="text-xs" />} title="Activity Timeline" />
                        <div className="space-y-3 pl-2">
                            {[
                                { label: "Created",  date: settlement.created_at,  color: "bg-gray-300" },
                                { label: "Approved", date: settlement.approved_at, color: "bg-blue-400" },
                                { label: "Paid",     date: settlement.paid_at,     color: "bg-green-400" },
                                { label: "Disputed", date: settlement.disputed_at, color: "bg-red-400" },
                            ].filter(i => i.date).map(item => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${item.color}`} />
                                    <p className="text-xs text-gray-500">
                                        <span className="font-medium text-gray-700">{item.label}</span> — {fmtDate(item.date)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes / Dispute reason */}
                    {settlement.notes && (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                            <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-2">Notes / Dispute Reason</p>
                            <p className="text-sm text-red-600 whitespace-pre-line">{settlement.notes}</p>
                        </div>
                    )}
                </div>

                {/* Right Column — Vendor */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <SectionHeader icon={<FaUser className="text-xs" />} title="Vendor" />
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg">
                                {(settlement.vendor?.company_name ?? "V").charAt(0).toUpperCase()}
                            </div>
                            <div>
                                {/* company_name from controller */}
                                <p className="font-semibold text-gray-800 text-sm">{settlement.vendor?.company_name ?? `Vendor #${settlement.vendor_id}`}</p>
                                <p className="text-xs text-gray-400">{settlement.vendor?.user?.email ?? "—"}</p>
                            </div>
                        </div>
                        <InfoRow label="Vendor ID"   value={`#${settlement.vendor_id}`} />
                        <InfoRow label="Company Slug" value={settlement.vendor?.company_slug ?? "—"} />
                    </div>
                </div>
            </div>

            {/* Pay Modal */}
            {showPay && (
                <PayModal
                    onConfirm={handlePay}
                    onCancel={() => setShowPay(false)}
                    isLoading={paying}
                />
            )}

            {/* Dispute Modal */}
            {showDispute && (
                <DisputeModal
                    onConfirm={handleDispute}
                    onCancel={() => setShowDispute(false)}
                    isLoading={disputing}
                />
            )}
        </div>
    );
};

export default SettlementDetail;