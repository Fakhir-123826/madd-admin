// import { useState } from "react";
// import { FaEllipsisV, FaStore } from "react-icons/fa";
// import {
//     useGetVendorsQuery,
//     useApproveVendorMutation,
//     useSuspendVendorMutation,
//     useActivateVendorMutation,
// } from "../../app/api/VendorSlices/VendorApi";
// import FilterBar from "../../component/orderManagement/FilterBar";
// import { Link } from "react-router-dom";

// // ============ STATUS STYLE ============
// const statusStyle = (status: string) => {
//     switch (status) {
//         case "active": return "bg-green-100 text-green-600";
//         case "pending": return "bg-yellow-100 text-yellow-600";
//         case "inactive":
//         case "suspended": return "bg-red-100 text-red-600";
//         default: return "bg-gray-100 text-gray-500";
//     }
// };

// const kycStyle = (status: string) => {
//     switch (status) {
//         case "verified": return "bg-blue-100 text-blue-600";
//         case "pending": return "bg-orange-100 text-orange-500";
//         case "rejected": return "bg-red-100 text-red-600";
//         default: return "bg-gray-100 text-gray-500";
//     }
// };

// // ============ TYPES ============
// interface Vendor {
//     id: number;  // This is the numeric ID from database
//     uuid: string;  // This is the UUID string
//     company_name: string;
//     country_code: string;
//     address?: { city?: string; line1?: string };
//     contact?: { email?: string | null; phone?: string | null };
//     status: string;
//     kyc_status: string;
//     plan?: { name?: string };
//     stores?: any[];
//     created_at: string;
// }

// // ============ COMPONENT ============
// const VendorList = () => {
//     const tdBase = "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

//     const ITEMS_PER_PAGE = 8;
//     const [page, setPage] = useState(1);
//     const [openActionModal, setOpenActionModal] = useState(false);
//     const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
//     const [loading, setLoading] = useState<string | null>(null);

//     // ================= API =================
//     const { data, isLoading, isError, refetch } = useGetVendorsQuery();
//     const [approveVendor] = useApproveVendorMutation();
//     const [suspendVendor] = useSuspendVendorMutation();
//     const [activateVendor] = useActivateVendorMutation();
//     // Debug: Log the actual IDs from your database
//     console.log("=== VENDORS DATA ===");
//     console.log("Full response:", data);
//     console.log("Vendors array:", data?.data);
//     console.log("First vendor ID:", data?.data?.[0]?.id);
//     console.log("First vendor company:", data?.data?.[0]?.company_name);
//     console.log("All vendor IDs:", data?.data?.map((v: any) => v.id));

//     const vendors: Vendor[] = data?.data ?? [];
//     const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);
//     const paginated = vendors.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

//     // ================= HANDLERS =================
//     const openModal = (vendor: Vendor) => {
//         setSelectedVendor(vendor);
//         setOpenActionModal(true);
//     };

//     const closeModal = () => {
//         setSelectedVendor(null);
//         setOpenActionModal(false);
//         setLoading(null);
//     };

//     // Update your handlers to pass string IDs directly

//     // Update your handlers to use the numeric ID
//     const handleApprove = async () => {
//         if (!selectedVendor) return;
//         setLoading("approve");
//         try {
//             // Use the numeric ID, not the UUID
//             await approveVendor(selectedVendor.id).unwrap();
//             await refetch();
//             closeModal();
//         } catch (error) {
//             console.error("Approve error:", error);
//         } finally {
//             setLoading(null);
//         }
//     };

//     const handleSuspend = async () => {
//         if (!selectedVendor) return;
//         setLoading("suspend");
//         try {
//             await suspendVendor({
//                 id: selectedVendor.id, // Use numeric ID
//                 data: { reason: "Admin suspended vendor" },
//             }).unwrap();
//             await refetch();
//             closeModal();
//         } catch (error) {
//             console.error("Suspend error:", error);
//         } finally {
//             setLoading(null);
//         }
//     };

//     const handleActivate = async () => {
//         if (!selectedVendor) return;
//         setLoading("activate");
//         try {
//             await activateVendor(selectedVendor.id).unwrap(); // Use numeric ID
//             await refetch();
//             closeModal();
//         } catch (error) {
//             console.error("Activate error:", error);
//         } finally {
//             setLoading(null);
//         }
//     };
//     // Helper function to safely format date
//     const formatDate = (dateString: string) => {
//         try {
//             const date = new Date(dateString);
//             if (isNaN(date.getTime())) return "Invalid date";
//             return date.toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//             });
//         } catch {
//             return "Invalid date";
//         }
//     };

//     return (
//         <div className="bg-white shadow-sm p-6 rounded-xl">
//             {/* HEADER WITH CREATE BUTTON */}
//             <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-lg font-semibold">Vendor Management</h2>
//                 <Link to="/CreateVerder">
//                     <button
//                         onClick={() => {/* Add navigation */ }}
//                         className="px-5 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white hover:opacity-90 transition-opacity"
//                     >
//                         Create Vendor
//                     </button>
//                 </Link>
//             </div>

