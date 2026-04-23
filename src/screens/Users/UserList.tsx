// import { useState, useRef, useEffect } from "react";
// import { FiFilter, FiRefreshCw, FiSearch, FiChevronDown } from "react-icons/fi";
// import { FaEllipsisV, FaPlus, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import {
//   useGetUsersQuery,
//   useCreateUserMutation,
//   useUpdateUserMutation,
//   useDeleteUserMutation,
// } from "../../app/api/UserSlices/UserApi";
// import UserModal from "../../component/UserModal";
// import { Link, useNavigate } from "react-router-dom";
// import { ROUTES } from "../../router";

// // ============ USER TYPE DEFINITION ============
// interface User {
//   id: string;
//   full_name: string;
//   email: string;
//   phone: string | null;
//   user_type: string;
//   status: string;
//   country_code: string | null;
//   is_email_verified: boolean;
//   is_phone_verified: boolean;
//   is_kyc_verified: boolean;
//   created_at: string;
//   vendor?: {
//     company_name: string;
//   };
// }

// // ============ HELPERS ============
// const fmtDate = (d: string) =>
//   new Date(d).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

// // ============ STATUS STYLES ============
// const statusStyle = (status: string) => {
//   switch (status) {
//     case "active":
//       return "bg-emerald-50 text-emerald-600 border border-emerald-200";
//     case "suspended":
//       return "bg-red-100 text-red-600";
//     case "pending":
//       return "bg-yellow-100 text-yellow-600";
//     case "banned":
//       return "bg-gray-200 text-gray-600";
//     default:
//       return "bg-gray-100 text-gray-500";
//   }
// };

// const userTypeStyle = (type: string) => {
//   switch (type) {
//     case "super_admin":
//       return "bg-purple-100 text-purple-600";
//     case "vendor":
//       return "bg-blue-100 text-blue-600";
//     case "customer":
//       return "bg-teal-100 text-teal-600";
//     case "mlm_agent":
//       return "bg-orange-100 text-orange-500";
//     default:
//       return "bg-gray-100 text-gray-500";
//   }
// };

// // ============ FILTER DROPDOWN ============
// const FilterDropdown = ({
//   label,
//   options,
//   value,
//   onChange,
// }: {
//   label: string;
//   options: string[];
//   value: string;
//   onChange: (v: string) => void;
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

//   return (
//     <div className="relative" ref={ref}>
//       <button
//         onClick={() => setOpen(!open)}
//         className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition cursor-pointer"
//       >
//         <span className="font-medium">{value || label}</span>
//         <FiChevronDown
//           className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""
//             }`}
//         />
//       </button>
//       {open && (
//         <div className="absolute top-full left-0 mt-1 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[140px]">
//           <button
//             onClick={() => {
//               onChange("");
//               setOpen(false);
//             }}
//             className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-50 cursor-pointer"
//           >
//             All
//           </button>
//           {options.map((opt) => (
//             <button
//               key={opt}
//               onClick={() => {
//                 onChange(opt);
//                 setOpen(false);
//               }}
//               className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer"
//             >
//               {opt.replace("_", " ")}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // ============ ROW ACTION MENU ============
// const RowMenu = ({
//   user,
//   onEdit,
//   onDelete,
//   onView,
// }: {
//   user: User;
//   onEdit: () => void;
//   onDelete: () => void;
//   onView: () => void;
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

//   return (
//     <div className="relative" ref={ref}>
//       <button
//         onClick={() => setOpen(!open)}
//         className="text-gray-400 hover:text-gray-600 transition p-1 cursor-pointer"
//       >
//         <FaEllipsisV className="text-sm" />
//       </button>
//       {open && (
//         <div className="absolute right-0 top-7 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-40 text-sm">
//           <button
//             onClick={() => {
//               onView();
//               setOpen(false);
//             }}
//             className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 cursor-pointer"
//           >
//             View Details
//           </button>
//           <button
//             onClick={() => {
//               onEdit();
//               setOpen(false);
//             }}
//             className="w-full text-left px-4 py-2 hover:bg-teal-50 text-teal-700 cursor-pointer"
//           >
//             Edit
//           </button>
//           <button
//             onClick={() => {
//               onDelete();
//               setOpen(false);
//             }}
//             className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer"
//           >
//             Delete
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // ============ MAIN COMPONENT ============
// const ITEMS_PER_PAGE = 10;

