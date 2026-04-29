// src/screens/Reports/ExportReport.tsx
import { useState } from "react";
import { FaDownload, FaFileExcel, FaFileCsv, FaCalendar, FaStore, FaChartLine } from "react-icons/fa";
import { useExportReportMutation } from "../../app/api/ReportSlices/ReportApi";

const ExportReport = () => {
    const [reportType, setReportType] = useState<"platform" | "financial" | "vendor_performance" | "product_performance" | "customer_report">("platform");
    const [format, setFormat] = useState<"csv" | "excel">("csv");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [isExporting, setIsExporting] = useState(false);
    const [exportResult, setExportResult] = useState<{ filename: string; size: number } | null>(null);

    const [exportReport] = useExportReportMutation();

    const reportTypes = [
        { value: "platform", label: "Platform Report", icon: <FaChartLine className="text-teal-500" />, description: "Overall platform performance metrics" },
        { value: "financial", label: "Financial Report", icon: <FaChartLine className="text-blue-500" />, description: "Revenue, commissions, fees, and profit analysis" },
        { value: "vendor_performance", label: "Vendor Performance", icon: <FaStore className="text-purple-500" />, description: "Vendor sales, orders, and settlement data" },
        { value: "product_performance", label: "Product Performance", icon: <FaChartLine className="text-orange-500" />, description: "Top selling products and revenue analysis" },
        { value: "customer_report", label: "Customer Report", icon: <FaChartLine className="text-pink-500" />, description: "Customer acquisition and behavior analysis" },
    ];

    const handleExport = async () => {
        if (!dateFrom || !dateTo) {
            alert("Please select both start and end dates");
            return;
        }

        setIsExporting(true);
        setExportResult(null);

        try {
            const result = await exportReport({
                report_type: reportType,
                format,
                date_from: dateFrom,
                date_to: dateTo,
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

            setExportResult({
                filename: result.data.filename,
                size: Math.round(blob.size / 1024),
            });
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export report. Please try again.");
        } finally {
            setIsExporting(false);
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

    const getToday = () => new Date().toISOString().split('T')[0];
    const getLastMonth = () => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString().split('T')[0];
    };

    const setLastMonth = () => {
        setDateFrom(getLastMonth());
        setDateTo(getToday());
    };

    const setLastQuarter = () => {
        const date = new Date();
        date.setMonth(date.getMonth() - 3);
        setDateFrom(date.toISOString().split('T')[0]);
        setDateTo(getToday());
    };

    const setLastYear = () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        setDateFrom(date.toISOString().split('T')[0]);
        setDateTo(getToday());
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Export Reports</h2>
                <p className="text-sm text-gray-500 mt-1">Export platform data and analytics to CSV or Excel format</p>
            </div>

            {/* Report Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTypes.map((type) => (
                    <div
                        key={type.value}
                        onClick={() => setReportType(type.value as any)}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${reportType === type.value ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-300"}`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                                {type.icon}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{type.label}</p>
                                <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${reportType === type.value ? "border-teal-500 bg-teal-500" : "border-gray-300"}`}>
                                {reportType === type.value && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Date Range Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FaCalendar className="text-teal-500" /> Select Date Range
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-400"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={setLastMonth} className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">Last 30 Days</button>
                        <button onClick={setLastQuarter} className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">Last Quarter</button>
                        <button onClick={setLastYear} className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">Last Year</button>
                    </div>
                </div>
            </div>

            {/* Export Format */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">Export Format</h3>
                </div>
                <div className="p-6">
                    <div className="flex gap-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                value="csv"
                                checked={format === "csv"}
                                onChange={() => setFormat("csv")}
                                className="w-4 h-4 text-teal-500"
                            />
                            <FaFileCsv className="text-green-600 text-xl" />
                            <div>
                                <p className="font-medium text-gray-800">CSV Format</p>
                                <p className="text-xs text-gray-400">Comma-separated values, compatible with Excel</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                value="excel"
                                checked={format === "excel"}
                                onChange={() => setFormat("excel")}
                                className="w-4 h-4 text-teal-500"
                            />
                            <FaFileExcel className="text-green-700 text-xl" />
                            <div>
                                <p className="font-medium text-gray-800">Excel Format</p>
                                <p className="text-xs text-gray-400">Native Excel format (.xlsx)</p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Export Result */}
            {exportResult && (
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-800">Export Completed!</p>
                            <p className="text-xs text-green-600 mt-1">File: {exportResult.filename}</p>
                            <p className="text-xs text-green-600">Size: {exportResult.size} KB</p>
                        </div>
                        <FaDownload className="text-green-600 text-xl" />
                    </div>
                </div>
            )}

            {/* Export Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleExport}
                    disabled={isExporting || !dateFrom || !dateTo}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                    {isExporting ? (
                        <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            Exporting...
                        </>
                    ) : (
                        <>
                            <FaDownload /> Export Report
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ExportReport;