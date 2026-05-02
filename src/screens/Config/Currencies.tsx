import React, { useState } from "react";
import {
    FaPlus, FaEdit, FaTrash, FaSync, FaSave,
    FaChevronLeft, FaChevronRight, FaSearch, FaTimes,
} from "react-icons/fa";
import {
    useGetCurrenciesQuery,
    useCreateCurrencyMutation,
    useUpdateCurrencyMutation,
    useDeleteCurrencyMutation,
    useUpdateExchangeRateMutation,
    type Currency,
} from "../../app/api/ConfigSlices/ConfigApi";

const Currencies = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
    const [editingRate, setEditingRate] = useState<{ code: string; rate: number } | null>(null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortBy, setSortBy] = useState("code");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const { data, isLoading, isFetching, refetch } = useGetCurrenciesQuery({
        page,
        per_page: perPage,
        search: searchTerm || undefined,
        is_active: filterStatus ? filterStatus === "active" : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const [createCurrency, { isLoading: isCreating }] = useCreateCurrencyMutation();
    const [updateCurrency, { isLoading: isUpdating }] = useUpdateCurrencyMutation();
    const [deleteCurrency] = useDeleteCurrencyMutation();
    const [updateExchangeRate] = useUpdateExchangeRateMutation();

    const currencies = data?.data ?? [];
    const summary = data?.summary;
    const meta = data?.meta;

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSearch = () => {
        setSearchTerm(searchInput);
        setPage(1);
    };

    const handleReset = () => {
        setSearchInput("");
        setSearchTerm("");
        setFilterStatus("");
        setSortBy("code");
        setSortOrder("asc");
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
        setPage(1);
    };

    const handleSubmit = async (formData: Partial<Currency>) => {
        try {
            if (selectedCurrency) {
                await updateCurrency({ id: selectedCurrency.code, data: formData }).unwrap();
                showToast("success", "Currency updated successfully");
            } else {
                await createCurrency(formData).unwrap();
                showToast("success", "Currency created successfully");
            }
            setIsModalOpen(false);
            setSelectedCurrency(null);
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to save currency");
        }
    };

    const handleDelete = async (code: string) => {
        if (confirm("Are you sure you want to delete this currency?")) {
            try {
                await deleteCurrency(code).unwrap();
                showToast("success", "Currency deleted successfully");
                refetch();
            } catch (error: any) {
                showToast("error", error?.data?.message || "Failed to delete currency");
            }
        }
    };

    const handleUpdateExchangeRate = async (code: string) => {
        if (editingRate) {
            try {
                await updateExchangeRate({ code, exchange_rate: editingRate.rate }).unwrap();
                showToast("success", "Exchange rate updated successfully");
                setEditingRate(null);
                refetch();
            } catch (error: any) {
                showToast("error", error?.data?.message || "Failed to update exchange rate");
            }
        }
    };

    const formatNumber = (value: any, decimals: number = 4) => {
        if (value === undefined || value === null) return "0.0000";
        const num = typeof value === "string" ? parseFloat(value) : value;
        return isNaN(num) ? "0.0000" : num.toFixed(decimals);
    };

    const renderPagination = () => {
        if (!meta || meta.last_page <= 1) return null;

        const currentPage = meta.current_page;
        const lastPage = meta.last_page;
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(lastPage, startPage + maxVisible - 1);
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) pages.push(i);

        return (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 mt-4">
                <div className="flex items-center gap-4">
                    <div className="text-xs text-gray-400">
                        Showing {meta.from || 0} to {meta.to || 0} of {meta.total} currencies
                    </div>
                    <select
                        value={perPage}
                        onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                        className="text-xs border rounded-lg px-2 py-1"
                    >
                        <option value={10}>10 per page</option>
                        <option value={15}>15 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isFetching}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                    >
                        <FaChevronLeft className="text-xs" /> Previous
                    </button>
                    {startPage > 1 && (
                        <>
                            <button onClick={() => handlePageChange(1)} className="px-3 py-1 rounded-md hover:bg-gray-100">1</button>
                            {startPage > 2 && <span className="px-1">...</span>}
                        </>
                    )}
                    {pages.map(pageNum => (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 rounded-md cursor-pointer transition ${pageNum === currentPage
                                ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                                : "hover:bg-gray-100"}`}
                        >
                            {pageNum}
                        </button>
                    ))}
                    {endPage < lastPage && (
                        <>
                            {endPage < lastPage - 1 && <span className="px-1">...</span>}
                            <button onClick={() => handlePageChange(lastPage)} className="px-3 py-1 rounded-md hover:bg-gray-100">{lastPage}</button>
                        </>
                    )}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === lastPage || isFetching}
                        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                    >
                        Next <FaChevronRight className="text-xs" />
                    </button>
                </div>
            </div>
        );
    };

    if (isLoading && !currencies.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    const averageRate = summary?.average_exchange_rate
        ? formatNumber(summary.average_exchange_rate, 4)
        : "0.0000";

    return (
        <div>
            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
                    ${toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Currencies</h2>
                    <p className="text-sm text-gray-500">Manage currencies and exchange rates</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => refetch()} className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 transition">
                        <FaSync className={`text-sm ${isFetching ? "animate-spin" : ""}`} />
                    </button>
                    <button
                        onClick={() => { setSelectedCurrency(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium hover:opacity-90 transition"
                    >
                        <FaPlus className="text-xs" /> Add Currency
                    </button>
                </div>
            </div>

            {/* Stats */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">Total Currencies</span>
                        <p className="text-xl font-bold text-teal-600">{summary.total || 0}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">Active</span>
                        <p className="text-xl font-bold text-emerald-600">{summary.active || 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">Inactive</span>
                        <p className="text-xl font-bold text-gray-600">{summary.inactive || 0}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">Avg Exchange Rate</span>
                        <p className="text-lg font-bold text-blue-600">{averageRate}</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                        <input
                            type="text"
                            placeholder="Search by currency code or name..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                    className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                {(searchTerm || filterStatus) && (
                    <button onClick={handleReset} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                        <FaTimes className="text-sm" /> Clear
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                                <th className="px-4 py-4 text-left font-semibold text-sm cursor-pointer hover:opacity-80" onClick={() => handleSort("code")}>
                                    Code {sortBy === "code" && (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th className="px-4 py-4 text-left font-semibold text-sm cursor-pointer hover:opacity-80" onClick={() => handleSort("name")}>
                                    Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Symbol</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm cursor-pointer hover:opacity-80" onClick={() => handleSort("exchange_rate")}>
                                    Exchange Rate {sortBy === "exchange_rate" && (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Status</th>
                                <th className="px-4 py-4 text-center font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {currencies.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-400">
                                        No currencies found
                                    </td>
                                </tr>
                            ) : (
                                currencies.map((currency) => (
                                    <tr key={currency.code} className="hover:bg-gray-50/60 transition border-b border-gray-100">
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-teal-600 font-semibold">{currency.code}</span>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-800">{currency.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{currency.symbol}</td>
                                        <td className="px-4 py-3">
                                            {editingRate?.code === currency.code ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={editingRate.rate}
                                                        onChange={(e) => setEditingRate({ ...editingRate, rate: parseFloat(e.target.value) })}
                                                        step="0.0001"
                                                        className="w-24 px-2 py-1 border rounded"
                                                    />
                                                    <button onClick={() => handleUpdateExchangeRate(currency.code)} className="text-teal-600 hover:text-teal-700">
                                                        <FaSave />
                                                    </button>
                                                    <button onClick={() => setEditingRate(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-600">{formatNumber(currency.exchange_rate, 4)}</span>
                                                    <button
                                                        onClick={() => setEditingRate({ code: currency.code, rate: currency.exchange_rate })}
                                                        className="text-gray-400 hover:text-teal-500"
                                                        title="Edit exchange rate"
                                                    >
                                                        <FaEdit className="text-xs" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${currency.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                                {currency.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => { setSelectedCurrency(currency); setIsModalOpen(true); }}
                                                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="text-sm" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(currency.code)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <FaTrash className="text-sm" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>  {/* ✅ closes <tbody> */}
                    </table>  {/* ✅ closes <table> */}
                </div>

                {renderPagination()}
            </div>

            {/* Modal */}
            <CurrencyModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedCurrency(null); }}
                currency={selectedCurrency}
                onSave={handleSubmit}
                isLoading={isCreating || isUpdating}
            />
        </div>
    ); 
}; 

// Currency Modal Component
const CurrencyModal = ({ isOpen, onClose, currency, onSave, isLoading }: any) => {
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        symbol: "",
        exchange_rate: 1,
        decimal_places: 2,
        is_active: true,
    });

    React.useEffect(() => {
        if (currency) {
            setFormData({
                code: currency.code,
                name: currency.name,
                symbol: currency.symbol,
                exchange_rate: currency.exchange_rate,
                decimal_places: currency.decimal_places || 2,
                is_active: currency.is_active,
            });
        } else {
            setFormData({ code: "", name: "", symbol: "", exchange_rate: 1, decimal_places: 2, is_active: true });
        }
    }, [currency]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-t-2xl" />
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
                        <h2 className="text-lg font-bold">{currency ? "Edit Currency" : "Add Currency"}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Code *</label>
                                <input type="text" name="code" value={formData.code} onChange={handleChange} required disabled={!!currency} placeholder="USD"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 disabled:bg-gray-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Symbol *</label>
                                <input type="text" name="symbol" value={formData.symbol} onChange={handleChange} required placeholder="$"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="US Dollar"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Exchange Rate</label>
                                <input type="number" name="exchange_rate" value={formData.exchange_rate} onChange={handleChange} step="0.0001"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Decimal Places</label>
                                <select name="decimal_places" value={formData.decimal_places} onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400">
                                    <option value={0}>0</option>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm font-medium">Active</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500 transition"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                            </label>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border">Cancel</button>
                            <button type="submit" disabled={isLoading} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white">
                                {isLoading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Currencies;