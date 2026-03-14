import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaChevronDown
} from "react-icons/fa";

const mockTerms = [
  {
    id: 1,
    condition: "Terms and Conditions",
    storeView: "All Store Views\nMain Website Store\nDefault Store View",
    status: "Enabled"
  },
  // aur mock data add kar sakte ho
];

const MagentoTermsConditionsList = () => {
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = mockTerms.filter(t =>
    t.condition.toLowerCase().includes(search.toLowerCase()) ||
    t.storeView.toLowerCase().includes(search.toLowerCase())
  );

  const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
  const tdClass = "px-4 py-3 text-xs text-gray-600 whitespace-nowrap";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Terms and Conditions</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage terms and conditions for your store</p>
        </div>
        <button
          onClick={() => navigate("/AddMagentoTermsCondition")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
          style={{ background: "linear-gradient(to right, #f97316, #ea580c)" }}
        >
          + Add New Condition
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 focus-within:border-teal-400 transition-all">
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-gray-700">{filtered.length}</span> records found
          </span>
          <select
            value={perPage}
            onChange={e => setPerPage(Number(e.target.value))}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50"
          >
            <option>20</option>
            <option>30</option>
            <option>50</option>
            <option>100</option>
          </select>
          <span className="text-sm text-gray-500">per page</span>
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
              <th className={thClass}>ID</th>
              <th className={thClass}>Condition</th>
              <th className={thClass}>Store View</th>
              <th className={thClass}>Status</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b hover:bg-blue-50/30 transition-colors">
                <td className={`${tdClass} font-medium text-gray-700`}>{t.id}</td>
                <td className={tdClass}>{t.condition}</td>
                <td className={tdClass} style={{ whiteSpace: "pre-line" }}>{t.storeView}</td>
                <td className={tdClass}>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      t.status === "Disabled"
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "bg-green-50 text-green-600 border border-green-200"
                    }`}
                  >
                    {t.status}
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
                  No terms and conditions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MagentoTermsConditionsList;