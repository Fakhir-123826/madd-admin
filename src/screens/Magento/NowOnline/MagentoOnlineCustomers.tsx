import { useState } from "react";
import {
    FaFilter, FaColumns, FaChevronLeft, FaChevronRight, FaChevronDown, FaSort
} from "react-icons/fa";

const mockCustomers = [
    { id: 1, firstName: "", lastName: "", email: "", lastActivity: "Mar 11, 2026 2:29:24 AM", type: "Visitor" },
];

const MagentoOnlineCustomers = () => {
    const [perPage, setPerPage] = useState(20);
    const [showFilters, setShowFilters] = useState(false);
    const [showColumns, setShowColumns] = useState(false);

    const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
    const tdClass = "px-4 py-3 text-xs text-gray-600 whitespace-nowrap";

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Online Customers</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Currently active visitors and customers</p>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">
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
                                    {["ID", "First Name", "Last Name", "Email", "Last Activity", "Type"].map(col => (
                                        <label key={col} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                                            <input type="checkbox" defaultChecked className="accent-teal-500" /> {col}
                                        </label>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {["First Name", "Last Name", "Email"].map(f => (
                                <div key={f}>
                                    <label className="text-xs font-semibold text-gray-600 mb-2 block">{f}</label>
                                    <input type="text"
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Type</label>
                                <select className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all">
                                    <option value=""></option>
                                    <option value="visitor">Visitor</option>
                                    <option value="customer">Customer</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Last Activity</label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">from</span>
                                        <input type="date"
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">to</span>
                                        <input type="date"
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100">
                            <button onClick={() => setShowFilters(false)}
                                className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 transition-all">
                                Cancel
                            </button>
                            <button className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                                style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* PAGINATION BAR */}
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-gray-400">
                    <span className="font-semibold text-gray-700">{mockCustomers.length}</span> records found
                </span>
                <div className="flex items-center gap-2">
                    <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}
                        className="px-2 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-600 outline-none bg-gray-50">
                        {[20, 30, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <span className="text-xs text-gray-400">per page</span>
                    <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400">
                        <FaChevronLeft className="text-xs" />
                    </button>
                    <span className="text-xs font-medium text-gray-700">1 of 1</span>
                    <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400">
                        <FaChevronRight className="text-xs" />
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: "700px", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                            {[
                                { label: "ID", sortable: true },
                                { label: "First Name", sortable: false },
                                { label: "Last Name", sortable: false },
                                { label: "Email", sortable: false },
                                { label: "Last Activity", sortable: false },
                                { label: "Type", sortable: false },
                            ].map(col => (
                                <th key={col.label} className={thClass}>
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && <FaSort className="text-white/50 cursor-pointer hover:text-white" />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mockCustomers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No online customers found.</td>
                            </tr>
                        ) : (
                            mockCustomers.map((c, idx) => (
                                <tr key={c.id}
                                    style={{ borderBottom: "1px solid #f3f4f6", background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                                    className="hover:bg-blue-50/20 transition-all">
                                    <td className={`${tdClass} font-medium text-gray-700`}>{c.id}</td>
                                    <td className={tdClass}>{c.firstName || <span className="text-gray-300">—</span>}</td>
                                    <td className={tdClass}>{c.lastName || <span className="text-gray-300">—</span>}</td>
                                    <td className={tdClass}>{c.email || <span className="text-gray-300">—</span>}</td>
                                    <td className={tdClass}>{c.lastActivity}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            c.type === "Customer"
                                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                                : "bg-gray-100 text-gray-500 border border-gray-200"
                                        }`}>
                                            {c.type}
                                        </span>
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

export default MagentoOnlineCustomers;