//             <FilterBar />
//             {/* TABLE - Keep the same as before */}
//             <div className="rounded-t-3xl overflow-x-auto">
//                 <table className="w-full text-sm border-separate border-spacing-y-3">
//                     <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
//                         <tr>
//                             <th className="p-4 text-left rounded-l-xl">Company Name</th>
//                             <th className="p-4 text-left">Country</th>
//                             <th className="p-4 text-left">City</th>
//                             <th className="p-4 text-left">Email</th>
//                             <th className="p-4 text-left">Plan</th>
//                             <th className="p-4 text-left">Stores</th>
//                             <th className="p-4 text-left">KYC</th>
//                             <th className="p-4 text-left">Status</th>
//                             <th className="p-4 text-left">Created</th>
//                             <th className="p-4 text-center rounded-r-xl">Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {isLoading ? (
//                             <tr>
//                                 <td colSpan={10} className="text-center py-10">
//                                     <div className="flex items-center justify-center gap-3">
//                                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500" />
//                                         <span className="text-gray-500">Loading vendors...</span>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ) : isError ? (
//                             <tr>
//                                 <td colSpan={10} className="text-center py-10 text-red-500">
//                                     Error loading vendors. Please try again.
//                                 </td>
//                             </tr>
//                         ) : paginated.length === 0 ? (
//                             <tr>
//                                 <td colSpan={10} className="text-center py-10 text-gray-400">
//                                     No vendors found.
//                                 </td>
//                             </tr>
//                         ) : (
//                             paginated.map((vendor) => (
//                                 <tr key={vendor.id} className="bg-white shadow-sm hover:shadow-md transition">
//                                     <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
//                                         {vendor.company_name}
//                                     </td>
//                                     <td className={tdBase}>{vendor.country_code ?? "—"}</td>
//                                     <td className={tdBase}>{vendor.address?.city ?? "—"}</td>
//                                     <td className={tdBase}>{vendor.contact?.email ?? "—"}</td>
//                                     <td className={tdBase}>{vendor.plan?.name ?? "—"}</td>
//                                     <td className={tdBase}>
//                                         <div className="flex items-center gap-1">
//                                             <FaStore className="text-teal-400 text-xs" />
//                                             {vendor.stores?.length ?? 0}
//                                         </div>
//                                     </td>
//                                     <td className={tdBase}>
//                                         <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${kycStyle(vendor.kyc_status)}`}>
//                                             {vendor.kyc_status}
//                                         </span>
//                                     </td>
//                                     <td className={tdBase}>
//                                         <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${statusStyle(vendor.status)}`}>
//                                             {vendor.status}
//                                         </span>
//                                     </td>
//                                     <td className={tdBase}>{formatDate(vendor.created_at)}</td>
//                                     <td className="relative p-4 rounded-r-xl text-right">
//                                         <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
//                                         <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
//                                         <FaEllipsisV
//                                             onClick={() => openModal(vendor)}
//                                             className="relative text-gray-400 cursor-pointer hover:text-gray-600"
//                                         />
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* PAGINATION - Keep the same */}
//             {totalPages > 1 && !isLoading && (
//                 <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-600">
//                     <button
//                         disabled={page === 1}
//                         onClick={() => setPage(page - 1)}
//                         className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
//                     >
//                         ← Back
//                     </button>

//                     {[...Array(totalPages)].map((_, i) => (
//                         <button
//                             key={i}
//                             onClick={() => setPage(i + 1)}
//                             className={`px-3 py-1 rounded-md ${page === i + 1
//                                 ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
//                                 : "hover:bg-gray-100"
//                                 }`}
//                         >
//                             {i + 1}
//                         </button>
//                     ))}

//                     <button
//                         disabled={page === totalPages}
//                         onClick={() => setPage(page + 1)}
//                         className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
//                     >
//                         Next →
//                     </button>
//                 </div>
//             )}

//             {/* ACTION MODAL - Keep the same */}
//             {openActionModal && selectedVendor && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//                     <div className="w-[500px] rounded-xl bg-white shadow-xl relative transform transition-all">
//                         <div className="relative">
//                             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-xl" />

//                             <button
//                                 onClick={closeModal}
//                                 className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
//                             >
//                                 ✕
//                             </button>

//                             <h2 className="text-lg font-semibold text-center pt-6 pb-2">
//                                 Vendor Actions
//                             </h2>
//                             <p className="text-sm text-gray-500 text-center pb-4">
//                                 {selectedVendor.company_name}
//                             </p>
//                         </div>

//                         <div className="p-6 space-y-4">
//                             {/* Current Status Badge */}
//                             <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-teal-50 to-green-50 border border-teal-100">
//                                 <span className="text-sm font-medium text-gray-700">Current Status:</span>
//                                 <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${statusStyle(selectedVendor.status)}`}>
//                                     {selectedVendor.status}
//                                 </span>
//                             </div>

//                             <div className="space-y-3">
//                                 {/* Approve Button - Static */}
//                                 <button
//                                     onClick={handleApprove}
//                                     disabled={loading === "approve"}
//                                     className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 transition-all disabled:opacity-50"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
//                                             {loading === "approve" ? (
//                                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
//                                             ) : (
//                                                 <span className="text-lg">✓</span>
//                                             )}
//                                         </div>
//                                         <div className="text-left">
//                                             <h3 className="font-semibold text-gray-800">Approve Vendor</h3>
//                                             <p className="text-xs text-gray-500">Approve vendor for full access</p>
//                                         </div>
//                                     </div>
//                                     <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">
//                                         {loading === "approve" ? "Processing..." : "Click to Approve"}
//                                     </span>
//                                 </button>

