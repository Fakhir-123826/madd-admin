import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch, FaFilter, FaColumns, FaChevronLeft, FaChevronRight, FaChevronDown, FaSort
} from "react-icons/fa";

const mockTaxRules = [
  {
    name: "Rule1",
    customerTaxClass: "Retail Customer",
    productTaxClass: "Taxable Goods",
    taxRate: "US-CA-Rate 1, US-NY-Rate 1, US-MI-Rate 1",
    priority: 0,
    subtotalOnly: 0,
    sortOrder: 0
  },
  {
    name: "MY group",
    customerTaxClass: "Retail Customer",
    productTaxClass: "Taxable Goods",
    taxRate: "US-CA-Rate 1, US-NY-Rate 1, US-MI-Rate 1",
    priority: 0,
    subtotalOnly: 0,
    sortOrder: 0
  },
];

const MagentoTaxRulesList = () => {
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);

  const filtered = mockTaxRules.filter(rule =>
    rule.name.toLowerCase().includes(search.toLowerCase()) ||
    rule.taxRate.toLowerCase().includes(search.toLowerCase())
  );

  const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
  const tdClass = "px-4 py-3 text-xs text-gray-600 whitespace-nowrap";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Tax Rules</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage tax rules and rates for your store</p>
        </div>
        <button
          onClick={() => navigate("/AddMagentoTaxRule")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
          style={{ background: "linear-gradient(to right, #f97316, #ea580c)" }}
        >
          + Add New Tax Rule
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 focus-within:border-teal-400 transition-all">
            <input
              placeholder="Search..."
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
                <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-48 space-y-2">
                  {["Name", "Customer Tax Class", "Product Tax Class", "Tax Rate", "Priority", "Subtotal Only", "Sort Order", "Action"].map(col => (
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

      {/* PAGINATION BAR */}
      <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-gray-400">
          <span className="font-semibold text-gray-700">{filtered.length}</span> records found
        </span>
        <div className="flex items-center gap-2">
          <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}
            className="px-2 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-600 outline-none bg-gray-50">
            {[20, 30, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="text-xs text-gray-400">per page</span>
          <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400" disabled={currentPage === 1}>
            <FaChevronLeft className="text-xs" />
          </button>
          <span className="text-xs font-medium text-gray-700">{currentPage} of 1</span>
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
              <th className={thClass}>Name</th>
              <th className={thClass}>Customer Tax Class</th>
              <th className={thClass}>Product Tax Class</th>
              <th className={thClass}>Tax Rate</th>
              <th className={thClass}>Priority</th>
              <th className={thClass}>Subtotal Only</th>
              <th className={thClass}>Sort Order</th>
              <th className={thClass}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rule, idx) => (
              <tr key={idx}
                className="border-b border-gray-200 hover:bg-blue-50/30 transition-all">
                <td className={`${tdClass} font-medium text-gray-700`}>{rule.name}</td>
                <td className={tdClass}>{rule.customerTaxClass}</td>
                <td className={tdClass}>{rule.productTaxClass}</td>
                <td className={tdClass}>{rule.taxRate}</td>
                <td className={tdClass}>{rule.priority}</td>
                <td className={tdClass}>{rule.subtotalOnly}</td>
                <td className={tdClass}>{rule.sortOrder}</td>
                <td className={`${tdClass} text-right`}>
                  <button className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
                    Edit
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-500">
                  No tax rules found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MagentoTaxRulesList;