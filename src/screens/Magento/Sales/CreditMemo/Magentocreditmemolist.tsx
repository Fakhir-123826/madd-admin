import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaSearch, FaFilter, FaColumns, FaFileExport,
    FaChevronLeft, FaChevronRight, FaChevronDown, FaSort
} from "react-icons/fa";

// ============ FAKE DATA GENERATION ============
interface CreditMemo {
    id: number;
    memo: string;
    created: string;
    order: string;
    orderDate: string;
    billTo: string;
    status: "Refunded" | "Pending" | "Cancelled" | "Processing";
    refunded: string;
}

const firstNames = ["Veronica", "John", "Emma", "Michael", "Sophia", "William", "Olivia", "James", "Ava", "Robert", "Isabella", "David", "Mia", "Richard", "Charlotte", "Joseph", "Amelia", "Thomas", "Harper", "Charles", "Evelyn", "Daniel", "Grace", "Matthew", "Victoria", "Anthony", "Hannah", "Mark", "Lily", "Paul"];
const lastNames = ["Costello", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "White", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott"];

const generateRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).replace(/,/g, '');
};

const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric'
    });
};

const generateFakeCreditMemos = (count: number): CreditMemo[] => {
    const memos: CreditMemo[] = [];
    const startDate = new Date(2025, 0, 1);
    const endDate = new Date();
    const statuses: CreditMemo["status"][] = ["Refunded", "Pending", "Cancelled", "Processing"];

    for (let i = 1; i <= count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const orderDate = generateRandomDate(startDate, endDate);
        const memoDate = generateRandomDate(orderDate, endDate);
        const refundAmount = (Math.floor(Math.random() * 50000) / 100).toFixed(2);
        
        memos.push({
            id: i,
            memo: `${100000000 + i}`,
            created: formatDate(memoDate),
            order: `${200000000 + i}`,
            orderDate: formatShortDate(orderDate),
            billTo: `${firstName} ${lastName}`,
            status: status,
            refunded: `$${refundAmount}`,
        });
    }
    
    // Sort by ID descending (newest first)
    return memos.sort((a, b) => b.id - a.id);
};

const FAKE_CREDIT_MEMOS = generateFakeCreditMemos(50);

const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "refunded": return "bg-green-50 text-green-600 border border-green-200";
        case "pending": return "bg-amber-50 text-amber-600 border border-amber-200";
        case "cancelled": return "bg-red-50 text-red-500 border border-red-200";
        case "processing": return "bg-blue-50 text-blue-600 border border-blue-200";
        default: return "bg-gray-100 text-gray-500";
    }
};

const MagentoCreditMemoList = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<number[]>([]);
    const [perPage, setPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [showColumns, setShowColumns] = useState(false);
    const [action, setAction] = useState("");
    const [sortField, setSortField] = useState<string>("memo");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    // Column visibility state
    const [visibleColumns, setVisibleColumns] = useState({
        creditMemo: true,
        created: true,
        order: true,
        orderDate: true,
        billToName: true,
        status: true,
        refunded: true,
        action: true,
    });

    // Filter states
    const [filters, setFilters] = useState({
        memoFrom: "",
        memoTo: "",
        orderFrom: "",
        orderTo: "",
        refundedFrom: "",
        refundedTo: "",
        createdFrom: "",
        createdTo: "",
        orderDateFrom: "",
        orderDateTo: "",
        billToName: "",
        status: "",
    });

    // Apply filters and search
    const filteredMemos = useMemo(() => {
        let result = [...FAKE_CREDIT_MEMOS];

        // Global search
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(
                (memo) =>
                    memo.memo.includes(searchLower) ||
                    memo.billTo.toLowerCase().includes(searchLower) ||
                    memo.order.includes(searchLower)
            );
        }

        // Apply specific filters
        if (filters.memoFrom) {
            result = result.filter(m => parseInt(m.memo) >= parseInt(filters.memoFrom));
        }
        if (filters.memoTo) {
            result = result.filter(m => parseInt(m.memo) <= parseInt(filters.memoTo));
        }
        if (filters.orderFrom) {
            result = result.filter(m => parseInt(m.order) >= parseInt(filters.orderFrom));
        }
        if (filters.orderTo) {
            result = result.filter(m => parseInt(m.order) <= parseInt(filters.orderTo));
        }
        if (filters.refundedFrom) {
            result = result.filter(m => parseFloat(m.refunded.replace('$', '')) >= parseFloat(filters.refundedFrom));
        }
        if (filters.refundedTo) {
            result = result.filter(m => parseFloat(m.refunded.replace('$', '')) <= parseFloat(filters.refundedTo));
        }
        if (filters.billToName) {
            result = result.filter(m => 
                m.billTo.toLowerCase().includes(filters.billToName.toLowerCase())
            );
        }
        if (filters.status) {
            result = result.filter(m => m.status.toLowerCase() === filters.status.toLowerCase());
        }
        if (filters.createdFrom) {
            result = result.filter(m => new Date(m.created) >= new Date(filters.createdFrom));
        }
        if (filters.createdTo) {
            result = result.filter(m => new Date(m.created) <= new Date(filters.createdTo));
        }
        if (filters.orderDateFrom) {
            result = result.filter(m => new Date(m.orderDate) >= new Date(filters.orderDateFrom));
        }
        if (filters.orderDateTo) {
            result = result.filter(m => new Date(m.orderDate) <= new Date(filters.orderDateTo));
        }

        // Apply sorting
        result.sort((a, b) => {
            if (sortField === "memo") {
                return sortDirection === "asc" 
                    ? parseInt(a.memo) - parseInt(b.memo)
                    : parseInt(b.memo) - parseInt(a.memo);
            }
            return 0;
        });

        return result;
    }, [FAKE_CREDIT_MEMOS, search, filters, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredMemos.length / perPage);
    const paginatedMemos = filteredMemos.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    const toggleSelect = (id: number) =>
        setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    
    const toggleAll = () =>
        setSelected(selected.length === paginatedMemos.length ? [] : paginatedMemos.map(i => i.id));

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilters({
            memoFrom: "",
            memoTo: "",
            orderFrom: "",
            orderTo: "",
            refundedFrom: "",
            refundedTo: "",
            createdFrom: "",
            createdTo: "",
            orderDateFrom: "",
            orderDateTo: "",
            billToName: "",
            status: "",
        });
        setSearch("");
        setCurrentPage(1);
    };

    const handleSort = () => {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };

    const handleExport = () => {
        const headers = ["Credit Memo #", "Created Date", "Order #", "Order Date", "Bill-to Name", "Status", "Refunded Amount"];
        const csvRows = filteredMemos.map(memo => [
            memo.memo,
            memo.created,
            memo.order,
            memo.orderDate,
            memo.billTo,
            memo.status,
            memo.refunded
        ].join(","));

        const csvContent = [headers.join(","), ...csvRows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `credit_memos_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
    };

    const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
    const tdClass = "px-4 py-3 text-xs text-gray-600 whitespace-nowrap";

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Credit Memos</h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Manage all credit memos ({FAKE_CREDIT_MEMOS.length} total)
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Search */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus-within:border-teal-400 focus-within:bg-white transition-all w-64">
                        <input 
                            type="text" 
                            value={search} 
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search by keyword"
                            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400" 
                        />
                        <FaSearch className="text-gray-400 text-sm" />
                    </div>

                    {/* Buttons */}
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
                                    <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-48 space-y-2">
                                        {Object.keys(visibleColumns).map(col => (
                                            <label key={col} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={visibleColumns[col as keyof typeof visibleColumns]}
                                                    onChange={() => setVisibleColumns(prev => ({ ...prev, [col]: !prev[col as keyof typeof prev] }))}
                                                    className="accent-teal-500" 
                                                /> 
                                                {col === "creditMemo" ? "Credit Memo" : 
                                                 col === "billToName" ? "Bill-to Name" :
                                                 col === "order" ? "Order #" :
                                                 col === "orderDate" ? "Order Date" :
                                                 col.charAt(0).toUpperCase() + col.slice(1)}
                                            </label>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <button 
                            onClick={handleExport}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50"
                        >
                            <FaFileExport className="text-xs" /> Export <FaChevronDown className="text-xs opacity-50" />
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-5">
                        {/* Row 1 — Range */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Credit Memo #</label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">from</span>
                                        <input type="text" placeholder="e.g., 100000000"
                                            value={filters.memoFrom}
                                            onChange={(e) => handleFilterChange("memoFrom", e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">to</span>
                                        <input type="text" placeholder="e.g., 100000050"
                                            value={filters.memoTo}
                                            onChange={(e) => handleFilterChange("memoTo", e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Order #</label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">from</span>
                                        <input type="text" placeholder="e.g., 200000000"
                                            value={filters.orderFrom}
                                            onChange={(e) => handleFilterChange("orderFrom", e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">to</span>
                                        <input type="text" placeholder="e.g., 200000050"
                                            value={filters.orderTo}
                                            onChange={(e) => handleFilterChange("orderTo", e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Refunded Amount</label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">from</span>
                                        <input type="number" placeholder="$0"
                                            value={filters.refundedFrom}
                                            onChange={(e) => handleFilterChange("refundedFrom", e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">to</span>
                                        <input type="number" placeholder="$500"
                                            value={filters.refundedTo}
                                            onChange={(e) => handleFilterChange("refundedTo", e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Created Date</label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">from</span>
                                        <input type="date"
                                            value={filters.createdFrom}
                                            onChange={(e) => handleFilterChange("createdFrom", e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">to</span>
                                        <input type="date"
                                            value={filters.createdTo}
                                            onChange={(e) => handleFilterChange("createdTo", e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Row 2 — Text + Status + Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Bill-to Name</label>
                                <input type="text" placeholder="Enter customer name"
                                    value={filters.billToName}
                                    onChange={(e) => handleFilterChange("billToName", e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Order Date</label>
                                <div className="flex gap-2">
                                    <input type="date" placeholder="From"
                                        value={filters.orderDateFrom}
                                        onChange={(e) => handleFilterChange("orderDateFrom", e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                    <input type="date" placeholder="To"
                                        value={filters.orderDateTo}
                                        onChange={(e) => handleFilterChange("orderDateTo", e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Status</label>
                                <select 
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange("status", e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all"
                                >
                                    <option value="">All Status</option>
                                    <option value="refunded">Refunded</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100">
                            <button onClick={resetFilters}
                                className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 transition-all">
                                Reset Filters
                            </button>
                            <button onClick={() => setShowFilters(false)}
                                className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 transition-all">
                                Cancel
                            </button>
                            <button 
                                onClick={() => setShowFilters(false)}
                                className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                                style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                                Apply Filters
                            </button>
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
                        <option value="print">Print Selected</option>
                        <option value="export">Export Selected</option>
                    </select>
                    <span className="text-xs text-gray-400">
                        <span className="font-semibold text-gray-700">{filteredMemos.length}</span> records found
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
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed">
                        <FaChevronLeft className="text-xs" />
                    </button>
                    <span className="text-xs font-medium text-gray-700">
                        {currentPage} of {totalPages || 1}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed">
                        <FaChevronRight className="text-xs" />
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: "800px", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                            <th className="px-4 py-3 text-left w-10">
                                <input type="checkbox"
                                    checked={selected.length === paginatedMemos.length && paginatedMemos.length > 0}
                                    onChange={toggleAll}
                                    className="w-3.5 h-3.5 accent-white" />
                            </th>
                            {visibleColumns.creditMemo && (
                                <th className={thClass}>
                                    <div className="flex items-center gap-1 cursor-pointer" onClick={handleSort}>
                                        Credit Memo
                                        <FaSort className="text-white/50 hover:text-white" />
                                    </div>
                                </th>
                            )}
                            {visibleColumns.created && <th className={thClass}>Created</th>}
                            {visibleColumns.order && <th className={thClass}>Order #</th>}
                            {visibleColumns.orderDate && <th className={thClass}>Order Date</th>}
                            {visibleColumns.billToName && <th className={thClass}>Bill-to Name</th>}
                            {visibleColumns.status && <th className={thClass}>Status</th>}
                            {visibleColumns.refunded && <th className={thClass}>Refunded</th>}
                            {visibleColumns.action && <th className={thClass}>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedMemos.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">No credit memos found.</td>
                            </tr>
                        ) : (
                            paginatedMemos.map((m, idx) => (
                                <tr key={m.id}
                                    style={{ borderBottom: "1px solid #f3f4f6", background: selected.includes(m.id) ? "#f0fdfa" : idx % 2 === 0 ? "#fff" : "#fafafa" }}
                                    className="hover:bg-blue-50/20 transition-all">
                                    <td className="px-4 py-3">
                                        <input type="checkbox" checked={selected.includes(m.id)}
                                            onChange={() => toggleSelect(m.id)}
                                            className="w-3.5 h-3.5 accent-teal-500" />
                                    </td>
                                    {visibleColumns.creditMemo && (
                                        <td className={`${tdClass} font-medium text-gray-700`}>{m.memo}</td>
                                    )}
                                    {visibleColumns.created && <td className={tdClass}>{m.created}</td>}
                                    {visibleColumns.order && <td className={tdClass}>{m.order}</td>}
                                    {visibleColumns.orderDate && <td className={tdClass}>{m.orderDate}</td>}
                                    {visibleColumns.billToName && <td className={tdClass}>{m.billTo}</td>}
                                    {visibleColumns.status && (
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(m.status)}`}>
                                                {m.status}
                                            </span>
                                        </td>
                                    )}
                                    {visibleColumns.refunded && (
                                        <td className={`${tdClass} font-medium text-gray-700`}>{m.refunded}</td>
                                    )}
                                    {visibleColumns.action && (
                                        <td className="px-4 py-3">
                                            <button onClick={() => navigate("/MagentoCreditMemoDetail")}
                                                className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
                                                View
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default MagentoCreditMemoList;