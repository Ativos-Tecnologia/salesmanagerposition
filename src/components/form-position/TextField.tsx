interface TextFieldProps {
  id: string;
  type?: 'text' | 'email' | 'tel';
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  formatter?: (value: string) => string;
}

export function TextField({
  id,
  type = 'text',
  value,
  onChange,
  label,
  placeholder,
  required = false,
  error = false,
  formatter,
}: TextFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = formatter ? formatter(e.target.value) : e.target.value;
    onChange(newValue);
  };

  return (
    <div className="my-8">
      <label htmlFor={id} className="block font-semibold mb-3 text-[#0a0e27] text-lg">
        {required && <span className="text-[#3b82f6] font-bold">* </span>}
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full p-4 border-2 ${
          error ? 'border-red-600' : 'border-[#e0e7ef]'
        } rounded font-['Space_Grotesk'] text-[17px] text-[#0a0e27] transition-all bg-white focus:outline-none focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]`}
      />
    </div>
  );
}

