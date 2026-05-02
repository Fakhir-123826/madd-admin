import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const mockStatuses = [
  { status: "Suspected Fraud", code: "fraud", default: "No", visible: "Yes", title: "processing[Processing]", action: "Unassign" },
  { status: "Processing", code: "processing", default: "Yes", visible: "Yes", title: "processing[Processing]", action: "Unassign" },
  { status: "Pending Payment", code: "pending_payment", default: "Yes", visible: "No", title: "pending_payment[Pending Payment]", action: "Unassign" },
  { status: "Suspected Fraud", code: "fraud", default: "No", visible: "Yes", title: "payment_review[Payment Review]", action: "Unassign" },
  { status: "Payment Review", code: "payment_review", default: "Yes", visible: "Yes", title: "payment_review[Payment Review]", action: "Unassign" },
  { status: "Pending", code: "pending", default: "Yes", visible: "Yes", title: "new[Pending]", action: "Unassign" },
  { status: "On Hold", code: "holded", default: "Yes", visible: "Yes", title: "holded[On Hold]", action: "Unassign" },
  { status: "Complete", code: "complete", default: "Yes", visible: "Yes", title: "complete[Complete]", action: "Unassign" },
  // aur add kar sakte ho
];

const MagentoOrderStatusList = () => {
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = mockStatuses.filter(s =>
    s.status.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
  const tdClass = "px-4 py-3 text-xs text-gray-600 whitespace-nowrap";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-semibold text-gray-800">Order Status</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Assign Status to State
          </button>
          <button
            onClick={() => navigate("/AddMagentoOrderStatus")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(to right, #f97316, #ea580c)" }}
          >
            + Create New Status
          </button>
        </div>
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
        <table className="w-full border-collapse min-w-[1000px]">
          <thead>
            <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
              <th className={thClass}>Status</th>
              <th className={thClass}>Status Code</th>
              <th className={thClass}>Default Status</th>
              <th className={thClass}>Visible On Storefront</th>
              <th className={thClass}>State Code and Title</th>
              <th className={thClass}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, idx) => (
              <tr key={idx} className="border-b hover:bg-blue-50/30 transition-colors">
                <td className={`${tdClass} font-medium text-gray-700`}>{s.status}</td>
                <td className={tdClass}>{s.code}</td>
                <td className={tdClass}>{s.default}</td>
                <td className={tdClass}>{s.visible}</td>
                <td className={tdClass}>{s.title}</td>
                <td className={`${tdClass} text-right`}>
                  <button className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
                    {s.action}
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">
                  No order statuses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MagentoOrderStatusList;