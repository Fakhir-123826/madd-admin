import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaSearch, FaFilter, FaColumns, FaFileExport,
    FaChevronLeft, FaChevronRight, FaChevronDown, FaSort, FaPlus
} from "react-icons/fa";

const mockRules = [
    { id: 1, ruleName: "Summer Sale", startDate: "2026-06-01", endDate: "2026-06-30", status: "Active", priority: 1, websites: "Main Website", customerGroups: "General, Wholesale" },
    { id: 2, ruleName: "Winter Discount", startDate: "2026-12-01", endDate: "2026-12-31", status: "Inactive", priority: 2, websites: "Main Website", customerGroups: "Retailer" },
    { id: 3, ruleName: "Spring Flash Sale", startDate: "2026-03-01", endDate: "2026-03-15", status: "Active", priority: 1, websites: "my web site", customerGroups: "General" },
    { id: 4, ruleName: "Clearance", startDate: "2026-01-01", endDate: "2026-01-31", status: "Inactive", priority: 3, websites: "neo.exp", customerGroups: "Wholesale, Retailer" },
    { id: 5, ruleName: "Black Friday", startDate: "2026-11-25", endDate: "2026-11-30", status: "Active", priority: 1, websites: "Main Website", customerGroups: "General, Wholesale, Retailer" },
    { id: 6, ruleName: "Cyber Monday", startDate: "2026-11-30", endDate: "2026-12-02", status: "Active", priority: 1, websites: "Main Website", customerGroups: "General" },
    { id: 7, ruleName: "New Year Sale", startDate: "2026-12-31", endDate: "2027-01-05", status: "Active", priority: 2, websites: "my web site", customerGroups: "General, Retailer" },
    { id: 8, ruleName: "Valentine's Day", startDate: "2026-02-10", endDate: "2026-02-15", status: "Inactive", priority: 3, websites: "Main Website", customerGroups: "General" },
    { id: 9, ruleName: "Easter Special", startDate: "2026-04-01", endDate: "2026-04-10", status: "Active", priority: 2, websites: "neo.exp", customerGroups: "Wholesale" },
    { id: 10, ruleName: "Mother's Day", startDate: "2026-05-08", endDate: "2026-05-10", status: "Active", priority: 2, websites: "Main Website", customerGroups: "General" },
    { id: 11, ruleName: "Father's Day", startDate: "2026-06-19", endDate: "2026-06-21", status: "Inactive", priority: 2, websites: "my web site", customerGroups: "General" },
    { id: 12, ruleName: "Independence Day", startDate: "2026-07-01", endDate: "2026-07-07", status: "Active", priority: 3, websites: "Main Website", customerGroups: "General, Wholesale" },
    { id: 13, ruleName: "Back to School", startDate: "2026-08-01", endDate: "2026-08-31", status: "Active", priority: 1, websites: "Main Website", customerGroups: "General" },
    { id: 14, ruleName: "Halloween", startDate: "2026-10-25", endDate: "2026-10-31", status: "Active", priority: 2, websites: "neo.exp", customerGroups: "General, Retailer" },
    { id: 15, ruleName: "Thanksgiving", startDate: "2026-11-24", endDate: "2026-11-27", status: "Inactive", priority: 2, websites: "Main Website", customerGroups: "General" },
    { id: 16, ruleName: "Christmas Sale", startDate: "2026-12-20", endDate: "2026-12-26", status: "Active", priority: 1, websites: "Main Website", customerGroups: "General, Wholesale, Retailer" },
    { id: 17, ruleName: "Flash Sale - Electronics", startDate: "2026-09-15", endDate: "2026-09-17", status: "Active", priority: 1, websites: "my web site", customerGroups: "General" },
    { id: 18, ruleName: "Weekend Special", startDate: "2026-10-03", endDate: "2026-10-05", status: "Inactive", priority: 3, websites: "Main Website", customerGroups: "Wholesale" },
    { id: 19, ruleName: "Monthly Deals", startDate: "2026-02-01", endDate: "2026-02-28", status: "Active", priority: 4, websites: "neo.exp", customerGroups: "Retailer" },
    { id: 20, ruleName: "Premium Members Only", startDate: "2026-01-15", endDate: "2026-12-31", status: "Active", priority: 1, websites: "Main Website", customerGroups: "Wholesale" },
    { id: 21, ruleName: "Student Discount", startDate: "2026-08-15", endDate: "2026-09-15", status: "Active", priority: 2, websites: "my web site", customerGroups: "General" },
    { id: 22, ruleName: "First Purchase", startDate: "2026-01-01", endDate: "2026-12-31", status: "Active", priority: 1, websites: "Main Website", customerGroups: "General" },
    { id: 23, ruleName: "Loyalty Rewards", startDate: "2026-03-01", endDate: "2026-12-31", status: "Active", priority: 2, websites: "neo.exp", customerGroups: "Wholesale, Retailer" },
    { id: 24, ruleName: "Clearance Sale", startDate: "2026-04-15", endDate: "2026-05-15", status: "Inactive", priority: 3, websites: "Main Website", customerGroups: "General" },
];

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "active": return "bg-green-50 text-green-600 border border-green-200";
        case "inactive": return "bg-red-50 text-red-500 border border-red-200";
        default: return "bg-gray-100 text-gray-500";
    }
};

