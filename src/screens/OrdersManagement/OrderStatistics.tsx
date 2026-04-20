// OrderStatistics.tsx
import { useState, useEffect } from "react";
import {
  FaChartLine, FaShoppingCart, FaDollarSign, FaWallet,
  FaSpinner, FaCheckCircle, FaTruck, FaBox, FaTimesCircle,
  FaSync, FaCalendarAlt, FaStore, FaClock, FaChartBar,
  FaArrowUp, FaArrowDown, FaEye, FaStar
} from "react-icons/fa";
import { useGetOrderStatisticsQuery } from "../../app/api/OrderSlices/OrderApi";

const formatCurrency = (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(num);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const formatHour = (hour: number) => {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
};

// Status Styles (matching OrderList)
const orderStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending": return "bg-yellow-100 text-yellow-700";
    case "processing": return "bg-blue-100 text-blue-700";
    case "shipped": return "bg-purple-100 text-purple-700";
    case "delivered":
    case "completed": return "bg-green-100 text-green-700";
    case "cancelled": return "bg-red-100 text-red-600";
    case "refunded": return "bg-gray-100 text-gray-600";
    default: return "bg-gray-100 text-gray-500";
  }
};

const paymentStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid": return "bg-green-100 text-green-700";
    case "pending": return "bg-yellow-100 text-yellow-600";
    case "refunded": return "bg-gray-100 text-gray-500";
    case "chargeback": return "bg-red-100 text-red-600";
    default: return "bg-gray-100 text-gray-500";
  }
};

export default function OrderStatistics() {
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: ""
  });
  const [activePeriod, setActivePeriod] = useState<string>("30_days");

  const { data, isLoading, isError, refetch } = useGetOrderStatisticsQuery();

  const stats = data?.data;

  // Calculate totals from daily_stats
  const totalOrders = stats?.daily_stats?.reduce((sum: number, day: any) => sum + (day.order_count || 0), 0) || 0;
  const totalRevenue = stats?.daily_stats?.reduce((sum: number, day: any) => sum + parseFloat(day.revenue || 0), 0) || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate trend (compare last 7 days with previous 7 days)
  const getTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: current > 0 ? 100 : 0, isUp: current > 0 };
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(change), isUp: change > 0 };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-teal-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <FaTimesCircle className="text-4xl text-red-500 mx-auto mb-3" />
        <p className="text-red-600 font-medium">Failed to load statistics</p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-4 py-2 bg-gradient-to-r from-teal-400 to-green-400 text-white rounded-xl text-sm font-medium hover:opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Order Analytics</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {stats?.start_date && stats?.end_date && 
              `${formatDate(stats.start_date)} - ${formatDate(stats.end_date)}`}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-xl p-1">
            {["7_days", "30_days", "90_days"].map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  activePeriod === period
                    ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {period === "7_days" ? "7D" : period === "30_days" ? "30D" : "90D"}
              </button>
            ))}
          </div>
          <button
            onClick={() => refetch()}
            className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 transition"
          >
            <FaSync className="text-xs" />
          </button>
        </div>
      </div>

      {/* Summary Cards - Matching OrderList gradient style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-400 to-green-400 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80 uppercase tracking-wide">Total Orders</p>
              <p className="text-3xl font-bold mt-1">{totalOrders}</p>
            </div>
            <FaShoppingCart className="text-3xl opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80 uppercase tracking-wide">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
            </div>
            <FaDollarSign className="text-3xl opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80 uppercase tracking-wide">Avg Order Value</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(avgOrderValue)}</p>
            </div>
            <FaChartLine className="text-3xl opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80 uppercase tracking-wide">Total Vendors</p>
              <p className="text-3xl font-bold mt-1">{stats?.top_vendors?.length || 0}</p>
            </div>
            <FaStore className="text-3xl opacity-50" />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily Orders Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaChartBar className="text-teal-500" />
            Daily Orders & Revenue
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {stats?.daily_stats?.map((day: any, idx: number) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg hover:shadow-md transition">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{formatDate(day.date)}</span>
                  <div className="flex gap-3">
                    <span className="text-xs text-teal-600 font-medium">
                      {day.order_count} order{day.order_count !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatCurrency(day.revenue)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-400 to-green-400 rounded-full"
                      style={{ width: `${Math.min((day.order_count / Math.max(...stats.daily_stats.map((d: any) => d.order_count))) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown - Using OrderList styles */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Order Status Breakdown</h3>
          <div className="space-y-3">
            {stats?.orders_by_status?.map((item: any) => (
              <div key={item.status}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={`px-2 py-0.5 rounded-full capitalize ${orderStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="text-gray-500 font-medium">{item.count} orders</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.status === 'completed' ? 'bg-green-500' :
                      item.status === 'processing' ? 'bg-blue-500' :
                      item.status === 'shipped' ? 'bg-purple-500' :
                      item.status === 'pending' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${(item.count / totalOrders) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Payment Status</h3>
          <div className="space-y-3">
            {stats?.orders_by_payment_status?.map((item: any) => {
              const percentage = totalOrders > 0 ? (item.count / totalOrders) * 100 : 0;
              return (
                <div key={item.payment_status}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`px-2 py-0.5 rounded-full capitalize ${paymentStatusStyle(item.payment_status)}`}>
                      {item.payment_status}
                    </span>
                    <span className="text-gray-500">{item.count} orders ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.payment_status === 'paid' ? 'bg-green-500' :
                        item.payment_status === 'pending' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaClock className="text-teal-500" />
            Orders by Hour
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 24 }, (_, hour) => {
              const data = stats?.hourly_distribution?.find((h: any) => h.hour === hour);
              const count = data?.count || 0;
              const maxCount = Math.max(...(stats?.hourly_distribution?.map((h: any) => h.count) || [1]));
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
              
              return (
                <div key={hour} className="text-center">
                  <div className="h-16 flex items-end mb-1">
                    <div 
                      className="w-full bg-gradient-to-t from-teal-400 to-green-400 rounded-t transition-all duration-300"
                      style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{formatHour(hour)}</p>
                  {count > 0 && (
                    <p className="text-xs font-medium text-teal-600">{count}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Vendors */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaStore className="text-teal-500" />
            Top Performing Vendors
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 text-xs font-medium text-gray-400 uppercase">Vendor</th>
                  <th className="text-left py-3 text-xs font-medium text-gray-400 uppercase">Orders</th>
                  <th className="text-left py-3 text-xs font-medium text-gray-400 uppercase">Revenue</th>
                  <th className="text-left py-3 text-xs font-medium text-gray-400 uppercase">Avg Order</th>
                </tr>
              </thead>
              <tbody>
                {stats?.top_vendors?.map((vendor: any, idx: number) => (
                  <tr key={vendor.vendor_id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-400 to-green-400 flex items-center justify-center text-white font-bold text-xs">
                          {vendor.vendor?.company_name?.charAt(0) || 'V'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{vendor.vendor?.company_name}</p>
                          <p className="text-xs text-gray-400">{vendor.vendor?.city}, {vendor.vendor?.country_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                        {vendor.order_count} orders
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="font-semibold text-gray-800">{formatCurrency(vendor.revenue)}</span>
                    </td>
                    <td className="py-3 text-gray-600">
                      {formatCurrency(vendor.revenue / vendor.order_count)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!stats?.top_vendors || stats.top_vendors.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              <FaStore className="text-3xl mx-auto mb-2 opacity-30" />
              <p className="text-sm">No vendor data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}