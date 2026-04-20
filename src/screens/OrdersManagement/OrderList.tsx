import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import {
  FaSync, FaSearch, FaTimes, FaExclamationTriangle,
  FaShoppingBag, FaTimesCircle,
} from "react-icons/fa";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useProcessRefundMutation,
  type OrderStatus,
  type PaymentStatus,
  type Order,
} from "../../app/api/OrderSlices/OrderApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (val: string | number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(val));

const fmtDate = (date: string) =>
  new Date(date).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

// ─── Status Styles ────────────────────────────────────────────────────────────

const orderStatusStyle = (status: string) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-700";
    case "processing": return "bg-blue-100 text-blue-700";
    case "shipped": return "bg-purple-100 text-purple-700";
    case "delivered":
    case "completed": return "bg-green-100 text-green-700";
    case "cancelled": return "bg-red-100 text-red-600";
    case "refunded": return "bg-gray-100 text-gray-600";
    default: return "bg-gray-100 text-gray-500";
  }
};

const paymentStatusStyle = (status: string) => {
  switch (status) {
    case "paid": return "bg-green-100 text-green-700";
    case "pending": return "bg-yellow-100 text-yellow-600";
    case "refunded": return "bg-gray-100 text-gray-500";
    case "chargeback": return "bg-red-100 text-red-600";
    default: return "bg-gray-100 text-gray-500";
  }
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_TABS: { label: string; value: OrderStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
];

const STATUS_OPTIONS: OrderStatus[] = [
  "pending", "processing", "shipped", "delivered", "completed", "cancelled", "refunded",
];

// ─── Update Status Modal ──────────────────────────────────────────────────────

const UpdateStatusModal = ({
  order, onConfirm, onCancel, isLoading,
}: {
  order: Order;
  onConfirm: (status: OrderStatus, notes?: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Update Order Status</h3>
          <p className="text-xs text-gray-400 mt-1">Order: <span className="font-mono text-teal-600">{order.magento_order_increment_id}</span></p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            New Status <span className="text-teal-500">*</span>
          </label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as OrderStatus)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes (optional)</label>
          <textarea
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Reason for status change…"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder:text-gray-300 resize-none transition"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(status, notes || undefined)}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isLoading && <FaSync className="animate-spin text-xs" />}
            Update Status
          </button>
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-gray-300 transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Cancel Modal ─────────────────────────────────────────────────────────────

const CancelModal = ({
  order, onConfirm, onCancel, isLoading,
}: {
  order: Order;
  onConfirm: (reason: string, notes?: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Cancel Order</h3>
          <p className="text-xs text-gray-400 mt-1">Order: <span className="font-mono text-teal-600">{order.magento_order_increment_id}</span></p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Reason <span className="text-red-500">*</span>
          </label>
          <input
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Why is this order being cancelled?"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 placeholder:text-gray-300 transition"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Additional Notes (optional)</label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any extra info…"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-200 placeholder:text-gray-300 resize-none transition"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(reason, notes || undefined)}
            disabled={isLoading || !reason.trim()}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-400 to-red-500 text-white text-sm font-medium disabled:opacity-50 hover:from-red-500 hover:to-red-600 transition flex items-center justify-center gap-2"
          >
            {isLoading && <FaSync className="animate-spin text-xs" />}
            Cancel Order
          </button>
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-gray-300 transition">
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Refund Modal ─────────────────────────────────────────────────────────────

const RefundModal = ({
  order, onConfirm, onCancel, isLoading,
}: {
  order: Order;
  onConfirm: (amount: number, reason: string, notes?: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [amount, setAmount] = useState(order.grand_total);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Process Refund</h3>
          <p className="text-xs text-gray-400 mt-1">
            Order: <span className="font-mono text-teal-600">{order.magento_order_increment_id}</span>
            &nbsp;· Max: <span className="font-semibold text-gray-600">{fmt(order.grand_total)}</span>
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Refund Amount <span className="text-teal-500">*</span>
          </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            max={order.grand_total}
            step="0.01"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Reason <span className="text-teal-500">*</span>
          </label>
          <input
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Reason for refund…"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder:text-gray-300 transition"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes (optional)</label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Additional notes…"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder:text-gray-300 resize-none transition"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(Number(amount), reason, notes || undefined)}
            disabled={isLoading || !reason.trim() || !amount}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isLoading && <FaSync className="animate-spin text-xs" />}
            Process Refund
          </button>
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-gray-300 transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Row Action Menu ──────────────────────────────────────────────────────────

const RowActions = ({
  order,
  onView,
  onUpdateStatus,
  onCancel,
  onRefund,
}: {
  order: Order;
  onView: () => void;
  onUpdateStatus: () => void;
  onCancel: () => void;
  onRefund: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-end gap-2 relative">
      {/* Quick view */}
      <button
        onClick={onView}
        className="text-gray-400 hover:text-teal-600 transition"
        title="View details"
      >
        <Eye size={16} />
      </button>

      {/* More actions */}
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-gray-600 transition text-lg leading-none pb-0.5"
        title="More actions"
      >
        ···
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
            <button
              onClick={() => { onUpdateStatus(); setOpen(false); }}
              className="w-full text-left px-4 py-2 hover:bg-teal-50 text-teal-600"
            >
              Update Status
            </button>
            {order.status !== "cancelled" && order.status !== "refunded" && (
              <button
                onClick={() => { onCancel(); setOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500"
              >
                Cancel Order
              </button>
            )}
            {order.payment_status === "paid" && order.status !== "refunded" && (
              <button
                onClick={() => { onRefund(); setOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-yellow-50 text-yellow-600"
              >
                Process Refund
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

type ModalType = "status" | "cancel" | "refund" | null;

function OrderList() {
  const navigate = useNavigate();

  // ── Filters & Pagination ──
  const [activeStatus, setActiveStatus] = useState<OrderStatus | "">("");
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // ── Modals ──
  const [modal, setModal] = useState<{ type: ModalType; order: Order | null }>({ type: null, order: null });
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const tdBase = "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  // ── API ──
  const { data, isLoading, isError, refetch } = useGetOrdersQuery({
    page,
    status: activeStatus || undefined,
    search: search || undefined,
  });

  const [updateStatus, { isLoading: updatingStatus }] = useUpdateOrderStatusMutation();
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const [processRefund, { isLoading: refunding }] = useProcessRefundMutation();

  const orders = data?.data ?? [];            // ✅ direct array
  const lastPage = data?.meta?.last_page ?? 1;  // ✅ from meta
  const total = data?.meta?.total ?? 0;      // ✅ from meta

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const closeModal = () => setModal({ type: null, order: null });

  // ── Handlers ──
  const handleUpdateStatus = async (status: OrderStatus, notes?: string) => {
    if (!modal.order) return;
    try {
      await updateStatus({ id: modal.order.id, data: { status, notes } }).unwrap();
      showToast("success", `Order status updated to "${status}".`);
      closeModal();
    } catch {
      showToast("error", "Failed to update order status.");
    }
  };

  const handleCancel = async (reason: string, notes?: string) => {
    if (!modal.order) return;
    try {
      await cancelOrder({ id: modal.order.id, data: { reason, notes } }).unwrap();
      showToast("success", "Order cancelled successfully.");
      closeModal();
    } catch {
      showToast("error", "Failed to cancel order.");
    }
  };

  const handleRefund = async (amount: number, reason: string, notes?: string) => {
    if (!modal.order) return;
    try {
      await processRefund({ id: modal.order.id, data: { amount, reason, notes } }).unwrap();
      showToast("success", "Refund processed successfully.");
      closeModal();
    } catch {
      showToast("error", "Failed to process refund.");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

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
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Orders Management</h2>
          {!isLoading && (
            <p className="text-xs text-gray-400 mt-0.5">{total} total orders</p>
          )}
        </div>
        <button
          onClick={() => refetch()}
          className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 hover:border-teal-300 transition"
        >
          <FaSync className="text-xs" />
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-5 border-b border-gray-100 mb-4 overflow-x-auto">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => { setActiveStatus(tab.value); setPage(1); }}
            className={`pb-2.5 text-sm whitespace-nowrap transition-colors border-b-2 -mb-px ${activeStatus === tab.value
                ? "border-teal-500 text-teal-600 font-medium"
                : "border-transparent text-gray-400 hover:text-teal-500"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5 max-w-sm">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Order ID, customer email…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder:text-gray-300"
          />
        </div>
        <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium">
          Search
        </button>
        {search && (
          <button type="button" onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
            className="px-3 py-2 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600">
            <FaTimes className="text-xs" />
          </button>
        )}
      </form>

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-sm text-red-500 mb-4">
          <FaExclamationTriangle />
          Failed to load orders. Please try again.
        </div>
      )}

      {/* Table */}
      <div className="rounded-t-3xl overflow-x-auto mt-2">
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Vendor</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Payment</th>
              <th className="p-4 text-left">Source</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Pay Status</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4" />
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="bg-white">
                  {[...Array(10)].map((__, j) => (
                    <td key={j} className="p-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-16 text-gray-300">
                  <FaShoppingBag className="text-4xl mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No orders found.</p>
                </td>
              </tr>
            ) : orders.map(order => (
              <tr key={order.id} className="bg-white shadow-sm hover:shadow-md transition">

                {/* Order ID */}
                <td className={`${tdBase} font-medium rounded-l-xl`}>
                  <p className="font-mono text-teal-600 text-xs font-semibold">{order.magento_order_increment_id}</p>
                  <p className="text-xs text-gray-400 capitalize">{order.fulfillment_status}</p>
                </td>

                {/* Customer */}
                <td className={tdBase}>
                  <p className="text-gray-700 text-xs font-medium">
                    {order.customer_firstname} {order.customer_lastname}
                  </p>
                  <p className="text-xs text-gray-400 truncate max-w-[140px]">{order.customer_email}</p>
                </td>

                {/* Vendor */}
                <td className={tdBase}>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xs flex-shrink-0">
                      {(order.vendor?.name ?? "V").charAt(0)}
                    </div>
                    <p className="text-xs text-gray-600 truncate max-w-[100px]">
                      {order.vendor?.name ?? "—"}
                    </p>
                  </div>
                </td>

                {/* Date */}
                <td className={tdBase}>
                  <p className="text-xs text-gray-500 whitespace-nowrap">{fmtDate(order.created_at)}</p>
                </td>

                {/* Payment method */}
                <td className={tdBase}>
                  <p className="text-xs text-gray-600 capitalize">{order.payment_method.replace(/_/g, " ")}</p>
                </td>

                {/* Source */}
                <td className={tdBase}>
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-xs capitalize">
                    {order.source}
                  </span>
                </td>

                {/* Grand Total */}
                <td className={`${tdBase} font-bold text-gray-800`}>
                  {fmt(order.grand_total)}
                </td>

                {/* Payment Status */}
                <td className={tdBase}>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${paymentStatusStyle(order.payment_status)}`}>
                    {order.payment_status}
                  </span>
                </td>

                {/* Order Status */}
                <td className={tdBase}>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${orderStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="relative p-4 rounded-r-xl">
                  <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                  <RowActions
                    order={order}
                    onView={() => navigate(`/orders/${order.uuid}`)}
                    onUpdateStatus={() => setModal({ type: "status", order })}
                    onCancel={() => setModal({ type: "cancel", order })}
                    onRefund={() => setModal({ type: "refund", order })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-600">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40">← Back</button>
        {[...Array(lastPage)].map((_, i) => (
          <button
            key={i} onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-md ${page === i + 1 ? "bg-gradient-to-r from-teal-400 to-green-400 text-white" : "hover:bg-gray-100"}`}
          >
            {i + 1}
          </button>
        ))}
        <button disabled={page === lastPage} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40">Next →</button>
      </div>

      {/* Modals */}
      {modal.type === "status" && modal.order && (
        <UpdateStatusModal
          order={modal.order}
          onConfirm={handleUpdateStatus}
          onCancel={closeModal}
          isLoading={updatingStatus}
        />
      )}
      {modal.type === "cancel" && modal.order && (
        <CancelModal
          order={modal.order}
          onConfirm={handleCancel}
          onCancel={closeModal}
          isLoading={cancelling}
        />
      )}
      {modal.type === "refund" && modal.order && (
        <RefundModal
          order={modal.order}
          onConfirm={handleRefund}
          onCancel={closeModal}
          isLoading={refunding}
        />
      )}
    </div>
  );
}

export default OrderList;