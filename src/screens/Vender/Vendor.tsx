import { useState, useRef, useEffect } from "react";
import { FaEllipsisV, FaCheckCircle, FaTimesCircle, FaStore, FaEye, FaEdit, FaUserCheck, FaChartLine } from "react-icons/fa";
import { FiShield, FiAlertCircle, FiUserCheck, FiEye, FiMapPin, FiMail, FiPhone, FiCalendar, FiDollarSign, FiStar, FiCheck, FiX } from "react-icons/fi";
import {
  useGetVendorsQuery,
  useCreateVendorMutation,
  useUpdateVendorPlanMutation,
//   useDeleteVendorMutation,
  useSuspendVendorMutation,
  useActivateVendorMutation,
  useApproveVendorMutation,
  useVerifyVendorKycMutation,
  useRejectVendorKycMutation,
} from "../../app/api/VendorSlices/VendorApi";
import VendorModal from "../../component/VendorModal";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router";
import PageHeader from "../../component/PageHeader/Pageheaderfilterbar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Address {
  line1: string;
  line2: string | null;
  city: string;
  postal_code: string;
  full: string | null;
}

interface Contact {
  email: string;
  phone: string;
  website: string | null;
}

interface Plan {
  id: number;
  name: string;
  max_products: number;
  max_stores: number;
  commission_rate: string;
  expires_at: string;
  is_expired: boolean | null;
}

interface Rating {
  average: string;
  total: number;
}

interface Financial {
  current_balance: string;
  pending_balance: string;
  total_earned: string;
  total_commission_paid: string;
  commission_rate: string | null;
}

interface Store {
  id: number;
  uuid: string;
  store_name: string;
  store_slug: string;
  status: string;
  subdomain: string;
  created_at: string;
}

interface Vendor {
  id: string;
  company_name: string;
  company_slug: string;
  legal_name: string;
  vat_number: string;
  country_code: string;
  address: Address;
  contact: Contact;
  logo_url: string | null;
  banner_url: string | null;
  description: string | null;
  status: string;
  kyc_status: string;
  rating: Rating;
  financial: Financial;
  plan: Plan;
  stores: Store[];
  created_at: string;
  updated_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const statusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "suspended":
      return "bg-yellow-50 text-yellow-600 border-yellow-200";
    case "pending":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "banned":
      return "bg-red-50 text-red-600 border-red-200";
    case "inactive":
      return "bg-gray-50 text-gray-500 border-gray-200";
    case "approved":
      return "bg-green-50 text-green-600 border-green-200";
    default:
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
};

const kycStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "verified":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

// ─── Tabs config ──────────────────────────────────────────────────────────────

const TABS = [
  { key: "list", label: "All Vendors" },
  { key: "pending_kyc", label: "Pending KYC" },
  { key: "rejected_kyc", label: "Rejected KYC" },
  { key: "applications", label: "Applications" },
];

// ─── KYC Management Modal ─────────────────────────────────────────────────────

const KYCManagementModal = ({
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
  const [verifyKyc, { isLoading: isVerifying }] = useVerifyVendorKycMutation();
  const [rejectKyc, { isLoading: isRejecting }] = useRejectVendorKycMutation();
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showMsg = (type: "success" | "error", msg: string) => {
    setModalToast({ type, msg });
    setTimeout(() => setModalToast(null), 3000);
  };

  const handleVerify = async () => {
    if (!vendor) return;
    try {
      await verifyKyc(vendor.id).unwrap();
      showMsg("success", `${vendor.company_name} KYC has been verified`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) {
      showMsg("error", e?.data?.message || "Failed to verify KYC");
    }
  };

  const handleReject = async () => {
    if (!vendor) return;
    if (!rejectReason.trim()) {
      showMsg("error", "Please provide a reason for rejection");
      return;
    }
    try {
      await rejectKyc({ id: vendor.id, data: { reason: rejectReason } }).unwrap();
      showMsg("success", `${vendor.company_name} KYC has been rejected`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) {
      showMsg("error", e?.data?.message || "Failed to reject KYC");
    }
  };

  if (!isOpen || !vendor) return null;

  const isPending = vendor.kyc_status === "pending";
  const isVerified = vendor.kyc_status === "verified";
  const isRejected = vendor.kyc_status === "rejected";

  if (isVerified) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
            <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
              <h2 className="text-lg font-bold text-gray-800">KYC Status</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-emerald-500 text-2xl" />
              </div>
              <p className="text-gray-700">KYC is already verified for this vendor.</p>
            </div>
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={onClose} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <h2 className="text-lg font-bold text-gray-800">KYC Verification</h2>
              <p className="text-sm text-gray-500 mt-0.5">{vendor.company_name}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
          </div>

          <div className="px-6 pt-4">
            <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">Current KYC Status</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${kycStatusStyle(vendor.kyc_status)}`}>
                {vendor.kyc_status?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-3">
            {isPending && (
              <>
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                      <FiCheck className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Verify KYC</p>
                      <p className="text-xs text-gray-500">Approve vendor documents</p>
                    </div>
                  </div>
                  <button onClick={handleVerify} disabled={isVerifying}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition disabled:opacity-50">
                    {isVerifying ? "..." : "Verify"}
                  </button>
                </div>

                <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                        <FiX className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">Reject KYC</p>
                        <p className="text-xs text-gray-500">Reject vendor documents</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={showRejectInput} onChange={() => setShowRejectInput(!showRejectInput)} className="sr-only peer" />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-red-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                    </label>
                  </div>
                  {showRejectInput && (
                    <>
                      <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                        placeholder="Reason for rejection..." rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-400 resize-none" />
                      <button onClick={handleReject} disabled={isRejecting}
                        className="w-full py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-50">
                        {isRejecting ? "Rejecting..." : "Confirm Rejection"}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {isRejected && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-sm text-gray-400">
                This vendor's KYC has been rejected. You can verify again if they resubmit.
              </div>
            )}
          </div>

          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <button onClick={onClose} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 font-medium">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Plan Management Modal ────────────────────────────────────────────────────

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
  const [updatePlan, { isLoading: isUpdating }] = useUpdateVendorPlanMutation();
  const [selectedPlanId, setSelectedPlanId] = useState<number>(0);
  const [durationMonths, setDurationMonths] = useState<number>(12);
  const [modalToast, setModalToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const planOptions = [
    { id: 1, name: "Starter", commission: "5%", maxProducts: 50, maxStores: 1, price: "$29/mo" },
    { id: 2, name: "Professional", commission: "3%", maxProducts: 500, maxStores: 3, price: "$79/mo" },
    { id: 3, name: "Enterprise", commission: "1.5%", maxProducts: "Unlimited", maxStores: 10, price: "$199/mo" },
  ];

  const showMsg = (type: "success" | "error", msg: string) => {
    setModalToast({ type, msg });
    setTimeout(() => setModalToast(null), 3000);
  };

  const handleUpdatePlan = async () => {
    if (!vendor || !selectedPlanId) {
      showMsg("error", "Please select a plan");
      return;
    }
    try {
      await updatePlan({
        id: vendor.id,
        data: {
          plan_id: selectedPlanId,
          duration_months: durationMonths,
        },
      }).unwrap();
      showMsg("success", `${vendor.company_name}'s plan has been updated`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) {
      showMsg("error", e?.data?.message || "Failed to update plan");
    }
  };

  if (!isOpen || !vendor) return null;

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
        <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full">
          <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
          <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Update Vendor Plan</h2>
              <p className="text-sm text-gray-500 mt-0.5">{vendor.company_name}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Plan</label>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-semibold text-gray-800">{vendor.plan?.name || "No Plan"}</p>
                <p className="text-xs text-gray-500">Commission: {vendor.plan?.commission_rate}%</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select New Plan</label>
              <div className="grid gap-3">
                {planOptions.map((plan) => (
                  <label
                    key={plan.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${selectedPlanId === plan.id
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-teal-300"}`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="plan"
                        value={plan.id}
                        checked={selectedPlanId === plan.id}
                        onChange={() => setSelectedPlanId(plan.id)}
                        className="w-4 h-4 text-teal-500"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{plan.name}</p>
                        <div className="flex gap-3 text-xs text-gray-500 mt-1">
                          <span>Commission: {plan.commission}</span>
                          <span>Max Products: {plan.maxProducts}</span>
                          <span>Max Stores: {plan.maxStores}</span>
                        </div>
                      </div>
                    </div>
                    <p className="font-semibold text-teal-600">{plan.price}</p>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Months)</label>
              <select
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value={1}>1 Month</option>
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months (Best Value)</option>
                <option value={24}>24 Months</option>
              </select>
            </div>

            {selectedPlanId > 0 && (
              <div className="p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl">
                <p className="text-sm text-gray-600">Plan Summary:</p>
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li>• Commission Rate: {planOptions.find(p => p.id === selectedPlanId)?.commission}</li>
                  <li>• Subscription Duration: {durationMonths} months</li>
                  <li>• Next billing: {new Date(Date.now() + durationMonths * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</li>
                </ul>
              </div>
            )}

            <button
              onClick={handleUpdatePlan}
              disabled={isUpdating || !selectedPlanId}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {isUpdating ? "Updating Plan..." : "Update Plan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Status Management Modal ──────────────────────────────────────────────────

const StatusManagementModal = ({
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
  const [suspendVendor, { isLoading: isSuspending }] = useSuspendVendorMutation();
  const [activateVendor, { isLoading: isActivating }] = useActivateVendorMutation();
  const [approveVendor, { isLoading: isApproving }] = useApproveVendorMutation();
  const [deleteVendor, { isLoading: isDeleting }] = useDeleteVendorMutation();

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
    if (!vendor) return;
    if (!suspendReason.trim()) { showMsg("error", "Please provide a reason for suspension"); return; }
    try {
      await suspendVendor({ id: vendor.id, data: { reason: suspendReason } }).unwrap();
      showMsg("success", `${vendor.company_name} has been suspended`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) { showMsg("error", e?.data?.message || "Failed to suspend"); }
  };

  const handleBan = async () => {
    if (!vendor) return;
    if (!banReason.trim()) { showMsg("error", "Please provide a reason for ban"); return; }
    try {
      // Using suspend as ban for now (you can add a dedicated ban endpoint)
      await suspendVendor({ id: vendor.id, data: { reason: banReason } }).unwrap();
      showMsg("success", `${vendor.company_name} has been banned`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) { showMsg("error", e?.data?.message || "Failed to ban"); }
  };

  const handleActivate = async () => {
    if (!vendor) return;
    try {
      await activateVendor(vendor.id).unwrap();
      showMsg("success", `${vendor.company_name} has been activated`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) { showMsg("error", e?.data?.message || "Failed to activate"); }
  };

  const handleApprove = async () => {
    if (!vendor) return;
    try {
      await approveVendor(vendor.id).unwrap();
      showMsg("success", `${vendor.company_name} has been approved`);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (e: any) { showMsg("error", e?.data?.message || "Failed to approve"); }
  };

  if (!isOpen || !vendor) return null;

  const isActive = vendor.status === "active";
  const isSuspended = vendor.status === "suspended";
  const isPending = vendor.status === "pending";

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
              <h2 className="text-lg font-bold text-gray-800">Manage Vendor Status</h2>
              <p className="text-sm text-gray-500 mt-0.5">{vendor.company_name}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-0.5 cursor-pointer">✕</button>
          </div>

          {/* Current status */}
          <div className="px-6 pt-4">
            <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">Current Status</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(vendor.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {vendor.status?.charAt(0).toUpperCase() + vendor.status?.slice(1) || "Unknown"}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-3">
            {/* Approve - for pending applications */}
            {isPending && (
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                    <FaUserCheck className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Approve Vendor</p>
                    <p className="text-xs text-gray-500">Approve pending application</p>
                  </div>
                </div>
                <button onClick={handleApprove} disabled={isApproving}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition disabled:opacity-50 cursor-pointer">
                  {isApproving ? "..." : "Approve"}
                </button>
              </div>
            )}

            {/* Activate — for suspended */}
            {isSuspended && (
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                    <FiUserCheck className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Activate Vendor</p>
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
                      <p className="font-semibold text-gray-800 text-sm">Suspend Vendor</p>
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

            {/* Ban option for active vendors */}
            {isActive && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                      <FiAlertCircle className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Ban Vendor</p>
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
                    <button onClick={handleBan} disabled={isSuspending}
                      className="w-full py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-50 cursor-pointer">
                      {isSuspending ? "Banning..." : "Confirm Ban"}
                    </button>
                  </>
                )}
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
  onView,
  onEdit,
  onStatusManage,
  onKycManage,
  onPlanManage,
}: {
  onView: () => void;
  onEdit: () => void;
  onStatusManage: () => void;
  onKycManage: () => void;
  onPlanManage: () => void;
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
        <div className="absolute right-0 top-7 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-48 text-sm">
          <button onClick={() => { onView(); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 cursor-pointer">
            <FaEye className="inline mr-2 text-xs" /> View Details
          </button>
          <button onClick={() => { onKycManage(); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-emerald-600 cursor-pointer">
            <FaCheckCircle className="inline mr-2 text-xs" /> Manage KYC
          </button>
          <button onClick={() => { onPlanManage(); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-600 cursor-pointer">
            <FaChartLine className="inline mr-2 text-xs" /> Update Plan
          </button>
          <button onClick={() => { onStatusManage(); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-orange-50 text-orange-600 cursor-pointer">
            <FiShield className="inline mr-2 text-xs" /> Manage Status
          </button>
          <button onClick={() => { onEdit(); setOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-teal-50 text-teal-700 cursor-pointer">
            <FaEdit className="inline mr-2 text-xs" /> Edit
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Vendor Detail Drawer ─────────────────────────────────────────────────────

const VendorDetailDrawer = ({
  vendor,
  onClose,
}: {
  vendor: Vendor | null;
  onClose: () => void;
}) => {
  if (!vendor) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Vendor Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <img
              src={vendor.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.company_name)}&background=14B8A6&color=ffffff&bold=true&size=80`}
              className="w-16 h-16 rounded-full object-cover"
              alt={vendor.company_name}
            />
            <div>
              <p className="text-lg font-bold text-gray-800">{vendor.company_name}</p>
              <p className="text-sm text-gray-500">{vendor.legal_name}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(vendor.status)}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {vendor.status?.charAt(0).toUpperCase() + vendor.status?.slice(1)}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${kycStatusStyle(vendor.kyc_status)}`}>
                  KYC: {vendor.kyc_status?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Rating */}
          {vendor.rating && (
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center">
                <FiStar className="text-yellow-400 fill-yellow-400" />
                <span className="ml-1 font-semibold">{vendor.rating.average}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{vendor.rating.total} reviews</span>
            </div>
          )}

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FiMail className="text-teal-500" /> Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-700">{vendor.contact?.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm font-medium text-gray-700">{vendor.contact?.phone || "—"}</p>
              </div>
              {vendor.contact?.website && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-400">Website</p>
                  <p className="text-sm font-medium text-teal-600">{vendor.contact.website}</p>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FiMapPin className="text-teal-500" /> Address
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Country</p>
                  <p className="text-sm font-medium text-gray-700">{vendor.country_code || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">City</p>
                  <p className="text-sm font-medium text-gray-700">{vendor.address?.city || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Postal Code</p>
                  <p className="text-sm font-medium text-gray-700">{vendor.address?.postal_code || "—"}</p>
                </div>
              </div>
              {(vendor.address?.line1 || vendor.address?.line2) && (
                <div>
                  <p className="text-xs text-gray-400">Address</p>
                  <p className="text-sm text-gray-700">
                    {vendor.address.line1}
                    {vendor.address.line2 && `, ${vendor.address.line2}`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Plan Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Plan Information</h3>
            <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Plan Name</p>
                  <p className="text-sm font-semibold text-teal-700">{vendor.plan?.name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Commission Rate</p>
                  <p className="text-sm font-medium text-gray-700">{vendor.plan?.commission_rate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Max Products</p>
                  <p className="text-sm text-gray-700">{vendor.plan?.max_products || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Max Stores</p>
                  <p className="text-sm text-gray-700">{vendor.plan?.max_stores || "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400">Plan Expires</p>
                  <p className="text-sm text-gray-700">{vendor.plan?.expires_at ? fmtDate(vendor.plan.expires_at) : "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FiDollarSign className="text-teal-500" /> Financial Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
              <div>
                <p className="text-xs text-gray-400">Current Balance</p>
                <p className="text-lg font-bold text-teal-600">${vendor.financial?.current_balance || "0"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Pending Balance</p>
                <p className="text-sm font-medium text-yellow-600">${vendor.financial?.pending_balance || "0"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Earned</p>
                <p className="text-sm text-gray-700">${vendor.financial?.total_earned || "0"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Commission Paid</p>
                <p className="text-sm text-gray-700">${vendor.financial?.total_commission_paid || "0"}</p>
              </div>
            </div>
          </div>

          {/* Stores */}
          {vendor.stores && vendor.stores.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaStore className="text-teal-500" /> Stores ({vendor.stores.length})
              </h3>
              <div className="space-y-2">
                {vendor.stores.map((store) => (
                  <div key={store.id} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{store.store_name}</p>
                      <p className="text-xs text-gray-400">{store.subdomain}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusStyle(store.status)}`}>
                      {store.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VAT & Meta Info */}
          <div className="pt-2 border-t border-gray-100">
            <div className="space-y-2 text-xs">
              {vendor.vat_number && (
                <div className="flex justify-between">
                  <span className="text-gray-400">VAT Number:</span>
                  <span className="text-gray-600">{vendor.vat_number}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Vendor ID:</span>
                <span className="text-gray-600">{vendor.id?.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Joined:</span>
                <span className="text-gray-600">{fmtDate(vendor.created_at)}</span>
              </div>
              {vendor.description && (
                <div>
                  <span className="text-gray-400">Description:</span>
                  <p className="text-gray-600 mt-1">{vendor.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const VendorList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("list");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterKycStatus, setFilterKycStatus] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const { data, isLoading, error, refetch } = useGetVendorsQuery();
  const [updateVendor] = useUpdateVendorPlanMutation();

  const vendors: Vendor[] = data?.data ?? [];

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveVendor = async (formData: Partial<Vendor>) => {
    try {
      if (selectedVendor) {
        await updateVendor({ id: selectedVendor.id, data: formData as any }).unwrap();
        showToast("success", "Vendor updated successfully!");
      }
      refetch();
      setIsEditModalOpen(false);
      setSelectedVendor(null);
    } catch (e: any) {
      showToast("error", e?.data?.message || "Failed to save vendor");
      throw e;
    }
  };

  const handleReset = () => {
    setFilterStatus("");
    setFilterKycStatus("");
    setFilterCountry("");
    setSearch("");
    setSearchInput("");
    setPage(1);
  };

  // Derived values for filters
  const statuses = [...new Set(vendors.map(v => v.status).filter(Boolean))];
  const kycStatuses = [...new Set(vendors.map(v => v.kyc_status).filter(Boolean))];
  const countries = [...new Set(vendors.map(v => v.country_code).filter(Boolean))];

  // Filtering logic
  const filtered = vendors.filter(v => {
    const matchStatus = !filterStatus || v.status === filterStatus;
    const matchKyc = !filterKycStatus || v.kyc_status === filterKycStatus;
    const matchCountry = !filterCountry || v.country_code === filterCountry;
    const matchSearch = !search ||
      v.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      v.legal_name?.toLowerCase().includes(search.toLowerCase()) ||
      v.contact?.email?.toLowerCase().includes(search.toLowerCase()) ||
      v.vat_number?.toLowerCase().includes(search.toLowerCase());

    let matchTab = true;
    if (activeTab === "pending_kyc") {
      matchTab = v.kyc_status === "pending";
    } else if (activeTab === "rejected_kyc") {
      matchTab = v.kyc_status === "rejected";
    } else if (activeTab === "applications") {
      matchTab = v.status === "pending";
    }

    return matchStatus && matchKyc && matchCountry && matchSearch && matchTab;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Filters config for PageHeader
  const filters = [
    { label: "Status", options: statuses, value: filterStatus, onChange: (v: string) => { setFilterStatus(v); setPage(1); } },
    { label: "KYC Status", options: kycStatuses, value: filterKycStatus, onChange: (v: string) => { setFilterKycStatus(v); setPage(1); } },
    { label: "Country", options: countries, value: filterCountry, onChange: (v: string) => { setFilterCountry(v); setPage(1); } },
  ];

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

      {/* PageHeader */}
      <PageHeader
        title="Vendor Management"
        addButtonLabel="Add New Vendor"
        onAdd={() => navigate(ROUTES.CREATE_VENDOR)}
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setPage(1); }}
        filters={filters}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={() => { setSearch(searchInput); setPage(1); }}
        onResetFilters={handleReset}
        searchPlaceholder="Search by company name, email, VAT..."
      />

      {/* Table */}
      <div className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                {["Company", "Contact", "Country", "VAT", "Plan", "Stores", "Status", "KYC", "Joined", ""].map((col, i) => (
                  <th key={i} className="px-4 py-4 text-left font-semibold text-sm whitespace-nowrap">{col}</th>
                ))}
               </tr>
            </thead>
            <tbody className="bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="text-center py-16">
                    <div className="flex items-center justify-center gap-3 text-gray-400">
                      <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-teal-500" />
                      <span className="text-sm">Loading vendors…</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-red-400 text-sm">
                    Error loading vendors. Please try again.
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-gray-300 text-sm">
                    No vendors found.
                  </td>
                </tr>
              ) : (
                paginated.map((vendor, idx) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-gray-50/60 transition"
                    style={{
                      borderBottom: idx < paginated.length - 1 ? "1px solid #f3f4f6" : "none",
                    }}
                  >
                    {/* Company */}
                    <td className="relative pl-5 pr-4 py-3">
                      <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-teal-400 to-teal-300" />
                      <div className="flex items-center gap-2.5">
                        <img
                          src={vendor.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.company_name)}&background=14B8A6&color=ffffff&bold=true`}
                          className="w-8 h-8 rounded-full shrink-0 object-cover"
                          alt={vendor.company_name}
                        />
                        <div>
                          <span className="font-semibold text-gray-800 text-sm block">{vendor.company_name}</span>
                          <span className="text-xs text-gray-400">{vendor.legal_name}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3">
                      <div className="text-xs">
                        <p className="text-gray-600">{vendor.contact?.email || "—"}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{vendor.contact?.phone || "—"}</p>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-600 text-xs">{vendor.country_code || "—"}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{vendor.vat_number || "—"}</td>

                    {/* Plan */}
                    <td className="px-4 py-3">
                      <div className="text-xs">
                        <p className="font-medium text-gray-700">{vendor.plan?.name || "—"}</p>
                        <p className="text-gray-400">{vendor.plan?.commission_rate}% commission</p>
                      </div>
                    </td>

                    {/* Stores */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <FaStore className="text-teal-400 text-xs" />
                        <span className="text-sm font-medium text-gray-700">{vendor.stores?.length || 0}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(vendor.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {vendor.status?.charAt(0).toUpperCase() + vendor.status?.slice(1) || "Unknown"}
                      </span>
                    </td>

                    {/* KYC */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${kycStatusStyle(vendor.kyc_status)}`}>
                        {vendor.kyc_status?.toUpperCase() || "N/A"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmtDate(vendor.created_at)}</td>

                    {/* Actions */}
                    <td className="relative pl-4 pr-5 py-3 text-right">
                      <span className="absolute right-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-green-400 to-green-300" />
                      <RowMenu
                        onView={() => { setSelectedVendor(vendor); setIsDrawerOpen(true); }}
                        onEdit={() => { setSelectedVendor(vendor); setIsEditModalOpen(true); }}
                        onStatusManage={() => { setSelectedVendor(vendor); setIsStatusModalOpen(true); }}
                        onKycManage={() => { setSelectedVendor(vendor); setIsKycModalOpen(true); }}
                        onPlanManage={() => { setSelectedVendor(vendor); setIsPlanModalOpen(true); }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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

      {/* Edit Modal */}
      <VendorModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedVendor(null); }}
        vendor={selectedVendor}
        onSave={handleSaveVendor}
      />

      {/* Status Management Modal */}
      <StatusManagementModal
        isOpen={isStatusModalOpen}
        onClose={() => { setIsStatusModalOpen(false); setSelectedVendor(null); }}
        vendor={selectedVendor}
        onSuccess={refetch}
      />

      {/* KYC Management Modal */}
      <KYCManagementModal
        isOpen={isKycModalOpen}
        onClose={() => { setIsKycModalOpen(false); setSelectedVendor(null); }}
        vendor={selectedVendor}
        onSuccess={refetch}
      />

      {/* Plan Management Modal */}
      <PlanManagementModal
        isOpen={isPlanModalOpen}
        onClose={() => { setIsPlanModalOpen(false); setSelectedVendor(null); }}
        vendor={selectedVendor}
        onSuccess={refetch}
      />

      {/* View Details Drawer */}
      <VendorDetailDrawer
        vendor={isDrawerOpen ? selectedVendor : null}
        onClose={() => { setIsDrawerOpen(false); setSelectedVendor(null); }}
      />
    </div>
  );
};

export default VendorList;