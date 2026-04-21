// import { useState } from "react";
// import { FaEllipsisV, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import { useGetUsersQuery } from "../../app/api/UserSlices/UserApi";

// // ============ TYPES ============
// interface User {
//     id: string;
//     full_name: string;
//     email: string;
//     phone: string | null;
//     user_type: string;
//     status: string;
//     is_email_verified: boolean;
//     is_phone_verified: boolean;
//     is_kyc_verified: boolean;
//     country_code: string;
//     roles: string[];
//     vendor: { company_name: string } | null;
//     created_at: string;
// }

// // ============ STATUS STYLES ============
// const statusStyle = (status: string) => {
//     switch (status) {
//         case "active":    return "bg-green-100 text-green-600";
//         case "suspended": return "bg-red-100 text-red-600";
//         case "pending":   return "bg-yellow-100 text-yellow-600";
//         case "banned":    return "bg-gray-200 text-gray-600";
//         default:          return "bg-gray-100 text-gray-500";
//     }
// };

// const userTypeStyle = (type: string) => {
//     switch (type) {
//         case "super_admin": return "bg-purple-100 text-purple-600";
//         case "vendor":      return "bg-blue-100 text-blue-600";
//         case "customer":    return "bg-teal-100 text-teal-600";
//         case "mlm_agent":   return "bg-orange-100 text-orange-500";
//         default:            return "bg-gray-100 text-gray-500";
//     }
// };

// // ============ COMPONENT ============
// const UserList = () => {
//     const tdBase =
//         "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

//     const ITEMS_PER_PAGE = 8;
//     const [page, setPage] = useState(1);

//     const { data, isLoading, isError } = useGetUsersQuery({});

//     const users: User[] = data?.data ?? [];
//     const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
//     const paginated = users.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

//     return (
//         <div className="bg-white shadow-sm p-6 rounded-xl">

//             {/* HEADER */}
//             <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-lg font-semibold">User Management</h2>
//                 <div className="text-sm text-gray-400">
//                     Total: <span className="font-semibold text-gray-600">{data?.meta?.total ?? 0}</span>
//                 </div>
//             </div>

//             {/* TABLE */}
//             <div className="rounded-t-3xl overflow-x-auto">
//                 <table className="w-full text-sm border-separate border-spacing-y-3">
//                     <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
//                         <tr>
//                             <th className="p-4 text-left">Name</th>
//                             <th className="p-4 text-left">Email</th>
//                             <th className="p-4 text-left">Phone</th>
//                             <th className="p-4 text-left">Type</th>
//                             <th className="p-4 text-left">Country</th>
//                             <th className="p-4 text-left">Email Verified</th>
//                             <th className="p-4 text-left">KYC</th>
//                             <th className="p-4 text-left">Vendor</th>
//                             <th className="p-4 text-left">Status</th>
//                             <th className="p-4 text-left">Created</th>
//                             <th className="p-4"></th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {/* LOADER */}
//                         {isLoading ? (
//                             <tr>
//                                 <td colSpan={11} className="text-center py-10">
//                                     <div className="flex items-center justify-center gap-3">
//                                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500" />
//                                         <span className="text-gray-500">Loading users...</span>
//                                     </div>
//                                 </td>
//                             </tr>

//                         ) : isError ? (
//                             <tr>
//                                 <td colSpan={11} className="text-center py-10 text-red-500">
//                                     Error loading users. Please try again.
//                                 </td>
//                             </tr>

//                         ) : paginated.length === 0 ? (
//                             <tr>
//                                 <td colSpan={11} className="text-center py-10 text-gray-400">
//                                     No users found.
//                                 </td>
//                             </tr>

//                         ) : paginated.map((user) => (
//                             <tr key={user.id} className="bg-white shadow-sm hover:shadow-md transition">

//                                 {/* Avatar + Name */}
//                                 <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
//                                     <div className="flex items-center gap-2">
//                                         <img
//                                             src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=4F46E5&color=ffffff`}
//                                             className="w-7 h-7 rounded-full"
//                                             alt={user.full_name}
//                                         />
//                                         <span>{user.full_name}</span>
//                                     </div>
//                                 </td>

//                                 <td className={tdBase}>{user.email}</td>

//                                 <td className={tdBase}>{user.phone ?? "—"}</td>

//                                 <td className={tdBase}>
//                                     <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${userTypeStyle(user.user_type)}`}>
//                                         {user.user_type.replace("_", " ")}
//                                     </span>
//                                 </td>

