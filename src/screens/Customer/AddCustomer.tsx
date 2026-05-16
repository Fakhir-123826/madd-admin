// src/pages/Customer/AddCustomer.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, UserPlus, Mail, Lock, Calendar, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  useCreateCustomerMutation,
  useGetVendorsQuery,
  useUpdateCustomerMutation,
  useGetCustomerQuery,
} from '../../app/api/CustomerSlices/CustomerApi';
import { ModernDropdown } from '../../component/ui/ModernDropdown';

export const AddCustomer: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vendorUuidFromUrl = searchParams.get('vendor') || '';
  const customerUuid = window.location.pathname.split('/').pop();
  const isEditMode = customerUuid !== 'add' && customerUuid !== undefined;

  const [selectedVendorUuid, setSelectedVendorUuid] = useState(vendorUuidFromUrl);
  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    dob: '',
    gender: '',
    is_active: true,
    is_subscribed: false,
  });

  const { data: vendors, isLoading: vendorsLoading } = useGetVendorsQuery();
  const [createCustomer, { isLoading: creating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: updating }] = useUpdateCustomerMutation();

  const { data: customerData, isLoading: customerLoading } = useGetCustomerQuery(
    { vendor_uuid: selectedVendorUuid, uuid: customerUuid! },
    { skip: !isEditMode || !selectedVendorUuid || !customerUuid }
  );

  useEffect(() => {
    if (isEditMode && customerData?.data) {
      const customer = customerData.data;
      setFormData({
        email: customer.email,
        firstname: customer.firstname,
        lastname: customer.lastname,
        password: '',
        dob: customer.dob || '',
        gender: customer.gender || '',
        is_active: customer.is_active,
        is_subscribed: customer.is_subscribed,
      });
    }
  }, [customerData, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVendorUuid) {
      toast.error('Please select a vendor');
      return;
    }

    try {
      if (isEditMode && customerUuid) {
        const updateData: any = {};
        if (formData.firstname) updateData.firstname = formData.firstname;
        if (formData.lastname) updateData.lastname = formData.lastname;
        if (formData.email) updateData.email = formData.email;
        if (formData.password) updateData.password = formData.password;
        if (formData.dob) updateData.dob = formData.dob;
        if (formData.gender) updateData.gender = formData.gender;
        updateData.is_active = formData.is_active;
        updateData.is_subscribed = formData.is_subscribed;

        await updateCustomer({
          vendor_uuid: selectedVendorUuid,
          uuid: customerUuid,
          data: updateData,
        }).unwrap();
        toast.success('Customer updated successfully');
      } else {
        await createCustomer({
          vendor_uuid: selectedVendorUuid,
          data: {
            ...formData,
            password: formData.password,
          },
        }).unwrap();
        toast.success('Customer created successfully');
      }
      navigate(`/admin/customers?vendor=${selectedVendorUuid}`);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} customer`);
    }
  };

  const isLoading = vendorsLoading || customerLoading || creating || updating;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/admin/customers?vendor=${selectedVendorUuid}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Customer' : 'Add New Customer'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {isEditMode ? 'Update customer information' : 'Create a new customer account'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vendor Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              Vendor Information
            </h2>
            <ModernDropdown
              label="Select Vendor"
              options={vendors?.map(v => ({ value: v.uuid, label: v.company_name })) || []}
              value={selectedVendorUuid}
              onChange={(value) => setSelectedVendorUuid(value)}
              placeholder="Choose a vendor..."
              required
              isLoading={vendorsLoading}
            />
            {/* <ModernDropdown
              label="Select Vendor"
              options={vendors?.map(v => ({ value: v.uuid, label: v.company_name })) || []}
              value={selectedVendorUuid}
              onChange={(value) => setSelectedVendorUuid(value)}
              placeholder="Choose a vendor..."
              required
              searchable
              disabled={isEditMode}
            /> */}
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gray-500" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstname}
                  onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEditMode ? 'New Password (optional)' : 'Password'} {!isEditMode && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!isEditMode}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
            <div className="space-y-3">
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
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(`/admin/customers?vendor=${selectedVendorUuid}`)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedVendorUuid}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEditMode ? 'Update Customer' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};