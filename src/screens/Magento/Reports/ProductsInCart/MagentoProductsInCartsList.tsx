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

function MagentoProductsInCartsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [perPage, setPerPage] = useState(20);
  const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });

  // Dummy Data (Empty to match the image)
  const dummyData = {
    items: [],
    total_count: 0,
  };

  const productsInCarts = dummyData.items || [];

  const filtered = productsInCarts.filter((item: any) =>
    item.product_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.product_id?.toString().includes(search)
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Products in Carts</h2>
            <p className="text-sm text-gray-500 mt-1">Manage products currently added in customer carts</p>
          </div>

          <div className="flex items-center gap-3">
            <StoreViewDropdown onChange={(sel) => setStoreSelection(sel)} />

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
              <button className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-2xl font-medium hover:from-teal-600 hover:to-emerald-700 transition-all">
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-4">
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
        <table className="w-full min-w-[1000px]">
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
              <th className={thClass}>Product</th>
              <th className={thClass}>Price</th>
              <th className={thClass}>Carts</th>
              <th className={thClass}>Orders</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-24 text-center">
                  <p className="text-gray-500 text-xl font-light">We couldn't find any records.</p>
                  <p className="text-gray-400 text-sm mt-3">Try adjusting your search or filters.</p>
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
                  <td className={`${tdClass} font-medium text-gray-900`}>#{item.id}</td>
                  <td className={tdClass}>{item.product_name}</td>
                  <td className={tdClass}>${item.price}</td>
                  <td className={tdClass}>{item.carts_count}</td>
                  <td className={tdClass}>{item.orders_count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MagentoProductsInCartsList;