import { useState } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import StoreViewDropdown from "../../../component/StoreViewDropdown";
import type { StoreViewSelection } from "../../../model/MagentoProduct/StoreViewSelection";

function MagentoNotificationsList() {
  const [selected, setSelected] = useState<number[]>([]);
  const [perPage, setPerPage] = useState(20);
  const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });

  // Dummy Data
  const notifications = [
    {
      id: 1,
      severity: "NOTICE",
      dateAdded: "Feb 21, 2026, 2:40:49 AM",
      message: "Disable Notice - To improve performance, collecting statistics for the Magento Report module is disabled by default. You can enable it in System Config.",
    },
  ];

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === notifications.length ? [] : notifications.map((n) => n.id)
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-8 py-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FaBell className="text-3xl text-emerald-600" />
          <h1 className="text-3xl font-semibold text-gray-800">Notifications</h1>
        </div>

        {/* Top Right */}
        <div className="flex items-center gap-6">
          <FaSearch className="text-xl text-gray-500 cursor-pointer hover:text-emerald-600 transition-colors" />

          <div className="relative cursor-pointer">
            <FaBell className="text-xl text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
              1
            </span>
          </div>

          <StoreViewDropdown onChange={(sel) => setStoreSelection(sel)} />

          <div className="flex items-center gap-3 pl-6 border-l">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">admin</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-8 py-4 bg-gray-50 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select className="px-5 py-2.5 border border-gray-300 rounded-2xl text-sm bg-white focus:border-emerald-500">
            <option>Actions</option>
            <option>Mark as Read</option>
            <option>Delete Selected</option>
          </select>

          <span className="text-sm text-gray-600 font-medium">
            {notifications.length} records found
          </span>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-sm">
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-2xl bg-white focus:border-emerald-500 cursor-pointer"
            >
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-gray-500">per page</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-100 disabled:opacity-40">
              ←
            </button>

            <div className="px-6 py-2 bg-white border border-gray-200 rounded-2xl font-medium text-gray-800">
              1 of 1
            </div>

            <button className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-100 disabled:opacity-40">
              →
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <th className="px-6 py-5 w-12">
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  className="accent-white"
                />
              </th>
              <th className="px-6 py-5 text-left text-sm font-semibold">Severity</th>
              <th className="px-6 py-5 text-left text-sm font-semibold">Date Added</th>
              <th className="px-6 py-5 text-left text-sm font-semibold">Message</th>
              <th className="px-6 py-5 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notif) => (
              <tr 
                key={notif.id} 
                className="border-b hover:bg-emerald-50 transition-colors"
              >
                <td className="px-6 py-6">
                  <input
                    type="checkbox"
                    checked={selected.includes(notif.id)}
                    onChange={() => toggleSelect(notif.id)}
                    className="accent-emerald-500"
                  />
                </td>
                <td className="px-6 py-6">
                  <span className="px-5 py-1.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                    {notif.severity}
                  </span>
                </td>
                <td className="px-6 py-6 text-sm text-gray-600">
                  {notif.dateAdded}
                </td>
                <td className="px-6 py-6 text-sm text-gray-700 leading-relaxed">
                  {notif.message}
                </td>
                <td className="px-6 py-6 text-right">
                  <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {notifications.length === 0 && (
              <tr>
                <td colSpan={5} className="py-24 text-center text-gray-500">
                  No notifications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MagentoNotificationsList;