//                                 <td className={tdBase}>{user.country_code ?? "—"}</td>

//                                 <td className={tdBase}>
//                                     {user.is_email_verified
//                                         ? <FaCheckCircle className="text-green-500" />
//                                         : <FaTimesCircle className="text-red-400" />
//                                     }
//                                 </td>

//                                 <td className={tdBase}>
//                                     {user.is_kyc_verified
//                                         ? <FaCheckCircle className="text-green-500" />
//                                         : <FaTimesCircle className="text-red-400" />
//                                     }
//                                 </td>

//                                 <td className={tdBase}>
//                                     {user.vendor?.company_name ?? "—"}
//                                 </td>

//                                 <td className={tdBase}>
//                                     <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${statusStyle(user.status)}`}>
//                                         {user.status}
//                                     </span>
//                                 </td>

//                                 <td className={tdBase}>
//                                     {new Date(user.created_at).toLocaleDateString("en-GB", {
//                                         day: "2-digit", month: "short", year: "numeric"
//                                     })}
//                                 </td>

//                                 {/* ACTION */}
//                                 <td className="relative p-4 rounded-r-xl text-right">
//                                     <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
//                                     <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
//                                     <FaEllipsisV className="relative text-gray-400 cursor-pointer hover:text-gray-600" />
//                                 </td>

//                             </tr>
//                         ))}
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
//                             }`}
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
//         </div>
//     );
// };

// export default UserList;




import { useState } from "react";
import {
    FaEllipsisV,
    FaCheckCircle,
    FaTimesCircle,
    FaUserSlash,
    FaUserCheck,
    FaBan,
    FaTrash,
    FaUserTag,
    FaEye,
    FaTimes
} from "react-icons/fa";
import {
    useGetUsersQuery,
    useSuspendUserMutation,
    useActivateUserMutation,
    useBanUserMutation,
    useDeleteUserMutation,
    useAssignRoleMutation
} from "../../app/api/UserSlices/UserApi";
import FilterBar from "../../component/orderManagement/FilterBar";
import { Link } from "react-router-dom";

// ============ TYPES ============
interface User {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    user_type: string;
    status: string;
    is_email_verified: boolean;
    is_phone_verified: boolean;
    is_kyc_verified: boolean;
    country_code: string;
    roles: string[];
    vendor: { company_name: string } | null;
    created_at: string;
}

// ============ STATUS STYLES ============
const statusStyle = (status: string) => {
    switch (status) {
        case "active": return "bg-green-100 text-green-600";
        case "suspended": return "bg-red-100 text-red-600";
        case "pending": return "bg-yellow-100 text-yellow-600";
        case "banned": return "bg-gray-200 text-gray-600";
        default: return "bg-gray-100 text-gray-500";
    }
};

const userTypeStyle = (type: string) => {
    switch (type) {
        case "super_admin": return "bg-purple-100 text-purple-600";
        case "vendor": return "bg-blue-100 text-blue-600";
        case "customer": return "bg-teal-100 text-teal-600";
        case "mlm_agent": return "bg-orange-100 text-orange-500";
        default: return "bg-gray-100 text-gray-500";
    }
};

// ============ ACTION MODAL COMPONENT ============
interface ActionModalProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onAction: (action: string, data?: any) => void;
}

