import type { ChangeEvent } from "react";
import type { IconType } from "react-icons";

type InputFieldProps = {
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  icon: IconType;
  onChange: (value: string) => void;
};

const InputField = ({
  label,
  type,
  value,
  placeholder,
  icon: Icon,
  onChange,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-gray-700">
        {label} <span className="font-extrabold">:</span>
      </label>

      <div className="relative">
        
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          className="w-full h-11 pl-10 pr-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
    </div>
  );
};

export default InputField;
