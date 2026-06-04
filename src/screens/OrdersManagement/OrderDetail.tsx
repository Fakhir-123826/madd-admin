import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  Loader2,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  DollarSign,
  Store,
  Send,
  Mail,
  Activity,
  Ban,
  PauseCircle,
  PlayCircle,
  MessageSquare,
  Edit3,
  MapPin,
  CreditCard,
  Calendar,
  User,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  useGetOrderQuery,
  useCancelOrderMutation,
  useHoldOrderMutation,
  useUnholdOrderMutation,
  useAddOrderCommentMutation,
  useSendOrderEmailMutation,
  useGetOrderStatusQuery,
  useSyncSingleOrderMutation,
  useGetOrderCommentsQuery,
  type Order,
} from '../../app/api/OrderSlices/OrderApi';
import { ROUTES } from '../../router';

// Status badge configurations
const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-3 h-3" /> },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: <Loader2 className="w-3 h-3" /> },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: <Truck className="w-3 h-3" /> },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" /> },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-600', icon: <Package className="w-3 h-3" /> },
  on_hold: { label: 'On Hold', color: 'bg-orange-100 text-orange-800', icon: <PauseCircle className="w-3 h-3" /> },
};

const paymentStatusConfig: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-gray-100 text-gray-600',
  failed: 'bg-red-100 text-red-800',
};

const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};

