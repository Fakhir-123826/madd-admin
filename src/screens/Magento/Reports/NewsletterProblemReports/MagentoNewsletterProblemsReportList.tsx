import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaColumns,
  FaFileExport,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import StoreViewDropdown from "../../../../component/StoreViewDropdown";
import type { StoreViewSelection } from "../../../../model/MagentoProduct/StoreViewSelection";

function MagentoNewsletterProblemsReportList() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number[]>([]);
  const [perPage, setPerPage] = useState(20);
  const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });

  // Dummy Data (Empty to match image)
  const dummyData = {
    items: [],
    total_count: 0,
  };

  const problems = dummyData.items || [];

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === problems.length ? [] : problems.map((i: any) => i.id)
    );
  };

  const thClass = "px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap";
  const tdClass = "px-6 py-4 text-sm text-gray-600 whitespace-nowrap";

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 w-full">

      {/* ACTION BAR */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-4">
          <button className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium transition-all">
            Search
          </button>

          <button className="text-teal-600 hover:text-teal-700 font-medium text-sm transition-all">
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

      {/* FILTER ROW - Single Row, Optimized for 70% Content Area */}
      <div className="bg-gray-100 border-b px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">

          {/* ID */}
          <div>
            <div className="text-xs text-gray-500 mb-1 font-medium">ID</div>
            <input 
              type="text" 
              placeholder="ID" 
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 text-sm focus:border-teal-400 focus:ring-1 focus:ring-teal-400" 
            />
          </div>

          {/* Subscriber */}
          <div>
            <div className="text-xs text-gray-500 mb-1 font-medium">Subscriber</div>
            <input 
              type="text" 
              placeholder="Subscriber" 
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 text-sm focus:border-teal-400 focus:ring-1 focus:ring-teal-400" 
            />
          </div>

          {/* Queue Start Date */}
          <div>
            <div className="text-xs text-gray-500 mb-1 font-medium">Queue Start Date</div>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" className="w-full px-5 py-3 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" />
              <input type="date" className="w-full px-5 py-3 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" />
            </div>
          </div>

          {/* Queue Subject */}
          <div>
            <div className="text-xs text-gray-500 mb-1 font-medium">Queue Subject</div>
            <input 
              type="text" 
              placeholder="Queue Subject" 
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 text-sm focus:border-teal-400 focus:ring-1 focus:ring-teal-400" 
            />
          </div>

          {/* Error Code */}
          <div>
            <div className="text-xs text-gray-500 mb-1 font-medium">Error Code</div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="From" className="w-full px-5 py-3 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" />
              <input type="text" placeholder="To" className="w-full px-5 py-3 rounded-2xl border border-gray-300 text-sm focus:border-teal-400" />
            </div>
          </div>

          {/* Error Text */}
          <div>
            <div className="text-xs text-gray-500 mb-1 font-medium">Error Text</div>
            <input 
              type="text" 
              placeholder="Error Text" 
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 text-sm focus:border-teal-400 focus:ring-1 focus:ring-teal-400" 
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-emerald-500">
              <th className="px-6 py-4 w-10">
                <input
                  type="checkbox"
                  checked={selected.length === problems.length && problems.length > 0}
                  onChange={toggleAll}
                  className="w-4 h-4 accent-white"
                />
              </th>
              <th className={thClass}>ID</th>
              <th className={thClass}>Subscriber</th>
              <th className={thClass}>Queue Start Date</th>
              <th className={thClass}>Queue Subject</th>
              <th className={thClass}>Error Code</th>
              <th className={thClass}>Error Text</th>
            </tr>
          </thead>
          <tbody>
            {problems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-24 text-center">
                  <p className="text-gray-500 text-xl font-light">We found no problems.</p>
                </td>
              </tr>
            ) : (
              // Your data rows will come here
              <tr></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MagentoNewsletterProblemsReportList;