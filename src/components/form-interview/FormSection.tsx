import React from 'react';

interface FormSectionProps {
  number: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function FormSection({
  number,
  title,
  subtitle,
  children,
}: FormSectionProps) {
  return (
    <section className="mb-12 pb-12 border-b border-[#e0e7ef] last:mb-0 last:pb-0 last:border-b-0">
      <div className="mb-6">
        <div className="font-['IBM_Plex_Mono',monospace] text-[13px] font-semibold tracking-[2px] text-[#2196f3] mb-2 uppercase">
          {number}
        </div>
        <h2 className="text-[32px] font-bold text-[#0a0e27] mb-2">{title}</h2>
        {subtitle && (
          <p className="text-[18px] text-[#546e7a] font-medium">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}
