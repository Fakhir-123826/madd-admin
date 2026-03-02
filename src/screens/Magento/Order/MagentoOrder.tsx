import React from "react";
import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "../../../app/api/MagentoSlices/OrderSlice";

const badgeStyle = (type: string) => {
  switch (type.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-600";
    case "processing":
      return "bg-yellow-100 text-yellow-600";
    case "paid":
      return "bg-green-100 text-green-600";
    case "refunded":
      return "bg-blue-100 text-blue-600";
    case "delivered":
      return "bg-green-100 text-green-600";
    case "shipped":
      return "bg-blue-100 text-blue-600";
    case "cancelled":
      return "bg-red-100 text-red-600";
    default:
      return "";
  }
};

const MogentoOrder = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useGetOrderByIdQuery(Number(id));

  if (isLoading)
    return <p className="p-6 text-center text-gray-500">Loading order...</p>;
  if (error)
    return <p className="p-6 text-center text-red-500">Error loading order.</p>;
  if (!order) return <p className="p-6 text-center">No order found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Order #{order.increment_id}
        </h1>
        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium shadow hover:opacity-90 transition">
          ✏️ Edit Order
        </button>
      </div>

      {/* ================= ORDER DETAILS CARD ================= */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Order Info Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-semibold">
          Order Info
        </div>

        {/* Order Info Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 text-sm text-gray-700">
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium capitalize">{order.status}</p>
          </div>
          <div>
            <p className="text-gray-500">State</p>
            <p className="font-medium capitalize">{order.state}</p>
          </div>
          <div>
            <p className="text-gray-500">Created At</p>
            <p className="font-medium">{order.created_at}</p>
          </div>
          <div>
            <p className="text-gray-500">Currency</p>
            <p className="font-medium">{order.order_currency_code}</p>
          </div>
        </div>
      </div>

      {/* ================= CUSTOMER INFO ================= */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-semibold">
          Customer Info
        </div>
        <div className="grid grid-cols-2 gap-6 p-6 text-sm text-gray-700">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{order.customer_firstname} {order.customer_lastname}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{order.customer_email}</p>
          </div>
          <div>
            <p className="text-gray-500">DOB</p>
            <p className="font-medium">{order.customer_dob}</p>
          </div>
        </div>
      </div>

      {/* ================= BILLING ADDRESS ================= */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-semibold">
          Billing Address
        </div>
        <div className="p-6 text-sm text-gray-700 space-y-1">
          <p className="font-medium">{order.billing_address.firstname} {order.billing_address.lastname}</p>
          <p>{order.billing_address.street.join(", ")}</p>
          <p>{order.billing_address.city}, {order.billing_address.region}</p>
          <p>{order.billing_address.country_id}</p>
          <p>Phone: {order.billing_address.telephone}</p>
        </div>
      </div>

      {/* ================= SHIPPING ADDRESS ================= */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-semibold">
          Shipping Address
        </div>
        <div className="p-6 text-sm text-gray-700 space-y-4">
          {order.extension_attributes?.shipping_assignments?.map((assignment, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
              <div>
                <p className="font-medium">{assignment.shipping.address.firstname} {assignment.shipping.address.lastname}</p>
                <p>{assignment.shipping.address.street.join(", ")}</p>
                <p>{assignment.shipping.address.city}, {assignment.shipping.address.region}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeStyle(assignment.shipping.method)}`}>
                {assignment.shipping.method}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ITEMS ================= */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-semibold">
          Ordered Items
        </div>
        <div className="p-6 space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-lg border hover:shadow-sm transition">
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                <p className="text-sm text-gray-600">Qty: {item.qty_ordered}</p>
              </div>
              <div className="text-right mt-2 md:mt-0 space-y-1 text-sm text-gray-700">
                <p>Price: ${item.price}</p>
                <p>Tax: ${item.tax_amount}</p>
                <p>Total: ${item.row_total_incl_tax}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PAYMENT ================= */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-semibold">
          Payment
        </div>
        <div className="p-6 text-sm text-gray-700 space-y-1">
          <p>Method: <span className="font-medium">{order.payment.method}</span></p>
          <p>Amount Paid: <span className="font-medium">${order.payment.amount_paid}</span></p>
        </div>
      </div>

      {/* ================= TOTALS ================= */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-semibold">
          Totals
        </div>
        <div className="p-6 grid grid-cols-2 gap-6 text-sm text-gray-700">
          <p>Subtotal: <span className="font-medium">${order.subtotal}</span></p>
          <p>Tax: <span className="font-medium">${order.tax_amount}</span></p>
          <p>Shipping: <span className="font-medium">${order.shipping_amount}</span></p>
          <p className="font-bold text-green-600">Grand Total: ${order.grand_total}</p>
        </div>
      </div>
    </div>
  );
};

export default MogentoOrder;