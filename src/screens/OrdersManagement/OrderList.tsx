import React, { useState } from "react";
import { Eye, ArrowLeft } from "lucide-react";
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import FilterBar from "../../component/orderManagement/FilterBar";
import OrderDetails from "../../component/orderManagement/Order";
import AddOrder from "../../component/orderManagement/AddOrder";

function OrderList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const itemsPerPage = 8; // Changed to 8 like VendorList

  const [orders, setOrders] = useState([
    {
      id: "#44447",
      name: "Jhon Smith",
      store: "Blossoms Store",
      datetime: "2:46 pm - 5 July",
      payment: "Paypal",
      delivery: "Pick up",
      amount: "100$",
      status: "Delivered",
    },
    {
      id: "#44448",
      name: "Jhon Smith",
      store: "Blossoms Store",
      datetime: "2:46 pm - 5 July",
      payment: "Paypal",
      delivery: "Pick up",
      amount: "100$",
      status: "Shipped",
    },
    {
      id: "#44449",
      name: "Jhon Smith",
      store: "Blossoms Store",
      datetime: "2:46 pm - 5 July",
      payment: "Paypal",
      delivery: "Pick up",
      amount: "100$",
      status: "Cancelled",
    },
    {
      id: "#44450",
      name: "Sarah Johnson",
      store: "Fashion Hub",
      datetime: "3:30 pm - 5 July",
      payment: "Credit Card",
      delivery: "Delivery",
      amount: "250$",
      status: "Pending",
    },
    {
      id: "#44451",
      name: "Mike Wilson",
      store: "Tech Store",
      datetime: "4:15 pm - 5 July",
      payment: "Paypal",
      delivery: "Pick up",
      amount: "899$",
      status: "Processing",
    },
    {
      id: "#44452",
      name: "Emma Davis",
      store: "Home Decor",
      datetime: "5:00 pm - 5 July",
      payment: "Credit Card",
      delivery: "Delivery",
      amount: "450$",
      status: "Delivered",
    },
    {
      id: "#44453",
      name: "Alex Brown",
      store: "Sports World",
      datetime: "6:30 pm - 5 July",
      payment: "Paypal",
      delivery: "Pick up",
      amount: "320$",
      status: "Shipped",
    },
    {
      id: "#44454",
      name: "Lisa White",
      store: "Beauty Store",
      datetime: "7:45 pm - 5 July",
      payment: "Credit Card",
      delivery: "Delivery",
      amount: "180$",
      status: "Pending",
    },
    {
      id: "#44455",
      name: "Tom Harris",
      store: "Electronics",
      datetime: "8:20 pm - 5 July",
      payment: "Paypal",
      delivery: "Pick up",
      amount: "560$",
      status: "Delivered",
    },
  ]);

  const statusStyle = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-600";
      case "Shipped":
        return "bg-blue-100 text-blue-600";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Processing":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowAddOrder(false);
  };

  const handleAddOrder = (newOrder: any) => {
    setOrders([...orders, newOrder]);
    setShowAddOrder(false);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
    setShowAddOrder(false);
  };

  // Base style for table cells with gradient underlines (matching VendorList)
  const tdBase = "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  // If Add Order is shown, display the form inline
  if (showAddOrder) {
    return (
      <div className="bg-white shadow-sm p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleBackToList}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Add New Order</h1>
        </div>

        <AddOrder
          onClose={handleBackToList}
          onSave={handleAddOrder}
          isEmbedded={true}
        />
      </div>
    );
  }

  // If an order is selected, show order details
  if (selectedOrder) {
    return <OrderDetails orderId={selectedOrder.id} onBack={handleBackToList} />;
  }

  // Default view - Order List (VendorList style)
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER with Add Button (matching VendorList) */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Orders Management</h2>
        <button
          onClick={() => setShowAddOrder(true)}
          className="
            flex items-center gap-3
            px-6 py-1
            rounded-full
            bg-gradient-to-r from-teal-400 to-green-500
            text-white text-sm font-medium
            shadow-md
            hover:from-teal-500 hover:to-green-600
            transition-all
            hover:cursor-pointer
          "
        >
          <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
            <FaPlus className="text-teal-500 text-sm" />
          </span>
          Add Order
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* TABLE - Matching VendorList exactly */}
      <div className="rounded-t-3xl overflow-hidden mt-6">
        <table className="w-full text-sm border-separate border-spacing-y-3">
          {/* HEADER - Gradient background */}
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer Name</th>
              <th className="p-4 text-left">Store Name</th>
              <th className="p-4 text-left">Date & Time</th>
              <th className="p-4 text-left">Payment</th>
              <th className="p-4 text-left">Delivery</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>

          {/* BODY - With gradient underlines and borders */}
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={index} className="bg-white shadow-sm hover:shadow-md transition">
                <td className={`${tdBase} font-medium rounded-l-xl text-black`}>
                  {order.id}
                </td>

                <td className={tdBase}>
                  {order.name}
                </td>

                <td className={tdBase}>
                  {order.store}
                </td>

                <td className={tdBase}>
                  {order.datetime}
                </td>

                <td className={tdBase}>
                  {order.payment}
                </td>

                <td className={tdBase}>
                  {order.delivery}
                </td>

                <td className={`${tdBase} font-semibold`}>
                  {order.amount}
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

                {/* ACTION - With gradient borders like VendorList */}
                <td className="relative p-4 rounded-r-xl text-right">
                  {/* Right gradient border */}
                  <span className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl" />

                  {/* Bottom gradient border */}
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-400 to-green-400" />

                  <button
                    onClick={() => handleViewOrder(order)}
                    className="relative text-gray-400 cursor-pointer hover:text-gray-600"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION - Exactly like VendorList */}
      <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-600">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
        >
          ← Back
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === i + 1
                ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default OrderList;