// const UserList = () => {
//   const navigate = useNavigate();
//   const [page, setPage] = useState(1);
//   const [activeTab, setActiveTab] = useState<"list" | "type" | "status">(
//     "list"
//   );
//   const [filterStatus, setFilterStatus] = useState("");
//   const [filterType, setFilterType] = useState("");
//   const [filterVerification, setFilterVerification] = useState("");
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");
//   const [toast, setToast] = useState<{
//     type: "success" | "error";
//     msg: string;
//   } | null>(null);

//   // Modal states
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   const { data, isLoading, error, refetch } = useGetUsersQuery({});
//   const [createUser] = useCreateUserMutation();
//   const [updateUser] = useUpdateUserMutation();
//   const [deleteUser] = useDeleteUserMutation();

//   const users: User[] = data?.data ?? [];

//   const showToast = (type: "success" | "error", msg: string) => {
//     setToast({ type, msg });
//     setTimeout(() => setToast(null), 3000);
//   };

//   // Handle View Details
//   const handleViewDetails = (userId: string) => {
//     navigate(ROUTES.USER_DETAILS(userId));
//   };

//   // Handle Create/Edit Save
//   const handleSaveUser = async (formData: Partial<User>) => {
//     try {
//       if (selectedUser) {
//         await updateUser({
//           id: selectedUser.id,
//           data: formData,
//         }).unwrap();
//         showToast("success", "User updated successfully!");
//       } else {
//         await createUser(formData).unwrap();
//         showToast("success", "User created successfully!");
//       }
//       refetch();
//       setIsModalOpen(false);
//       setSelectedUser(null);
//     } catch (error: any) {
//       console.error("Save error:", error);
//       showToast("error", error?.data?.message || "Failed to save user");
//       throw error;
//     }
//   };

//   const handleEdit = (user: User) => {
//     setSelectedUser(user);
//     setIsModalOpen(true);
//   };

//   const handleAddNew = () => {
//     setSelectedUser(null);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await deleteUser(id).unwrap();
//       showToast("success", "User deleted successfully.");
//       refetch();
//     } catch (error: any) {
//       showToast("error", error?.data?.message || "Failed to delete user.");
//     }
//   };

//   // Get unique values for filters
//   const userTypes = [...new Set(users.map((u) => u.user_type).filter(Boolean))];
//   const statuses = [...new Set(users.map((u) => u.status).filter(Boolean))];

//   // Filter & Search
//   const filtered = users.filter((user) => {
//     const matchStatus = !filterStatus || user.status === filterStatus;
//     const matchType = !filterType || user.user_type === filterType;
//     const matchVerification =
//       !filterVerification ||
//       (filterVerification === "Verified"
//         ? user.is_email_verified
//         : !user.is_email_verified);
//     const matchSearch =
//       !search ||
//       user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
//       user.email?.toLowerCase().includes(search.toLowerCase()) ||
//       user.phone?.toLowerCase().includes(search.toLowerCase());
//     return matchStatus && matchType && matchVerification && matchSearch;
//   });

//   const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
//   const paginated = filtered.slice(
//     (page - 1) * ITEMS_PER_PAGE,
//     page * ITEMS_PER_PAGE
//   );

//   const handleReset = () => {
//     setFilterStatus("");
//     setFilterType("");
//     setFilterVerification("");
//     setSearch("");
//     setSearchInput("");
//     setPage(1);
//   };

//   const handleSearch = () => {
//     setSearch(searchInput);
//     setPage(1);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh] gap-3 text-gray-400">
//         <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-teal-500" />
//         <span className="text-sm">Loading users…</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh] text-red-400 text-sm">
//         Error loading users. Please try again.
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen p-6">
//       {/* Toast Notification */}
//       {toast && (
//         <div
//           className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
//                     ${toast.type === "success"
//               ? "bg-green-50 text-green-700 border border-green-200"
//               : "bg-red-50 text-red-700 border border-red-200"
//             }`}
//         >
//           <span>{toast.type === "success" ? "✓" : "✕"}</span>
//           {toast.msg}
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
//             <p className="text-sm text-gray-500 mt-1">Manage and monitor all users in the system</p>
//           </div>

