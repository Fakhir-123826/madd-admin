import { useState } from "react";
import {
    FaSearch, FaFilter, FaColumns, FaFileExport,
    FaChevronLeft, FaChevronRight, FaChevronDown, FaSort
} from "react-icons/fa";
import { Link } from "react-router-dom";
import InvoiceFilter from "./Invoicefilter";

const mockInvoices = [
    { id: 1, invoice: "000000001", invoiceDate: "Feb 24, 2026 1:06:25 AM", order: "000000001", orderDate: "Feb 24, 2026 1:06:20 AM", billTo: "Veronica Costello", status: "Paid", grandTotalBase: "$36.39", grandTotalPurchased: "$36.39" },
    { id: 2, invoice: "000000002", invoiceDate: "Feb 24, 2026 1:06:34 AM", order: "000000002", orderDate: "Feb 24, 2026 1:06:34 AM", billTo: "Veronica Costello", status: "Paid", grandTotalBase: "$39.64", grandTotalPurchased: "$39.64" },
];

const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "paid": return "bg-green-50 text-green-600 border border-green-200";
        case "pending": return "bg-amber-50 text-amber-600 border border-amber-200";
        case "cancelled": return "bg-red-50 text-red-500 border border-red-200";
        default: return "bg-gray-100 text-gray-500";
    }
};

