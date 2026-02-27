import React from "react";

type InputProps = {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string | number | undefined;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="text-sm text-gray-700 block mb-1">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-md
                   border border-gray-300
                   px-3 py-3 text-md
                   outline-none
                   focus:border-blue-400
                   focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default Input;
