import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaSearch, FaFilter, FaColumns, FaFileExport,
    FaChevronLeft, FaChevronRight, FaChevronDown, FaSort
} from "react-icons/fa";

interface Synonym {
    id: number;
    synonyms: string;
    website: string;
    storeView: string;
}

const mockSynonyms: Synonym[] = [
    { id: 1, synonyms: "shoes, footwear, sneakers", website: "Main Website", storeView: "Default Store View" },
    { id: 2, synonyms: "laptop, notebook, computer", website: "Main Website", storeView: "Main Website Store" },
    { id: 3, synonyms: "shirt, top, tee", website: "my web site", storeView: "neo.exp" },
];

const websites = ["Main Website", "my web site", "neo.exp"];
const storeViews = ["Default Store View", "Main Website Store", "neo.exp", "raw mart", "nina"];

const MagentoSearchSynonymsList = () => {
    const navigate = useNavigate();
    const [synonyms, setSynonyms] = useState<Synonym[]>(mockSynonyms);
    const [selected, setSelected] = useState<number[]>([]);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [showColumns, setShowColumns] = useState(false);

    // Filters
    const [filterWebsite, setFilterWebsite] = useState("");
    const [filterStoreView, setFilterStoreView] = useState("");
    const [filterId, setFilterId] = useState("");
    const [filterSynonyms, setFilterSynonyms] = useState("");

    const handleCancelFilters = () => {
        setFilterWebsite(""); setFilterStoreView("");
        setFilterId(""); setFilterSynonyms("");
        setShowFilters(false);
    };

    const filtered = synonyms.filter(s =>
        (!search || s.synonyms.toLowerCase().includes(search.toLowerCase())) &&
        (!filterWebsite || s.website === filterWebsite) &&
        (!filterStoreView || s.storeView === filterStoreView) &&
        (!filterId || String(s.id).includes(filterId)) &&
        (!filterSynonyms || s.synonyms.toLowerCase().includes(filterSynonyms.toLowerCase()))
    );

    const toggleSelect = (id: number) =>
        setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    const toggleAll = () =>
        setSelected(selected.length === filtered.length ? [] : filtered.map(s => s.id));

    const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
    const tdClass = "px-4 py-3 text-xs text-gray-600";

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Search Synonyms</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Manage search synonym groups</p>
                    </div>
                    <button onClick={() => navigate("/AddMagentoSearchSynonym")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                        style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                        + New Synonym Group
                    </button>
                </div>

                {/* Search bar + toolbar */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus-within:border-teal-400 focus-within:bg-white transition-all w-64">
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search by keyword"
                            className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder-gray-400" />
                        <FaSearch className="text-gray-400 text-xs" />
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
                                        {["ID", "Synonyms", "Website", "Store View"].map(col => (
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
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Website</label>
                                <select value={filterWebsite} onChange={e => setFilterWebsite(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all">
                                    <option value="">--</option>
                                    {websites.map(w => <option key={w}>{w}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Store View</label>
                                <select value={filterStoreView} onChange={e => setFilterStoreView(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all">
                                    <option value="">--</option>
                                    {storeViews.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">ID</label>
                                <input type="text" value={filterId} onChange={e => setFilterId(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Synonyms</label>
                                <input type="text" value={filterSynonyms} onChange={e => setFilterSynonyms(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                            <button onClick={handleCancelFilters}
                                className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2">
                                Cancel
                            </button>
                            <button className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90"
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
                    <select className="px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 outline-none bg-gray-50">
                        <option value="">Actions</option>
                        <option value="delete">Delete</option>
                    </select>
                    <span className="text-xs text-gray-400">
                        <span className="font-semibold text-gray-700">{filtered.length}</span> records found
                        {selected.length > 0 && <span className="ml-2 text-teal-600 font-medium">({selected.length} selected)</span>}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}
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
                            <th className="px-4 py-3 text-left w-10">
                                <input type="checkbox"
                                    checked={selected.length === filtered.length && filtered.length > 0}
                                    onChange={toggleAll}
                                    className="w-3.5 h-3.5 accent-white" />
                            </th>
                            {[
                                { label: "ID", s: true },
                                { label: "Synonyms", s: false },
                                { label: "Website", s: false },
                                { label: "Store View", s: false },
                                { label: "Action", s: false },
                            ].map(col => (
                                <th key={col.label} className={thClass}>
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.s && <FaSort className="text-white/50 cursor-pointer hover:text-white" />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                                    We couldn't find any records.
                                </td>
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
                                    <td className={`${tdClass} font-medium text-gray-700`}>{s.id}</td>
                                    <td className={tdClass}>{s.synonyms}</td>
                                    <td className={tdClass}>{s.website}</td>
                                    <td className={tdClass}>{s.storeView}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => navigate(`/AddMagentoSearchSynonym/${s.id}`)}
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

export default MagentoSearchSynonymsList;