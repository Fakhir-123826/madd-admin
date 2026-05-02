import { useState, useMemo } from "react";
import {
    FaFilter, FaColumns, FaChevronLeft, FaChevronRight, FaChevronDown, FaSort
} from "react-icons/fa";

// ============ FAKE ONLINE CUSTOMERS DATA ============
interface OnlineCustomer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    lastActivity: string;
    type: "Customer" | "Visitor";
    ipAddress: string;
    location: string;
    device: string;
    browser: string;
}

const firstNames = [
    "John", "Emma", "Michael", "Sophia", "William", "Olivia", "James", "Ava",
    "Robert", "Isabella", "David", "Mia", "Richard", "Charlotte", "Joseph",
    "Amelia", "Thomas", "Harper", "Charles", "Evelyn", "Daniel", "Grace",
    "Matthew", "Victoria", "Anthony", "Hannah", "Mark", "Lily", "Paul", "Zoe"
];

const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Wilson", "Anderson", "Taylor", "Thomas", "Moore",
    "Jackson", "Martin", "Lee", "White", "Harris", "Clark", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Green"
];

const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "company.com"];
const locations = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "Austin, TX", "Seattle, WA", "Denver, CO", "Boston, MA", "Miami, FL"];
const devices = ["Desktop", "Mobile", "Tablet"];
const browsers = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];

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

