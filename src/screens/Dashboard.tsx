import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    IoTrendingUp, IoTrendingDown,
} from "react-icons/io5";
import {
    FaUsers, FaStore, FaShoppingCart, FaDollarSign,
    FaClock, FaCheckCircle, FaTimesCircle, FaTruck,
    FaExclamationTriangle, FaArrowRight, FaSync,
} from "react-icons/fa";
import {
    useGetDashboardQuery,
    useGetDashboardStatisticsQuery,
    type ChartPeriod,
} from "../app/api/DashboardSlices/DashboardApi";
import SalesOrdersChart from "../component/SalesOrdersChart";
import TopSellingCategoriesChart from "../component/TopSellingCategoriesChart";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (val: string | number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(val));

const fmtDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

// ─── Order Status ─────────────────────────────────────────────────────────────

const orderStatusStyle = (status: string) => {
    switch (status) {
        case "pending":    return { cls: "bg-yellow-100 text-yellow-600", icon: <FaClock className="text-xs" /> };
        case "processing": return { cls: "bg-blue-100 text-blue-600",    icon: <FaSync className="text-xs animate-spin" /> };
        case "shipped":    return { cls: "bg-purple-100 text-purple-600", icon: <FaTruck className="text-xs" /> };
        case "completed":
        case "delivered":  return { cls: "bg-green-100 text-green-600",   icon: <FaCheckCircle className="text-xs" /> };
        case "cancelled":  return { cls: "bg-red-100 text-red-500",       icon: <FaTimesCircle className="text-xs" /> };
        default:           return { cls: "bg-gray-100 text-gray-500",     icon: null };
    }
};

const vendorStatusStyle = (status: string) => {
    switch (status) {
        case "active":    return "bg-green-100 text-green-600";
        case "pending":   return "bg-yellow-100 text-yellow-600";
        case "suspended": return "bg-red-100 text-red-500";
        default:          return "bg-gray-100 text-gray-500";
    }
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({
    title, value, sub, icon, isPositive, trend,
}: {
    title: string;
    value: string | number;
    sub?: string;
    icon: React.ReactNode;
    isPositive?: boolean;
    trend?: string;
}) => (
    <div className="bg-white rounded-2xl shadow-sm p-5 relative overflow-hidden group border border-gray-100 hover:shadow-md transition-shadow">
        {/* Right gradient bar */}
        <span className="absolute right-0 top-0 h-full w-1.5 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-2xl" />
        {/* Bottom gradient bar */}
        <span className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-teal-400 to-green-400" />
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-teal-100/40 to-green-100/40 rounded-full blur-2xl group-hover:from-teal-200/50 group-hover:to-green-200/50 transition-all duration-500" />

        <div className="relative z-10 flex items-start justify-between mb-3">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">{title}</p>
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center text-white shadow-sm">
                {icon}
            </div>
        </div>

        <p className="relative z-10 text-2xl font-bold text-gray-800 mb-2">{value}</p>

        {trend !== undefined && isPositive !== undefined && (
            <div className={`relative z-10 flex items-center gap-1 text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {isPositive ? <IoTrendingUp className="text-sm" /> : <IoTrendingDown className="text-sm" />}
                <span className="font-bold">{trend}</span>
                {sub && <span className="text-gray-400 font-normal ml-1">{sub}</span>}
            </div>
        )}
        {!trend && sub && <p className="relative z-10 text-xs text-gray-400">{sub}</p>}
    </div>
);

// ─── Mini Stat ────────────────────────────────────────────────────────────────

const MiniStat = ({ label, value, color }: { label: string; value: number | string; color: string }) => (
    <div className={`rounded-xl px-3 py-2 flex items-center justify-between ${color}`}>
        <span className="text-xs font-medium">{label}</span>
        <span className="text-sm font-bold">{value}</span>
    </div>
);

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader = ({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) => (
    <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {action && (
            <button
                onClick={onAction}
                className="flex items-center gap-1.5 text-xs text-teal-600 font-medium hover:text-teal-700 transition"
            >
                {action} <FaArrowRight className="text-[10px]" />
            </button>
        )}
    </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
);

// ─── Dashboard Component ──────────────────────────────────────────────────────

const PERIOD_OPTIONS: { label: string; value: ChartPeriod }[] = [
    { label: "7D",  value: "7_days"  },
    { label: "30D", value: "30_days" },
    { label: "90D", value: "90_days" },
    { label: "1Y",  value: "year"    },
];

const Dashboard = () => {
    const navigate  = useNavigate();
    const [period, setPeriod] = useState<ChartPeriod>("30_days");

    const { data, isLoading, isError, refetch } = useGetDashboardQuery();
    const { data: chartData } = useGetDashboardStatisticsQuery(period);

    const stats   = data?.data?.statistics;
    const orders  = data?.data?.recent_orders  ?? [];
    const vendors = data?.data?.recent_vendors ?? [];

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="bg-white/70 rounded-xl p-5 space-y-6">

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Welcome back — here's what's happening today.</p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-600 hover:border-teal-300 transition"
                >
                    <FaSync className="text-xs" />
                </button>
            </div>

            {/* ── Error ── */}
            {isError && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-sm text-red-500">
                    <FaExclamationTriangle />
                    Failed to load dashboard data. Please refresh.
                </div>
            )}

            {/* ══════════════════════════════════════
                SECTION 1 — Primary Stats (4 cards)
            ══════════════════════════════════════ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                    [...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)
                ) : (
                    <>
                        <StatCard
                            title="Total Revenue"
                            value={fmt(stats?.financial.total_revenue ?? 0)}
                            icon={<FaDollarSign className="text-xs" />}
                            sub="commission earned"
                            trend={`$${Number(stats?.financial.total_commission ?? 0).toFixed(0)}`}
                            isPositive
                        />
                        <StatCard
                            title="Total Orders"
                            value={stats?.orders.total ?? 0}
                            icon={<FaShoppingCart className="text-xs" />}
                            sub={`${stats?.orders.today ?? 0} new today`}
                            trend={`${stats?.orders.processing ?? 0} processing`}
                            isPositive={(stats?.orders.processing ?? 0) > 0}
                        />
                        <StatCard
                            title="Active Vendors"
                            value={stats?.vendors.active ?? 0}
                            icon={<FaStore className="text-xs" />}
                            sub={`${stats?.vendors.pending ?? 0} pending approval`}
                            trend={`${stats?.vendors.kyc_pending ?? 0} KYC pending`}
                            isPositive={false}
                        />
                        <StatCard
                            title="Total Users"
                            value={stats?.users.total ?? 0}
                            icon={<FaUsers className="text-xs" />}
                            sub={`${stats?.users.active ?? 0} active users`}
                            trend={`${stats?.users.new_today ?? 0} new today`}
                            isPositive={(stats?.users.new_today ?? 0) >= 0}
                        />
                    </>
                )}
            </div>

            {/* ══════════════════════════════════════
                SECTION 2 — Detailed breakdown row
            ══════════════════════════════════════ */}
            {!isLoading && stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Orders Breakdown */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-4">Orders Breakdown</p>
                        <div className="space-y-2">
                            <MiniStat label="Pending"    value={stats.orders.pending}    color="bg-yellow-50 text-yellow-700" />
                            <MiniStat label="Processing" value={stats.orders.processing} color="bg-blue-50 text-blue-700" />
                            <MiniStat label="Shipped"    value={stats.orders.shipped}    color="bg-purple-50 text-purple-700" />
                            <MiniStat label="Delivered"  value={stats.orders.delivered}  color="bg-green-50 text-green-700" />
                            <MiniStat label="Cancelled"  value={stats.orders.cancelled}  color="bg-red-50 text-red-600" />
                        </div>
                    </div>

                    {/* Vendor Breakdown */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-4">Vendors Breakdown</p>
                        <div className="space-y-2">
                            <MiniStat label="Total"     value={stats.vendors.total}     color="bg-gray-50 text-gray-700" />
                            <MiniStat label="Active"    value={stats.vendors.active}    color="bg-green-50 text-green-700" />
                            <MiniStat label="Pending"   value={stats.vendors.pending}   color="bg-yellow-50 text-yellow-700" />
                            <MiniStat label="Suspended" value={stats.vendors.suspended} color="bg-red-50 text-red-600" />
                            <MiniStat label="KYC Pending" value={stats.vendors.kyc_pending} color="bg-orange-50 text-orange-600" />
                        </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-4">Financials</p>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Total Revenue</p>
                                <p className="text-lg font-bold text-gray-800">{fmt(stats.financial.total_revenue)}</p>
                            </div>
                            <div className="h-px bg-gray-100" />
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Total Commission</p>
                                <p className="text-base font-semibold text-teal-600">{fmt(stats.financial.total_commission)}</p>
                            </div>
                            <div className="h-px bg-gray-100" />
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Pending Settlements</p>
                                    <p className="text-sm font-bold text-yellow-600">{fmt(stats.financial.pending_settlements)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Total Paid</p>
                                    <p className="text-sm font-bold text-green-600">{fmt(stats.financial.total_paid)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════
                SECTION 3 — Sales Chart
            ══════════════════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-base font-semibold text-gray-800">Sales & Orders</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Revenue and order volume over time</p>
                    </div>
                    <div className="flex gap-1.5">
                        {PERIOD_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setPeriod(opt.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                    period === opt.value
                                        ? "bg-gradient-to-r from-teal-400 to-green-400 text-white shadow"
                                        : "border border-gray-200 text-gray-500 hover:border-teal-300 hover:text-teal-600"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Your existing chart component — passes chartData if needed */}
                <SalesOrdersChart data={chartData?.data} />
            </div>

            {/* ══════════════════════════════════════
                SECTION 4 — Recent Orders
            ══════════════════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <SectionHeader
                    title="Recent Orders"
                    action="View All"
                    onAction={() => navigate("/orders")}
                />

                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14" />)}
                    </div>
                ) : orders.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No recent orders.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-left">
                                    <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide px-3">Order</th>
                                    <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide px-3">Customer</th>
                                    <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide px-3">Vendor</th>
                                    <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide px-3">Total</th>
                                    <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide px-3">Status</th>
                                    <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide px-3">Date</th>
                                    <th className="pb-2 px-3" />
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => {
                                    const { cls, icon } = orderStatusStyle(order.status);
                                    return (
                                        <tr key={order.id} className="bg-gray-50/60 hover:bg-teal-50/30 transition rounded-xl group">
                                            <td className="px-3 py-3 rounded-l-xl">
                                                <p className="font-mono text-xs text-teal-600 font-semibold">{order.magento_order_increment_id}</p>
                                                <p className="text-xs text-gray-400 capitalize">{order.source}</p>
                                            </td>
                                            <td className="px-3 py-3">
                                                <p className="font-medium text-gray-700 text-xs">{order.customer_firstname} {order.customer_lastname}</p>
                                                <p className="text-xs text-gray-400">{order.customer_email}</p>
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xs flex-shrink-0">
                                                        {(order.vendor?.company_name ?? "V").charAt(0)}
                                                    </div>
                                                    <p className="text-xs text-gray-600">{order.vendor?.company_name ?? "—"}</p>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3">
                                                <p className="font-bold text-gray-800">{fmt(order.grand_total)}</p>
                                                <p className="text-xs text-gray-400">Commission: {fmt(order.commission_amount)}</p>
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${cls}`}>
                                                    {icon}
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-xs text-gray-400">
                                                {fmtDate(order.created_at)}
                                            </td>
                                            <td className="px-3 py-3 rounded-r-xl text-right">
                                                <button
                                                    onClick={() => navigate(`/orders/${order.uuid}`)}
                                                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white text-xs font-medium hover:shadow-md transition opacity-0 group-hover:opacity-100"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ══════════════════════════════════════
                SECTION 5 — Recent Vendors
            ══════════════════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <SectionHeader
                    title="Recent Vendors"
                    action="View All"
                    onAction={() => navigate("/vendors")}
                />

                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14" />)}
                    </div>
                ) : vendors.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No recent vendors.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-left">
                                    <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide px-3">Vendor</th>
                                    <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide px-3">Contact</th>
                                    <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide px-3">Location</th>
                                    <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide px-3">Status</th>
                                    <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide px-3">KYC</th>
                                    <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide px-3">Joined</th>
                                    <th className="pb-2 px-3" />
                                </tr>
                            </thead>
                            <tbody>
                                {vendors.map(vendor => (
                                    <tr key={vendor.id} className="bg-gray-50/60 hover:bg-teal-50/30 transition group">
                                        <td className="px-3 py-3 rounded-l-xl">
                                            <div className="flex items-center gap-3">
                                                {vendor.user?.avatar_url ? (
                                                    <img
                                                        src={vendor.user.avatar_url}
                                                        alt={vendor.company_name}
                                                        className="h-8 w-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-sm">
                                                        {vendor.company_name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-xs">{vendor.company_name}</p>
                                                    <p className="text-xs text-gray-400">{vendor.company_slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <p className="text-xs text-gray-700">{vendor.user?.email ?? "—"}</p>
                                            <p className="text-xs text-gray-400">{vendor.user?.phone ?? "—"}</p>
                                        </td>
                                        <td className="px-3 py-3">
                                            <p className="text-xs text-gray-600">{vendor.city ?? "—"}</p>
                                            <p className="text-xs text-gray-400">{vendor.country_code}</p>
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${vendorStatusStyle(vendor.status)}`}>
                                                {vendor.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${vendorStatusStyle(vendor.kyc_status)}`}>
                                                {vendor.kyc_status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-xs text-gray-400">
                                            {fmtDate(vendor.created_at)}
                                        </td>
                                        <td className="px-3 py-3 rounded-r-xl text-right">
                                            <button
                                                onClick={() => navigate(`/vendors/${vendor.uuid}`)}
                                                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white text-xs font-medium hover:shadow-md transition opacity-0 group-hover:opacity-100"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ══════════════════════════════════════
                SECTION 6 — Top Selling Categories
            ══════════════════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <SectionHeader title="Top Selling Categories" />
                <TopSellingCategoriesChart data={chartData?.data?.top_products} />
            </div>

        </div>
    );
};

export default Dashboard;