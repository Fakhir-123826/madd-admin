import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import FilterBar from "../../../component/orderManagement/FilterBar";
import { useGetOrdersFromApiQuery } from "../../../app/api/MagentoSlices/magentoApi";

function MagentoOrderList() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetOrdersFromApiQuery();

  // const orders = data?.data?.items || []; // ✅ Magento items
  const orders = data?.items || [];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  // ✅ Pagination
  // const totalPages = Math.ceil(orders.length / itemsPerPage);
  const totalPages = Math.ceil((data?.total_count || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  const handleViewOrder = (order: any) => {
    navigate(`/order/${order.entity_id}`, { state: { order } });
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

      <FilterBar />

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
              <th className="p-4"></th>
            </tr>
          </thead>

          <tbody>
            {currentOrders.map((order: any) => (
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

                <td className="relative p-4 text-right">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Eye size={18} />
                  </button>
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
            className={`px-3 py-1 rounded ${currentPage === i + 1
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