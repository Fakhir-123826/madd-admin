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

function MagentoProductReviewsReportList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [perPage, setPerPage] = useState(20);
  const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });

  // Dummy Data (as shown in image)
  const dummyData = {
    items: [
      { id: 42, product: "Cruise Dual Analog Watch", reviews: 4, average: "65.0000", approved: "65.0000", last_review: "Feb 24, 2026, 1:04:38 AM" },
      { id: 26, product: "Harmony Lumaflex™ Strength Band Kit", reviews: 3, average: "60.0000", approved: "60.0000", last_review: "Feb 24, 2026, 1:04:40 AM" },
      { id: 11, product: "Voyage Yoga Bag", reviews: 3, average: "67.0000", approved: "67.0000", last_review: "Feb 24, 2026, 1:04:40 AM" },
      { id: 41, product: "Summit Watch", reviews: 3, average: "47.0000", approved: "47.0000", last_review: "Feb 24, 2026, 1:04:38 AM" },
      { id: 14, product: "Endeavor Daytrip Backpack", reviews: 3, average: "73.0000", approved: "73.0000", last_review: "Feb 24, 2026, 1:04:41 AM" },
    ],
    total_count: 30,
  };

  const reviews = dummyData.items || [];

  const filtered = reviews.filter((item: any) =>
    item.product?.toLowerCase().includes(search.toLowerCase()) ||
    item.id?.toString().includes(search)
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

      {/* ACTION BAR */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-4">
          <button className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium transition-all">
            Search
          </button>

          <button 
            onClick={() => setSearch("")}
            className="text-teal-600 hover:text-teal-700 font-medium text-sm transition-all"
          >
            Reset Filter
          </button>

          <span className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{filtered.length}</span> records found
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
            <span className="px-5 py-2 border border-gray-300 rounded-2xl text-sm font-medium">1 of 2</span>
            <button className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-teal-50 text-gray-400 hover:text-teal-600 transition-all">
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE with Search Fields Inside Header */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            {/* Main Header Row */}
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
              <th className={thClass}>Product</th>
              <th className={thClass}>Reviews</th>
              <th className={thClass}>Average</th>
              <th className={thClass}>Average (Approved)</th>
              <th className={thClass}>Last Review</th>
              <th className={thClass + " text-right pr-8"}>Action</th>
            </tr>

            {/* Search Fields Row - Nicely Aligned */}
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ID"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-teal-400"
                />
              </th>
              <th className="px-6 py-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Product"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-teal-400"
                />
              </th>
              <th className="px-6 py-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Reviews"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-teal-400"
                />
              </th>
              <th className="px-6 py-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Average"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-teal-400"
                />
              </th>
              <th className="px-6 py-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Average (Approved)"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-teal-400"
                />
              </th>
              <th className="px-6 py-4">
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-teal-400" />
                  <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-teal-400" />
                </div>
              </th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-24 text-center">
                  <p className="text-gray-500 text-xl font-light">We couldn't find any records.</p>
                </td>
              </tr>
            ) : (
              filtered.map((item: any, idx: number) => (
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
                  <td className={`${tdClass} font-medium`}>{item.id}</td>
                  <td className={tdClass}>{item.product}</td>
                  <td className={tdClass}>{item.reviews}</td>
                  <td className={tdClass}>{item.average}</td>
                  <td className={tdClass}>{item.approved}</td>
                  <td className={tdClass}>{item.last_review}</td>
                  <td className="px-6 py-4 text-right pr-8">
                    <button className="text-teal-600 hover:text-teal-700 font-medium text-sm">Show Reviews</button>
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

export default MagentoProductReviewsReportList;