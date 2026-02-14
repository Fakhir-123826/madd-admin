import React, { useState } from "react";
import { Eye, Plus, ArrowLeft } from "lucide-react";
import { FaLongArrowAltRight, FaLongArrowAltLeft, FaPlus } from "react-icons/fa";

import FilterBar from "../../component/orderManagement/FilterBar";
import OrderDetails from "../../component/orderManagement/Order";
import AddOrder from "../../component/orderManagement/AddOrder";

function OrderList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const itemsPerPage = 5;

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

  // If Add Order is shown, display the form inline
  if (showAddOrder) {
    return (
      <>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleBackToList}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">Add New Order</h1>
        </div>

        <AddOrder
          onClose={handleBackToList}
          onSave={handleAddOrder}
          isEmbedded={true}
        />
      </>
    );
  }

  // If an order is selected, show order details
  if (selectedOrder) {
    return <OrderDetails orderId={selectedOrder.id} onBack={handleBackToList} />;
  }

  // Default view - Order List
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Orders Management</h1>
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
        {/* Header - Using CSS Grid with specific column widths */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-1 text-center">Order ID</div>
            <div className="col-span-2 text-center">Customer Name</div>
            <div className="col-span-2 text-center">Store Name</div>
            <div className="col-span-2 text-center">Date & Time</div>
            <div className="col-span-1 text-center">Payment</div>
            <div className="col-span-1 text-center">Delivery</div>
            <div className="col-span-1 text-center">Amount</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1 text-center">Action</div>
          </div>
        </div>

        {/* Orders List - Using CSS Grid with exact same columns */}
        <div className="p-6">
          <div className="space-y-4">
            {currentOrders.map((order, index) => (
              <div
                key={index}
                className="relative bg-gray-50 shadow-xl rounded-2xl p-4 hover:shadow-2xl transition-shadow"
              >
                {/* Decorative Borders */}
                <div className="absolute rounded-3xl right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-teal-400 to-green-400 rounded-l-lg"></div>
                <div className="absolute rounded-3xl bottom-0 left-0 right-0 h-[4px] bg-gradient-to-r from-teal-400 to-green-400 rounded-b-lg"></div>

                {/* Order Data Grid - Same columns as header with text-center */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-1 font-medium text-center">{order.id}</div>
                  <div className="col-span-2 text-center">{order.name}</div>
                  <div className="col-span-2 text-center">{order.store}</div>
                  <div className="col-span-2 text-center">{order.datetime}</div>
                  <div className="col-span-1 text-center">{order.payment}</div>
                  <div className="col-span-1 text-center">{order.delivery}</div>
                  <div className="col-span-1 text-center font-semibold text-teal-600">{order.amount}</div>
                  <div className="col-span-1 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${statusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors mx-auto"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex justify-center gap-10 items-center border-t border-gray-200">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg flex gap-2 items-center ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <FaLongArrowAltLeft /> Back
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                    : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg flex gap-2 items-center ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            Next <FaLongArrowAltRight />
          </button>
        </div>
      </div>
    </>
  );
}

export default OrderList;