// Action Modal Component
const ActionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string, notifyCustomer: boolean) => void;
  title: string;
  actionType: 'cancel' | 'hold' | 'unhold';
  isLoading: boolean;
}> = ({ isOpen, onClose, onConfirm, title, actionType, isLoading }) => {
  const [comment, setComment] = useState('');
  const [notifyCustomer, setNotifyCustomer] = useState(false);

  if (!isOpen) return null;

  const getButtonColor = () => {
    if (actionType === 'cancel') return 'bg-red-600 hover:bg-red-700';
    if (actionType === 'hold') return 'bg-orange-600 hover:bg-orange-700';
    return 'bg-green-600 hover:bg-green-700';
  };

  const getButtonText = () => {
    if (isLoading) return 'Processing...';
    if (actionType === 'cancel') return 'Cancel Order';
    if (actionType === 'hold') return 'Hold Order';
    return 'Release Hold';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a comment about this action..."
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyCustomer}
              onChange={(e) => setNotifyCustomer(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">Notify customer via email</span>
          </label>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(comment, notifyCustomer)}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${getButtonColor()} disabled:opacity-50`}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Comment Modal
const AddCommentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string, notifyCustomer: boolean, visibleOnFront: boolean) => void;
  isLoading: boolean;
}> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [comment, setComment] = useState('');
  const [notifyCustomer, setNotifyCustomer] = useState(false);
  const [visibleOnFront, setVisibleOnFront] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Add Comment</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your comment here..."
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyCustomer}
              onChange={(e) => setNotifyCustomer(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">Notify customer via email</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibleOnFront}
              onChange={(e) => setVisibleOnFront(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">Visible on frontend</span>
          </label>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(comment, notifyCustomer, visibleOnFront)}
            disabled={isLoading || !comment.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add Comment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const OrderDetail: React.FC = () => {
  const { orderUuid } = useParams<{ orderUuid: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'details' | 'actions' | 'comments'>('details');
  const [actionModal, setActionModal] = useState<{ type: 'cancel' | 'hold' | 'unhold' | null }>({ type: null });
  const [showCommentModal, setShowCommentModal] = useState(false);
  
  // Get vendor_uuid from query params
  const queryParams = new URLSearchParams(location.search);
  const vendorUuid = queryParams.get('vendor_uuid');
  
  // Queries
  const { data: orderData, isLoading: orderLoading, refetch: refetchOrder } = useGetOrderQuery(
    { orderId: orderUuid || '', vendor_uuid: vendorUuid || '' },
    { skip: !orderUuid || !vendorUuid }
  );
  
  const { data: commentsData, refetch: refetchComments } = useGetOrderCommentsQuery(
    { orderId: orderUuid || '', vendor_uuid: vendorUuid || '' },
    { skip: !orderUuid || !vendorUuid }
  );
  
  const { data: statusData, refetch: refetchStatus } = useGetOrderStatusQuery(
    { orderId: orderUuid || '', vendor_uuid: vendorUuid || '' },
    { skip: !orderUuid || !vendorUuid }
  );
  
  // Mutations
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [holdOrder, { isLoading: isHolding }] = useHoldOrderMutation();
  const [unholdOrder, { isLoading: isUnholding }] = useUnholdOrderMutation();
  const [addComment, { isLoading: isAddingComment }] = useAddOrderCommentMutation();
  const [sendEmail, { isLoading: isSendingEmail }] = useSendOrderEmailMutation();
  const [syncOrder, { isLoading: isSyncing }] = useSyncSingleOrderMutation();
  
  const order = orderData?.data;
  
  // Redirect if no vendor_uuid
  useEffect(() => {
    if (!vendorUuid) {
      toast.error('Vendor information is missing');
      navigate(ROUTES.ORDER_LIST);
    }
  }, [vendorUuid, navigate]);
  
  const handleCancelOrder = async (comment: string, notifyCustomer: boolean) => {
    if (!order) return;
    try {
      const result = await cancelOrder({
        orderId: order.uuid,
        vendor_uuid: vendorUuid!,
        payload: { comment, notify_customer: notifyCustomer },
      }).unwrap();
      
      toast.success(result.message);
      setActionModal({ type: null });
      refetchOrder();
      refetchStatus();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to cancel order');
    }
  };
  
  const handleHoldOrder = async (comment: string, notifyCustomer: boolean) => {
    if (!order) return;
    try {
      const result = await holdOrder({
        orderId: order.uuid,
        vendor_uuid: vendorUuid!,
        payload: { comment, notify_customer: notifyCustomer },
      }).unwrap();
      
      toast.success(result.message);
      setActionModal({ type: null });
      refetchOrder();
      refetchStatus();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to hold order');
    }
  };
  
  const handleUnholdOrder = async (comment: string, notifyCustomer: boolean) => {
    if (!order) return;
    try {
      const result = await unholdOrder({
        orderId: order.uuid,
        vendor_uuid: vendorUuid!,
        payload: { comment, notify_customer: notifyCustomer },
      }).unwrap();
      
      toast.success(result.message);
      setActionModal({ type: null });
      refetchOrder();
      refetchStatus();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to release order hold');
    }
  };
  
  const handleAddComment = async (comment: string, notifyCustomer: boolean, visibleOnFront: boolean) => {
    if (!order) return;
    try {
      await addComment({
        orderId: order.uuid,
        vendor_uuid: vendorUuid!,
        payload: { comment, notify_customer: notifyCustomer, visible_on_front: visibleOnFront },
      }).unwrap();
      
      toast.success('Comment added successfully');
      setShowCommentModal(false);
      refetchComments();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add comment');
    }
  };
  
  const handleSendEmail = async () => {
    if (!order) return;
    try {
      const result = await sendEmail({
        orderId: order.uuid,
        vendor_uuid: vendorUuid!,
      }).unwrap();
      
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to send email');
    }
  };
  
  const handleSyncOrder = async () => {
    if (!order) return;
    try {
      const result = await syncOrder({
        orderId: order.uuid,
        vendor_uuid: vendorUuid!,
      }).unwrap();
      
      toast.success(result.message);
      refetchOrder();
      refetchStatus();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to sync order');
    }
  };
  
  const getActionButtons = () => {
    if (!order) return [];
    const buttons = [];
    
    if (order.status !== 'cancelled' && order.status !== 'delivered') {
      if (order.status === 'on_hold') {
        buttons.push({
          label: 'Release Hold',
          icon: <PlayCircle className="w-4 h-4" />,
          onClick: () => setActionModal({ type: 'unhold' }),
          color: 'bg-green-600 hover:bg-green-700',
        });
      } else {
        buttons.push({
          label: 'Hold Order',
          icon: <PauseCircle className="w-4 h-4" />,
          onClick: () => setActionModal({ type: 'hold' }),
          color: 'bg-orange-600 hover:bg-orange-700',
        });
        buttons.push({
          label: 'Cancel Order',
          icon: <Ban className="w-4 h-4" />,
          onClick: () => setActionModal({ type: 'cancel' }),
          color: 'bg-red-600 hover:bg-red-700',
        });
      }
    }
    
    return buttons;
  };
  
  if (orderLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-4">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(ROUTES.ORDER_LIST)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(ROUTES.ORDER_LIST)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order #{order.magento_order_increment_id}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Created on {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSyncOrder}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {isSyncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Sync from Magento
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex border-b px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'details'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Order Details
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'actions'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Actions
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'comments'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Comments ({commentsData?.data?.length || 0})
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Status Badges */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                    {statusConfig[order.status]?.icon}
                    {statusConfig[order.status]?.label || order.status}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${paymentStatusConfig[order.payment_status] || 'bg-gray-100 text-gray-600'}`}>
                    <DollarSign className="w-3 h-3" />
                    {order.payment_status?.toUpperCase() || 'PENDING'}
                  </span>
                  {order.coupon_code && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      Coupon: {order.coupon_code}
                    </span>
                  )}
                </div>
                
                {/* Real-time Status from Magento */}
                {statusData && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Magento Status:</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-blue-800">
                          {statusData.data.status}
                        </span>
                        {!statusData.data.is_synced && (
                          <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                            Out of sync
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Customer Information */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        Customer Information
                      </h3>
                      <div className="space-y-2">
                        <p className="font-medium text-gray-800">
                          {order.customer_firstname} {order.customer_lastname}
                        </p>
                        <p className="text-sm text-gray-500">{order.customer_email}</p>
                      </div>
                    </div>
                    
                    {/* Vendor Information */}
                    {order.vendor && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Store className="w-4 h-4 text-blue-600" />
                          Vendor Information
                        </h3>
                        <p className="font-medium text-gray-800">{order.vendor.company_name}</p>
                      </div>
                    )}
                    
                    {/* Shipping Address */}
                    {order.shipping_address && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Truck className="w-4 h-4 text-blue-600" />
                          Shipping Address
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{order.shipping_address.firstname} {order.shipping_address.lastname}</p>
                          <p>{order.shipping_address.street}</p>
                          <p>{order.shipping_address.city}, {order.shipping_address.region} {order.shipping_address.postcode}</p>
                          <p>{order.shipping_address.country_id}</p>
                          {order.shipping_address.telephone && <p>Tel: {order.shipping_address.telephone}</p>}
                        </div>
                        {order.shipping_method && (
                          <p className="mt-2 text-xs text-gray-400">Method: {order.shipping_method}</p>
                        )}
                      </div>
                    )}
                    
                    {/* Billing Address */}
                    {order.billing_address && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          Billing Address
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{order.billing_address.firstname} {order.billing_address.lastname}</p>
                          <p>{order.billing_address.street}</p>
                          <p>{order.billing_address.city}, {order.billing_address.region} {order.billing_address.postcode}</p>
                          <p>{order.billing_address.country_id}</p>
                        </div>
                        <p className="mt-2 text-xs text-gray-400">Method: {order.payment_method}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Order Items */}
                    {order.items && order.items.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-600" />
                          Order Items ({order.items.length})
                        </h3>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="border-b border-gray-200 last:border-0 pb-3 last:pb-0">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800 text-sm">{item.product_name}</p>
                                  <p className="text-xs text-gray-400">SKU: {item.product_sku}</p>
                                  <p className="text-xs text-gray-500 mt-1">Qty: {item.qty_ordered}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-800 text-sm">{formatPrice(item.price)}</p>
                                  <p className="text-xs text-gray-400">Total: {formatPrice(item.row_total)}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Price Summary */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Price Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Subtotal:</span>
                          <span className="text-gray-700">{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Shipping:</span>
                          <span className="text-gray-700">{formatPrice(order.shipping_amount)}</span>
                        </div>
                        {parseFloat(order.discount_amount) > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Discount:</span>
                            <span className="text-red-500">-{formatPrice(order.discount_amount)}</span>
                          </div>
                        )}
                        {parseFloat(order.tax_amount) > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tax:</span>
                            <span className="text-gray-700">{formatPrice(order.tax_amount)}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span className="text-gray-800">Grand Total:</span>
                            <span className="text-blue-600">{formatPrice(order.grand_total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Meta Information */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        Order Information
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Order UUID:</span>
                          <span className="font-mono text-gray-700">{order.uuid}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Magento ID:</span>
                          <span className="text-gray-700">{order.magento_order_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Created:</span>
                          <span className="text-gray-700">{new Date(order.created_at).toLocaleString()}</span>
                        </div>
                        {order.shipped_at && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Shipped:</span>
                            <span className="text-gray-700">{new Date(order.shipped_at).toLocaleString()}</span>
                          </div>
                        )}
                        {order.delivered_at && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Delivered:</span>
                            <span className="text-gray-700">{new Date(order.delivered_at).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'actions' && (
              <div className="space-y-4 max-w-md">
                {/* Email Action */}
                <button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">Send Order Email</p>
                      <p className="text-xs text-gray-500">Send order confirmation email to customer</p>
                    </div>
                  </div>
                  {isSendingEmail && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                </button>
                
                {/* Status Check Action */}
                <button
                  onClick={handleSyncOrder}
                  disabled={isSyncing}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Activity className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">Check Status</p>
                      <p className="text-xs text-gray-500">Get real-time status from Magento</p>
                    </div>
                  </div>
                  {isSyncing && <Loader2 className="w-4 h-4 animate-spin text-green-600" />}
                </button>
                
                {/* Order Actions */}
                {getActionButtons().map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${action.color.replace('hover:', '').replace('bg-', 'bg-').replace('hover:', '')}/10`}>
                        {action.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{action.label}</p>
                        <p className="text-xs text-gray-500">Change order status</p>
                      </div>
                    </div>
                  </button>
                ))}
                
                {/* Add Comment Button */}
                <button
                  onClick={() => setShowCommentModal(true)}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">Add Comment</p>
                      <p className="text-xs text-gray-500">Add note to order history</p>
                    </div>
                  </div>
                </button>
              </div>
            )}
            
            {activeTab === 'comments' && (
              <div className="space-y-4">
                <button
                  onClick={() => setShowCommentModal(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Add New Comment
                </button>
                
                {commentsData?.data?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No comments yet</p>
                  </div>
                ) : (
                  commentsData?.data?.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[comment.status]?.color || 'bg-gray-200'}`}>
                          {comment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.comment}</p>
                      {comment.metadata?.email_confirmation && (
                        <p className="text-xs text-blue-600 mt-2">✓ Customer notified</p>
                      )}
                      {comment.metadata?.visible_on_front && (
                        <p className="text-xs text-green-600 mt-1">✓ Visible on frontend</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <ActionModal
        isOpen={actionModal.type === 'cancel'}
        onClose={() => setActionModal({ type: null })}
        onConfirm={handleCancelOrder}
        title="Cancel Order"
        actionType="cancel"
        isLoading={isCancelling}
      />
      <ActionModal
        isOpen={actionModal.type === 'hold'}
        onClose={() => setActionModal({ type: null })}
        onConfirm={handleHoldOrder}
        title="Hold Order"
        actionType="hold"
        isLoading={isHolding}
      />
      <ActionModal
        isOpen={actionModal.type === 'unhold'}
        onClose={() => setActionModal({ type: null })}
        onConfirm={handleUnholdOrder}
        title="Release Order Hold"
        actionType="unhold"
        isLoading={isUnholding}
      />
      <AddCommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        onConfirm={handleAddComment}
        isLoading={isAddingComment}
      />
    </div>
  );
};

export default OrderDetail;