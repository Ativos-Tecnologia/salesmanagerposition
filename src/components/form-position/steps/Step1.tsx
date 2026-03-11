import { ButtonGroup } from '../ButtonGroup';
import { OutcomeBlock } from './OutcomeBlock';
import type { OutcomeResponse } from '../../../types/application';

interface Step1Props {
  outcomes: OutcomeResponse[];
  onOutcomeChange: (index: number, data: Partial<OutcomeResponse>) => void;
  onNext: () => void;
  onBack: () => void;
  showModal: (
    message: string,
    title?: string,
    type?: 'error' | 'success' | 'warning' | 'info'
  ) => void;
}

const outcomeDefinitions = [
  {
    id: 'outcome1',
    subtitle: 'Resultado 1 — até 2 meses',
    title: 'Automações em Produção',
    description: (
      <p className="mb-4 text-[#0a0e27]">
        Pegar processos manuais da operação e transformar em automações
        funcionais (n8n ou similar). Pelo menos 2 a 3 fluxos rodando de verdade,
        com tratamento de erro e documentação.
      </p>
    ),
    criteria: (
      <ul className="list-none p-0">
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Automações rodando em produção, usadas pelo time
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Erros capturados e notificados (nada falhando em silêncio)
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Redução real de trabalho manual
        </li>
      </ul>
    ),
    highlight: '👉 Automação no papel não é entrega.',
  },
  {
    id: 'outcome2',
    subtitle: 'Resultado 2 — até 3 meses',
    title: 'Coleta de Dados Confiável',
    description: (
      <p className="mb-4 text-[#0a0e27]">
        Criar scrapers que coletam dados de sites públicos (tribunais, diários
        oficiais, etc.), guardam no banco de forma organizada e se atualizam
        sozinhos.
      </p>
    ),
    criteria: (
      <ul className="list-none p-0">
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Dados atualizados e acessíveis para o time
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Alertas quando algo quebra
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Fallbacks pra quando o site muda ou bloqueia
        </li>
      </ul>
    ),
    highlight: '👉 Scraping que quebra toda semana não é solução.',
  },
  {
    id: 'outcome3',
    subtitle: 'Resultado 3 — até 4 meses',
    title: 'IA Integrada a um Processo Real',
    description: (
      <p className="mb-4 text-[#0a0e27]">
        Construir pelo menos uma solução com IA (OpenAI, Gemini, etc.) integrada
        a um fluxo real da empresa — classificar leads, ler documentos, atender
        automaticamente, analisar dados.
      </p>
    ),
    criteria: (
      <ul className="list-none p-0">
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Time usando no dia a dia
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Ganho claro de tempo ou qualidade
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Custo de API controlado
        </li>
      </ul>
    ),
    highlight: '👉 IA que não resolve problema real é demo, não entrega.',
  },
  {
    id: 'outcome4',
    subtitle: 'Resultado 4 — contínuo',
    title: 'Manter o que Construiu',
    description: (
      <p className="mb-4 text-[#0a0e27]">
        Tudo que você colocar em produção precisa continuar funcionando.
        Monitorar, corrigir quando quebrar, manter banco saudável e documentar o
        que fez.
      </p>
    ),
    criteria: (
      <ul className="list-none p-0">
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Sistemas estáveis e monitorados
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Documentação que outra pessoa consegue seguir
        </li>
        <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
          Problemas resolvidos rápido
        </li>
      </ul>
    ),
    highlight: '👉 Sistema que ninguém monitora é bomba-relógio.',
    showComment: false,
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
    outcomes[index] || { accepted: false, comment: '' };

  const handleNext = () => {
    const unacceptedIndex = outcomeDefinitions.findIndex(
      (_, i) => !getOutcome(i).accepted
    );
    if (unacceptedIndex !== -1) {
      const def = outcomeDefinitions[unacceptedIndex];
      showModal(
        `Por favor, marque a caixa de confirmação no "${def.title}" para confirmar que você compreendeu este resultado esperado.`,
        'Campo obrigatório não preenchido',
        'warning'
      );
      setTimeout(() => {
        document
          .getElementById(def.id)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    const invalidIndex = outcomeDefinitions.findIndex((def, i) => {
      if (def.showComment === false) return false;
      return getOutcome(i).comment.length < 80;
    });
    if (invalidIndex !== -1) {
      const def = outcomeDefinitions[invalidIndex];
      const outcome = getOutcome(invalidIndex);
      showModal(
        `Campo de reflexão do "${def.title}": sua resposta tem ${outcome.comment.length} caracteres. São necessários pelo menos 80 caracteres.`,
        'Campo obrigatório incompleto',
        'warning'
      );
      setTimeout(() => {
        document
          .getElementById(`${def.id}-comment`)
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
        <h2 className="text-4xl font-bold text-[#0a0e27] mb-2">
          O que Esperamos
        </h2>
        <div className="text-xl text-[#546e7a] font-medium">
          Resultados concretos nos primeiros meses
        </div>
      </div>

      <div className="mb-8 p-7 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#3b82f6] rounded-r">
        <p className="mb-4 text-[#0a0e27]">
          Você vai ser avaliado por <strong>entregas reais</strong>, não por
          horas trabalhadas ou reuniões feitas.
        </p>
        <p className="text-[#0a0e27]">
          Leia cada resultado esperado, confirme que entendeu e diga por que
          acredita que consegue entregar.
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
            onAcceptedChange={accepted => onOutcomeChange(index, { accepted })}
            onCommentChange={comment => onOutcomeChange(index, { comment })}
            showComment={def.showComment !== false}
          />
        );
      })}

      <ButtonGroup onBack={onBack} onNext={handleNext} />
    </div>
  );
}
