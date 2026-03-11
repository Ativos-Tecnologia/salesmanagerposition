import { CheckboxField } from '../CheckboxField';
import { TextAreaField } from '../TextAreaField';
import { ButtonGroup } from '../ButtonGroup';

interface Step0Props {
  accepted: boolean;
  missionMotivation: string;
  onStep0Change: (data: {
    accepted?: boolean;
    missionMotivation?: string;
  }) => void;
  onNext: () => void;
  showModal: (
    message: string,
    title?: string,
    type?: 'error' | 'success' | 'warning' | 'info'
  ) => void;
}

export function Step0({
  accepted,
  missionMotivation,
  onStep0Change,
  onNext,
  showModal,
}: Step0Props) {
  const handleNext = () => {
    if (!accepted) {
      showModal(
        'Por favor, marque a caixa de confirmação no final da página para confirmar que você leu e entendeu o contexto geral da vaga.',
        'Campo obrigatório não preenchido',
        'warning'
      );
      setTimeout(() => {
        document
          .getElementById('check0')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    if (missionMotivation.length < 100) {
      showModal(
        `Campo "Por que essa vaga faz sentido pra você agora?": sua resposta tem ${missionMotivation.length} caracteres. São necessários pelo menos 100 caracteres.`,
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
          Etapa Inicial
        </div>
        <h2 className="text-4xl font-bold text-[#0a0e27] mb-2">Sobre a Vaga</h2>
      </div>

      <div className="mb-8 p-7 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#3b82f6] rounded-r">
        <h3 className="text-2xl font-bold text-[#0a0e27] mb-4">
          O que você vai fazer aqui
        </h3>
        <p className="mb-4 text-[#0a0e27]">
          Construir e manter{' '}
          <strong>automações, scrapers, integrações e soluções com IA</strong>{' '}
          que fazem a operação da Ativos funcionar.
        </p>
        <p className="mb-4 text-[#0a0e27]">
          No dia a dia: fluxos em n8n, coleta de dados de sites públicos,
          integração entre sistemas via API, e uso de IA para resolver problemas
          reais.
        </p>
        <p className="text-[#0a0e27]">
          <strong>Não é vaga de gestão.</strong> É vaga de quem constrói.
        </p>
      </div>

      <div className="mb-8 p-7 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#3b82f6] rounded-r">
        <h3 className="text-2xl font-bold text-[#0a0e27] mb-4">
          Como funciona este processo
        </h3>
        <p className="mb-4 text-[#0a0e27]">
          A Ativos não usa descrição de cargo tradicional. Aqui a gente deixa
          claro desde o início:
        </p>
        <ul className="list-none my-4">
          <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
            o que você vai precisar entregar
          </li>
          <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
            como vai ser avaliado
          </li>
          <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
            o que a gente espera de comportamento
          </li>
        </ul>
        <p className="mb-4 text-[#0a0e27]">
          É um processo que exige leitura e honestidade.{' '}
          <strong>
            Preferimos poucos candidatos alinhados a muitos candidatos
            genéricos.
          </strong>
        </p>
        <p className="mt-4 p-4 bg-[#e8f5e9] rounded text-[#0a0e27]">
          Não é necessário saber nada sobre precatórios. A gente ensina.
        </p>
      </div>

      <CheckboxField
        id="check0"
        checked={accepted}
        onChange={v => onStep0Change({ accepted: v })}
        label="Entendi. O processo avalia o que eu já construí e como resolvo problemas, não apenas meu currículo."
        required
      />

      <TextAreaField
        id="mission-motivation"
        value={missionMotivation}
        onChange={v => onStep0Change({ missionMotivation: v })}
        label="Por que essa vaga faz sentido pra você agora?"
        placeholder="Pode ser direto. O que te atraiu?"
        required
        minChars={100}
        error={missionMotivation.length > 0 && missionMotivation.length < 100}
      />

      <ButtonGroup onNext={handleNext} showBack={false} />
    </div>
  );
}
