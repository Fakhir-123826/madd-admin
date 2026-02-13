import React, { useState } from "react";
import { Eye, Plus } from "lucide-react";
import { FaLongArrowAltRight, FaLongArrowAltLeft  } from "react-icons/fa";

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
  };

  const handleAddOrder = (newOrder: any) => {
    setOrders([...orders, newOrder]);
  };

  // If an order is selected, show order details
  if (selectedOrder) {
    return <OrderDetails orderId={selectedOrder.id} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Orders Management</h1>
        <button
          onClick={() => setShowAddOrder(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-green-400 text-white rounded-lg hover:from-teal-500 hover:to-green-500"
        >
          <Plus size={18} />
          Add Order
        </button>
      </div>
      
      {/* Filter Bar */}
      <FilterBar />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium">
          <ul className="flex justify-around items-end">
            <li className="pb-2">Order ID</li>
            <li className="pb-2">Customer Name</li>
            <li className="pb-2">Store Name</li>
            <li className="pb-2">Date & Time</li>
            <li className="pb-2">Payment Method</li>
            <li className="pb-2">Delivery Method</li>
            <li className="pb-2">Amount</li>
            <li className="pb-2">Status</li>
            <li className="pb-2"></li>
          </ul>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-3">
            <tbody>
              {currentOrders.map((order, index) => (
                <tr key={index}>
                  <td colSpan={9} className="p-0 rounded-3xl">
                    <div className="relative bg-gray-50 shadow-xl rounded-2xl">
                      <div className="absolute rounded-3xl right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-teal-400 to-green-400 rounded-l-lg"></div>
                      <div className="absolute rounded-3xl bottom-0 left-0 right-0 h-[4px] bg-gradient-to-r from-teal-400 to-green-400 rounded-b-lg"></div>
                      
                      <div className="p-3 pl-4 pb-4">
                        <table className="w-full">
                          <tbody>
                            <tr>
                              <td className="py-2 px-2">{order.id}</td>
                              <td className="py-2 px-2">{order.name}</td>
                              <td className="py-2 px-2">{order.store}</td>
                              <td className="py-2 px-2">{order.datetime}</td>
                              <td className="py-2 px-2">{order.payment}</td>
                              <td className="py-2 px-2">{order.delivery}</td>
                              <td className="py-2 px-2">{order.amount}</td>
                              <td className="py-2 px-2">
                                <span
                                  className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle(
                                    order.status
                                  )}`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-2 px-2">
                                <button 
                                  className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                                  onClick={() => handleViewOrder(order)}
                                >
                                  <Eye size={16} />
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>



        {/* Pagination */}
        {/* Next / Back Buttons */}

        <div className="px-6 py-4 flex justify-center gap-10 items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg flex gap-2 items-center ${
              currentPage === 1
                ? " text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-50"
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
                    : "border hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg  flex gap-2 items-center ${
              currentPage === totalPages
                ? " text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-50"
            }`}
          >
            Next <FaLongArrowAltRight  />
          </button>
        </div>
      </div>

      {/* Add Order Modal */}
      {showAddOrder && (
        <AddOrder 
          onClose={() => setShowAddOrder(false)}
          onSave={handleAddOrder}
        />
      )}
    </>
  );
}

export default OrderList;