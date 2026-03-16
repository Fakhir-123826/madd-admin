import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch, FaFilter, FaColumns, FaChevronLeft, FaChevronRight, FaChevronDown
} from "react-icons/fa";

const mockRatings = [
  { id: 3, rating: "Price", sortOrder: 0, isActive: "Active" },
  { id: 1, rating: "Quality", sortOrder: 0, isActive: "Active" },
  { id: 4, rating: "Rating", sortOrder: 0, isActive: "Active" },
  { id: 2, rating: "Value", sortOrder: 0, isActive: "Active" },
  { id: 5, rating: "wwer wwer", sortOrder: 5, isActive: "Active" },
  { id: 6, rating: "wwer wwer123", sortOrder: 3, isActive: "Active" },
];

const MagentoProductRatingsList = () => {
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);

  const filtered = mockRatings.filter(r =>
    r.rating.toLowerCase().includes(search.toLowerCase())
  );

  const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
  const tdClass = "px-4 py-3 text-xs text-gray-600 whitespace-nowrap";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Product Ratings</h2>
            <p className="text-sm text-gray-400 mt-0.5">Manage product rating attributes</p>
          </div>
          <button
            onClick={() => navigate("/AddMagentoRating")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(to right, #f97316, #ea580c)" }}
          >
            + Add New Rating
          </button>
        </div>

        {/* TOOLBAR */}
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
                    {["ID", "Rating", "Sort Order", "Is Active", "Action"].map((col) => (
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
              <label className="text-xs font-medium text-gray-600 mb-1 block">Rating Name</label>
              <input type="text" placeholder="Filter by name"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-400 bg-gray-50" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Sort Order</label>
              <input type="number" placeholder="Filter by sort order"
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

      {/* PAGINATION BAR */}
      <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-gray-400">
          <span className="font-semibold text-gray-700">{filtered.length}</span> records found
        </span>
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
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
              <th className={thClass}>ID</th>
              <th className={thClass}>Rating</th>
              <th className={thClass}>Sort Order</th>
              <th className={thClass}>Is Active</th>
              <th className={thClass}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => (
              <tr key={r.id}
                className="border-b border-gray-200 hover:bg-blue-50/30 transition-all">
                <td className={`${tdClass} font-medium text-gray-700`}>{r.id}</td>
                <td className={tdClass}>{r.rating}</td>
                <td className={tdClass}>{r.sortOrder}</td>
                <td className={tdClass}>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    r.isActive === "Active" ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
                  }`}>
                    {r.isActive}
                  </span>
                </td>
                <td className={`${tdClass} text-right`}>
                  <button className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
                    Edit
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500">
                  No ratings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MagentoProductRatingsList;