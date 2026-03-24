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
  FaSort,
} from "react-icons/fa";
import StoreViewDropdown from "../../../../component/StoreViewDropdown";
import type { StoreViewSelection } from "../../../../model/MagentoProduct/StoreViewSelection";

function MagentoBillingAgreementsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [perPage, setPerPage] = useState(20);
  const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });

  // Dummy Data (Empty for now - matching image)
  const dummyData = {
    items: [],
    total_count: 0,
  };

  const billingAgreements = dummyData.items || [];

  const filtered = billingAgreements.filter((item: any) =>
    item.reference_id?.includes(search) || 
    item.email?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === filtered.length ? [] : filtered.map((i: any) => i.id)
    );
  };

  const thClass = "px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap";
  const tdClass = "px-6 py-4 text-sm text-gray-600 whitespace-nowrap";

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      {/* HEADER SECTION */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Billing Agreements</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all customer billing agreements</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Input - Your Style */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-5 py-3 bg-gray-50 focus-within:border-teal-400 focus-within:bg-white transition-all w-full md:w-96">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Email, Reference ID..."
              className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
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

            <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-teal-300 text-teal-500 text-sm font-medium hover:bg-teal-50 transition-all">
              <FaFileExport /> Export <FaChevronDown className="text-xs" />
            </button>

            <StoreViewDropdown onChange={(sel) => setStoreSelection(sel)} />
          </div>
        </div>

        {/* Advanced Filters Panel - Your Theme */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {["ID", "Email", "First Name", "Last Name", "Reference ID"].map((label) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-gray-600 mb-2">{label}</label>
                <input
                  type="text"
                  placeholder={`Enter ${label}`}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-sm transition-all"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Status</label>
              <select className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 text-sm transition-all">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {["Created", "Updated"].map((label) => (
              <div key={label} className="col-span-1 md:col-span-2 lg:col-span-1">
                <label className="block text-xs font-semibold text-gray-600 mb-2">{label} Date</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1 font-medium">FROM</div>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 text-sm" 
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1 font-medium">TO</div>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-teal-400 text-sm" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTION BAR */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4 bg-gray-50">
        <div className="flex items-center gap-4">
          <select className="px-4 py-2 border border-gray-300 rounded-2xl text-sm bg-white focus:border-teal-400">
            <option>Actions</option>
            <option>Delete Selected</option>
            <option>Export Selected</option>
          </select>

          <span className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{filtered.length}</span> records found
            {selected.length > 0 && (
              <span className="ml-2 text-teal-600">({selected.length} selected)</span>
            )}
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

      {/* TABLE - Your Gradient Theme */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-emerald-500">
              <th className="px-6 py-4 w-10">
                <input
                  type="checkbox"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="w-4 h-4 accent-white"
                />
              </th>
              <th className={thClass}>ID <FaSort className="inline ml-1 text-white/70" /></th>
              <th className={thClass}>Email</th>
              <th className={thClass}>First Name</th>
              <th className={thClass}>Last Name</th>
              <th className={thClass}>Reference ID</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Created</th>
              <th className={thClass}>Updated</th>
              <th className={thClass + " text-right pr-8"}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-24 text-center">
                  <p className="text-gray-500 text-xl font-light">We couldn't find any records.</p>
                  <p className="text-gray-400 text-sm mt-3">Try adjusting your search or filters.</p>
                </td>
              </tr>
            ) : (
              filtered.map((agreement: any, idx: number) => (
                <tr
                  key={agreement.id}
                  className={`border-b border-gray-100 hover:bg-teal-50/50 transition-all ${
                    selected.includes(agreement.id) ? "bg-teal-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(agreement.id)}
                      onChange={() => toggleSelect(agreement.id)}
                      className="w-4 h-4 accent-teal-500"
                    />
                  </td>
                  <td className={`${tdClass} font-medium text-gray-900`}>#{agreement.id}</td>
                  <td className={tdClass}>{agreement.email}</td>
                  <td className={tdClass}>{agreement.firstname}</td>
                  <td className={tdClass}>{agreement.lastname}</td>
                  <td className={tdClass}>{agreement.reference_id}</td>
                  <td className={tdClass}>
                    <span className="px-4 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                      Active
                    </span>
                  </td>
                  <td className={tdClass}>{agreement.created_at}</td>
                  <td className={tdClass}>{agreement.updated_at}</td>
                  <td className="px-6 py-4 text-right pr-8">
                    <button 
                      onClick={() => navigate(`/billing-agreement/${agreement.id}`)}
                      className="text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors"
                    >
                      View
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
}

export default MagentoBillingAgreementsList;