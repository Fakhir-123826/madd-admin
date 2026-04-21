import { useState, useRef, useEffect } from "react";
import { FiFilter, FiRefreshCw, FiSearch, FiChevronDown } from "react-icons/fi";
import { FaEllipsisV, FaPlus, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../app/api/UserSlices/UserApi";
import UserModal from "../../component/UserModal";
// import type { User } from "../../model/user/IUser";

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
      return "bg-red-100 text-red-600";
    case "pending":
      return "bg-yellow-100 text-yellow-600";
    case "banned":
      return "bg-gray-200 text-gray-600";
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
          className={`text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
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
              {opt}
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
}: {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
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
        <div className="absolute right-0 top-7 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-40 text-sm">
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
const ITEMS_PER_PAGE = 8;

const UserList = () => {
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

  // Handle Create/Edit Save
  const handleSaveUser = async (data: Partial<User>) => {
    try {
      if (selectedUser) {
        await updateUser({
          id: selectedUser.id,
          data: data,
        }).unwrap();
        showToast("success", "User updated successfully!");
      } else {
        await createUser(data).unwrap();
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

  const handleAddNew = () => {
    setSelectedUser(null);
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
      <div className="flex items-center justify-center min-h-[40vh] gap-3 text-gray-400">
        <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-teal-500" />
        <span className="text-sm">Loading users…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-red-400 text-sm">
        Error loading users. Please try again.
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${
                      toast.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
        >
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>

        {/* Add button */}
        <button
          onClick={handleAddNew}
          className="flex items-center gap-0 p-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-semibold shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer"
        >
          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 border-r border-white/20 ml-0">
            <FaPlus className="text-white text-xs" />
          </span>
          <span className="px-5">Add New User</span>
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 mb-5">
        {([
          { key: "list", label: "Users List" },
          { key: "type", label: "User Types" },
          { key: "status", label: "Status" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded text-sm font-medium transition cursor-pointer ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-teal-400 to-green-400 text-white shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex justify-between gap-4 mb-6">
        {/* LEFT: FILTERS */}
        <div className="flex flex-1 items-center border border-gray-200 rounded-2xl shadow-sm">
          {/* Filter icon */}
          <div className="border-r flex-1 py-3 border-gray-200">
            <div className="flex flex-1 items-center gap-2 px-4 py-3 border-r border-gray-200 text-gray-400">
              <FiFilter className="text-base" />
              <span className="text-sm text-gray-500 font-medium">
                Filter By
              </span>
            </div>
          </div>

          {/* Status Filter */}
          <div className="border-r flex-1 py-3 border-gray-200">
            <FilterDropdown
              label="Status"
              options={statuses}
              value={filterStatus}
              onChange={(v) => {
                setFilterStatus(v);
                setPage(1);
              }}
            />
          </div>

          {/* User Type Filter */}
          <div className="border-r flex-1 py-3 border-gray-200">
            <FilterDropdown
              label="User Type"
              options={userTypes}
              value={filterType}
              onChange={(v) => {
                setFilterType(v);
                setPage(1);
              }}
            />
          </div>

          {/* Email Verification Filter */}
          <div className="border-r flex-1 py-3 border-gray-200">
            <FilterDropdown
              label="Email Verification"
              options={["Verified", "Not Verified"]}
              value={filterVerification}
              onChange={(v) => {
                setFilterVerification(v);
                setPage(1);
              }}
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-3 text-sm text-teal-500 font-medium hover:text-teal-700 transition cursor-pointer"
          >
            <FiRefreshCw className="text-sm" />
            Reset Filter
          </button>
        </div>

        {/* RIGHT: SEARCH */}
        <div className="flex items-center gap-2 px-4 py-3 w-[30%] border border-gray-200 rounded-2xl shadow-sm min-w-[200px]">
          <FiSearch className="text-gray-300 text-base flex-shrink-0" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search here..."
            className="flex-1 text-sm text-gray-600 bg-transparent outline-none placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl overflow-x-auto shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200 text-sm border-separate border-spacing-0">
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
              <th className="px-2 py-4 text-left font-semibold text-sm">Name</th>
              <th className="px-2 py-4 text-left font-semibold text-sm">Email</th>
              <th className="px-2 py-4 text-left font-semibold text-sm">Phone</th>
              <th className="px-2 py-4 text-left font-semibold text-sm">Type</th>
              <th className="px-2 py-4 text-left font-semibold text-sm">Country</th>
              <th className="px-2 py-4 text-left font-semibold text-sm">Email Verified</th>
              <th className="px-2 py-4 text-left font-semibold text-sm">KYC</th>
              <th className="px-2 py-4 text-left font-semibold text-sm">Vendor</th>
              <th className="px-2 py-4 text-left font-semibold text-sm">Status</th>
              <th className="px-2 py-4 text-left font-semibold text-sm">Created</th>
              <th className="px-2 py-4" />
             </tr>
          </thead>

          <tbody className="bg-white">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-16 text-gray-300 text-sm">
                  No users found.
                </td>
              </tr>
            ) : (
              paginated.map((user, idx) => (
                <tr
                  key={user.id}
                  className="group hover:bg-gray-50/60 transition relative"
                  style={{
                    borderBottom:
                      idx < paginated.length - 1 ? "1px solid #f3f4f6" : "none",
                  }}
                >
                  {/* Left teal accent border */}
                  <td className="relative pl-5 pr-4 py-4 font-semibold text-gray-800">
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-teal-400 to-teal-300" />
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.full_name
                        )}&background=4F46E5&color=ffffff`}
                        className="w-7 h-7 rounded-full"
                        alt={user.full_name}
                      />
                      <span>{user.full_name}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-600">{user.email}</td>
                  <td className="px-5 py-4 text-gray-600">{user.phone ?? "—"}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${userTypeStyle(
                        user.user_type
                      )}`}
                    >
                      {user.user_type.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {user.country_code ?? "—"}
                  </td>

                  <td className="px-5 py-4">
                    {user.is_email_verified ? (
                      <FaCheckCircle className="text-green-500 text-lg" />
                    ) : (
                      <FaTimesCircle className="text-red-400 text-lg" />
                    )}
                  </td>

                  <td className="px-5 py-4">
                    {user.is_kyc_verified ? (
                      <FaCheckCircle className="text-green-500 text-lg" />
                    ) : (
                      <FaTimesCircle className="text-red-400 text-lg" />
                    )}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {user.vendor?.company_name ?? "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-500 text-sm">
                    {fmtDate(user.created_at)}
                  </td>

                  {/* Action with right green accent border */}
                  <td className="relative pl-4 pr-5 py-4 text-right">
                    <span className="absolute right-0 top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-green-400 to-green-300" />
                    <RowMenu
                      user={user}
                      onEdit={() => handleEdit(user)}
                      onDelete={() => handleDelete(user.id)}
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
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-600">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
          >
            ← Back
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-md cursor-pointer ${
                page === i + 1
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
            className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}

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
    </div>
  );
};

export default UserList;