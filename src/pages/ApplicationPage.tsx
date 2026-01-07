import { useEffect } from 'react';
import { useApplicationForm } from '../hooks/useApplicationForm';
import { useModal } from '../hooks/useModal';
import { Modal } from '../components/application/Modal';
import { ProgressBar } from '../components/application/ProgressBar';
import { Step0 } from '../components/application/steps/Step0';
import { Step1 } from '../components/application/steps/Step1';
import { Step2 } from '../components/application/steps/Step2';
import { Step3 } from '../components/application/steps/Step3';
import { Step4 } from '../components/application/steps/Step4';
import { SuccessScreen } from '../components/application/SuccessScreen';

export function ApplicationPage() {
  const {
    formData,
    isLoading,
    updateStep0,
    updateStep1,
    updateOutcome,
    updateCompetency,
    updateStep4,
    nextStep,
    previousStep,
    submitApplication,
    totalSteps,
  } = useApplicationForm();

  const { modal, showModal, closeModal } = useModal();

  // Scroll para o topo sempre que a etapa mudar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [formData.currentStep]);

  const handleSubmit = async () => {
    const result = await submitApplication();
    if (result.success) {
      nextStep(); // Move to success screen
    } else {
      showModal('Erro ao enviar aplicação. Por favor, tente novamente.', 'Erro', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <div className="text-xl text-[#546e7a]">Carregando...</div>
      </div>
    );
  }

  const isSuccessScreen = formData.currentStep >= totalSteps;

  return (
    <div className="min-h-screen bg-[#fafbfc] font-['Space_Grotesk'] text-lg leading-[1.6] text-[#0a0e27]">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="text-center mb-16 pt-10 opacity-0 animate-[fadeInUp_0.8s_ease_forwards]">
        <div className="font-['Space_Grotesk'] text-sm font-semibold tracking-[3px] uppercase text-[#546e7a] mb-4">
          Ativos
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.1] text-[#0a0e27] mb-3">
          Formulário de Aplicação à Vaga de
          <br />
          Sales Manager de Precatórios
        </h1>
        <div className="text-2xl font-medium text-[#546e7a]">(Inbound & Outbound)</div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-10">
        {!isSuccessScreen && (
          <ProgressBar currentStep={formData.currentStep} totalSteps={totalSteps} />
        )}

        <div className="bg-white border border-[#e0e7ef] rounded p-6 md:p-12 mb-10">
          {isSuccessScreen ? (
            <SuccessScreen />
          ) : (
            <>
              {formData.currentStep === 0 && (
                <Step0
                  accepted={formData.step0.accepted}
                  onAcceptedChange={updateStep0}
                  onNext={nextStep}
                  showModal={showModal}
                />
              )}

              {formData.currentStep === 1 && (
                <Step1
                  accepted={formData.step1.accepted}
                  missionReflection={formData.step1.missionReflection}
                  onAcceptedChange={(accepted: boolean) => updateStep1({ accepted })}
                  onMissionReflectionChange={(missionReflection: string) =>
                    updateStep1({ missionReflection })
                  }
                  onNext={nextStep}
                  onBack={previousStep}
                  showModal={showModal}
                />
              )}

              {formData.currentStep === 2 && (
                <Step2
                  outcomes={formData.step2.outcomes}
                  onOutcomeChange={(key, data) => updateOutcome(key as keyof typeof formData.step2.outcomes, data)}
                  onNext={nextStep}
                  onBack={previousStep}
                  showModal={showModal}
                />
              )}

              {formData.currentStep === 3 && (
                <Step3
                  competencies={formData.step3.competencies}
                  onCompetencyChange={updateCompetency}
                  onNext={nextStep}
                  onBack={previousStep}
                  showModal={showModal}
                />
              )}

              {formData.currentStep === 4 && (
                <Step4
                  data={formData.step4}
                  onDataChange={updateStep4}
                  onSubmit={handleSubmit}
                  onBack={previousStep}
                  showModal={showModal}
                />
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
      />
    </div>
  );
}