//                                 {/* Activate Button - Static */}
//                                 <button
//                                     onClick={handleActivate}
//                                     disabled={loading === "activate"}
//                                     className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 transition-all disabled:opacity-50"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
//                                             {loading === "activate" ? (
//                                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                                             ) : (
//                                                 <span className="text-lg">▶</span>
//                                             )}
//                                         </div>
//                                         <div className="text-left">
//                                             <h3 className="font-semibold text-gray-800">Activate Vendor</h3>
//                                             <p className="text-xs text-gray-500">Activate vendor for platform access</p>
//                                         </div>
//                                     </div>
//                                     <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded">
//                                         {loading === "activate" ? "Processing..." : "Click to Activate"}
//                                     </span>
//                                 </button>

//                                 {/* Suspend Button - Static */}
//                                 <button
//                                     onClick={handleSuspend}
//                                     disabled={loading === "suspend"}
//                                     className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 border border-red-200 transition-all disabled:opacity-50"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
//                                             {loading === "suspend" ? (
//                                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
//                                             ) : (
//                                                 <span className="text-lg">⛔</span>
//                                             )}
//                                         </div>
//                                         <div className="text-left">
//                                             <h3 className="font-semibold text-gray-800">Suspend Vendor</h3>
//                                             <p className="text-xs text-gray-500">Temporarily suspend vendor access</p>
//                                         </div>
//                                     </div>
//                                     <span className="text-xs bg-red-200 text-red-700 px-2 py-1 rounded">
//                                         {loading === "suspend" ? "Processing..." : "Click to Suspend"}
//                                     </span>
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
//                             <button
//                                 onClick={closeModal}
//                                 className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default VendorList;

//================================================================================================================================================================================
// import { useState } from "react";
// import { FaEllipsisV, FaStore, FaShieldAlt, FaUserCheck, FaBan } from "react-icons/fa";
// import { FiShield, FiAlertCircle, FiUserCheck } from "react-icons/fi";
// import {
//     useGetVendorsQuery,
//     useApproveVendorMutation,
//     useSuspendVendorMutation,
//     useActivateVendorMutation,
// } from "../../app/api/VendorSlices/VendorApi";
// import FilterBar from "../../component/orderManagement/FilterBar";
// import { Link } from "react-router-dom";

// // ============ STATUS STYLE ============
// const statusStyle = (status: string) => {
//     switch (status) {
//         case "active": return "bg-emerald-100 text-emerald-600 border border-emerald-200";
//         case "pending": return "bg-yellow-100 text-yellow-600 border border-yellow-200";
//         case "suspended": return "bg-red-100 text-red-600 border border-red-200";
//         case "inactive": return "bg-gray-100 text-gray-500";
//         default: return "bg-gray-100 text-gray-500";
//     }
// };

// const kycStyle = (status: string) => {
//     switch (status) {
//         case "verified": return "bg-blue-100 text-blue-600";
//         case "pending": return "bg-orange-100 text-orange-500";
//         case "rejected": return "bg-red-100 text-red-600";
//         default: return "bg-gray-100 text-gray-500";
//     }
// };

// // ============ TYPES ============
// interface Vendor {
//     id: number;
//     uuid: string;
//     company_name: string;
//     country_code: string;
//     address?: { city?: string; line1?: string };
//     contact?: { email?: string | null; phone?: string | null };
//     status: string;
//     kyc_status: string;
//     plan?: { name?: string };
//     stores?: any[];
//     created_at: string;
// }

// // ============ STATUS MANAGEMENT MODAL ============
// const StatusManagementModal = ({
//     isOpen,
//     onClose,
//     vendor,
//     onSuccess,
// }: {
//     isOpen: boolean;
//     onClose: () => void;
//     vendor: Vendor | null;
//     onSuccess: () => void;
// }) => {
//     const [approveVendor, { isLoading: isApproving }] = useApproveVendorMutation();
//     const [suspendVendor, { isLoading: isSuspending }] = useSuspendVendorMutation();
//     const [activateVendor, { isLoading: isActivating }] = useActivateVendorMutation();

//     const [suspendReason, setSuspendReason] = useState("");
//     const [showSuspendInput, setShowSuspendInput] = useState(false);
//     const [showToast, setShowToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

//     const showMessage = (type: "success" | "error", msg: string) => {
//         setShowToast({ type, msg });
//         setTimeout(() => setShowToast(null), 3000);
//     };

//     const handleApprove = async () => {
//         if (!vendor) return;
//         try {
//             await approveVendor(vendor.id).unwrap();
//             showMessage("success", `${vendor.company_name} has been approved`);
//             setTimeout(() => {
//                 onSuccess();
//                 onClose();
//             }, 1500);
//         } catch (error: any) {
//             showMessage("error", error?.data?.message || "Failed to approve vendor");
//         }
//     };

//     const handleSuspend = async () => {
//         if (!vendor) return;
//         if (!suspendReason.trim()) {
//             showMessage("error", "Please provide a reason for suspension");
//             return;
//         }
//         try {
//             await suspendVendor({
//                 id: vendor.id,
//                 data: { reason: suspendReason },
//             }).unwrap();
//             showMessage("success", `${vendor.company_name} has been suspended`);
//             setTimeout(() => {
//                 onSuccess();
//                 onClose();
//             }, 1500);
//         } catch (error: any) {
//             showMessage("error", error?.data?.message || "Failed to suspend vendor");
//         }
//     };

//     const handleActivate = async () => {
//         if (!vendor) return;
//         try {
//             await activateVendor(vendor.id).unwrap();
//             showMessage("success", `${vendor.company_name} has been activated`);
//             setTimeout(() => {
//                 onSuccess();
//                 onClose();
//             }, 1500);
//         } catch (error: any) {
//             showMessage("error", error?.data?.message || "Failed to activate vendor");
//         }
//     };

//     if (!isOpen || !vendor) return null;

//     const isPending = vendor.status === "pending";
//     const isActive = vendor.status === "active";
//     const isSuspended = vendor.status === "suspended";

//     return (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//             {/* Toast inside modal */}
//             {showToast && (
//                 <div
//                     className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
//                         ${showToast.type === "success"
//                             ? "bg-green-50 text-green-700 border border-green-200"
//                             : "bg-red-50 text-red-700 border border-red-200"
//                         }`}
//                 >
//                     <span>{showToast.type === "success" ? "✓" : "✕"}</span>
//                     {showToast.msg}
//                 </div>
//             )}

//             <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

//             <div className="relative min-h-screen flex items-center justify-center p-4">
//                 <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
//                     {/* Header */}
//                     <div className="relative">
//                         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
//                         <div className="px-6 py-4 border-b border-gray-100">
//                             <h2 className="text-xl font-bold text-gray-800">Vendor Status Management</h2>
//                             <p className="text-sm text-gray-500 mt-1">Manage status for {vendor.company_name}</p>
//                         </div>
//                         <button
//                             onClick={onClose}
//                             className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
//                         >
//                             ✕
//                         </button>
//                     </div>

//                     {/* Current Status Badge */}
//                     <div className="px-6 pt-4">
//                         <div className="bg-gray-50 rounded-lg p-4">
//                             <div className="flex items-center justify-between">
//                                 <span className="text-sm text-gray-600">Current Status:</span>
//                                 <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyle(vendor.status)}`}>
//                                     {vendor.status}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Status Switches */}
//                     <div className="p-6 space-y-4">
//                         {/* Approve Switch - Only show for pending vendors */}
//                         {isPending && (
//                             <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
//                                         <FaUserCheck className="text-green-600 text-lg" />
//                                     </div>
//                                     <div>
//                                         <h3 className="font-semibold text-gray-800">Approve Vendor</h3>
//                                         <p className="text-xs text-gray-500">Approve vendor for full access</p>
//                                     </div>
//                                 </div>
//                                 <button
//                                     onClick={handleApprove}
//                                     disabled={isApproving}
//                                     className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                                         isApproving
//                                             ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                                             : "bg-green-500 text-white hover:bg-green-600"
//                                     }`}
//                                 >
//                                     {isApproving ? "Approving..." : "Approve"}
//                                 </button>
//                             </div>
//                         )}

//                         {/* Activate Switch - Only show for suspended vendors */}
//                         {isSuspended && (
//                             <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
//                                         <FiUserCheck className="text-blue-600 text-lg" />
//                                     </div>
//                                     <div>
//                                         <h3 className="font-semibold text-gray-800">Activate Vendor</h3>
//                                         <p className="text-xs text-gray-500">Reactivate vendor account</p>
//                                     </div>
//                                 </div>
//                                 <button
//                                     onClick={handleActivate}
//                                     disabled={isActivating}
//                                     className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                                         isActivating
//                                             ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                                             : "bg-blue-500 text-white hover:bg-blue-600"
//                                     }`}
//                                 >
//                                     {isActivating ? "Activating..." : "Activate"}
//                                 </button>
//                             </div>
//                         )}

//                         {/* Suspend Switch - Only show for active vendors */}
//                         {isActive && (
//                             <div className="flex flex-col gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
//                                             <FiShield className="text-red-600 text-lg" />
//                                         </div>
//                                         <div>
//                                             <h3 className="font-semibold text-gray-800">Suspend Vendor</h3>
//                                             <p className="text-xs text-gray-500">Temporarily suspend vendor access</p>
//                                         </div>
//                                     </div>
//                                     <label className="relative inline-flex items-center cursor-pointer">
//                                         <input
//                                             type="checkbox"
//                                             checked={showSuspendInput}
//                                             onChange={() => setShowSuspendInput(!showSuspendInput)}
//                                             className="sr-only peer"
//                                         />
//                                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
//                                     </label>
//                                 </div>

//                                 {showSuspendInput && (
//                                     <div className="mt-2">
//                                         <textarea
//                                             value={suspendReason}
//                                             onChange={(e) => setSuspendReason(e.target.value)}
//                                             placeholder="Enter reason for suspension..."
//                                             className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
//                                             rows={2}
//                                         />
//                                         <button
//                                             onClick={handleSuspend}
//                                             disabled={isSuspending}
//                                             className="mt-2 w-full px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-50"
//                                         >
//                                             {isSuspending ? "Suspending..." : "Confirm Suspend"}
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         {/* Info message for other statuses */}
//                         {!isPending && !isActive && !isSuspended && (
//                             <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
//                                 <p className="text-sm text-gray-500">
//                                     This vendor cannot be modified at this time.
//                                 </p>
//                             </div>
//                         )}
//                     </div>

//                     {/* Footer */}
//                     <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
//                         <button
//                             onClick={onClose}
//                             className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ============ MAIN COMPONENT ============
// const VendorList = () => {
//     const tdBase = "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

//     const ITEMS_PER_PAGE = 8;
//     const [page, setPage] = useState(1);
//     const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
//     const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
//     const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

