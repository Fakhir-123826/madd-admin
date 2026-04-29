// src/screens/Reports/PlatformReport.tsx
import { useState } from "react";
import {
    FaChartLine,
    FaShoppingCart,
    FaUsers,
    FaStore,
    FaDollarSign,
    FaDownload,
    FaSync,
} from "react-icons/fa";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { useGetPlatformReportQuery, useExportReportMutation } from "../../app/api/ReportSlices/ReportApi";

const COLORS = ["#14B8A6", "#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"];

const PlatformReport = () => {
    const [period, setPeriod] = useState<"day" | "week" | "month" | "quarter" | "year">("month");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [showCustomDate, setShowCustomDate] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    const { data, isLoading, refetch } = useGetPlatformReportQuery(
        showCustomDate && dateFrom && dateTo
            ? { date_from: dateFrom, date_to: dateTo }
            : { period }
    );
    const [exportReport] = useExportReportMutation();

    const report = data?.data;
    const meta = data?.meta;

    const handleExport = async () => {
        setExportLoading(true);
        try {
            const result = await exportReport({
                report_type: "platform",
                date_from: showCustomDate && dateFrom ? dateFrom : meta?.date_from || new Date().toISOString().split('T')[0],
                date_to: showCustomDate && dateTo ? dateTo : meta?.date_to || new Date().toISOString().split('T')[0],
            }).unwrap();
            
            // Download the file
            const blob = base64ToBlob(result.data.content, result.data.mime_type);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", result.data.filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setExportLoading(false);
        }
    };

    const base64ToBlob = (base64: string, mimeType: string) => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    };

    const statCards = [
        {
            title: "Total Revenue",
            value: `$${(report?.total_revenue || 0).toLocaleString()}`,
            icon: <FaDollarSign className="text-2xl" />,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
        },
        {
            title: "Total Orders",
            value: (report?.total_orders || 0).toLocaleString(),
            icon: <FaShoppingCart className="text-2xl" />,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            title: "Total Customers",
            value: (report?.total_customers || 0).toLocaleString(),
            icon: <FaUsers className="text-2xl" />,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
        {
            title: "Total Vendors",
            value: (report?.total_vendors || 0).toLocaleString(),
            icon: <FaStore className="text-2xl" />,
            color: "text-teal-600",
            bgColor: "bg-teal-100",
        },
        {
            title: "Average Order Value",
            value: `$${(report?.average_order_value || 0).toLocaleString()}`,
            icon: <FaChartLine className="text-2xl" />,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
        },
        {
            title: "Conversion Rate",
            value: `${(report?.conversion_rate || 0).toFixed(2)}%`,
            icon: <FaChartLine className="text-2xl" />,
            color: "text-pink-600",
            bgColor: "bg-pink-100",
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Date Range Picker */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => { setShowCustomDate(false); setPeriod("day"); }}
                        className={`px-3 py-1.5 rounded-lg text-sm ${!showCustomDate && period === "day" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                        Daily
                    </button>
                    <button
                        onClick={() => { setShowCustomDate(false); setPeriod("week"); }}
                        className={`px-3 py-1.5 rounded-lg text-sm ${!showCustomDate && period === "week" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => { setShowCustomDate(false); setPeriod("month"); }}
                        className={`px-3 py-1.5 rounded-lg text-sm ${!showCustomDate && period === "month" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => { setShowCustomDate(false); setPeriod("quarter"); }}
                        className={`px-3 py-1.5 rounded-lg text-sm ${!showCustomDate && period === "quarter" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                        Quarterly
                    </button>
                    <button
                        onClick={() => { setShowCustomDate(false); setPeriod("year"); }}
                        className={`px-3 py-1.5 rounded-lg text-sm ${!showCustomDate && period === "year" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                        Yearly
                    </button>
                    <button
                        onClick={() => setShowCustomDate(!showCustomDate)}
                        className={`px-3 py-1.5 rounded-lg text-sm ${showCustomDate ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                        Custom
                    </button>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => refetch()} className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500">
                        <FaSync className="text-sm" />
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={exportLoading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
                    >
                        {exportLoading ? "Exporting..." : <><FaDownload /> Export Report</>}
                    </button>
                </div>
            </div>

            {/* Custom Date Range */}
            {showCustomDate && (
                <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">From</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">To</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm"
                        />
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="mt-5 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm"
                    >
                        Apply
                    </button>
                </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className={`w-10 h-10 ${card.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                            <div className={card.color}>{card.icon}</div>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{card.title}</p>
                    </div>
                ))}
            </div>

            {/* Revenue Chart */}
            {report?.revenue_by_day && report.revenue_by_day.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={report.revenue_by_day}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#14B8A6" name="Revenue ($)" />
                            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3B82F6" name="Orders" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Top Vendors & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Vendors */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800">Top Performing Vendors</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {report?.top_vendors?.map((vendor, index) => (
                            <div key={vendor.vendor_id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{vendor.vendor_name}</p>
                                        <p className="text-xs text-gray-400">{vendor.orders} orders</p>
                                    </div>
                                </div>
                                <p className="font-semibold text-teal-600">${vendor.revenue.toLocaleString()}</p>
                            </div>
                        ))}
                        {(!report?.top_vendors || report.top_vendors.length === 0) && (
                            <div className="px-6 py-8 text-center text-gray-400">No data available</div>
                        )}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800">Top Selling Products</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {report?.top_products?.map((product, index) => (
                            <div key={product.product_id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <p className="font-medium text-gray-800">{product.product_name}</p>
                                    <p className="text-xs text-gray-400">{product.quantity_sold} units sold</p>
                                </div>
                                <p className="font-semibold text-teal-600">${product.revenue.toLocaleString()}</p>
                            </div>
                        ))}
                        {(!report?.top_products || report.top_products.length === 0) && (
                            <div className="px-6 py-8 text-center text-gray-400">No data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformReport;