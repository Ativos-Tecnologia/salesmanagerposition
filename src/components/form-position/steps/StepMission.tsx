import { CheckboxField } from '../CheckboxField';
import { TextAreaField } from '../TextAreaField';
import { ButtonGroup } from '../ButtonGroup';

interface StepMissionProps {
  missionAccepted: boolean;
  missionMotivation: string;
  onStep0Change: (data: { missionAccepted?: boolean; missionMotivation?: string }) => void;
  onNext: () => void;
  onBack: () => void;
  showModal: (
    message: string,
    title?: string,
    type?: 'error' | 'success' | 'warning' | 'info'
  ) => void;
}

export function StepMission({
  missionAccepted,
  missionMotivation,
  onStep0Change,
  onNext,
  onBack,
  showModal,
}: StepMissionProps) {
  const handleNext = () => {
    if (!missionAccepted) {
      showModal(
        'Por favor, confirme que leu e compreendeu a missão e o nível de responsabilidade da função.',
        'Campo obrigatório não preenchido',
        'warning'
      );
      setTimeout(() => {
        document
          .getElementById('check-mission')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    if (missionMotivation.length < 300) {
      showModal(
        `Campo "O que, especificamente, neste desafio faz sentido para você neste momento da sua carreira?": sua resposta tem ${missionMotivation.length} caracteres. São necessários pelo menos 300 caracteres.`,
        'Campo obrigatório incompleto',
        'warning'
      );
      setTimeout(() => {
        document
          .getElementById('mission-motivation')
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
          Sua missão não é ser apenas o <strong>"Guardião da Marca"</strong>, mas
          atuar como o <strong>Arquiteto de Crescimento</strong> da empresa. A vaga
          envolve coordenar, desenvolver e liderar toda a organização de marketing,
          conectando sinais de demanda e comportamento do consumidor diretamente à
          nossa agenda de crescimento.
        </p>
        <p className="mb-4 text-[#0a0e27]">
          Essa função existe para{' '}
          <strong>
            transformar o marketing de um centro de custos em motor de receita
          </strong>
          , atuando de forma interfuncional (com Vendas, Tecnologia e Finanças) por
          meio de pessoas bem treinadas, decisões guiadas por dados e adoção
          contínua de Inteligência Artificial.
        </p>
        <p className="mt-4 p-4 bg-[#e8f5e9] rounded text-[#0a0e27]">
          <strong>Observação:</strong> esperamos fluência na linguagem da diretoria
          (CAC, LTV, ROI, payback) — não em jargões de marketing.
        </p>
      </div>

      <CheckboxField
        id="check-mission"
        checked={missionAccepted}
        onChange={v => onStep0Change({ missionAccepted: v })}
        label="Li e compreendi a missão e o nível de responsabilidade da função."
        required
      />

      <TextAreaField
        id="mission-motivation"
        value={missionMotivation}
        onChange={value => onStep0Change({ missionMotivation: value })}
        label="O que, especificamente, neste desafio faz sentido para você neste momento da sua carreira?"
        placeholder="Compartilhe sua reflexão aqui..."
        required
        minChars={300}
        error={missionMotivation.length > 0 && missionMotivation.length < 300}
      />

      <ButtonGroup onBack={onBack} onNext={handleNext} />
    </div>
  );
}
