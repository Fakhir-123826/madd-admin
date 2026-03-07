import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { FaPlus, FaFilter } from "react-icons/fa";
import { useGetAllStoresQuery } from "../../../app/api/MagentoSlices/StoreSlice";
import StoreViewDropdown from "../../../component/StoreViewDropdown";
import type { StoreViewSelection } from "../../../model/MagentoProduct/StoreViewSelection";

function MagentoStoreList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
   const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });
  const itemsPerPage = 8;

  const { data, isLoading, error } = useGetAllStoresQuery({
    page: currentPage,
    pageSize: itemsPerPage,
  });

  const stores = Array.isArray(data) ? data : [];

  const tdBase =
    "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  if (isLoading) return <div className="p-6">Loading stores...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading stores</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Magento Stores</h2>
          <div className="flex items-center gap-3">
          <StoreViewDropdown onChange={(sel) => setStoreSelection(sel)} />
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="flex items-center cursor-pointer gap-2 px-6 py-2 rounded-full border border-teal-400 text-teal-500 text-sm font-medium hover:bg-teal-50 transition-colors"
          >
            <FaFilter className="text-sm" />
            {showFilter ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            onClick={() => navigate("/addstore")}
            className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium"
          >
            <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
              <FaPlus className="text-teal-500 text-sm" />
            </span>
            Add Store
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-t-3xl overflow-x-auto mt-6">
        <table className="w-full text-sm border-separate border-spacing-y-3">
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Code</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Website ID</th>
              <th className="p-4 text-left">Group ID</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>

          <tbody>
            {stores.length > 0 ? (
              stores.map((store: any) => (
                <tr key={store.id} className="bg-white shadow-sm hover:shadow-md">
                  <td className={`${tdBase} font-medium text-black`}>
                    #{store.id}
                  </td>
                  <td className={tdBase}>
                    <span className="px-2 py-1 bg-gray-100 rounded-md font-mono text-xs">
                      {store.code}
                    </span>
                  </td>
                  <td className={tdBase}>{store.name}</td>
                  <td className={tdBase}>{store.website_id}</td>
                  <td className={tdBase}>{store.store_group_id}</td>
                  <td className={tdBase}>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${store.is_active
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                      }`}>
                      {store.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="relative p-4 text-right">
                    <button
                      onClick={() => navigate(`/MagentoStoreList/${store.id}`, { state: { store } })}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  No stores found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 py-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-100 disabled:opacity-40"
        >
          Prev
        </button>
        <span className="px-3 py-1 rounded bg-gradient-to-r from-teal-400 to-green-400 text-white">
          {currentPage}
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={stores.length < itemsPerPage}
          className="px-3 py-1 rounded bg-gray-100 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MagentoStoreList;