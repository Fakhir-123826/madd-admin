import React, { useState } from "react";

interface Filters {
  // Range filters
  idFrom: string;
  idTo: string;
  priceFrom: string;
  priceTo: string;
  lastUpdatedFrom: string;
  lastUpdatedTo: string;
  quantityFrom: string;
  quantityTo: string;

  // Dropdowns / selects
  storeView: string;
  asset: string;
  type: string;
  attributeSet: string;
  visibility: string;
  status: string;
  countryOfManufacture: string;

  // Text fields
  name: string;
  sku: string;
  minAdvertisedPrice: string;
}

interface OrderFilterProps {
  onApply: (filters: Filters) => void;
}

const ProductFilter = ({ onApply }: OrderFilterProps) => {
  const [filters, setFilters] = useState<Filters>({
    idFrom: "",
    idTo: "",
    priceFrom: "",
    priceTo: "",
    lastUpdatedFrom: "",
    lastUpdatedTo: "",
    quantityFrom: "",
    quantityTo: "",
    storeView: "",
    asset: "",
    type: "",
    attributeSet: "",
    visibility: "",
    status: "",
    countryOfManufacture: "",
    name: "",
    sku: "",
    minAdvertisedPrice: "",
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
      priceFrom: "",
      priceTo: "",
      lastUpdatedFrom: "",
      lastUpdatedTo: "",
      quantityFrom: "",
      quantityTo: "",
      storeView: "",
      asset: "",
      type: "",
      attributeSet: "",
      visibility: "",
      status: "",
      countryOfManufacture: "",
      name: "",
      sku: "",
      minAdvertisedPrice: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-8">
      {/* Range Filters - Row 1 */}
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

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Price
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="priceFrom"
              value={filters.priceFrom}
              onChange={handleChange}
              placeholder="from"
              className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              name="priceTo"
              value={filters.priceTo}
              onChange={handleChange}
              placeholder="to"
              className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Last Updated At */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Last Updated At
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              name="lastUpdatedFrom"
              value={filters.lastUpdatedFrom}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="date"
              name="lastUpdatedTo"
              value={filters.lastUpdatedTo}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Quantity
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="quantityFrom"
              value={filters.quantityFrom}
              onChange={handleChange}
              placeholder="from"
              className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              name="quantityTo"
              value={filters.quantityTo}
              onChange={handleChange}
              placeholder="to"
              className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Dropdowns & Text - Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Store View
          </label>
          <select
            name="storeView"
            value={filters.storeView}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Store Views</option>  {/* ✅ value="" not text */}
            <option value="store1">Store 1</option>
            <option value="store2">Store 2</option>
            {/* Add more real store views as needed */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Asset
          </label>
          <select
            name="asset"
            value={filters.asset}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>Select...</option>
            {/* Populate dynamically if needed */}
          </select>
        </div>

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

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Type
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option></option>
            <option>Simple Product</option>
            <option>Configurable Product</option>
            <option>Grouped Product</option>
            <option>Bundle Product</option>
            <option>Virtual Product</option>
            <option>Downloadable Product</option>
          </select>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Attribute Set
          </label>
          <select
            name="attributeSet"
            value={filters.attributeSet}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option></option>
            <option>Default</option>
            {/* Add more attribute sets */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            SKU
          </label>
          <input
            type="text"
            name="sku"
            value={filters.sku}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Visibility
          </label>
          <select
            name="visibility"
            value={filters.visibility}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option></option>
            <option>Not Visible Individually</option>
            <option>Catalog</option>
            <option>Search</option>
            <option>Catalog, Search</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option></option>
            <option>Enabled</option>
            <option>Disabled</option>
          </select>
        </div>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Country of Manufacture
          </label>
          <select
            name="countryOfManufacture"
            value={filters.countryOfManufacture}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option></option>
            <option>United States</option>
            <option>China</option>
            <option>Germany</option>
            {/* Add more countries */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Minimum Advertised Price
          </label>
          <input
            type="number"
            name="minAdvertisedPrice"
            value={filters.minAdvertisedPrice}
            onChange={handleChange}
            placeholder="From"
            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Spacer for alignment */}
        <div className="hidden lg:block"></div>

        {/* Buttons */}
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

export default ProductFilter;