const generateFakeOnlineCustomers = (count: number): OnlineCustomer[] => {
    const customers: OnlineCustomer[] = [];
    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - 60); // Last 60 minutes
    
    for (let i = 1; i <= count; i++) {
        const isCustomer = Math.random() > 0.4; // 40% visitors, 60% customers
        const firstName = isCustomer ? firstNames[Math.floor(Math.random() * firstNames.length)] : "";
        const lastName = isCustomer ? lastNames[Math.floor(Math.random() * lastNames.length)] : "";
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const email = isCustomer ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@${domain}` : "";
        const lastActivity = generateRandomDate(startDate, new Date());
        const location = locations[Math.floor(Math.random() * locations.length)];
        const device = devices[Math.floor(Math.random() * devices.length)];
        const browser = browsers[Math.floor(Math.random() * browsers.length)];
        
        customers.push({
            id: i,
            firstName: firstName,
            lastName: lastName,
            email: email,
            lastActivity: formatDate(lastActivity),
            type: isCustomer ? "Customer" : "Visitor",
            ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            location: location,
            device: device,
            browser: browser,
        });
    }
    
    // Sort by last activity (most recent first)
    return customers.sort((a, b) => {
        const dateA = new Date(a.lastActivity);
        const dateB = new Date(b.lastActivity);
        return dateB.getTime() - dateA.getTime();
    });
};

const FAKE_ONLINE_CUSTOMERS = generateFakeOnlineCustomers(50);

// ============ MAIN COMPONENT ============
function MagentoOnlineCustomers() {
    const [perPage, setPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [showColumns, setShowColumns] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<string>("id");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    // Filter states
    const [filters, setFilters] = useState({
        firstName: "",
        lastName: "",
        email: "",
        type: "",
        location: "",
        device: "",
        browser: "",
        lastActivityFrom: "",
        lastActivityTo: "",
    });

    // Column visibility state
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        lastActivity: true,
        type: true,
        ipAddress: true,
        location: true,
        device: true,
        browser: true,
    });

    // Apply filters and search
    const filteredCustomers = useMemo(() => {
        let result = [...FAKE_ONLINE_CUSTOMERS];

        console.log("Original count:", result.length);
        console.log("Applied filters:", filters);

        // Global search
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(
                (customer) =>
                    (customer.firstName && customer.firstName.toLowerCase().includes(searchLower)) ||
                    (customer.lastName && customer.lastName.toLowerCase().includes(searchLower)) ||
                    (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
                    customer.ipAddress.includes(searchLower) ||
                    customer.location.toLowerCase().includes(searchLower)
            );
            console.log("After search filter:", result.length);
        }

        // Apply specific filters
        if (filters.firstName) {
            result = result.filter(c => 
                c.firstName && c.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
            );
            console.log("After firstName filter:", result.length);
        }
        if (filters.lastName) {
            result = result.filter(c => 
                c.lastName && c.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
            );
            console.log("After lastName filter:", result.length);
        }
        if (filters.email) {
            result = result.filter(c => 
                c.email && c.email.toLowerCase().includes(filters.email.toLowerCase())
            );
            console.log("After email filter:", result.length);
        }
        if (filters.type) {
            result = result.filter(c => c.type === filters.type);
            console.log("After type filter:", result.length);
        }
        if (filters.location) {
            result = result.filter(c => 
                c.location.toLowerCase().includes(filters.location.toLowerCase())
            );
            console.log("After location filter:", result.length);
        }
        if (filters.device) {
            result = result.filter(c => c.device === filters.device);
            console.log("After device filter:", result.length);
        }
        if (filters.browser) {
            result = result.filter(c => c.browser === filters.browser);
            console.log("After browser filter:", result.length);
        }
        if (filters.lastActivityFrom) {
            result = result.filter(c => 
                new Date(c.lastActivity) >= new Date(filters.lastActivityFrom)
            );
            console.log("After lastActivityFrom filter:", result.length);
        }
        if (filters.lastActivityTo) {
            result = result.filter(c => 
                new Date(c.lastActivity) <= new Date(filters.lastActivityTo)
            );
            console.log("After lastActivityTo filter:", result.length);
        }

        // Apply sorting
        result.sort((a, b) => {
            let aVal: any = a[sortField as keyof OnlineCustomer];
            let bVal: any = b[sortField as keyof OnlineCustomer];
            
            if (sortField === "id") {
                return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
            }
            
            if (sortField === "lastActivity") {
                const dateA = new Date(a.lastActivity);
                const dateB = new Date(b.lastActivity);
                return sortDirection === "asc" 
                    ? dateA.getTime() - dateB.getTime()
                    : dateB.getTime() - dateA.getTime();
            }
            
            if (typeof aVal === "string") {
                return sortDirection === "asc" 
                    ? (aVal || "").localeCompare(bVal || "")
                    : (bVal || "").localeCompare(aVal || "");
            }
            
            return 0;
        });

        console.log("Final filtered count:", result.length);
        return result;
    }, [FAKE_ONLINE_CUSTOMERS, searchTerm, filters, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredCustomers.length / perPage);
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    const handleFilterChange = (key: string, value: string) => {
        console.log(`Filter changed: ${key} = ${value}`);
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const resetFilters = () => {
        console.log("Resetting all filters");
        setFilters({
            firstName: "",
            lastName: "",
            email: "",
            type: "",
            location: "",
            device: "",
            browser: "",
            lastActivityFrom: "",
            lastActivityTo: "",
        });
        setSearchTerm("");
        setCurrentPage(1);
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
    const tdClass = "px-4 py-3 text-xs text-gray-600 whitespace-nowrap";

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Online Customers</h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Currently active visitors and customers ({FAKE_ONLINE_CUSTOMERS.length} active)
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Search Bar */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus-within:border-teal-400 focus-within:bg-white transition-all flex-1 max-w-md">
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search by name, email, IP, location..."
                            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400" 
                        />
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
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
                                    <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-52 space-y-2">
                                        {Object.keys(visibleColumns).map(col => (
                                            <label key={col} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={visibleColumns[col as keyof typeof visibleColumns]}
                                                    onChange={() => {
                                                        setVisibleColumns(prev => ({ 
                                                            ...prev, 
                                                            [col]: !prev[col as keyof typeof prev] 
                                                        }));
                                                    }}
                                                    className="accent-teal-500" 
                                                /> 
                                                {col === "id" ? "ID" :
                                                 col === "firstName" ? "First Name" :
                                                 col === "lastName" ? "Last Name" :
                                                 col === "lastActivity" ? "Last Activity" :
                                                 col === "ipAddress" ? "IP Address" :
                                                 col.charAt(0).toUpperCase() + col.slice(1)}
                                            </label>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">First Name</label>
                                <input 
                                    type="text" 
                                    value={filters.firstName}
                                    onChange={(e) => handleFilterChange("firstName", e.target.value)}
                                    placeholder="Enter first name"
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Last Name</label>
                                <input 
                                    type="text" 
                                    value={filters.lastName}
                                    onChange={(e) => handleFilterChange("lastName", e.target.value)}
                                    placeholder="Enter last name"
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Email</label>
                                <input 
                                    type="text" 
                                    value={filters.email}
                                    onChange={(e) => handleFilterChange("email", e.target.value)}
                                    placeholder="Enter email"
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Type</label>
                                <select 
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange("type", e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all"
                                >
                                    <option value="">All Types</option>
                                    <option value="Customer">Customer</option>
                                    <option value="Visitor">Visitor</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Location</label>
                                <input 
                                    type="text" 
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange("location", e.target.value)}
                                    placeholder="City, State"
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Device</label>
                                <select 
                                    value={filters.device}
                                    onChange={(e) => handleFilterChange("device", e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all"
                                >
                                    <option value="">All Devices</option>
                                    <option value="Desktop">Desktop</option>
                                    <option value="Mobile">Mobile</option>
                                    <option value="Tablet">Tablet</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Browser</label>
                                <select 
                                    value={filters.browser}
                                    onChange={(e) => handleFilterChange("browser", e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all"
                                >
                                    <option value="">All Browsers</option>
                                    <option value="Chrome">Chrome</option>
                                    <option value="Firefox">Firefox</option>
                                    <option value="Safari">Safari</option>
                                    <option value="Edge">Edge</option>
                                    <option value="Opera">Opera</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Last Activity</label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">from</span>
                                        <input 
                                            type="datetime-local" 
                                            value={filters.lastActivityFrom}
                                            onChange={(e) => handleFilterChange("lastActivityFrom", e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" 
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">to</span>
                                        <input 
                                            type="datetime-local" 
                                            value={filters.lastActivityTo}
                                            onChange={(e) => handleFilterChange("lastActivityTo", e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" 
                                        />
                                    </div>
                                </div>
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

            {/* PAGINATION BAR */}
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2 bg-gray-50">
                <span className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">{filteredCustomers.length}</span> records found
                    {(searchTerm || Object.values(filters).some(v => v)) && (
                        <span className="ml-2 text-teal-600">(filtered)</span>
                    )}
                </span>
                <div className="flex items-center gap-2">
                    <select value={perPage} onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                        className="px-2 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-600 outline-none bg-white">
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
                <table style={{ width: "100%", minWidth: "900px", borderCollapse: "collapse" }} className="w-max min-w-full text-sm border-separate border-spacing-y-3">
                    <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                        <tr>
                            {visibleColumns.id && (
                                <th className={thClass}>
                                    <button onClick={() => handleSort("id")} className="flex items-center gap-1">
                                        ID <FaSort className="text-white/50 hover:text-white" />
                                    </button>
                                </th>
                            )}
                            {visibleColumns.firstName && <th className={thClass}>First Name</th>}
                            {visibleColumns.lastName && <th className={thClass}>Last Name</th>}
                            {visibleColumns.email && <th className={thClass}>Email</th>}
                            {visibleColumns.lastActivity && (
                                <th className={thClass}>
                                    <button onClick={() => handleSort("lastActivity")} className="flex items-center gap-1">
                                        Last Activity <FaSort className="text-white/50 hover:text-white" />
                                    </button>
                                </th>
                            )}
                            {visibleColumns.type && <th className={thClass}>Type</th>}
                            {visibleColumns.ipAddress && <th className={thClass}>IP Address</th>}
                            {visibleColumns.location && <th className={thClass}>Location</th>}
                            {visibleColumns.device && <th className={thClass}>Device</th>}
                            {visibleColumns.browser && <th className={thClass}>Browser</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedCustomers.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-12 text-gray-400 text-sm">
                                    No online customers found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            paginatedCustomers.map((c, idx) => (
                                <tr key={c.id}
                                    style={{ borderBottom: "1px solid #f3f4f6", background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                                    className="hover:bg-blue-50/20 transition-all">
                                    {visibleColumns.id && (
                                        <td className={`${tdClass} font-medium text-gray-700`}>{c.id}</td>
                                    )}
                                    {visibleColumns.firstName && (
                                        <td className={tdClass}>
                                            {c.firstName || <span className="text-gray-300">—</span>}
                                        </td>
                                    )}
                                    {visibleColumns.lastName && (
                                        <td className={tdClass}>
                                            {c.lastName || <span className="text-gray-300">—</span>}
                                        </td>
                                    )}
                                    {visibleColumns.email && (
                                        <td className={tdClass}>
                                            {c.email || <span className="text-gray-300">—</span>}
                                        </td>
                                    )}
                                    {visibleColumns.lastActivity && (
                                        <td className={tdClass}>{c.lastActivity}</td>
                                    )}
                                    {visibleColumns.type && (
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                c.type === "Customer"
                                                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                                            }`}>
                                                {c.type}
                                            </span>
                                        </td>
                                    )}
                                    {visibleColumns.ipAddress && (
                                        <td className={`${tdClass} font-mono text-xs`}>{c.ipAddress}</td>
                                    )}
                                    {visibleColumns.location && (
                                        <td className={tdClass}>{c.location}</td>
                                    )}
                                    {visibleColumns.device && (
                                        <td className={tdClass}>
                                            <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs">
                                                {c.device}
                                            </span>
                                        </td>
                                    )}
                                    {visibleColumns.browser && (
                                        <td className={tdClass}>{c.browser}</td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default MagentoOnlineCustomers;