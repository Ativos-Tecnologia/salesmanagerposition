import { useState, useEffect } from 'react';

interface TextAreaFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
  minChars?: number;
  error?: boolean;
}

export function TextAreaField({
  id,
  value,
  onChange,
  label,
  placeholder,
  required = false,
  minChars = 0,
  error = false,
}: TextAreaFieldProps) {
  const [charCount, setCharCount] = useState(value.length);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const getCounterClass = () => {
    if (charCount >= minChars) return 'text-[#3b82f6]';
    if (charCount > 0) return 'text-[#ffd600]';
    return 'text-[#78909c]';
  };

  return (
    <div className="my-8">
      <label htmlFor={id} className="block font-semibold mb-3 text-[#0a0e27] text-lg">
        {required && <span className="text-[#3b82f6] font-bold">* </span>}
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-4 border-2 ${
          error ? 'border-red-600' : 'border-[#e0e7ef]'
        } rounded font-['Space_Grotesk'] text-[17px] text-[#0a0e27] transition-all bg-white focus:outline-none focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] min-h-[180px] resize-y leading-[1.6]`}
      />
      {minChars > 0 && (
        <div className={`font-['Space_Grotesk'] text-[13px] mt-2 text-right ${getCounterClass()}`}>
          {charCount} / {minChars} caracteres mínimos
        </div>
      )}
    </div>
  );
}

