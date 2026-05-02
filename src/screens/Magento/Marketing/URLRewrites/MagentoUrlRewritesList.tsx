import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaFilter, FaColumns, FaChevronLeft, FaChevronRight,
    FaChevronDown, FaSort, FaPlus, FaCheck, FaTimes, FaPencilAlt
} from "react-icons/fa";

interface UrlRewrite {
    id: number;
    storeView: string[];
    requestPath: string;
    targetPath: string;
    redirectType: string;
}

const mockRewrites: UrlRewrite[] = [
    { id: 317, storeView: ["neo.exp", "raw mart", "nina"], requestPath: "www.kick.com", targetPath: "wwe", redirectType: "Temporary (302)" },
    { id: 316, storeView: ["Main Website", "Main Website Store", "Default Store View"], requestPath: "123wqq.html", targetPath: "catalog/category/view/id/57", redirectType: "No" },
    { id: 315, storeView: ["Main Website"], requestPath: "sale.html", targetPath: "catalog/category/view/id/34", redirectType: "Permanent (301)" },
    { id: 314, storeView: ["my web site"], requestPath: "promo.html", targetPath: "catalog/category/view/id/12", redirectType: "No" },
];

const redirectTypes = ["No", "Temporary (302)", "Permanent (301)"];

const MagentoUrlRewritesList = () => {
    const navigate = useNavigate();
    const [rewrites, setRewrites] = useState<UrlRewrite[]>(mockRewrites);
    const [selected, setSelected] = useState<number[]>([]);
    const [perPage, setPerPage] = useState(20);
    const [showFilters, setShowFilters] = useState(false);
    const [showColumns, setShowColumns] = useState(false);
    const [successMsg, setSuccessMsg] = useState("The URL Rewrite has been saved.");
    const [showSelectMenu, setShowSelectMenu] = useState<number | null>(null);

    // Inline edit state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editRequestPath, setEditRequestPath] = useState("");
    const [editRedirectType, setEditRedirectType] = useState("");

    const toggleSelect = (id: number) =>
        setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    const toggleAll = () =>
        setSelected(selected.length === rewrites.length ? [] : rewrites.map(r => r.id));

    const startEdit = (r: UrlRewrite) => {
        setEditingId(r.id);
        setEditRequestPath(r.requestPath);
        setEditRedirectType(r.redirectType);
        // auto select the row
        if (!selected.includes(r.id)) setSelected(prev => [...prev, r.id]);
        setShowSelectMenu(null);
    };

    const saveEdit = () => {
        setRewrites(prev => prev.map(r =>
            r.id === editingId
                ? { ...r, requestPath: editRequestPath, redirectType: editRedirectType }
                : r
        ));
        setEditingId(null);
        setSuccessMsg("The URL Rewrite has been saved.");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setSelected(prev => prev.filter(id => id !== editingId));
    };

    const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
    const tdClass = "px-4 py-3 text-xs text-gray-600";

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">URL Rewrites</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Manage all URL rewrites</p>
                    </div>
                    <button onClick={() => navigate("/AddMagentoUrlRewrite")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                        style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                        <FaPlus className="text-xs" /> Add URL Rewrite
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

                {/* Toolbar */}
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
                                    {["ID", "Store View", "Request Path", "Target Path", "Redirect Type"].map(col => (
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
                            {["ID", "Request Path", "Target Path"].map(f => (
                                <div key={f}>
                                    <label className="text-xs font-semibold text-gray-600 mb-2 block">{f}</label>
                                    <input type="text" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Redirect Type</label>
                                <select className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all">
                                    <option value=""></option>
                                    {redirectTypes.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                            <button onClick={() => setShowFilters(false)} className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2">Cancel</button>
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
                        <span className="font-semibold text-gray-700">{rewrites.length}</span> records found
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
                <table style={{ width: "100%", minWidth: "800px", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                            <th className="px-4 py-3 text-left w-10">
                                <input type="checkbox"
                                    checked={selected.length === rewrites.length && rewrites.length > 0}
                                    onChange={toggleAll}
                                    className="w-3.5 h-3.5 accent-white" />
                            </th>
                            {[
                                { label: "ID", sortable: true },
                                { label: "Store View", sortable: false },
                                { label: "Request Path", sortable: false },
                                { label: "Target Path", sortable: false },
                                { label: "Redirect Type", sortable: false },
                                { label: "Action", sortable: false },
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
                        {rewrites.map((r, idx) => {
                            const isEditing = editingId === r.id;
                            return (
                                <tr key={r.id}
                                    style={{
                                        borderBottom: "1px solid #f3f4f6",
                                        background: isEditing
                                            ? "#f0fdfa"
                                            : selected.includes(r.id)
                                                ? "#f0fdf4"
                                                : idx % 2 === 0 ? "#fff" : "#fafafa"
                                    }}>

                                    {/* Checkbox */}
                                    <td className="px-4 py-3">
                                        <input type="checkbox" checked={selected.includes(r.id)}
                                            onChange={() => toggleSelect(r.id)}
                                            className="w-3.5 h-3.5 accent-teal-500" />
                                    </td>

                                    {/* ID */}
                                    <td className={`${tdClass} font-medium text-gray-700`}>{r.id}</td>

                                    {/* Store View */}
                                    <td className={tdClass}>
                                        <div className="space-y-0.5">
                                            {r.storeView.map((sv, i) => (
                                                <p key={i} className="text-xs text-gray-600 leading-5">{sv}</p>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Request Path — click to edit */}
                                    <td className={tdClass}>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editRequestPath}
                                                onChange={e => setEditRequestPath(e.target.value)}
                                                autoFocus
                                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-white transition-all" />
                                        ) : (
                                            <span
                                                onClick={() => startEdit(r)}
                                                title="Click to edit"
                                                className="cursor-pointer hover:text-teal-500 transition-colors group flex items-center gap-1.5">
                                                {r.requestPath}
                                                <FaPencilAlt className="text-[9px] text-gray-300 group-hover:text-teal-400 transition-colors" />
                                            </span>
                                        )}
                                    </td>

                                    {/* Target Path */}
                                    <td className={tdClass}>{r.targetPath}</td>

                                    {/* Redirect Type — editable when row is editing */}
                                    <td className={tdClass}>
                                        {isEditing ? (
                                            <select
                                                value={editRedirectType}
                                                onChange={e => setEditRedirectType(e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-white transition-all">
                                                {redirectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        ) : (
                                            <span onClick={() => startEdit(r)}
                                                title="Click to edit"
                                                className="cursor-pointer hover:text-teal-500 transition-colors">
                                                {r.redirectType}
                                            </span>
                                        )}
                                    </td>

                                    {/* Action */}
                                    <td className="px-4 py-3">
                                        {isEditing ? (
                                            /* Floating Cancel/Save like image 2 */
                                            <div className="relative">
                                                <div className="absolute -top-3 right-0 z-30 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-3 whitespace-nowrap">
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="text-xs font-medium text-blue-400 hover:text-blue-600 transition-colors">
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={saveEdit}
                                                        className="px-4 py-2 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                                                        style={{ background: "linear-gradient(to right, #2dd4bf, #22c55e)" }}>
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() => setShowSelectMenu(showSelectMenu === r.id ? null : r.id)}
                                                    className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
                                                    Select <FaChevronDown className="text-[9px]" />
                                                </button>
                                                {showSelectMenu === r.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setShowSelectMenu(null)} />
                                                        <div className="absolute right-0 top-6 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-28">
                                                            <button onClick={() => startEdit(r)}
                                                                className="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                                                                <FaPencilAlt className="text-[9px]" /> Edit
                                                            </button>
                                                            <button onClick={() => { setRewrites(prev => prev.filter(rw => rw.id !== r.id)); setShowSelectMenu(null); }}
                                                                className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2">
                                                                <FaTimes className="text-[9px]" /> Delete
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MagentoUrlRewritesList;