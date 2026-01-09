interface CheckboxFieldProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  required?: boolean;
}

export function CheckboxField({
  id,
  checked,
  onChange,
  label,
  required = false,
}: CheckboxFieldProps) {
  return (
    <div
      className="flex items-start my-6 p-5 bg-white border-2 border-[#e0e7ef] rounded cursor-pointer transition-all hover:border-[#3b82f6] hover:bg-[#eff6ff]"
      onClick={() => onChange(!checked)}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-6 h-6 mr-4 cursor-pointer flex-shrink-0 accent-[#3b82f6]"
        onClick={(e) => e.stopPropagation()}
      />
      <label htmlFor={id} className="cursor-pointer font-medium text-lg text-[#0a0e27]">
        {required && <span className="text-[#3b82f6] font-bold">* </span>}
        {label}
      </label>
    </div>
  );
}

