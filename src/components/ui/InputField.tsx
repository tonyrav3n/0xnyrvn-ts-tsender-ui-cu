import React from "react";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  type?: string;
  large?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  type = "text",
  large = false,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium mb-1">{label}</label>
      {large ? (
        <textarea
          className="border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          className="border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
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
