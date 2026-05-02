import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch, FaFilter, FaColumns, FaChevronLeft, FaChevronRight, FaChevronDown
} from "react-icons/fa";

const mockStocks = [
  { id: 1, name: "Default Stock", salesChannels: "website\nmy web site (babar,azam)\nMain Website (base)\nrrrr (rrrr123)", assignedSources: "Default Source (default)", action: "Edit" },
  { id: 2, name: "neno", salesChannels: "", assignedSources: "", action: "Edit" },
  { id: 3, name: "Jo sabia", salesChannels: "", assignedSources: "", action: "Edit" },
  { id: 4, name: "neno123", salesChannels: "website (neo_exp)\nneo.exp (neo_exp)", assignedSources: "", action: "Edit" },
];

const MagentoStockList = () => {
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [action, setAction] = useState("");

  const filtered = mockStocks.filter(stock =>
    stock.name.toLowerCase().includes(search.toLowerCase()) ||
    stock.salesChannels.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map(s => s.id));
  };

  const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
  const tdClass = "px-4 py-3 text-xs text-gray-600 whitespace-nowrap";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-semibold text-gray-800">Manage Stock</h2>
        <button
          onClick={() => navigate("/AddMagentoStock")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
          style={{ background: "linear-gradient(to right, #f97316, #ea580c)" }}
        >
          + Add New Stock
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="px-6 py-4 border-b border-gray-100">
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
                    {["ID", "Name", "Sales Channels", "Assigned Sources", "Action"].map((col) => (
                      <label key={col} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                        <input type="checkbox" defaultChecked className="accent-teal-500" />
                        {col}
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filters Panel (agar chahiye toh expand kar sakte hain) */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Name</label>
              <input type="text" placeholder="Filter by name"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-400 bg-gray-50" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Sales Channels</label>
              <input type="text" placeholder="Filter by channel"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-400 bg-gray-50" />
            </div>
            <div className="flex items-end gap-2">
              <button className="px-5 py-2 rounded-xl text-white text-sm font-medium"
                style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                Apply Filters
              </button>
              <button className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ACTIONS + PAGINATION BAR */}
      <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <select className="px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 outline-none bg-gray-50 focus:border-teal-400 transition-all">
            <option value="">Actions</option>
            <option value="enable">Enable Selected</option>
            <option value="disable">Disable Selected</option>
            <option value="delete">Delete Selected</option>
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
          <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400" disabled={currentPage === 1}>
            <FaChevronLeft className="text-xs" />
          </button>
          <span className="text-xs font-medium text-gray-700">1 of 1</span>
          <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400">
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[1100px]">
          <thead>
            <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
              <th className="px-4 py-3 text-left w-10">
                <input type="checkbox"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="w-3.5 h-3.5 accent-white" />
              </th>
              <th className={thClass}>ID</th>
              <th className={thClass}>Name</th>
              <th className={thClass}>Sales Channels</th>
              <th className={thClass}>Assigned Sources</th>
              <th className={thClass}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((stock) => (
              <tr key={stock.id}
                className="border-b border-gray-200 hover:bg-blue-50/30 transition-all">
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.includes(stock.id)}
                    onChange={() => toggleSelect(stock.id)}
                    className="accent-teal-500 w-3.5 h-3.5" />
                </td>
                <td className={`${tdClass} font-medium text-gray-700`}>{stock.id}</td>
                <td className={tdClass}>{stock.name}</td>
                <td className={tdClass} style={{ whiteSpace: "pre-line" }}>{stock.salesChannels}</td>
                <td className={tdClass}>{stock.assignedSources}</td>
                <td className={`${tdClass} text-right`}>
                  <button className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
                    Edit
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">
                  No stocks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MagentoStockList;