const MagentoInvoiceList = () => {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<number[]>([]);
    const [perPage, setPerPage] = useState(20);
    const [showFilters, setShowFilters] = useState(false);
    const [showColumns, setShowColumns] = useState(false);
    const [action, setAction] = useState("");

    const filtered = mockInvoices.filter(inv =>
        inv.invoice.includes(search) ||
        inv.billTo.toLowerCase().includes(search.toLowerCase()) ||
        inv.order.includes(search)
    );

    const toggleSelect = (id: number) => {
        setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        setSelected(selected.length === filtered.length ? [] : filtered.map(i => i.id));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Invoices</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Manage all invoices</p>
                    </div>
                </div>

                {/* Search + Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus-within:border-teal-400 focus-within:bg-white transition-all w-64">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by keyword"
                            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                        />
                        <FaSearch className="text-gray-400 text-sm" />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all
                                ${showFilters ? "border-teal-400 text-teal-600 bg-teal-50" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                        >
                            <FaFilter className="text-xs" /> Filters
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-all">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            Default View
                            <FaChevronDown className="text-xs opacity-50" />
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowColumns(!showColumns)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-all"
                            >
                                <FaColumns className="text-xs" /> Columns
                                <FaChevronDown className="text-xs opacity-50" />
                            </button>
                            {showColumns && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowColumns(false)} />
                                    <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-44 space-y-2">
                                        {["Invoice", "Invoice Date", "Order #", "Order Date", "Bill-to Name", "Status", "Grand Total"].map((col) => (
                                            <label key={col} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                                                <input type="checkbox" defaultChecked className="accent-teal-500" />
                                                {col}
                                            </label>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-all">
                            <FaFileExport className="text-xs" /> Export
                            <FaChevronDown className="text-xs opacity-50" />
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <InvoiceFilter onApply={(f) => console.log(f)} />
                )}
            </div>

            {/* ACTIONS + PAGINATION BAR */}
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                    <select value={action} onChange={(e) => setAction(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 outline-none bg-gray-50 focus:border-teal-400 transition-all">
                        <option value="">Actions</option>
                        <option value="print">Print Selected</option>
                        <option value="export_pdf">Export PDF</option>
                    </select>
                    <span className="text-xs text-gray-400">
                        <span className="font-semibold text-gray-700">{filtered.length}</span> records found
                        {selected.length > 0 && (
                            <span className="ml-2 text-teal-600 font-medium">({selected.length} selected)</span>
                        )}
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

            {/* TABLE — overflow-x-auto sirf yahan */}

            <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "60vh" }}>
                <table className="w-full text-xs" style={{ tableLayout: "fixed", minWidth: "700px" }}>
                    <colgroup>
                        <col style={{ width: "36px" }} />
                        <col style={{ width: "9%" }} />
                        <col style={{ width: "14%" }} />
                        <col style={{ width: "9%" }} />
                        <col style={{ width: "14%" }} />
                        <col style={{ width: "12%" }} />
                        <col style={{ width: "7%" }} />
                        <col style={{ width: "11%" }} />
                        <col style={{ width: "13%" }} />
                        <col style={{ width: "6%" }} />
                    </colgroup>
                    <thead className="sticky top-0 z-10">
                        <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                            <th className="px-3 py-3 text-left">
                                <input type="checkbox"
                                    checked={selected.length === filtered.length && filtered.length > 0}
                                    onChange={toggleAll}
                                    className="w-3.5 h-3.5 rounded accent-white" />
                            </th>
                            {[
                                { label: "Invoice", sortable: true },
                                { label: "Invoice Date", sortable: false },
                                { label: "Order #", sortable: false },
                                { label: "Order Date", sortable: false },
                                { label: "Bill-to Name", sortable: false },
                                { label: "Status", sortable: false },
                                { label: "Grand Total (Base)", sortable: false },
                                { label: "Grand Total (Purchased)", sortable: false },
                                { label: "Action", sortable: false },
                            ].map((col) => (
                                <th key={col.label}
                                    className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                                    <div className="flex items-center gap-1 truncate">
                                        <span className="truncate">{col.label}</span>
                                        {col.sortable && <FaSort className="text-white/50 flex-shrink-0 cursor-pointer hover:text-white" />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-12 text-gray-400 text-sm">
                                    No invoices found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((inv, idx) => (
                                <tr key={inv.id}
                                    className={`border-b border-gray-50 hover:bg-blue-50/30 transition-all
                                        ${selected.includes(inv.id) ? "bg-teal-50/40" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                                    <td className="px-3 py-3">
                                        <input type="checkbox" checked={selected.includes(inv.id)}
                                            onChange={() => toggleSelect(inv.id)}
                                            className="accent-teal-500 w-3.5 h-3.5 rounded" />
                                    </td>
                                    <td className="px-3 py-3 font-medium text-gray-700 truncate">{inv.invoice}</td>
                                    <td className="px-3 py-3 text-gray-500 truncate">{inv.invoiceDate}</td>
                                    <td className="px-3 py-3 text-gray-700 truncate">{inv.order}</td>
                                    <td className="px-3 py-3 text-gray-500 truncate">{inv.orderDate}</td>
                                    <td className="px-3 py-3 text-gray-700 truncate">{inv.billTo}</td>
                                    <td className="px-3 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(inv.status)}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 font-medium text-gray-700">{inv.grandTotalBase}</td>
                                    <td className="px-3 py-3 font-medium text-gray-700">{inv.grandTotalPurchased}</td>
                                    <td className="px-3 py-3">
                                        <Link to="/MagentoInvoiceDetail">
                                            <button className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
                                                View
                                            </button>
                                        </Link>
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

export default MagentoInvoiceList;


// import { useState } from "react";
// import {
//     FaSearch, FaFilter, FaColumns, FaFileExport,
//     FaChevronLeft, FaChevronRight, FaChevronDown, FaSort
// } from "react-icons/fa";

// const mockInvoices = [
//     { id: 1, invoice: "000000001", invoiceDate: "Feb 24, 2026 1:06:25 AM", order: "000000001", orderDate: "Feb 24, 2026 1:06:20 AM", billTo: "Veronica Costello", status: "Paid", grandTotalBase: "$36.39", grandTotalPurchased: "$36.39" },
//     { id: 2, invoice: "000000002", invoiceDate: "Feb 24, 2026 1:06:34 AM", order: "000000002", orderDate: "Feb 24, 2026 1:06:34 AM", billTo: "Veronica Costello", status: "Paid", grandTotalBase: "$39.64", grandTotalPurchased: "$39.64" },
// ];

// const statusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//         case "paid": return "bg-green-50 text-green-600 border border-green-200";
//         case "pending": return "bg-amber-50 text-amber-600 border border-amber-200";
//         case "cancelled": return "bg-red-50 text-red-500 border border-red-200";
//         default: return "bg-gray-100 text-gray-500";
//     }
// };

// const MagentoInvoiceList = () => {
//     const [search, setSearch] = useState("");
//     const [selected, setSelected] = useState<number[]>([]);
//     const [perPage, setPerPage] = useState(20);
//     const [showFilters, setShowFilters] = useState(false);
//     const [showColumns, setShowColumns] = useState(false);
//     const [action, setAction] = useState("");

//     const filtered = mockInvoices.filter(inv =>
//         inv.invoice.includes(search) ||
//         inv.billTo.toLowerCase().includes(search.toLowerCase()) ||
//         inv.order.includes(search)
//     );

//     const toggleSelect = (id: number) => {
//         setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
//     };

//     const toggleAll = () => {
//         setSelected(selected.length === filtered.length ? [] : filtered.map(i => i.id));
//     };

//     const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
//     const tdClass = "px-4 py-3 text-xs text-gray-600 whitespace-nowrap";

//     return (
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden">

//             {/* HEADER */}
//             <div className="px-6 py-5 border-b border-gray-100">
//                 <div className="mb-4">
//                     <h2 className="text-xl font-semibold text-gray-800">Invoices</h2>
//                     <p className="text-sm text-gray-400 mt-0.5">Manage all invoices</p>
//                 </div>

//                 {/* Search + Buttons */}
//                 <div className="flex flex-wrap items-center justify-between gap-3">
//                     <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus-within:border-teal-400 focus-within:bg-white transition-all w-64">
//                         <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
//                             placeholder="Search by keyword"
//                             className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400" />
//                         <FaSearch className="text-gray-400 text-sm" />
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <button onClick={() => setShowFilters(!showFilters)}
//                             className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all
//                                 ${showFilters ? "border-teal-400 text-teal-600 bg-teal-50" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
//                             <FaFilter className="text-xs" /> Filters
//                         </button>
//                         <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50">
//                             <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Default View <FaChevronDown className="text-xs opacity-50" />
//                         </button>
//                         <div className="relative">
//                             <button onClick={() => setShowColumns(!showColumns)}
//                                 className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50">
//                                 <FaColumns className="text-xs" /> Columns <FaChevronDown className="text-xs opacity-50" />
//                             </button>
//                             {showColumns && (
//                                 <>
//                                     <div className="fixed inset-0 z-10" onClick={() => setShowColumns(false)} />
//                                     <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-44 space-y-2">
//                                         {["Invoice", "Invoice Date", "Order #", "Order Date", "Bill-to Name", "Status", "Grand Total"].map((col) => (
//                                             <label key={col} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
//                                                 <input type="checkbox" defaultChecked className="accent-teal-500" /> {col}
//                                             </label>
//                                         ))}
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                         <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50">
//                             <FaFileExport className="text-xs" /> Export <FaChevronDown className="text-xs opacity-50" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Filters Panel */}
//                 {showFilters && (
//                     <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-3">
//                         {["Invoice #", "Order #", "Bill-to Name", "Status"].map((f) => (
//                             <div key={f}>
//                                 <label className="text-xs font-medium text-gray-500 mb-1 block">{f}</label>
//                                 <input type="text" placeholder={`Filter by ${f}`}
//                                     className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-400 bg-gray-50" />
//                             </div>
//                         ))}
//                         <div className="col-span-4 flex gap-2 mt-1">
//                             <button className="px-4 py-2 rounded-xl text-white text-sm font-medium"
//                                 style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>Apply Filters</button>
//                             <button className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50">Reset</button>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* ACTIONS + PAGINATION */}
//             <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
//                 <div className="flex items-center gap-3">
//                     <select value={action} onChange={(e) => setAction(e.target.value)}
//                         className="px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 outline-none bg-gray-50">
//                         <option value="">Actions</option>
//                         <option value="print">Print Selected</option>
//                         <option value="export_pdf">Export PDF</option>
//                     </select>
//                     <span className="text-xs text-gray-400">
//                         <span className="font-semibold text-gray-700">{filtered.length}</span> records found
//                         {selected.length > 0 && <span className="ml-2 text-teal-600 font-medium">({selected.length} selected)</span>}
//                     </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}
//                         className="px-2 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-600 outline-none bg-gray-50">
//                         {[20, 30, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
//                     </select>
//                     <span className="text-xs text-gray-400">per page</span>
//                     <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400">
//                         <FaChevronLeft className="text-xs" />
//                     </button>
//                     <span className="text-xs font-medium text-gray-700">1 of 1</span>
//                     <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400">
//                         <FaChevronRight className="text-xs" />
//                     </button>
//                 </div>
//             </div>

//             {/* TABLE — x axis scroll sirf yahan */}
//             <div style={{ overflowX: "auto" }}>
//                 <table style={{ borderCollapse: "collapse", width: "100%", minWidth: "900px" }}>
//                     <thead>
//                         <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
//                             <th className="px-4 py-3 text-left w-10">
//                                 <input type="checkbox"
//                                     checked={selected.length === filtered.length && filtered.length > 0}
//                                     onChange={toggleAll}
//                                     className="w-3.5 h-3.5 accent-white" />
//                             </th>
//                             {[
//                                 { label: "Invoice", sortable: true },
//                                 { label: "Invoice Date", sortable: false },
//                                 { label: "Order #", sortable: false },
//                                 { label: "Order Date", sortable: false },
//                                 { label: "Bill-to Name", sortable: false },
//                                 { label: "Status", sortable: false },
//                                 { label: "Grand Total (Base)", sortable: false },
//                                 { label: "Grand Total (Purchased)", sortable: false },
//                                 { label: "Action", sortable: false },
//                             ].map((col) => (
//                                 <th key={col.label} className={thClass}>
//                                     <div className="flex items-center gap-1">
//                                         {col.label}
//                                         {col.sortable && <FaSort className="text-white/50 cursor-pointer hover:text-white" />}
//                                     </div>
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filtered.length === 0 ? (
//                             <tr>
//                                 <td colSpan={10} className="text-center py-12 text-gray-400 text-sm">No invoices found.</td>
//                             </tr>
//                         ) : (
//                             filtered.map((inv, idx) => (
//                                 <tr key={inv.id}
//                                     style={{ borderBottom: "1px solid #f3f4f6", background: selected.includes(inv.id) ? "#f0fdfa" : idx % 2 === 0 ? "#fff" : "#fafafa" }}
//                                     className="hover:bg-blue-50/20 transition-all">
//                                     <td className="px-4 py-3">
//                                         <input type="checkbox" checked={selected.includes(inv.id)}
//                                             onChange={() => toggleSelect(inv.id)}
//                                             className="w-3.5 h-3.5 accent-teal-500" />
//                                     </td>
//                                     <td className={`${tdClass} font-medium text-gray-700`}>{inv.invoice}</td>
//                                     <td className={tdClass}>{inv.invoiceDate}</td>
//                                     <td className={tdClass}>{inv.order}</td>
//                                     <td className={tdClass}>{inv.orderDate}</td>
//                                     <td className={tdClass}>{inv.billTo}</td>
//                                     <td className="px-4 py-3">
//                                         <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColor(inv.status)}`}>
//                                             {inv.status}
//                                         </span>
//                                     </td>
//                                     <td className={`${tdClass} font-medium text-gray-700`}>{inv.grandTotalBase}</td>
//                                     <td className={`${tdClass} font-medium text-gray-700`}>{inv.grandTotalPurchased}</td>
//                                     <td className="px-4 py-3">
//                                         <button className="text-xs font-medium text-blue-500 hover:text-blue-700">View</button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//         </div>
//     );
// };

// export default MagentoInvoiceList;