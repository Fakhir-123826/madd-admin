import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaSearch, FaColumns, FaFileExport,
    FaChevronLeft, FaChevronRight, FaChevronDown, FaSort, FaPlus, FaTimes
} from "react-icons/fa";

const mockRules = [
    { id: 1, rule: "Buy 3 tee shirts and get the 4th free", couponCode: "", start: "", end: "--", status: "Active", websites: "Main Website, my web site, neo.exp", priority: 0 },
    { id: 2, rule: "Spend $50 or more - shipping is free!", couponCode: "", start: "", end: "--", status: "Active", websites: "Main Website, my web site, neo.exp", priority: 0 },
    { id: 3, rule: "20% OFF Ever $200-plus purchase!*", couponCode: "", start: "", end: "--", status: "Active", websites: "Main Website, my web site, neo.exp", priority: 0 },
    { id: 4, rule: "$4 Luma water bottle (save 70%)", couponCode: "H20", start: "", end: "--", status: "Active", websites: "Main Website, my web site, neo.exp", priority: 0 },
];

const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "active": return "bg-green-50 text-green-600 border border-green-200";
        case "inactive": return "bg-red-50 text-red-500 border border-red-200";
        default: return "bg-gray-100 text-gray-500";
    }
};

const MagentoCartPriceRulesList = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<number[]>([]);
    const [perPage, setPerPage] = useState(20);
    const [showColumns, setShowColumns] = useState(false);

    // Inline filter states
    const [filters, setFilters] = useState({
        id: "", rule: "", couponCode: "",
        startFrom: "", startTo: "", endFrom: "", endTo: "",
        status: "", website: "", priority: "",
    });
    const [appliedFilters, setAppliedFilters] = useState({ ...filters });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSearch = () => setAppliedFilters({ ...filters });

    const handleReset = () => {
        const empty = { id: "", rule: "", couponCode: "", startFrom: "", startTo: "", endFrom: "", endTo: "", status: "", website: "", priority: "" };
        setFilters(empty);
        setAppliedFilters(empty);
    };

    const filtered = mockRules.filter(r =>
        (!appliedFilters.id || String(r.id).includes(appliedFilters.id)) &&
        (!appliedFilters.rule || r.rule.toLowerCase().includes(appliedFilters.rule.toLowerCase())) &&
        (!appliedFilters.couponCode || r.couponCode.toLowerCase().includes(appliedFilters.couponCode.toLowerCase())) &&
        (!appliedFilters.status || r.status.toLowerCase() === appliedFilters.status.toLowerCase())
    );

    const toggleSelect = (id: number) =>
        setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    const toggleAll = () =>
        setSelected(selected.length === filtered.length ? [] : filtered.map(i => i.id));

    const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
    const tdClass = "px-4 py-3 text-xs text-gray-600";
    const filterInputClass = "w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-white transition-all";

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Cart Price Rules</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Manage all cart price rules</p>
                    </div>
                    <button onClick={() => navigate("/AddCartPriceRule")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                        style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                        <FaPlus className="text-xs" /> Add New Rule
                    </button>
                </div>

                {/* Top toolbar */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <button onClick={handleSearch}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                            style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                            <FaSearch className="text-xs" /> Search
                        </button>
                        <button onClick={handleReset}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-blue-500 text-xs font-medium hover:bg-gray-50 transition-all">
                            <FaTimes className="text-xs" /> Reset Filter
                        </button>
                        <span className="text-xs text-gray-400 ml-1">
                            <span className="font-semibold text-gray-700">{filtered.length}</span> records found
                            {selected.length > 0 && <span className="ml-2 text-teal-600 font-medium">({selected.length} selected)</span>}
                        </span>
                    </div>
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
                        <div className="relative">
                            <button onClick={() => setShowColumns(!showColumns)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50">
                                <FaColumns className="text-xs" /> Columns <FaChevronDown className="text-xs opacity-50" />
                            </button>
                            {showColumns && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowColumns(false)} />
                                    <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-44 space-y-2">
                                        {["ID", "Rule", "Coupon Code", "Start", "End", "Status", "Web Site", "Priority"].map(col => (
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
            </div>

            {/* TABLE with inline filters */}
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: "950px", borderCollapse: "collapse" }}>
                    <thead>
                        {/* GRADIENT HEADER */}
                        <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                            <th className="px-4 py-3 text-left w-10">
                                <input type="checkbox"
                                    checked={selected.length === filtered.length && filtered.length > 0}
                                    onChange={toggleAll}
                                    className="w-3.5 h-3.5 accent-white" />
                            </th>
                            {[
                                { label: "ID", sortable: true },
                                { label: "Rule", sortable: true },
                                { label: "Coupon Code", sortable: false },
                                { label: "Start", sortable: false },
                                { label: "End", sortable: false },
                                { label: "Status", sortable: false },
                                { label: "Web Site", sortable: false },
                                { label: "Priority", sortable: true },
                            ].map(col => (
                                <th key={col.label} className={thClass}>
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && <FaSort className="text-white/50 cursor-pointer hover:text-white" />}
                                    </div>
                                </th>
                            ))}
                        </tr>

                        {/* INLINE FILTER ROW */}
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <td className="px-4 py-2" />
                            <td className="px-3 py-2">
                                <input name="id" value={filters.id} onChange={handleFilterChange}
                                    type="number" className={filterInputClass} placeholder="ID" />
                            </td>
                            <td className="px-3 py-2">
                                <input name="rule" value={filters.rule} onChange={handleFilterChange}
                                    type="text" className={filterInputClass} placeholder="Rule name" />
                            </td>
                            <td className="px-3 py-2">
                                <input name="couponCode" value={filters.couponCode} onChange={handleFilterChange}
                                    type="text" className={filterInputClass} placeholder="Coupon code" />
                            </td>
                            <td className="px-3 py-2">
                                <div className="space-y-1">
                                    <input name="startFrom" value={filters.startFrom} onChange={handleFilterChange}
                                        type="date" className={filterInputClass} placeholder="From" />
                                    <input name="startTo" value={filters.startTo} onChange={handleFilterChange}
                                        type="date" className={filterInputClass} placeholder="To" />
                                </div>
                            </td>
                            <td className="px-3 py-2">
                                <div className="space-y-1">
                                    <input name="endFrom" value={filters.endFrom} onChange={handleFilterChange}
                                        type="date" className={filterInputClass} placeholder="From" />
                                    <input name="endTo" value={filters.endTo} onChange={handleFilterChange}
                                        type="date" className={filterInputClass} placeholder="To" />
                                </div>
                            </td>
                            <td className="px-3 py-2">
                                <select name="status" value={filters.status} onChange={handleFilterChange}
                                    className={filterInputClass}>
                                    <option value=""></option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </td>
                            <td className="px-3 py-2">
                                <select name="website" value={filters.website} onChange={handleFilterChange}
                                    className={filterInputClass}>
                                    <option value=""></option>
                                    <option>Main Website</option>
                                    <option>my web site</option>
                                    <option>neo.exp</option>
                                </select>
                            </td>
                            <td className="px-3 py-2">
                                <input name="priority" value={filters.priority} onChange={handleFilterChange}
                                    type="number" className={filterInputClass} placeholder="Priority" />
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">No rules found.</td>
                            </tr>
                        ) : (
                            filtered.map((r, idx) => (
                                <tr key={r.id}
                                    style={{ borderBottom: "1px solid #f3f4f6", background: selected.includes(r.id) ? "#f0fdfa" : idx % 2 === 0 ? "#fff" : "#fafafa" }}
                                    className="hover:bg-blue-50/20 transition-all">
                                    <td className="px-4 py-3">
                                        <input type="checkbox" checked={selected.includes(r.id)}
                                            onChange={() => toggleSelect(r.id)}
                                            className="w-3.5 h-3.5 accent-teal-500" />
                                    </td>
                                    <td className={`${tdClass} font-medium text-gray-700`}>{r.id}</td>
                                    <td className={tdClass}>
                                        <button onClick={() => navigate(`/AddCartPriceRule/${r.id}`)}
                                            className="text-blue-500 hover:text-blue-700 hover:underline text-xs font-medium transition-colors text-left">
                                            {r.rule}
                                        </button>
                                    </td>
                                    <td className={tdClass}>{r.couponCode || <span className="text-gray-300">—</span>}</td>
                                    <td className={tdClass}>{r.start || <span className="text-gray-300">—</span>}</td>
                                    <td className={tdClass}>{r.end}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(r.status)}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className={tdClass}>{r.websites}</td>
                                    <td className={`${tdClass} font-medium text-gray-700`}>{r.priority}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default MagentoCartPriceRulesList;