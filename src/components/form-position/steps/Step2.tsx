/* eslint-disable @typescript-eslint/no-unused-vars */
import { ButtonGroup } from '../ButtonGroup';
import { OutcomeBlock } from './OutcomeBlock';
import type { ApplicationFormData } from '../../../types/application';

interface Step2Props {
  outcomes: ApplicationFormData['step2']['outcomes'];
  onOutcomeChange: (
    key: keyof ApplicationFormData['step2']['outcomes'],
    data: { accepted?: boolean; comment?: string }
  ) => void;
  onNext: () => void;
  onBack: () => void;
  showModal: (
    message: string,
    title?: string,
    type?: 'error' | 'success' | 'warning' | 'info'
  ) => void;
}

export function Step2({
  outcomes,
  onOutcomeChange,
  onNext,
  onBack,
  showModal,
}: Step2Props) {
  const handleNext = () => {
    const outcomeLabels: Record<string, string> = {
      playbook: 'Outcome 2.1 — Playbook',
      teamRestructure: 'Outcome 2.2 — Diagnóstico e Reestruturação do Time',
      operationalDiscipline: 'Outcome 2.3 — Disciplina Operacional',
      highPerformance: 'Outcome 2.4 — Time em Alta Performance',
      barRaiser: 'Outcome 2.4.1 — Bar Raiser',
      accountability: 'Outcome 2.4.2 — Accountability',
      conversion: 'Outcome 2.6 — Conversão',
      ai: 'Outcome 2.7 — IA e Eficiência',
    };

    const outcomeIds: Record<string, string> = {
      playbook: 'outcome21',
      teamRestructure: 'outcome22',
      operationalDiscipline: 'outcome23',
      highPerformance: 'outcome24',
      barRaiser: 'outcome241',
      accountability: 'outcome242',
      conversion: 'outcome26',
      ai: 'outcome27',
    };

    const unaccepted = Object.entries(outcomes).find(
      ([_, outcome]) => !outcome.accepted
    );
    if (unaccepted) {
      const [key] = unaccepted;
      showModal(
        `Por favor, marque a caixa de confirmação no "${outcomeLabels[key]}" para confirmar que você compreendeu este resultado esperado.`,
        'Campo obrigatório não preenchido',
        'warning'
      );
      setTimeout(() => {
        document
          .getElementById(outcomeIds[key])
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    const invalidComment = Object.entries(outcomes).find(
      ([_, outcome]) => outcome.comment.length < 150
    );
    if (invalidComment) {
      const [key, outcome] = invalidComment;
      showModal(
        `Campo de reflexão do "${outcomeLabels[key]}": sua resposta tem ${outcome.comment.length} caracteres. São necessários pelo menos 150 caracteres.`,
        'Campo obrigatório incompleto',
        'warning'
      );
      setTimeout(() => {
        document
          .getElementById(`${outcomeIds[key]}-comment`)
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
          Outcomes (Resultados)
        </h2>
        <div className="text-xl text-[#546e7a] font-medium">
          Quais os resultados esperados em até 12 meses
        </div>
      </div>

      <div className="mb-8 p-7 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#3b82f6] rounded-r">
        <p className="mb-4 text-[#0a0e27]">
          Esta função será avaliada{' '}
          <strong>exclusivamente pelos resultados descritos a seguir</strong>.
        </p>
        <p className="mb-4 text-[#0a0e27]">
          Aqui, alta performance significa entregar outcomes (resultados) de
          forma consistente, respeitando a lógica:
        </p>
        <p className="text-center font-bold text-xl my-5 text-[#3b82f6]">
          estrutura → pessoas → disciplina → conversão → escala
        </p>
      </div>

      {/* Playbook */}
      <OutcomeBlock
        id="outcome21"
        subtitle="Outcome 2.1 — até 3 meses"
        title="Playbook"
        description={
          <>
            <p className="mb-4 text-[#0a0e27]">
              Desenvolver, implementar e colocar em execução um{' '}
              <strong>Playbook Comercial completo</strong> para Inbound e
              Outbound.
            </p>
            <ul className="list-none my-4">
              <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
                Scripts por etapa do funil
              </li>
              <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
                Critérios objetivos de qualificação
              </li>
              <li className="relative pl-6 mb-2 text-[#0a0e27] before:content-['▸'] before:absolute before:left-0 before:text-[#3b82f6] before:font-bold">
                Regras claras de follow-up
              </li>
            </ul>
          </>
        }
        highlight=" Playbook sem treinamento não é entrega."
        accepted={outcomes.playbook.accepted}
        comment={outcomes.playbook.comment}
        onAcceptedChange={accepted => onOutcomeChange('playbook', { accepted })}
        onCommentChange={comment => onOutcomeChange('playbook', { comment })}
      />

      {/* Team Restructure */}
      <OutcomeBlock
        id="outcome22"
        subtitle="Outcome 2.2 — até 3 meses"
        title="Diagnóstico e Reestruturação do Time"
        description={
          <p className="mb-4 text-[#0a0e27]">
            Avaliar tecnicamente e comportamentalmente a equipe atual,
            promovendo treinamento intensivo e ajustes necessários.
          </p>
        }
        highlight=" Manter pessoas erradas invalida qualquer meta de conversão."
        accepted={outcomes.teamRestructure.accepted}
        comment={outcomes.teamRestructure.comment}
        onAcceptedChange={accepted =>
          onOutcomeChange('teamRestructure', { accepted })
        }
        onCommentChange={comment =>
          onOutcomeChange('teamRestructure', { comment })
        }
      />

      {/* Operational Discipline */}
      <OutcomeBlock
        id="outcome23"
        subtitle="Outcome 2.3 — até 6 meses"
        title="Disciplina Operacional"
        description={
          <p className="mb-4 text-[#0a0e27]">
            Garantir operação consistente, disciplinada e previsível, seguindo o
            playbook definido.
          </p>
        }
        highlight=" Antes de converter melhor, é preciso executar certo."
        accepted={outcomes.operationalDiscipline.accepted}
        comment={outcomes.operationalDiscipline.comment}
        onAcceptedChange={accepted =>
          onOutcomeChange('operationalDiscipline', { accepted })
        }
        onCommentChange={comment =>
          onOutcomeChange('operationalDiscipline', { comment })
        }
      />

      {/* High Performance */}
      <OutcomeBlock
        id="outcome24"
        subtitle="Outcome 2.4 — até 12 meses"
        title="Time em Alta Performance"
        description={
          <p className="mb-4 text-[#0a0e27]">
            Construir time comercial saudável, treinado e performático, capaz de
            sustentar resultados sem dependência excessiva do líder.
          </p>
        }
        accepted={outcomes.highPerformance.accepted}
        comment={outcomes.highPerformance.comment}
        onAcceptedChange={accepted =>
          onOutcomeChange('highPerformance', { accepted })
        }
        onCommentChange={comment =>
          onOutcomeChange('highPerformance', { comment })
        }
      />

      {/* Bar Raiser */}
      <OutcomeBlock
        id="outcome241"
        subtitle="Outcome 2.4.1"
        title="Bar Raiser"
        description={
          <p className="mb-4 text-[#0a0e27]">
            Garantir que cada nova contratação eleve o nível médio do time.
          </p>
        }
        highlight=" Na Ativos, crescer sem elevar o nível é falha de liderança."
        accepted={outcomes.barRaiser.accepted}
        comment={outcomes.barRaiser.comment}
        onAcceptedChange={accepted =>
          onOutcomeChange('barRaiser', { accepted })
        }
        onCommentChange={comment => onOutcomeChange('barRaiser', { comment })}
      />

      {/* Accountability */}
      <OutcomeBlock
        id="outcome242"
        subtitle="Outcome 2.4.2"
        title="Accountability"
        description={
          <p className="mb-4 text-[#0a0e27]">
            O sucesso do líder está diretamente ligado ao sucesso de seus
            liderados.
          </p>
        }
        highlight=" Na Ativos, líderes crescem quando o time cresce."
        accepted={outcomes.accountability.accepted}
        comment={outcomes.accountability.comment}
        onAcceptedChange={accepted =>
          onOutcomeChange('accountability', { accepted })
        }
        onCommentChange={comment =>
          onOutcomeChange('accountability', { comment })
        }
      />

      {/* Conversion */}
      <OutcomeBlock
        id="outcome26"
        subtitle="Outcome 2.6"
        title="Conversão"
        description={
          <>
            <p className="mb-4 text-[#0a0e27]">
              Após estruturação, treinamento e estabilização do time:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="p-5 bg-[#eff6ff] rounded">
                <h4 className="mb-3 text-[#0a0e27] font-bold">
                  Inbound (leads qualificados)
                </h4>
                <ul className="list-none p-0">
                  <li className="text-[#0a0e27]">• 2% em até 3 meses</li>
                  <li className="text-[#0a0e27]">• 5% em 6 meses</li>
                  <li className="text-[#0a0e27]">• 10% em 12 meses</li>
                </ul>
              </div>
              <div className="p-5 bg-[#eff6ff] rounded">
                <h4 className="mb-3 text-[#0a0e27] font-bold">
                  Outbound (lista fria)
                </h4>
                <ul className="list-none p-0">
                  <li className="text-[#0a0e27]">• 0,5% em até 3 meses</li>
                  <li className="text-[#0a0e27]">• 1,5% em 6 meses</li>
                  <li className="text-[#0a0e27]">• 3% em 12 meses</li>
                </ul>
              </div>
            </div>
          </>
        }
        highlight=" Conversão alta só conta se for repetível."
        accepted={outcomes.conversion.accepted}
        comment={outcomes.conversion.comment}
        onAcceptedChange={accepted =>
          onOutcomeChange('conversion', { accepted })
        }
        onCommentChange={comment => onOutcomeChange('conversion', { comment })}
      />

      {/* AI */}
      <OutcomeBlock
        id="outcome27"
        subtitle="Outcome 2.7"
        title="IA e Eficiência"
        description={
          <p className="mb-4 text-[#0a0e27]">
            Implementar ao menos uma automação ou solução de IA que redesenhe
            processos comerciais.
          </p>
        }
        highlight=" IA que não muda processo não é entrega."
        accepted={outcomes.ai.accepted}
        comment={outcomes.ai.comment}
        onAcceptedChange={accepted => onOutcomeChange('ai', { accepted })}
        onCommentChange={comment => onOutcomeChange('ai', { comment })}
      />

      <ButtonGroup onBack={onBack} onNext={handleNext} />
    </div>
  );
}