//     // ================= API =================
//     const { data, isLoading, isError, refetch } = useGetVendorsQuery();

//     const showToast = (type: "success" | "error", msg: string) => {
//         setToast({ type, msg });
//         setTimeout(() => setToast(null), 3000);
//     };

//     const vendors: Vendor[] = data?.data ?? [];
//     const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);
//     const paginated = vendors.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

//     // ================= HANDLERS =================
//     const handleStatusManage = (vendor: Vendor) => {
//         setSelectedVendor(vendor);
//         setIsStatusModalOpen(true);
//     };

//     const closeModal = () => {
//         setSelectedVendor(null);
//         setIsStatusModalOpen(false);
//     };

//     const handleSuccess = async () => {
//         await refetch();
//         showToast("success", "Vendor status updated successfully!");
//     };

//     // Helper function to safely format date
//     const formatDate = (dateString: string) => {
//         try {
//             const date = new Date(dateString);
//             if (isNaN(date.getTime())) return "Invalid date";
//             return date.toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//             });
//         } catch {
//             return "Invalid date";
//         }
//     };

//     return (
//         <div className="bg-white shadow-sm p-6 rounded-xl">
//             {/* Toast Notification */}
//             {toast && (
//                 <div
//                     className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
//                         ${toast.type === "success"
//                             ? "bg-green-50 text-green-700 border border-green-200"
//                             : "bg-red-50 text-red-700 border border-red-200"
//                         }`}
//                 >
//                     <span>{toast.type === "success" ? "✓" : "✕"}</span>
//                     {toast.msg}
//                 </div>
//             )}

//             {/* HEADER WITH CREATE BUTTON */}
//             <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-lg font-semibold">Vendor Management</h2>
//                 <Link to="/CreateVerder">
//                     <button
//                         className="px-5 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white hover:opacity-90 transition-opacity"
//                     >
//                         Create Vendor
//                     </button>
//                 </Link>
//             </div>

//             <FilterBar />

//             {/* TABLE */}
//             <div className="rounded-t-3xl overflow-x-auto">
//                 <table className="w-full text-sm border-separate border-spacing-y-3">
//                     <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
//                         <tr>
//                             <th className="p-4 text-left rounded-l-xl">Company Name</th>
//                             <th className="p-4 text-left">Country</th>
//                             <th className="p-4 text-left">City</th>
//                             <th className="p-4 text-left">Email</th>
//                             <th className="p-4 text-left">Plan</th>
//                             <th className="p-4 text-left">Stores</th>
//                             <th className="p-4 text-left">KYC</th>
//                             <th className="p-4 text-left">Status</th>
//                             <th className="p-4 text-left">Created</th>
//                             <th className="p-4 text-center rounded-r-xl">Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {isLoading ? (
//                             <tr>
//                                 <td colSpan={10} className="text-center py-10">
//                                     <div className="flex items-center justify-center gap-3">
//                                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500" />
//                                         <span className="text-gray-500">Loading vendors...</span>
//                                     </div>
//                                  </td>
//                              </tr>
//                         ) : isError ? (
//                             <tr>
//                                 <td colSpan={10} className="text-center py-10 text-red-500">
//                                     Error loading vendors. Please try again.
//                                  </td>
//                              </tr>
//                         ) : paginated.length === 0 ? (
//                             <tr>
//                                 <td colSpan={10} className="text-center py-10 text-gray-400">
//                                     No vendors found.
//                                  </td>
//                              </tr>
//                         ) : (
//                             paginated.map((vendor) => (
//                                 <tr key={vendor.id} className="bg-white shadow-sm hover:shadow-md transition">
//                                     <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
//                                         {vendor.company_name}
//                                     </td>
//                                     <td className={tdBase}>{vendor.country_code ?? "—"}</td>
//                                     <td className={tdBase}>{vendor.address?.city ?? "—"}</td>
//                                     <td className={tdBase}>{vendor.contact?.email ?? "—"}</td>
//                                     <td className={tdBase}>{vendor.plan?.name ?? "—"}</td>
//                                     <td className={tdBase}>
//                                         <div className="flex items-center gap-1">
//                                             <FaStore className="text-teal-400 text-xs" />
//                                             {vendor.stores?.length ?? 0}
//                                         </div>
//                                     </td>
//                                     <td className={tdBase}>
//                                         <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${kycStyle(vendor.kyc_status)}`}>
//                                             {vendor.kyc_status}
//                                         </span>
//                                     </td>
//                                     <td className={tdBase}>
//                                         <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${statusStyle(vendor.status)}`}>
//                                             {vendor.status}
//                                         </span>
//                                     </td>
//                                     <td className={tdBase}>{formatDate(vendor.created_at)}</td>
//                                     <td className="relative p-4 rounded-r-xl text-right">
//                                         <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
//                                         <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
//                                         <button
//                                             onClick={() => handleStatusManage(vendor)}
//                                             className="relative text-gray-400 hover:text-teal-500 transition-colors cursor-pointer"
//                                             title="Manage Status"
//                                         >
//                                             <FaEllipsisV className="text-sm" />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* PAGINATION */}
//             {totalPages > 1 && !isLoading && (
//                 <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-600">
//                     <button
//                         disabled={page === 1}
//                         onClick={() => setPage(page - 1)}
//                         className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
//                     >
//                         ← Back
//                     </button>

