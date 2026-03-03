import React, { useState } from "react";

interface CustomerFilters {
  // Range filters
  idFrom: string;
  idTo: string;
  customerSinceFrom: string;
  customerSinceTo: string;
  dateOfBirthFrom: string;
  dateOfBirthTo: string;

  // Text inputs
  name: string;
  email: string;
  phone: string;
  zip: string;
  stateProvince: string;
  taxVatNumber: string;

  // Dropdowns
  group: string;
  country: string;
  webSite: string;
  gender: string;
}

interface CustomerFilterProps {
  onApply: (filters: CustomerFilters) => void;
}

const CustomerFilter = ({ onApply }: CustomerFilterProps) => {
  const [filters, setFilters] = useState<CustomerFilters>({
    idFrom: "",
    idTo: "",
    customerSinceFrom: "",
    customerSinceTo: "",
    dateOfBirthFrom: "",
    dateOfBirthTo: "",
    name: "",
    email: "",
    phone: "",
    zip: "",
    stateProvince: "",
    taxVatNumber: "",
    group: "",
    country: "",
    webSite: "",
    gender: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleCancel = () => {
    setFilters({
      idFrom: "",
      idTo: "",
      customerSinceFrom: "",
      customerSinceTo: "",
      dateOfBirthFrom: "",
      dateOfBirthTo: "",
      name: "",
      email: "",
      phone: "",
      zip: "",
      stateProvince: "",
      taxVatNumber: "",
      group: "",
      country: "",
      webSite: "",
      gender: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-8">
      {/* Row 1 - ID, Customer Since, Date of Birth, Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            ID
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="idFrom"
              value={filters.idFrom}
              onChange={handleChange}
              placeholder="from"
              className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              name="idTo"
              value={filters.idTo}
              onChange={handleChange}
              placeholder="to"
              className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Customer Since */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Customer Since
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              name="customerSinceFrom"
              value={filters.customerSinceFrom}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="date"
              name="customerSinceTo"
              value={filters.customerSinceTo}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Date of Birth
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              name="dateOfBirthFrom"
              value={filters.dateOfBirthFrom}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="date"
              name="dateOfBirthTo"
              value={filters.dateOfBirthTo}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Row 2 - Email, Group, Phone, ZIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={filters.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Group */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Group
          </label>
          <select
            name="group"
            value={filters.group}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Groups</option>
            <option value="1">General</option>
            <option value="2">Wholesale</option>
            <option value="3">Retailer</option>
          </select>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={filters.phone}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* ZIP */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            ZIP
          </label>
          <input
            type="text"
            name="zip"
            value={filters.zip}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Row 3 - Country, State/Province, Web Site, Tax VAT Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Country */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Country
          </label>
          <select
            name="country"
            value={filters.country}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Countries</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            {/* Add more as needed */}
          </select>
        </div>

        {/* State/Province */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            State/Province
          </label>
          <input
            type="text"
            name="stateProvince"
            value={filters.stateProvince}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Web Site */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Web Site
          </label>
          <select
            name="webSite"
            value={filters.webSite}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Websites</option>
            <option value="1">Main Website</option>
            <option value="2">Store 1</option>
            <option value="3">Store 2</option>
          </select>
        </div>

        {/* Tax VAT Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Tax VAT Number
          </label>
          <input
            type="text"
            name="taxVatNumber"
            value={filters.taxVatNumber}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Row 4 - Gender + Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={filters.gender}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Not Specified">Not Specified</option>
          </select>
        </div>

        {/* Spacer */}
        <div className="hidden lg:block"></div>
        <div className="hidden lg:block"></div>

        {/* Buttons - right aligned */}
        <div className="flex items-end justify-end gap-4 lg:col-span-1">
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800 font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold transition shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerFilter;