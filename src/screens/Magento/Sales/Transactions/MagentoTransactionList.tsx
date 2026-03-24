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

function MagentoTransactionList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);   // ← This controls the filter row
  const [selected, setSelected] = useState<number[]>([]);
  const [perPage, setPerPage] = useState(20);
  const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });

  // Dummy Data (Empty to match the image)
  const dummyData = {
    items: [],
    total_count: 0,
  };

  const transactions = dummyData.items || [];

  const filtered = transactions.filter((item: any) =>
    item.transaction_id?.includes(search) ||
    item.order_id?.includes(search) ||
    item.payment_method?.toLowerCase().includes(search.toLowerCase())
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

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Transactions</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all payment transactions</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-5 py-3 bg-gray-50 focus-within:border-teal-400 focus-within:bg-white transition-all w-full md:w-96">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, Transaction ID..."
              className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
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
      </div>

      {/* FILTER ROW - Toggled by Filters Button */}
      {showFilters && (
        <div className="bg-gray-100 border-b px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-4">
            {/* ID From / To */}
            <div>
              <div className="text-xs text-gray-500 mb-1 font-medium">ID</div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="From" className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" />
                <input type="text" placeholder="To" className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" />
              </div>
            </div>

            {/* Order ID */}
            <div>
              <div className="text-xs text-gray-500 mb-1 font-medium">Order ID</div>
              <input type="text" placeholder="Order ID" className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" />
            </div>

            {/* Transaction ID */}
            <div>
              <div className="text-xs text-gray-500 mb-1 font-medium">Transaction ID</div>
              <input type="text" placeholder="Transaction ID" className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" />
            </div>

            {/* Parent Transaction ID */}
            <div>
              <div className="text-xs text-gray-500 mb-1 font-medium">Parent Transaction ID</div>
              <input type="text" placeholder="Parent ID" className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" />
            </div>

            {/* Payment Method */}
            <div>
              <div className="text-xs text-gray-500 mb-1 font-medium">Payment Method</div>
              <select className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400">
                <option value="">All</option>
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            {/* Transaction Type */}
            <div>
              <div className="text-xs text-gray-500 mb-1 font-medium">Transaction Type</div>
              <select className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400">
                <option value="">All</option>
                <option value="capture">Capture</option>
                <option value="refund">Refund</option>
              </select>
            </div>

            {/* Closed */}
            <div>
              <div className="text-xs text-gray-500 mb-1 font-medium">Closed</div>
              <select className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400">
                <option value="">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Created From / To */}
            <div className="lg:col-span-2">
              <div className="text-xs text-gray-500 mb-1 font-medium">Created</div>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" />
                <input type="date" className="w-full px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTION + PAGINATION BAR */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4 bg-gray-50">
        <div className="flex items-center gap-4">
          <select className="px-4 py-2 border border-gray-300 rounded-2xl text-sm bg-white focus:border-teal-400">
            <option>Actions</option>
            <option>Refund Selected</option>
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

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
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
              <th className={thClass}>ID</th>
              <th className={thClass}>Order ID</th>
              <th className={thClass}>Transaction ID</th>
              <th className={thClass}>Parent Transaction ID</th>
              <th className={thClass}>Payment Method</th>
              <th className={thClass}>Transaction Type</th>
              <th className={thClass}>Closed</th>
              <th className={thClass}>Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-24 text-center">
                  <p className="text-gray-500 text-xl font-light">We couldn't find any records.</p>
                  <p className="text-gray-400 text-sm mt-3">Try adjusting your search or filters.</p>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={9} className="py-12 text-center text-gray-400">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MagentoTransactionList;