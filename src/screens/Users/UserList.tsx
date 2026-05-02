import { useState, useRef, useEffect } from "react";
import { FaEllipsisV, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiShield, FiAlertCircle, FiUserCheck, FiEye } from "react-icons/fi";
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
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router";
import PageHeader from "../../component/PageHeader/Pageheaderfilterbar";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  vendor?: { company_name: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const statusStyle = (status: string) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "suspended":
      return "bg-yellow-50 text-yellow-600 border-yellow-200";
    case "pending":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "banned":
      return "bg-red-50 text-red-600 border-red-200";
    default:
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
};

const userTypeStyle = (type: string) => {
  switch (type) {
    case "super_admin": return "bg-purple-100 text-purple-700";
    case "vendor": return "bg-blue-100 text-blue-700";
    case "customer": return "bg-teal-100 text-teal-700";
    case "mlm_agent": return "bg-orange-100 text-orange-600";
    default: return "bg-gray-100 text-gray-500";
  }
};

// ─── Tabs config ──────────────────────────────────────────────────────────────

const TABS = [
  { key: "list", label: "Users List" },
  { key: "type", label: "User Types" },
  { key: "status", label: "Status" },
];

// ─── Status Management Modal ──────────────────────────────────────────────────

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
  const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showMsg = (type: "success" | "error", msg: string) => {
    setModalToast({ type, msg });
    setTimeout(() => setModalToast(null), 3000);
  };

  const handleSuspend = async () => {
    if (!user) return;
    if (!suspendReason.trim()) { showMsg("error", "Please provide a reason for suspension"); return; }
    try {
      await suspendUser({ id: user.id, reason: suspendReason }).unwrap();
      showMsg("success", `${user.full_name} has been suspended`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) { showMsg("error", e?.data?.message || "Failed to suspend"); }
  };

  const handleBan = async () => {
    if (!user) return;
    if (!banReason.trim()) { showMsg("error", "Please provide a reason for ban"); return; }
    try {
      await banUser({ id: user.id, reason: banReason }).unwrap();
      showMsg("success", `${user.full_name} has been banned`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) { showMsg("error", e?.data?.message || "Failed to ban"); }
  };

  const handleActivate = async () => {
    if (!user) return;
    try {
      await activateUser(user.id).unwrap();
      showMsg("success", `${user.full_name} has been activated`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) { showMsg("error", e?.data?.message || "Failed to activate"); }
  };

  if (!isOpen || !user) return null;

  const isActive = user.status === "active";
  const isSuspended = user.status === "suspended";
  const isBanned = user.status === "banned";

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
          {/* Top gradient bar */}
          <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Manage User Status</h2>
              <p className="text-sm text-gray-500 mt-0.5">{user.full_name}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-0.5 cursor-pointer">✕</button>
          </div>

          {/* Current status */}
          <div className="px-6 pt-4">
            <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">Current Status</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(user.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-3">
            {/* Activate — for suspended */}
            {isSuspended && (
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                    <FiUserCheck className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Activate User</p>
                    <p className="text-xs text-gray-500">Restore account access</p>
                  </div>
                </div>
                <button onClick={handleActivate} disabled={isActivating}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition disabled:opacity-50 cursor-pointer">
                  {isActivating ? "..." : "Activate"}
                </button>
              </div>
            )}

            {/* Suspend — for active */}
            {isActive && (
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
                      <FiShield className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Suspend User</p>
                      <p className="text-xs text-gray-500">Temporarily block access</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={showSuspendInput} onChange={() => setShowSuspendInput(!showSuspendInput)} className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-yellow-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
                {showSuspendInput && (
                  <>
                    <textarea value={suspendReason} onChange={e => setSuspendReason(e.target.value)}
                      placeholder="Reason for suspension..." rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
                    <button onClick={handleSuspend} disabled={isSuspending}
                      className="w-full py-2 rounded-lg bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition disabled:opacity-50 cursor-pointer">
                      {isSuspending ? "Suspending..." : "Confirm Suspend"}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Ban — for active */}
            {isActive && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                      <FiAlertCircle className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Ban User</p>
                      <p className="text-xs text-gray-500">Permanently block account</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={showBanInput} onChange={() => setShowBanInput(!showBanInput)} className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-red-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
                {showBanInput && (
                  <>
                    <textarea value={banReason} onChange={e => setBanReason(e.target.value)}
                      placeholder="Reason for ban..." rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-400 resize-none" />
                    <button onClick={handleBan} disabled={isBanning}
                      className="w-full py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-50 cursor-pointer">
                      {isBanning ? "Banning..." : "Confirm Ban"}
                    </button>
                  </>
                )}
              </div>
            )}

            {isBanned && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-sm text-gray-400">
                This user is permanently banned.
              </div>
            )}
          </div>

          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <button onClick={onClose} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition cursor-pointer">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Row Action Menu ──────────────────────────────────────────────────────────

const RowMenu = ({
  onView, onEdit, onDelete, onStatusManage,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
      <button onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-gray-600 p-1 transition cursor-pointer">
        <FaEllipsisV className="text-sm" />
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 text-sm">
          <button onClick={() => { onView(); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 cursor-pointer">
            View Details
          </button>
          <button onClick={() => { onStatusManage(); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-600 cursor-pointer">
            Manage Status
          </button>
          <button onClick={() => { onEdit(); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-teal-50 text-teal-700 cursor-pointer">
            Edit
          </button>
          <button onClick={() => { onDelete(); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

// ─── User Detail Drawer (View Details — same page) ────────────────────────────

const UserDetailDrawer = ({
  user,
  onClose,
}: {
  user: User | null;
  onClose: () => void;
}) => {
  if (!user) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Drawer header */}
        <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">User Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=14B8A6&color=ffffff&bold=true&size=80`}
              className="w-16 h-16 rounded-full"
              alt={user.full_name}
            />
            <div>
              <p className="text-lg font-bold text-gray-800">{user.full_name}</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mt-1 ${statusStyle(user.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Email", value: user.email },
              { label: "Phone", value: user.phone ?? "—" },
              { label: "Country", value: user.country_code ?? "—" },
              { label: "User Type", value: user.user_type.replace(/_/g, " ") },
              { label: "Vendor", value: user.vendor?.company_name ?? "—" },
              { label: "Joined", value: fmtDate(user.created_at) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-medium text-gray-700 capitalize truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Verification badges */}
          <div>
            <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Verification Status</p>
            <div className="flex gap-3">
              {[
                { label: "Email", verified: user.is_email_verified },
                { label: "Phone", verified: user.is_phone_verified },
                { label: "KYC", verified: user.is_kyc_verified },
              ].map(({ label, verified }) => (
                <div key={label} className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium
                  ${verified ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
                  {verified
                    ? <FaCheckCircle className="text-lg text-emerald-500" />
                    : <FaTimesCircle className="text-lg text-gray-300" />}
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const UserList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("list");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterVerification, setFilterVerification] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading, error, refetch } = useGetUsersQuery({});
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users: User[] = data?.data ?? [];

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveUser = async (formData: Partial<User>) => {
    try {
      if (selectedUser) {
        await updateUser({ id: selectedUser.id, data: formData }).unwrap();
        showToast("success", "User updated successfully!");
      }
      refetch();
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (e: any) {
      showToast("error", e?.data?.message || "Failed to save user");
      throw e;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id).unwrap();
      showToast("success", "User deleted.");
      refetch();
    } catch (e: any) {
      showToast("error", e?.data?.message || "Failed to delete.");
    }
  };

  const handleReset = () => {
    setFilterStatus(""); setFilterType(""); setFilterVerification("");
    setSearch(""); setSearchInput(""); setPage(1);
  };

  // ── Derived ──
  const userTypes = [...new Set(users.map(u => u.user_type).filter(Boolean))];
  const statuses = [...new Set(users.map(u => u.status).filter(Boolean))];

  const filtered = users.filter(u => {
    const matchStatus = !filterStatus || u.status === filterStatus;
    const matchType = !filterType || u.user_type === filterType;
    const matchVerif = !filterVerification ||
      (filterVerification === "Verified" ? u.is_email_verified : !u.is_email_verified);
    const matchSearch = !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchType && matchVerif && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // ── Filters config for PageHeader ──
  const filters = [
    { label: "Status", options: statuses, value: filterStatus, onChange: (v: string) => { setFilterStatus(v); setPage(1); } },
    { label: "User Type", options: userTypes, value: filterType, onChange: (v: string) => { setFilterType(v); setPage(1); } },
    { label: "Verified", options: ["Verified", "Not Verified"], value: filterVerification, onChange: (v: string) => { setFilterVerification(v); setPage(1); } },
  ];

  // if (isLoading) return (
  //   <div className="flex items-center justify-center min-h-[60vh] gap-3 text-gray-400">
  //     <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-teal-500" />
  //     <span className="text-sm">Loading users…</span>
  //   </div>
  // );

  // if (error) return (
  //   <div className="flex items-center justify-center min-h-[60vh] text-red-400 text-sm">
  //     Error loading users. Please try again.
  //   </div>
  // );

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

      {/* ── Shared reusable PageHeader ── */}
      <PageHeader
        title="User Management"
        addButtonLabel="Add New User"
        onAdd={() => navigate(ROUTES.ADD_USER)}   // ← separate route
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        filters={filters}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={() => { setSearch(searchInput); setPage(1); }}
        onResetFilters={handleReset}
        searchPlaceholder="Search by name, email, phone..."
      />

      {/* ── Table ── */}
      <div className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden ">
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                {["User", "Email", "Phone", "Type", "Country", "Email ✓", "Phone ✓", "KYC", "Vendor", "Status", "Joined", ""].map((col, i) => (
                  <th key={i} className="px-4 py-4 text-left font-semibold text-sm whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white">
  {isLoading ? (
    <tr>
      <td colSpan={12} className="text-center py-16">
        <div className="flex items-center justify-center gap-3 text-gray-400">
          <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-teal-500" />
          <span className="text-sm">Loading users…</span>
        </div>
      </td>
    </tr>
  ) : error ? (
    <tr>
      <td colSpan={12} className="text-center py-16 text-red-400 text-sm">
        Error loading users. Please try again.
      </td>
    </tr>
  ) : paginated.length === 0 ? (
    <tr>
      <td colSpan={12} className="text-center py-16 text-gray-300 text-sm">
        No users found.
      </td>
    </tr>
  ) : (
    paginated.map((user, idx) => (
      <tr
        key={user.id}
        className="hover:bg-gray-50/60 transition"
        style={{
          borderBottom: idx < paginated.length - 1 ? "1px solid #f3f4f6" : "none",
          marginBottom: "10px",
        }}
      >
        {/* User — left teal accent */}
        <td className="relative pl-5 pr-4 py-3">
          <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-teal-400 to-teal-300" />
          <div className="flex items-center gap-2.5">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=14B8A6&color=ffffff&bold=true`}
              className="w-8 h-8 rounded-full shrink-0"
              alt={user.full_name}
            />
            <span className="font-semibold text-gray-800 whitespace-nowrap">{user.full_name}</span>
          </div>
        </td>

        <td className="px-4 py-3 text-gray-600 text-xs">{user.email}</td>
        <td className="px-4 py-3 text-gray-600 text-xs">{user.phone ?? "—"}</td>

        <td className="px-4 py-3 whitespace-nowrap">
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${userTypeStyle(user.user_type)}`}>
            {user.user_type.replace(/_/g, " ")}
          </span>
        </td>

        <td className="px-4 py-3 text-gray-500 text-xs">{user.country_code ?? "—"}</td>

        {/* Verification checks */}
        <td className="px-4 py-3 text-center">
          {user.is_email_verified
            ? <FaCheckCircle className="text-emerald-500 text-base mx-auto" />
            : <FaTimesCircle className="text-gray-300 text-base mx-auto" />}
        </td>
        <td className="px-4 py-3 text-center">
          {user.is_phone_verified
            ? <FaCheckCircle className="text-emerald-500 text-base mx-auto" />
            : <FaTimesCircle className="text-gray-300 text-base mx-auto" />}
        </td>
        <td className="px-4 py-3 text-center">
          {user.is_kyc_verified
            ? <FaCheckCircle className="text-emerald-500 text-base mx-auto" />
            : <FaTimesCircle className="text-gray-300 text-base mx-auto" />}
        </td>

        <td className="px-4 py-3 text-gray-500 text-xs">{user.vendor?.company_name ?? "—"}</td>

        {/* Status pill */}
        <td className="px-4 py-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(user.status)}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
        </td>

        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmtDate(user.created_at)}</td>

        {/* Actions — right green accent */}
        <td className="relative pl-4 pr-5 py-3 text-right">
          <span className="absolute right-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-green-400 to-green-300" />
          <RowMenu
            onView={() => { setSelectedUser(user); setIsDrawerOpen(true); }}
            onEdit={() => { setSelectedUser(user); setIsEditModalOpen(true); }}
            onDelete={() => handleDelete(user.id)}
            onStatusManage={() => { setSelectedUser(user); setIsStatusModalOpen(true); }}
          />
        </td>
      </tr>
    ))
  )}
</tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-600">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer">
            ← Back
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-md cursor-pointer ${page === i + 1
                ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                : "hover:bg-gray-100"}`}>
              {i + 1}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer">
            Next →
          </button>
        </div>
      )}

      {/* ── Edit Modal (same page) ── */}
      <UserModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedUser(null); }}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      {/* ── Status Management Modal (same page) ── */}
      <StatusManagementModal
        isOpen={isStatusModalOpen}
        onClose={() => { setIsStatusModalOpen(false); setSelectedUser(null); }}
        user={selectedUser}
        onSuccess={refetch}
      />

      {/* ── View Details Side Drawer (same page) ── */}
      <UserDetailDrawer
        user={isDrawerOpen ? selectedUser : null}
        onClose={() => { setIsDrawerOpen(false); setSelectedUser(null); }}
      />
    </div>
  );
};

export default UserList;