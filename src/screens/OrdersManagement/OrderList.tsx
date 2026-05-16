// import { useState, useRef, useEffect } from "react";
// import {
//   FaEllipsisV,
//   FaEye,
//   FaSync,
//   FaTimes,
//   FaExclamationTriangle,
//   FaShoppingBag,
//   FaTruck,
//   FaBoxes,
//   FaUsers,
//   FaStore,
//   FaUser,
//   FaMoneyBillWave,
//   FaCreditCard,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaEnvelope,
//   FaChevronLeft,
//   FaChevronRight,
//   FaFilter,
//   FaCalendarAlt,
//   FaSearch,
//   FaSlidersH,
// } from "react-icons/fa";
// import {
//   FiShield,
//   FiAlertCircle,
//   FiCheck,
//   FiX,
//   FiClock,
//   FiCalendar,
//   FiDollarSign,
//   FiCreditCard,
// } from "react-icons/fi";
// import {
//   useGetOrdersQuery,
//   useGetOrderStatisticsQuery,
//   useUpdateOrderStatusMutation,
//   useCancelOrderMutation,
//   useProcessRefundMutation,
//   type Order,
//   type OrderStatus,
// } from "../../app/api/OrderSlices/OrderApi";
// import { useGetVendorsQuery } from "../../app/api/VendorSlices/VendorApi";
// import { useGetStoresByVendorQuery } from "../../app/api/StoreSlices/StoreApi";
// import { useNavigate } from "react-router-dom";
// import PageHeader from "../../component/PageHeader/Pageheaderfilterbar";

// // ─── Types based on actual API response ──────────────────────────────────────

// interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   avatar?: string;
// }

// interface Vendor {
//   id: string;
//   uuid: string;
//   name: string;
//   slug: string;
//   company_name?: string;
// }

// interface Store {
//   id: string;
//   uuid: string;
//   store_name: string;
//   vendor_id: string;
//   magento_store_id?: number;
// }

// interface StoreAddress {
//   street: string;
//   city: string;
//   state: string;
//   zipcode: string;
//   country: string;
//   phone: string;
//   firstname: string;
//   lastname: string;
// }

// interface OrderItem {
//   id: number;
//   product_name: string;
//   qty_ordered: number;
//   price: number;
//   row_total: number;
//   sku?: string;
//   product_image?: string;
// }

// interface OrderData {
//   id: number;
//   uuid: string;
//   order_number: string | null;
//   magento_order_id: number;
//   magento_order_increment_id: string;
//   status: string;
//   status_label: string;
//   status_color: string;
//   payment_status: string;
//   fulfillment_status: string;
//   customer: Customer;
//   customer_name: string;
//   customer_email: string;
//   is_guest: boolean | null;
//   vendor: Vendor;
//   store: Store;
//   currency: string;
//   subtotal: string;
//   tax_amount: string;
//   tax_rate: string;
//   shipping_amount: string;
//   discount_amount: string;
//   grand_total: string;
//   commission_amount: string;
//   commission_rate: string;
//   vendor_payout_amount: string;
//   payment_method: string;
//   payment_fee: string;
//   shipping_method: string;
//   tracking_number: string | null;
//   coupon_code: string | null;
//   shipping_address: StoreAddress;
//   billing_address: StoreAddress;
//   customer_note: string | null;
//   admin_note: string | null;
//   items: OrderItem[];
//   is_settled: boolean | null;
//   settled_at: string | null;
//   created_at: string;
//   updated_at: string;
//   shipped_at: string | null;
//   delivered_at: string | null;
//   source: string;
//   can_be_cancelled: boolean;
//   can_be_refunded: boolean;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const fmtDate = (d: string) =>
//   new Date(d).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

// const fmtDateTime = (d: string) =>
//   new Date(d).toLocaleString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });

// const fmtPrice = (price: string | number) => {
//   const num = typeof price === "string" ? parseFloat(price) : price;
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//   }).format(num);
// };

// const orderStatusStyle = (status: string) => {
//   switch (status?.toLowerCase()) {
//     case "pending":
//       return "bg-yellow-50 text-yellow-600 border-yellow-200";
//     case "processing":
//       return "bg-blue-50 text-blue-600 border-blue-200";
//     case "shipped":
//       return "bg-purple-50 text-purple-600 border-purple-200";
//     case "delivered":
//     case "completed":
//       return "bg-emerald-50 text-emerald-600 border-emerald-200";
//     case "cancelled":
//       return "bg-red-50 text-red-600 border-red-200";
//     case "refunded":
//       return "bg-gray-50 text-gray-500 border-gray-200";
//     default:
//       return "bg-gray-100 text-gray-500 border-gray-200";
//   }
// };

// const paymentStatusStyle = (status: string) => {
//   switch (status?.toLowerCase()) {
//     case "paid":
//       return "bg-emerald-100 text-emerald-700";
//     case "pending":
//       return "bg-yellow-100 text-yellow-700";
//     case "refunded":
//       return "bg-gray-100 text-gray-500";
//     case "chargeback":
//       return "bg-red-100 text-red-700";
//     case "failed":
//       return "bg-red-100 text-red-700";
//     default:
//       return "bg-gray-100 text-gray-500";
//   }
// };

// // ─── Tabs config ──────────────────────────────────────────────────────────────

// const STATUS_TABS = [
//   { key: "", label: "All Orders" },
//   { key: "pending", label: "Pending" },
//   { key: "processing", label: "Processing" },
//   { key: "shipped", label: "Shipped" },
//   { key: "delivered", label: "Delivered" },
//   { key: "cancelled", label: "Cancelled" },
//   { key: "refunded", label: "Refunded" },
// ];

// // ─── Status Update Modal ──────────────────────────────────────────────────────

// const StatusUpdateModal = ({
//   isOpen,
//   onClose,
//   order,
//   vendorUuid,
//   storeUuid,
//   onSuccess,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   order: OrderData | null;
//   vendorUuid: string;
//   storeUuid: string;
//   onSuccess: () => void;
// }) => {
//   const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
//   const [status, setStatus] = useState<string>("");
//   const [notes, setNotes] = useState("");
//   const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

//   const STATUS_OPTIONS = [
//     "pending", "processing", "shipped", "delivered", "completed", "cancelled", "refunded",
//   ];

//   const showMsg = (type: "success" | "error", msg: string) => {
//     setModalToast({ type, msg });
//     setTimeout(() => setModalToast(null), 3000);
//   };

//   const handleUpdate = async () => {
//     if (!order) return;
//     try {
//       await updateStatus({
//         id: order.id,
//         data: {
//           status,
//           notes: notes || undefined,
//           vendor_uuid: vendorUuid,
//           store_uuid: storeUuid
//         },
//       }).unwrap();
//       showMsg("success", `Order status updated to ${status}`);
//       setTimeout(() => { onSuccess(); onClose(); }, 1500);
//     } catch (e: any) {
//       showMsg("error", e?.data?.message || "Failed to update status");
//     }
//   };

//   useEffect(() => {
//     if (order) {
//       setStatus(order.status);
//     }
//   }, [order]);

//   if (!isOpen || !order) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       {modalToast && (
//         <div className={`fixed top-5 right-5 z-[60] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
//                     ${modalToast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
//           <span>{modalToast.type === "success" ? "✓" : "✕"}</span>
//           {modalToast.msg}
//         </div>
//       )}
//       <div className="fixed inset-0 bg-black/50" onClick={onClose} />
//       <div className="relative min-h-screen flex items-center justify-center p-4">
//         <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
//           <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
//           <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
//             <div>
//               <h2 className="text-lg font-bold text-gray-800">Update Order Status</h2>
//               <p className="text-sm text-gray-500 mt-0.5">
//                 Order #{order.magento_order_increment_id}
//               </p>
//             </div>
//             <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
//           </div>

//           <div className="p-6 space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Current Status
//               </label>
//               <div className="mb-3">
//                 <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${orderStatusStyle(order.status)}`}>
//                   <span className="w-1.5 h-1.5 rounded-full bg-current" />
//                   {order.status_label || order.status}
//                 </span>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 New Status *
//               </label>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
//               >
//                 {STATUS_OPTIONS.map((s) => (
//                   <option key={s} value={s} className="capitalize">
//                     {s.charAt(0).toUpperCase() + s.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Notes (Optional)
//               </label>
//               <textarea
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 placeholder="Add any notes about this status change..."
//                 rows={3}
//                 className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
//               />
//             </div>

//             <div className="flex gap-3 pt-2">
//               <button
//                 onClick={onClose}
//                 className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdate}
//                 disabled={isUpdating}
//                 className="flex-1 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
//               >
//                 {isUpdating ? "Updating..." : "Update Status"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Cancel Order Modal ───────────────────────────────────────────────────────

// const CancelOrderModal = ({
//   isOpen,
//   onClose,
//   order,
//   vendorUuid,
//   storeUuid,
//   onSuccess,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   order: OrderData | null;
//   vendorUuid: string;
//   storeUuid: string;
//   onSuccess: () => void;
// }) => {
//   const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
//   const [reason, setReason] = useState("");
//   const [notes, setNotes] = useState("");
//   const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

//   const showMsg = (type: "success" | "error", msg: string) => {
//     setModalToast({ type, msg });
//     setTimeout(() => setModalToast(null), 3000);
//   };

//   const handleCancel = async () => {
//     if (!order) return;
//     if (!reason.trim()) {
//       showMsg("error", "Please provide a reason for cancellation");
//       return;
//     }
//     try {
//       await cancelOrder({
//         id: order.id,
//         data: {
//           reason,
//           notes: notes || undefined,
//           vendor_uuid: vendorUuid,
//           store_uuid: storeUuid
//         },
//       }).unwrap();
//       showMsg("success", `Order #${order.magento_order_increment_id} cancelled`);
//       setTimeout(() => { onSuccess(); onClose(); }, 1500);
//     } catch (e: any) {
//       showMsg("error", e?.data?.message || "Failed to cancel order");
//     }
//   };

//   if (!isOpen || !order) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       {modalToast && (
//         <div className={`fixed top-5 right-5 z-[60] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
//                     ${modalToast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
//           <span>{modalToast.type === "success" ? "✓" : "✕"}</span>
//           {modalToast.msg}
//         </div>
//       )}
//       <div className="fixed inset-0 bg-black/50" onClick={onClose} />
//       <div className="relative min-h-screen flex items-center justify-center p-4">
//         <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
//           <div className="h-1 bg-gradient-to-r from-red-400 to-red-500 rounded-t-2xl" />
//           <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
//             <div>
//               <h2 className="text-lg font-bold text-gray-800">Cancel Order</h2>
//               <p className="text-sm text-gray-500 mt-0.5">
//                 Order #{order.magento_order_increment_id}
//               </p>
//             </div>
//             <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
//           </div>

//           <div className="p-6 space-y-4">
//             <div className="bg-red-50 rounded-xl p-3 text-sm text-red-600">
//               ⚠️ Cancelling this order will notify the customer and vendor.
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Reason for Cancellation *
//               </label>
//               <textarea
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//                 placeholder="e.g., Out of stock, Customer request, Payment issue..."
//                 rows={3}
//                 className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Additional Notes (Optional)
//               </label>
//               <textarea
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 placeholder="Internal notes..."
//                 rows={2}
//                 className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
//               />
//             </div>

//             <div className="flex gap-3 pt-2">
//               <button
//                 onClick={onClose}
//                 className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleCancel}
//                 disabled={isCancelling || !reason.trim()}
//                 className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition disabled:opacity-50"
//               >
//                 {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Refund Modal ─────────────────────────────────────────────────────────────

// const RefundModal = ({
//   isOpen,
//   onClose,
//   order,
//   vendorUuid,
//   storeUuid,
//   onSuccess,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   order: OrderData | null;
//   vendorUuid: string;
//   storeUuid: string;
//   onSuccess: () => void;
// }) => {
//   const [processRefund, { isLoading: isRefunding }] = useProcessRefundMutation();
//   const [amount, setAmount] = useState(0);
//   const [reason, setReason] = useState("");
//   const [notes, setNotes] = useState("");
//   const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

//   const showMsg = (type: "success" | "error", msg: string) => {
//     setModalToast({ type, msg });
//     setTimeout(() => setModalToast(null), 3000);
//   };

//   useEffect(() => {
//     if (order) {
//       setAmount(parseFloat(order.grand_total));
//     }
//   }, [order]);

//   const handleRefund = async () => {
//     if (!order) return;
//     if (!reason.trim()) {
//       showMsg("error", "Please provide a reason for refund");
//       return;
//     }
//     const maxAmount = parseFloat(order.grand_total);
//     if (amount <= 0 || amount > maxAmount) {
//       showMsg("error", "Invalid refund amount");
//       return;
//     }
//     try {
//       await processRefund({
//         id: order.id,
//         data: {
//           amount,
//           reason,
//           notes: notes || undefined,
//           vendor_uuid: vendorUuid,
//           store_uuid: storeUuid
//         },
//       }).unwrap();
//       showMsg("success", `Refund of ${fmtPrice(amount)} processed`);
//       setTimeout(() => { onSuccess(); onClose(); }, 1500);
//     } catch (e: any) {
//       showMsg("error", e?.data?.message || "Failed to process refund");
//     }
//   };

//   if (!isOpen || !order) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       {modalToast && (
//         <div className={`fixed top-5 right-5 z-[60] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
//                     ${modalToast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
//           <span>{modalToast.type === "success" ? "✓" : "✕"}</span>
//           {modalToast.msg}
//         </div>
//       )}
//       <div className="fixed inset-0 bg-black/50" onClick={onClose} />
//       <div className="relative min-h-screen flex items-center justify-center p-4">
//         <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
//           <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
//           <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
//             <div>
//               <h2 className="text-lg font-bold text-gray-800">Process Refund</h2>
//               <p className="text-sm text-gray-500 mt-0.5">
//                 Order #{order.magento_order_increment_id}
//               </p>
//             </div>
//             <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
//           </div>

//           <div className="p-6 space-y-4">
//             <div className="bg-gray-50 rounded-xl p-3 flex justify-between text-sm">
//               <span className="text-gray-500">Order Total:</span>
//               <span className="font-semibold text-gray-800">{fmtPrice(order.grand_total)}</span>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Refund Amount *
//               </label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(parseFloat(e.target.value))}
//                 min={0}
//                 max={parseFloat(order.grand_total)}
//                 step="0.01"
//                 className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
//               />
//               <p className="text-xs text-gray-400 mt-1">Max: {fmtPrice(order.grand_total)}</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Reason for Refund *
//               </label>
//               <textarea
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//                 placeholder="e.g., Damaged product, Wrong item, Customer return..."
//                 rows={3}
//                 className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Additional Notes (Optional)
//               </label>
//               <textarea
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 placeholder="Internal notes..."
//                 rows={2}
//                 className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
//               />
//             </div>

//             <div className="flex gap-3 pt-2">
//               <button
//                 onClick={onClose}
//                 className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleRefund}
//                 disabled={isRefunding || !reason.trim() || amount <= 0}
//                 className="flex-1 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
//               >
//                 {isRefunding ? "Processing..." : "Process Refund"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Order Detail Drawer ──────────────────────────────────────────────────────

// const OrderDetailDrawer = ({
//   order,
//   onClose,
// }: {
//   order: OrderData | null;
//   onClose: () => void;
// }) => {
//   if (!order) return null;

//   return (
//     <>
//       <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
//       <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
//         <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6 space-y-6">
//           {/* Header */}
//           <div className="flex items-start justify-between">
//             <div>
//               <p className="text-xl font-bold text-gray-800">#{order.magento_order_increment_id}</p>
//               <p className="text-sm text-gray-500">{fmtDateTime(order.created_at)}</p>
//             </div>
//             <div className="text-right">
//               <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${orderStatusStyle(order.status)}`}>
//                 <span className="w-1.5 h-1.5 rounded-full bg-current" />
//                 {order.status_label || order.status}
//               </span>
//             </div>
//           </div>

//           {/* Source Badge */}
//           <div className="flex items-center gap-2">
//             <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-500 text-xs capitalize">
//               Source: {order.source}
//             </span>
//             {order.coupon_code && (
//               <span className="px-2 py-1 rounded-md bg-purple-100 text-purple-600 text-xs">
//                 Coupon: {order.coupon_code}
//               </span>
//             )}
//           </div>

//           {/* Customer Info */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//               <FaUser className="text-teal-500" /> Customer Information
//             </h3>
//             <div className="bg-gray-50 rounded-xl p-4 space-y-2">
//               <div className="flex items-center gap-3">
//                 <img
//                   src={order.customer?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.customer_name)}&background=14B8A6&color=ffffff`}
//                   className="w-10 h-10 rounded-full object-cover"
//                   alt={order.customer_name}
//                 />
//                 <div>
//                   <p className="font-medium text-gray-800">{order.customer_name}</p>
//                   <p className="text-xs text-gray-500">Customer ID: {order.customer?.id?.slice(0, 8)}...</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <FaEnvelope className="text-gray-400 text-xs" />
//                 <span className="text-gray-600">{order.customer_email}</span>
//               </div>
//             </div>
//           </div>

//           {/* Vendor & Store Info */}
//           <div className="grid grid-cols-2 gap-4">
//             {order.vendor && (
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                   <FaStore className="text-teal-500" /> Vendor
//                 </h3>
//                 <div className="bg-gray-50 rounded-xl p-3">
//                   <p className="font-medium text-gray-800">{order.vendor.name}</p>
//                   <p className="text-xs text-gray-400">ID: {order.vendor.id?.slice(0, 8)}...</p>
//                 </div>
//               </div>
//             )}
//             {order.store && (
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                   <FaStore className="text-teal-500" /> Store
//                 </h3>
//                 <div className="bg-gray-50 rounded-xl p-3">
//                   <p className="font-medium text-gray-800">{order.store?.store_name}</p>
//                   <p className="text-xs text-gray-400">Currency: {order.currency}</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Order Items */}
//           {order.items && order.items.length > 0 && (
//             <div>
//               <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                 <FaBoxes className="text-teal-500" /> Order Items ({order.items.length})
//               </h3>
//               <div className="space-y-2">
//                 {order.items.map((item: OrderItem) => (
//                   <div key={item.id} className="bg-gray-50 rounded-xl p-3">
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <p className="font-medium text-gray-800">{item.product_name}</p>
//                         {item.sku && <p className="text-xs text-gray-400">SKU: {item.sku}</p>}
//                         <p className="text-xs text-gray-500 mt-1">Quantity: {item.qty_ordered}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-semibold text-gray-800">{fmtPrice(item.price)}</p>
//                         <p className="text-xs text-gray-400">Total: {fmtPrice(item.row_total)}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Payment Summary */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//               <FiCreditCard className="text-teal-500" /> Payment Summary
//             </h3>
//             <div className="bg-gray-50 rounded-xl p-4 space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Subtotal:</span>
//                 <span className="text-gray-700">{fmtPrice(order.subtotal)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Shipping:</span>
//                 <span className="text-gray-700">{fmtPrice(order.shipping_amount)}</span>
//               </div>
//               {parseFloat(order.discount_amount) > 0 && (
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Discount:</span>
//                   <span className="text-red-500">-{fmtPrice(order.discount_amount)}</span>
//                 </div>
//               )}
//               {parseFloat(order.tax_amount) > 0 && (
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Tax ({order.tax_rate}%):</span>
//                   <span className="text-gray-700">{fmtPrice(order.tax_amount)}</span>
//                 </div>
//               )}
//               <div className="border-t border-gray-200 pt-2 mt-2">
//                 <div className="flex justify-between font-semibold">
//                   <span className="text-gray-800">Grand Total:</span>
//                   <span className="text-teal-600">{fmtPrice(order.grand_total)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm mt-1">
//                   <span className="text-gray-500">Payment Method:</span>
//                   <span className="text-gray-600 capitalize">{order.payment_method?.replace(/_/g, " ")}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Payment Status:</span>
//                   <span className={`capitalize ${paymentStatusStyle(order.payment_status)}`}>
//                     {order.payment_status}
//                   </span>
//                 </div>
//                 {parseFloat(order.commission_amount) > 0 && (
//                   <div className="flex justify-between text-sm mt-1">
//                     <span className="text-gray-500">Commission ({order.commission_rate}%):</span>
//                     <span className="text-gray-600">{fmtPrice(order.commission_amount)}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Shipping Address */}
//           {order.shipping_address && (
//             <div>
//               <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                 <FaTruck className="text-teal-500" /> Shipping Information
//               </h3>
//               <div className="bg-gray-50 rounded-xl p-4 space-y-2">
//                 <div className="flex items-start gap-2">
//                   <FaMapMarkerAlt className="text-gray-400 text-sm mt-0.5" />
//                   <div className="text-sm text-gray-700">
//                     <p>{order.shipping_address.firstname} {order.shipping_address.lastname}</p>
//                     <p>{order.shipping_address.street}</p>
//                     <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipcode}</p>
//                     <p>{order.shipping_address.country}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm">
//                   <FaPhone className="text-gray-400 text-xs" />
//                   <span className="text-gray-600">{order.shipping_address.phone}</span>
//                 </div>
//                 <div className="flex justify-between text-sm mt-2">
//                   <span className="text-gray-500">Shipping Method:</span>
//                   <span className="text-gray-600 capitalize">{order.shipping_method}</span>
//                 </div>
//                 {order.tracking_number && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Tracking Number:</span>
//                     <span className="text-teal-600">{order.tracking_number}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Billing Address */}
//           {order.billing_address && (
//             <div>
//               <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                 <FaCreditCard className="text-teal-500" /> Billing Information
//               </h3>
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <div className="text-sm text-gray-700">
//                   <p>{order.billing_address.firstname} {order.billing_address.lastname}</p>
//                   <p>{order.billing_address.street}</p>
//                   <p>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.zipcode}</p>
//                   <p>{order.billing_address.country}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Notes */}
//           {(order.customer_note || order.admin_note) && (
//             <div>
//               <h3 className="text-sm font-semibold text-gray-700 mb-3">Notes</h3>
//               {order.customer_note && (
//                 <div className="bg-blue-50 rounded-xl p-3 mb-2">
//                   <p className="text-xs text-blue-600 font-medium mb-1">Customer Note:</p>
//                   <p className="text-sm text-gray-700">{order.customer_note}</p>
//                 </div>
//               )}
//               {order.admin_note && (
//                 <div className="bg-yellow-50 rounded-xl p-3">
//                   <p className="text-xs text-yellow-600 font-medium mb-1">Admin Note:</p>
//                   <p className="text-sm text-gray-700">{order.admin_note}</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Timeline / Meta Info */}
//           <div className="pt-2 border-t border-gray-100">
//             <div className="space-y-2 text-xs">
//               <div className="flex justify-between">
//                 <span className="text-gray-400">Order ID:</span>
//                 <span className="text-gray-600">{order.id}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-400">Magento ID:</span>
//                 <span className="text-gray-600">{order.magento_order_id}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-400">Order UUID:</span>
//                 <span className="text-gray-600">{order.uuid?.slice(0, 8)}...</span>
//               </div>
//               {order.shipped_at && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Shipped Date:</span>
//                   <span className="text-gray-600">{fmtDateTime(order.shipped_at)}</span>
//                 </div>
//               )}
//               {order.delivered_at && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Delivered Date:</span>
//                   <span className="text-gray-600">{fmtDateTime(order.delivered_at)}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ─── Row Action Menu ──────────────────────────────────────────────────────────

// const RowMenu = ({
//   onView,
//   onUpdateStatus,
//   onCancel,
//   onRefund,
//   order,
// }: {
//   onView: () => void;
//   onUpdateStatus: () => void;
//   onCancel: () => void;
//   onRefund: () => void;
//   order: OrderData;
// }) => {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const canCancel = order.can_be_cancelled;
//   const canRefund = order.can_be_refunded;

//   return (
//     <div className="relative" ref={ref}>
//       <button onClick={() => setOpen(!open)}
//         className="text-gray-400 hover:text-gray-600 p-1 transition cursor-pointer">
//         <FaEllipsisV className="text-sm" />
//       </button>
//       {open && (
//         <div className="absolute right-0 top-7 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 text-sm">
//           <button onClick={() => { onView(); setOpen(false); }}
//             className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 cursor-pointer">
//             <FaEye className="inline mr-2 text-xs" /> View Details
//           </button>
//           <button onClick={() => { onUpdateStatus(); setOpen(false); }}
//             className="w-full text-left px-4 py-2 hover:bg-teal-50 text-teal-600 cursor-pointer">
//             <FaSync className="inline mr-2 text-xs" /> Update Status
//           </button>
//           {canCancel && (
//             <button onClick={() => { onCancel(); setOpen(false); }}
//               className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer">
//               <FiX className="inline mr-2 text-xs" /> Cancel Order
//             </button>
//           )}
//           {canRefund && (
//             <button onClick={() => { onRefund(); setOpen(false); }}
//               className="w-full text-left px-4 py-2 hover:bg-yellow-50 text-yellow-600 cursor-pointer">
//               <FiDollarSign className="inline mr-2 text-xs" /> Process Refund
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Main Component ───────────────────────────────────────────────────────────

// const PER_PAGE = 10;

// const OrderList = () => {
//   const navigate = useNavigate();
//   const [page, setPage] = useState(1);
//   const [activeStatus, setActiveStatus] = useState<string>("");
//   const [selectedVendorUuid, setSelectedVendorUuid] = useState<string>("");
//   const [selectedStoreUuid, setSelectedStoreUuid] = useState<string>("");
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");
//   const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
//   const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });

//   const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
//   const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
//   const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

//   // Fetch vendors
//   const { data: vendorsData, isLoading: vendorsLoading } = useGetVendorsQuery({});
//   const vendors: Vendor[] = vendorsData?.data || [];

//   // Fetch stores based on selected vendor
//   const { data: storesData, isLoading: storesLoading } = useGetStoresByVendorQuery(
//     selectedVendorUuid,
//     { skip: !selectedVendorUuid }
//   );
//   const stores: Store[] = storesData?.data?.stores || [];

//   const queryParams: any = {
//     page,
//     per_page: PER_PAGE,
//   };

//   if (activeStatus) queryParams.status = activeStatus;
//   if (search) queryParams.search = search;
//   if (dateRange.from) queryParams.date_from = dateRange.from;
//   if (dateRange.to) queryParams.date_to = dateRange.to;

//   // Send either store_uuid OR vendor_uuid (backend accepts either)
//   if (selectedStoreUuid) {
//     queryParams.store_uuid = selectedStoreUuid;
//   } else if (selectedVendorUuid) {
//     queryParams.vendor_uuid = selectedVendorUuid;
//   }

//   const shouldFetchOrders = !!(selectedVendorUuid || selectedStoreUuid);

//   const { data, isLoading, error, refetch, isFetching } = useGetOrdersQuery(queryParams, {
//     skip: !shouldFetchOrders,  // ← Use shouldFetchOrders instead
//   });

//   const statsParams: any = { period: "30_days" };
//   if (selectedStoreUuid) {
//     statsParams.store_uuid = selectedStoreUuid;
//   } else if (selectedVendorUuid) {
//     statsParams.vendor_uuid = selectedVendorUuid;
//   }

//   const { data: statsData, refetch: refetchStats } = useGetOrderStatisticsQuery(
//     statsParams,
//     { skip: !shouldFetchOrders }
//   );

//   console.log('Should fetch orders:', shouldFetchOrders, {
//     vendor: selectedVendorUuid,
//     store: selectedStoreUuid
//   });
//   const orders: OrderData[] = data?.data ?? [];
//   const summary = data?.summary;
//   const meta = data?.meta;
//   const statistics = statsData?.data;

//   const showToast = (type: "success" | "error", msg: string) => {
//     setToast({ type, msg });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const handleReset = () => {
//     setSelectedVendorUuid("");
//     setSelectedStoreUuid("");
//     setActiveStatus("");
//     setSearch("");
//     setSearchInput("");
//     setDateRange({ from: "", to: "" });
//     setPage(1);
//   };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Reset store when vendor changes
//   const handleVendorChange = (vendorUuid: string) => {
//     setSelectedVendorUuid(vendorUuid);
//     setSelectedStoreUuid(""); // Reset store
//     setPage(1);
//   };

//   const handleStoreChange = (storeUuid: string) => {
//     setSelectedStoreUuid(storeUuid);
//     setPage(1);
//   };

//   const handleSuccess = () => {
//     refetch();
//     refetchStats();
//   };

//   // Generate pagination buttons
//   const renderPaginationButtons = () => {
//     if (!meta || meta.last_page <= 1) return null;

//     const currentPage = meta.current_page;
//     const lastPage = meta.last_page;
//     const maxVisible = 5;
//     let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
//     let endPage = Math.min(lastPage, startPage + maxVisible - 1);

//     if (endPage - startPage + 1 < maxVisible) {
//       startPage = Math.max(1, endPage - maxVisible + 1);
//     }

//     const pages = [];
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }

//     return (
//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1 || isFetching}
//           className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
//         >
//           <FaChevronLeft className="text-xs" /> Previous
//         </button>

//         {startPage > 1 && (
//           <>
//             <button
//               onClick={() => handlePageChange(1)}
//               className="px-3 py-1 rounded-md hover:bg-gray-100 cursor-pointer"
//             >
//               1
//             </button>
//             {startPage > 2 && <span className="px-1">...</span>}
//           </>
//         )}

//         {pages.map(pageNum => (
//           <button
//             key={pageNum}
//             onClick={() => handlePageChange(pageNum)}
//             className={`px-3 py-1 rounded-md cursor-pointer transition ${pageNum === currentPage
//               ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
//               : "hover:bg-gray-100"
//               }`}
//           >
//             {pageNum}
//           </button>
//         ))}

//         {endPage < lastPage && (
//           <>
//             {endPage < lastPage - 1 && <span className="px-1">...</span>}
//             <button
//               onClick={() => handlePageChange(lastPage)}
//               className="px-3 py-1 rounded-md hover:bg-gray-100 cursor-pointer"
//             >
//               {lastPage}
//             </button>
//           </>
//         )}