interface FilterState {
    startDateFrom: string;
    startDateTo: string;
    endDateFrom: string;
    endDateTo: string;
    priorityFrom: string;
    priorityTo: string;
    ruleName: string;
    status: string;
    website: string;
}

const MagentoCatalogPriceRuleList = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<number[]>([]);
    const [perPage, setPerPage] = useState(20);
    const [showFilters, setShowFilters] = useState(false);
    const [showColumns, setShowColumns] = useState(false);
    const [action, setAction] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<keyof typeof mockRules[0]>("id");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    
    // Filter state
    const [filters, setFilters] = useState<FilterState>({
        startDateFrom: "",
        startDateTo: "",
        endDateFrom: "",
        endDateTo: "",
        priorityFrom: "",
        priorityTo: "",
        ruleName: "",
        status: "",
        website: "",
    });

    // Apply all filters (including search)
    const filtered = mockRules.filter(r => {
        // Search filter
        const matchesSearch = search === "" || 
            r.ruleName.toLowerCase().includes(search.toLowerCase()) ||
            r.websites.toLowerCase().includes(search.toLowerCase()) ||
            r.customerGroups.toLowerCase().includes(search.toLowerCase());

        // Rule name filter
        const matchesRuleName = filters.ruleName === "" || 
            r.ruleName.toLowerCase().includes(filters.ruleName.toLowerCase());

        // Status filter
        const matchesStatus = filters.status === "" || 
            r.status.toLowerCase() === filters.status.toLowerCase();

        // Website filter
        const matchesWebsite = filters.website === "" || 
            r.websites === filters.website;

        // Priority range filter
        const matchesPriorityFrom = filters.priorityFrom === "" || 
            r.priority >= parseInt(filters.priorityFrom);
        const matchesPriorityTo = filters.priorityTo === "" || 
            r.priority <= parseInt(filters.priorityTo);

        // Date range filter
        const matchesStartDateFrom = filters.startDateFrom === "" || 
            r.startDate >= filters.startDateFrom;
        const matchesStartDateTo = filters.startDateTo === "" || 
            r.startDate <= filters.startDateTo;
        const matchesEndDateFrom = filters.endDateFrom === "" || 
            r.endDate >= filters.endDateFrom;
        const matchesEndDateTo = filters.endDateTo === "" || 
            r.endDate <= filters.endDateTo;

        return matchesSearch && matchesRuleName && matchesStatus && matchesWebsite &&
               matchesPriorityFrom && matchesPriorityTo && matchesStartDateFrom && 
               matchesStartDateTo && matchesEndDateFrom && matchesEndDateTo;
    });

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (sortField === "startDate" || sortField === "endDate") {
            aVal = new Date(aVal as string).getTime();
            bVal = new Date(bVal as string).getTime();
        }
        
        if (typeof aVal === "string" && typeof bVal === "string") {
            return sortDirection === "asc" 
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }
        
        if (typeof aVal === "number" && typeof bVal === "number") {
            return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }
        
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sorted.length / perPage);
    const paginated = sorted.slice((currentPage - 1) * perPage, currentPage * perPage);

    const toggleSelect = (id: number) =>
        setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    
    const toggleAll = () =>
        setSelected(selected.length === paginated.length ? [] : paginated.map(i => i.id));

    const handleSort = (field: keyof typeof mockRules[0]) => {
        if (sortField === field) {
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const applyFilters = () => {
        setShowFilters(false);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            startDateFrom: "",
            startDateTo: "",
            endDateFrom: "",
            endDateTo: "",
            priorityFrom: "",
            priorityTo: "",
            ruleName: "",
            status: "",
            website: "",
        });
        setSearch("");
        setShowFilters(false);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSelected([]);
    };

    const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
    const tdClass = "px-4 py-3 text-xs text-gray-600 whitespace-nowrap";

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Catalog Price Rules</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Manage all catalog price rules</p>
                    </div>
                    <button
                        onClick={() => navigate("/AddCatalogPriceRule")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                        style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                        <FaPlus className="text-xs" /> Add New Rule
                    </button>
                </div>

                {/* Search + Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus-within:border-teal-400 focus-within:bg-white transition-all w-64">
                        <input type="text" value={search} onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                            placeholder="Search by keyword"
                            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400" />
                        <FaSearch className="text-gray-400 text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all
                                ${showFilters ? "border-teal-400 text-teal-600 bg-teal-50" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                            <FaFilter className="text-xs" /> Filters
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Default View <FaChevronDown className="text-xs opacity-50" />
                        </button>
                        <div className="relative">
                            <button onClick={() => setShowColumns(!showColumns)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50">
                                <FaColumns className="text-xs" /> Columns <FaChevronDown className="text-xs opacity-50" />
                            </button>
                            {showColumns && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowColumns(false)} />
                                    <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-44 space-y-2">
                                        {["ID", "Rule Name", "Start Date", "End Date", "Status", "Priority", "Websites", "Customer Groups"].map(col => (
                                            <label key={col} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                                                <input type="checkbox" defaultChecked className="accent-teal-500" /> {col}
                                            </label>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50">
                            <FaFileExport className="text-xs" /> Export <FaChevronDown className="text-xs opacity-50" />
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-5">
                        {/* Row 1 — date ranges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { label: "Start Date", key: "startDate" },
                                { label: "End Date", key: "endDate" },
                            ].map(f => (
                                <div key={f.label}>
                                    <label className="text-xs font-semibold text-gray-600 mb-2 block">{f.label}</label>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 w-6">from</span>
                                            <input 
                                                type="date" 
                                                value={filters[`${f.key}From` as keyof FilterState] as string}
                                                onChange={(e) => handleFilterChange(`${f.key}From` as keyof FilterState, e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" 
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 w-6">to</span>
                                            <input 
                                                type="date" 
                                                value={filters[`${f.key}To` as keyof FilterState] as string}
                                                onChange={(e) => handleFilterChange(`${f.key}To` as keyof FilterState, e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Priority</label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">from</span>
                                        <input 
                                            type="number" 
                                            value={filters.priorityFrom}
                                            onChange={(e) => handleFilterChange("priorityFrom", e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" 
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">to</span>
                                        <input 
                                            type="number" 
                                            value={filters.priorityTo}
                                            onChange={(e) => handleFilterChange("priorityTo", e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Row 2 — text + selects + buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Rule Name</label>
                                <input 
                                    type="text" 
                                    value={filters.ruleName}
                                    onChange={(e) => handleFilterChange("ruleName", e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Status</label>
                                <select 
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange("status", e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all">
                                    <option value="">All</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Website</label>
                                <select 
                                    value={filters.website}
                                    onChange={(e) => handleFilterChange("website", e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all">
                                    <option value="">All</option>
                                    <option>Main Website</option>
                                    <option>my web site</option>
                                    <option>neo.exp</option>
                                </select>
                            </div>
                            <div className="flex items-end justify-end gap-2">
                                <button onClick={clearFilters}
                                    className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2">
                                    Clear All
                                </button>
                                <button onClick={applyFilters}
                                    className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90"
                                    style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ACTIONS + PAGINATION */}
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                    <select value={action} onChange={(e) => setAction(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 outline-none bg-gray-50">
                        <option value="">Actions</option>
                        <option value="delete">Delete</option>
                        <option value="enable">Enable</option>
                        <option value="disable">Disable</option>
                    </select>
                    <span className="text-xs text-gray-400">
                        <span className="font-semibold text-gray-700">{sorted.length}</span> records found
                        {selected.length > 0 && <span className="ml-2 text-teal-600 font-medium">({selected.length} selected)</span>}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <select value={perPage} onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                        className="px-2 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-600 outline-none bg-gray-50">
                        {[20, 30, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <span className="text-xs text-gray-400">per page</span>
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">
                        <FaChevronLeft className="text-xs" />
                    </button>
                    <span className="text-xs font-medium text-gray-700">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">
                        <FaChevronRight className="text-xs" />
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: "900px", borderCollapse: "collapse" }}>
                    <thead>
                        <tr className="bg-gradient-to-r from-teal-400 to-emerald-500 text-white">
                            <th className="px-4 py-3 text-left w-10">
                                <input type="checkbox"
                                    checked={paginated.length > 0 && selected.length === paginated.length}
                                    onChange={toggleAll}
                                    className="w-3.5 h-3.5 accent-white" />
                            </th>
                            {[
                                { label: "ID", field: "id", sortable: true },
                                { label: "Rule Name", field: "ruleName", sortable: true },
                                { label: "Start Date", field: "startDate", sortable: true },
                                { label: "End Date", field: "endDate", sortable: true },
                                { label: "Status", field: "status", sortable: true },
                                { label: "Priority", field: "priority", sortable: true },
                                { label: "Websites", field: "websites", sortable: true },
                                { label: "Customer Groups", field: "customerGroups", sortable: false },
                                { label: "Action", field: null, sortable: false },
                            ].map(col => (
                                <th key={col.label} className={thClass}>
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && (
                                            <FaSort 
                                                className={`cursor-pointer transition-colors ${
                                                    sortField === col.field ? "text-white" : "text-white/50 hover:text-white"
                                                }`}
                                                onClick={() => handleSort(col.field as keyof typeof mockRules[0])}
                                            />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-12 text-gray-400 text-sm">No rules found.</td>
                            </tr>
                        ) : (
                            paginated.map((r, idx) => (
                                <tr key={r.id}
                                    style={{ borderBottom: "1px solid #f3f4f6", background: selected.includes(r.id) ? "#f0fdfa" : idx % 2 === 0 ? "#fff" : "#fafafa" }}
                                    className="hover:bg-blue-50/20 transition-all">
                                    <td className="px-4 py-3">
                                        <input type="checkbox" checked={selected.includes(r.id)}
                                            onChange={() => toggleSelect(r.id)}
                                            className="w-3.5 h-3.5 accent-teal-500" />
                                    </td>
                                    <td className={`${tdClass} font-medium text-gray-700`}>{r.id}</td>
                                    <td className={`${tdClass} font-medium text-gray-800`}>{r.ruleName}</td>
                                    <td className={tdClass}>{formatDate(r.startDate)}</td>
                                    <td className={tdClass}>{formatDate(r.endDate)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(r.status)}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className={tdClass}>{r.priority}</td>
                                    <td className={tdClass}>{r.websites}</td>
                                    <td className={tdClass}>{r.customerGroups}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => navigate(`/AddCatalogPriceRule/${r.id}`)}
                                            className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default MagentoCatalogPriceRuleList;