//                     {[...Array(totalPages)].map((_, i) => (
//                         <button
//                             key={i}
//                             onClick={() => setPage(i + 1)}
//                             className={`px-3 py-1 rounded-md ${page === i + 1
//                                 ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
//                                 : "hover:bg-gray-100"
//                                 }`}
//                         >
//                             {i + 1}
//                         </button>
//                     ))}

//                     <button
//                         disabled={page === totalPages}
//                         onClick={() => setPage(page + 1)}
//                         className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
//                     >
//                         Next →
//                     </button>
//                 </div>
//             )}

//             {/* Status Management Modal */}
//             <StatusManagementModal
//                 isOpen={isStatusModalOpen}
//                 onClose={closeModal}
//                 vendor={selectedVendor}
//                 onSuccess={handleSuccess}
//             />
//         </div>
//     );
// };

// export default VendorList;


import { useState } from "react";
import { FaEllipsisV, FaStore, FaUserCheck, FaCrown } from "react-icons/fa";
import { FiShield, FiUserCheck } from "react-icons/fi";
import {
    useGetVendorsQuery,
    useApproveVendorMutation,
    useSuspendVendorMutation,
    useActivateVendorMutation,
    useUpdateVendorPlanMutation,
} from "../../app/api/VendorSlices/VendorApi";
import FilterBar from "../../component/orderManagement/FilterBar";
import { Link } from "react-router-dom";

// ============ STATUS STYLE ============
const statusStyle = (status: string) => {
    switch (status) {
        case "active": return "bg-emerald-100 text-emerald-600 border border-emerald-200";
        case "pending": return "bg-yellow-100 text-yellow-600 border border-yellow-200";
        case "suspended": return "bg-red-100 text-red-600 border border-red-200";
        case "inactive": return "bg-gray-100 text-gray-500";
        default: return "bg-gray-100 text-gray-500";
    }
};

const kycStyle = (status: string) => {
    switch (status) {
        case "verified": return "bg-blue-100 text-blue-600";
        case "pending": return "bg-orange-100 text-orange-500";
        case "rejected": return "bg-red-100 text-red-600";
        default: return "bg-gray-100 text-gray-500";
    }
};

// ============ TYPES ============
interface Vendor {
    id: number;
    uuid: string;
    company_name: string;
    country_code: string;
    address?: { city?: string; line1?: string };
    contact?: { email?: string | null; phone?: string | null };
    status: string;
    kyc_status: string;
    plan?: { id: number; name?: string };
    stores?: any[];
    created_at: string;
}

