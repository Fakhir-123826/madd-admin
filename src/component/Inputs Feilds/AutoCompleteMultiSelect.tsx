import React, { useState, useRef, useEffect } from "react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label?: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

const AutoCompleteMultiSelect: React.FC<Props> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Search and select...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabels = options
    .filter((o) => selectedValues.includes(o.value))
    .map((o) => o.label);

  return (
    <div className="mb-4 relative" ref={containerRef}>
      {label && (
        <label className="text-sm text-gray-700 block mb-1">{label}</label>
      )}

      {/* Input */}
      <div
        onClick={() => setIsOpen(true)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-md outline-none
                   focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400 cursor-text"
      >
        <div className="flex flex-wrap gap-1 mb-1">
          {selectedLabels.map((label, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
            >
              {label}
            </span>
          ))}
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={selectedLabels.length === 0 ? placeholder : ""}
          className="w-full outline-none"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow max-h-60 overflow-auto">
          {filteredOptions.length === 0 && (
            <div className="px-3 py-2 text-gray-400">No results</div>
          )}

          {filteredOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => toggleOption(option.value)}
              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                readOnly
                className="mr-2 accent-blue-500"
              />
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoCompleteMultiSelect;
