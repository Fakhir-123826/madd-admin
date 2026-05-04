import { useState } from "react";
import SalesOrdersChart from "../../component/SalesOrdersChart";
import TopSellingCategoriesChart from "../../component/TopSellingCategoriesChart";
import { 
  useGetDashboardQuery, 
  useGetDashboardStatisticsQuery,
  type ChartPeriod 
} from "../../app/api/DashboardSlices/DashboardApi";
import { FaSync, FaClock, FaCheckCircle, FaTimesCircle, FaTruck, FaSyncAlt } from "react-icons/fa";

const PERIOD_OPTIONS: { label: string; value: ChartPeriod }[] = [
    { label: "7D",  value: "7_days"  },
    { label: "30D", value: "30_days" },
    { label: "90D", value: "90_days" },
    { label: "1Y",  value: "year"    },
];

const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
);

const orderStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
        case "pending":    return "bg-yellow-100 text-yellow-700";
        case "processing": return "bg-blue-100 text-blue-700";
        case "shipped":    return "bg-purple-100 text-purple-700";
        case "completed":
        case "delivered":  return "bg-green-100 text-green-700";
        case "cancelled":  return "bg-red-100 text-red-700";
        default:           return "bg-gray-100 text-gray-500";
    }
};

const VendorDashBoard = () => {
  const [period, setPeriod] = useState<ChartPeriod>("30_days");
  
  const { data: dashboardData, isLoading, refetch } = useGetDashboardQuery();
  const { data: chartData, isFetching: isChartLoading } = useGetDashboardStatisticsQuery(period);

  const stats = dashboardData?.data?.statistics;
  const recentOrders = dashboardData?.data?.recent_orders ?? [];

  const statCards = [
    { title: "Total Revenue", value: `$${Number(stats?.financial.total_revenue ?? 0).toLocaleString()}`, sub: "Total sales amount" },
    { title: "Total Orders", value: stats?.orders.total ?? 0, sub: `${stats?.orders.today ?? 0} new today` },
    { title: "Active Products", value: stats?.orders.processing ?? 0, sub: "Orders in processing" }, // Reusing processing as a placeholder for active products if not in stats
    { title: "Delivered", value: stats?.orders.delivered ?? 0, sub: "Successfully delivered" },
    { title: "Pending", value: stats?.orders.pending ?? 0, sub: "Awaiting action" },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vendor Dashboard</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage your store and track performance.</p>
        </div>
        <button
          onClick={() => refetch()}
          className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-600 hover:border-teal-300 transition"
        >
          <FaSyncAlt className={`text-xs ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* OVERVIEW STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => <Skeleton key={i} className="h-24" />)
        ) : (
          statCards.map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{item.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{item.value}</p>
              <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
            </div>
          ))
        )}
      </div>

      {/* SALES CHART */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Sales & Orders</h3>
            <p className="text-xs text-gray-400">Performance trends over time</p>
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

        {isChartLoading ? (
          <Skeleton className="h-[320px] w-full" />
        ) : (
          <SalesOrdersChart data={chartData?.data} />
        )}
      </div>

      {/* TOP SELLING & RECENT ORDERS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOP SELLING */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Top Selling Products</h3>
          {isChartLoading ? (
            <Skeleton className="h-[320px] w-full" />
          ) : (
            <TopSellingCategoriesChart data={chartData?.data?.top_products} />
          )}
        </div>

        {/* ORDERS HISTORY */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
            <button className="text-xs text-teal-600 font-medium hover:underline">View All</button>
          </div>

          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/50">
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">Order</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Total</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}><td colSpan={4} className="px-6 py-4"><Skeleton className="h-8 w-full" /></td></tr>
                  ))
                ) : recentOrders.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400">No recent orders found.</td></tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-mono text-xs text-teal-600 font-bold">{order.magento_order_increment_id}</p>
                        <p className="text-[10px] text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-700 text-xs">{order.customer_firstname} {order.customer_lastname}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800">${Number(order.grand_total).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${orderStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashBoard;

