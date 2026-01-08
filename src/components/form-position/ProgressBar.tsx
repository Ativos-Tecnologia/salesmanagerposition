interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;
  const stepLabel = currentStep === 0 ? 'Etapa Inicial' : `Etapa ${currentStep}`;

  return (
    <div className="sticky top-0 z-50 bg-[#fafbfc] py-5 mb-10 border-b border-[#e0e7ef]">
      <div className="w-full h-2 bg-[#e0e7ef] rounded overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-[#00c853] to-[#00e676] transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="font-['Space_Grotesk'] text-[13px] mt-3 text-[#546e7a] text-center">
        {stepLabel} de {totalSteps - 1}
      </div>
    </div>
  );
}

