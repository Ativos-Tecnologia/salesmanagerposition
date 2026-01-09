import { CheckboxField } from '../CheckboxField';
import { TextAreaField } from '../TextAreaField';
import { ButtonGroup } from '../ButtonGroup';

interface Step1Props {
  accepted: boolean;
  missionReflection: string;
  onAcceptedChange: (accepted: boolean) => void;
  onMissionReflectionChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  showModal: (message: string, title?: string, type?: 'error' | 'success' | 'warning' | 'info') => void;
}

export function Step1({
  accepted,
  missionReflection,
  onAcceptedChange,
  onMissionReflectionChange,
  onNext,
  onBack,
  showModal,
}: Step1Props) {
  const handleNext = () => {
    if (!accepted) {
      showModal(
        'Por favor, marque a caixa "Li e compreendi a missão e o nível de responsabilidade da função" antes de continuar.',
        'Campo obrigatório não preenchido',
        'warning'
      );
      setTimeout(() => {
        document
          .getElementById('check1')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    if (missionReflection.length < 300) {
      showModal(
        `Campo "O que, especificamente, neste desafio faz sentido para você?": sua reflexão tem ${missionReflection.length} caracteres. São necessários pelo menos 300 caracteres.`,
        'Campo obrigatório incompleto',
        'warning'
      );
      setTimeout(() => {
        document
          .getElementById('mission-text')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    onNext();
  };

  return (
    <div className="opacity-0 animate-[fadeInUp_0.5s_ease_forwards]">
      <div className="mb-8 pb-6 border-b-2 border-[#0a0e27]">
        <div className="font-['Space_Grotesk'] text-[13px] font-semibold tracking-[2px] text-[#3b82f6] mb-2 uppercase">
          Etapa 1
        </div>
        <h2 className="text-4xl font-bold text-[#0a0e27] mb-2">Missão</h2>
        <div className="text-xl text-[#546e7a] font-medium">O "PORQUÊ"</div>
      </div>

      <div className="mb-8 p-7 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#3b82f6] rounded-r">
        <p className="mb-4 text-[#0a0e27]">
          A vaga envolve{' '}
          <strong>
            coordenar, desenvolver, recrutar e liderar a equipe de vendas de inbound e outbound
          </strong>{' '}
          voltada para credores de precatórios, estruturando processos de persuasão e prospecção
          para que leads aceitem vender seus créditos judiciais.
        </p>
        <p className="mb-4 text-[#0a0e27]">
          Essa função existe para <strong>transformar leads em contratos de forma sistemática</strong>
          , por meio de pessoas bem treinadas, processos claros e disciplina operacional.
        </p>
        <p className="mt-6 p-4 bg-[#e8f5e9] rounded text-[#0a0e27]">
          <strong>Observação:</strong> não é necessária experiência prévia com precatórios. Todo o
          conhecimento técnico será providenciado pela Ativos.
        </p>
      </div>

      <CheckboxField
        id="check1"
        checked={accepted}
        onChange={onAcceptedChange}
        label="Li e compreendi a missão e o nível de responsabilidade da função."
        required
      />

      <TextAreaField
        id="mission-text"
        value={missionReflection}
        onChange={onMissionReflectionChange}
        label="O que, especificamente, neste desafio faz sentido para você neste momento da sua carreira?"
        placeholder="Compartilhe sua reflexão aqui..."
        required
        minChars={300}
        error={missionReflection.length > 0 && missionReflection.length < 300}
      />

      <ButtonGroup onBack={onBack} onNext={handleNext} />
    </div>
  );
}

