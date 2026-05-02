import React, { useState } from "react";
import { FaFilter, FaRedo, FaSearch, FaEye, FaTimes } from "react-icons/fa";
import {
    useGetLogsQuery,
    useGetLogByDateQuery,
    useClearLogsMutation,
} from "../../../app/api/SystemSlices/SystemApi";

// ─── Log Viewer Modal ──────────────────────────────────────────────────────────
const LogViewerModal = ({ date, onClose }: { date: string; onClose: () => void }) => {
    const { data, isLoading } = useGetLogByDateQuery(date);
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Log: <span className="text-teal-600">{date}</span></h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><FaTimes size={18} /></button>
                </div>
                <div className="overflow-auto flex-1 p-6">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
                        </div>
                    ) : (
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-xl border border-gray-200">
                            {data?.data?.content || "No content available."}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const SystemLogs = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const itemsPerPage = 8;

    const { data, isLoading, refetch } = useGetLogsQuery();
    const [clearLogs] = useClearLogsMutation();

    const logs = data?.data || [];

    // Filter + search
    const filteredLogs = logs.filter((log: any) => {
        if (searchTerm) {
            return log.date?.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
    });

    // Pagination
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleClearLogs = async () => {
        if (!window.confirm("Are you sure you want to clear all logs?")) return;
        try {
            await clearLogs().unwrap();
            refetch();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            {selectedDate && <LogViewerModal date={selectedDate} onClose={() => setSelectedDate(null)} />}

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">System Logs</h2>
                <button
                    onClick={handleClearLogs}
                    className="text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                >
                    Clear All Logs
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center overflow-hidden h-[52px] py-10 mb-2">
                <div className="relative mr-auto">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search logs by date..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-80 h-[48px] pl-11 pr-4 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                    />
                </div>
            </div>

            {/* TABLE */}
            <div className="rounded-t-3xl overflow-hidden mt-6">
                <table className="w-full text-sm border-separate border-spacing-y-3">
                    <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                        <tr>
                            <th className="p-4 text-left rounded-l-xl">Log Date</th>
                            <th className="p-4 text-left">Size</th>
                            <th className="p-4 text-left">Modified</th>
                            <th className="p-4 text-right rounded-r-xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="text-center py-10">
                                    <div className="flex justify-center">
                                        <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
                                    </div>
                                </td>
                            </tr>
                        ) : currentLogs.length > 0 ? (
                            currentLogs.map((log: any, index: number) => (
                                <tr key={index} className="bg-white shadow-sm hover:shadow-md transition relative">
                                    <td className="relative p-4 font-medium rounded-l-xl text-black">
                                        {log.date}
                                        <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                                    </td>
                                    <td className="relative p-4 text-gray-600">
                                        {log.size || "—"}
                                        <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                                    </td>
                                    <td className="relative p-4 text-gray-600">
                                        {log.modified || "—"}
                                        <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                                    </td>
                                    <td className="relative p-4 rounded-r-xl text-right">
                                        <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />
                                        <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />
                                        <button
                                            onClick={() => setSelectedDate(log.date)}
                                            className="flex items-center gap-1.5 text-teal-600 hover:underline ml-auto"
                                        >
                                            <FaEye size={12} /> View Content
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">
                                    No logs found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {filteredLogs.length > 0 && (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-600">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
                    >
                        ← Back
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded-md ${currentPage === i + 1
                                ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};

export default SystemLogs;
