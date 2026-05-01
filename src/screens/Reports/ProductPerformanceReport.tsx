// src/screens/Reports/ProductPerformanceReport.tsx

import { useState } from "react";
import { FaSearch, FaSync, FaDownload, FaSort, FaStar } from "react-icons/fa";
import {
    useGetProductPerformanceReportQuery,
    useExportReportMutation,
} from "../../app/api/ReportSlices/ReportApi";

//  Proper Types
type Product = {
    id: number;
    name: string;
    sku: string;
    vendor_name: string;
    quantity_sold: number;
    revenue: number;
    average_price: number;
    order_count: number;
    tax_collected: number;
};

type Summary = {
    total_products_sold: number;
    total_revenue: number;
    average_price: number;
    date_from?: string;
    date_to?: string;
    top_product?: {
        name?: string;
        revenue?: number;
    };
};

type SortableKeys =
    | "quantity_sold"
    | "revenue"
    | "average_price"
    | "order_count"
    | "tax_collected";

const ProductPerformanceReport = () => {
    const [period, setPeriod] = useState<"day" | "week" | "month" | "quarter" | "year">("month");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [showCustomDate, setShowCustomDate] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [limit, setLimit] = useState(50);
    const [sortBy, setSortBy] = useState<SortableKeys>("revenue");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [exportLoading, setExportLoading] = useState(false);

    const { data, isLoading, refetch } = useGetProductPerformanceReportQuery({
        ...(showCustomDate && dateFrom && dateTo
            ? { date_from: dateFrom, date_to: dateTo }
            : { period }),
        limit,
    });

    const [exportReport] = useExportReportMutation();

    const products: Product[] = data?.data || [];
    const summary: Summary | undefined = data?.summary;

    //  Safe currency formatter
    const formatCurrency = (value?: number | null) => {
        return `$${Number(value ?? 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    //  Export handler
    const handleExport = async () => {
        setExportLoading(true);
        try {
            const result = await exportReport({
                report_type: "product_performance",
                date_from:
                    showCustomDate && dateFrom
                        ? dateFrom
                        : summary?.date_from || new Date().toISOString().split("T")[0],
                date_to:
                    showCustomDate && dateTo
                        ? dateTo
                        : summary?.date_to || new Date().toISOString().split("T")[0],
            }).unwrap();

            const blob = base64ToBlob(result.data.content, result.data.mime_type);
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = result.data.filename;
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

    //  Base64 → Blob
    const base64ToBlob = (base64: string, mimeType: string) => {
        const byteCharacters = atob(base64);
        const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
        return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
    };

    //  Filter
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //  Safe Sort
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const aVal = a[sortBy] ?? 0;
        const bVal = b[sortBy] ?? 0;

        if (typeof aVal === "number" && typeof bVal === "number") {
            return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }

        return sortOrder === "asc"
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal));
    });

    const handleSort = (column: SortableKeys) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("desc");
        }
    };

    const SortIcon = ({ column }: { column: SortableKeys }) => (
        <button
            onClick={() => handleSort(column)}
            className="ml-1 text-gray-400 hover:text-gray-600"
        >
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

                {/* Filters */}
                <div className="flex gap-2">
                    {["day", "week", "month", "quarter", "year"].map((p) => (
                        <button
                            key={p}
                            onClick={() => {
                                setShowCustomDate(false);
                                setPeriod(p as any);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-sm ${
                                !showCustomDate && period === p
                                    ? "bg-teal-500 text-white"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        onClick={() => setShowCustomDate(!showCustomDate)}
                        className={`px-3 py-1.5 rounded-lg text-sm ${
                            showCustomDate ? "bg-teal-500 text-white" : "bg-gray-100"
                        }`}
                    >
                        Custom
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="px-3 py-2 rounded-xl border text-sm"
                    >
                        <option value={20}>Top 20</option>
                        <option value={50}>Top 50</option>
                        <option value={100}>Top 100</option>
                    </select>

                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-xl border text-sm"
                        />
                    </div>

                    <button onClick={refetch} className="h-10 w-10 border rounded-xl flex items-center justify-center">
                        <FaSync />
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={exportLoading}
                        className="px-4 py-2 bg-teal-500 text-white rounded-xl"
                    >
                        {exportLoading ? "Exporting..." : "Export"}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-teal-500 text-white">
                        <tr>
                            <th className="p-3 text-left">Product</th>
                            <th className="p-3">Qty <SortIcon column="quantity_sold" /></th>
                            <th className="p-3">Revenue <SortIcon column="revenue" /></th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedProducts.map((p, i) => (
                            <tr key={p.id} className="border-t">
                                <td className="p-3">
                                    {p.name}
                                    {i < 3 && <FaStar className="inline ml-2 text-yellow-400" />}
                                </td>
                                <td className="p-3 text-center">{p.quantity_sold.toLocaleString()}</td>
                                <td className="p-3 text-center">{formatCurrency(p.revenue)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductPerformanceReport;