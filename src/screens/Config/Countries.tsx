// src/screens/Config/Countries.tsx
import React, { useState, useEffect } from "react";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaToggleOn,
    FaToggleOff,
    FaSync,
    FaSearch,
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import {
    useGetCountriesQuery,
    useCreateCountryMutation,
    useUpdateCountryMutation,
    useDeleteCountryMutation,
    useActivateCountryMutation,
    type Country,
} from "../../app/api/ConfigSlices/ConfigApi";

const Countries = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

    // Pagination and filters
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [filterRegion, setFilterRegion] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterEuMember, setFilterEuMember] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const { data, isLoading, isFetching, refetch } = useGetCountriesQuery({
        page,
        per_page: perPage,
        search: searchTerm || undefined,
        region: filterRegion || undefined,
        is_active: filterStatus ? filterStatus === "active" : undefined,
        eu_member: filterEuMember ? filterEuMember === "true" : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const [createCountry, { isLoading: isCreating }] = useCreateCountryMutation();
    const [updateCountry, { isLoading: isUpdating }] = useUpdateCountryMutation();
    const [deleteCountry] = useDeleteCountryMutation();
    const [activateCountry] = useActivateCountryMutation();

    const countries = data?.data ?? [];
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
        setFilterRegion("");
        setFilterStatus("");
        setFilterEuMember("");
        setSortBy("name");
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

    const handleSubmit = async (formData: Partial<Country>) => {
        try {
            if (selectedCountry) {
                await updateCountry({ id: selectedCountry.id, data: formData }).unwrap();
                showToast("success", "Country updated successfully");
            } else {
                await createCountry(formData).unwrap();
                showToast("success", "Country created successfully");
            }
            setIsModalOpen(false);
            setSelectedCountry(null);
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to save country");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this country?")) {
            try {
                await deleteCountry(id).unwrap();
                showToast("success", "Country deleted successfully");
                refetch();
            } catch (error: any) {
                showToast("error", error?.data?.message || "Failed to delete country");
            }
        }
    };

    const handleToggleStatus = async (code: string, currentStatus: boolean) => {
        try {
            await activateCountry(code).unwrap();
            showToast("success", `Country ${currentStatus ? "deactivated" : "activated"} successfully`);
            refetch();
        } catch (error: any) {
            showToast("error", error?.data?.message || "Failed to update status");
        }
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
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 mt-4">
                <div className="flex items-center gap-4">
                    <div className="text-xs text-gray-400">
                        Showing {meta.from || 0} to {meta.to || 0} of {meta.total} countries
                    </div>
                    <select
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setPage(1);
                        }}
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
                            <button onClick={() => handlePageChange(1)} className="px-3 py-1 rounded-md hover:bg-gray-100">
                                1
                            </button>
                            {startPage > 2 && <span className="px-1">...</span>}
                        </>
                    )}
                    {pages.map(pageNum => (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 rounded-md cursor-pointer transition ${pageNum === currentPage
                                    ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                                    : "hover:bg-gray-100"
                                }`}
                        >
                            {pageNum}
                        </button>
                    ))}
                    {endPage < lastPage && (
                        <>
                            {endPage < lastPage - 1 && <span className="px-1">...</span>}
                            <button onClick={() => handlePageChange(lastPage)} className="px-3 py-1 rounded-md hover:bg-gray-100">
                                {lastPage}
                            </button>
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

    if (isLoading && !countries.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-teal-500" />
            </div>
        );
    }

    return (
        <div>
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
                    <h2 className="text-lg font-semibold text-gray-800">Countries</h2>
                    <p className="text-sm text-gray-500">Manage supported countries and regions</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => refetch()}
                        className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 transition"
                    >
                        <FaSync className={`text-sm ${isFetching ? "animate-spin" : ""}`} />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedCountry(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm font-medium hover:opacity-90 transition"
                    >
                        <FaPlus className="text-xs" /> Add Country
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">Total Countries</span>
                        <p className="text-xl font-bold text-teal-600">{summary.total}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">Active</span>
                        <p className="text-xl font-bold text-emerald-600">{summary.active}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">EU Members</span>
                        <p className="text-xl font-bold text-blue-600">{summary.eu_members}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-500">Regions</span>
                        <p className="text-xl font-bold text-purple-600">{summary.regions?.length || 0}</p>
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
                            placeholder="Search by country name or code..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>
                </div>
                <select
                    value={filterRegion}
                    onChange={(e) => { setFilterRegion(e.target.value); setPage(1); }}
                    className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                    <option value="">All Regions</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="Africa">Africa</option>
                    <option value="North America">North America</option>
                    <option value="South America">South America</option>
                    <option value="Oceania">Oceania</option>
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                    className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <select
                    value={filterEuMember}
                    onChange={(e) => { setFilterEuMember(e.target.value); setPage(1); }}
                    className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                    <option value="">All (EU Member)</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
                {(searchTerm || filterRegion || filterStatus || filterEuMember) && (
                    <button onClick={handleReset} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
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
                                    Country Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Phone Code</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Region</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">EU Member</th>
                                <th className="px-4 py-4 text-left font-semibold text-sm">Status</th>
                                <th className="px-4 py-4 text-center font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {countries.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-gray-400">
                                        No countries found
                                    </td>
                                </tr>
                            ) : (
                                countries.map((country, idx) => (
                                    <tr key={country.id} className="hover:bg-gray-50/60 transition border-b border-gray-100">
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-teal-600 font-semibold">{country.iso2}</span>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-800">{country.name}</td>
                                        <td className="px-4 py-3 text-gray-600">+{country.phone_code}</td>
                                        <td className="px-4 py-3 text-gray-600">{country.region || "—"}</td>
                                        <td className="px-4 py-3">
                                            {country.config?.eu_member ? (
                                                <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-600 text-xs">Yes</span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-500 text-xs">No</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${country.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                                {country.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCountry(country);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="text-sm" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(country.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <FaTrash className="text-sm" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(country.iso2, country.is_active)}
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                                                    title={country.is_active ? "Deactivate" : "Activate"}
                                                >
                                                    {country.is_active ? <FaToggleOn className="text-lg text-emerald-500" /> : <FaToggleOff className="text-lg text-gray-400" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {renderPagination()}
            </div>

            {/* Country Modal */}
            <CountryModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedCountry(null); }}
                country={selectedCountry}
                onSave={handleSubmit}
                isLoading={isCreating || isUpdating}
            />
        </div>
    );
};

// Country Modal Component
const CountryModal = ({
    isOpen,
    onClose,
    country,
    onSave,
    isLoading,
}: {
    isOpen: boolean;
    onClose: () => void;
    country: Country | null;
    onSave: (data: Partial<Country>) => void;
    isLoading: boolean;
}) => {
    const [formData, setFormData] = useState<Partial<Country>>({
        code: "",
        name: "",
        phone_code: "",
        currency_code: "USD",
        tax_rate: 0,
        eu_member: false,
        timezone: "UTC",
        is_active: true,
    });

    const currencies = ["USD", "EUR", "GBP", "JPY", "CNY", "AED", "SAR", "PKR", "INR"];
    const timezones = [
        "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
        "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Dubai", "Asia/Karachi",
        "Asia/Kolkata", "Asia/Tokyo", "Australia/Sydney",
    ];

    React.useEffect(() => {
        if (country) {
            setFormData({
                code: country.code,
                name: country.name,
                phone_code: country.phone_code,
                currency_code: country.currency_code,
                tax_rate: country.tax_rate,
                eu_member: country.eu_member,
                timezone: country.timezone,
                is_active: country.is_active,
            });
        } else {
            setFormData({
                code: "",
                name: "",
                phone_code: "",
                currency_code: "USD",
                tax_rate: 0,
                eu_member: false,
                timezone: "UTC",
                is_active: true,
            });
        }
    }, [country]);

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
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-800">
                            {country ? "Edit Country" : "Add Country"}
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country Code *</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    required
                                    placeholder="US"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Code *</label>
                                <input
                                    type="text"
                                    name="phone_code"
                                    value={formData.phone_code}
                                    onChange={handleChange}
                                    required
                                    placeholder="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="United States"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                <select
                                    name="currency_code"
                                    value={formData.currency_code}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
                                >
                                    {currencies.map(curr => (
                                        <option key={curr} value={curr}>{curr}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                                <input
                                    type="number"
                                    name="tax_rate"
                                    value={formData.tax_rate}
                                    onChange={handleChange}
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                            <select
                                name="timezone"
                                value={formData.timezone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
                            >
                                {timezones.map(tz => (
                                    <option key={tz} value={tz}>{tz}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm text-gray-700">EU Member</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="eu_member"
                                    checked={formData.eu_member}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500 transition"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm text-gray-700">Active</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500 transition"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                                Cancel
                            </button>
                            <button type="submit" disabled={isLoading} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium hover:opacity-90 transition disabled:opacity-50">
                                {isLoading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Countries;