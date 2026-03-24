// import { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { Eye, Trash2, Edit } from "lucide-react";
// import { FaPlus, FaFilter } from "react-icons/fa";
// import FilterBar from "../../../component/orderManagement/FilterBar";
// import Pagination from "../../../component/Pagination";
// import {
//   useGetCustomersQuery,
//   type MagentoCustomer,
//   useDeleteCustomerMutation,
// } from "../../../app/api/MagentoSlices/CustomerSlice";
// import CustomerFilter from "./CustomerFilter";
// import { type CustomerFilters } from "../../../app/api/MagentoSlices/CustomerSlice";
// import StoreViewDropdown from "../../../component/StoreViewDropdown";
// import type { StoreViewSelection } from "../../../model/MagentoProduct/StoreViewSelection";


// function MagentoCustomerList() {
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showFilter, setShowFilter] = useState(false);
//   const [appliedFilters, setAppliedFilters] = useState<CustomerFilters>({});
//   const itemsPerPage = 10;
//   const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });

//   const { data, isLoading, isFetching, error } = useGetCustomersQuery({
//     filters: appliedFilters,
//     page: currentPage,
//     pageSize: itemsPerPage,
//   });

//   console.log(data)
//   const handleApplyFilters = (filters: CustomerFilters) => {
//     setAppliedFilters(filters);
//     setCurrentPage(1);
//   };

//   const handleCancelFilters = () => {
//     setAppliedFilters({});
//     setCurrentPage(1);
//   };

//   const [deleteCustomer] = useDeleteCustomerMutation();

//   // Pagination
//   // const customers: MagentoCustomer[] = Array.isArray(data?.items)
//   //   ? data.items
//   //   : [];

//   // const totalPages = Math.ceil((data?.total_count || 0) / itemsPerPage);

//   const customers = Array.isArray(data?.data?.items) ? data.data.items : [];
//   const totalPages = Math.ceil((data?.data?.total_count || 0) / itemsPerPage);


//   // const paginatedCustomers = useMemo(() => {
//   //   const start = (currentPage - 1) * itemsPerPage;
//   //   return customers.slice(start, start + itemsPerPage);
//   // }, [customers, currentPage, itemsPerPage]);

//   const paginatedCustomers = customers;

//   const tdBase =
//     "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

//   if (isLoading) return <div className="p-6">Loading customers...</div>;
//   if (error) return <div className="p-6 text-red-500">Error loading customers</div>;

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-6">
//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-lg font-semibold">Magento Customers</h2>
//         <div className="flex items-center gap-3">
//           <StoreViewDropdown onChange={(sel) => setStoreSelection(sel)} />

//           {/* Filter Toggle Button */}
//           <button
//             onClick={() => setShowFilter((prev) => !prev)}
//             className="flex items-center  gap-2 cursor-pointer px-6 py-2 rounded-full border border-teal-400 text-teal-500 text-sm font-medium hover:bg-teal-50 transition-colors"
//           >
//             <FaFilter className="text-sm" />
//             {showFilter ? "Hide Filters" : "Show Filters"}
//           </button>
//           <button
//             onClick={() => navigate("/AddMagentoCustomer")}
//             className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium"
//           >
//             <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
//               <FaPlus className="text-teal-500 text-sm" />
//             </span>
//             Add Customer
//           </button>
//         </div>
//       </div>

//       {showFilter && (
//         <CustomerFilter
//           onApply={handleApplyFilters}
//         // onCancel={handleCancelFilters}
//         />
//       )}

//       {/* TABLE */}
//       <div className="rounded-t-3xl overflow-x-auto mt-6">
//         <table className="w-max min-w-full text-sm border-separate border-spacing-y-3">
//           <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
//             <tr>
//               <th className="p-4 text-left">ID</th>
//               <th className="p-4 text-left">First Name</th>
//               <th className="p-4 text-left">Last Name</th>
//               <th className="p-4 text-left">Email</th>
//               <th className="p-4 text-left">Status</th>
//               <th className="p-4"></th>
//             </tr>
//           </thead>

