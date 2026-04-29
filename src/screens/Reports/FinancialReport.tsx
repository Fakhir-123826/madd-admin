// src/screens/Reports/FinancialReport.tsx
import { useState } from "react";
import {
    FaDollarSign,
    FaCreditCard,
    FaMoneyBillWave,
    FaChartPie,
    FaDownload,
    FaSync,
} from "react-icons/fa";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useGetFinancialReportQuery, useExportReportMutation } from "../../app/api/ReportSlices/ReportApi";

const COLORS = ["#14B8A6", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

const FinancialReport = () => {
    const [period, setPeriod] = useState<"day" | "week" | "month" | "quarter" | "year">("month");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [showCustomDate, setShowCustomDate] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    const { data, isLoading, refetch } = useGetFinancialReportQuery(
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
                report_type: "financial",
                date_from: showCustomDate && dateFrom ? dateFrom : report?.period?.date_from || new Date().toISOString().split('T')[0],
                date_to: showCustomDate && dateTo ? dateTo : report?.period?.date_to || new Date().toISOString().split('T')[0],
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
                    <button onClick={() => { setShowCustomDate(false); setPeriod("day"); }} className={`px-3 py-1.5 rounded-lg text-sm ${!showCustomDate && period === "day" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600"}`}>Daily</button>
                    <button onClick={() => { setShowCustomDate(false); setPeriod("week"); }} className={`px-3 py-1.5 rounded-lg text-sm ${!showCustomDate && period === "week" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600"}`}>Weekly</button>
                    <button onClick={() => { setShowCustomDate(false); setPeriod("month"); }} className={`px-3 py-1.5 rounded-lg text-sm ${!showCustomDate && period === "month" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600"}`}>Monthly</button>
                    <button onClick={() => { setShowCustomDate(false); setPeriod("quarter"); }} className={`px-3 py-1.5 rounded-lg text-sm ${!showCustomDate && period === "quarter" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600"}`}>Quarterly</button>
                    <button onClick={() => { setShowCustomDate(false); setPeriod("year"); }} className={`px-3 py-1.5 rounded-lg text-sm ${!showCustomDate && period === "year" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600"}`}>Yearly</button>
                    <button onClick={() => setShowCustomDate(!showCustomDate)} className={`px-3 py-1.5 rounded-lg text-sm ${showCustomDate ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600"}`}>Custom</button>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => refetch()} className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500"><FaSync className="text-sm" /></button>
                    <button onClick={handleExport} disabled={exportLoading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50">
                        {exportLoading ? "Exporting..." : <><FaDownload /> Export</>}
                    </button>
                </div>
            </div>

            {/* Custom Date Range */}
            {showCustomDate && (
                <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl">
                    <div><label className="block text-xs text-gray-500 mb-1">From</label><input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" /></div>
                    <div><label className="block text-xs text-gray-500 mb-1">To</label><input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" /></div>
                    <button onClick={() => refetch()} className="mt-5 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm">Apply</button>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-5 border-l-4 border-teal-500">
                    <p className="text-xs text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-teal-600">{formatCurrency(report?.revenue?.total || 0)}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border-l-4 border-blue-500">
                    <p className="text-xs text-gray-500">Total Commission</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(report?.commission?.total || 0)}</p>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-5 border-l-4 border-red-500">
                    <p className="text-xs text-gray-500">Gateway Fees</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(report?.gateway_fees?.total || 0)}</p>
                </div>
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border-l-4 border-emerald-500">
                    <p className="text-xs text-gray-500">Net Profit</p>
                    <p className="text-2xl font-bold text-emerald-600">{formatCurrency(report?.net_profit || 0)}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Methods Pie Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Payment Method</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={report?.revenue?.by_payment_method} dataKey="total" nameKey="payment_method" cx="50%" cy="50%" outerRadius={100} label>
                                {report?.revenue?.by_payment_method?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Refund Reasons */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Refunds by Reason</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={report?.refunds?.by_reason}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="reason" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#EF4444" name="Amount" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Settlements Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Settlements by Vendor</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Settlements Count</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {report?.settlements?.by_vendor?.map((vendor) => (
                                <tr key={vendor.vendor_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-800">{vendor.vendor?.company_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 text-right">{vendor.count}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-teal-600 text-right">{formatCurrency(vendor.total)}</td>
                                </tr>
                            ))}
                            {(!report?.settlements?.by_vendor || report.settlements.by_vendor.length === 0) && (
                                <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No data available</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinancialReport;