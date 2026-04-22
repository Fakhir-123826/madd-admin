import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiRefreshCw, FiSearch, FiChevronDown } from "react-icons/fi";
import { FaEllipsisV, FaPlus } from "react-icons/fa";
import {
  useGetSubscriptionsQuery,
  useDeleteSubscriptionMutation,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from "../../app/api/SubscriptionSclices/SubscriptionSclices";
import SubscriptionModal from "../../component/SubscriptionModal/SubscriptionModal";
import type { Subscription } from "../../model/susbcription/ISubscription";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isActive = (s: Subscription) => Number(s.status) === 1;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const safeFeatures = (raw: string | string[] | null | undefined): string[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

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

// ─── Row Action Menu ──────────────────────────────────────────────────────────

const RowMenu = ({
  subscription,
  onEdit,
  onDelete,
}: {
  subscription: Subscription;
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

// ─── Main Component ───────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 8;

const SubscriptionList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"list" | "billing" | "features">(
    "list"
  );
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBilling, setFilterBilling] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  const {
    data: subscriptions = [],
    isLoading,
    error,
    refetch,
  } = useGetSubscriptionsQuery();
  const [deleteSubscription] = useDeleteSubscriptionMutation();
  const [createSubscription] = useCreateSubscriptionMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle Create/Edit Save
  const handleSaveSubscription = async (data: Partial<Subscription>) => {
    try {
      if (selectedSubscription) {
        // Edit mode
        await updateSubscription({
          id: selectedSubscription.id,
          data: data,
        }).unwrap();
        showToast("success", "Subscription updated successfully!");
      } else {
        // Create mode
        await createSubscription(data).unwrap();
        showToast("success", "Subscription created successfully!");
      }
      refetch(); // Refresh the list
      setIsModalOpen(false);
      setSelectedSubscription(null);
    } catch (error: any) {
      console.error("Save error:", error);
      showToast(
        "error",
        error?.data?.message || "Failed to save subscription"
      );
      throw error; // Re-throw to let modal handle loading state
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedSubscription(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;
    try {
      await deleteSubscription(id).unwrap();
      showToast("success", "Subscription deleted successfully.");
      refetch();
    } catch (error: any) {
      showToast("error", error?.data?.message || "Failed to delete subscription.");
    }
  };

  // ── Filter & Search ──
  const filtered = subscriptions.filter((s) => {
    const matchStatus =
      !filterStatus ||
      (filterStatus === "Active" ? isActive(s) : !isActive(s));
    const matchBilling =
      !filterBilling || s.billing_type === filterBilling;
    const matchSearch =
      !search ||
      s.subscription_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.billing_type?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchBilling && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const billingTypes = [
    ...new Set(subscriptions.map((s) => s.billing_type).filter(Boolean)),
  ];

  const handleReset = () => {
    setFilterStatus("");
    setFilterBilling("");
    setSearch("");
    setSearchInput("");
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-3 text-gray-400">
        <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-teal-500" />
        <span className="text-sm">Loading subscriptions…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-red-400 text-sm">
        Error loading subscriptions. Please try again.
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

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
        <h1 className="text-2xl font-bold text-gray-800">
          Subscription Management
        </h1>

        {/* Add button — pill style matching reference image */}
        <button
          onClick={handleAddNew}
          className="flex items-center gap-0 p-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-semibold shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer"
        >
          {/* Circle icon on left */}
          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 border-r border-white/20 ml-0">
            <FaPlus className="text-white text-xs" />
          </span>
          <span className="px-5">Add New Subscription</span>
        </button>
      </div>

      {/* ── Tabs — matching reference: "Users list | Roles | Groups" style ── */}
      <div className="flex items-center gap-1 mb-5">
        {([
          { key: "list", label: "Subscriptions list" },
          { key: "billing", label: "Billing Types" },
          { key: "features", label: "Features" },
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

      {/* ── Filter Bar — matching reference exactly ── */}

      <div className="flex justify-between gap-4 mb-6">
        {/* ================= LEFT: FILTERS ================= */}
        <div className="flex flex-1 items-center border border-gray-200 rounded-2xl shadow-sm">
          {/* Filter icon */}
          <div className="border-r flex-1 py-3 border-gray-200 ">
            <div className="flex flex-1 items-center gap-2 px-4 py-3 border-r border-gray-200 text-gray-400">
              <FiFilter className="text-base" />
              <span className="text-sm text-gray-500 font-medium">
                Filter By
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="border-r flex-1 py-3 border-gray-200">
            <FilterDropdown
              label="Status"
              options={["Active", "Inactive"]}
              value={filterStatus}
              onChange={(v) => {
                setFilterStatus(v);
                setPage(1);
              }}
            />
          </div>

          {/* Billing */}
          <div className="border-r flex-1 py-3 border-gray-200">
            <FilterDropdown
              label="Billing Type"
              options={billingTypes}
              value={filterBilling}
              onChange={(v) => {
                setFilterBilling(v);
                setPage(1);
              }}
            />
          </div>

          {/* Price */}
          <div className="border-r flex-1 py-3 border-gray-200">
            <FilterDropdown
              label="Price"
              options={[]}
              value=""
              onChange={() => {}}
            />
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-3 text-sm text-teal-500 font-medium hover:text-teal-700 transition cursor-pointer"
          >
            <FiRefreshCw className="text-sm" />
            Reset Filter
          </button>
        </div>

        {/* ================= RIGHT: SEARCH ================= */}
        <div className="flex items-center gap-2 px-4 py-3 w-[30%] border border-gray-200 rounded-2xl shadow-sm min-w-[200px]">
          <FiSearch className="text-gray-300 text-base flex-shrink-0" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(searchInput);
                setPage(1);
              }
            }}
            placeholder="Search here..."
            className="flex-1 text-sm text-gray-600 bg-transparent outline-none placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* ── Table — gradient header + card rows with left teal / right green borders ── */}
      <div className="rounded-2xl shadow-sm border border-gray-100">
        <table className="w-full text-sm border-separate border-spacing-0">
          {/* Gradient header */}
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
              <th className="px-5 py-4 text-left font-semibold text-sm">
                Subscription Name
              </th>
              <th className="px-5 py-4 text-left font-semibold text-sm">
                Billing Type
              </th>
              <th className="px-5 py-4 text-left font-semibold text-sm">
                Price
              </th>
              <th className="px-5 py-4 text-left font-semibold text-sm">
                Features
              </th>
              <th className="px-5 py-4 text-left font-semibold text-sm">
                Created At
              </th>
              <th className="px-5 py-4 text-left font-semibold text-sm">
                Status
              </th>
              <th className="px-5 py-4" />
            </tr>
          </thead>

          <tbody className="bg-white">
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-16 text-gray-300 text-sm"
                >
                  No subscriptions found.
                </td>
              </tr>
            ) : (
              paginated.map((s, idx) => (
                <tr
                  key={s.id}
                  className="group hover:bg-gray-50/60 transition relative"
                  style={{
                    borderBottom:
                      idx < paginated.length - 1 ? "1px solid #f3f4f6" : "none",
                  }}
                >
                  {/* Left teal accent border (matching reference image) */}
                  <td className="relative pl-5 pr-4 py-4 font-semibold text-gray-800">
                    {/* Left border bar */}
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-teal-400 to-teal-300" />
                    {s.subscription_name}
                  </td>

                  <td className="px-5 py-4 text-gray-600 capitalize">
                    {s.billing_type ?? "—"}
                  </td>

                  <td className="px-5 py-4 text-gray-700 font-semibold">
                    ${Number(s.price ?? 0).toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {safeFeatures(s.feature)
                        .slice(0, 3)
                        .map((f, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-teal-50 text-teal-600 border border-teal-200"
                          >
                            {f}
                          </span>
                        ))}
                      {safeFeatures(s.feature).length > 3 && (
                        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                          +{safeFeatures(s.feature).length - 3}
                        </span>
                      )}
                      {safeFeatures(s.feature).length === 0 && (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-500 text-sm">
                    {fmtDate(s.created_at)}
                  </td>

                  {/* Status pill — matching reference: green "Active" / pink "Disabled" */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border ${
                        isActive(s)
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-rose-50 text-rose-500 border-rose-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive(s) ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      />
                      {isActive(s) ? "Active" : "Disabled"}
                    </span>
                  </td>

                  {/* Action — ellipsis + right green border (matching reference) */}
                  <td className="relative pl-4 pr-5 py-4 text-right">
                    {/* Right green accent border */}
                    <span className="absolute right-0 top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-green-400 to-green-300" />
                    <RowMenu
                      subscription={s}
                      onEdit={() => handleEdit(s)}
                      onDelete={() => handleDelete(s.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
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

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSubscription(null);
        }}
        subscription={selectedSubscription}
        onSave={handleSaveSubscription}
      />
    </div>
  );
};

export default SubscriptionList;