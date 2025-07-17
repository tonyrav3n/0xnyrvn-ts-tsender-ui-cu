import React from 'react';

interface InputFieldProps {
  label: React.ReactNode;
  placeholder?: string;
  value: string;
  type?: string;
  large?: boolean;
  onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  type = 'text',
  large = false,
  onChange,
}) => {
  return (
      <div className="flex flex-col gap-1">
        <label className="font-semibold mb-1 text-gray-800 tracking-wide pl-1">
          {label}
        </label>
        {large ? (
            <textarea
                className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gray-700 min-h-[100px] shadow-sm placeholder-gray-400 transition-all duration-200 text-gray-900"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        ) : (
            <input
                className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gray-700 shadow-sm placeholder-gray-400 transition-all duration-200 text-gray-900"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        )}
      </div>
  );
};

export default InputField;