// ============ PLAN MANAGEMENT MODAL ============
const PlanManagementModal = ({
    isOpen,
    onClose,
    vendor,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    vendor: Vendor | null;
    onSuccess: () => void;
}) => {
    const [updateVendorPlan, { isLoading }] = useUpdateVendorPlanMutation();
    const [selectedPlanId, setSelectedPlanId] = useState<number>(0);
    const [durationMonths, setDurationMonths] = useState<number>(12);
    const [showToast, setShowToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const plans = [
        { id: 1, name: "Basic", price: "$49/month", features: ["Basic Support", "Up to 100 products", "Basic Analytics"] },
        { id: 2, name: "Premium", price: "$99/month", features: ["Priority Support", "Up to 1000 products", "Advanced Analytics", "API Access"] },
        { id: 3, name: "Enterprise", price: "$299/month", features: ["24/7 Support", "Unlimited products", "Custom Analytics", "Full API Access", "Dedicated Account Manager"] },
    ];

    const showMessage = (type: "success" | "error", msg: string) => {
        setShowToast({ type, msg });
        setTimeout(() => setShowToast(null), 3000);
    };

    const handleUpdatePlan = async () => {
        if (!vendor || !selectedPlanId) {
            showMessage("error", "Please select a plan");
            return;
        }

        try {
            await updateVendorPlan({
                id: vendor.id,
                data: {
                    plan_id: selectedPlanId,
                    duration_months: durationMonths,
                },
            }).unwrap();
            showMessage("success", `${vendor.company_name}'s plan updated successfully`);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (error: any) {
            showMessage("error", error?.data?.message || "Failed to update plan");
        }
    };

    if (!isOpen || !vendor) return null;

    const selectedPlan = plans.find(p => p.id === selectedPlanId);
    const totalPrice = selectedPlan ? parseInt(selectedPlan.price.replace('$', '')) * durationMonths : 0;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {showToast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${showToast.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"}`}
                >
                    <span>{showToast.type === "success" ? "✓" : "✕"}</span>
                    {showToast.msg}
                </div>
            )}

            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full">
                    {/* Header */}
                    <div className="relative">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-t-2xl" />
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Change Vendor Plan</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Update subscription plan for {vendor.company_name}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Current Plan: <span className="font-medium text-purple-600">{vendor.plan?.name || "No Plan"}</span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Form */}
                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                        {/* Plan Selection */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Select Plan <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-3">
                                {plans.map((plan) => (
                                    <label
                                        key={plan.id}
                                        className={`flex items-start justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                                            ${selectedPlanId === plan.id
                                                ? "border-purple-500 bg-purple-50 shadow-md"
                                                : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"}`}
                                    >
                                        <div className="flex items-start gap-3 flex-1">
                                            <input
                                                type="radio"
                                                name="plan"
                                                value={plan.id}
                                                checked={selectedPlanId === plan.id}
                                                onChange={() => setSelectedPlanId(plan.id)}
                                                className="w-4 h-4 text-purple-500 mt-1"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-semibold text-gray-800">{plan.name}</p>
                                                    <p className="text-lg font-bold text-purple-600">{plan.price}</p>
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {plan.features.map((feature, idx) => (
                                                        <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                            ✓ {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Duration Selection */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Duration (Months)
                            </label>
                            <select
                                value={durationMonths}
                                onChange={(e) => setDurationMonths(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            >
                                <option value={1}>1 Month</option>
                                <option value={3}>3 Months (Save 5%)</option>
                                <option value={6}>6 Months (Save 10%)</option>
                                <option value={12}>12 Months (Save 15%)</option>
                                <option value={24}>24 Months (Save 20%)</option>
                                <option value={36}>36 Months (Save 25%)</option>
                            </select>
                        </div>

                        {/* Summary */}
                        {selectedPlanId > 0 && (
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Order Summary:</p>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Plan:</span>
                                        <span className="font-medium">{selectedPlan?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Price per month:</span>
                                        <span>{selectedPlan?.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Duration:</span>
                                        <span>{durationMonths} months</span>
                                    </div>
                                    <div className="border-t border-purple-200 my-2"></div>
                                    <div className="flex justify-between font-bold">
                                        <span>Total Amount:</span>
                                        <span className="text-purple-600">${totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition rounded-lg hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdatePlan}
                            disabled={isLoading || !selectedPlanId}
                            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                    Updating...
                                </>
                            ) : (
                                "Update Plan"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============ STATUS MANAGEMENT MODAL ============
const StatusManagementModal = ({
    isOpen,
    onClose,
    vendor,
    onSuccess,
    onPlanManage,
}: {
    isOpen: boolean;
    onClose: () => void;
    vendor: Vendor | null;
    onSuccess: () => void;
    onPlanManage: () => void;
}) => {
    const [approveVendor, { isLoading: isApproving }] = useApproveVendorMutation();
    const [suspendVendor, { isLoading: isSuspending }] = useSuspendVendorMutation();
    const [activateVendor, { isLoading: isActivating }] = useActivateVendorMutation();

    const [suspendReason, setSuspendReason] = useState("");
    const [showSuspendInput, setShowSuspendInput] = useState(false);
    const [showToast, setShowToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const showMessage = (type: "success" | "error", msg: string) => {
        setShowToast({ type, msg });
        setTimeout(() => setShowToast(null), 3000);
    };

    const handleApprove = async () => {
        if (!vendor) return;
        try {
            await approveVendor(vendor.id).unwrap();
            showMessage("success", `${vendor.company_name} has been approved`);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (error: any) {
            showMessage("error", error?.data?.message || "Failed to approve vendor");
        }
    };

    const handleSuspend = async () => {
        if (!vendor) return;
        if (!suspendReason.trim()) {
            showMessage("error", "Please provide a reason for suspension");
            return;
        }
        try {
            await suspendVendor({
                id: vendor.id,
                data: { reason: suspendReason },
            }).unwrap();
            showMessage("success", `${vendor.company_name} has been suspended`);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (error: any) {
            showMessage("error", error?.data?.message || "Failed to suspend vendor");
        }
    };

    const handleActivate = async () => {
        if (!vendor) return;
        try {
            await activateVendor(vendor.id).unwrap();
            showMessage("success", `${vendor.company_name} has been activated`);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (error: any) {
            showMessage("error", error?.data?.message || "Failed to activate vendor");
        }
    };

    if (!isOpen || !vendor) return null;

    const isPending = vendor.status === "pending";
    const isActive = vendor.status === "active";
    const isSuspended = vendor.status === "suspended";

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {showToast && (
                <div
                    className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                        ${showToast.type === "success"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                >
                    <span>{showToast.type === "success" ? "✓" : "✕"}</span>
                    {showToast.msg}
                </div>
            )}

            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                    {/* Header */}
                    <div className="relative">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Vendor Management</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage status and plan for {vendor.company_name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Current Status Badge */}
                    <div className="px-6 pt-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Current Status:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyle(vendor.status)}`}>
                                    {vendor.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 space-y-4">
                        {/* Change Plan Button - Show for all vendors except pending */}
                        {!isPending && (
                            <div 
                                className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200 cursor-pointer hover:bg-purple-100 transition"
                                onClick={onPlanManage}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                        <FaCrown className="text-purple-600 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Change Plan</h3>
                                        <p className="text-xs text-gray-500">Upgrade or downgrade vendor subscription</p>
                                    </div>
                                </div>
                                <span className="text-purple-600 text-xl">→</span>
                            </div>
                        )}

                        {/* Approve Button - Only for pending vendors */}
                        {isPending && (
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <FaUserCheck className="text-green-600 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Approve Vendor</h3>
                                        <p className="text-xs text-gray-500">Approve vendor for full access</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleApprove}
                                    disabled={isApproving}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isApproving
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-green-500 text-white hover:bg-green-600"
                                        }`}
                                >
                                    {isApproving ? "Approving..." : "Approve"}
                                </button>
                            </div>
                        )}

                        {/* Activate Button - Only for suspended vendors */}
                        {isSuspended && (
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <FiUserCheck className="text-blue-600 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Activate Vendor</h3>
                                        <p className="text-xs text-gray-500">Reactivate vendor account</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleActivate}
                                    disabled={isActivating}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActivating
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                >
                                    {isActivating ? "Activating..." : "Activate"}
                                </button>
                            </div>
                        )}

                        {/* Suspend Section - Only for active vendors */}
                        {isActive && (
                            <div className="flex flex-col gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                            <FiShield className="text-red-600 text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">Suspend Vendor</h3>
                                            <p className="text-xs text-gray-500">Temporarily suspend vendor access</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showSuspendInput}
                                            onChange={() => setShowSuspendInput(!showSuspendInput)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                    </label>
                                </div>

                                {showSuspendInput && (
                                    <div className="mt-2">
                                        <textarea
                                            value={suspendReason}
                                            onChange={(e) => setSuspendReason(e.target.value)}
                                            placeholder="Enter reason for suspension..."
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                                            rows={2}
                                        />
                                        <button
                                            onClick={handleSuspend}
                                            disabled={isSuspending}
                                            className="mt-2 w-full px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-50"
                                        >
                                            {isSuspending ? "Suspending..." : "Confirm Suspend"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Info message for other statuses */}
                        {!isPending && !isActive && !isSuspended && (
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                                <p className="text-sm text-gray-500">
                                    This vendor cannot be modified at this time.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============ MAIN COMPONENT ============
const VendorList = () => {
    const tdBase = "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

    const ITEMS_PER_PAGE = 8;
    const [page, setPage] = useState(1);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    // ================= API =================
    const { data, isLoading, isError, refetch } = useGetVendorsQuery();

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const vendors: Vendor[] = data?.data ?? [];
    const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);
    const paginated = vendors.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    // ================= HANDLERS =================
    const handleStatusManage = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        setIsStatusModalOpen(true);
    };

    const handlePlanManage = () => {
        setIsStatusModalOpen(false);
        setIsPlanModalOpen(true);
    };

    const closeStatusModal = () => {
        setSelectedVendor(null);
        setIsStatusModalOpen(false);
    };

    const closePlanModal = () => {
        setSelectedVendor(null);
        setIsPlanModalOpen(false);
    };

    const handleSuccess = async () => {
        await refetch();
        showToast("success", "Operation completed successfully!");
    };

    // Helper function to safely format date
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid date";
            return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        } catch {
            return "Invalid date";
        }
    };

    return (
        <div className="bg-white shadow-sm p-6 rounded-xl">
            {/* Toast Notification */}
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

            {/* HEADER WITH CREATE BUTTON */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Vendor Management</h2>
                <Link to="/CreateVerder">
                    <button
                        className="px-5 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white hover:opacity-90 transition-opacity"
                    >
                        Create Vendor
                    </button>
                </Link>
            </div>

            <FilterBar />

            {/* TABLE */}
            <div className="rounded-t-3xl overflow-x-auto">
                <table className="w-full text-sm border-separate border-spacing-y-3">
                    <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                        <tr>
                            <th className="p-4 text-left rounded-l-xl">Company Name</th>
                            <th className="p-4 text-left">Country</th>
                            <th className="p-4 text-left">City</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Plan</th>
                            <th className="p-4 text-left">Stores</th>
                            <th className="p-4 text-left">KYC</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Created</th>
                            <th className="p-4 text-center rounded-r-xl">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={10} className="text-center py-10">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500" />
                                        <span className="text-gray-500">Loading vendors...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={10} className="text-center py-10 text-red-500">
                                    Error loading vendors. Please try again.
                                </td>
                            </tr>
                        ) : paginated.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-10 text-gray-400">
                                    No vendors found.
                                </td>
                            </tr>
                        ) : (
                            paginated.map((vendor) => (
                                <tr key={vendor.id} className="bg-white shadow-sm hover:shadow-md transition">
                                    <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                                        {vendor.company_name}
                                    </td>
                                    <td className={tdBase}>{vendor.country_code ?? "—"}</td>
                                    <td className={tdBase}>{vendor.address?.city ?? "—"}</td>
                                    <td className={tdBase}>{vendor.contact?.email ?? "—"}</td>
                                    <td className={tdBase}>
                                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-600">
                                            {vendor.plan?.name ?? "—"}
                                        </span>
                                    </td>
                                    <td className={tdBase}>
                                        <div className="flex items-center gap-1">
                                            <FaStore className="text-teal-400 text-xs" />
                                            {vendor.stores?.length ?? 0}
                                        </div>
                                    </td>
                                    <td className={tdBase}>
                                        <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${kycStyle(vendor.kyc_status)}`}>
                                            {vendor.kyc_status}
                                        </span>
                                    </td>
                                    <td className={tdBase}>
                                        <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${statusStyle(vendor.status)}`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className={tdBase}>{formatDate(vendor.created_at)}</td>
                                    <td className="relative p-4 rounded-r-xl text-right">
                                        <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                                        <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                                        <button
                                            onClick={() => handleStatusManage(vendor)}
                                            className="relative text-gray-400 hover:text-teal-500 transition-colors cursor-pointer"
                                            title="Manage Vendor"
                                        >
                                            <FaEllipsisV className="text-sm" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
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

            {/* Status Management Modal */}
            <StatusManagementModal
                isOpen={isStatusModalOpen}
                onClose={closeStatusModal}
                vendor={selectedVendor}
                onSuccess={handleSuccess}
                onPlanManage={handlePlanManage}
            />

            {/* Plan Management Modal */}
            <PlanManagementModal
                isOpen={isPlanModalOpen}
                onClose={closePlanModal}
                vendor={selectedVendor}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default VendorList;