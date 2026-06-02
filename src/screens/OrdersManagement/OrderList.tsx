import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  DollarSign,
  Calendar,
  X,
  AlertCircle,
  Store,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  useGetOrdersQuery,
  useSyncOrdersMutation,
  type Order,
  type OrderStatus,
} from '../../app/api/OrderSlices/OrderApi';
import { useGetVendorsQuery } from '../../app/api/VendorSlices/VendorApi';
import SearchableSelect from '../../component/SearchableSelect';

// Status badge configurations
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

const STATUS_TABS = [
  { key: '', label: 'All Orders' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'refunded', label: 'Refunded' },
];

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};

// Order Detail Drawer Component
const OrderDetailDrawer: React.FC<{
  order: Order | null;
  onClose: () => void;
}> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-white shadow-2xl flex flex-col">
        <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
              <p className="text-xs text-gray-400">#{order.magento_order_increment_id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
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

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <div className="p-1 bg-blue-100 rounded-lg">
                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Customer Information
            </h3>
            <div className="space-y-2">
              <p className="font-medium text-gray-800">
                {order.customer_firstname} {order.customer_lastname}
              </p>
              <p className="text-sm text-gray-500">{order.customer_email}</p>
            </div>
          </div>

          {/* Vendor Info */}
          {order.vendor && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Store className="w-3 h-3 text-blue-600" />
                Vendor Information
              </h3>
              <p className="font-medium text-gray-800">{order.vendor.company_name}</p>
            </div>
          )}

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Package className="w-3 h-3 text-blue-600" />
                Order Items ({order.items.length})
              </h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{item.product_name}</p>
                        {item.sku && <p className="text-xs text-gray-400">SKU: {item.sku}</p>}
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

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Truck className="w-3 h-3 text-blue-600" />
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
                <DollarSign className="w-3 h-3 text-blue-600" />
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

          {/* Notes */}
          {(order.customer_note || order.admin_note) && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
              {order.customer_note && (
                <div className="bg-blue-50 rounded-lg p-3 mb-2">
                  <p className="text-xs text-blue-600 font-medium mb-1">Customer Note:</p>
                  <p className="text-sm text-gray-700">{order.customer_note}</p>
                </div>
              )}
              {order.admin_note && (
                <div className="bg-yellow-50 rounded-lg p-3">
                  <p className="text-xs text-yellow-600 font-medium mb-1">Admin Note:</p>
                  <p className="text-sm text-gray-700">{order.admin_note}</p>
                </div>
              )}
            </div>
          )}

          {/* Meta Info */}
          <div className="text-xs text-gray-400 space-y-1 pt-2 border-t border-gray-100">
            <div className="flex justify-between">
              <span>Order UUID:</span>
              <span className="font-mono">{order.uuid?.slice(0, 13)}...</span>
            </div>
            <div className="flex justify-between">
              <span>Magento ID:</span>
              <span>{order.magento_order_id}</span>
            </div>
            <div className="flex justify-between">
              <span>Created:</span>
              <span>{new Date(order.created_at).toLocaleString()}</span>
            </div>
            {order.shipped_at && (
              <div className="flex justify-between">
                <span>Shipped:</span>
                <span>{new Date(order.shipped_at).toLocaleString()}</span>
              </div>
            )}
            {order.delivered_at && (
              <div className="flex justify-between">
                <span>Delivered:</span>
                <span>{new Date(order.delivered_at).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const OrderList: React.FC = () => {
  const [selectedVendorUuid, setSelectedVendorUuid] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const perPage = 10;

  // Fetch vendors
  const { data: vendors, isLoading: vendorsLoading } = useGetVendorsQuery({});

  // Build query params for orders
  const queryParams = {
    vendor_uuid: selectedVendorUuid,
    page: currentPage,
    per_page: perPage,
    status: filterStatus as OrderStatus || undefined,
    search: debouncedSearch || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  };

  const { data: ordersData, isLoading: ordersLoading, isFetching, refetch } = useGetOrdersQuery(
    queryParams,
    { skip: !selectedVendorUuid }
  );

  const [syncOrders, { isLoading: isSyncing }] = useSyncOrdersMutation();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when vendor changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedVendorUuid]);

  const handleSync = async () => {
    if (!selectedVendorUuid) {
      toast.error('Please select a vendor first');
      return;
    }
    try {
      const result = await syncOrders({ 
        vendor_uuid: selectedVendorUuid,
        page_size: 50,
        max_pages: 5,
      }).unwrap();
      
      if (result.success) {
        toast.success(result.message || 'Orders synced successfully');
        refetch();
      } else {
        toast.error(result.message || 'Failed to sync orders');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to sync orders');
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleResetFilters = () => {
    setFilterStatus('');
    setSearchTerm('');
    setDebouncedSearch('');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const orders = ordersData?.data || [];
  const summary = ordersData?.summary;
  const meta = ordersData?.meta;

  const isLoading = ordersLoading || isFetching;
  const showSelectorWarning = !selectedVendorUuid;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage and track customer orders
                </p>
              </div>
            </div>
            <button
              onClick={handleSync}
              disabled={isSyncing || !selectedVendorUuid}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Vendor Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 gap-6">
            <SearchableSelect
              options={vendors?.data?.map((v: any) => ({ value: v.uuid, label: v.company_name || v.name })) || []}
              value={selectedVendorUuid}
              onChange={(value) => setSelectedVendorUuid(value)}
              placeholder="Select Vendor..."
              isLoading={vendorsLoading}
            />
          </div>
        </div>

        {/* Statistics Summary - Only when vendor selected */}
        {!showSelectorWarning && summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">Total Orders</span>
              <p className="text-xl font-bold text-blue-600">{summary.total_orders || 0}</p>
            </div>
            <div className="bg-green-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">Total Revenue</span>
              <p className="text-lg font-bold text-green-600">{formatPrice(summary.total_revenue || 0)}</p>
            </div>
            <div className="bg-purple-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">Average Order</span>
              <p className="text-md font-bold text-purple-600">{formatPrice(summary.average_order_value || 0)}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">Pending</span>
              <p className="text-xl font-bold text-yellow-600">{summary.pending_orders || 0}</p>
            </div>
            <div className="bg-blue-100 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">Processing</span>
              <p className="text-xl font-bold text-blue-600">{summary.processing_orders || 0}</p>
            </div>
            <div className="bg-green-100 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">Delivered</span>
              <p className="text-xl font-bold text-green-600">{summary.delivered_orders || 0}</p>
            </div>
          </div>
        )}

        {/* Filters - Only when vendor selected */}
        {!showSelectorWarning && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Order #, customer name, email..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Status Tabs - Only when vendor selected */}
        {!showSelectorWarning && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setFilterStatus(tab.key);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    filterStatus === tab.key
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Warning - No Vendor Selected */}
        {showSelectorWarning && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center mb-6">
            <AlertCircle className="inline text-amber-500 text-lg mr-2" />
            <span className="text-amber-700">Please select a vendor to view orders</span>
          </div>
        )}

        {/* Orders Table */}
        <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${showSelectorWarning ? "opacity-60" : ""}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-sm text-gray-500">Loading orders...</p>
                      </div>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-500">No orders found</p>
                        <button
                          onClick={handleSync}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          Sync from Magento
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm font-semibold text-blue-600">
                          #{order.magento_order_increment_id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.customer_firstname} {order.customer_lastname}
                          </div>
                          <div className="text-sm text-gray-500">{order.customer_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {formatDate(order.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {formatPrice(order.grand_total)}
                        </div>
                        <div className="text-xs text-gray-400">{order.currency_code}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                          {statusConfig[order.status]?.icon}
                          {statusConfig[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${paymentStatusConfig[order.payment_status] || 'bg-gray-100 text-gray-600'}`}>
                          <DollarSign className="w-3 h-3" />
                          {order.payment_status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!showSelectorWarning && meta && meta.total > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {meta.from || 0} to {meta.to || 0} of {meta.total} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {currentPage} of {meta.last_page}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(meta.last_page, p + 1))}
                  disabled={currentPage === meta.last_page || isLoading}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Drawer */}
      <OrderDetailDrawer
        order={selectedOrder}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default OrderList;