//           <tbody>
//             {isFetching ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-6">
//                   Loading customers...
//                 </td>
//               </tr>
//             ) : paginatedCustomers.length ? (
//               paginatedCustomers.map((customer) => (
//                 <tr key={customer.id} className="bg-white shadow-sm hover:shadow-md">
//                   <td className={`${tdBase} font-medium text-black`}>#{customer.id}</td>
//                   <td className={tdBase}>{customer.firstname}</td>
//                   <td className={tdBase}>{customer.lastname}</td>
//                   <td className={tdBase}>{customer.email}</td>
//                   <td className={tdBase}>
//                     <span
//                       className={`px-3 py-1 rounded-md text-xs font-medium ${customer.is_active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
//                         }`}
//                     >
//                       {customer.is_active ? "Active" : "Inactive"}
//                     </span>
//                   </td>
//                   <td className="relative p-4 text-right flex gap-2 justify-end">
//                     <button
//                       onClick={() =>
//                         navigate(`/customers/${customer.id}`, { state: { customer } })
//                       }
//                       className="text-gray-400 hover:text-gray-600"
//                       title="View"
//                     >
//                       <Eye size={18} />
//                     </button>
//                     <button
//                       onClick={() =>
//                         navigate(`/AddMagentoCustomer/${customer.id}`)
//                       }
//                       className="text-gray-400 hover:text-gray-600"
//                       title="Edit"
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={() => deleteCustomer(customer.id!)}
//                       className="text-gray-400 hover:text-red-600"
//                       title="Delete"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={6} className="text-center py-6">
//                   No customers found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION */}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={(page) => !isFetching && setCurrentPage(page)}
//         delta={2}
//         showFirstLast={true}
//         className="my-4"
//       />
//     </div>
//   );
// }

// export default MagentoCustomerList;


import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Edit } from "lucide-react";
import { FaPlus, FaFilter } from "react-icons/fa";
import Pagination from "../../../component/Pagination";
import CustomerFilter from "./CustomerFilter";
import {
  useGetCustomersQuery,
  type MagentoCustomer,
  useDeleteCustomerMutation,
} from "../../../app/api/MagentoSlices/CustomerSlice";
import StoreViewDropdown from "../../../component/StoreViewDropdown";
import type { StoreViewSelection } from "../../../model/MagentoProduct/StoreViewSelection";

function MagentoCustomerList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<CustomerFilters>({});
  const itemsPerPage = 10;
  const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });

  // ==================== DUMMY DATA (API commented out) ====================
  // const { data, isLoading, isFetching, error } = useGetCustomersQuery({
  //   filters: appliedFilters,
  //   page: currentPage,
  //   pageSize: itemsPerPage,
  // });

  const dummyCustomers: MagentoCustomer[] = [
    {
      id: 1,
      firstname: "Ahmed",
      lastname: "Khan",
      email: "ahmed.khan@example.com",
      is_active: true,
      created_at: "2025-08-15 10:30:00",
      updated_at: "2026-03-20 14:25:00",
      group_id: 1,
      store_id: 1,
      website_id: 1,
    },
    {
      id: 2,
      firstname: "Fatima",
      lastname: "Ali",
      email: "fatima.ali@example.com",
      is_active: true,
      created_at: "2025-09-10 09:15:00",
      updated_at: "2026-03-22 11:40:00",
      group_id: 1,
      store_id: 1,
      website_id: 1,
    },
    {
      id: 3,
      firstname: "Bilal",
      lastname: "Rehman",
      email: "bilal.rehman@example.com",
      is_active: false,
      created_at: "2025-10-05 16:45:00",
      updated_at: "2026-03-21 08:20:00",
      group_id: 2,
      store_id: 2,
      website_id: 2,
    },
    {
      id: 4,
      firstname: "Sana",
      lastname: "Malik",
      email: "sana.malik@example.com",
      is_active: true,
      created_at: "2025-11-20 12:00:00",
      updated_at: "2026-03-23 15:10:00",
      group_id: 1,
      store_id: 1,
      website_id: 1,
    },
    {
      id: 5,
      firstname: "Usman",
      lastname: "Tariq",
      email: "usman.tariq@example.com",
      is_active: true,
      created_at: "2025-12-01 14:30:00",
      updated_at: "2026-03-24 10:05:00",
      group_id: 3,
      store_id: 3,
      website_id: 3,
    },
    {
      id: 6,
      firstname: "Ayesha",
      lastname: "Noor",
      email: "ayesha.noor@example.com",
      is_active: false,
      created_at: "2026-01-15 08:45:00",
      updated_at: "2026-03-19 13:55:00",
      group_id: 1,
      store_id: 1,
      website_id: 1,
    },
    {
      id: 7,
      firstname: "Hassan",
      lastname: "Raza",
      email: "hassan.raza@example.com",
      is_active: true,
      created_at: "2026-02-10 11:20:00",
      updated_at: "2026-03-22 09:30:00",
      group_id: 2,
      store_id: 2,
      website_id: 2,
    },
    {
      id: 8,
      firstname: "Zainab",
      lastname: "Shah",
      email: "zainab.shah@example.com",
      is_active: true,
      created_at: "2026-02-25 13:10:00",
      updated_at: "2026-03-23 16:40:00",
      group_id: 1,
      store_id: 1,
      website_id: 1,
    },
    {
      id: 9,
      firstname: "Omar",
      lastname: "Farooq",
      email: "omar.farooq@example.com",
      is_active: true,
      created_at: "2026-03-01 07:55:00",
      updated_at: "2026-03-24 12:15:00",
      group_id: 3,
      store_id: 3,
      website_id: 3,
    },
    {
      id: 10,
      firstname: "Maryam",
      lastname: "Khan",
      email: "maryam.khan@example.com",
      is_active: false,
      created_at: "2026-03-05 10:00:00",
      updated_at: "2026-03-20 14:50:00",
      group_id: 1,
      store_id: 1,
      website_id: 1,
    },
  ];

  const dummyData = {
    data: {
      items: dummyCustomers,
      total_count: 124, // Total customers in your Magento store
    },
  };

  const data = dummyData;
  const isLoading = false;
  const isFetching = false;
  const error = null;
  // =====================================================================

  const [deleteCustomer] = useDeleteCustomerMutation();

  const handleApplyFilters = (filters: CustomerFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const handleCancelFilters = () => {
    setAppliedFilters({});
    setCurrentPage(1);
  };

  // Using dummy data directly
  const customers: MagentoCustomer[] = Array.isArray(data?.data?.items)
    ? data.data.items
    : [];

  const totalPages = Math.ceil((data?.data?.total_count || 0) / itemsPerPage);

  const paginatedCustomers = customers; // Since we are using dummy data with fixed 10 items

  const tdBase =
    "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  if (isLoading) return <div className="p-6">Loading customers...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading customers</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Magento Customers</h2>
        <div className="flex items-center gap-3">
          <StoreViewDropdown onChange={(sel) => setStoreSelection(sel)} />

          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer px-6 py-2 rounded-full border border-teal-400 text-teal-500 text-sm font-medium hover:bg-teal-50 transition-colors"
          >
            <FaFilter className="text-sm" />
            {showFilter ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            onClick={() => navigate("/AddMagentoCustomer")}
            className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium"
          >
            <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
              <FaPlus className="text-teal-500 text-sm" />
            </span>
            Add Customer
          </button>
        </div>
      </div>

      {showFilter && <CustomerFilter onApply={handleApplyFilters} />}

      {/* TABLE */}
      <div className="rounded-t-3xl overflow-x-auto mt-6">
        <table className="w-max min-w-full text-sm border-separate border-spacing-y-3">
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">First Name</th>
              <th className="p-4 text-left">Last Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>

          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  Loading customers...
                </td>
              </tr>
            ) : paginatedCustomers.length ? (
              paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="bg-white shadow-sm hover:shadow-md">
                  <td className={`${tdBase} font-medium text-black`}>#{customer.id}</td>
                  <td className={tdBase}>{customer.firstname}</td>
                  <td className={tdBase}>{customer.lastname}</td>
                  <td className={tdBase}>{customer.email}</td>
                  <td className={tdBase}>
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        customer.is_active
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {customer.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="relative p-4 text-right flex gap-2 justify-end">
                    <button
                      onClick={() =>
                        navigate(`/customers/${customer.id}`, { state: { customer } })
                      }
                      className="text-gray-400 hover:text-gray-600"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/AddMagentoCustomer/${customer.id}`)
                      }
                      className="text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteCustomer(customer.id!)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => !isFetching && setCurrentPage(page)}
        delta={2}
        showFirstLast={true}
        className="my-4"
      />
    </div>
  );
}

export default MagentoCustomerList;

