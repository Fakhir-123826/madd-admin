// src/pages/Customer/AddCustomer.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, UserPlus, Mail, Lock, Calendar, Users, Phone, MapPin, Building, Hash, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  useCreateCustomerMutation,
  useGetVendorsQuery,
  useUpdateCustomerMutation,
  useGetCustomerQuery,
} from '../../app/api/CustomerSlices/CustomerApi';
import SearchableSelect from '../../component/SearchableSelect';
import { ROUTES } from '../../router';

interface FormErrors {
  vendor?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  street?: string;
  city?: string;
  country_id?: string;
  telephone?: string;
  postcode?: string;
  dob?: string;
  gender?: string;
  taxvat?: string;
}

export const AddCustomer: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vendorUuidFromUrl = searchParams.get('vendor') || '';
  const customerUuid = window.location.pathname.split('/').pop();

  const isEditMode = customerUuid && /^[0-9a-fA-F-]{36}$/.test(customerUuid);

  const [selectedVendorUuid, setSelectedVendorUuid] = useState(vendorUuidFromUrl);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Customer form data with all supported fields
  const [formData, setFormData] = useState({
    // Required fields
    email: '',
    firstname: '',
    lastname: '',

    // Optional personal fields
    middlename: '',
    prefix: '', // Mr., Ms., Dr., etc.
    suffix: '', // Jr., Sr., III, etc.
    dob: '',
    gender: '',
    taxvat: '', // Tax/VAT number

    // Account fields
    is_subscribed: false,

    // Address fields (for default address)
    address: {
      street: [''],
      city: '',
      region: '',
      region_id: 0,
      country_id: 'US',
      postcode: '',
      telephone: '',
      company: '',
      fax: '',
      firstname: '',
      lastname: '',
      middlename: '',
      prefix: '',
      suffix: '',
      vat_id: '',
      default_billing: true,
      default_shipping: true,
    }
  });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { data: vendors, isLoading: vendorsLoading } = useGetVendorsQuery();
  const [createCustomer, { isLoading: creating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: updating }] = useUpdateCustomerMutation();

  const { data: customerData, isLoading: customerLoading, error: customerError } = useGetCustomerQuery(
    { vendor_uuid: selectedVendorUuid, uuid: customerUuid! },
    { skip: !isEditMode || !selectedVendorUuid || !customerUuid }
  );

  useEffect(() => {
    if (customerError) {
      toast.error('Failed to load customer data');
    }
  }, [customerError]);

  useEffect(() => {
    if (isEditMode && customerData?.data) {
      const customer = customerData.data;
      setFormData({
        email: customer.email,
        firstname: customer.firstname,
        lastname: customer.lastname,
        middlename: customer.middlename || '',
        prefix: customer.prefix || '',
        suffix: customer.suffix || '',
        dob: customer.dob || '',
        gender: customer.gender ? String(customer.gender) : '',
        taxvat: customer.taxvat || '',
        is_subscribed: customer.is_subscribed || false,
        address: customer.addresses?.[0] ? {
          street: Array.isArray(customer.addresses[0].street) ? customer.addresses[0].street : [customer.addresses[0].street || ''],
          city: customer.addresses[0].city || '',
          region: customer.addresses[0].region?.region || '',
          region_id: customer.addresses[0].region?.region_id || 0,
          country_id: customer.addresses[0].country_id || 'US',
          postcode: customer.addresses[0].postcode || '',
          telephone: customer.addresses[0].telephone || '',
          company: customer.addresses[0].company || '',
          fax: customer.addresses[0].fax || '',
          firstname: customer.addresses[0].firstname || customer.firstname,
          lastname: customer.addresses[0].lastname || customer.lastname,
          middlename: customer.addresses[0].middlename || '',
          prefix: customer.addresses[0].prefix || '',
          suffix: customer.addresses[0].suffix || '',
          vat_id: customer.addresses[0].vat_id || '',
          default_billing: customer.addresses[0].default_billing || false,
          default_shipping: customer.addresses[0].default_shipping || false,
        } : formData.address,
      });
    }
  }, [customerData, isEditMode]);

  const handleAddressChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [field]: value,
      },
    });
    // Clear field-specific error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleStreetChange = (index: number, value: string) => {
    const newStreet = [...formData.address.street];
    newStreet[index] = value;
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        street: newStreet,
      },
    });
    if (errors.street) {
      setErrors({ ...errors, street: undefined });
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;
    return phoneRegex.test(phone);
  };

  const validatePostcode = (postcode: string, countryId: string): boolean => {
    // Basic validation for different countries
    const patterns: Record<string, RegExp> = {
      US: /^\d{5}(-\d{4})?$/,
      CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
      UK: /^[A-Za-z]{1,2}\d[A-Za-z\d]? \d[A-Za-z]{2}$/,
      AU: /^\d{4}$/,
      IN: /^\d{6}$/,
    };
    const pattern = patterns[countryId];
    return pattern ? pattern.test(postcode) : true;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Vendor validation
    if (!isEditMode && !selectedVendorUuid) {
      newErrors.vendor = 'Vendor is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Name validations
    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    } else if (formData.firstname.length < 2) {
      newErrors.firstname = 'First name must be at least 2 characters';
    } else if (formData.firstname.length > 255) {
      newErrors.firstname = 'First name must be less than 255 characters';
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    } else if (formData.lastname.length < 2) {
      newErrors.lastname = 'Last name must be at least 2 characters';
    } else if (formData.lastname.length > 255) {
      newErrors.lastname = 'Last name must be less than 255 characters';
    }

    // Date of birth validation
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      if (dobDate > today) {
        newErrors.dob = 'Date of birth cannot be in the future';
      } else if (age < 18) {
        newErrors.dob = 'Customer must be at least 18 years old';
      } else if (age > 120) {
        newErrors.dob = 'Please enter a valid date of birth';
      }
    }

    // Gender validation
    if (formData.gender && !['1', '2', '3'].includes(formData.gender)) {
      newErrors.gender = 'Please select a valid gender';
    }

    // Tax/VAT validation (optional but format check)
    if (formData.taxvat && formData.taxvat.length > 50) {
      newErrors.taxvat = 'Tax/VAT number must be less than 50 characters';
    }

    // Address validation
    if (showAddressForm) {
      if (!formData.address.street[0]?.trim()) {
        newErrors.street = 'Street address is required';
      }

      if (!formData.address.city.trim()) {
        newErrors.city = 'City is required';
      } else if (formData.address.city.length < 2) {
        newErrors.city = 'City must be at least 2 characters';
      }

      if (!formData.address.country_id.trim()) {
        newErrors.country_id = 'Country is required';
      }

      if (!formData.address.telephone.trim()) {
        newErrors.telephone = 'Phone number is required';
      } else if (!validatePhone(formData.address.telephone)) {
        newErrors.telephone = 'Please enter a valid phone number';
      }

      if (formData.address.postcode && !validatePostcode(formData.address.postcode, formData.address.country_id)) {
        newErrors.postcode = `Please enter a valid postal code for ${formData.address.country_id}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched to show errors
    const allFields = ['email', 'firstname', 'lastname'];
    if (showAddressForm) {
      allFields.push('street', 'city', 'country_id', 'telephone');
    }
    const newTouched: Record<string, boolean> = {};
    allFields.forEach(field => { newTouched[field] = true; });
    setTouched(newTouched);

    if (!validateForm()) {
      // Show first error message in toast
      const firstError = Object.values(errors)[0];
      if (firstError) {
        toast.error(firstError);
      } else {
        toast.error('Please fill all required fields correctly');
      }
      return;
    }

    try {
      // Prepare customer data for API
      const customerDataToSend: any = {
        email: formData.email.trim(),
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
      };

      // Add optional fields only if they have values
      if (formData.middlename) customerDataToSend.middlename = formData.middlename.trim();
      if (formData.prefix) customerDataToSend.prefix = formData.prefix;
      if (formData.suffix) customerDataToSend.suffix = formData.suffix;
      if (formData.dob) customerDataToSend.dob = formData.dob;
      if (formData.gender) customerDataToSend.gender = parseInt(formData.gender);
      if (formData.taxvat) customerDataToSend.taxvat = formData.taxvat.trim();

      // Handle subscription
      if (formData.is_subscribed) {
        customerDataToSend.extension_attributes = {
          is_subscribed: true,
        };
      }

      // Add address if provided
      if (showAddressForm && formData.address.street[0] && formData.address.city && formData.address.country_id) {
        const address: any = {
          firstname: formData.address.firstname?.trim() || formData.firstname.trim(),
          lastname: formData.address.lastname?.trim() || formData.lastname.trim(),
          street: formData.address.street,
          city: formData.address.city.trim(),
          country_id: formData.address.country_id,
          postcode: formData.address.postcode?.trim(),
          telephone: formData.address.telephone.trim(),
          default_billing: formData.address.default_billing,
          default_shipping: formData.address.default_shipping,
        };

        if (formData.address.company?.trim()) address.company = formData.address.company.trim();
        if (formData.address.fax?.trim()) address.fax = formData.address.fax.trim();
        if (formData.address.vat_id?.trim()) address.vat_id = formData.address.vat_id.trim();
        if (formData.address.region?.trim()) address.region = { region: formData.address.region.trim() };

        customerDataToSend.addresses = [address];
      }

      if (isEditMode && customerUuid) {
        // For update, only send changed fields
        const updateData: any = {};
        if (formData.firstname.trim() !== customerData?.data?.firstname) updateData.firstname = formData.firstname.trim();
        if (formData.lastname.trim() !== customerData?.data?.lastname) updateData.lastname = formData.lastname.trim();
        if (formData.email.trim() !== customerData?.data?.email) updateData.email = formData.email.trim();
        if (formData.dob !== customerData?.data?.dob) updateData.dob = formData.dob;
        if (formData.gender !== customerData?.data?.gender) updateData.gender = formData.gender ? parseInt(formData.gender) : undefined;
        if (formData.taxvat?.trim() !== customerData?.data?.taxvat) updateData.taxvat = formData.taxvat?.trim();

        // Remove undefined values
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        if (Object.keys(updateData).length === 0) {
          toast.error('No changes to update');
          return;
        }

        await updateCustomer({
          vendor_uuid: selectedVendorUuid,
          uuid: customerUuid,
          data: updateData,
        }).unwrap();
        
        toast.success(
          <div>
            <strong>Success!</strong>
            <div>Customer {formData.firstname} {formData.lastname} has been updated successfully.</div>
          </div>,
          { duration: 4000 }
        );
      } else {
        await createCustomer({
          vendor_uuid: selectedVendorUuid,
          data: customerDataToSend,
        }).unwrap();
        
        toast.success(
          <div>
            <strong>Customer Created!</strong>
            <div>{formData.firstname} {formData.lastname} has been added successfully.</div>
          </div>,
          { duration: 4000 }
        );
      }
      navigate(ROUTES.Customers_List + `?vendor=${selectedVendorUuid}`);
    } catch (error: any) {
      console.error('Customer operation error:', error);

      // Parse and display specific error messages
      let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} customer`;
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Check for duplicate email error
      if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('exist')) {
        errorMessage = 'A customer with this email address already exists';
      }

      toast.error(
        <div>
          <strong>Error!</strong>
          <div>{errorMessage}</div>
        </div>,
        { duration: 5000 }
      );
    }
  };

  const isLoading = vendorsLoading || customerLoading || creating || updating;

  const prefixOptions = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.', 'Rev.'];
  const suffixOptions = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'PhD', 'MD'];

  // Helper function to get error classes
  const getErrorClass = (field: string): string => {
    return errors[field as keyof FormErrors] && touched[field]
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:ring-blue-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`${ROUTES.Customers_List}?vendor=${selectedVendorUuid}`)}
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
          {/* Vendor Selection - Only in create mode */}
          {!isEditMode && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                Vendor Information
              </h2>
              <SearchableSelect
                options={vendors?.map(v => ({ value: v.uuid, label: v.company_name || v.trading_name })) || []}
                value={selectedVendorUuid}
                onChange={(value) => {
                  setSelectedVendorUuid(value);
                  if (errors.vendor) {
                    setErrors({ ...errors, vendor: undefined });
                  }
                }}
                placeholder="Select Vendor..."
              />
              {errors.vendor && touched.vendor && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.vendor}
                </p>
              )}
            </div>
          )}

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gray-500" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prefix</label>
                <select
                  value={formData.prefix}
                  onChange={(e) => handleFieldChange('prefix', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select prefix</option>
                  {prefixOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstname}
                  onChange={(e) => handleFieldChange('firstname', e.target.value)}
                  onBlur={() => handleBlur('firstname')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('firstname')}`}
                />
                {errors.firstname && touched.firstname && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.firstname}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <input
                  type="text"
                  value={formData.middlename}
                  onChange={(e) => handleFieldChange('middlename', e.target.value)}
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
                  onChange={(e) => handleFieldChange('lastname', e.target.value)}
                  onBlur={() => handleBlur('lastname')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('lastname')}`}
                />
                {errors.lastname && touched.lastname && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.lastname}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
                <select
                  value={formData.suffix}
                  onChange={(e) => handleFieldChange('suffix', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select suffix</option>
                  {suffixOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-500" />
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('email')}`}
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleFieldChange('dob', e.target.value)}
                    onBlur={() => handleBlur('dob')}
                    className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('dob')}`}
                  />
                </div>
                {errors.dob && touched.dob && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.dob}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleFieldChange('gender', e.target.value)}
                  onBlur={() => handleBlur('gender')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('gender')}`}
                >
                  <option value="">Select gender</option>
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                  <option value="3">Other</option>
                </select>
                {errors.gender && touched.gender && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.gender}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax/VAT Number</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.taxvat}
                    onChange={(e) => handleFieldChange('taxvat', e.target.value)}
                    onBlur={() => handleBlur('taxvat')}
                    className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('taxvat')}`}
                  />
                </div>
                {errors.taxvat && touched.taxvat && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.taxvat}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Section Toggle */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <button
              type="button"
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <MapPin className="w-5 h-5" />
              {showAddressForm ? 'Hide Address' : 'Add Default Address'}
            </button>
          </div>

          {/* Address Form */}
          {showAddressForm && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                Default Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.address.company}
                      onChange={(e) => handleAddressChange('company', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VAT ID</label>
                  <input
                    type="text"
                    value={formData.address.vat_id}
                    onChange={(e) => handleAddressChange('vat_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address.street[0]}
                    onChange={(e) => handleStreetChange(0, e.target.value)}
                    onBlur={() => handleBlur('street')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('street')}`}
                    placeholder="Street address"
                  />
                  {errors.street && touched.street && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.street}
                    </p>
                  )}
                  <input
                    type="text"
                    value={formData.address.street[1] || ''}
                    onChange={(e) => handleStreetChange(1, e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Apartment, suite, unit (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    onBlur={() => handleBlur('city')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('city')}`}
                  />
                  {errors.city && touched.city && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.city}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                  <input
                    type="text"
                    value={formData.address.region}
                    onChange={(e) => handleAddressChange('region', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                  <input
                    type="text"
                    value={formData.address.postcode}
                    onChange={(e) => handleAddressChange('postcode', e.target.value)}
                    onBlur={() => handleBlur('postcode')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('postcode')}`}
                  />
                  {errors.postcode && touched.postcode && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.postcode}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.address.country_id}
                    onChange={(e) => handleAddressChange('country_id', e.target.value)}
                    onBlur={() => handleBlur('country_id')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('country_id')}`}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="IN">India</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                  </select>
                  {errors.country_id && touched.country_id && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.country_id}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.address.telephone}
                      onChange={(e) => handleAddressChange('telephone', e.target.value)}
                      onBlur={() => handleBlur('telephone')}
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getErrorClass('telephone')}`}
                    />
                  </div>
                  {errors.telephone && touched.telephone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.telephone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fax</label>
                  <input
                    type="text"
                    value={formData.address.fax}
                    onChange={(e) => handleAddressChange('fax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.address.default_billing}
                    onChange={(e) => handleAddressChange('default_billing', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Use as default billing address</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.address.default_shipping}
                    onChange={(e) => handleAddressChange('default_shipping', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Use as default shipping address</span>
                </label>
              </div>
            </div>
          )}

          {/* Account Status & Newsletter */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
            <div className="space-y-3">
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
              onClick={() => navigate(ROUTES.Customers_List + `?vendor=${selectedVendorUuid}`)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (!isEditMode && !selectedVendorUuid)}
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