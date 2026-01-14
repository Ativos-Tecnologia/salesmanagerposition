import React from 'react';

interface QuestionBlockProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  children?: React.ReactNode;
}

export function QuestionBlock({
  label,
  id,
  value,
  onChange,
  placeholder = 'Registre a resposta do candidato...',
  error = false,
  children,
}: QuestionBlockProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor={id}
        className="block text-[20px] font-semibold text-[#0a0e27] mb-4 leading-snug"
      >
        {label}
      </label>
      {children}
      <textarea
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full min-h-35 p-4 
          font-['Darker_Grotesque',sans-serif] text-[18px] leading-relaxed
          border-2 rounded
          bg-white text-[#0a0e27]
          transition-all duration-300
          resize-y
          focus:outline-none
          placeholder:text-[#78909c]
          ${
            error
              ? 'border-[#e53935] shadow-[0_0_0_3px_rgba(229,57,53,0.1)]'
              : 'border-[#e0e7ef] focus:border-[#0a0e27] focus:shadow-[0_0_0_3px_rgba(10,14,39,0.1)]'
          }
        `}
      />
    </div>
  );
}