//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === lastPage || isFetching}
//           className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
//         >
//           Next <FaChevronRight className="text-xs" />
//         </button>
//       </div>
//     );
//   };

//   // Show selectors warning if no vendor/store selected
//   const showSelectorWarning = !selectedVendorUuid || !selectedStoreUuid;

//   return (
//     <>
//       <div className="bg-white min-h-screen p-6">
//         {/* Toast */}
//         {toast && (
//           <div
//             className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
//           ${toast.type === "success"
//                 ? "bg-green-50 text-green-700 border border-green-200"
//                 : "bg-red-50 text-red-700 border border-red-200"
//               }`}
//           >
//             <span>{toast.type === "success" ? "✓" : "✕"}</span>
//             {toast.msg}
//           </div>
//         )}

//         {/* Stats Summary - Only show when vendor/store selected */}
//         {!showSelectorWarning && (
//           <div className="mb-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//             {isLoading || !statistics ? (
//               Array.from({ length: 6 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="bg-gray-100 rounded-xl px-4 py-3 animate-pulse"
//                 >
//                   <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
//                   <div className="h-6 w-14 bg-gray-300 rounded" />
//                 </div>
//               ))
//             ) : (
//               <>
//                 <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl px-4 py-3">
//                   <span className="text-xs text-gray-500">Total Orders</span>
//                   <p className="text-xl font-bold text-teal-600">
//                     {statistics.total_orders || 0}
//                   </p>
//                 </div>

//                 <div className="bg-emerald-50 rounded-xl px-4 py-3">
//                   <span className="text-xs text-gray-500">Total Revenue</span>
//                   <p className="text-lg font-bold text-emerald-600">
//                     {fmtPrice(statistics.total_revenue || 0)}
//                   </p>
//                 </div>

//                 <div className="bg-blue-50 rounded-xl px-4 py-3">
//                   <span className="text-xs text-gray-500">
//                     Avg Order Value
//                   </span>
//                   <p className="text-md font-bold text-blue-600">
//                     {fmtPrice(statistics.average_order_value || 0)}
//                   </p>
//                 </div>

//                 <div className="bg-yellow-50 rounded-xl px-4 py-3">
//                   <span className="text-xs text-gray-500">Pending</span>
//                   <p className="text-xl font-bold text-yellow-600">
//                     {statistics.pending_orders || 0}
//                   </p>
//                 </div>

//                 <div className="bg-purple-50 rounded-xl px-4 py-3">
//                   <span className="text-xs text-gray-500">Processing</span>
//                   <p className="text-xl font-bold text-purple-600">
//                     {statistics.processing_orders || 0}
//                   </p>
//                 </div>

//                 <div className="bg-green-50 rounded-xl px-4 py-3">
//                   <span className="text-xs text-gray-500">Delivered</span>
//                   <p className="text-xl font-bold text-green-600">
//                     {statistics.delivered_orders || 0}
//                   </p>
//                 </div>
//               </>
//             )}
//           </div>
//         )}

//         {/* Vendor and Store Dropdowns */}
//         <div className="mb-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
//           <div className="flex flex-wrap items-end gap-4">
//             {/* Vendor Dropdown */}
//             <div className="flex-1 min-w-[200px]">
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
//                 <FaStore className="inline mr-1 text-teal-500" />
//                 Select Vendor *
//               </label>

//               <select
//                 value={selectedVendorUuid}
//                 onChange={(e) => handleVendorChange(e.target.value)}
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-700"
//               >
//                 <option value="">-- Select Vendor --</option>

//                 {vendors.map((vendor) => (
//                   <option key={vendor.uuid} value={vendor.uuid}>
//                     {vendor.company_name || vendor.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Store Dropdown */}
//             <div className="flex-1 min-w-[200px]">
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
//                 <FaStore className="inline mr-1 text-green-500" />
//                 Select Store *
//               </label>

//               <select
//                 value={selectedStoreUuid}
//                 onChange={(e) => handleStoreChange(e.target.value)}
//                 disabled={!selectedVendorUuid || storesLoading}
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
//               >
//                 <option value="">-- Select Store --</option>

//                 {stores.map((store) => (
//                   <option key={store.uuid} value={store.uuid}>
//                     {store.store_name}
//                   </option>
//                 ))}
//               </select>

//               {selectedVendorUuid &&
//                 stores.length === 0 &&
//                 !storesLoading && (
//                   <p className="text-xs text-amber-600 mt-1">
//                     No stores found for this vendor
//                   </p>
//                 )}
//             </div>

//             {/* From Date */}
//             <div className="flex-1 min-w-[180px]">
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
//                 <FaCalendarAlt className="inline mr-1" />
//                 From Date
//               </label>

//               <input
//                 type="date"
//                 value={dateRange.from}
//                 onChange={(e) =>
//                   setDateRange((prev) => ({
//                     ...prev,
//                     from: e.target.value,
//                   }))
//                 }
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
//               />
//             </div>

//             {/* To Date */}
//             <div className="flex-1 min-w-[180px]">
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
//                 <FaCalendarAlt className="inline mr-1" />
//                 To Date
//               </label>

//               <input
//                 type="date"
//                 value={dateRange.to}
//                 onChange={(e) =>
//                   setDateRange((prev) => ({
//                     ...prev,
//                     to: e.target.value,
//                   }))
//                 }
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
//               />
//             </div>

//             {/* Reset Button */}
//             <div>
//               <button
//                 onClick={handleReset}
//                 className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition cursor-pointer flex items-center gap-2"
//               >
//                 <FaTimes className="text-sm" />
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Warning */}
//         {showSelectorWarning && (
//           <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
//             <FaExclamationTriangle className="inline text-amber-500 text-lg mr-2" />
//             <span className="text-amber-700">
//               Please select a Vendor and Store to view orders
//             </span>
//           </div>
//         )}

//         {/* Page Header */}
//         {!showSelectorWarning && (
//           <PageHeader
//             title="Order Management"
//             addButtonLabel="Export Orders"
//             onAdd={() => {
//               const exportData = orders.map((order) => ({
//                 order_id: order.magento_order_increment_id,
//                 customer_name: order.customer_name,
//                 customer_email: order.customer_email,
//                 vendor: order.vendor?.name,
//                 store: order.store?.store_name,
//                 status: order.status,
//                 payment_status: order.payment_status,
//                 grand_total: order.grand_total,
//                 currency: order.currency,
//                 payment_method: order.payment_method,
//                 shipping_method: order.shipping_method,
//                 tracking_number: order.tracking_number,
//                 created_at: order.created_at,
//               }));

//               const blob = new Blob(
//                 [JSON.stringify(exportData, null, 2)],
//                 {
//                   type: "application/json",
//                 }
//               );

//               const url = URL.createObjectURL(blob);

//               const a = document.createElement("a");
//               a.href = url;
//               a.download = `orders-export-${new Date()
//                 .toISOString()
//                 .slice(0, 10)}.json`;

//               a.click();

//               URL.revokeObjectURL(url);
//             }}
//             tabs={STATUS_TABS}
//             activeTab={activeStatus}
//             onTabChange={(tab) => {
//               setActiveStatus(tab);
//               setPage(1);
//             }}
//             filters={[]}
//             searchValue={searchInput}
//             onSearchChange={setSearchInput}
//             onSearchSubmit={() => {
//               setSearch(searchInput);
//               setPage(1);
//             }}
//             onResetFilters={() => {
//               setSearch("");
//               setSearchInput("");
//               setActiveStatus("");
//               setDateRange({ from: "", to: "" });
//               setPage(1);
//             }}
//             searchPlaceholder="Search by order ID, customer name, email..."
//           />
//         )}

//         {/* Table */}
//         <div
//           className={`rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${showSelectorWarning ? "opacity-60" : ""
//             }`}
//         >
//           <div className="overflow-x-auto min-h-[500px]">
//             <table className="w-full table-auto">
//               <thead>
//                 <tr className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
//                   {[
//                     "Order ID",
//                     "Customer",
//                     "Vendor/Store",
//                     "Date",
//                     "Amount",
//                     "Payment",
//                     "Status",
//                     "",
//                   ].map((col, i) => (
//                     <th
//                       key={i}
//                       className="px-4 py-4 text-left font-semibold text-sm whitespace-nowrap"
//                     >
//                       {col}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody className="bg-white">
//                 {showSelectorWarning ? (
//                   <tr>
//                     <td
//                       colSpan={8}
//                       className="text-center py-16 text-gray-400"
//                     >
//                       <FaStore className="text-5xl mx-auto mb-3 opacity-30" />
//                       <p>Select a vendor and store to view orders</p>
//                     </td>
//                   </tr>
//                 ) : isLoading || isFetching ? (
//                   <tr>
//                     <td colSpan={8} className="text-center py-16">
//                       <div className="flex items-center justify-center gap-3 text-gray-400">
//                         <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-teal-500" />
//                         <span className="text-sm">Loading orders…</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td
//                       colSpan={8}
//                       className="text-center py-16 text-red-400 text-sm"
//                     >
//                       Error loading orders. Please try again.
//                     </td>
//                   </tr>
//                 ) : orders.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={8}
//                       className="text-center py-16 text-gray-300 text-sm"
//                     >
//                       <FaShoppingBag className="text-4xl mx-auto mb-3 opacity-30" />
//                       No orders found.
//                     </td>
//                   </tr>
//                 ) : (
//                   orders.map((order, idx) => (
//                     <tr
//                       key={order.id}
//                       className="hover:bg-gray-50/60 transition"
//                       style={{
//                         borderBottom:
//                           idx < orders.length - 1
//                             ? "1px solid #f3f4f6"
//                             : "none",
//                       }}
//                     >
//                       <td className="relative pl-5 pr-4 py-3">
//                         <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-teal-400 to-teal-300" />

//                         <div>
//                           <span className="font-mono text-teal-600 text-sm font-semibold block">
//                             #{order.magento_order_increment_id}
//                           </span>

