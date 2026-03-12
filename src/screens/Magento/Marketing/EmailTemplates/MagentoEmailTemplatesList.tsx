import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaFilter, FaColumns, FaFileExport,
    FaChevronLeft, FaChevronRight, FaChevronDown, FaSort
} from "react-icons/fa";

interface EmailTemplate {
    id: number;
    template: string;       // Template name like "Nena", "Nena3"
    added: string;
    updated: string;
    subject: string;        // with variables like {{trans "Your %store_name email and password has been changed" store_name=...}}
    type: string;           // HTML
}

const mockTemplates: EmailTemplate[] = [
    {
        id: 1,
        template: "Nena",
        added: "Mar 12, 2026, 12:00:39 AM",
        updated: "Mar 12, 2026, 12:00 AM",
        subject: '{{trans "Contact Form"}}',
        type: "HTML"
    },
    {
        id: 2,
        template: "Nena2",
        added: "Mar 12, 2026, 12:01:34 AM",
        updated: "Mar 12, 2026, 12:01 AM",
        subject: '{{trans "Take a look at %customer_name\'s Wish List" customer_name=$customerName}}',
        type: "HTML"
    },
    {
        id: 3,
        template: "Nena3",
        added: "Mar 13, 2026, 12:14:18 AM",
        updated: "Mar 13, 2026, 12:14:18 AM",
        subject: '{{trans "Your %store_name email and password has been changed" store_name=$storefront_name}}',
        type: "HTML"
    },
];

const MagentoEmailTemplatesList = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<number[]>([]);
    const [perPage, setPerPage] = useState(20);
    const [showFilters, setShowFilters] = useState(false);
    const [showColumns, setShowColumns] = useState(false);

    // Filter states (jaise tune image mein dikhaya)
    const [filterId, setFilterId] = useState("");
    const [filterFrom, setFilterFrom] = useState("");
    const [filterTo, setFilterTo] = useState("");
    const [filterSubject, setFilterSubject] = useState("");
    const [filterType, setFilterType] = useState("");

    const handleCancel = () => {
        setFilterId(""); setFilterFrom(""); setFilterTo(""); setFilterSubject(""); setFilterType("");
        setShowFilters(false);
    };

    const filtered = mockTemplates.filter(t =>
        (!filterId || String(t.id).includes(filterId)) &&
        (!filterSubject || t.subject.toLowerCase().includes(filterSubject.toLowerCase())) &&
        (!filterType || t.type.toLowerCase() === filterType.toLowerCase())
        // Date filter add kar sakta hai agar date parsing chahiye
    );

    const toggleSelect = (id: number) =>
        setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    const toggleAll = () =>
        setSelected(selected.length === filtered.length ? [] : filtered.map(t => t.id));

    const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
    const tdClass = "px-4 py-3 text-xs text-gray-600";

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Email Templates</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Manage transactional email templates</p>
                    </div>
                    <button onClick={() => navigate("/AddMagentoEmailTemplate")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                        style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                        + Add New Template
                    </button>
                </div>

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
                                    {["ID", "Template", "Added", "Updated", "Subject", "Template Type"].map(col => (
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

                {/* Filters Panel – bilkul teri image jaisa */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">ID</label>
                                <input type="text" value={filterId} onChange={e => setFilterId(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Added / Updated</label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">From</span>
                                        <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-6">To</span>
                                        <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Subject</label>
                                <input type="text" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Template Type</label>
                                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all">
                                    <option value=""></option>
                                    <option>HTML</option>
                                    <option>Text</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                            <button onClick={handleCancel}
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
                    <span className="text-xs font-medium text-gray-700">1 of {Math.ceil(filtered.length / perPage)}</span>
                    <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400">
                        <FaChevronRight className="text-xs" />
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: "1100px", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                            <th className="px-4 py-3 text-left w-10">
                                <input type="checkbox"
                                    checked={selected.length === filtered.length && filtered.length > 0}
                                    onChange={toggleAll}
                                    className="w-3.5 h-3.5 accent-white" />
                            </th>
                            {[
                                { label: "ID", sortable: true },
                                { label: "Template", sortable: true },
                                { label: "Added", sortable: true },
                                { label: "Updated", sortable: true },
                                { label: "Subject", sortable: false },
                                { label: "Template Type", sortable: false },
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
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                                    No templates found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((t, idx) => (
                                <tr key={t.id}
                                    style={{ borderBottom: "1px solid #f3f4f6", background: selected.includes(t.id) ? "#f0fdfa" : idx % 2 === 0 ? "#fff" : "#fafafa" }}
                                    className="hover:bg-blue-50/20 transition-all">
                                    <td className="px-4 py-3">
                                        <input type="checkbox" checked={selected.includes(t.id)}
                                            onChange={() => toggleSelect(t.id)}
                                            className="w-3.5 h-3.5 accent-teal-500" />
                                    </td>
                                    <td className={`${tdClass} font-medium text-gray-700`}>{t.id}</td>
                                    <td className={tdClass}>{t.template}</td>
                                    <td className={tdClass}>{t.added}</td>
                                    <td className={tdClass}>{t.updated}</td>
                                    <td className={tdClass} style={{ maxWidth: 300 }}>
                                        <p className="truncate">{t.subject}</p>
                                    </td>
                                    <td className={tdClass}>
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => navigate(`/AddMagentoEmailTemplate/${t.id}`)}
                                            className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors mr-3">
                                            Edit
                                        </button>
                                        <button className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
                                            Preview
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

export default MagentoEmailTemplatesList;