import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaFilter, FaColumns, FaFileExport,
    FaChevronLeft, FaChevronRight, FaChevronDown, FaSort, FaCheck, FaTimes
} from "react-icons/fa";

interface Sitemap {
    id: number;
    filename: string;
    path: string;
    linkForGoogle: string;
    lastGenerated: string;
    storeView: string;
}

const mockSitemaps: Sitemap[] = [
    { id: 1, filename: "sitemap.xml", path: "/media/sitemap/", linkForGoogle: "https://example.com/sitemap.xml", lastGenerated: "2026-03-01 10:00:00", storeView: "Default Store View" },
    { id: 2, filename: "sitemap2.xml", path: "/media/sitemap/", linkForGoogle: "https://example.com/sitemap2.xml", lastGenerated: "2026-02-15 08:30:00", storeView: "nina" },
];

const storeViews = ["Default Store View", "Main Website Store", "neo.exp", "raw mart", "nina"];

const MagentoSitemapList = () => {
    const navigate = useNavigate();
    const [sitemaps, setSitemaps] = useState<Sitemap[]>(mockSitemaps);
    const [selected, setSelected] = useState<number[]>([]);
    const [perPage, setPerPage] = useState(20);
    const [successMsg, setSuccessMsg] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [showColumns, setShowColumns] = useState(false);

    // Filters
    const [filterId, setFilterId] = useState("");
    const [filterFilename, setFilterFilename] = useState("");
    const [filterPath, setFilterPath] = useState("");
    const [filterLink, setFilterLink] = useState("");
    const [filterFrom, setFilterFrom] = useState("");
    const [filterTo, setFilterTo] = useState("");
    const [filterStore, setFilterStore] = useState("");

    const handleReset = () => {
        setFilterId(""); setFilterFilename(""); setFilterPath("");
        setFilterLink(""); setFilterFrom(""); setFilterTo(""); setFilterStore("");
        setShowFilters(false);
    };

    const filtered = sitemaps.filter(s =>
        (!filterId || String(s.id).includes(filterId)) &&
        (!filterFilename || s.filename.toLowerCase().includes(filterFilename.toLowerCase())) &&
        (!filterPath || s.path.toLowerCase().includes(filterPath.toLowerCase())) &&
        (!filterLink || s.linkForGoogle.toLowerCase().includes(filterLink.toLowerCase())) &&
        (!filterStore || s.storeView === filterStore)
    );

    const toggleSelect = (id: number) =>
        setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    const toggleAll = () =>
        setSelected(selected.length === filtered.length ? [] : filtered.map(s => s.id));

    const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
    const tdClass = "px-4 py-3 text-xs text-gray-600 whitespace-nowrap";

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Site Map</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Manage Site Maps</p>
                    </div>
                    <button onClick={() => navigate("/AddMagentoSitemap")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                        style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                        + Add Sitemap
                    </button>
                </div>

                {/* Success Banner */}
                {successMsg && (
                    <div className="flex items-center justify-between gap-3 mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <FaCheck className="text-white text-[8px]" />
                            </div>
                            <span className="text-xs font-medium text-green-700">{successMsg}</span>
                        </div>
                        <button onClick={() => setSuccessMsg("")} className="text-green-400 hover:text-green-600">
                            <FaTimes className="text-xs" />
                        </button>
                    </div>
                )}

                {/* Toolbar — Filters / Default View / Columns / Export */}
                <div className="flex items-center justify-end gap-2">
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
                                    {["ID", "Filename", "Path", "Link for Google", "Last Generated", "Store View"].map(col => (
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

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">ID</label>
                                <input type="text" value={filterId} onChange={e => setFilterId(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Filename</label>
                                <input type="text" value={filterFilename} onChange={e => setFilterFilename(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Path</label>
                                <input type="text" value={filterPath} onChange={e => setFilterPath(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Link for Google</label>
                                <input type="text" value={filterLink} onChange={e => setFilterLink(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Last Generated</label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">from</span>
                                        <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">to</span>
                                        <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Store View</label>
                                <select value={filterStore} onChange={e => setFilterStore(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all">
                                    <option value=""></option>
                                    {storeViews.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                            <button onClick={handleReset}
                                className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2">
                                Cancel
                            </button>
                            <button onClick={() => setShowFilters(false)}
                                className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90"
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
                        <option value="generate">Generate</option>
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
                <table style={{ width: "100%", minWidth: "900px", borderCollapse: "collapse" }}>
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
                                { label: "Filename", s: false },
                                { label: "Path", s: false },
                                { label: "Link for Google", s: false },
                                { label: "Last Generated", s: true },
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
                                <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
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
                                    <td className={tdClass}>{s.filename}</td>
                                    <td className={tdClass}>{s.path}</td>
                                    <td className={tdClass}>
                                        <a href={s.linkForGoogle} target="_blank" rel="noreferrer"
                                            className="text-blue-500 hover:underline">{s.linkForGoogle}</a>
                                    </td>
                                    <td className={tdClass}>{s.lastGenerated}</td>
                                    <td className={tdClass}>{s.storeView}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => navigate(`/AddMagentoSitemap/${s.id}`)}
                                                className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
                                                Edit
                                            </button>
                                            <button className="text-xs font-medium text-teal-500 hover:text-teal-700 transition-colors">
                                                Generate
                                            </button>
                                            <button onClick={() => setSitemaps(prev => prev.filter(sm => sm.id !== s.id))}
                                                className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors">
                                                Delete
                                            </button>
                                        </div>
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

export default MagentoSitemapList;