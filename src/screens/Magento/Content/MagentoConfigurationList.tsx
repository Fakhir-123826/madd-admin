import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilter, FaColumns, FaChevronLeft, FaChevronRight, FaChevronDown, FaSort, FaEye
} from "react-icons/fa";

const mockThemes = [
  { default: "Global", website: "Main Website", store: "Global", storeView: "Default Store View", theme: "Magento Luma", desc: "Using Default Theme" },
  { default: "Global", website: "Main Website", store: "Main Website Store", storeView: "Default Store View", theme: "Magento Luma", desc: "Using Default Theme" },
  { default: "Global", website: "my web site", store: "Main Website Store", storeView: "Default Store View", theme: "Magento Luma", desc: "Using Default Theme" },
  { default: "Global", website: "neo.exp", store: "Global", storeView: "Default Store View", theme: "Magento Luma", desc: "Using Default Theme" },
  { default: "Global", website: "", store: "", storeView: "", theme: "Magento Luma", desc: "Using Default Theme" },
];

const MagentoConfigurationList = () => {
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState(20);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);

  const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
  const tdClass = "px-4 py-3 text-xs text-gray-600 whitespace-nowrap";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Design Configuration</h2>
            <p className="text-sm text-gray-400 mt-0.5">Manage theme assignments for websites, stores, and store views</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-end gap-2">
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
                <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-44 space-y-2">
                  {["Default", "Website", "Store", "Store View", "Theme Name", "Short Description", "Action"].map(col => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Website</label>
                <input className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Store</label>
                <input className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Store View</label>
                <input className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Theme Name</label>
                <input className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowFilters(false)} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-2">
                Cancel
              </button>
              <button className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PAGINATION BAR */}
      <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-gray-400">
          <span className="font-semibold text-gray-700">{mockThemes.length}</span> records found
        </span>
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
        <table style={{ width: "100%", minWidth: "1100px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
              {[
                { label: "Default", sortable: true },
                { label: "Website", sortable: true },
                { label: "Store", sortable: true },
                { label: "Store View", sortable: true },
                { label: "Theme Name", sortable: false },
                { label: "Short Description", sortable: false },
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
            {mockThemes.map((t, idx) => (
              <tr key={idx}
                style={{ borderBottom: "1px solid #f3f4f6", background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                className="hover:bg-blue-50/20 transition-all">
                <td className={`${tdClass} font-medium text-gray-700`}>{t.default}</td>
                <td className={tdClass}>{t.website}</td>
                <td className={tdClass}>{t.store}</td>
                <td className={tdClass}>{t.storeView}</td>
                <td className={tdClass}>{t.theme}</td>
                <td className={tdClass}>{t.desc}</td>
                <td className="px-4 py-3">
                  <button className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MagentoConfigurationList;