//           <Link to={ROUTES.ADD_USER}>
//             <button
//               className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
//             >
//               <FaPlus className="text-xs" />
//               Add New User
//             </button>
//           </Link>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex items-center gap-2 mb-6">
//         {([
//           { key: "list", label: "Users List" },
//           { key: "type", label: "User Types" },
//           { key: "status", label: "Status" },
//         ] as const).map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             className={`px-5 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${activeTab === tab.key
//                 ? "bg-gradient-to-r from-teal-400 to-green-400 text-white shadow-md"
//                 : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
//               }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Filter Bar */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
//         <div className="flex flex-wrap items-center justify-between gap-4 p-4">
//           {/* Left Filters */}
//           <div className="flex flex-wrap items-center gap-2 flex-1">
//             <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
//               <FiFilter className="text-sm text-gray-400" />
//               <span className="text-sm text-gray-500 font-medium">Filter By:</span>
//             </div>

//             <FilterDropdown
//               label="Status"
//               options={statuses}
//               value={filterStatus}
//               onChange={(v) => {
//                 setFilterStatus(v);
//                 setPage(1);
//               }}
//             />

//             <FilterDropdown
//               label="User Type"
//               options={userTypes}
//               value={filterType}
//               onChange={(v) => {
//                 setFilterType(v);
//                 setPage(1);
//               }}
//             />

//             <FilterDropdown
//               label="Email Verification"
//               options={["Verified", "Not Verified"]}
//               value={filterVerification}
//               onChange={(v) => {
//                 setFilterVerification(v);
//                 setPage(1);
//               }}
//             />

//             <button
//               onClick={handleReset}
//               className="flex items-center gap-2 px-3 py-2 text-sm text-teal-500 font-medium hover:text-teal-700 transition cursor-pointer rounded-lg hover:bg-teal-50"
//             >
//               <FiRefreshCw className="text-sm" />
//               Reset
//             </button>
//           </div>

//           {/* Search */}
//           <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg min-w-[260px]">
//             <FiSearch className="text-gray-400 text-sm flex-shrink-0" />
//             <input
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   handleSearch();
//                 }
//               }}
//               placeholder="Search by name, email or phone..."
//               className="flex-1 text-sm text-gray-600 bg-transparent outline-none placeholder:text-gray-400"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Table with Top Scrollbar */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         {/* Top scrollbar wrapper */}
//         <div className="relative">
//           {/* Top scrollbar - mirrors the bottom one */}
//           <div
//             className="overflow-x-auto overflow-y-hidden"
//             onScroll={(e) => {
//               const bottomScroll = document.getElementById('table-scroll-bottom');
//               if (bottomScroll) {
//                 bottomScroll.scrollLeft = e.currentTarget.scrollLeft;
//               }
//             }}
//           >
//             <div style={{ width: '1200px', height: '8px' }} />
//           </div>

//           {/* Main table with bottom scrollbar */}
//           <div
//             id="table-scroll-bottom"
//             className="overflow-x-auto overflow-y-visible"
//             onScroll={(e) => {
//               const topScroll = e.currentTarget.parentElement?.previousElementSibling;
//               if (topScroll) {
//                 topScroll.scrollLeft = e.currentTarget.scrollLeft;
//               }
//             }}
//           >
//             <table className="w-full min-w-[1200px]">
//               <thead>
//                 <tr className="bg-gradient-to-r from-teal-400 to-green-400 sticky top-0">
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">User</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Phone</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Type</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Country</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Verified</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">KYC</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Vendor</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Created</th>
//                   <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-100">
//                 {paginated.length === 0 ? (
//                   <tr>
//                     <td colSpan={11} className="text-center py-16 text-gray-400 text-sm">
//                       No users found
//                     </td>
//                   </tr>
//                 ) : (
//                   paginated.map((user) => (
//                     <tr key={user.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
//                               user.full_name
//                             )}&background=14B8A6&color=ffffff&bold=true`}
//                             className="w-8 h-8 rounded-full"
//                             alt={user.full_name}
//                           />
//                           <span className="font-medium text-gray-800">{user.full_name}</span>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
//                       <td className="px-6 py-4 text-gray-600 text-sm">{user.phone ?? "—"}</td>

//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${userTypeStyle(
//                             user.user_type
//                           )}`}
//                         >
//                           {user.user_type.replace("_", " ")}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 text-gray-600 text-sm">
//                         {user.country_code ?? "—"}
//                       </td>

//                       <td className="px-6 py-4">
//                         {user.is_email_verified ? (
//                           <FaCheckCircle className="text-emerald-500 text-lg" />
//                         ) : (
//                           <FaTimesCircle className="text-gray-300 text-lg" />
//                         )}
//                       </td>

