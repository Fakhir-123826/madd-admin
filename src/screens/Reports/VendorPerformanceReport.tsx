// src/screens/Reports/VendorPerformanceReport.tsx
import { useState } from "react";
import { FaSearch, FaSync, FaDownload, FaSort, FaStar } from "react-icons/fa";
import { useGetVendorPerformanceReportQuery, useExportReportMutation } from "../../app/api/ReportSlices/ReportApi";

const VendorPerformanceReport = () => {
    const [period, setPeriod] = useState<"day" | "week" | "month" | "quarter" | "year">("month");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [showCustomDate, setShowCustomDate] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<keyof any>("revenue");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [exportLoading, setExportLoading] = useState(false);

    const { data, isLoading, refetch } = useGetVendorPerformanceReportQuery(
        showCustomDate && dateFrom && dateTo
            ? { date_from: dateFrom, date_to: dateTo }
            : { period }
    );
    const [exportReport] = useExportReportMutation();

    const vendors = data?.data || [];
    const meta = data?.meta;

    const handleExport = async () => {
        setExportLoading(true);
        try {
            const result = await exportReport({
                report_type: "vendor_performance",
                date_from: showCustomDate && dateFrom ? dateFrom : meta?.date_from || new Date().toISOString().split('T')[0],
                date_to: showCustomDate && dateTo ? dateTo : meta?.date_to || new Date().toISOString().split('T')[0],
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

    const filteredVendors = vendors.filter((vendor) =>
        vendor.vendor.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedVendors = [...filteredVendors].sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
    });

    const handleSort = (column: keyof any) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("desc");
        }
    };

    const SortIcon = ({ column }: { column: keyof any }) => (
        <button onClick={() => handleSort(column)} className="ml-1 text-gray-400 hover:text-gray-600">
            <FaSort className="text-xs" />
        </button>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
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
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                        <input type="text" placeholder="Search vendor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm" />
                    </div>
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

            {/* Summary Stats */}
            {meta && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500">Total Vendors</p>
                        <p className="text-2xl font-bold text-teal-600">{meta.total_vendors}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(meta.total_revenue)}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500">Total Commission</p>
                        <p className="text-2xl font-bold text-purple-600">{formatCurrency(meta.total_commission)}</p>
                    </div>
                </div>
            )}

            {/* Vendors Table */}
            <div className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Vendor</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold">Revenue <SortIcon column="revenue" /></th>
                                <th className="px-6 py-4 text-right text-sm font-semibold">Orders <SortIcon column="order_count" /></th>
                                <th className="px-6 py-4 text-right text-sm font-semibold">Avg Order Value <SortIcon column="average_order_value" /></th>
                                <th className="px-6 py-4 text-right text-sm font-semibold">Commission <SortIcon column="commission" /></th>
                                <th className="px-6 py-4 text-right text-sm font-semibold">Products Sold <SortIcon column="products_sold" /></th>
                                <th className="px-6 py-4 text-right text-sm font-semibold">Settlement Paid <SortIcon column="settlement_paid" /></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedVendors.map((vendor) => (
                                <tr key={vendor.vendor.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-800">{vendor.vendor.company_name}</p>
                                            <p className="text-xs text-gray-400">{vendor.vendor.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-teal-600">{formatCurrency(vendor.revenue)}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{vendor.order_count.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{formatCurrency(vendor.average_order_value)}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{formatCurrency(vendor.commission)}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{vendor.products_sold.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-emerald-600">{formatCurrency(vendor.settlement_paid)}</td>
                                </tr>
                            ))}
                            {sortedVendors.length === 0 && (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No vendors found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorPerformanceReport;