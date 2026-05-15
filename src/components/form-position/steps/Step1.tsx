import { ButtonGroup } from "../ButtonGroup";
import { OutcomeBlock } from "./OutcomeBlock";
import type { OutcomeResponse } from "../../../types/application";

interface Step1Props {
  outcomes: OutcomeResponse[];
  onOutcomeChange: (index: number, data: Partial<OutcomeResponse>) => void;
  onNext: () => void;
  onBack: () => void;
  showModal: (
    message: string,
    title?: string,
    type?: "error" | "success" | "warning" | "info",
  ) => void;
}

const outcomeDefinitions = [
  {
    id: "outcome1",
    subtitle: "Resultado 2.1 — até 3 meses",
    title: "Diagnóstico e Estratégia Go-To-Market (GTM)",
    description: (
      <p className="mb-4 text-[#0a0e27]">
        Desenvolver e colocar em execução uma{" "}
        <strong>
          estratégia de marketing conectada diretamente aos objetivos de negócio
        </strong>
        , com diagnóstico do funil, definição de posicionamento, canais
        prioritários e modelo de atribuição. A estratégia deve cobrir
        posicionamento por segmento, SLAs com Vendas, modelo de atribuição
        claro, canais prioritários com racional de investimento e stack MarTech
        alinhada.
      </p>
    ),
    criteria: (
      <ul className="list-none p-0">
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Estratégia validada com C-level e dona de meta de receita
          compartilhada com Vendas
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Roadmap trimestral documentado, com hipóteses e métricas-alvo
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Execução iniciada em pelo menos 2 canais prioritários
        </li>
      </ul>
    ),
    highlight:
      "👉 Estratégia sem execução guiada por dados não passa de teatro de marketing.",
  },
  {
    id: "outcome2",
    subtitle: "Resultado 2.2 — até 3 meses",
    title: 'Reestruturação para uma Equipe "Whole-Brained"',
    description: (
      <p className="mb-4 text-[#0a0e27]">
        Avaliar tecnicamente e comportamentalmente o time atual de marketing,
        mesclando talentos com forças analíticas, operacionais e criativas. A
        meta é montar uma equipe equilibrada entre <em>brand</em>,{" "}
        <em>growth</em>, <em>analytics</em> e <em>operations</em>, com mapa de
        competências, plano de desenvolvimento individual e identificação de
        gaps de talento.
      </p>
    ),
    criteria: (
      <ul className="list-none p-0">
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Clareza objetiva sobre quem opera no nível esperado e quem não opera
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Recomposição do time priorizando elevação da barra média (Bar Raiser)
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Time mínimo operando com clara repartição de responsabilidades por
          meta
        </li>
      </ul>
    ),
    highlight:
      "👉 Líderes de marketing excepcionais constroem times — não palcos individuais.",
  },
  {
    id: "outcome3",
    subtitle: "Resultado 2.3 — até 6 meses",
    title: "Alinhamento Interfuncional (Fim dos Silos)",
    description: (
      <p className="mb-4 text-[#0a0e27]">
        Estabelecer SLAs formais com Vendas, dashboards compartilhados com
        Finanças e roadmap conjunto com Tecnologia. Marketing, Vendas, Produto,
        Tech e Finanças passam a operar como uma única engrenagem orientada à
        receita.
      </p>
    ),
    criteria: (
      <ul className="list-none p-0">
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          SLA assinado com Vendas (volume e qualidade de lead, tempo de
          resposta, follow-up)
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Dashboard de receita atribuída compartilhado com CFO e CRO
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Roadmap de dados e MarTech construído em conjunto com Tecnologia
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Cadência de rituais interfuncionais (semanal com Vendas, mensal com
          CFO/CTO)
        </li>
      </ul>
    ),
    highlight:
      "👉 Marketing não pode operar em vácuo: co-propriedade das metas com CRO, CFO e CTO é inegociável.",
  },
  {
    id: "outcome4",
    subtitle: "Resultado 2.4 — até 12 meses",
    title: "Entrega de Métricas Financeiras e de Crescimento",
    description: (
      <p className="mb-4 text-[#0a0e27]">
        Bater metas focadas em impacto de negócio: redução de CAC (Custo de
        Aquisição de Cliente), aumento de LTV (Valor do Tempo de Vida) e
        atribuição de receita clara (ROI). Métricas de vaidade — alcance,
        curtidas, prêmios — não contam.
      </p>
    ),
    criteria: (
      <ul className="list-none p-0">
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Redução mensurável do CAC blended em pelo menos um canal prioritário
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Modelo de atribuição rodando, com receita marketing-influenced
          reportada ao board
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Aumento sustentável de LTV via aquisição mais qualificada e melhor
          onboarding
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Payback por canal medido e otimizado trimestralmente
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Eficiência crescente: mais receita por real investido a cada trimestre
        </li>
      </ul>
    ),
    highlight: "",
  },
  {
    id: "outcome5",
    subtitle: "Resultado 2.5 — até 12 meses",
    title: "Adoção de IA e Eficiência MarTech",
    description: (
      <p className="mb-4 text-[#0a0e27]">
        Em parceria com Tecnologia, otimizar a stack MarTech e implementar
        soluções de IA que redesenhem processos, escalem personalização e gerem
        ganho mensurável de eficiência e velocidade de execução.
      </p>
    ),
    criteria: (
      <ul className="list-none p-0">
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Uso real e diário pelo time (não experimento isolado)
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Ganho mensurável em produtividade, qualidade ou custo
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Time treinado e cultura AI-First sustentada além do líder
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Processo redesenhado e documentado (antes vs. depois)
        </li>
      </ul>
    ),
    highlight:
      "👉 IA que não muda o processo de tomada de decisão não é entrega.",
  },
];

