import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
import { ROUTES } from '../../router';

// Status badge configurations
const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-3 h-3" /> },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: <Loader2 className="w-3 h-3" /> },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: <Truck className="w-3 h-3" /> },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" /> },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-600', icon: <Package className="w-3 h-3" /> },
  on_hold: { label: 'On Hold', color: 'bg-orange-100 text-orange-800', icon: <Clock className="w-3 h-3" /> },
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
  { key: 'on_hold', label: 'On Hold' },
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

export const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const navigate = useNavigate();
  const [selectedVendorUuid, setSelectedVendorUuid] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

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
    navigate(`/order/${order.id}`, { state: { order } });
  const handleViewOrder = (orderUuid: string) => {
    // Navigate to order detail page with order UUID and vendor UUID as query params
    navigate(ROUTES.ORDER_DETAIL + `/${orderUuid}?vendor_uuid=${selectedVendorUuid}`);
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
                  <option value="on_hold">On Hold</option>
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
                          onClick={() => handleViewOrder(order.uuid)}
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
    </div>
  );
};

export default OrderList;