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
    title: '3.1 Ownership Radical e Accountability',
    value: 'VALOR: RESPONSABILIDADE TOTAL PELOS RESULTADOS FINANCEIROS',
    description: (
      <>
        <p className="mb-4 text-[#0a0e27]">
          Liderar marketing aqui é assumir total responsabilidade pelos
          resultados financeiros – sem terceirizar a culpa de campanhas que
          falharam para o mercado, a liderança ou o produto.
        </p>
        <p className="mb-2 text-[#0a0e27] font-semibold">Este líder:</p>
        <ul className="list-disc pl-5 mb-4 text-[#0a0e27]">
          <li className="mb-1">
            Assume os resultados do time como consequência direta de suas
            decisões
          </li>
          <li className="mb-1">
            Não terceiriza culpa para marketing, leads, produto, jurídico ou
            mercado
          </li>
          <li className="mb-1">
            Age como dono do placar coletivo, priorizando, decidindo e
            executando
          </li>
        </ul>
      </>
    ),
    highlight:
      '👉 O Diretor de Marketing é coproprietário da receita. O sucesso ou a falha são sempre assumidos.',
    exampleLabel:
      'Descreva um exemplo concreto onde você demonstrou ownership radical',
  },
  {
    name: 'comp2',
    title: '3.2 Fluência Financeira (Rigor Analítico)',
    value: 'VALOR: DECIDIR COM BASE EM DADOS, NÃO EM ACHISMO',
    description: (
      <>
        <p className="mb-4 text-[#0a0e27]">
          A Players de marketing entram na diretoria justificando investimentos
          com lógica financeira. Equilibram retorno de curto prazo com
          construção de marca de longo, e usam CAC, LTV, ROI e payback como
          vocabulário cotidiano.
        </p>
        <p className="mb-2 text-[#0a0e27] font-semibold">Este líder:</p>
        <ul className="list-disc pl-5 mb-4 text-[#0a0e27]">
          <li className="mb-1">Lidera pelo exemplo, não apenas por discurso</li>
          <li className="mb-1">
            Entra em campo quando necessário para destravar conversões
          </li>
          <li className="mb-1">
            Treina na prática: escuta ligações, faz role play e corrige
            abordagem
          </li>
        </ul>
      </>
    ),
    highlight:
      '👉 Opinião sem dados de ROI e CAC não orienta decisões de negócio.',
    exampleLabel:
      'Descreva um exemplo concreto onde você liderou pelo exemplo',
  },
  {
    name: 'comp3',
    title: '3.3 Mentalidade Test-and-Learn (Agilidade)',
    value: 'VALOR: APRENDER RÁPIDO, ERRAR COM SEGURANÇA',
    description: (
      <>
        <p className="mb-4 text-[#0a0e27]">
          Capacidade comprovada de assumir riscos calculados, adaptar-se
          rapidamente a falhas e otimizar campanhas com base em feedback
          contínuo dos dados. Não busca a campanha perfeita – busca o ciclo de
          aprendizado mais rápido.
        </p>
        <p className="mb-2 text-[#0a0e27] font-semibold">Este líder:</p>
        <ul className="list-disc pl-5 mb-4 text-[#0a0e27]">
          <li className="mb-1">
            Domina vendas consultivas e entende o peso financeiro e emocional
            da decisão do credor
          </li>
          <li className="mb-1">
            Ensina persuasão baseada em lógica, informação e transparência
          </li>
          <li className="mb-1">
            Rejeita práticas manipulativas, promessas irreais ou pressão
            indevida
          </li>
        </ul>
      </>
    ),
    highlight:
      '👉 Em mercado ágil, falhar faz parte da exploração; falhar sem aprender rápido é o verdadeiro erro.',
    exampleLabel:
      'Descreva um exemplo concreto de persuasão ética e responsável',
  },
  {
    name: 'comp4',
    title: '3.4 Colaboração e Liderança de Integração',
    value: 'VALOR: CONSTRUIR PONTES, NÃO SILOS',
    description: (
      <>
        <p className="mb-4 text-[#0a0e27]">
          Habilidade comprovada de transitar e influenciar áreas como Vendas,
          Produto, Tecnologia e Finanças. Constrói relações estratégicas com
          CRO, CFO e CTO – não negocia com eles, opera ao lado deles.
        </p>
        <p className="mb-2 text-[#0a0e27] font-semibold">Este líder:</p>
        <ul className="list-disc pl-5 mb-4 text-[#0a0e27]">
          <li className="mb-1">
            Analisa funil, conversão, perdas e gargalos com profundidade
          </li>
          <li className="mb-1">Usa números para decidir, priorizar e corrigir</li>
          <li className="mb-1">
            Testa hipóteses, elimina o que não funciona e escala o que funciona
          </li>
        </ul>
      </>
    ),
    highlight:
      '👉 A performance excepcional de marketing morre dentro de silos organizacionais.',
    exampleLabel:
      'Descreva um exemplo concreto onde dados orientaram suas decisões',
  },
  {
    name: 'comp5',
    title: '3.5 Liderança Transformadora de Pessoas',
    value: 'VALOR: TIME FORTE VALE MAIS QUE ESTRELAS ISOLADAS',
    description: (
      <>
        <p className="mb-4 text-[#0a0e27]">
          Foco em elevar a barra de contratação, servir como coach e mentor, e
          desenvolver líderes até a independência tática. Mede sucesso pelo
          evolução do time, não pelo brilho pessoal em palcos ou prêmios.
        </p>
        <p className="mb-2 text-[#0a0e27] font-semibold">Este líder:</p>
        <ul className="list-disc pl-5 mb-4 text-[#0a0e27]">
          <li className="mb-1">Cria, mantém e evolui playbooks claros</li>
          <li className="mb-1">
            Exige aderência ao processo antes de aceitar exceções
          </li>
          <li className="mb-1">
            Valoriza repetição bem feita mais do que genialidade pontual
          </li>
        </ul>
      </>
    ),
    highlight:
      '👉 Liderança é medida pela evolução e sucesso do time, não pelo brilho pessoal em palcos.',
    exampleLabel:
      'Descreva um exemplo concreto de criação ou melhoria de processo',
  },
  {
    name: 'comp6',
    title: '3.6 Proficiência Técnica e Inovação (AI-First)',
    value: 'VALOR: APRENDIZADO CONTÍNUO E EFICIÊNCIA VIA TECNOLOGIA',
    description: (
      <>
        <p className="mb-4 text-[#0a0e27]">
          Curiosidade intelectual contínua para explorar, avaliar e aplicar
          novas tecnologias – GenAI, automação de marketing, dados unificados –
          no fluxo de trabalho, aumentando produtividade e qualidade da
          execução.
        </p>
        <p className="mb-2 text-[#0a0e27] font-semibold">Este líder:</p>
        <ul className="list-disc pl-5 mb-4 text-[#0a0e27]">
          <li className="mb-1">
            Suporta pressão, ciclos longos e objeções duras
          </li>
          <li className="mb-1">
            Mantém foco e energia mesmo sem recompensa imediata
          </li>
          <li className="mb-1">
            Não oscila comportamento conforme o mês
          </li>
        </ul>
      </>
    ),
    highlight:
      '👉 Líderes obsoletos rejeitam tecnologia; nós construímos o futuro lado a lado com a IA.',
    exampleLabel:
      'Descreva um exemplo concreto de resiliência e consistência',
  },
  {
    name: 'comp7',
    title: '3.7 Foco Obsessivo no Cliente',
    value: 'VALOR: CLIENTE NO CENTRO DE TODA DECISÃO',
    description: (
      <>
        <p className="mb-4 text-[#0a0e27]">
          Atua como o grande tradutor da voz do cliente dentro do conselho da
          empresa, unindo empatia emocional aos dados. Não decide sobre o
          cliente – decide com o cliente, baseado em pesquisa, escuta ativa e
          behavioral data.
        </p>
        <p className="mb-2 text-[#0a0e27] font-semibold">Este líder:</p>
        <ul className="list-disc pl-5 mb-4 text-[#0a0e27]">
          <li className="mb-1">Eleva o nível médio do time</li>
          <li className="mb-1">
            Desenvolve pessoas com feedback direto, honesto e frequente
          </li>
          <li className="mb-1">
            Não evita conversas difíceis quando necessárias
          </li>
        </ul>
      </>
    ),
    highlight:
      '👉 Toda estratégia começa e termina com um entendimento profundo do cliente.',
    exampleLabel:
      'Descreva um exemplo concreto de desenvolvimento de pessoas',
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
      return comp.example.length < 200;
    });

    if (invalidDef) {
      const comp = getCompetency(invalidDef.name);
      showModal(
        `Campo de exemplo da competência "${invalidDef.title}": sua resposta tem ${comp.example.length} caracteres. São necessários pelo menos 200 caracteres.`,
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
          Etapa 3
        </div>
        <h2 className="text-4xl font-bold text-[#0a0e27] mb-2">
          Competências
        </h2>
        <div className="text-xl text-[#546e7a] font-medium">
          O padrão de comportamento esperado
        </div>
      </div>

      <div className="mb-8 p-7 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#3b82f6] rounded-r">
        <h3 className="text-2xl font-bold text-[#0a0e27] mb-4">
          Autoavaliação consciente
        </h3>
        <p className="mb-4 text-[#0a0e27]">
          Para cada competência abaixo, marque o quanto ela faz parte da sua
          prática diária e traga um exemplo real.
        </p>
        <p className="text-[#0a0e27]">
          <strong>Seja honesto.</strong> Esta etapa existe para alinhar
          expectativas, não para "acertar respostas". Avaliações infladas ou
          genéricas costumam se revelar ao longo do processo.
        </p>
      </div>

      {competencyDefinitions.map((def, index) => {
        const comp = getCompetency(def.name);
        return (
          <CompetencyBlock
            key={def.name}
            title={def.title}
            value={def.value}
            description={def.description}
            highlight={def.highlight}
            rating={comp.rating}
            example={comp.example}
            exampleLabel={def.exampleLabel}
            exampleMinChars={200}
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
