// Create new file: components/DynamicAttributeFields.tsx
import React, { useState, useEffect } from 'react';
import SearchableSelect from './SearchableSelect';

interface DynamicAttributeField {
  attribute_id: number;
  attribute_code: string;
  frontend_label: string;
  is_required: boolean;
  frontend_input?: string;
  default_value?: any;
  options?: Array<{ value: string; label: string }>;
}

interface DynamicAttributeFieldsProps {
  attributes: DynamicAttributeField[];
  values: Record<string, any>;
  onChange: (attributeCode: string, value: any) => void;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
}

const DynamicAttributeFields: React.FC<DynamicAttributeFieldsProps> = ({
  attributes,
  values,
  onChange,
  errors = {},
  touched = {}
}) => {
  
  const getFieldType = (attribute: DynamicAttributeField): string => {
    // Map Magento frontend_input to HTML input types
    const typeMap: Record<string, string> = {
      'text': 'text',
      'textarea': 'textarea',
      'price': 'number',
      'date': 'date',
      'boolean': 'checkbox',
      'select': 'select',
      'multiselect': 'multiselect',
      'weight': 'number',
      'gallery': 'file',
      'image': 'file'
    };
    return typeMap[attribute.frontend_input || 'text'] || 'text';
  };

  const renderField = (attribute: DynamicAttributeField) => {
    const value = values[attribute.attribute_code] ?? attribute.default_value ?? '';
    const fieldType = getFieldType(attribute);
    const hasError = errors[attribute.attribute_code] && touched[attribute.attribute_code];
    
    switch (attribute.frontend_input) {
      case 'select':
      case 'dropdown':
        return (
          <div key={attribute.attribute_id} className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              {attribute.frontend_label}
              {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => onChange(attribute.attribute_code, e.target.value)}
              className={`w-full border rounded-lg p-2 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
              required={attribute.is_required}
            >
              <option value="">-- Select {attribute.frontend_label} --</option>
              {attribute.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[attribute.attribute_code]}</p>}
          </div>
        );
        
      case 'multiselect':
        return (
          <div key={attribute.attribute_id} className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              {attribute.frontend_label}
              {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              multiple
              value={Array.isArray(value) ? value : (value ? [value] : [])}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                onChange(attribute.attribute_code, selected);
              }}
              className={`w-full border rounded-lg p-2 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
              size={Math.min(attribute.options?.length || 5, 5)}
            >
              {attribute.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[attribute.attribute_code]}</p>}
          </div>
        );
        
      case 'boolean':
        return (
          <div key={attribute.attribute_id} className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              id={attribute.attribute_code}
              checked={value === '1' || value === 1 || value === true}
              onChange={(e) => onChange(attribute.attribute_code, e.target.checked ? '1' : '0')}
              className="w-4 h-4"
            />
            <label htmlFor={attribute.attribute_code} className="text-sm font-semibold">
              {attribute.frontend_label}
              {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );
        
      case 'textarea':
        return (
          <div key={attribute.attribute_id} className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              {attribute.frontend_label}
              {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => onChange(attribute.attribute_code, e.target.value)}
              rows={4}
              className={`w-full border rounded-lg p-2 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
              required={attribute.is_required}
            />
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[attribute.attribute_code]}</p>}
          </div>
        );
        
      case 'price':
        return (
          <div key={attribute.attribute_id} className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              {attribute.frontend_label}
              {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => onChange(attribute.attribute_code, parseFloat(e.target.value))}
                className={`w-full pl-7 border rounded-lg p-2 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
                required={attribute.is_required}
              />
            </div>
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[attribute.attribute_code]}</p>}
          </div>
        );
        
      case 'date':
        return (
          <div key={attribute.attribute_id} className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              {attribute.frontend_label}
              {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="date"
              value={value}
              onChange={(e) => onChange(attribute.attribute_code, e.target.value)}
              className={`w-full border rounded-lg p-2 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
              required={attribute.is_required}
            />
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[attribute.attribute_code]}</p>}
          </div>
        );
        
      case 'text':
      default:
        return (
          <div key={attribute.attribute_id} className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              {attribute.frontend_label}
              {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(attribute.attribute_code, e.target.value)}
              className={`w-full border rounded-lg p-2 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
              required={attribute.is_required}
            />
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[attribute.attribute_code]}</p>}
          </div>
        );
    }
  };
  
  return (
    <>
      {attributes.map(attribute => renderField(attribute))}
    </>
  );
};

export default DynamicAttributeFields;