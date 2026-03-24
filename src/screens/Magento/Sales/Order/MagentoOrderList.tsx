// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Eye } from "lucide-react";
// import { FaPlus, FaFilter } from "react-icons/fa";
// import FilterBar from "../../../component/orderManagement/FilterBar";
// import { useGetOrdersQuery, type OrderFilters } from "../../../app/api/MagentoSlices/OrderSlice";
// import OrderFilter from "./OrderFilter";
// import StoreViewDropdown from "../../../component/StoreViewDropdown";
// import type { StoreViewSelection } from "../../../model/MagentoProduct/StoreViewSelection";

// function MagentoOrderList() {
//   const navigate = useNavigate();
//   const [appliedFilters, setAppliedFilters] = useState<OrderFilters>({});  // ✅ add
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showFilter, setShowFilter] = useState(false);
//    const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });
//   const itemsPerPage = 8;
//   const { data, isLoading, error } = useGetOrdersQuery({
//     filters: appliedFilters,
//     page: currentPage,
//     pageSize: itemsPerPage,
//   });
//   const handleApplyFilters = (filters: any) => {
//     setAppliedFilters(filters);
//     setCurrentPage(1);
//   };

//   const handleCancelFilters = () => {
//     setAppliedFilters({});
//     setCurrentPage(1);
//   };
//   // const orders = data?.data?.items || []; // ✅ Magento items
//   const orders = data?.items || [];

//   const statusStyle = (status: string) => {
//     switch (status) {
//       case "complete":
//         return "bg-green-100 text-green-600";
//       case "processing":
//         return "bg-blue-100 text-blue-600";
//       case "canceled":
//         return "bg-red-100 text-red-600";
//       case "pending":
//         return "bg-yellow-100 text-yellow-600";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   // ✅ Pagination
//   // const totalPages = Math.ceil(orders.length / itemsPerPage);
//   const totalPages = Math.ceil((data?.total_count || 0) / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

//   const handleViewOrder = (order: any) => {
//     navigate(`/MogentoOrder/${order.entity_id}`, { state: { order } });
//   };

//   const tdBase =
//     "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

//   if (isLoading) return <div className="p-6">Loading orders...</div>;

//   if (error) return <div className="p-6 text-red-500">Error loading orders</div>;

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-6">
//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-lg font-semibold">Magento Orders</h2>
//         <div className="flex items-center gap-3">
//           <StoreViewDropdown onChange={(sel) => setStoreSelection(sel)} />
//           {/* Filter Toggle Button */}
//           <button
//             onClick={() => setShowFilter((prev) => !prev)}
//             className="flex items-center cursor-pointer gap-2 px-6 py-2 rounded-full border border-teal-400 text-teal-500 text-sm font-medium hover:bg-teal-50 transition-colors"
//           >
//             <FaFilter className="text-sm" />
//             {showFilter ? "Hide Filters" : "Show Filters"}
//           </button>
//           <button
//             onClick={() => navigate("/addorder")}
//             className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium"
//           >
//             <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
//               <FaPlus className="text-teal-500 text-sm" />
//             </span>
//             Add Order
//           </button>
//         </div>
//       </div>

//       {/* <FilterBar /> */}
//       {showFilter && (
//         <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
//           <h2 className="text-lg font-semibold mb-4">Filter Orders</h2>
//           <OrderFilter
//             onApply={handleApplyFilters}      // ✅ connected
//           // onCancel={handleCancelFilters}    // ✅ cancel pe filters reset
//           />
//         </div>
//       )}

//       {/* TABLE */}
//       <div className="rounded-t-3xl overflow-hidden mt-6">
//         <table className="w-full text-sm border-separate border-spacing-y-3">
//           <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
//             <tr>
//               <th className="p-4 text-left">Order ID</th>
//               <th className="p-4 text-left">Customer</th>
//               <th className="p-4 text-left">Email</th>
//               <th className="p-4 text-left">Date</th>
//               <th className="p-4 text-left">Total</th>
//               <th className="p-4 text-left">Status</th>
//               {/* <th className="p-4"></th> */}
//             </tr>
//           </thead>

//           <tbody>
//             {orders.map((order: any) => (
//               <tr key={order.entity_id} className="bg-white shadow-sm hover:shadow-md">
//                 <td className={`${tdBase} font-medium text-black`}>
//                   #{order.increment_id}
//                 </td>

//                 <td className={tdBase}>
//                   {order.customer_firstname} {order.customer_lastname}
//                 </td>

//                 <td className={tdBase}>{order.customer_email}</td>

//                 <td className={tdBase}>{order.created_at}</td>

//                 <td className={`${tdBase} font-semibold`}>
//                   ${order.grand_total}
//                 </td>

//                 <td className={tdBase}>
//                   <span
//                     className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle(
//                       order.status
//                     )}`}
//                   >
//                     {order.status}
//                   </span>
//                 </td>

//                 {/* <td className="relative p-4 text-right">
//                   <button
//                     onClick={() => handleViewOrder(order)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <Eye size={18} />
//                   </button>
//                 </td> */}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION */}
//       <div className="flex justify-center gap-2 py-6">
//         {[...Array(totalPages)].map((_, i) => (
//           <button
//             key={i}
//             onClick={() => setCurrentPage(i + 1)}
//             className={`px-3 py-1 rounded ${currentPage === i + 1
//               ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
//               : "bg-gray-100"
//               }`}
//           >
//             {i + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default MagentoOrderList;



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { FaPlus, FaFilter } from "react-icons/fa";
import FilterBar from "../../../../component/orderManagement/FilterBar";
import { useGetOrdersQuery, type OrderFilters } from "../../../../app/api/MagentoSlices/OrderSlice";
import OrderFilter from "./OrderFilter";
import StoreViewDropdown from "../../../../component/StoreViewDropdown";
import type { StoreViewSelection } from "../../../../model/MagentoProduct/StoreViewSelection";

function MagentoOrderList() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<OrderFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });

  const itemsPerPage = 8;

  // ==================== DUMMY DATA (API ko comment kiya) ====================
  // const { data, isLoading, error } = useGetOrdersQuery({
  //   filters: appliedFilters,
  //   page: currentPage,
  //   pageSize: itemsPerPage,
  // });

  const dummyData = {
    items: [
      {
        entity_id: 101,
        increment_id: "000000101",
        customer_firstname: "Ahmed",
        customer_lastname: "Khan",
        customer_email: "ahmed.khan@example.com",
        created_at: "2026-03-20 10:30:00",
        grand_total: 125.50,
        status: "complete",
      },
      {
        entity_id: 102,
        increment_id: "000000102",
        customer_firstname: "Fatima",
        customer_lastname: "Ali",
        customer_email: "fatima.ali@example.com",
        created_at: "2026-03-21 14:15:00",
        grand_total: 89.99,
        status: "processing",
      },
      {
        entity_id: 103,
        increment_id: "000000103",
        customer_firstname: "Bilal",
        customer_lastname: "Rehman",
        customer_email: "bilal.rehman@example.com",
        created_at: "2026-03-22 09:45:00",
        grand_total: 245.00,
        status: "pending",
      },
      {
        entity_id: 104,
        increment_id: "000000104",
        customer_firstname: "Sana",
        customer_lastname: "Malik",
        customer_email: "sana.malik@example.com",
        created_at: "2026-03-22 16:20:00",
        grand_total: 67.75,
        status: "canceled",
      },
      {
        entity_id: 105,
        increment_id: "000000105",
        customer_firstname: "Usman",
        customer_lastname: "Tariq",
        customer_email: "usman.tariq@example.com",
        created_at: "2026-03-23 11:05:00",
        grand_total: 320.00,
        status: "complete",
      },
      {
        entity_id: 106,
        increment_id: "000000106",
        customer_firstname: "Ayesha",
        customer_lastname: "Noor",
        customer_email: "ayesha.noor@example.com",
        created_at: "2026-03-23 13:50:00",
        grand_total: 45.25,
        status: "processing",
      },
      {
        entity_id: 107,
        increment_id: "000000107",
        customer_firstname: "Hassan",
        customer_lastname: "Raza",
        customer_email: "hassan.raza@example.com",
        created_at: "2026-03-24 08:10:00",
        grand_total: 178.90,
        status: "pending",
      },
      {
        entity_id: 108,
        increment_id: "000000108",
        customer_firstname: "Zainab",
        customer_lastname: "Shah",
        customer_email: "zainab.shah@example.com",
        created_at: "2026-03-24 12:40:00",
        grand_total: 99.99,
        status: "complete",
      },
    ],
    total_count: 42, // total orders in dummy (pagination demo ke liye)
  };

  const data = dummyData;
  const isLoading = false;
  const error = null;
  // =====================================================================

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    // Real API mein yahan filter apply hoga, abhi dummy mein ignore kar rahe hain
  };

  const handleCancelFilters = () => {
    setAppliedFilters({});
    setCurrentPage(1);
  };

  const orders = data?.items || [];

  const statusStyle = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-600";
      case "processing":
        return "bg-blue-100 text-blue-600";
      case "canceled":
        return "bg-red-100 text-red-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const totalPages = Math.ceil((data?.total_count || 0) / itemsPerPage);

  const handleViewOrder = (order: any) => {
    navigate(`/MogentoOrder/${order.entity_id}`, { state: { order } });
  };

  const tdBase =
    "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  if (isLoading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading orders</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Magento Orders</h2>
        <div className="flex items-center gap-3">
          <StoreViewDropdown onChange={(sel) => setStoreSelection(sel)} />
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="flex items-center cursor-pointer gap-2 px-6 py-2 rounded-full border border-teal-400 text-teal-500 text-sm font-medium hover:bg-teal-50 transition-colors"
          >
            <FaFilter className="text-sm" />
            {showFilter ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            onClick={() => navigate("/addorder")}
            className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium"
          >
            <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
              <FaPlus className="text-teal-500 text-sm" />
            </span>
            Add Order
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Filter Orders</h2>
          <OrderFilter onApply={handleApplyFilters} />
        </div>
      )}

      {/* TABLE */}
      <div className="rounded-t-3xl overflow-hidden mt-6">
        <table className="w-full text-sm border-separate border-spacing-y-3">
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order: any) => (
              <tr key={order.entity_id} className="bg-white shadow-sm hover:shadow-md">
                <td className={`${tdBase} font-medium text-black`}>
                  #{order.increment_id}
                </td>
                <td className={tdBase}>
                  {order.customer_firstname} {order.customer_lastname}
                </td>
                <td className={tdBase}>{order.customer_email}</td>
                <td className={tdBase}>{order.created_at}</td>
                <td className={`${tdBase} font-semibold`}>
                  ${order.grand_total}
                </td>
                <td className={tdBase}>
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 py-6">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                : "bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MagentoOrderList;


