import { useState, useRef, useEffect } from "react";
import { FiFilter, FiRefreshCw, FiSearch, FiChevronDown } from "react-icons/fi";
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

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

const FilterDropdown = ({
  label,
  options,
  value,
  onChange,
}: FilterOption) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 transition cursor-pointer whitespace-nowrap"
      >
        <span className="font-medium">{value || label}</span>
        <FiChevronDown
          className={`text-gray-400 text-xs transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[140px]">
          <button
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-50 cursor-pointer"
          >
            All
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Reusable Component ──────────────────────────────────────────────────

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
      {/* ── Title Row ── */}
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

      {/* ── Tabs ── */}
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

      {/* ── Filter + Search Bar ── */}
      <div className="flex justify-between gap-4 mb-6">
        {/* Left: Filters */}
        <div className="flex items-center border border-gray-200 rounded-2xl shadow-sm divide-x divide-gray-200">
          {/* "Filter By" label */}
          <div className="flex items-center gap-2 px-4 py-2.5 text-gray-400 shrink-0">
            <FiFilter className="text-base" />
            <span className="text-sm text-gray-500 font-medium">Filter By</span>
          </div>

          {/* Dynamic filter dropdowns */}
          {filters.map((f, i) => (
            <div key={i} className="flex-1">
              <FilterDropdown {...f} />
            </div>
          ))}

          {/* Reset */}
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-2 px-5 py-2.5 text-sm text-teal-500 font-medium hover:text-teal-700 transition cursor-pointer shrink-0"
            >
              <FiRefreshCw className="text-sm" />
              Reset Filter
            </button>
          )}
        </div>

        {/* Right: Search */}
        <div className="flex items-center gap-2 px-4 w-[28%] border border-gray-200 rounded-2xl shadow-sm min-w-[180px]">
          <FiSearch className="text-gray-300 text-base shrink-0" />
          <input
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              onSearchChange?.(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearchSubmit?.();
            }}
            placeholder={searchPlaceholder}
            className="flex-1 text-sm text-gray-600 bg-transparent outline-none placeholder:text-gray-300 py-2.5"
          />
        </div>
      </div>
    </div>
  );
};

export default PageHeader;