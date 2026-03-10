import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaSearch, FaFilter, FaColumns, FaFileExport,
    FaChevronLeft, FaChevronRight, FaChevronDown, FaSort
} from "react-icons/fa";

const mockShipments = [
    { id: 1, shipment: "000000001", shipDate: "Feb 24, 2026 1:06:30 AM", order: "000000001", orderDate: "Feb 24, 2026 1:06:20 AM", shipTo: "Veronica Costello", totalQty: "1.0000" },
    { id: 2, shipment: "000000002", shipDate: "Feb 24, 2026 1:06:34 AM", order: "000000002", orderDate: "Feb 24, 2026 1:06:34 AM", shipTo: "Veronica Costello", totalQty: "1.0000" },
];

const MagentoShipmentList = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<number[]>([]);
    const [perPage, setPerPage] = useState(20);
    const [showFilters, setShowFilters] = useState(false);
    const [showColumns, setShowColumns] = useState(false);
    const [action, setAction] = useState("");

    const filtered = mockShipments.filter(s =>
        s.shipment.includes(search) ||
        s.shipTo.toLowerCase().includes(search.toLowerCase()) ||
        s.order.includes(search)
    );

    const toggleSelect = (id: number) =>
        setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

    const toggleAll = () =>
        setSelected(selected.length === filtered.length ? [] : filtered.map(i => i.id));

    const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
    const tdClass = "px-4 py-3 text-xs text-gray-600 whitespace-nowrap";

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Shipments</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Manage all shipments</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Search */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus-within:border-teal-400 focus-within:bg-white transition-all w-64">
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by keyword"
                            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400" />
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
                                    <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-44 space-y-2">
                                        {["Shipment", "Ship Date", "Order #", "Order Date", "Ship-to Name", "Total Qty"].map((col) => (
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
                        {/* Row 1 — Range filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { label: "Ship Date", fromName: "shipDateFrom", toName: "shipDateTo", type: "date" },
                                { label: "Order Date", fromName: "orderDateFrom", toName: "orderDateTo", type: "date" },
                                { label: "Total Quantity", fromName: "qtyFrom", toName: "qtyTo", type: "number" },
                            ].map((f) => (
                                <div key={f.label}>
                                    <label className="text-xs font-semibold text-gray-600 mb-2 block">{f.label}</label>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 w-6">from</span>
                                            <input type={f.type}
                                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 w-6">to</span>
                                            <input type={f.type}
                                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Row 2 — Text filters + buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
                            {[
                                { label: "Shipment #", type: "text" },
                                { label: "Order #", type: "text" },
                                { label: "Ship-to Name", type: "text" },
                            ].map((f) => (
                                <div key={f.label}>
                                    <label className="text-xs font-semibold text-gray-600 mb-2 block">{f.label}</label>
                                    <input type={f.type}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                </div>
                            ))}
                            <div className="flex items-end justify-end gap-2">
                                <button className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 transition-all">
                                    Cancel
                                </button>
                                <button className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
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
                        <option value="print">Print Selected</option>
                    </select>
                    <span className="text-xs text-gray-400">
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
                </div>
            </div>

            {/* TABLE */}
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: "800px", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                            <th className="px-4 py-3 text-left w-10">
                                <input type="checkbox"
                                    checked={selected.length === filtered.length && filtered.length > 0}
                                    onChange={toggleAll}
                                    className="w-3.5 h-3.5 accent-white" />
                            </th>
                            {[
                                { label: "Shipment", sortable: true },
                                { label: "Ship Date", sortable: false },
                                { label: "Order #", sortable: false },
                                { label: "Order Date", sortable: false },
                                { label: "Ship-to Name", sortable: false },
                                { label: "Total Quantity", sortable: false },
                                { label: "Action", sortable: false },
                            ].map((col) => (
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
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">No shipments found.</td>
                            </tr>
                        ) : (
                            filtered.map((s, idx) => (
                                <tr key={s.id}
                                    style={{ borderBottom: "1px solid #f3f4f6", background: selected.includes(s.id) ? "#f0fdfa" : idx % 2 === 0 ? "#fff" : "#fafafa" }}
                                    className="hover:bg-blue-50/20 transition-all">
                                    <td className="px-4 py-3">
                                        <input type="checkbox" checked={selected.includes(s.id)}
                                            onChange={() => toggleSelect(s.id)}
                                            className="w-3.5 h-3.5 accent-teal-500" />
                                    </td>
                                    <td className={`${tdClass} font-medium text-gray-700`}>{s.shipment}</td>
                                    <td className={tdClass}>{s.shipDate}</td>
                                    <td className={tdClass}>{s.order}</td>
                                    <td className={tdClass}>{s.orderDate}</td>
                                    <td className={tdClass}>{s.shipTo}</td>
                                    <td className={tdClass}>{s.totalQty}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => navigate(`/shipment/${s.shipment}`)}
                                            className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
                                            View
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

export default MagentoShipmentList;