//                           <span className="text-xs text-gray-400 capitalize">
//                             {order.fulfillment_status || order.source}
//                           </span>
//                         </div>
//                       </td>

//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                           <img
//                             src={
//                               order.customer?.avatar ||
//                               `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                                 order.customer_name
//                               )}&background=14B8A6&color=ffffff`
//                             }
//                             className="w-8 h-8 rounded-full object-cover"
//                             alt={order.customer_name}
//                           />

//                           <div>
//                             <p className="text-gray-700 text-sm font-medium">
//                               {order.customer_name}
//                             </p>

//                             <p className="text-xs text-gray-400 truncate max-w-[150px]">
//                               {order.customer_email}
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-4 py-3">
//                         <div>
//                           <p className="text-xs text-gray-600 truncate max-w-[120px]">
//                             {order.vendor?.name || "—"}
//                           </p>

//                           {order.store?.store_name && (
//                             <p className="text-xs text-gray-400 truncate max-w-[120px]">
//                               {order.store.store_name}
//                             </p>
//                           )}
//                         </div>
//                       </td>

//                       <td className="px-4 py-3">
//                         <p className="text-xs text-gray-500 whitespace-nowrap">
//                           {fmtDate(order.created_at)}
//                         </p>
//                       </td>

//                       <td className="px-4 py-3">
//                         <div>
//                           <span className="font-semibold text-gray-800">
//                             {fmtPrice(order.grand_total)}
//                           </span>

//                           <p className="text-xs text-gray-400">
//                             {order.currency}
//                           </p>
//                         </div>
//                       </td>

//                       <td className="px-4 py-3">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${paymentStatusStyle(
//                             order.payment_status
//                           )}`}
//                         >
//                           {order.payment_status}
//                         </span>
//                       </td>

//                       <td className="px-4 py-3">
//                         <span
//                           className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${orderStatusStyle(
//                             order.status
//                           )}`}
//                         >
//                           <span className="w-1.5 h-1.5 rounded-full bg-current" />
//                           {order.status_label || order.status}
//                         </span>
//                       </td>

//                       <td className="relative pl-4 pr-5 py-3 text-right">
//                         <span className="absolute right-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-green-400 to-green-300" />