export function Step1({
  outcomes,
  onOutcomeChange,
  onNext,
  onBack,
  showModal,
}: Step1Props) {
  const getOutcome = (index: number): OutcomeResponse =>
    outcomes[index] || { accepted: false, comment: "" };

  const handleNext = () => {
    const unacceptedIndex = outcomeDefinitions.findIndex(
      (_, i) => !getOutcome(i).accepted,
    );
    if (unacceptedIndex !== -1) {
      const def = outcomeDefinitions[unacceptedIndex];
      showModal(
        `Por favor, marque a caixa de confirmação no "${def.title}" para confirmar que você compreendeu este resultado esperado.`,
        "Campo obrigatório não preenchido",
        "warning",
      );
      setTimeout(() => {
        document
          .getElementById(def.id)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }

    const invalidIndex = outcomeDefinitions.findIndex((_, i) => {
      return getOutcome(i).comment.length < 150;
    });
    if (invalidIndex !== -1) {
      const def = outcomeDefinitions[invalidIndex];
      const outcome = getOutcome(invalidIndex);
      showModal(
        `Campo de reflexão do "${def.title}": sua resposta tem ${outcome.comment.length} caracteres. São necessários pelo menos 150 caracteres.`,
        "Campo obrigatório incompleto",
        "warning",
      );
      setTimeout(() => {
        document
          .getElementById(`${def.id}-comment`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
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
          Outcomes (Resultados)
        </h2>
        <div className="text-xl text-[#546e7a] font-medium">
          Quais os resultados esperados em até 12 meses
        </div>
      </div>

      <div className="mb-8 p-7 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#3b82f6] rounded-r">
        <p className="mb-4 text-[#0a0e27]">
          Esta função será avaliada{" "}
          <strong>exclusivamente pelos resultados descritos a seguir</strong>.
        </p>
        <p className="text-[#0a0e27]">
          Leia cada resultado esperado, confirme que é capaz de entregá-lo e
          explique por que acredita nisso.
        </p>
      </div>

      {outcomeDefinitions.map((def, index) => {
        const outcome = getOutcome(index);
        return (
          <OutcomeBlock
            key={def.id}
            id={def.id}
            subtitle={def.subtitle}
            title={def.title}
            description={def.description}
            criteria={def.criteria}
            highlight={def.highlight}
            accepted={outcome.accepted}
            comment={outcome.comment}
            onAcceptedChange={(accepted) =>
              onOutcomeChange(index, { accepted })
            }
            onCommentChange={(comment) => onOutcomeChange(index, { comment })}
            showComment={true}
            checkboxLabel="Eu sou capaz de entregar esses resultados"
            commentLabel="Por que você acredita ser capaz de entregar este outcome?"
            commentMinChars={150}
          />
        );
      })}

      <ButtonGroup onBack={onBack} onNext={handleNext} />
    </div>
  );
}
