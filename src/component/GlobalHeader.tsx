// component/GlobalHeader/GlobalHeader.tsx
import { FiFilter, FiRefreshCw, FiSearch, FiChevronDown } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { useState, useRef, useEffect, type ReactNode } from "react";

// ─── Filter Dropdown Component ──────────────────────────────────────────────

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

const FilterDropdown = ({
  label,
  options,
  value,
  onChange,
}: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition cursor-pointer"
      >
        <span className="font-medium">{value || label}</span>
        <FiChevronDown
          className={`text-gray-400 transition-transform ${
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

// ─── Main Global Header Component ───────────────────────────────────────────

export interface FilterConfig {
  key: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

interface GlobalHeaderProps {
  // Title
  title: string;
  
  // Add Button
  onAddClick?: () => void;
  addButtonText?: string;
  
  // Filters
  filters?: FilterConfig[];
  
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
  
  // Reset
  onReset?: () => void;
  
  // Additional content (like tabs)
  extraContent?: ReactNode;
  
  // Custom class name
  className?: string;
}

const GlobalHeader = ({
  title,
  onAddClick,
  addButtonText = "Add New",
  filters = [],
  searchValue = "",
  onSearchChange,
  onSearchSubmit,
  onReset,
  extraContent,
  className = "",
}: GlobalHeaderProps) => {
  return (
    <div className={className}>
      {/* ── Header with Title and Add Button ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h1>

        {/* Add button — pill style matching reference image */}
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="flex items-center gap-0 w-fit p-1.5 md:p-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-white text-xs md:text-sm font-semibold shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer"
          >
            {/* Circle icon on left */}
            <span className="flex items-center justify-center h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/20 border-r border-white/20 ml-0">
              <FaPlus className="text-white text-[10px] md:text-xs" />
            </span>
            <span className="px-4 md:px-5">{addButtonText}</span>
          </button>
        )}
      </div>

      {/* Extra Content (like tabs) */}
      {extraContent && <div className="mb-5">{extraContent}</div>}

      {/* ── Filter Bar ── */}
      {(filters.length > 0 || onSearchChange) && (
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          {/* ================= LEFT: FILTERS ================= */}
          {filters.length > 0 && (
            <div className="flex flex-1 items-center border border-gray-200 rounded-2xl shadow-sm overflow-x-auto no-scrollbar bg-white">
              {/* Filter icon - hidden on very small screens if too crowded, or kept as a fixed lead */}
              <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 border-r border-gray-200 text-gray-400 bg-gray-50/50 rounded-l-2xl">
                <FiFilter className="text-base" />
                <span className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider">
                  Filters
                </span>
              </div>

              {/* Dynamic Filters */}
              <div className="flex items-center flex-1 divide-x divide-gray-100">
                {filters.map((filter) => (
                  <div key={filter.key} className="flex-shrink-0 min-w-[120px] md:min-w-[140px] py-1">
                    <FilterDropdown
                      label={filter.label}
                      options={filter.options}
                      value={filter.value}
                      onChange={filter.onChange}
                    />
                  </div>
                ))}
              </div>

              {/* Reset Button */}
              {onReset && (
                <button
                  onClick={onReset}
                  className="flex-shrink-0 flex items-center gap-2 px-5 py-3 text-xs md:text-sm text-teal-500 font-bold hover:text-teal-700 transition cursor-pointer border-l border-gray-100 hover:bg-teal-50/30"
                >
                  <FiRefreshCw className="text-sm" />
                  <span className="hidden md:inline">Reset</span>
                </button>
              )}
            </div>
          )}

          {/* ================= RIGHT: SEARCH ================= */}
          {onSearchChange && onSearchSubmit && (
            <div className="flex items-center gap-3 px-5 py-3 lg:w-[30%] border border-gray-200 rounded-2xl shadow-sm bg-white focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-500/5 transition-all">
              <FiSearch className="text-gray-300 text-lg flex-shrink-0" />
              <input
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSearchSubmit?.();
                  }
                }}
                placeholder="Search..."
                className="flex-1 text-sm text-gray-600 bg-transparent outline-none placeholder:text-gray-400 font-medium"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalHeader;