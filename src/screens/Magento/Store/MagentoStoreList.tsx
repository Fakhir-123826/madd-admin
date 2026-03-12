// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Eye } from "lucide-react";
// import { FaPlus, FaFilter } from "react-icons/fa";
// import { useGetAllStoresQuery } from "../../../app/api/MagentoSlices/StoreSlice";
// import StoreViewDropdown from "../../../component/StoreViewDropdown";
// import type { StoreViewSelection } from "../../../model/MagentoProduct/StoreViewSelection";

// function MagentoStoreList() {
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showFilter, setShowFilter] = useState(false);
//    const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });
//   const itemsPerPage = 8;

//   const { data, isLoading, error } = useGetAllStoresQuery({
//     page: currentPage,
//     pageSize: itemsPerPage,
//   });

//   const stores = Array.isArray(data) ? data : [];

//   const tdBase =
//     "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

//   if (isLoading) return <div className="p-6">Loading stores...</div>;
//   if (error) return <div className="p-6 text-red-500">Error loading stores</div>;

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-6">
//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-lg font-semibold">Magento Stores</h2>
//           <div className="flex items-center gap-3">
//           <StoreViewDropdown onChange={(sel) => setStoreSelection(sel)} />
//           {/* Filter Toggle */}
//           <button
//             onClick={() => setShowFilter((prev) => !prev)}
//             className="flex items-center cursor-pointer gap-2 px-6 py-2 rounded-full border border-teal-400 text-teal-500 text-sm font-medium hover:bg-teal-50 transition-colors"
//           >
//             <FaFilter className="text-sm" />
//             {showFilter ? "Hide Filters" : "Show Filters"}
//           </button>
//           <button
//             onClick={() => navigate("/addstore")}
//             className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium"
//           >
//             <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
//               <FaPlus className="text-teal-500 text-sm" />
//             </span>
//             Add Store
//           </button>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="rounded-t-3xl overflow-x-auto mt-6">
//         <table className="w-full text-sm border-separate border-spacing-y-3">
//           <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
//             <tr>
//               <th className="p-4 text-left">ID</th>
//               <th className="p-4 text-left">Code</th>
//               <th className="p-4 text-left">Name</th>
//               <th className="p-4 text-left">Website ID</th>
//               <th className="p-4 text-left">Group ID</th>
//               <th className="p-4 text-left">Status</th>
//               <th className="p-4"></th>
//             </tr>
//           </thead>

//           <tbody>
//             {stores.length > 0 ? (
//               stores.map((store: any) => (
//                 <tr key={store.id} className="bg-white shadow-sm hover:shadow-md">
//                   <td className={`${tdBase} font-medium text-black`}>
//                     #{store.id}
//                   </td>
//                   <td className={tdBase}>
//                     <span className="px-2 py-1 bg-gray-100 rounded-md font-mono text-xs">
//                       {store.code}
//                     </span>
//                   </td>
//                   <td className={tdBase}>{store.name}</td>
//                   <td className={tdBase}>{store.website_id}</td>
//                   <td className={tdBase}>{store.store_group_id}</td>
//                   <td className={tdBase}>
//                     <span className={`px-2 py-1 rounded-md text-xs font-medium ${store.is_active
//                         ? "bg-green-50 text-green-600"
//                         : "bg-red-50 text-red-600"
//                       }`}>
//                       {store.is_active ? "Active" : "Inactive"}
//                     </span>
//                   </td>
//                   <td className="relative p-4 text-right">
//                     <button
//                       onClick={() => navigate(`/MagentoStoreList/${store.id}`, { state: { store } })}
//                       className="text-gray-400 hover:text-gray-600"
//                     >
//                       <Eye size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={7} className="text-center py-6 text-gray-400">
//                   No stores found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION */}
//       <div className="flex justify-center gap-2 py-6">
//         <button
//           onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           disabled={currentPage === 1}
//           className="px-3 py-1 rounded bg-gray-100 disabled:opacity-40"
//         >
//           Prev
//         </button>
//         <span className="px-3 py-1 rounded bg-gradient-to-r from-teal-400 to-green-400 text-white">
//           {currentPage}
//         </span>
//         <button
//           onClick={() => setCurrentPage((p) => p + 1)}
//           disabled={stores.length < itemsPerPage}
//           className="px-3 py-1 rounded bg-gray-100 disabled:opacity-40"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// export default MagentoStoreList;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilter, FaColumns, FaChevronLeft, FaChevronRight, FaChevronDown, FaPlus
} from "react-icons/fa";
import { useGetAllStoresQuery } from "../../../app/api/MagentoSlices/StoreSlice";

function MagentoManageStoresList() {
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);

  const { data, isLoading } = useGetAllStoresQuery({ page: currentPage, pageSize: perPage });

  const stores = data?.data || [];

  const thClass = "px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap";
  const tdClass = "px-4 py-3 text-xs text-gray-600 whitespace-nowrap";

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Stores / Websites / Store Views</h2>
            <p className="text-sm text-gray-400 mt-0.5">Manage websites, stores, and store views</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
              <FaPlus className="text-xs" /> Create Store View
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
              <FaPlus className="text-xs" /> Create Store
            </button> */}
            <button onClick={() => navigate("/AddMagentoStor")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
              <FaPlus className="text-xs" /> Create Website
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all
              ${showFilters ? "border-teal-400 text-teal-600 bg-teal-50" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            <FaFilter className="text-xs" /> Filters
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Default View <FaChevronDown className="text-xs opacity-50" />
          </button>
          <div className="relative">
            <button onClick={() => setShowColumns(!showColumns)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50">
              <FaColumns className="text-xs" /> Columns <FaChevronDown className="text-xs opacity-50" />
            </button>
            {showColumns && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowColumns(false)} />
                <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-44 space-y-2">
                  {["Web Site", "Store", "Store View"].map(col => (
                    <label key={col} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-teal-500" /> {col}
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Filters Panel (agar chahiye toh expand kar sakte hain) */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Web Site</label>
                <input className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Store</label>
                <input className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Store View</label>
                <input className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-teal-400 bg-gray-50" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowFilters(false)} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-2">
                Cancel
              </button>
              <button className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90"
                style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PAGINATION BAR */}
      <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-gray-400">
          <span className="font-semibold text-gray-700">{stores.length}</span> records found
        </span>
        <div className="flex items-center gap-2">
          <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}
            className="px-2 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-600 outline-none bg-gray-50">
            {[20, 30, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="text-xs text-gray-400">per page</span>
          <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400" disabled={currentPage === 1}>
            <FaChevronLeft className="text-xs" />
          </button>
          <span className="text-xs font-medium text-gray-700">{currentPage} of 1</span>
          <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400">
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: "800px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
              <th className={thClass}>Web Site</th>
              <th className={thClass}>Store</th>
              <th className={thClass}>Store View</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((item: any) => (
              <tr key={item.id}
                className="border-b border-gray-200 hover:bg-blue-50/30 transition-all">
                <td className={tdClass}>— <span className="text-xs text-gray-500">(Code: —)</span></td>
                <td className={tdClass}>— <span className="text-xs text-gray-500">(Code: —)</span></td>
                <td className={tdClass}>
                  {item.name} <br />
                  <span className="text-xs text-blue-600">(Code: {item.code})</span>
                </td>
              </tr>
            ))}

            {stores.length === 0 && (
              <tr><td colSpan={3} className="text-center py-12 text-gray-500">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MagentoManageStoresList;