//                       <td className="px-6 py-4">
//                         {user.is_kyc_verified ? (
//                           <FaCheckCircle className="text-emerald-500 text-lg" />
//                         ) : (
//                           <FaTimesCircle className="text-gray-300 text-lg" />
//                         )}
//                       </td>

//                       <td className="px-6 py-4 text-gray-600 text-sm">
//                         {user.vendor?.company_name ?? "—"}
//                       </td>

//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyle(
//                             user.status
//                           )}`}
//                         >
//                           {user.status}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
//                         {fmtDate(user.created_at)}
//                       </td>

//                       <td className="px-6 py-4 text-center">
//                         <RowMenu
//                           user={user}
//                           onView={() => handleViewDetails(user.id)}
//                           onEdit={() => handleEdit(user)}
//                           onDelete={() => handleDelete(user.id)}
//                         />
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-center gap-2 py-6 border-t border-gray-100">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage(page - 1)}
//               className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
//             >
//               ← Previous
//             </button>
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setPage(i + 1)}
//                 className={`min-w-[32px] h-8 rounded-lg text-sm transition cursor-pointer ${
//                   page === i + 1
//                     ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               disabled={page === totalPages}
//               onClick={() => setPage(page + 1)}
//               className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
//             >
//               Next →
//             </button>
//           </div>
//         )}
//       </div>

//       {/* User Modal */}
//       <UserModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setSelectedUser(null);
//         }}
//         user={selectedUser}
//         onSave={handleSaveUser}
//       />
//     </div>
//   );
// };

// export default UserList;



import { useState, useRef, useEffect } from "react";
import { FiFilter, FiRefreshCw, FiSearch, FiChevronDown, FiShield, FiAlertCircle, FiUserCheck } from "react-icons/fi";
import { FaEllipsisV, FaPlus, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useSuspendUserMutation,
  useBanUserMutation,
  useActivateUserMutation,
} from "../../app/api/UserSlices/UserApi";
import UserModal from "../../component/UserModal";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../router";

// ============ USER TYPE DEFINITION ============
interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  user_type: string;
  status: string;
  country_code: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  is_kyc_verified: boolean;
  created_at: string;
  vendor?: {
    company_name: string;
  };
}

// ============ HELPERS ============
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ============ STATUS STYLES ============
const statusStyle = (status: string) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-600 border border-emerald-200";
    case "suspended":
      return "bg-yellow-100 text-yellow-600 border border-yellow-200";
    case "pending":
      return "bg-blue-100 text-blue-600 border border-blue-200";
    case "banned":
      return "bg-red-100 text-red-600 border border-red-200";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

