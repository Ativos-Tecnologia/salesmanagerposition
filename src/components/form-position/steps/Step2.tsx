import { ButtonGroup } from '../ButtonGroup';
import { CompetencyBlock } from './CompetencyBlock';
import type { CompetencyResponse } from '../../../types/application';

interface Step2Props {
  competencies: CompetencyResponse[];
  onCompetencyChange: (
    index: number,
    data: Partial<CompetencyResponse>
  ) => void;
  onNext: () => void;
  onBack: () => void;
  showModal: (
    message: string,
    title?: string,
    type?: 'error' | 'success' | 'warning' | 'info'
  ) => void;
}

const competencyDefinitions = [
  {
    name: 'comp1',
    title: 'Dono do que Constrói',
    value: 'Se quebrou, conserta. Não espera pedirem.',
    description:
      'Quem constrói aqui é responsável pelo que construiu. Se deu erro, investiga. Se parou de funcionar, resolve. Não empurra pra frente.',
    highlight: '',
  },
  {
    name: 'comp2',
    title: 'Autonomia + Comunicação',
    value: 'Trabalha sozinho, mas avisa quando trava.',
    description:
      'Aqui não tem microgerenciamento. Você recebe o objetivo e executa. Mas se travou, fala. Se entregou, avisa. Não fica no silêncio.',
    highlight: '',
  },
  {
    name: 'comp3',
    title: 'Resolve Problema de Verdade',
    value: 'Lê log, testa hipótese, acha a causa.',
    description:
      'Quando algo para de funcionar, você vai atrás. Não fica esperando. Lê o erro, isola o problema, testa até resolver. Depois documenta pra não acontecer de novo.',
    highlight: '',
  },
  {
    name: 'comp4',
    title: 'Aprende Rápido',
    value: 'Não sabe? Vai atrás. Lê doc, testa, faz funcionar.',
    description:
      'O mundo de automação e IA muda toda semana. Aqui a pergunta não é "você sabe fazer isso?" — é "você consegue aprender rápido?"',
    highlight: '',
  },
];

export function Step2({
  competencies,
  onCompetencyChange,
  onNext,
  onBack,
  showModal,
}: Step2Props) {
  const getCompetency = (name: string): CompetencyResponse =>
    competencies.find(c => c.name === name) || {
      name,
      rating: '',
      example: '',
    };

  const handleNext = () => {
    const unratedDef = competencyDefinitions.find(def => {
      const comp = getCompetency(def.name);
      return comp.rating === '';
    });

    if (unratedDef) {
      showModal(
        `Por favor, selecione uma autoavaliação (de 1 a 5) para a competência "${unratedDef.title}" antes de continuar.`,
        'Campo obrigatório não preenchido',
        'warning'
      );
      setTimeout(() => {
        document
          .getElementById(`rating-${unratedDef.title}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    const invalidDef = competencyDefinitions.find(def => {
      const comp = getCompetency(def.name);
      return comp.example.length < 100;
    });

    if (invalidDef) {
      const comp = getCompetency(invalidDef.name);
      showModal(
        `Campo de exemplo da competência "${invalidDef.title}": sua resposta tem ${comp.example.length} caracteres. São necessários pelo menos 100 caracteres.`,
        'Campo obrigatório incompleto',
        'warning'
      );
      setTimeout(() => {
        document
          .getElementById(`example-${invalidDef.title}`)
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
          Etapa 2
        </div>
        <h2 className="text-4xl font-bold text-[#0a0e27] mb-2">
          Como Você Trabalha
        </h2>
        <div className="text-xl text-[#546e7a] font-medium">
          Autoavaliação honesta
        </div>
      </div>

      <div className="mb-8 p-7 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#3b82f6] rounded-r">
        <p className="mb-4 text-[#0a0e27]">
          Pra cada item abaixo, marque de 1 a 5 o quanto faz parte do seu jeito
          de trabalhar e dê um exemplo real.
        </p>
        <p className="text-[#0a0e27]">
          <strong>Seja honesto.</strong> Respostas genéricas ou infladas
          aparecem rápido no processo.
        </p>
      </div>

      {competencyDefinitions.map((def, index) => {
        const comp = getCompetency(def.name);
        return (
          <CompetencyBlock
            key={def.name}
            title={def.title}
            value={def.value}
            description={<p>{def.description}</p>}
            highlight={def.highlight}
            rating={comp.rating}
            example={comp.example}
            onRatingChange={rating =>
              onCompetencyChange(index, { name: def.name, rating })
            }
            onExampleChange={example =>
              onCompetencyChange(index, { name: def.name, example })
            }
          />
        );
      })}

      <ButtonGroup onBack={onBack} onNext={handleNext} />
    </div>
  );
}
