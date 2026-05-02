import { useState, useRef, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";
import {
  useGetSubscriptionsQuery,
  useDeleteSubscriptionMutation,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from "../../app/api/SubscriptionSclices/SubscriptionSclices";
import SubscriptionModal from "../../component/SubscriptionModal/SubscriptionModal";
import type { Subscription } from "../../model/susbcription/ISubscription";
import PageHeader from "../../component/PageHeader/Pageheaderfilterbar.tsx"; // ← shared component

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

// ─── Row Action Menu ──────────────────────────────────────────────────────────

const RowMenu = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
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

const TABS = [
  { key: "list", label: "Subscriptions list" },
  { key: "billing", label: "Billing Types" },
  { key: "features", label: "Features" },
];

const SubscriptionList = () => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("list");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBilling, setFilterBilling] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  const [deleteSubscription] = useDeleteSubscriptionMutation();
  const [createSubscription] = useCreateSubscriptionMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();

  const {
    data: subscriptions = [],
    isLoading,
    error,
    refetch,
  } = useGetSubscriptionsQuery();

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveSubscription = async (data: Partial<Subscription>) => {
    try {
      if (selectedSubscription) {
        await updateSubscription({ id: selectedSubscription.id, data }).unwrap();
        showToast("success", "Subscription updated successfully!");
      } else {
        await createSubscription(data).unwrap();
        showToast("success", "Subscription created successfully!");
      }
      refetch();
      setIsModalOpen(false);
      setSelectedSubscription(null);
    } catch (error: any) {
      showToast("error", error?.data?.message || "Failed to save subscription");
      throw error;
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

  const handleReset = () => {
    setFilterStatus("");
    setFilterBilling("");
    setSearch("");
    setSearchInput("");
    setPage(1);
  };

  // ── Derived data ──
  const billingTypes = [
    ...new Set(subscriptions.map((s) => s.billing_type).filter(Boolean)),
  ];

  const filtered = subscriptions.filter((s) => {
    const matchStatus =
      !filterStatus ||
      (filterStatus === "Active" ? isActive(s) : !isActive(s));
    const matchBilling = !filterBilling || s.billing_type === filterBilling;
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

  // ── Filters config for PageHeader ──
  const filters = [
    {
      label: "Status",
      options: ["Active", "Inactive"],
      value: filterStatus,
      onChange: (v: string) => {
        setFilterStatus(v);
        setPage(1);
      },
    },
    {
      label: "Billing Type",
      options: billingTypes,
      value: filterBilling,
      onChange: (v: string) => {
        setFilterBilling(v);
        setPage(1);
      },
    },
    {
      label: "Price",
      options: [],
      value: "",
      onChange: () => {},
    },
  ];

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

      {/* ── Shared Header + Filter Bar ── */}
      <PageHeader
        title="Subscription Management"
        addButtonLabel="Add New Subscription"
        onAdd={handleAddNew}
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        filters={filters}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={() => {
          setSearch(searchInput);
          setPage(1);
        }}
        onResetFilters={handleReset}
        searchPlaceholder="Search here..."
      />

      {/* ── Table ── */}
      <div className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm border-separate border-spacing-0">
          {/* Gradient header */}
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
              {[
                "Subscription Name",
                "Billing Type",
                "Price",
                "Features",
                "Created At",
                "Status",
                "",
              ].map((col, i) => (
                <th
                  key={i}
                  className="px-5 py-4 text-left font-semibold text-sm"
                >
                  {col}
                </th>
              ))}
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
                  className="group hover:bg-gray-50/60 transition"
                  style={{
                    borderBottom:
                      idx < paginated.length - 1
                        ? "1px solid #f3f4f6"
                        : "none",
                  }}
                >
                  {/* Name + left teal accent */}
                  <td className="relative pl-5 pr-4 py-4 font-semibold text-gray-800">
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

                  <td className="px-5 py-4 text-gray-500">
                    {fmtDate(s.created_at)}
                  </td>

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

                  {/* Actions + right green accent */}
                  <td className="relative pl-4 pr-5 py-4 text-right">
                    <span className="absolute right-0 top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-green-400 to-green-300" />
                    <RowMenu
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