import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Edit } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import FilterBar from "../../../component/orderManagement/FilterBar";
import Pagination from "../../../component/Pagination";
import {
  useGetCustomersQuery,
  type MagentoCustomer,
  useDeleteCustomerMutation,
} from "../../../app/api/CustomerSlice/CustomerSlice";

function MagentoCustomerList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isFetching, error } = useGetCustomersQuery();

  const [deleteCustomer] = useDeleteCustomerMutation();

  // Pagination
  const customers: MagentoCustomer[] = Array.isArray(data?.items)
    ? data.items
    : [];

  const totalPages = Math.ceil((data?.total_count || 0) / itemsPerPage);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return customers.slice(start, start + itemsPerPage);
  }, [customers, currentPage, itemsPerPage]);

  const tdBase =
    "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  if (isLoading) return <div className="p-6">Loading customers...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading customers</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Magento Customers</h2>

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

      <FilterBar />

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
                      className={`px-3 py-1 rounded-md text-xs font-medium ${customer.is_active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
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