//                         <RowMenu
//                           order={order}
//                           onView={() => {
//                             setSelectedOrder(order);
//                             setIsDrawerOpen(true);
//                           }}
//                           onUpdateStatus={() => {
//                             setSelectedOrder(order);
//                             setIsStatusModalOpen(true);
//                           }}
//                           onCancel={() => {
//                             setSelectedOrder(order);
//                             setIsCancelModalOpen(true);
//                           }}
//                           onRefund={() => {
//                             setSelectedOrder(order);
//                             setIsRefundModalOpen(true);
//                           }}
//                         />
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {!showSelectorWarning && meta && meta.total > 0 && (
//             <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
//               <div className="text-xs text-gray-400">
//                 Showing {meta.from || 0} to {meta.to || 0} of {meta.total} orders
//               </div>

//               {renderPaginationButtons()}
//             </div>
//           )}
//         </div>

//         {/* Modals */}
//         <StatusUpdateModal
//           isOpen={isStatusModalOpen}
//           onClose={() => {
//             setIsStatusModalOpen(false);
//             setSelectedOrder(null);
//           }}
//           order={selectedOrder}
//           vendorUuid={selectedVendorUuid}
//           storeUuid={selectedStoreUuid}
//           onSuccess={handleSuccess}
//         />

//         <CancelOrderModal
//           isOpen={isCancelModalOpen}
//           onClose={() => {
//             setIsCancelModalOpen(false);
//             setSelectedOrder(null);
//           }}
//           order={selectedOrder}
//           vendorUuid={selectedVendorUuid}
//           storeUuid={selectedStoreUuid}
//           onSuccess={handleSuccess}
//         />

//         <RefundModal
//           isOpen={isRefundModalOpen}
//           onClose={() => {
//             setIsRefundModalOpen(false);
//             setSelectedOrder(null);
//           }}
//           order={selectedOrder}
//           vendorUuid={selectedVendorUuid}
//           storeUuid={selectedStoreUuid}
//           onSuccess={handleSuccess}
//         />

//         <OrderDetailDrawer
//           order={isDrawerOpen ? selectedOrder : null}
//           onClose={() => {
//             setIsDrawerOpen(false);
//             setSelectedOrder(null);
//           }}
//         />
//       </div>
//     </>
//   );

// };

// export default OrderList;


import { useState, useRef, useEffect } from "react";
import {
  FaEllipsisV,
  FaEye,
  FaSync,
  FaTimes,
  FaExclamationTriangle,
  FaShoppingBag,
  FaTruck,
  FaBoxes,
  FaUsers,
  FaStore,
  FaUser,
  FaMoneyBillWave,
  FaCreditCard,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaCalendarAlt,
  FaSearch,
  FaSlidersH,
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
} from "react-icons/fi";
import {
  useGetOrdersQuery,
  useGetOrderStatisticsQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useProcessRefundMutation,
  useSyncOrdersMutation,
  useCreateOrderInvoiceMutation,
  useCreateOrderShipmentMutation,
  useAddOrderTrackingMutation,
  useAddOrderCommentMutation,
  useHoldOrderMutation,
  useUnholdOrderMutation,
  useReorderOrderMutation,
  useDeleteLocalOrderMutation,
  type Order,
  type OrderStatus,
} from "../../app/api/OrderSlices/OrderApi";
import { useGetVendorsQuery } from "../../app/api/VendorSlices/VendorApi";
import { useGetStoresByVendorQuery } from "../../app/api/StoreSlices/StoreApi";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../component/PageHeader/Pageheaderfilterbar";

// ─── Types based on actual API response ──────────────────────────────────────

interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Vendor {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  company_name?: string;
}

interface Store {
  id: number;
  uuid: string;
  store_name: string;
  vendor_id: string;
  magento_store_id?: number;
}

interface StoreAddress {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
  firstname: string;
  lastname: string;
}

interface OrderItem {
  id: number;
  product_name: string;
  qty_ordered: number;
  price: number;
  row_total: number;
  sku?: string;
  product_image?: string;
}

interface OrderData {
  id: number;
  uuid: string;
  order_number: string | null;
  magento_order_id: number;
  magento_order_increment_id: string;
  status: string;
  status_label: string;
  status_color: string;
  payment_status: string;
  fulfillment_status: string;
  customer: Customer;
  customer_name: string;
  customer_email: string;
  is_guest: boolean | null;
  vendor: Vendor;
  store: Store;
  currency: string;
  subtotal: string;
  tax_amount: string;
  tax_rate: string;
  shipping_amount: string;
  discount_amount: string;
  grand_total: string;
  commission_amount: string;
  commission_rate: string;
  vendor_payout_amount: string;
  payment_method: string;
  payment_fee: string;
  shipping_method: string;
  tracking_number: string | null;
  coupon_code: string | null;
  shipping_address: StoreAddress;
  billing_address: StoreAddress;
  customer_note: string | null;
  admin_note: string | null;
  items: OrderItem[];
  is_settled: boolean | null;
  settled_at: string | null;
  created_at: string;
  updated_at: string;
  shipped_at: string | null;
  delivered_at: string | null;
  source: string;
  can_be_cancelled: boolean;
  can_be_refunded: boolean;
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

const fmtPrice = (price: string | number) => {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
};

const orderStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-50 text-yellow-600 border-yellow-200";
    case "processing":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "shipped":
      return "bg-purple-50 text-purple-600 border-purple-200";
    case "delivered":
    case "completed":
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "cancelled":
      return "bg-red-50 text-red-600 border-red-200";
    case "refunded":
      return "bg-gray-50 text-gray-500 border-gray-200";
    default:
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
};

const paymentStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "refunded":
      return "bg-gray-100 text-gray-500";
    case "chargeback":
      return "bg-red-100 text-red-700";
    case "failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

// ─── Tabs config ──────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { key: "", label: "All Orders" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
  { key: "refunded", label: "Refunded" },
];

// ─── Status Update Modal ──────────────────────────────────────────────────────

const StatusUpdateModal = ({
  isOpen,
  onClose,
  order,
  vendorUuid,
  storeUuid,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: OrderData | null;
  vendorUuid: string;
  storeUuid: string;
  onSuccess: () => void;
}) => {
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [status, setStatus] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const STATUS_OPTIONS = [
    "pending", "processing", "shipped", "delivered", "completed", "cancelled", "refunded",
  ];

  const showMsg = (type: "success" | "error", msg: string) => {
    setModalToast({ type, msg });
    setTimeout(() => setModalToast(null), 3000);
  };

  const handleUpdate = async () => {
    if (!order) return;
    try {
      await updateStatus({
        id: order.id,
        data: {
          status,
          notes: notes || undefined,
          vendor_uuid: vendorUuid,
          store_uuid: storeUuid
        },
      }).unwrap();
      showMsg("success", `Order status updated to ${status}`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) {
      showMsg("error", e?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  if (!isOpen || !order) return null;

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
              <h2 className="text-lg font-bold text-gray-800">Update Order Status</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Order #{order.magento_order_increment_id}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Status
              </label>
              <div className="mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${orderStatusStyle(order.status)}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {order.status_label || order.status}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this status change..."
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
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Cancel Order Modal ───────────────────────────────────────────────────────

const CancelOrderModal = ({
  isOpen,
  onClose,
  order,
  vendorUuid,
  storeUuid,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: OrderData | null;
  vendorUuid: string;
  storeUuid: string;
  onSuccess: () => void;
}) => {
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showMsg = (type: "success" | "error", msg: string) => {
    setModalToast({ type, msg });
    setTimeout(() => setModalToast(null), 3000);
  };

  const handleCancel = async () => {
    if (!order) return;
    if (!reason.trim()) {
      showMsg("error", "Please provide a reason for cancellation");
      return;
    }
    try {
      await cancelOrder({
        id: order.id,
        data: {
          reason,
          notes: notes || undefined,
          vendor_uuid: vendorUuid,
          store_uuid: storeUuid
        },
      }).unwrap();
      showMsg("success", `Order #${order.magento_order_increment_id} cancelled`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) {
      showMsg("error", e?.data?.message || "Failed to cancel order");
    }
  };

  if (!isOpen || !order) return null;

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
              <h2 className="text-lg font-bold text-gray-800">Cancel Order</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Order #{order.magento_order_increment_id}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-red-50 rounded-xl p-3 text-sm text-red-600">
              ⚠️ Cancelling this order will notify the customer and vendor.
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Cancellation *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Out of stock, Customer request, Payment issue..."
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
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
                onClick={handleCancel}
                disabled={isCancelling || !reason.trim()}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Refund Modal ─────────────────────────────────────────────────────────────

const RefundModal = ({
  isOpen,
  onClose,
  order,
  vendorUuid,
  storeUuid,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: OrderData | null;
  vendorUuid: string;
  storeUuid: string;
  onSuccess: () => void;
}) => {
  const [processRefund, { isLoading: isRefunding }] = useProcessRefundMutation();
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showMsg = (type: "success" | "error", msg: string) => {
    setModalToast({ type, msg });
    setTimeout(() => setModalToast(null), 3000);
  };

  useEffect(() => {
    if (order) {
      setAmount(parseFloat(order.grand_total));
    }
  }, [order]);

  const handleRefund = async () => {
    if (!order) return;
    if (!reason.trim()) {
      showMsg("error", "Please provide a reason for refund");
      return;
    }
    const maxAmount = parseFloat(order.grand_total);
    if (amount <= 0 || amount > maxAmount) {
      showMsg("error", "Invalid refund amount");
      return;
    }
    try {
      await processRefund({
        id: order.id,
        data: {
          amount,
          reason,
          notes: notes || undefined,
          vendor_uuid: vendorUuid,
          store_uuid: storeUuid
        },
      }).unwrap();
      showMsg("success", `Refund of ${fmtPrice(amount)} processed`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) {
      showMsg("error", e?.data?.message || "Failed to process refund");
    }
  };

  if (!isOpen || !order) return null;

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
              <h2 className="text-lg font-bold text-gray-800">Process Refund</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Order #{order.magento_order_increment_id}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-xl p-3 flex justify-between text-sm">
              <span className="text-gray-500">Order Total:</span>
              <span className="font-semibold text-gray-800">{fmtPrice(order.grand_total)}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refund Amount *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                min={0}
                max={parseFloat(order.grand_total)}
                step="0.01"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <p className="text-xs text-gray-400 mt-1">Max: {fmtPrice(order.grand_total)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Refund *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Damaged product, Wrong item, Customer return..."
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
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
                onClick={handleRefund}
                disabled={isRefunding || !reason.trim() || amount <= 0}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {isRefunding ? "Processing..." : "Process Refund"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MagentoOperationModal = ({
  operation,
  order,
  isLoading,
  onClose,
  onSubmit,
}: {
  operation: MagentoOrderOperation | null;
  order: OrderData | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (operation: MagentoOrderOperation, payload: Record<string, unknown>) => void;
}) => {
  const [comment, setComment] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrierCode, setCarrierCode] = useState("custom");
  const [shipmentId, setShipmentId] = useState("");
  const [notify, setNotify] = useState(false);

  useEffect(() => {
    setComment("");
    setTrackingNumber("");
    setCarrierCode("custom");
    setShipmentId("");
    setNotify(false);
  }, [operation, order?.uuid]);

  if (!operation || !order) return null;

  const titles: Record<MagentoOrderOperation, string> = {
    invoice: "Create Invoice",
    shipment: "Create Shipment",
    tracking: "Add Tracking",
    comment: "Add Order Comment",
    hold: "Hold Order",
    unhold: "Unhold Order",
    reorder: "Reorder",
    "delete-local": "Delete Local Order",
  };

  const requiresTracking = operation === "tracking";
  const canIncludeTracking = operation === "shipment";
  const usesComment = ["invoice", "shipment", "comment"].includes(operation);

  const submit = () => {
    const payload: Record<string, unknown> = {};

    if (usesComment) {
      payload.comment = comment;
      payload.notify = notify;
      payload.append_comment = !!comment;
    }

    if (requiresTracking) {
      payload.track_number = trackingNumber;
      payload.carrier_code = carrierCode;
      if (shipmentId) payload.shipment_id = Number(shipmentId);
    }

    if (operation === "shipment" && trackingNumber) {
      payload.tracks = [{
        track_number: trackingNumber,
        carrier_code: carrierCode,
        title: carrierCode,
      }];
    }

    onSubmit(operation, payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{titles[operation]}</h2>
            <p className="text-xs text-gray-400">#{order.magento_order_increment_id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX />
          </button>
        </div>

        {usesComment && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Optional Magento order history comment"
            />
            <label className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
              Notify customer
            </label>
          </div>
        )}

        {(requiresTracking || canIncludeTracking) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {requiresTracking && (
              <input
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Shipment ID optional"
              />
            )}
            <input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400"
              placeholder={requiresTracking ? "Tracking number *" : "Tracking number optional"}
            />
            <input
              value={carrierCode}
              onChange={(e) => setCarrierCode(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Carrier code"
            />
          </div>
        )}

        {["hold", "unhold", "reorder", "delete-local"].includes(operation) && (
          <p className="text-sm text-gray-500 mb-5">
            This action will run against Magento first where applicable, then refresh the local database.
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={isLoading || (requiresTracking && !trackingNumber)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium disabled:opacity-50"
          >
            {isLoading ? "Working..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Order Detail Drawer ──────────────────────────────────────────────────────

const OrderDetailDrawer = ({
  order,
  onClose,
}: {
  order: OrderData | null;
  onClose: () => void;
}) => {
  if (!order) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xl font-bold text-gray-800">#{order.magento_order_increment_id}</p>
              <p className="text-sm text-gray-500">{fmtDateTime(order.created_at)}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${orderStatusStyle(order.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {order.status_label || order.status}
              </span>
            </div>
          </div>

          {/* Source Badge */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-500 text-xs capitalize">
              Source: {order.source}
            </span>
            {order.coupon_code && (
              <span className="px-2 py-1 rounded-md bg-purple-100 text-purple-600 text-xs">
                Coupon: {order.coupon_code}
              </span>
            )}
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaUser className="text-teal-500" /> Customer Information
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={order.customer?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.customer_name)}&background=14B8A6&color=ffffff`}
                  className="w-10 h-10 rounded-full object-cover"
                  alt={order.customer_name}
                />
                <div>
                  <p className="font-medium text-gray-800">{order.customer_name}</p>
                  <p className="text-xs text-gray-500">Customer ID: {order.customer?.id?.slice(0, 8)}...</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaEnvelope className="text-gray-400 text-xs" />
                <span className="text-gray-600">{order.customer_email}</span>
              </div>
            </div>
          </div>

          {/* Vendor & Store Info */}
          <div className="grid grid-cols-2 gap-4">
            {order.vendor && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaStore className="text-teal-500" /> Vendor
                </h3>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="font-medium text-gray-800">{order.vendor.name}</p>
                  <p className="text-xs text-gray-400">ID: {order.vendor.id?.slice(0, 8)}...</p>
                </div>
              </div>
            )}
            {order.store && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaStore className="text-teal-500" /> Store
                </h3>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="font-medium text-gray-800">{order.store?.store_name}</p>
                  <p className="text-xs text-gray-400">Currency: {order.currency}</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaBoxes className="text-teal-500" /> Order Items ({order.items.length})
              </h3>
              <div className="space-y-2">
                {order.items.map((item: OrderItem) => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.product_name}</p>
                        {item.sku && <p className="text-xs text-gray-400">SKU: {item.sku}</p>}
                        <p className="text-xs text-gray-500 mt-1">Quantity: {item.qty_ordered}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">{fmtPrice(item.price)}</p>
                        <p className="text-xs text-gray-400">Total: {fmtPrice(item.row_total)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FiCreditCard className="text-teal-500" /> Payment Summary
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal:</span>
                <span className="text-gray-700">{fmtPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping:</span>
                <span className="text-gray-700">{fmtPrice(order.shipping_amount)}</span>
              </div>
              {parseFloat(order.discount_amount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount:</span>
                  <span className="text-red-500">-{fmtPrice(order.discount_amount)}</span>
                </div>
              )}
              {parseFloat(order.tax_amount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax ({order.tax_rate}%):</span>
                  <span className="text-gray-700">{fmtPrice(order.tax_amount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-800">Grand Total:</span>
                  <span className="text-teal-600">{fmtPrice(order.grand_total)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="text-gray-600 capitalize">{order.payment_method?.replace(/_/g, " ")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Status:</span>
                  <span className={`capitalize ${paymentStatusStyle(order.payment_status)}`}>
                    {order.payment_status}
                  </span>
                </div>
                {parseFloat(order.commission_amount) > 0 && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Commission ({order.commission_rate}%):</span>
                    <span className="text-gray-600">{fmtPrice(order.commission_amount)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaTruck className="text-teal-500" /> Shipping Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="text-gray-400 text-sm mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p>{order.shipping_address.firstname} {order.shipping_address.lastname}</p>
                    <p>{order.shipping_address.street}</p>
                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipcode}</p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaPhone className="text-gray-400 text-xs" />
                  <span className="text-gray-600">{order.shipping_address.phone}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Shipping Method:</span>
                  <span className="text-gray-600 capitalize">{order.shipping_method}</span>
                </div>
                {order.tracking_number && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tracking Number:</span>
                    <span className="text-teal-600">{order.tracking_number}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Billing Address */}
          {order.billing_address && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaCreditCard className="text-teal-500" /> Billing Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-700">
                  <p>{order.billing_address.firstname} {order.billing_address.lastname}</p>
                  <p>{order.billing_address.street}</p>
                  <p>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.zipcode}</p>
                  <p>{order.billing_address.country}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {(order.customer_note || order.admin_note) && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Notes</h3>
              {order.customer_note && (
                <div className="bg-blue-50 rounded-xl p-3 mb-2">
                  <p className="text-xs text-blue-600 font-medium mb-1">Customer Note:</p>
                  <p className="text-sm text-gray-700">{order.customer_note}</p>
                </div>
              )}
              {order.admin_note && (
                <div className="bg-yellow-50 rounded-xl p-3">
                  <p className="text-xs text-yellow-600 font-medium mb-1">Admin Note:</p>
                  <p className="text-sm text-gray-700">{order.admin_note}</p>
                </div>
              )}
            </div>
          )}

          {/* Timeline / Meta Info */}
          <div className="pt-2 border-t border-gray-100">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Order ID:</span>
                <span className="text-gray-600">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Magento ID:</span>
                <span className="text-gray-600">{order.magento_order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Order UUID:</span>
                <span className="text-gray-600">{order.uuid?.slice(0, 8)}...</span>
              </div>
              {order.shipped_at && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipped Date:</span>
                  <span className="text-gray-600">{fmtDateTime(order.shipped_at)}</span>
                </div>
              )}
              {order.delivered_at && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivered Date:</span>
                  <span className="text-gray-600">{fmtDateTime(order.delivered_at)}</span>
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
  onView,
  onUpdateStatus,
  onCancel,
  onRefund,
  onOperation,
  order,
}: {
  onView: () => void;
  onUpdateStatus: () => void;
  onCancel: () => void;
  onRefund: () => void;
  onOperation: (operation: MagentoOrderOperation, order: OrderData) => void;
  order: OrderData;
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

  const canCancel = order.can_be_cancelled;
  const canRefund = order.can_be_refunded;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-gray-600 p-1 transition cursor-pointer">
        <FaEllipsisV className="text-sm" />
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-52 text-sm">
          <button onClick={() => { onView(); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 cursor-pointer">
            <FaEye className="inline mr-2 text-xs" /> View Details
          </button>
          <button onClick={() => { onUpdateStatus(); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-teal-50 text-teal-600 cursor-pointer">
            <FaSync className="inline mr-2 text-xs" /> Update Status
          </button>
          {canCancel && (
            <button onClick={() => { onCancel(); setOpen(false); }}
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer">
              <FiX className="inline mr-2 text-xs" /> Cancel Order
            </button>
          )}
          {canRefund && (
            <button onClick={() => { onRefund(); setOpen(false); }}
              className="w-full text-left px-4 py-2 hover:bg-yellow-50 text-yellow-600 cursor-pointer">
              <FiDollarSign className="inline mr-2 text-xs" /> Process Refund
            </button>
          )}
          <button onClick={() => { onOperation("invoice", order); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-emerald-600 cursor-pointer">
            <FiCreditCard className="inline mr-2 text-xs" /> Create Invoice
          </button>
          <button onClick={() => { onOperation("shipment", order); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-indigo-600 cursor-pointer">
            <FaTruck className="inline mr-2 text-xs" /> Create Shipment
          </button>
          <button onClick={() => { onOperation("tracking", order); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-cyan-50 text-cyan-600 cursor-pointer">
            <FaMapMarkerAlt className="inline mr-2 text-xs" /> Add Tracking
          </button>
          <button onClick={() => { onOperation("comment", order); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-600 cursor-pointer">
            <FiClock className="inline mr-2 text-xs" /> Add Comment
          </button>
          <button onClick={() => { onOperation(order.status === "holded" ? "unhold" : "hold", order); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-orange-50 text-orange-600 cursor-pointer">
            <FiAlertCircle className="inline mr-2 text-xs" /> {order.status === "holded" ? "Unhold Order" : "Hold Order"}
          </button>
          <button onClick={() => { onOperation("reorder", order); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-600 cursor-pointer">
            <FaShoppingBag className="inline mr-2 text-xs" /> Reorder
          </button>
          <button onClick={() => { onOperation("delete-local", order); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer">
            <FiX className="inline mr-2 text-xs" /> Delete Local
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PER_PAGE = 10;
type MagentoOrderOperation =
  | "invoice"
  | "shipment"
  | "tracking"
  | "comment"
  | "hold"
  | "unhold"
  | "reorder"
  | "delete-local";

const OrderList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeStatus, setActiveStatus] = useState<string>("");
  const [selectedVendorUuid, setSelectedVendorUuid] = useState<string>("");
  const [selectedStoreUuid, setSelectedStoreUuid] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [operationModal, setOperationModal] = useState<MagentoOrderOperation | null>(null);

  // Fetch vendors
  const { data: vendorsData, isLoading: vendorsLoading } = useGetVendorsQuery({});
  const vendors: Vendor[] = vendorsData?.data || [];

  // Fetch stores based on selected vendor
  const { data: storesData, isLoading: storesLoading } = useGetStoresByVendorQuery(
    selectedVendorUuid,
    { skip: !selectedVendorUuid }
  );
  const stores: Store[] = storesData?.data?.stores || [];

  // Build query parameters - ALWAYS send BOTH vendor_uuid AND store_uuid
  const queryParams: any = {
    page,
    per_page: PER_PAGE,
  };

  if (activeStatus) queryParams.status = activeStatus;
  if (search) queryParams.search = search;
  if (dateRange.from) queryParams.date_from = dateRange.from;
  if (dateRange.to) queryParams.date_to = dateRange.to;

  // IMPORTANT: API requires BOTH vendor_uuid AND store_uuid
  if (selectedVendorUuid && selectedStoreUuid) {
    queryParams.vendor_uuid = selectedVendorUuid;
    queryParams.store_uuid = selectedStoreUuid;
  }

  // Only fetch orders when BOTH vendor AND store are selected
  const shouldFetchOrders = !!(selectedVendorUuid && selectedStoreUuid);

  const { data, isLoading, error, refetch, isFetching } = useGetOrdersQuery(queryParams, {
    skip: !shouldFetchOrders,
  });

  // Statistics params - also requires both IDs
  const statsParams: any = { period: "30_days" };
  if (selectedVendorUuid && selectedStoreUuid) {
    statsParams.vendor_uuid = selectedVendorUuid;
    statsParams.store_uuid = selectedStoreUuid;
  }

  const { data: statsData, refetch: refetchStats } = useGetOrderStatisticsQuery(
    statsParams,
    { skip: !shouldFetchOrders }
  );
  const [syncOrders, { isLoading: isSyncingOrders }] = useSyncOrdersMutation();
  const [createInvoice, { isLoading: isCreatingInvoice }] = useCreateOrderInvoiceMutation();
  const [createShipment, { isLoading: isCreatingShipment }] = useCreateOrderShipmentMutation();
  const [addTracking, { isLoading: isAddingTracking }] = useAddOrderTrackingMutation();
  const [addComment, { isLoading: isAddingComment }] = useAddOrderCommentMutation();
  const [holdOrder, { isLoading: isHoldingOrder }] = useHoldOrderMutation();
  const [unholdOrder, { isLoading: isUnholdingOrder }] = useUnholdOrderMutation();
  const [reorderOrder, { isLoading: isReorderingOrder }] = useReorderOrderMutation();
  const [deleteLocalOrder, { isLoading: isDeletingLocalOrder }] = useDeleteLocalOrderMutation();

  console.log('Query params being sent:', queryParams);
  console.log('Should fetch orders:', shouldFetchOrders);
  console.log('Selected Vendor UUID:', selectedVendorUuid);
  console.log('Selected Store UUID:', selectedStoreUuid);
  
  const orders: OrderData[] = data?.data ?? [];
  const summary = data?.summary;
  const meta = data?.meta;
  const statistics = statsData?.data;

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleReset = () => {
    setSelectedVendorUuid("");
    setSelectedStoreUuid("");
    setActiveStatus("");
    setSearch("");
    setSearchInput("");
    setDateRange({ from: "", to: "" });
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset store when vendor changes
  const handleVendorChange = (vendorUuid: string) => {
    setSelectedVendorUuid(vendorUuid);
    setSelectedStoreUuid(""); // Reset store when vendor changes
    setPage(1);
  };

  const handleStoreChange = (storeUuid: string) => {
    setSelectedStoreUuid(storeUuid);
    setPage(1);
  };

  const handleSuccess = () => {
    refetch();
    refetchStats();
  };

  const handleSyncOrders = async () => {
    if (!selectedVendorUuid || !selectedStoreUuid) {
      showToast("error", "Please select both a vendor and a store before syncing orders.");
      return;
    }

    try {
      const result = await syncOrders({
        vendor_uuid: selectedVendorUuid,
        store_uuid: selectedStoreUuid,
      }).unwrap();

      const syncedCount = result.data?.synced_count ?? 0;
      const skippedCount = result.data?.skipped_count ?? 0;
      showToast("success", `Sync complete. ${syncedCount} new orders added, ${skippedCount} existing orders skipped.`);
      refetch();
      refetchStats();
    } catch (err: any) {
      const message = err?.data?.message || err?.error || "Failed to sync orders. Please try again.";
      showToast("error", message);
    }
  };

  const openOperationModal = (operation: MagentoOrderOperation, order: OrderData) => {
    setSelectedOrder(order);
    setOperationModal(operation);
  };

  const isOperationLoading =
    isCreatingInvoice ||
    isCreatingShipment ||
    isAddingTracking ||
    isAddingComment ||
    isHoldingOrder ||
    isUnholdingOrder ||
    isReorderingOrder ||
    isDeletingLocalOrder;

  const handleOrderOperation = async (operation: MagentoOrderOperation, payload: Record<string, unknown> = {}) => {
    if (!selectedOrder || !selectedVendorUuid || !selectedStoreUuid) return;

    const request = {
      id: selectedOrder.uuid,
      data: {
        vendor_uuid: selectedVendorUuid,
        store_uuid: selectedStoreUuid,
        ...payload,
      },
    };

    try {
      const mutationMap: Record<MagentoOrderOperation, (args: typeof request) => any> = {
        invoice: createInvoice,
        shipment: createShipment,
        tracking: addTracking,
        comment: addComment,
        hold: holdOrder,
        unhold: unholdOrder,
        reorder: reorderOrder,
        "delete-local": deleteLocalOrder,
      };

      const response = await mutationMap[operation](request).unwrap();
      showToast("success", response.message || "Order operation completed.");
      setOperationModal(null);
      setSelectedOrder(null);
      refetch();
      refetchStats();
    } catch (err: any) {
      const message = err?.data?.message || err?.error || "Order operation failed.";
      showToast("error", message);
    }
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
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isFetching}
          className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
        >
          <FaChevronLeft className="text-xs" /> Previous
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
          Next <FaChevronRight className="text-xs" />
        </button>
      </div>
    );
  };

  // Show selectors warning - require BOTH vendor AND store
  const showSelectorWarning = !selectedVendorUuid || !selectedStoreUuid;

  return (
    <>
      <div className="bg-white min-h-screen p-6">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
          ${toast.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
              }`}
          >
            <span>{toast.type === "success" ? "✓" : "✕"}</span>
            {toast.msg}
          </div>
        )}

        {/* Stats Summary - Only show when both vendor and store are selected */}
        {!showSelectorWarning && (
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {isLoading || !statistics ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-xl px-4 py-3 animate-pulse"
                >
                  <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
                  <div className="h-6 w-14 bg-gray-300 rounded" />
                </div>
              ))
            ) : (
              <>
                <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl px-4 py-3">
                  <span className="text-xs text-gray-500">Total Orders</span>
                  <p className="text-xl font-bold text-teal-600">
                    {statistics.total_orders || 0}
                  </p>
                </div>

                <div className="bg-emerald-50 rounded-xl px-4 py-3">
                  <span className="text-xs text-gray-500">Total Revenue</span>
                  <p className="text-lg font-bold text-emerald-600">
                    {fmtPrice(statistics.total_revenue || 0)}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl px-4 py-3">
                  <span className="text-xs text-gray-500">
                    Avg Order Value
                  </span>
                  <p className="text-md font-bold text-blue-600">
                    {fmtPrice(statistics.average_order_value || 0)}
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-xl px-4 py-3">
                  <span className="text-xs text-gray-500">Pending</span>
                  <p className="text-xl font-bold text-yellow-600">
                    {statistics.pending_orders || 0}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl px-4 py-3">
                  <span className="text-xs text-gray-500">Processing</span>
                  <p className="text-xl font-bold text-purple-600">
                    {statistics.processing_orders || 0}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl px-4 py-3">
                  <span className="text-xs text-gray-500">Delivered</span>
                  <p className="text-xl font-bold text-green-600">
                    {statistics.delivered_orders || 0}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Vendor and Store Dropdowns */}
        <div className="mb-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            {/* Vendor Dropdown */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <FaStore className="inline mr-1 text-teal-500" />
                Select Vendor *
              </label>

              <select
                value={selectedVendorUuid}
                onChange={(e) => handleVendorChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-700"
              >
                <option value="">-- Select Vendor --</option>

                {vendors.map((vendor) => (
                  <option key={vendor.uuid} value={vendor.uuid}>
                    {vendor.company_name || vendor.name || vendor.company_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Store Dropdown */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <FaStore className="inline mr-1 text-green-500" />
                Select Store *
              </label>

              <select
                value={selectedStoreUuid}
                onChange={(e) => handleStoreChange(e.target.value)}
                disabled={!selectedVendorUuid || storesLoading}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">-- Select Store --</option>

                {stores.map((store) => (
                  <option key={store.uuid} value={store.uuid}>
                    {store.store_name}
                  </option>
                ))}
              </select>

              {selectedVendorUuid &&
                stores.length === 0 &&
                !storesLoading && (
                  <p className="text-xs text-amber-600 mt-1">
                    No stores found for this vendor
                  </p>
                )}
            </div>

            {/* From Date */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <FaCalendarAlt className="inline mr-1" />
                From Date
              </label>

              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    from: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {/* To Date */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <FaCalendarAlt className="inline mr-1" />
                To Date
              </label>

              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    to: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {/* Reset Button */}
            <div className="flex gap-2">
              <button
                onClick={handleSyncOrders}
                disabled={!selectedVendorUuid || !selectedStoreUuid || isSyncingOrders}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium hover:shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaSync className={`text-sm ${isSyncingOrders ? "animate-spin" : ""}`} />
                {isSyncingOrders ? "Syncing..." : "Sync Orders"}
              </button>

              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition cursor-pointer flex items-center gap-2"
              >
                <FaTimes className="text-sm" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Warning - Requires both Vendor AND Store */}
        {showSelectorWarning && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <FaExclamationTriangle className="inline text-amber-500 text-lg mr-2" />
            <span className="text-amber-700">
              Please select both a Vendor and a Store to view orders
            </span>
          </div>
        )}

        {/* Page Header */}
        {!showSelectorWarning && (
          <PageHeader
            title="Order Management"
            addButtonLabel="Add Order"
            onAdd={() => navigate("/addorder")}
            tabs={STATUS_TABS}
            activeTab={activeStatus}
            onTabChange={(tab) => {
              setActiveStatus(tab);
              setPage(1);
            }}
            filters={[]}
            searchValue={searchInput}
            onSearchChange={setSearchInput}
            onSearchSubmit={() => {
              setSearch(searchInput);
              setPage(1);
            }}
            onResetFilters={() => {
              setSearch("");
              setSearchInput("");
              setActiveStatus("");
              setDateRange({ from: "", to: "" });
              setPage(1);
            }}
            searchPlaceholder="Search by order ID, customer name, email..."
          />
        )}

        {/* Table */}
        <div
          className={`rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${showSelectorWarning ? "opacity-60" : ""
            }`}
        >
          <div className="overflow-x-auto min-h-[500px]">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                  {[
                    "Order ID",
                    "Customer",
                    "Vendor/Store",
                    "Date",
                    "Amount",
                    "Payment",
                    "Status",
                    "",
                  ].map((col, i) => (
                    <th
                      key={i}
                      className="px-4 py-4 text-left font-semibold text-sm whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white">
                {showSelectorWarning ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-16 text-gray-400"
                    >
                      <FaStore className="text-5xl mx-auto mb-3 opacity-30" />
                      <p>Select a vendor and store to view orders</p>
                    </td>
                  </tr>
                ) : isLoading || isFetching ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16">
                      <div className="flex items-center justify-center gap-3 text-gray-400">
                        <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-teal-500" />
                        <span className="text-sm">Loading orders…</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-16 text-red-400 text-sm"
                    >
                      Error loading orders. Please try again.
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-16 text-gray-300 text-sm"
                    >
                      <FaShoppingBag className="text-4xl mx-auto mb-3 opacity-30" />
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order, idx) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/60 transition"
                      style={{
                        borderBottom:
                          idx < orders.length - 1
                            ? "1px solid #f3f4f6"
                            : "none",
                      }}
                    >
                      <td className="relative pl-5 pr-4 py-3">
                        <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-teal-400 to-teal-300" />

                        <div>
                          <span className="font-mono text-teal-600 text-sm font-semibold block">
                            #{order.magento_order_increment_id}
                          </span>

                          <span className="text-xs text-gray-400 capitalize">
                            {order.fulfillment_status || order.source}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              order.customer?.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                order.customer_name
                              )}&background=14B8A6&color=ffffff`
                            }
                            className="w-8 h-8 rounded-full object-cover"
                            alt={order.customer_name}
                          />

                          <div>
                            <p className="text-gray-700 text-sm font-medium">
                              {order.customer_name}
                            </p>

                            <p className="text-xs text-gray-400 truncate max-w-[150px]">
                              {order.customer_email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs text-gray-600 truncate max-w-[120px]">
                            {order.vendor?.name || "—"}
                          </p>

                          {order.store?.store_name && (
                            <p className="text-xs text-gray-400 truncate max-w-[120px]">
                              {order.store.store_name}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          {fmtDate(order.created_at)}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <span className="font-semibold text-gray-800">
                            {fmtPrice(order.grand_total)}
                          </span>

                          <p className="text-xs text-gray-400">
                            {order.currency}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${paymentStatusStyle(
                            order.payment_status
                          )}`}
                        >
                          {order.payment_status}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${orderStatusStyle(
                            order.status
                          )}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {order.status_label || order.status}
                        </span>
                      </td>

                      <td className="relative pl-4 pr-5 py-3 text-right">
                        <span className="absolute right-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-green-400 to-green-300" />

                        <RowMenu
                          order={order}
                          onView={() => {
                            setSelectedOrder(order);
                            setIsDrawerOpen(true);
                          }}
                          onUpdateStatus={() => {
                            setSelectedOrder(order);
                            setIsStatusModalOpen(true);
                          }}
                          onCancel={() => {
                            setSelectedOrder(order);
                            setIsCancelModalOpen(true);
                          }}
                          onRefund={() => {
                            setSelectedOrder(order);
                            setIsRefundModalOpen(true);
                          }}
                          onOperation={openOperationModal}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!showSelectorWarning && meta && meta.total > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <div className="text-xs text-gray-400">
                Showing {meta.from || 0} to {meta.to || 0} of {meta.total} orders
              </div>

              {renderPaginationButtons()}
            </div>
          )}
        </div>

        {/* Modals */}
        <StatusUpdateModal
          isOpen={isStatusModalOpen}
          onClose={() => {
            setIsStatusModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          vendorUuid={selectedVendorUuid}
          storeUuid={selectedStoreUuid}
          onSuccess={handleSuccess}
        />

        <CancelOrderModal
          isOpen={isCancelModalOpen}
          onClose={() => {
            setIsCancelModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          vendorUuid={selectedVendorUuid}
          storeUuid={selectedStoreUuid}
          onSuccess={handleSuccess}
        />

        <RefundModal
          isOpen={isRefundModalOpen}
          onClose={() => {
            setIsRefundModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          vendorUuid={selectedVendorUuid}
          storeUuid={selectedStoreUuid}
          onSuccess={handleSuccess}
        />

        <MagentoOperationModal
          operation={operationModal}
          order={selectedOrder}
          isLoading={isOperationLoading}
          onClose={() => {
            setOperationModal(null);
            setSelectedOrder(null);
          }}
          onSubmit={handleOrderOperation}
        />

        <OrderDetailDrawer
          order={isDrawerOpen ? selectedOrder : null}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedOrder(null);
          }}
        />
      </div>
    </>
  );

};

export default OrderList;