const userTypeStyle = (type: string) => {
  switch (type) {
    case "super_admin":
      return "bg-purple-100 text-purple-600";
    case "vendor":
      return "bg-blue-100 text-blue-600";
    case "customer":
      return "bg-teal-100 text-teal-600";
    case "mlm_agent":
      return "bg-orange-100 text-orange-500";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

// ============ STATUS MANAGEMENT MODAL ============
const StatusManagementModal = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
}) => {
  const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
  const [banUser, { isLoading: isBanning }] = useBanUserMutation();
  const [activateUser, { isLoading: isActivating }] = useActivateUserMutation();
  
  const [suspendReason, setSuspendReason] = useState("");
  const [banReason, setBanReason] = useState("");
  const [showSuspendInput, setShowSuspendInput] = useState(false);
  const [showBanInput, setShowBanInput] = useState(false);
  const [showToast, setShowToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showMessage = (type: "success" | "error", msg: string) => {
    setShowToast({ type, msg });
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleSuspend = async () => {
    if (!user) return;
    if (!suspendReason.trim()) {
      showMessage("error", "Please provide a reason for suspension");
      return;
    }
    try {
      await suspendUser({ id: user.id, reason: suspendReason }).unwrap();
      showMessage("success", `${user.full_name} has been suspended`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error: any) {
      showMessage("error", error?.data?.message || "Failed to suspend user");
    }
  };

  const handleBan = async () => {
    if (!user) return;
    if (!banReason.trim()) {
      showMessage("error", "Please provide a reason for ban");
      return;
    }
    try {
      await banUser({ id: user.id, reason: banReason }).unwrap();
      showMessage("success", `${user.full_name} has been banned`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error: any) {
      showMessage("error", error?.data?.message || "Failed to ban user");
    }
  };

  const handleActivate = async () => {
    if (!user) return;
    try {
      await activateUser(user.id).unwrap();
      showMessage("success", `${user.full_name} has been activated`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error: any) {
      showMessage("error", error?.data?.message || "Failed to activate user");
    }
  };

  if (!isOpen || !user) return null;

  const isActive = user.status === "active";
  const isSuspended = user.status === "suspended";
  const isBanned = user.status === "banned";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Toast inside modal */}
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
              <h2 className="text-xl font-bold text-gray-800">User Status Management</h2>
              <p className="text-sm text-gray-500 mt-1">Manage status for {user.full_name}</p>
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
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyle(user.status)}`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          {/* Status Switches */}
          <div className="p-6 space-y-4">
            {/* Activate Switch - Only show for suspended users */}
            {isSuspended && (
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FiUserCheck className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Activate User</h3>
                    <p className="text-xs text-gray-500">Reactivate this user account</p>
                  </div>
                </div>
                <button
                  onClick={handleActivate}
                  disabled={isActivating}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActivating
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {isActivating ? "Activating..." : "Activate"}
                </button>
              </div>
            )}

            {/* Suspend Switch - Only show for active users */}
            {isActive && (
              <div className="flex flex-col gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <FiShield className="text-yellow-600 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Suspend User</h3>
                      <p className="text-xs text-gray-500">Temporarily block user access</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showSuspendInput}
                      onChange={() => setShowSuspendInput(!showSuspendInput)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  </label>
                </div>
                
                {showSuspendInput && (
                  <div className="mt-2">
                    <textarea
                      value={suspendReason}
                      onChange={(e) => setSuspendReason(e.target.value)}
                      placeholder="Enter reason for suspension..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none"
                      rows={2}
                    />
                    <button
                      onClick={handleSuspend}
                      disabled={isSuspending}
                      className="mt-2 w-full px-4 py-2 rounded-lg bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition disabled:opacity-50"
                    >
                      {isSuspending ? "Suspending..." : "Confirm Suspend"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Ban Switch - Only show for active users */}
            {isActive && (
              <div className="flex flex-col gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <FiAlertCircle className="text-red-600 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Ban User</h3>
                      <p className="text-xs text-gray-500">Permanently block user account</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showBanInput}
                      onChange={() => setShowBanInput(!showBanInput)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
                
                {showBanInput && (
                  <div className="mt-2">
                    <textarea
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      placeholder="Enter reason for ban..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                      rows={2}
                    />
                    <button
                      onClick={handleBan}
                      disabled={isBanning}
                      className="mt-2 w-full px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-50"
                    >
                      {isBanning ? "Banning..." : "Confirm Ban"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Info message for banned users */}
            {isBanned && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  This user is permanently banned and cannot be modified.
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

// ============ FILTER DROPDOWN ============
const FilterDropdown = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
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

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition cursor-pointer"
      >
        <span className="font-medium">{value || label}</span>
        <FiChevronDown
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""
            }`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[140px]">
          <button
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-50 cursor-pointer"
          >
            All
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer"
            >
              {opt.replace("_", " ")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============ ROW ACTION MENU ============
const RowMenu = ({
  user,
  onEdit,
  onDelete,
  onView,
  onStatusManage,
}: {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  onStatusManage: () => void;
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

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-gray-600 transition p-1 cursor-pointer"
      >
        <FaEllipsisV className="text-sm" />
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 text-sm">
          <button
            onClick={() => {
              onView();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 cursor-pointer"
          >
            View Details
          </button>
          <button
            onClick={() => {
              onStatusManage();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-600 cursor-pointer"
          >
            Manage Status
          </button>
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-teal-50 text-teal-700 cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

// ============ MAIN COMPONENT ============
const ITEMS_PER_PAGE = 10;

const UserList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"list" | "type" | "status">(
    "list"
  );
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterVerification, setFilterVerification] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading, error, refetch } = useGetUsersQuery({});
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users: User[] = data?.data ?? [];

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle View Details
  const handleViewDetails = (userId: string) => {
    navigate(ROUTES.USER_DETAILS(userId));
  };

  // Handle Status Management
  const handleStatusManage = (user: User) => {
    setSelectedUser(user);
    setIsStatusModalOpen(true);
  };

  // Handle Create/Edit Save
  const handleSaveUser = async (formData: Partial<User>) => {
    try {
      if (selectedUser) {
        await updateUser({
          id: selectedUser.id,
          data: formData,
        }).unwrap();
        showToast("success", "User updated successfully!");
      } else {
        await createUser(formData).unwrap();
        showToast("success", "User created successfully!");
      }
      refetch();
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error("Save error:", error);
      showToast("error", error?.data?.message || "Failed to save user");
      throw error;
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id).unwrap();
      showToast("success", "User deleted successfully.");
      refetch();
    } catch (error: any) {
      showToast("error", error?.data?.message || "Failed to delete user.");
    }
  };

  // Get unique values for filters
  const userTypes = [...new Set(users.map((u) => u.user_type).filter(Boolean))];
  const statuses = [...new Set(users.map((u) => u.status).filter(Boolean))];

  // Filter & Search
  const filtered = users.filter((user) => {
    const matchStatus = !filterStatus || user.status === filterStatus;
    const matchType = !filterType || user.user_type === filterType;
    const matchVerification =
      !filterVerification ||
      (filterVerification === "Verified"
        ? user.is_email_verified
        : !user.is_email_verified);
    const matchSearch =
      !search ||
      user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.phone?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchType && matchVerification && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleReset = () => {
    setFilterStatus("");
    setFilterType("");
    setFilterVerification("");
    setSearch("");
    setSearchInput("");
    setPage(1);
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-gray-400">
        <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-teal-500" />
        <span className="text-sm">Loading users…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-400 text-sm">
        Error loading users. Please try again.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
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

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and monitor all users in the system</p>
          </div>

          <Link to={ROUTES.ADD_USER}>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <FaPlus className="text-xs" />
              Add New User
            </button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {([
          { key: "list", label: "Users List" },
          { key: "type", label: "User Types" },
          { key: "status", label: "Status" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${activeTab === tab.key
                ? "bg-gradient-to-r from-teal-400 to-green-400 text-white shadow-md"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          {/* Left Filters */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <FiFilter className="text-sm text-gray-400" />
              <span className="text-sm text-gray-500 font-medium">Filter By:</span>
            </div>

            <FilterDropdown
              label="Status"
              options={statuses}
              value={filterStatus}
              onChange={(v) => {
                setFilterStatus(v);
                setPage(1);
              }}
            />

            <FilterDropdown
              label="User Type"
              options={userTypes}
              value={filterType}
              onChange={(v) => {
                setFilterType(v);
                setPage(1);
              }}
            />

            <FilterDropdown
              label="Email Verification"
              options={["Verified", "Not Verified"]}
              value={filterVerification}
              onChange={(v) => {
                setFilterVerification(v);
                setPage(1);
              }}
            />

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 text-sm text-teal-500 font-medium hover:text-teal-700 transition cursor-pointer rounded-lg hover:bg-teal-50"
            >
              <FiRefreshCw className="text-sm" />
              Reset
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg min-w-[260px]">
            <FiSearch className="text-gray-400 text-sm flex-shrink-0" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search by name, email or phone..."
              className="flex-1 text-sm text-gray-600 bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-teal-400 to-green-400">
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Country</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Verified</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">KYC</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
               </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-16 text-gray-400 text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.full_name
                          )}&background=14B8A6&color=ffffff&bold=true`}
                          className="w-8 h-8 rounded-full"
                          alt={user.full_name}
                        />
                        <span className="font-medium text-gray-800">{user.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{user.phone ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${userTypeStyle(
                          user.user_type
                        )}`}
                      >
                        {user.user_type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {user.country_code ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      {user.is_email_verified ? (
                        <FaCheckCircle className="text-emerald-500 text-lg" />
                      ) : (
                        <FaTimesCircle className="text-gray-300 text-lg" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.is_kyc_verified ? (
                        <FaCheckCircle className="text-emerald-500 text-lg" />
                      ) : (
                        <FaTimesCircle className="text-gray-300 text-lg" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {user.vendor?.company_name ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyle(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                      {fmtDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <RowMenu
                        user={user}
                        onView={() => handleViewDetails(user.id)}
                        onEdit={() => handleEdit(user)}
                        onDelete={() => handleDelete(user.id)}
                        onStatusManage={() => handleStatusManage(user)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-6 border-t border-gray-100">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
            >
              ← Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`min-w-[32px] h-8 rounded-lg text-sm transition cursor-pointer ${
                  page === i + 1
                    ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      {/* Status Management Modal */}
      <StatusManagementModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={refetch}
      />
    </div>
  );
};

export default UserList;