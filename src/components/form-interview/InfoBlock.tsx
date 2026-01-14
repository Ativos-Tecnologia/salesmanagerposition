import React from 'react';

interface InfoBlockProps {
  title?: string;
  children: React.ReactNode;
}

export function InfoBlock({ title, children }: InfoBlockProps) {
  return (
    <div className="mb-6 p-6 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#2196f3] rounded-r">
      {title && (
        <div className="text-[18px] font-bold text-[#0a0e27] mb-2">{title}</div>
      )}
      <div className="text-[17px] text-[#0a0e27] leading-relaxed">
        {children}
      </div>
    </div>
  );
}
