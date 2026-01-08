interface ButtonGroupProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  showBack?: boolean;
}

export function ButtonGroup({
  onBack,
  onNext,
  nextLabel = 'Continuar',
  showBack = true,
}: ButtonGroupProps) {
  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onNext();
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBack) onBack();
  };

  return (
    <div className="flex gap-4 mt-12 pt-8 border-t border-[#e0e7ef] flex-col md:flex-row">
      {showBack && onBack && (
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 px-8 py-[18px] border-none rounded font-['Space_Grotesk'] text-[15px] font-semibold tracking-wider uppercase cursor-pointer transition-all bg-transparent text-[#546e7a] border-2 border-[#e0e7ef] hover:border-[#0a0e27] hover:text-[#0a0e27]"
        >
          Voltar
        </button>
      )}
      <button
        type="button"
        onClick={handleNext}
        className="flex-1 px-8 py-[18px] border-none rounded font-['Space_Grotesk'] text-[15px] font-semibold tracking-wider uppercase cursor-pointer transition-all bg-[#00e676] text-[#0a0e27] hover:bg-[#00c853] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,230,118,0.3)]"
      >
        {nextLabel}
      </button>
    </div>
  );
}

