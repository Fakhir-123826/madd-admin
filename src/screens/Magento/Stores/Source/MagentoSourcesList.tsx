import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch, FaFilter, FaColumns, FaChevronLeft, FaChevronRight, FaChevronDown,
  FaEye
} from "react-icons/fa";

const mockSources = [
  { code: "default", name: "Default Source", pickup: "Disabled", enabled: "Enabled", action: "Edit" },
  { code: "neno880", name: "neno", pickup: "Disabled", enabled: "Enabled", action: "Edit" },
];

const MagentoSourcesList = () => {
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);

  const filtered = mockSources.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (index: number) => {
    setSelected(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  const toggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map((_, i) => i));
  };

  const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
  const tdClass = "px-4 py-3 text-xs text-gray-600 whitespace-nowrap";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-semibold text-gray-800">Sources</h2>
        <button
          onClick={() => navigate("/AddMagentoSource")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
          style={{ background: "linear-gradient(to right, #f97316, #ea580c)" }}
        >
          + Add New Source
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 focus-within:border-teal-400 transition-all">
            <input
              placeholder="Search by keyword"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-700 outline-none w-64 placeholder-gray-400"
            />
            <FaSearch className="text-gray-400 text-sm ml-2" />
          </div>
          <button className="px-5 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50">
            Search
          </button>
          <button className="px-5 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50">
            Reset Filter
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all
              ${showFilters ? "border-teal-400 text-teal-600 bg-teal-50" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            <FaFilter className="text-xs" /> Filters
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50">
            <FaEye className="text-xs" /> Default View <FaChevronDown className="text-xs opacity-50" />
          </button>
          <div className="relative">
            <button onClick={() => setShowColumns(!showColumns)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50">
              <FaColumns className="text-xs" /> Columns <FaChevronDown className="text-xs opacity-50" />
            </button>
            {showColumns && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowColumns(false)} />
                <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-48 space-y-2">
                  {["Code", "Name", "IsEnabled", "Pickup Location", "Action"].map(col => (
                    <label key={col} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-teal-500" /> {col}
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ACTIONS + PAGINATION */}
      <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <select className="px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-600 bg-gray-50">
            <option>Actions</option>
            <option>Enable Selected</option>
            <option>Disable Selected</option>
            <option>Delete Selected</option>
          </select>
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-gray-700">{filtered.length}</span> records found
            {selected.length > 0 && <span className="ml-2 text-teal-600">({selected.length} selected)</span>}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}
            className="px-2 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-600 bg-gray-50">
            <option>20</option><option>30</option><option>50</option><option>100</option>
          </select>
          <span className="text-xs text-gray-500">per page</span>
          <button className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50" disabled={currentPage === 1}>
            <FaChevronLeft className="text-sm" />
          </button>
          <span className="text-sm font-medium">{currentPage} of 1</span>
          <button className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50">
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
              <th className="px-4 py-3 text-left w-10">
                <input type="checkbox"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="w-3.5 h-3.5 accent-white" />
              </th>
              <th className={thClass}>Code</th>
              <th className={thClass}>Name</th>
              <th className={thClass}>Is Enabled</th>
              <th className={thClass}>Pickup Location</th>
              <th className={thClass}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, idx) => (
              <tr key={idx} className="border-b hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.includes(idx)}
                    onChange={() => toggleSelect(idx)}
                    className="w-3.5 h-3.5 accent-teal-500" />
                </td>
                <td className={`${tdClass} font-medium text-gray-700`}>{s.code}</td>
                <td className={tdClass}>{s.name}</td>
                <td className={tdClass}>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    s.enabled === "Enabled" ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
                  }`}>
                    {s.enabled}
                  </span>
                </td>
                <td className={tdClass}>{s.pickup}</td>
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
                  No sources found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MagentoSourcesList;