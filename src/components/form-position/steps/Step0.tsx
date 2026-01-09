import { CheckboxField } from '../CheckboxField';
import { ButtonGroup } from '../ButtonGroup';

interface Step0Props {
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
  onNext: () => void;
  showModal: (message: string, title?: string, type?: 'error' | 'success' | 'warning' | 'info') => void;
}

export function Step0({ accepted, onAcceptedChange, onNext, showModal }: Step0Props) {
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
    onNext();
  };

  return (
    <div className="opacity-0 animate-[fadeInUp_0.5s_ease_forwards]">
      <div className="mb-8 pb-6 border-b-2 border-[#0a0e27]">
        <div className="font-['Space_Grotesk'] text-[13px] font-semibold tracking-[2px] text-[#3b82f6] mb-2 uppercase">
          Etapa Inicial
        </div>
        <h2 className="text-4xl font-bold text-[#0a0e27] mb-2">Contexto Geral da Vaga</h2>
      </div>

      <div className="mb-8 p-7 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#3b82f6] rounded-r">
        <h3 className="text-2xl font-bold text-[#0a0e27] mb-4">
          Leia com atenção antes de começar o preenchimento
        </h3>
        <p className="mb-4 text-[#0a0e27]">A Ativos não utiliza descrições de cargo tradicionais.</p>
        <p className="mb-4 text-[#0a0e27]">
          Esta vaga é avaliada por <strong>scorecard</strong>, o que significa que desde o início
          deixamos claro:
        </p>
        <ul className="list-none my-4">
          <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
            qual é a missão da função
          </li>
          <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
            quais resultados são esperados
          </li>
          <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
            como o desempenho será avaliado
          </li>
          <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
            quais comportamentos são inegociáveis
          </li>
        </ul>
        <p className="mb-4 text-[#0a0e27]">Este processo exige leitura, reflexão e honestidade.</p>
        <p className="text-[#0a0e27]">
          <strong>Preferimos poucos candidatos bem alinhados a muitos candidatos genéricos.</strong>
        </p>
      </div>

      <CheckboxField
        id="check0"
        checked={accepted}
        onChange={onAcceptedChange}
        label="Li e entendi que este processo avalia como eu construo resultados, não apenas meu histórico profissional."
        required
      />

      <ButtonGroup onNext={handleNext} showBack={false} />
    </div>
  );
}

