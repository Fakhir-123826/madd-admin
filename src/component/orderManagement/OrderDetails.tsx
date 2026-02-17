import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BsDownload } from "react-icons/bs";
import { FaCircleCheck } from "react-icons/fa6";

function OrderDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "Delivered");

  // If no order data, redirect to order list
  if (!order) {
    navigate('/orderlist');
    return null;
  }

  const statusOptions = ["Delivered", "Shipped", "Processing", "Cancelled", "Pending"];

  const handleChangeStatus = () => {
    setShowStatusPopup(true);
  };

  const handleSaveChanges = () => {
    setShowStatusPopup(false);
    setShowSuccessPopup(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessPopup(false);
  };

  const handleBack = () => {
    navigate('/orderlist');
  };

  return (
    <div className="p-6 bg-white rounded-xl min-h-screen relative">
      {/* Status Change Popup */}
      {showStatusPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6">
            <h2 className="text-2xl font-semibold text-center mb-6">Change Status</h2>
            
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:border-teal-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              onClick={handleSaveChanges}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-teal-600 transition-all font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-8 text-center">
            <div className="flex justify-center mb-4">
              <FaCircleCheck className="text-6xl text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">Changes Saved!</h2>
            <p className="text-gray-600 mb-6">Your changes has been saved</p>
            
            <button
              onClick={handleCloseSuccess}
              className="bg-blue-500 text-white px-8 py-2 rounded-lg hover:bg-teal-600 transition-all font-medium"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold">Order Details</h1>
      </div>

      <div className="space-y-6">
        {/* Card 1 - Order Summary */}
        <div className="rounded-xl border-2 border-gray-300">
          <div className="px-6 py-4 rounded-t-xl bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium">
            Order Summary
          </div>

          <div className="p-6 grid grid-cols-4 gap-4">
            <div>
              <h2 className="text-sm text-gray-500 font-medium">Order ID</h2>
              <p className="text-lg font-semibold">{order.id}</p>
            </div>

            <div>
              <h2 className="text-sm text-gray-500 font-medium">Delivering Address</h2>
              <p className="text-lg">9 Street K3 main road</p>
            </div>

            <div>
              <h2 className="text-sm text-gray-500 font-medium">Date & Time</h2>
              <p className="text-lg">{order.datetime}</p>
            </div>

            <div>
              <h2 className="text-sm text-gray-500 font-medium">Status</h2>
              <div className="flex items-center gap-3">
                <p className={`text-lg font-medium ${
                  order.status === 'Delivered' ? 'text-green-600' : 
                  order.status === 'Cancelled' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {order.status}
                </p>
                <button 
                  onClick={handleChangeStatus}
                  className="text-sm text-teal-500 hover:underline"
                >
                  Change Status
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the component remains same... */}
        {/* Card 2 - Customer Information */}
        <div className="rounded-xl border-2 border-gray-300">
          <div className="px-6 py-4 rounded-t-xl bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium">
            Customer Information
          </div>

          <div className="p-6">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <h2 className="text-sm text-gray-500 font-medium">Customer Name</h2>
                <p className="text-lg">{order.name}</p>
              </div>

              <div>
                <h2 className="text-sm text-gray-500 font-medium">Email</h2>
                <p className="text-lg">info@icons.com</p>
              </div>

              <div>
                <h2 className="text-sm text-gray-500 font-medium">Phone Number</h2>
                <p className="text-lg">+81 26356 99</p>
              </div>

              <div>
                <h2 className="text-sm text-gray-500 font-medium">Gifting Address</h2>
                <p className="text-lg">Address here</p>
              </div>
            </div>

            {/* PDF Button */}
            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-2 py-1 rounded-full bg-blue-600 hover:bg-blue-700 transition-all">
                <span className="p-2 bg-white rounded-full">
                  <BsDownload className="text-blue-600" />
                </span>
                <span className="pr-3 text-white text-sm font-medium">Submit as PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 3 - Order Items List */}
        <div className="rounded-xl border-2 border-gray-300">
          <div className="px-6 py-4 rounded-t-xl bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium">
            Order Items List
          </div>

          <div className="p-6">
            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                {/* Header */}
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Product Name</th>
                    <th className="text-center px-6 py-3 font-medium">Quantity</th>
                    <th className="text-center px-6 py-3 font-medium">Unit Price</th>
                    <th className="text-right px-6 py-3 font-medium">Total Price</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {[
                    { name: "Product A", qty: 4, price: 400 },
                    { name: "Product B", qty: 4, price: 400 },
                    { name: "Product C", qty: 4, price: 400 },
                  ].map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 last:border-0">
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="text-center px-6 py-4">{item.qty}</td>
                      <td className="text-center px-6 py-4">${item.price}</td>
                      <td className="text-right px-6 py-4">${item.qty * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="mt-6 flex justify-center">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">$395</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes:</span>
                  <span className="font-medium">$395</span>
                </div>
                <div className="flex justify-between text-sm border-b border-gray-300 pb-2">
                  <span className="text-gray-600">Shipping fee:</span>
                  <span className="font-medium">$395</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-1">
                  <span>Total:</span>
                  <span className="text-teal-600">$3996</span>
                </div>
              </div>
            </div>

            {/* PDF Button */}
            <div className="flex justify-end mt-4">
              <button className="flex items-center gap-2 px-2 py-1 rounded-full bg-blue-600 hover:bg-blue-700 transition-all">
                <span className="p-2 bg-white rounded-full">
                  <BsDownload className="text-blue-600" />
                </span>
                <span className="pr-3 text-white text-sm font-medium">Submit as PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 4 - Payment Method */}
        <div className="rounded-xl border-2 border-gray-300">
          <div className="px-6 py-4 rounded-t-xl bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium">
            Payment Method
          </div>

          <div className="p-6">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <h2 className="text-sm text-gray-500 font-medium">Payment Method</h2>
                <p className="text-lg">{order.payment}</p>
              </div>

              <div>
                <h2 className="text-sm text-gray-500 font-medium">Payment Status</h2>
                <p className="text-lg">Paid</p>
              </div>

              <div>
                <h2 className="text-sm text-gray-500 font-medium">Date & Time</h2>
                <p className="text-lg">{order.datetime}</p>
              </div>

              <div>
                <h2 className="text-sm text-gray-500 font-medium">Status</h2>
                <div className="flex items-center gap-3">
                  <p className={`text-lg font-medium ${
                    order.status === 'Delivered' ? 'text-green-600' : 
                    order.status === 'Cancelled' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {order.status}
                  </p>
                  <button 
                    onClick={handleChangeStatus}
                    className="text-sm text-teal-500 hover:underline"
                  >
                    Change Status
                  </button>
                </div>
              </div>
            </div>

            {/* PDF Button */}
            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-2 py-1 rounded-full bg-blue-600 hover:bg-blue-700 transition-all">
                <span className="p-2 bg-white rounded-full">
                  <BsDownload className="text-blue-600" />
                </span>
                <span className="pr-3 text-white text-sm font-medium">Submit as PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;