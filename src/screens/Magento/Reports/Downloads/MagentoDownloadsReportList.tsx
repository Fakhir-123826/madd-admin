import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaColumns,
  FaFileExport,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import StoreViewDropdown from "../../../../component/StoreViewDropdown";
import type { StoreViewSelection } from "../../../../model/MagentoProduct/StoreViewSelection";

function MagentoDownloadsReportList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);   // ← Toggle for filters
  const [selected, setSelected] = useState<number[]>([]);
  const [perPage, setPerPage] = useState(20);
  const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });

  // Dummy Data
  const dummyData = {
    items: [],
    total_count: 0,
  };

  const downloads = dummyData.items || [];

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === downloads.length ? [] : downloads.map((i: any) => i.id)
    );
  };

  const thClass = "px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap";
  const tdClass = "px-6 py-4 text-sm text-gray-600 whitespace-nowrap";

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">

      {/* HEADER with Search Bar + Toggle */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-5 py-3 bg-gray-50 focus-within:border-teal-400 focus-within:bg-white transition-all w-full md:w-96">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Product or SKU..."
              className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
            />
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-medium transition-all ${
                showFilters
                  ? "border-teal-400 text-teal-600 bg-teal-50"
                  : "border-teal-400 text-teal-500 hover:bg-teal-50"
              }`}
            >
              <FaFilter /> Filters
            </button>

            <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-teal-300 text-teal-500 text-sm font-medium hover:bg-teal-50 transition-all">
              <FaColumns /> Columns <FaChevronDown className="text-xs" />
            </button>

            <div className="flex items-center gap-2">
              <select className="px-4 py-2.5 border border-gray-300 rounded-2xl text-sm focus:border-teal-400 bg-white">
                <option>Export to: CSV</option>
                <option>Export to: Excel</option>
              </select>
              <button className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-2xl font-medium transition-all">
                Export
              </button>
            </div>

            <StoreViewDropdown onChange={(sel) => setStoreSelection(sel)} />
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-4">
          <button className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium transition-all">
            Search
          </button>

          <button 
            onClick={() => {
              setSearch("");
              setShowFilters(false);
            }}
            className="text-teal-600 hover:text-teal-700 font-medium text-sm transition-all"
          >
            Reset Filter
          </button>

          <span className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">0</span> records found
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700">20</span>
            <span className="text-gray-400">per page</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-2xl px-3 py-1 text-sm focus:border-teal-400"
            >
              {[20, 30, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-teal-50 text-gray-400 hover:text-teal-600 transition-all">
              <FaChevronLeft />
            </button>
            <span className="px-5 py-2 border border-gray-300 rounded-2xl text-sm font-medium">1 of 1</span>
            <button className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-teal-50 text-gray-400 hover:text-teal-600 transition-all">
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* FILTER ROW - Toggleable with Filters Button (as you requested) */}
      {showFilters && (
        <div className="bg-gray-100 border-b px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            
            {/* Product */}
            <div>
              <div className="text-xs text-gray-500 mb-1 font-medium">Product</div>
              <input 
                type="text" 
                placeholder="Product"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm focus:border-teal-400 focus:bg-white"
              />
            </div>

            {/* Link */}
            <div>
              <div className="text-xs text-gray-500 mb-1 font-medium">Link</div>
              <input 
                type="text" 
                placeholder="Link"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm focus:border-teal-400 focus:bg-white"
              />
            </div>

            {/* SKU */}
            <div>
              <div className="text-xs text-gray-500 mb-1 font-medium">SKU</div>
              <input 
                type="text" 
                placeholder="SKU"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm focus:border-teal-400 focus:bg-white"
              />
            </div>

            {/* Purchases */}
            <div>
              <div className="text-xs text-gray-500 mb-1 font-medium">Purchases</div>
              <input 
                type="text" 
                placeholder="Purchases"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm focus:border-teal-400 focus:bg-white"
              />
            </div>

            {/* Downloads */}
            <div>
              <div className="text-xs text-gray-500 mb-1 font-medium">Downloads</div>
              <input 
                type="text" 
                placeholder="Downloads"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm focus:border-teal-400 focus:bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-emerald-500">
              <th className="px-6 py-4 w-10">
                <input
                  type="checkbox"
                  checked={selected.length === downloads.length && downloads.length > 0}
                  onChange={toggleAll}
                  className="w-4 h-4 accent-white"
                />
              </th>
              <th className={thClass}>Product</th>
              <th className={thClass}>Link</th>
              <th className={thClass}>SKU</th>
              <th className={thClass}>Purchases</th>
              <th className={thClass}>Downloads</th>
            </tr>
          </thead>
          <tbody>
            {downloads.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-24 text-center">
                  <p className="text-gray-500 text-xl font-light">We couldn't find any records.</p>
                </td>
              </tr>
            ) : (
              downloads.map((item: any, idx: number) => (
                <tr
                  key={item.id}
                  className={`border-b border-gray-100 hover:bg-teal-50/50 transition-all ${
                    selected.includes(item.id) ? "bg-teal-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 accent-teal-500"
                    />
                  </td>
                  <td className={tdClass}>{item.product}</td>
                  <td className={tdClass}>{item.link}</td>
                  <td className={tdClass}>{item.sku}</td>
                  <td className={tdClass}>{item.purchases}</td>
                  <td className={tdClass}>{item.downloads}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MagentoDownloadsReportList;