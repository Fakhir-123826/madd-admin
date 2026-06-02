import { useState, useEffect } from "react";
import {
  FiFilter,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import AddButton from "../AddButton";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Tab {
  key: string;
  label: string;
}

export interface FilterOption {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

export interface PageHeaderProps {
  title: string;
  addButtonLabel?: string;
  onAdd?: () => void;
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  filters?: FilterOption[];
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  onSearchSubmit?: () => void;
  onResetFilters?: () => void;
  searchPlaceholder?: string;
}

const PageHeader = ({
  title,
  addButtonLabel = "Add New",
  onAdd,
  tabs = [],
  activeTab,
  onTabChange,
  filters = [],
  searchValue = "",
  onSearchChange,
  onSearchSubmit,
  onResetFilters,
  searchPlaceholder = "Search here...",
}: PageHeaderProps) => {
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  return (
    <div className="bg-white">
      {/* Title */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-800 underline decoration-2 underline-offset-4">
          {title}
        </h1>

        {onAdd && (
          <AddButton
            label={addButtonLabel}
            onClick={onAdd}
            type="button"
          />
        )}
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="flex items-center gap-1 mb-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange?.(tab.key)}
              className={`px-5 py-2 rounded text-sm font-medium transition cursor-pointer ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-teal-400 to-green-400 text-white shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <FiFilter className="text-gray-500 text-lg" />
          <h3 className="text-lg font-semibold text-gray-800">
            Filters
          </h3>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>

            <div className="flex items-center px-3 border border-gray-300 rounded-lg bg-white">
              <FiSearch className="text-gray-400" />

              <input
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  onSearchChange?.(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSearchSubmit?.();
                  }
                }}
                placeholder={searchPlaceholder}
                className="w-full px-2 py-3 outline-none text-sm bg-transparent"
              />
            </div>
          </div>

          {/* Dynamic Filters */}
          {filters.map((filter, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {filter.label}
              </label>

              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="">All</option>

                {filter.options.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Reset Button */}
          {onResetFilters && (
            <div className="flex items-end">
              <button
                onClick={onResetFilters}
                className="w-full h-[50px] border border-gray-300 rounded-lg bg-white hover:bg-gray-100 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 transition"
              >
                <FiRefreshCw />
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
