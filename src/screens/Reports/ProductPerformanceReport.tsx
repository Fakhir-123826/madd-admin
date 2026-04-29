// src/screens/Reports/ProductPerformanceReport.tsx
import { useState } from "react";
import { FaSearch, FaSync, FaDownload, FaSort, FaStar } from "react-icons/fa";
import { useGetProductPerformanceReportQuery, useExportReportMutation } from "../../app/api/ReportSlices/ReportApi";

const ProductPerformanceReport = () => {
    const [period, setPeriod] = useState<"day" | "week" | "month" | "quarter" | "year">("month");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [showCustomDate, setShowCustomDate] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [limit, setLimit] = useState(50);
    const [sortBy, setSortBy] = useState<keyof any>("revenue");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [exportLoading, setExportLoading] = useState(false);

    const { data, isLoading, refetch } = useGetProductPerformanceReportQuery({
        ...(showCustomDate && dateFrom && dateTo ? { date_from: dateFrom, date_to: dateTo } : { period }),
        limit,
    });
    const [exportReport] = useExportReportMutation();

    const products = data?.data || [];
    const summary = data?.summary;

    const handleExport = async () => {
        setExportLoading(true);
        try {
            const result = await exportReport({
                report_type: "product_performance",
                date_from: showCustomDate && dateFrom ? dateFrom : summary?.date_from || new Date().toISOString().split('T')[0],
                date_to: showCustomDate && dateTo ? dateTo : summary?.date_to || new Date().toISOString().split('T')[0],
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

    const formatCurrency = (value?: number | null) => {
        return `$${Number(value || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
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
                    <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="px-3 py-2 rounded-xl border border-gray-200 text-sm">
                        <option value={20}>Top 20</option>
                        <option value={50}>Top 50</option>
                        <option value={100}>Top 100</option>
                    </select>
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                        <input type="text" placeholder="Search product..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm" />
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
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500">Total Products Sold</p>
                        <p className="text-2xl font-bold text-teal-600">{summary.total_products_sold.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(summary.total_revenue)}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500">Average Price</p>
                        <p className="text-2xl font-bold text-purple-600">{formatCurrency(summary.average_price)}</p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500">Top Product Revenue</p>
                        <p className="text-lg font-bold text-yellow-600">{summary.top_product?.name?.substring(0, 30)}...</p>
                        <p className="text-xs text-gray-400">
                            {formatCurrency(summary.top_product?.revenue)}
                        </p>
                    </div>
                </div>
            )}

            {/* Products Table */}
            <div className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">SKU</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Vendor</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold">Quantity Sold <SortIcon column="quantity_sold" /></th>
                                <th className="px-6 py-4 text-right text-sm font-semibold">Revenue <SortIcon column="revenue" /></th>
                                <th className="px-6 py-4 text-right text-sm font-semibold">Avg Price <SortIcon column="average_price" /></th>
                                <th className="px-6 py-4 text-right text-sm font-semibold">Orders <SortIcon column="order_count" /></th>
                                <th className="px-6 py-4 text-right text-sm font-semibold">Tax <SortIcon column="tax_collected" /></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedProducts.map((product, index) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-800">{product.name}</p>
                                            {index < 3 && <FaStar className="text-yellow-400 text-xs mt-1" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{product.sku}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.vendor_name}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-blue-600">{product.quantity_sold.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-teal-600">{formatCurrency(product.revenue)}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{formatCurrency(product.average_price)}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{product.order_count.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{formatCurrency(product.tax_collected)}</td>
                                </tr>
                            ))}
                            {sortedProducts.length === 0 && (
                                <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">No products found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductPerformanceReport;