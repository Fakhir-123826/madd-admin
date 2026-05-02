import { useState, useRef, useEffect } from "react";
import {
  FaEllipsisV,
  FaEye,
  FaSync,
  FaSearch,
  FaTimes,
  FaExclamationTriangle,
  FaTags,
  FaCopy,
  FaToggleOn,
  FaToggleOff,
  FaTrash,
  FaEdit,
  FaChartLine,
  FaPercentage,
  FaDollarSign,
  FaTruck,
  FaGift,
} from "react-icons/fa";
import {
  FiShield,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
import {
  useGetCouponsQuery,
  useGetCouponStatisticsQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useDuplicateCouponMutation,
  useToggleCouponStatusMutation,
  useSyncCouponToMagentoMutation,
  type Coupon,
} from "../../../app/api/CouponSlices/CouponApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../router";
import PageHeader from "../../../component/PageHeader/Pageheaderfilterbar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vendor {
  id: number;
  uuid: string;
  company_name: string;
}

interface Coupon {
  id: number;
  code: string;
  description: string | null;
  type: "platform" | "vendor";
  discount_type: "percentage" | "fixed_amount" | "free_shipping" | "buy_x_get_y";
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  per_customer_limit: number | null;
  spent_amount: number;
  budget_limit: number | null;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  vendor_id: number | null;
  vendor?: Vendor;
  created_at: string;
  updated_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) : "—";

const fmtDateTime = (d: string) =>
  new Date(d).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const fmtPrice = (price: number | null) =>
  price ? new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price) : "—";

const getDiscountDisplay = (coupon: Coupon) => {
  switch (coupon.discount_type) {
    case "percentage":
      return `${coupon.discount_value}% off`;
    case "fixed_amount":
      return fmtPrice(coupon.discount_value);
    case "free_shipping":
      return "Free Shipping";
    case "buy_x_get_y":
      return "Buy X Get Y";
    default:
      return "—";
  }
};

const getDiscountIcon = (type: string) => {
  switch (type) {
    case "percentage":
      return <FaPercentage className="text-teal-500" />;
    case "fixed_amount":
      return <FaDollarSign className="text-teal-500" />;
    case "free_shipping":
      return <FaTruck className="text-teal-500" />;
    case "buy_x_get_y":
      return <FaGift className="text-teal-500" />;
    default:
      return <FaTags className="text-teal-500" />;
  }
};

const statusStyle = (isActive: boolean) => {
  return isActive
    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
    : "bg-gray-50 text-gray-500 border-gray-200";
};

// ─── Tabs config ──────────────────────────────────────────────────────────────

const TYPE_TABS = [
  { key: "", label: "All Coupons" },
  { key: "platform", label: "Platform Coupons" },
  { key: "vendor", label: "Vendor Coupons" },
];

// ─── Delete Modal ─────────────────────────────────────────────────────────────

const DeleteModal = ({
  isOpen,
  onClose,
  coupon,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  coupon: Coupon | null;
  onSuccess: () => void;
}) => {
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();
  const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showMsg = (type: "success" | "error", msg: string) => {
    setModalToast({ type, msg });
    setTimeout(() => setModalToast(null), 3000);
  };

  const handleDelete = async () => {
    if (!coupon) return;
    try {
      await deleteCoupon(coupon.id).unwrap();
      showMsg("success", `Coupon "${coupon.code}" deleted`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) {
      showMsg("error", e?.data?.message || "Failed to delete coupon");
    }
  };

  if (!isOpen || !coupon) return null;

  const hasBeenUsed = coupon.used_count > 0;

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
              <h2 className="text-lg font-bold text-gray-800">Delete Coupon</h2>
              <p className="text-sm text-gray-500 mt-0.5">Coupon: {coupon.code}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
          </div>

          <div className="p-6 space-y-4">
            {hasBeenUsed && (
              <div className="bg-red-50 rounded-xl p-3 text-sm text-red-600">
                ⚠️ This coupon has been used {coupon.used_count} time(s). It cannot be deleted.
              </div>
            )}

            <div className="bg-yellow-50 rounded-xl p-3 text-sm text-yellow-700">
              Are you sure you want to delete this coupon? This action cannot be undone.
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting || hasBeenUsed}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Coupon"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Status Toggle Modal ──────────────────────────────────────────────────────

const StatusToggleModal = ({
  isOpen,
  onClose,
  coupon,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  coupon: Coupon | null;
  onSuccess: () => void;
}) => {
  const [toggleStatus, { isLoading: isToggling }] = useToggleCouponStatusMutation();
  const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showMsg = (type: "success" | "error", msg: string) => {
    setModalToast({ type, msg });
    setTimeout(() => setModalToast(null), 3000);
  };

  const handleToggle = async () => {
    if (!coupon) return;
    try {
      await toggleStatus(coupon.id).unwrap();
      const newStatus = !coupon.is_active;
      showMsg("success", `Coupon "${coupon.code}" ${newStatus ? "activated" : "deactivated"}`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) {
      showMsg("error", e?.data?.message || "Failed to toggle status");
    }
  };

  if (!isOpen || !coupon) return null;

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
              <h2 className="text-lg font-bold text-gray-800">
                {coupon.is_active ? "Deactivate" : "Activate"} Coupon
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">Coupon: {coupon.code}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
              Are you sure you want to {coupon.is_active ? "deactivate" : "activate"} this coupon?
              {coupon.is_active && coupon.used_count > 0 && (
                <p className="text-yellow-600 mt-2">Note: This coupon has been used {coupon.used_count} time(s).</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleToggle}
                disabled={isToggling}
                className={`flex-1 py-2 rounded-lg text-white font-medium transition disabled:opacity-50 ${coupon.is_active
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
              >
                {isToggling ? "Processing..." : `Yes, ${coupon.is_active ? "Deactivate" : "Activate"}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Duplicate Modal ──────────────────────────────────────────────────────────

const DuplicateModal = ({
  isOpen,
  onClose,
  coupon,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  coupon: Coupon | null;
  onSuccess: () => void;
}) => {
  const [duplicateCoupon, { isLoading: isDuplicating }] = useDuplicateCouponMutation();
  const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showMsg = (type: "success" | "error", msg: string) => {
    setModalToast({ type, msg });
    setTimeout(() => setModalToast(null), 3000);
  };

  const handleDuplicate = async () => {
    if (!coupon) return;
    try {
      await duplicateCoupon(coupon.id).unwrap();
      showMsg("success", `Coupon "${coupon.code}" duplicated`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) {
      showMsg("error", e?.data?.message || "Failed to duplicate coupon");
    }
  };

  if (!isOpen || !coupon) return null;

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
              <h2 className="text-lg font-bold text-gray-800">Duplicate Coupon</h2>
              <p className="text-sm text-gray-500 mt-0.5">Coupon: {coupon.code}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
              This will create a copy of "{coupon.code}" with "_copy_[timestamp]" suffix.
              The new coupon will be created in inactive state.
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDuplicate}
                disabled={isDuplicating}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {isDuplicating ? "Duplicating..." : "Duplicate Coupon"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Coupon Detail Drawer ─────────────────────────────────────────────────────

const CouponDetailDrawer = ({
  coupon,
  onClose,
}: {
  coupon: Coupon | null;
  onClose: () => void;
}) => {
  if (!coupon) return null;

  const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
  const isActiveNow = coupon.is_active && (!coupon.expires_at || new Date(coupon.expires_at) > new Date()) && (!coupon.starts_at || new Date(coupon.starts_at) <= new Date());

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Coupon Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xl font-bold text-gray-800">{coupon.code}</p>
              <p className="text-sm text-gray-500">ID: {coupon.id}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(coupon.is_active)}`}>
                {coupon.is_active ? (isExpired ? "Expired" : (isActiveNow ? "Active" : "Scheduled")) : "Inactive"}
              </span>
            </div>
          </div>

          {/* Type Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${coupon.type === "platform" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
              {coupon.type === "platform" ? "Platform Coupon" : "Vendor Coupon"}
            </span>
          </div>

          {/* Description */}
          {coupon.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700">{coupon.description}</p>
              </div>
            </div>
          )}

          {/* Discount Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              {getDiscountIcon(coupon.discount_type)} Discount Information
            </h3>
            <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Discount Type</p>
                  <p className="text-sm font-medium text-gray-800 capitalize">
                    {coupon.discount_type.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Discount Value</p>
                  <p className="text-lg font-bold text-teal-600">{getDiscountDisplay(coupon)}</p>
                </div>
                {coupon.min_order_amount && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400">Minimum Order Amount</p>
                    <p className="text-sm text-gray-700">{fmtPrice(coupon.min_order_amount)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vendor Info (if applicable) */}
          {coupon.vendor && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Vendor</h3>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-medium text-gray-800">{coupon.vendor.company_name}</p>
                <p className="text-xs text-gray-400">ID: {coupon.vendor.uuid?.slice(0, 8)}...</p>
              </div>
            </div>
          )}

          {/* Usage Statistics */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaChartLine className="text-teal-500" /> Usage Statistics
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">Total Uses</p>
                <p className="text-xl font-bold text-teal-600">{coupon.used_count}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">Total Discount</p>
                <p className="text-xl font-bold text-teal-600">{fmtPrice(coupon.spent_amount)}</p>
              </div>
              {coupon.max_uses && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400">Remaining Uses</p>
                  <p className="text-lg font-bold text-gray-700">{Math.max(0, coupon.max_uses - coupon.used_count)} / {coupon.max_uses}</p>
                </div>
              )}
              {coupon.budget_limit && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400">Remaining Budget</p>
                  <p className="text-lg font-bold text-gray-700">{fmtPrice(coupon.budget_limit - coupon.spent_amount)}</p>
                </div>
              )}
              {coupon.per_customer_limit && (
                <div className="col-span-2 bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400">Per Customer Limit</p>
                  <p className="text-sm font-medium text-gray-700">{coupon.per_customer_limit} use(s) per customer</p>
                </div>
              )}
            </div>
          </div>

          {/* Validity Period */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FiCalendar className="text-teal-500" /> Validity Period
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Starts:</span>
                <span className="text-gray-700">{fmtDate(coupon.starts_at)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expires:</span>
                <span className="text-gray-700">{fmtDate(coupon.expires_at)}</span>
              </div>
              {isExpired && (
                <div className="text-red-500 text-xs text-center mt-2">⚠️ This coupon has expired</div>
              )}
            </div>
          </div>

          {/* Meta Info */}
          <div className="pt-2 border-t border-gray-100">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Created:</span>
                <span className="text-gray-600">{fmtDateTime(coupon.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Updated:</span>
                <span className="text-gray-600">{fmtDateTime(coupon.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Row Action Menu ──────────────────────────────────────────────────────────

const RowMenu = ({
  coupon,
  onView,
  onEdit,
  onDelete,
  onToggle,
  onDuplicate,
}: {
  coupon: Coupon;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  onDuplicate: () => void;
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

  const canDelete = coupon.used_count === 0;

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
            <FaEye className="inline mr-2 text-xs" /> View Details
          </button>
          <button onClick={() => { onEdit(); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-teal-50 text-teal-600 cursor-pointer">
            <FaEdit className="inline mr-2 text-xs" /> Edit
          </button>
          <button onClick={() => { onDuplicate(); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-600 cursor-pointer">
            <FaCopy className="inline mr-2 text-xs" /> Duplicate
          </button>
          <button onClick={() => { onToggle(); setOpen(false); }}
            className={`w-full text-left px-4 py-2 ${coupon.is_active ? "hover:bg-yellow-50 text-yellow-600" : "hover:bg-emerald-50 text-emerald-600"} cursor-pointer`}>
            {coupon.is_active ? (
              <><FaToggleOff className="inline mr-2 text-xs" /> Deactivate</>
            ) : (
              <><FaToggleOn className="inline mr-2 text-xs" /> Activate</>
            )}
          </button>
          {canDelete && (
            <div className="border-t border-gray-100 my-1" />
          )}
          {canDelete && (
            <button onClick={() => { onDelete(); setOpen(false); }}
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer">
              <FaTrash className="inline mr-2 text-xs" /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PER_PAGE = 12;

const CouponManagementList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeType, setActiveType] = useState<string>("");
  const [filterDiscountType, setFilterDiscountType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const { data, isLoading, error, refetch, isFetching } = useGetCouponsQuery({
    page,
    per_page: PER_PAGE,
    type: activeType || undefined,
    search: search || undefined,
  });
  const { data: statsData, isLoading: isStatsLoading } = useGetCouponStatisticsQuery();

  const coupons: Coupon[] = data?.data?.data ?? [];
  const meta = data?.meta;
  const stats = statsData?.data ?? null;

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleReset = () => {
    setFilterDiscountType("");
    setFilterStatus("");
    setSearch("");
    setSearchInput("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = () => {
    refetch();
  };

  const discountTypes = [...new Set(coupons.map(c => c.discount_type).filter(Boolean))];
  const statusOptions = ["active", "inactive"];

  const filters = [
    { label: "Discount Type", options: discountTypes, value: filterDiscountType, onChange: (v: string) => { setFilterDiscountType(v); setPage(1); } },
    { label: "Status", options: statusOptions, value: filterStatus, onChange: (v: string) => { setFilterStatus(v); setPage(1); } },
  ];

  const filteredCoupons = coupons.filter(coupon => {
    const matchDiscountType = !filterDiscountType || coupon.discount_type === filterDiscountType;
    const matchStatus = !filterStatus || (filterStatus === "active" ? coupon.is_active : !coupon.is_active);
    return matchDiscountType && matchStatus;
  });

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
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 mt-4">
        <div className="text-xs text-gray-400">
          Showing {meta.from || 0} to {meta.to || 0} of {meta.total} coupons
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isFetching}
            className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
          >
            ← Previous
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
            Next →
          </button>
        </div>
      </div>
    );
  };

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

      {/* Stats Summary */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {isStatsLoading || !stats ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl px-4 py-3 animate-pulse">
              <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
              <div className="h-6 w-12 bg-gray-300 rounded" />
            </div>
          ))
        ) : (
          <>
            <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">Total Coupons</span>
              <p className="text-xl font-bold text-teal-600">{stats.total || 0}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">Active</span>
              <p className="text-xl font-bold text-emerald-600">{stats.active || 0}</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">Inactive</span>
              <p className="text-xl font-bold text-gray-600">{stats.inactive || 0}</p>
            </div>
            <div className="bg-purple-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">Platform</span>
              <p className="text-xl font-bold text-purple-600">{stats.platform_coupons || 0}</p>
            </div>
            <div className="bg-blue-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">Vendor</span>
              <p className="text-xl font-bold text-blue-600">{stats.vendor_coupons || 0}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">Total Uses</span>
              <p className="text-xl font-bold text-yellow-600">{stats.total_uses || 0}</p>
            </div>
          </>
        )}
      </div>

      {/* PageHeader */}
      <PageHeader
        title="Coupon Management"
        addButtonLabel="Add New Coupon"
        onAdd={() => navigate("/CreateCouponManagement")}
        tabs={TYPE_TABS}
        activeTab={activeType}
        onTabChange={(tab) => { setActiveType(tab); setPage(1); }}
        filters={filters}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={() => { setSearch(searchInput); setPage(1); }}
        onResetFilters={handleReset}
        searchPlaceholder="Search by coupon code, description..."
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading || isFetching ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-xl p-5 shadow-sm animate-pulse">
              <div className="flex items-start justify-between mb-3">
                <div className="h-6 w-24 bg-gray-200 rounded" />
                <div className="h-5 w-16 bg-gray-200 rounded-full" />
              </div>
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-4" />
              <div className="flex gap-3">
                <div className="h-9 w-20 bg-gray-200 rounded-lg" />
                <div className="h-9 w-20 bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full text-center py-16 text-red-400 text-sm">
            Error loading coupons. Please try again.
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-300 text-sm">
            <FaTags className="text-4xl mx-auto mb-3 opacity-30" />
            No coupons found.
          </div>
        ) : (
          filteredCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-teal-200"
            >
              {/* Top */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{coupon.code}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${coupon.type === "platform" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                      {coupon.type === "platform" ? "Platform" : "Vendor"}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${statusStyle(coupon.is_active)}`}>
                      {coupon.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-teal-600">
                    {getDiscountIcon(coupon.discount_type)}
                    <span className="text-sm font-medium">{getDiscountDisplay(coupon)}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {coupon.description || "No description provided"}
              </p>

              {/* Date Range */}
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <FiCalendar className="text-xs" />
                {coupon.starts_at || coupon.expires_at ? (
                  <span>
                    {fmtDate(coupon.starts_at)} - {fmtDate(coupon.expires_at)}
                  </span>
                ) : (
                  <span>No expiry</span>
                )}
              </div>

              {/* Usage Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-2 border-b border-gray-100">
                <span>Uses: {coupon.used_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ""}</span>
                <span>Discount Given: {fmtPrice(coupon.spent_amount)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/EditCouponManagement/${coupon.id}`)}
                  className="flex-1 bg-gradient-to-r from-teal-400 to-green-400 hover:opacity-90 text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Edit Coupon
                </button>
                <button
                  onClick={() => {
                    setSelectedCoupon(coupon);
                    setIsDeleteModalOpen(true);
                  }}
                  disabled={coupon.used_count > 0}
                  className={`px-4 py-2 rounded-lg text-white text-sm transition ${coupon.used_count > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                    }`}
                  title={coupon.used_count > 0 ? "Cannot delete coupon that has been used" : "Delete coupon"}
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setSelectedCoupon(coupon);
                    setIsDrawerOpen(true);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                >
                  View
                </button>
              </div>

              {/* Quick Actions Row */}
              <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedCoupon(coupon);
                    setIsDuplicateModalOpen(true);
                  }}
                  className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <FaCopy className="text-xs" /> Duplicate
                </button>
                <button
                  onClick={() => {
                    setSelectedCoupon(coupon);
                    setIsToggleModalOpen(true);
                  }}
                  className={`text-xs flex items-center gap-1 ${coupon.is_active ? "text-yellow-600 hover:text-yellow-700" : "text-emerald-600 hover:text-emerald-700"
                    }`}
                >
                  {coupon.is_active ? <FaToggleOff /> : <FaToggleOn />}
                  {coupon.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {renderPaginationButtons()}

      {/* Modals */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setSelectedCoupon(null); }}
        coupon={selectedCoupon}
        onSuccess={handleSuccess}
      />

      <StatusToggleModal
        isOpen={isToggleModalOpen}
        onClose={() => { setIsToggleModalOpen(false); setSelectedCoupon(null); }}
        coupon={selectedCoupon}
        onSuccess={handleSuccess}
      />

      <DuplicateModal
        isOpen={isDuplicateModalOpen}
        onClose={() => { setIsDuplicateModalOpen(false); setSelectedCoupon(null); }}
        coupon={selectedCoupon}
        onSuccess={handleSuccess}
      />

      <CouponDetailDrawer
        coupon={isDrawerOpen ? selectedCoupon : null}
        onClose={() => { setIsDrawerOpen(false); setSelectedCoupon(null); }}
      />
    </div>
  );
};

export default CouponManagementList;