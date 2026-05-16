// src/pages/Customer/CustomerList.tsx

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  useGetCustomersQuery,
  useDeleteCustomerMutation,
  useSyncCustomersMutation,
  useGetVendorsQuery,
  useGetCustomerQuery,
  useUpdateCustomerMutation,
  type Customer,
} from '../../app/api/CustomerSlices/CustomerApi';
import { ModernDropdown } from '../../component/ui/ModernDropdown';



export const CustomerList: React.FC = () => {
  const [selectedVendorUuid, setSelectedVendorUuid] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSubscription, setFilterSubscription] = useState<string>('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedCustomerUuid, setSelectedCustomerUuid] = useState<string | null>(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const perPage = 10;

  const { data: vendors, isLoading: vendorsLoading, error: vendorsError } = useGetVendorsQuery();
 

  const {
    data: customersData,
    isLoading: customersLoading,
    isFetching,
    refetch,
  } = useGetCustomersQuery(
    {
      vendor_uuid: selectedVendorUuid,
      page: currentPage,
      per_page: perPage,
      search: debouncedSearch,
      is_active: filterStatus !== 'all' ? filterStatus === 'active' : undefined,
      is_subscribed: filterSubscription !== 'all' ? filterSubscription === 'subscribed' : undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    },
    { skip: !selectedVendorUuid }
  );

  const { data: customerDetail, refetch: refetchCustomer } = useGetCustomerQuery(
    { vendor_uuid: selectedVendorUuid, uuid: selectedCustomerUuid! },
    { skip: !selectedCustomerUuid || !selectedVendorUuid }
  );

  const [deleteCustomer, { isLoading: deleting }] = useDeleteCustomerMutation();
  const [syncCustomers, { isLoading: syncing }] = useSyncCustomersMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedVendorUuid]);

  const handleDelete = async (uuid: string) => {
    if (!selectedVendorUuid) return;
    try {
      await deleteCustomer({ vendor_uuid: selectedVendorUuid, uuid }).unwrap();
      toast.success('Customer deleted successfully');
      setDeleteConfirm(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete customer');
    }
  };

  const handleSync = async () => {
    if (!selectedVendorUuid) {
      toast.error('Please select a vendor first');
      return;
    }
    try {
      const result = await syncCustomers({ vendor_uuid: selectedVendorUuid }).unwrap();
      toast.success(result.message || 'Customers synced successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to sync customers');
    }
  };

  const handleViewCustomer = (uuid: string) => {
    setSelectedCustomerUuid(uuid);
    setIsViewDrawerOpen(true);
    refetchCustomer();
  };

  const handleEditCustomer = (uuid: string) => {
    setSelectedCustomerUuid(uuid);
    setIsEditDrawerOpen(true);
    refetchCustomer();
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3" />
        Inactive
      </span>
    );
  };

  const getSubscriptionBadge = (isSubscribed: boolean) => {
    if (isSubscribed) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Mail className="w-3 h-3" />
          Subscribed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        <Mail className="w-3 h-3" />
        Unsubscribed
      </span>
    );
  };

  const isLoading = customersLoading || isFetching;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your customer database
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSync}
                disabled={syncing || !selectedVendorUuid}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Sync Now
              </button>
              <button
                onClick={() => {
                  if (selectedVendorUuid) {
                    window.location.href = `/admin/customers/add?vendor=${selectedVendorUuid}`;
                  } else {
                    toast.error('Please select a vendor first');
                  }
                }}
                disabled={!selectedVendorUuid}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add Customer
              </button>
            </div>
          </div>
        </div>

        {/* Vendor Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 gap-6">
            <ModernDropdown
              label="Select Vendor"
              options={vendors?.map(v => ({ value: v.uuid, label: v.company_name })) || []}
              value={selectedVendorUuid}
              onChange={(value) => setSelectedVendorUuid(value)}
              placeholder="Choose a vendor..."
              required
              searchable
              clearable
              isLoading={vendorsLoading}
            />
            {vendorsError && (
              <p className="text-sm text-red-500">Failed to load vendors. Please check your API.</p>
            )}
          </div>
        </div>

        {selectedVendorUuid && (
          <>
            {/* Filters */}
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
                      placeholder="Name or email..."
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
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Newsletter
                  </label>
                  <select
                    value={filterSubscription}
                    onChange={(e) => setFilterSubscription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All</option>
                    <option value="subscribed">Subscribed</option>
                    <option value="unsubscribed">Unsubscribed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="created_at">Created Date</option>
                      <option value="firstname">First Name</option>
                      <option value="lastname">Last Name</option>
                      <option value="email">Email</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Newsletter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <p className="text-sm text-gray-500">Loading customers...</p>
                          </div>
                        </td>
                      </tr>
                    ) : customersData?.data?.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Users className="w-12 h-12 text-gray-300" />
                            <p className="text-gray-500">No customers found</p>
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
                      customersData?.data.map((customer: Customer) => (
                        <tr key={customer.uuid} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {customer.firstname} {customer.lastname}
                              </div>
                              <div className="text-sm text-gray-500">{customer.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {customer.phone || 'No phone'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {customer.magento_id || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(customer.is_active)}
                          </td>
                          <td className="px-6 py-4">
                            {getSubscriptionBadge(customer.is_subscribed)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {new Date(customer.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleViewCustomer(customer.uuid)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditCustomer(customer.uuid)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(customer.uuid)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {customersData?.meta && customersData.meta.total > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * perPage) + 1} to{' '}
                    {Math.min(currentPage * perPage, customersData.meta.total)} of{' '}
                    {customersData.meta.total} results
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Page {currentPage} of {customersData.meta.last_page}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(customersData.meta.last_page, p + 1))}
                      disabled={currentPage === customersData.meta.last_page}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* View Customer Drawer */}
      {isViewDrawerOpen && customerDetail?.data && (
        <CustomerViewDrawer
          customer={customerDetail.data}
          onClose={() => setIsViewDrawerOpen(false)}
        />
      )}

      {/* Edit Customer Drawer */}
      {isEditDrawerOpen && customerDetail?.data && (
        <CustomerEditDrawer
          customer={customerDetail.data}
          vendorUuid={selectedVendorUuid}
          onClose={() => setIsEditDrawerOpen(false)}
          onSuccess={() => {
            setIsEditDrawerOpen(false);
            refetch();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this customer? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Customer View Drawer Component
interface CustomerViewDrawerProps {
  customer: Customer;
  onClose: () => void;
}

const CustomerViewDrawer: React.FC<CustomerViewDrawerProps> = ({ customer, onClose }) => {
  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="relative w-screen max-w-2xl">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
              {/* Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 py-6 space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">Full Name</label>
                        <p className="font-medium text-gray-900">{customer.firstname} {customer.lastname}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Email</label>
                        <p className="font-medium text-gray-900">{customer.email}</p>
                      </div>
                      {customer.dob && (
                        <div>
                          <label className="text-sm text-gray-500">Date of Birth</label>
                          <p className="font-medium text-gray-900">{new Date(customer.dob).toLocaleDateString()}</p>
                        </div>
                      )}
                      {customer.gender && (
                        <div>
                          <label className="text-sm text-gray-500">Gender</label>
                          <p className="font-medium text-gray-900 capitalize">{customer.gender}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm text-gray-500">Magento ID</label>
                        <p className="font-medium text-gray-900">{customer.magento_id || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Created At</label>
                        <p className="font-medium text-gray-900">{new Date(customer.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {customer.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Newsletter</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.is_subscribed ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                        {customer.is_subscribed ? 'Subscribed' : 'Unsubscribed'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                {customer.addresses && customer.addresses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Addresses</h3>
                    <div className="space-y-3">
                      {customer.addresses.map((address, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {address.is_default_billing && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">Default Billing</span>
                            )}
                            {address.is_default_shipping && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">Default Shipping</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-900">{address.firstname} {address.lastname}</p>
                          <p className="text-sm text-gray-600">{address.street}</p>
                          <p className="text-sm text-gray-600">{address.city}, {address.region} {address.postcode}</p>
                          <p className="text-sm text-gray-600">{address.country_id}</p>
                          <p className="text-sm text-gray-600">Tel: {address.telephone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Customer Edit Drawer Component
interface CustomerEditDrawerProps {
  customer: Customer;
  vendorUuid: string;
  onClose: () => void;
  onSuccess: () => void;
}

const CustomerEditDrawer: React.FC<CustomerEditDrawerProps> = ({ customer, vendorUuid, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    password: '',
    dob: customer.dob || '',
    gender: customer.gender || '',
    is_active: customer.is_active,
    is_subscribed: customer.is_subscribed,
  });
  const [loading, setLoading] = useState(false);
  const [updateCustomer] = useUpdateCustomerMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData: any = {};
      if (formData.firstname !== customer.firstname) updateData.firstname = formData.firstname;
      if (formData.lastname !== customer.lastname) updateData.lastname = formData.lastname;
      if (formData.email !== customer.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;
      if (formData.dob !== customer.dob) updateData.dob = formData.dob;
      if (formData.gender !== customer.gender) updateData.gender = formData.gender;
      updateData.is_active = formData.is_active;
      updateData.is_subscribed = formData.is_subscribed;

      await updateCustomer({
        vendor_uuid: vendorUuid,
        uuid: customer.uuid,
        data: updateData,
      }).unwrap();
      toast.success('Customer updated successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="relative w-screen max-w-2xl">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
              {/* Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Edit Customer</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstname}
                      onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastname}
                      onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password (optional)</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Active Account</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_subscribed}
                      onChange={(e) => setFormData({ ...formData, is_subscribed: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Subscribe to Newsletter</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};