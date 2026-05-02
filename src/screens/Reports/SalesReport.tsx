// src/screens/Reports/SalesReport.tsx
import { useState } from "react";
import {
    FaChartLine,
    FaShoppingCart,
    FaDollarSign,
    FaDownload,
    FaSync,
    FaCalendar,
    FaChartBar,
    FaChartPie,
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
    AreaChart,
    Area,
} from "recharts";
import { useGetSalesReportQuery, useExportReportMutation } from "../../app/api/ReportSlices/ReportApi";

const COLORS = ["#14B8A6", "#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#06B6D4", "#EC4899"];

const SalesReport = () => {
    const [period, setPeriod] = useState<"day" | "week" | "month" | "quarter" | "year">("month");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [showCustomDate, setShowCustomDate] = useState(false);
    const [chartType, setChartType] = useState<"line" | "bar" | "area">("line");
    const [exportLoading, setExportLoading] = useState(false);

    const { data, isLoading, refetch } = useGetSalesReportQuery(
        showCustomDate && dateFrom && dateTo
            ? { date_from: dateFrom, date_to: dateTo }
            : { period }
    );
    const [exportReport] = useExportReportMutation();

    const report = data?.data;

    const handleExport = async () => {
        setExportLoading(true);
        try {
            const result = await exportReport({
                report_type: "sales",
                date_from: showCustomDate && dateFrom ? dateFrom : report?.date_from || new Date().toISOString().split('T')[0],
                date_to: showCustomDate && dateTo ? dateTo : report?.date_to || new Date().toISOString().split('T')[0],
            }).unwrap();
            
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

    const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

    // Calculate totals from daily sales
    const totalSales = report?.daily_sales?.reduce((sum, day) => sum + day.sales, 0) || 0;
    const totalOrders = report?.daily_sales?.reduce((sum, day) => sum + day.orders, 0) || 0;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    const statCards = [
        {
            title: "Total Sales",
            value: formatCurrency(totalSales),
            icon: <FaDollarSign className="text-2xl" />,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
            trend: "+12.5%",
        },
        {
            title: "Total Orders",
            value: totalOrders.toLocaleString(),
            icon: <FaShoppingCart className="text-2xl" />,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            trend: "+8.2%",
        },
        {
            title: "Average Order Value",
            value: formatCurrency(averageOrderValue),
            icon: <FaChartLine className="text-2xl" />,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
            trend: "+3.1%",
        },
    ];

    const renderChart = () => {
        const data = report?.daily_sales || [];
        
        if (chartType === "line") {
            return (
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value, name) => name === "sales" ? formatCurrency(value as number) : value} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#14B8A6" name="Sales ($)" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3B82F6" name="Orders" strokeWidth={2} />
                </LineChart>
            );
        }
        
        if (chartType === "bar") {
            return (
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => name === "sales" ? formatCurrency(value as number) : value} />
                    <Legend />
                    <Bar dataKey="sales" fill="#14B8A6" name="Sales ($)" />
                    <Bar dataKey="orders" fill="#3B82F6" name="Orders" />
                </BarChart>
            );
        }
        
        return (
            <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Area type="monotone" dataKey="sales" stackId="1" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.3} name="Sales ($)" />
            </AreaChart>
        );
    };

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
                    {/* Chart Type Selector */}
                    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setChartType("line")}
                            className={`px-3 py-1.5 rounded-md text-sm transition ${chartType === "line" ? "bg-white shadow-sm text-teal-600" : "text-gray-500"}`}
                        >
                            <FaChartLine className="inline mr-1" /> Line
                        </button>
                        <button
                            onClick={() => setChartType("bar")}
                            className={`px-3 py-1.5 rounded-md text-sm transition ${chartType === "bar" ? "bg-white shadow-sm text-teal-600" : "text-gray-500"}`}
                        >
                            <FaChartBar className="inline mr-1" /> Bar
                        </button>
                        <button
                            onClick={() => setChartType("area")}
                            className={`px-3 py-1.5 rounded-md text-sm transition ${chartType === "area" ? "bg-white shadow-sm text-teal-600" : "text-gray-500"}`}
                        >
                            <FaChartLine className="inline mr-1" /> Area
                        </button>
                    </div>
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
                <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2">
                        <FaCalendar className="text-gray-400" />
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">From</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="px-3 py-2 border rounded-lg text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCalendar className="text-gray-400" />
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">To</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="px-3 py-2 border rounded-lg text-sm"
                            />
                        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                                <div className={card.color}>{card.icon}</div>
                            </div>
                            {card.trend && (
                                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                    ↑ {card.trend}
                                </span>
                            )}
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{card.title}</p>
                    </div>
                ))}
            </div>

            {/* Sales Trend Chart */}
            {report?.daily_sales && report.daily_sales.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Sales Trend</h3>
                        <div className="flex gap-4 text-xs">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-teal-500" />
                                <span className="text-gray-500">Sales ($)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-gray-500">Orders</span>
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        {renderChart()}
                    </ResponsiveContainer>
                </div>
            )}

            {/* Weekly & Monthly Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Sales */}
                {report?.weekly_sales && report.weekly_sales.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Sales Summary</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={report.weekly_sales}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                <Legend />
                                <Bar dataKey="sales" fill="#14B8A6" name="Sales ($)" />
                                <Bar dataKey="orders" fill="#3B82F6" name="Orders" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Monthly Sales */}
                {report?.monthly_sales && report.monthly_sales.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales Summary</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={report.monthly_sales}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                <Legend />
                                <Area type="monotone" dataKey="sales" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.3} name="Sales ($)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Sales by Category */}
            {report?.by_category && report.by_category.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaChartPie className="text-teal-500" /> Sales by Category
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={report.by_category}
                                    dataKey="sales"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {report.by_category.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-3">
                            {report.by_category.map((category, index) => (
                                <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="text-sm text-gray-700">{category.category}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800">{formatCurrency(category.sales)}</p>
                                        <p className="text-xs text-gray-400">{category.percentage.toFixed(1)}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Daily Sales Table */}
            {report?.daily_sales && report.daily_sales.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-800">Daily Sales Breakdown</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold">Sales ($)</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold">Orders</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold">Average Order</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold">Growth</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {report.daily_sales.map((day, index) => {
                                    const prevDay = index > 0 ? report.daily_sales[index - 1] : null;
                                    const growth = prevDay ? ((day.sales - prevDay.sales) / prevDay.sales * 100) : 0;
                                    return (
                                        <tr key={day.date} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">{day.date}</td>
                                            <td className="px-6 py-4 text-right font-semibold text-teal-600">{formatCurrency(day.sales)}</td>
                                            <td className="px-6 py-4 text-right text-gray-600">{day.orders.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right text-gray-600">{formatCurrency(day.average_order)}</td>
                                            <td className="px-6 py-4 text-center">
                                                {index > 0 && (
                                                    <span className={`text-xs font-medium ${growth >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                                        {growth >= 0 ? "↑" : "↓"} {Math.abs(growth).toFixed(1)}%
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* No Data Message */}
            {(!report?.daily_sales || report.daily_sales.length === 0) && (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <FaShoppingCart className="text-4xl mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-400">No sales data available for the selected period</p>
                </div>
            )}
        </div>
    );
};

export default SalesReport;