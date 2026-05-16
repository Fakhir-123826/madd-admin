// src/components/ui/ModernDropdown.tsx

import React from 'react';
import Select from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface ModernDropdownProps {
  options: Option[];
  value?: string;
  onChange: (value: string, option?: Option) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const ModernDropdown: React.FC<ModernDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  required = false,
  disabled = false,
  isLoading = false,
  className = '',
}) => {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Select
        options={options}
        value={selectedOption}
        onChange={(option) => onChange(option?.value || '', option || undefined)}
        placeholder={placeholder}
        isDisabled={disabled}
        isLoading={isLoading}
        isClearable
        className="react-select-container"
        classNamePrefix="react-select"
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: error ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
            '&:hover': {
              borderColor: error ? '#ef4444' : '#3b82f6',
            },
          }),
        }}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};