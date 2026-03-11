import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaFilter, FaColumns, FaFileExport,
    FaChevronLeft, FaChevronRight, FaChevronDown, FaSort, FaStar
} from "react-icons/fa";

interface Review {
    id: number;
    created: string;
    status: string;
    title: string;
    nickname: string;
    review: string;
    visibility: string[];
    type: string;
    product: string;
    sku: string;
    rating: number;
    summaryOfReview: string;
    fullReview: string;
}

const mockReviews: Review[] = [
    { id: 184, created: "Feb 24, 2026, 1:04:41 AM", status: "Approved", title: "Has been through quite a few adventures", nickname: "Joette", review: "Has been through quite a few adventures and vac...", visibility: ["Main Website", "Main Website Store", "Default Store View"], type: "Guest", product: "Luma Analog Watch", sku: "24-WG09", rating: 4, summaryOfReview: "Has been through quite a few adventures", fullReview: "Has been through quite a few adventures and vacations with me and still looks and runs great." },
    { id: 171, created: "Feb 24, 2026, 1:04:41 AM", status: "Approved", title: "Can I give zero stars?", nickname: "Ingeborg", review: "I would give this bag zero stars if I could!!! ...", visibility: ["Main Website", "Main Website Store", "Default Store View"], type: "Guest", product: "Endeavor Daytrip Backpack", sku: "24-WB06", rating: 1, summaryOfReview: "Can I give zero stars?", fullReview: "I would give this bag zero stars if I could!!! The zipper broke on the very first use." },
    { id: 170, created: "Feb 24, 2026, 1:04:41 AM", status: "Approved", title: "I heart this backpack so hard.", nickname: "Susy", review: "I heart this backpack so hard. The colors are s...", visibility: ["Main Website", "Main Website Store", "Default Store View"], type: "Guest", product: "Endeavor Daytrip Backpack", sku: "24-WB06", rating: 5, summaryOfReview: "I heart this backpack so hard.", fullReview: "I heart this backpack so hard. The colors are so vibrant!" },
    { id: 165, created: "Feb 23, 2026, 3:12:00 PM", status: "Pending", title: "Great quality!", nickname: "Mark", review: "Really impressed with the build quality...", visibility: ["Main Website"], type: "Customer", product: "Fusion Backpack", sku: "24-MB02", rating: 5, summaryOfReview: "Great quality!", fullReview: "Really impressed with the build quality. Would definitely recommend." },
];

const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "approved": return "bg-green-50 text-green-600 border border-green-200";
        case "pending": return "bg-amber-50 text-amber-600 border border-amber-200";
        case "not approved": return "bg-red-50 text-red-500 border border-red-200";
        default: return "bg-gray-100 text-gray-500";
    }
};

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <FaStar key={s} className={`text-xs ${s <= rating ? "text-amber-400" : "text-gray-200"}`} />
        ))}
    </div>
);

const MagentoReviewsList = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<number[]>([]);
    const [perPage, setPerPage] = useState(20);
    const [showFilters, setShowFilters] = useState(false);
    const [showColumns, setShowColumns] = useState(false);

    // Filter states
    const [filterId, setFilterId] = useState("");
    const [filterFrom, setFilterFrom] = useState("");
    const [filterTo, setFilterTo] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterTitle, setFilterTitle] = useState("");
    const [filterNickname, setFilterNickname] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterProduct, setFilterProduct] = useState("");
    const [filterSku, setFilterSku] = useState("");

    const handleCancel = () => {
        setFilterId(""); setFilterFrom(""); setFilterTo(""); setFilterStatus("");
        setFilterTitle(""); setFilterNickname(""); setFilterType("");
        setFilterProduct(""); setFilterSku("");
        setShowFilters(false);
    };

    const filtered = mockReviews.filter(r =>
        (!filterId || String(r.id).includes(filterId)) &&
        (!filterStatus || r.status.toLowerCase() === filterStatus.toLowerCase()) &&
        (!filterTitle || r.title.toLowerCase().includes(filterTitle.toLowerCase())) &&
        (!filterNickname || r.nickname.toLowerCase().includes(filterNickname.toLowerCase())) &&
        (!filterType || r.type.toLowerCase() === filterType.toLowerCase()) &&
        (!filterProduct || r.product.toLowerCase().includes(filterProduct.toLowerCase())) &&
        (!filterSku || r.sku.toLowerCase().includes(filterSku.toLowerCase()))
    );

    const toggleSelect = (id: number) =>
        setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    const toggleAll = () =>
        setSelected(selected.length === filtered.length ? [] : filtered.map(r => r.id));

    const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
    const tdClass = "px-4 py-3 text-xs text-gray-600";

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Product Reviews</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Manage all product reviews</p>
                    </div>
                    <button onClick={() => navigate("/AddMagentoReview")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                        style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                        + New Review
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
                                    {["ID", "Created", "Status", "Title", "Nickname", "Review", "Visibility", "Type", "Product", "SKU"].map(col => (
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
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Created</label>
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
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Status</label>
                                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all">
                                    <option value=""></option>
                                    <option>Approved</option>
                                    <option>Pending</option>
                                    <option>Not Approved</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Title</label>
                                <input type="text" value={filterTitle} onChange={e => setFilterTitle(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Nickname</label>
                                <input type="text" value={filterNickname} onChange={e => setFilterNickname(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Type</label>
                                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all">
                                    <option value=""></option>
                                    <option>Guest</option>
                                    <option>Customer</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Product</label>
                                <input type="text" value={filterProduct} onChange={e => setFilterProduct(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">SKU</label>
                                <input type="text" value={filterSku} onChange={e => setFilterSku(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all" />
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
                        <option value="approve">Approve</option>
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
                                { label: "ID", s: true },
                                { label: "Created", s: true },
                                { label: "Status", s: false },
                                { label: "Title", s: false },
                                { label: "Nickname", s: false },
                                { label: "Review", s: false },
                                { label: "Visibility", s: false },
                                { label: "Type", s: false },
                                { label: "Product", s: false },
                                { label: "SKU", s: false },
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
                                <td colSpan={12} className="text-center py-12 text-gray-400 text-sm">
                                    We couldn't find any records.
                                </td>
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
                                    <td className={tdClass}>{r.created}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(r.status)}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className={tdClass} style={{ maxWidth: 160 }}>
                                        <p className="truncate">{r.title}</p>
                                    </td>
                                    <td className={tdClass}>{r.nickname}</td>
                                    <td className={tdClass} style={{ maxWidth: 160 }}>
                                        <p className="truncate">{r.review}</p>
                                    </td>
                                    <td className={tdClass}>
                                        <div className="space-y-0.5">
                                            {r.visibility.map((v, i) => (
                                                <p key={i} className="text-xs text-gray-600 leading-5">{v}</p>
                                            ))}
                                        </div>
                                    </td>
                                    <td className={tdClass}>{r.type}</td>
                                    <td className={tdClass}>{r.product}</td>
                                    <td className={tdClass}>{r.sku}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => navigate(`/AddMagentoReview/${r.id}`)}
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

export default MagentoReviewsList;