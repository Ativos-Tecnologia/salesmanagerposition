import { ButtonGroup } from '../ButtonGroup';
import { CompetencyBlock } from './CompetencyBlock';
import type { CompetencyResponse } from '../../../types/application';

interface Step3Props {
  competencies: CompetencyResponse[];
  onCompetencyChange: (index: number, data: Partial<CompetencyResponse>) => void;
  onNext: () => void;
  onBack: () => void;
  showModal: (message: string, title?: string, type?: 'error' | 'success' | 'warning' | 'info') => void;
}

const competencyDefinitions = [
  {
    name: 'comp31',
    title: '3.1 Ownership Radical',
    value: 'Valor Ativos: Responsabilidade Total',
    description: 'Na Ativos, liderar é assumir responsabilidade integral.',
    highlight: ' Quem lidera na Ativos responde pelo resultado. Sempre.',
  },
  {
    name: 'comp32',
    title: '3.2 Liderança por Execução',
    value: 'Valor Ativos: Liderar pelo Exemplo',
    description: 'A Ativos não acredita em líderes distantes da operação.',
    highlight: ' Liderança aqui é presença técnica diária.',
  },
  {
    name: 'comp33',
    title: '3.3 Persuasão Comercial Responsável',
    value: 'Valor Ativos: Profissionalismo e Respeito',
    description: 'Vender precatórios exige critério, empatia e ética.',
    highlight: ' Na Ativos, confiança vem antes do contrato.',
  },
  {
    name: 'comp34',
    title: '3.4 Rigor Analítico',
    value: 'Valor Ativos: Decidir com Base em Fatos',
    description: 'A Ativos valoriza líderes que pensam com dados.',
    highlight: ' Opinião sem dado não orienta decisão.',
  },
  {
    name: 'comp35',
    title: '3.5 Disciplina Operacional',
    value: 'Valor Ativos: Processo Sustentável',
    description: 'Resultados duradouros vêm de processo, não de improviso.',
    highlight: ' Processo protege o negócio, o time e o credor.',
  },
  {
    name: 'comp36',
    title: '3.6 Resiliência e Consistência',
    value: 'Valor Ativos: Construção de Longo Prazo',
    description: 'O mercado de precatórios exige persistência e maturidade.',
    highlight: ' Performance aqui é consistência, não pico.',
  },
  {
    name: 'comp37',
    title: '3.7 Desenvolvimento de Pessoas',
    value: 'Valor Ativos: Time Forte',
    description: 'A Ativos não constrói negócios dependentes de indivíduos.',
    highlight: ' Liderança é medida pela evolução do time.',
  },
  {
    name: 'comp38',
    title: '3.8 Uso Inteligente de Tecnologia',
    value: 'Valor Ativos: Aprendizado Contínuo',
    description: 'Na Ativos, tecnologia é alavanca — não discurso.',
    highlight: ' IA que não muda processo não é entrega.',
  },
  {
    name: 'comp39',
    title: '3.9 Integridade Inquestionável',
    value: 'Valor Ativos: Confiança é o Ativo Central',
    description: 'A Ativos lida com decisões financeiras sensíveis.',
    highlight: ' Resultado que compromete confiança não é resultado aceitável.',
  },
];

export function Step3({ competencies, onCompetencyChange, onNext, onBack, showModal }: Step3Props) {
  const getCompetency = (name: string): CompetencyResponse => {
    const comp = competencies.find((c) => c.name === name);
    return comp || { name, rating: '', example: '' };
  };

  const handleNext = () => {
    const unratedComp = competencyDefinitions.find(def => {
      const comp = getCompetency(def.name);
      return comp.rating === '';
    });

    if (unratedComp) {
      showModal(
        `Por favor, selecione uma autoavaliação (de 1 a 5) para a competência "${unratedComp.title}" antes de continuar.`,
        'Campo obrigatório não preenchido',
        'warning'
      );
      setTimeout(() => {
        document
          .getElementById(`rating-${unratedComp.title}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    const invalidExample = competencyDefinitions.find(def => {
      const comp = getCompetency(def.name);
      return comp.example.length < 200;
    });

    if (invalidExample) {
      const comp = getCompetency(invalidExample.name);
      showModal(
        `Campo de exemplo da competência "${invalidExample.title}": sua resposta tem ${comp.example.length} caracteres. São necessários pelo menos 200 caracteres.`,
        'Campo obrigatório incompleto',
        'warning'
      );
      setTimeout(() => {
        document
          .getElementById(`example-${invalidExample.title}`)
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
          Etapa 3
        </div>
        <h2 className="text-4xl font-bold text-[#0a0e27] mb-2">Competências</h2>
        <div className="text-xl text-[#546e7a] font-medium">
          O padrão de comportamento esperado
        </div>
      </div>

      <div className="mb-8 p-7 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#3b82f6] rounded-r">
        <h3 className="text-2xl font-bold text-[#0a0e27] mb-4">Autoavaliação consciente</h3>
        <p className="text-[#0a0e27]">
          <strong>Seja honesto.</strong> Esta etapa existe para alinhar expectativas, não para
          "acertar respostas".
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
            onRatingChange={(rating) => onCompetencyChange(index, { name: def.name, rating })}
            onExampleChange={(example) => onCompetencyChange(index, { name: def.name, example })}
          />
        );
      })}

      <ButtonGroup onBack={onBack} onNext={handleNext} />
    </div>
  );
}

