import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, ShoppingBag, Clock, Loader2, Truck, CheckCircle, 
  XCircle, Package, DollarSign, Store 
} from "lucide-react";
import { BsDownload } from "react-icons/bs";
import { FaCircleCheck } from "react-icons/fa6";
import { useUpdateOrderStatusMutation } from "../../app/api/OrderSlices/OrderApi";
import { toast } from "react-hot-toast";

const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num || 0);
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-3 h-3" /> },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: <Loader2 className="w-3 h-3" /> },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: <Truck className="w-3 h-3" /> },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" /> },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-600', icon: <Package className="w-3 h-3" /> },
};

const paymentStatusConfig: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-gray-100 text-gray-600',
  failed: 'bg-red-100 text-red-800',
};

function OrderDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationOrder = location.state?.order;

  const [order, setOrder] = useState(locationOrder);
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "pending");
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  // If no order data, redirect to order list
  if (!order) {
    navigate('/orderlist');
    return null;
  }

  const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];

  const handleChangeStatus = () => {
    setShowStatusPopup(true);
  };

  const handleSaveChanges = async () => {
    try {
      // Backend api (updateStatus) is currently missing in AdminOrderController
      // As requested, keeping this frontend-only for now without backend changes.
      
      await updateOrderStatus({
        id: order.id,
        data: {
          status: selectedStatus as any,
          vendor_uuid: order.vendor?.uuid,
        }
      }).unwrap();
      

      setShowStatusPopup(false);
      // setShowSuccessPopup(true);
      // setOrder({ ...order, status: selectedStatus });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update order status");
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessPopup(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Status Change Popup */}
      {showStatusPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6">
            <h2 className="text-2xl font-semibold text-center mb-6">Change Status</h2>
            
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:border-blue-500 capitalize"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              onClick={handleSaveChanges}
              disabled={isUpdating}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
            <button
              onClick={() => setShowStatusPopup(false)}
              className="w-full mt-2 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              Cancel
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
            <p className="text-gray-600 mb-6">Your status change has been updated locally.</p>
            
            <button
              onClick={handleCloseSuccess}
              className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
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
          className="p-2 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.magento_order_increment_id || order.id}</h1>
          <p className="text-sm text-gray-500">View and manage order details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
              <Package className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
            </div>
            <div className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium">Product</th>
                      <th className="text-center px-6 py-3 font-medium">Quantity</th>
                      <th className="text-right px-6 py-3 font-medium">Unit Price</th>
                      <th className="text-right px-6 py-3 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item: any, index: number) => (
                        <tr key={item.id || index} className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-800">{item.product_name || item.name}</p>
                            {item.sku && <p className="text-xs text-gray-500">SKU: {item.sku}</p>}
                          </td>
                          <td className="text-center px-6 py-4 font-medium text-gray-700">
                            {item.qty_ordered || item.qty || 1}
                          </td>
                          <td className="text-right px-6 py-4 text-gray-600">
                            {formatPrice(item.price)}
                          </td>
                          <td className="text-right px-6 py-4 font-medium text-gray-900">
                            {formatPrice(item.row_total || (item.price * (item.qty_ordered || item.qty || 1)))}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          No items found for this order.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Totals Section */}
              <div className="bg-gray-50/50 px-6 py-5 border-t border-gray-100">
                <div className="flex flex-col items-end gap-2">
                  <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-800">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span className="font-medium text-gray-800">{formatPrice(order.shipping_amount)}</span>
                    </div>
                    {parseFloat(order.discount_amount) > 0 && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Discount</span>
                        <span className="font-medium text-red-600">-{formatPrice(order.discount_amount)}</span>
                      </div>
                    )}
                    {parseFloat(order.tax_amount) > 0 && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Tax</span>
                        <span className="font-medium text-gray-800">{formatPrice(order.tax_amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-200 mt-2">
                      <span className="text-gray-800">Grand Total</span>
                      <span className="text-blue-600">{formatPrice(order.grand_total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Payment Information</h2>
            </div>
            <div className="p-6">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Payment Method</p>
                  <p className="text-gray-900 font-medium capitalize">{order.payment_method?.replace(/_/g, ' ') || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Payment Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${paymentStatusConfig[order.payment_status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.payment_status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Currency</p>
                  <p className="text-gray-900 font-medium">{order.currency_code || 'USD'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Action</p>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition">
                    <BsDownload className="w-4 h-4" /> Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Order Status</h3>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium capitalize ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                {statusConfig[order.status]?.icon}
                {statusConfig[order.status]?.label || order.status}
              </span>
              <button 
                onClick={handleChangeStatus}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition underline-offset-4 hover:underline"
              >
                Change
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
               <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order Date</span>
                  <span className="font-medium text-gray-800">{new Date(order.created_at).toLocaleString()}</span>
               </div>
               {order.shipped_at && (
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipped</span>
                    <span className="font-medium text-gray-800">{new Date(order.shipped_at).toLocaleString()}</span>
                 </div>
               )}
               {order.delivered_at && (
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivered</span>
                    <span className="font-medium text-gray-800">{new Date(order.delivered_at).toLocaleString()}</span>
                 </div>
               )}
            </div>
          </div>

          {/* Customer Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-gray-400" />
              Customer
            </h3>
            <div className="space-y-1 mb-4">
              <p className="font-semibold text-gray-900">{order.customer_firstname} {order.customer_lastname}</p>
              <p className="text-sm text-gray-600">{order.customer_email}</p>
              {order.billing_address?.telephone && <p className="text-sm text-gray-600">{order.billing_address.telephone}</p>}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-400" />
                Shipping Address
              </h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium text-gray-900">{order.shipping_address.firstname} {order.shipping_address.lastname}</p>
                <p>{order.shipping_address.street}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.region} {order.shipping_address.postcode}</p>
                <p>{order.shipping_address.country_id}</p>
              </div>
              {order.shipping_method && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Shipping Method</p>
                  <p className="text-sm font-medium text-gray-800">{order.shipping_method}</p>
                </div>
              )}
            </div>
          )}

          {/* Billing Address */}
          {order.billing_address && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                Billing Address
              </h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium text-gray-900">{order.billing_address.firstname} {order.billing_address.lastname}</p>
                <p>{order.billing_address.street}</p>
                <p>{order.billing_address.city}, {order.billing_address.region} {order.billing_address.postcode}</p>
                <p>{order.billing_address.country_id}</p>
              </div>
            </div>
          )}

          {/* Vendor Details */}
          {order.vendor && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Store className="w-4 h-4 text-gray-400" />
                Vendor Details
              </h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium text-gray-900">{order.vendor.company_name}</p>
                <p>Status: <span className="capitalize">{order.vendor.status}</span></p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default OrderDetails;