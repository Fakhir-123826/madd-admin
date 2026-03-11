import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTimes, FaChevronLeft, FaChevronRight, FaSort } from "react-icons/fa";

interface SearchTerm {
    id: number;
    searchQuery: string;
    store: string[];
    results: number;
    uses: number;
    redirectUrl: string;
    suggestedTerms: string;
}

const mockTerms: SearchTerm[] = [
    { id: 1, searchQuery: "nino", store: ["neo.exp", "raw mart", "nina"], results: 0, uses: 0, redirectUrl: "https://www.pop.com", suggestedTerms: "Yes" },
    { id: 2, searchQuery: "shoes", store: ["Main Website"], results: 12, uses: 45, redirectUrl: "", suggestedTerms: "No" },
    { id: 3, searchQuery: "laptop", store: ["Main Website Store"], results: 8, uses: 30, redirectUrl: "https://www.laptops.com", suggestedTerms: "Yes" },
];

const storeViews = ["Default Store View", "Main Website", "Main Website Store", "neo.exp", "raw mart", "nina"];

const MagentoSearchTermsList = () => {
    const navigate = useNavigate();
    const [terms, setTerms] = useState<SearchTerm[]>(mockTerms);
    const [selected, setSelected] = useState<number[]>([]);
    const [perPage, setPerPage] = useState(20);
    const [successMsg, setSuccessMsg] = useState("You saved the search term.");

    // Inline filters
    const [filterStatus, setFilterStatus] = useState("Any");
    const [filterQuery, setFilterQuery] = useState("");
    const [filterStore, setFilterStore] = useState("");
    const [filterResultFrom, setFilterResultFrom] = useState("");
    const [filterResultTo, setFilterResultTo] = useState("");
    const [filterUsesFrom, setFilterUsesFrom] = useState("");
    const [filterUsesTo, setFilterUsesTo] = useState("");
    const [filterRedirect, setFilterRedirect] = useState("");
    const [filterSuggested, setFilterSuggested] = useState("");

    const handleReset = () => {
        setFilterStatus("Any"); setFilterQuery(""); setFilterStore("");
        setFilterResultFrom(""); setFilterResultTo("");
        setFilterUsesFrom(""); setFilterUsesTo("");
        setFilterRedirect(""); setFilterSuggested("");
    };

    const toggleSelect = (id: number) =>
        setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    const toggleAll = () =>
        setSelected(selected.length === terms.length ? [] : terms.map(t => t.id));

    const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
    const tdClass = "px-4 py-3 text-xs text-gray-600";
    const filterInput = "w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-teal-400 bg-white transition-all";

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Search Terms</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Manage catalog search terms</p>
                    </div>
                    <button onClick={() => navigate("/AddMagentoSearchTerm")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                        style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                        + Add New Search Term
                    </button>
                </div>

                {/* Success Banner */}
                {successMsg && (
                    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
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
            </div>

            {/* ACTIONS + PAGINATION */}
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold hover:opacity-90"
                        style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                        Search
                    </button>
                    <button onClick={handleReset}
                        className="text-xs font-medium text-blue-400 hover:text-blue-600 transition-colors">
                        Reset Filter
                    </button>
                    <select className="px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 outline-none bg-gray-50">
                        <option value="">Actions</option>
                        <option value="delete">Delete</option>
                    </select>
                    <span className="text-xs text-gray-400">
                        <span className="font-semibold text-gray-700">{terms.length}</span> records found
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
                                    checked={selected.length === terms.length && terms.length > 0}
                                    onChange={toggleAll}
                                    className="w-3.5 h-3.5 accent-white" />
                            </th>
                            {[
                                { label: "Search Query", s: true },
                                { label: "Store", s: false },
                                { label: "Results", s: true },
                                { label: "Uses", s: true },
                                { label: "Redirect URL", s: false },
                                { label: "Suggested Terms", s: false },
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

                        {/* Inline filter row */}
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <td className="px-4 py-2">
                                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                                    className={`${filterInput} w-14`}>
                                    <option>Any</option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </td>
                            <td className="px-3 py-2">
                                <input value={filterQuery} onChange={e => setFilterQuery(e.target.value)}
                                    type="text" className={filterInput} />
                            </td>
                            <td className="px-3 py-2">
                                <select value={filterStore} onChange={e => setFilterStore(e.target.value)}
                                    className={filterInput}>
                                    <option value=""></option>
                                    {storeViews.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </td>
                            <td className="px-3 py-2">
                                <div className="space-y-1">
                                    <input value={filterResultFrom} onChange={e => setFilterResultFrom(e.target.value)}
                                        type="number" placeholder="From" className={filterInput} />
                                    <input value={filterResultTo} onChange={e => setFilterResultTo(e.target.value)}
                                        type="number" placeholder="To" className={filterInput} />
                                </div>
                            </td>
                            <td className="px-3 py-2">
                                <div className="space-y-1">
                                    <input value={filterUsesFrom} onChange={e => setFilterUsesFrom(e.target.value)}
                                        type="number" placeholder="From" className={filterInput} />
                                    <input value={filterUsesTo} onChange={e => setFilterUsesTo(e.target.value)}
                                        type="number" placeholder="To" className={filterInput} />
                                </div>
                            </td>
                            <td className="px-3 py-2">
                                <input value={filterRedirect} onChange={e => setFilterRedirect(e.target.value)}
                                    type="text" className={filterInput} />
                            </td>
                            <td className="px-3 py-2">
                                <select value={filterSuggested} onChange={e => setFilterSuggested(e.target.value)}
                                    className={filterInput}>
                                    <option value=""></option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </td>
                            <td className="px-3 py-2" />
                        </tr>
                    </thead>
                    <tbody>
                        {terms.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">No search terms found.</td>
                            </tr>
                        ) : (
                            terms.map((t, idx) => (
                                <tr key={t.id}
                                    style={{ borderBottom: "1px solid #f3f4f6", background: selected.includes(t.id) ? "#f0fdfa" : idx % 2 === 0 ? "#fff" : "#fafafa" }}
                                    className="hover:bg-blue-50/20 transition-all">
                                    <td className="px-4 py-3">
                                        <input type="checkbox" checked={selected.includes(t.id)}
                                            onChange={() => toggleSelect(t.id)}
                                            className="w-3.5 h-3.5 accent-teal-500" />
                                    </td>
                                    <td className={`${tdClass} font-medium text-gray-800`}>{t.searchQuery}</td>
                                    <td className={tdClass}>
                                        <div className="space-y-0.5">
                                            {t.store.map((s, i) => <p key={i} className="text-xs text-gray-600 leading-5">{s}</p>)}
                                        </div>
                                    </td>
                                    <td className={tdClass}>{t.results}</td>
                                    <td className={tdClass}>{t.uses}</td>
                                    <td className={tdClass}>
                                        {t.redirectUrl
                                            ? <a href={t.redirectUrl} target="_blank" rel="noreferrer"
                                                className="text-blue-500 hover:underline">{t.redirectUrl}</a>
                                            : <span className="text-gray-300">—</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                                            ${t.suggestedTerms === "Yes"
                                                ? "bg-green-50 text-green-600 border border-green-200"
                                                : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                                            {t.suggestedTerms}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => navigate(`/AddSearchTerm/${t.id}`)}
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

export default MagentoSearchTermsList;