const ActionModal = ({ user, isOpen, onClose, onAction }: ActionModalProps) => {
    const [reason, setReason] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [actionType, setActionType] = useState<string | null>(null);

    if (!isOpen || !user) return null;

    const handleActionClick = (action: string) => {
        setActionType(action);
        if (action !== "suspend" && action !== "ban" && action !== "assignRole") {
            onAction(action);
            onClose();
        }
    };

    const handleConfirmWithReason = () => {
        if (actionType === "suspend") {
            onAction("suspend", { reason });
        } else if (actionType === "ban") {
            onAction("ban", { reason });
        } else if (actionType === "assignRole") {
            onAction("assignRole", { role: selectedRole });
        }
        setActionType(null);
        setReason("");
        setSelectedRole("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl w-96 max-w-[90%] shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold">
                        {actionType === "suspend" && "Suspend User"}
                        {actionType === "ban" && "Ban User"}
                        {actionType === "assignRole" && "Assign Role"}
                        {!actionType && `Actions - ${user.full_name}`}
                    </h3>
                    <button
                        onClick={() => {
                            setActionType(null);
                            onClose();
                        }}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    {!actionType ? (
                        // Main actions menu
                        <div className="space-y-2">
                            {/* Suspend Button */}
                            {user.status !== "suspended" && (
                                <button
                                    onClick={() => setActionType("suspend")}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-orange-600 hover:bg-orange-50 rounded-lg transition"
                                >
                                    <FaUserSlash />
                                    <span>Suspend User</span>
                                </button>
                            )}

                            {/* Activate Button (only if suspended) */}
                            {user.status === "suspended" && (
                                <button
                                    onClick={() => {
                                        onAction("activate");
                                        onClose();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-green-600 hover:bg-green-50 rounded-lg transition"
                                >
                                    <FaUserCheck />
                                    <span>Activate User</span>
                                </button>
                            )}

                            {/* Ban Button */}
                            {user.status !== "banned" && user.user_type !== "super_admin" && (
                                <button
                                    onClick={() => setActionType("ban")}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    <FaBan />
                                    <span>Ban User</span>
                                </button>
                            )}

                            {/* Assign Role Button */}
                            <button
                                onClick={() => setActionType("assignRole")}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                                <FaUserTag />
                                <span>Assign Role</span>
                            </button>

                            {/* View Details */}
                            <button
                                onClick={() => {
                                    onAction("view");
                                    onClose();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition"
                            >
                                <FaEye />
                                <span>View Details</span>
                            </button>

                            {/* Delete Button */}
                            <button
                                onClick={() => {
                                    if (confirm(`Are you sure you want to delete ${user.full_name}?`)) {
                                        onAction("delete");
                                        onClose();
                                    }
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition border-t mt-2"
                            >
                                <FaTrash />
                                <span>Delete User</span>
                            </button>
                        </div>
                    ) : (
                        // Reason input for suspend/ban or role select for assignRole
                        <div className="space-y-4">
                            {actionType === "suspend" && (
                                <>
                                    <p className="text-sm text-gray-600">
                                        Are you sure you want to suspend <span className="font-semibold">{user.full_name}</span>?
                                    </p>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Reason for suspension..."
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        rows={3}
                                    />
                                </>
                            )}

                            {actionType === "ban" && (
                                <>
                                    <p className="text-sm text-gray-600">
                                        Are you sure you want to ban <span className="font-semibold">{user.full_name}</span>?
                                    </p>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Reason for ban..."
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                        rows={3}
                                    />
                                </>
                            )}

                            {actionType === "assignRole" && (
                                <>
                                    <p className="text-sm text-gray-600">
                                        Assign role to <span className="font-semibold">{user.full_name}</span>
                                    </p>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        <option value="">Select a role</option>
                                        <option value="admin">Admin</option>
                                        <option value="vendor">Vendor</option>
                                        <option value="customer">Customer</option>
                                        <option value="mlm_agent">MLM Agent</option>
                                    </select>
                                </>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setActionType(null);
                                        setReason("");
                                        setSelectedRole("");
                                    }}
                                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleConfirmWithReason}
                                    disabled={
                                        (actionType === "suspend" && !reason.trim()) ||
                                        (actionType === "ban" && !reason.trim()) ||
                                        (actionType === "assignRole" && !selectedRole)
                                    }
                                    className={`flex-1 px-4 py-2 rounded-lg transition ${((actionType === "suspend" || actionType === "ban") && !reason.trim()) ||
                                        (actionType === "assignRole" && !selectedRole)
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : actionType === "suspend"
                                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                                            : actionType === "ban"
                                                ? "bg-red-500 hover:bg-red-600 text-white"
                                                : "bg-blue-500 hover:bg-blue-600 text-white"
                                        }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ============ MAIN COMPONENT ============
const UserList = () => {
    const tdBase =
        "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

    const ITEMS_PER_PAGE = 8;
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // API hooks
    const { data, isLoading, isError, refetch } = useGetUsersQuery({
        page: page,
        per_page: ITEMS_PER_PAGE
    });

    const [suspendUser] = useSuspendUserMutation();
    const [activateUser] = useActivateUserMutation();
    const [banUser] = useBanUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [assignRole] = useAssignRoleMutation();

    const users: User[] = data?.data ?? [];
    const totalPages = data?.meta?.last_page ?? 1;

    // Handle all actions
    const handleAction = async (action: string, actionData?: any) => {
        if (!selectedUser) return;

        try {
            switch (action) {
                case "suspend":
                    await suspendUser({ id: selectedUser.id, reason: actionData.reason }).unwrap();
                    alert(`${selectedUser.full_name} has been suspended.`);
                    break;
                case "activate":
                    await activateUser(selectedUser.id).unwrap();
                    alert(`${selectedUser.full_name} has been activated.`);
                    break;
                case "ban":
                    await banUser({ id: selectedUser.id, reason: actionData.reason }).unwrap();
                    alert(`${selectedUser.full_name} has been banned.`);
                    break;
                case "delete":
                    await deleteUser(selectedUser.id).unwrap();
                    alert(`${selectedUser.full_name} has been deleted.`);
                    break;
                case "assignRole":
                    await assignRole({ id: selectedUser.id, role: actionData.role }).unwrap();
                    alert(`Role ${actionData.role} assigned to ${selectedUser.full_name}`);
                    break;
                case "view":
                    alert(`View details for ${selectedUser.full_name}\nEmail: ${selectedUser.email}\nType: ${selectedUser.user_type}\nStatus: ${selectedUser.status}`);
                    break;
                default:
                    break;
            }
            refetch(); // Refresh the list
        } catch (error: any) {
            console.error("Action failed:", error);
            alert(error?.data?.message || "Action failed. Please try again.");
        }
    };

    // Open modal for a user
    const openActionModal = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white shadow-sm p-6 rounded-xl">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">User Management</h2>
                <div className="text-sm text-gray-400">
                    Total: <span className="font-semibold text-gray-600">{data?.meta?.total ?? 0}</span>
                </div>
                <Link to="/adduser">
                    <button
                        onClick={() => {/* Add navigation */ }}
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
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Phone</th>
                            <th className="p-4 text-left">Type</th>
                            <th className="p-4 text-left">Country</th>
                            <th className="p-4 text-left">Email Verified</th>
                            <th className="p-4 text-left">KYC</th>
                            <th className="p-4 text-left">Vendor</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Created</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* LOADER */}
                        {isLoading ? (
                            <tr>
                                <td colSpan={11} className="text-center py-10">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500" />
                                        <span className="text-gray-500">Loading users...</span>
                                    </div>
                                </td>
                            </tr>

                        ) : isError ? (
                            <tr>
                                <td colSpan={11} className="text-center py-10 text-red-500">
                                    Error loading users. Please try again.
                                </td>
                            </tr>

                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="text-center py-10 text-gray-400">
                                    No users found.
                                </td>
                            </tr>

                        ) : users.map((user) => (
                            <tr key={user.id} className="bg-white shadow-sm hover:shadow-md transition">

                                {/* Avatar + Name */}
                                <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=4F46E5&color=ffffff`}
                                            className="w-7 h-7 rounded-full"
                                            alt={user.full_name}
                                        />
                                        <span>{user.full_name}</span>
                                    </div>
                                </td>

                                <td className={tdBase}>{user.email}</td>
                                <td className={tdBase}>{user.phone ?? "—"}</td>

                                <td className={tdBase}>
                                    <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${userTypeStyle(user.user_type)}`}>
                                        {user.user_type.replace("_", " ")}
                                    </span>
                                </td>

                                <td className={tdBase}>{user.country_code ?? "—"}</td>

                                <td className={tdBase}>
                                    {user.is_email_verified
                                        ? <FaCheckCircle className="text-green-500" />
                                        : <FaTimesCircle className="text-red-400" />
                                    }
                                </td>

                                <td className={tdBase}>
                                    {user.is_kyc_verified
                                        ? <FaCheckCircle className="text-green-500" />
                                        : <FaTimesCircle className="text-red-400" />
                                    }
                                </td>

                                <td className={tdBase}>
                                    {user.vendor?.company_name ?? "—"}
                                </td>

                                <td className={tdBase}>
                                    <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${statusStyle(user.status)}`}>
                                        {user.status}
                                    </span>
                                </td>

                                <td className={tdBase}>
                                    {new Date(user.created_at).toLocaleDateString("en-GB", {
                                        day: "2-digit", month: "short", year: "numeric"
                                    })}
                                </td>

                                {/* ACTION BUTTON - Three Dots */}
                                <td className="relative p-4 rounded-r-xl text-right">
                                    <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                                    <button
                                        onClick={() => openActionModal(user)}
                                        className="relative text-gray-400 cursor-pointer hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-100"
                                    >
                                        <FaEllipsisV />
                                    </button>
                                </td>
                            </tr>
                        ))}
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

            {/* ACTION MODAL */}
            <ActionModal
                user={selectedUser}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                }}
                onAction={handleAction}
            />
        </div>
    );
};

export default UserList;




















