import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { submitInterviewForm, getInterviewForm } from '../service/api';
import { FormSection } from '../components/form-interview/FormSection';
import { InfoBlock } from '../components/form-interview/InfoBlock';
import { QuestionBlock } from '../components/form-interview/QuestionBlock';
import { Button } from '../components/ui/button';

interface InterviewFormData {
  // Bloco 1: Mergulho Cronológico
  currentlyEmployed: boolean;
  q1_1: string; // Contratação
  q1_2: string; // Realizações
  q1_3: string; // Erros
  q1_4: string; // Referências
  q1_5: string; // Motivo saída
  // Bloco 2: Teste da Realidade
  q2_1: string; // Números
  q2_2: string; // Playbook
  // Bloco 3: Comportamental
  q3_1: string; // Ownership
  q3_2: string; // Grit
  q3_3: string; // Trabalho em Equipe
  q3_4: string; // Rigor Analítico
  // Bloco 4: Potencial e Curiosidade
  q4_1: string; // Aprendizado
  q4_2: string; // Inspiração
  q4_3: string; // Receptividade
  // Bloco 5: Vulnerabilidade
  q6_1: string; // Risco de demissão
}

export function InterviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [formData, setFormData] = useState<InterviewFormData>({
    currentlyEmployed: true,
    q1_1: '',
    q1_2: '',
    q1_3: '',
    q1_4: '',
    q1_5: '',
    q2_1: '',
    q2_2: '',
    q3_1: '',
    q3_2: '',
    q3_3: '',
    q3_4: '',
    q4_1: '',
    q4_2: '',
    q4_3: '',
    q6_1: '',
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Buscar dados existentes do formulário
  useEffect(() => {
    const loadExistingData = async () => {
      // Não recarregar dados se já teve sucesso
      if (showSuccessModal) return;

      if (id && user) {
        setIsLoadingData(true);
        try {
          // Primeiro, tentar carregar do localStorage
          const storageKey = `interview-draft-${id}`;
          const savedDraft = localStorage.getItem(storageKey);

          if (savedDraft) {
            const draftData = JSON.parse(savedDraft);
            setFormData(draftData);
          }

          // Depois, buscar dados da API (se existirem, sobrescreverão o draft)
          const result = await getInterviewForm(id);
          if (result.success && result.data?.interview_data) {
            setFormData(result.data.interview_data);
            // Limpar o draft se já existe na API
            localStorage.removeItem(storageKey);
          }
        } catch (error) {
          console.error(
            'Nenhum dado de entrevista encontrado ou erro ao carregar:',
            error
          );
        } finally {
          setIsLoadingData(false);
          setIsInitialized(true);
        }
      } else if (user) {
        setIsLoadingData(false);
        setIsInitialized(true);
      }
    };
    loadExistingData();
  }, [id, user, showSuccessModal]);

  // Salvar dados no localStorage sempre que formData mudar
  useEffect(() => {
    if (id && !showSuccessModal && isInitialized) {
      const storageKey = `interview-draft-${id}`;
      localStorage.setItem(storageKey, JSON.stringify(formData));
    }
  }, [formData, id, showSuccessModal, isInitialized]);

  const handleFieldChange = (
    field: keyof InterviewFormData,
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      // Skip q1_5 validation if currently employed
      if (key === 'q1_5' && formData.currentlyEmployed) {
        return;
      }
      // Skip boolean fields
      if (key === 'currentlyEmployed') {
        return;
      }
      if (!formData[key as keyof InterviewFormData]) {
        newErrors[key] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      const firstErrorElement = document.querySelector(
        '.border-\\[\\#e53935\\]'
      );
      firstErrorElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('Por favor, preencha todas as respostas antes de finalizar.');
      return;
    }

    if (!id) {
      alert('ID da candidatura não encontrado.');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitInterviewForm(id, formData);

      // Limpar o rascunho do localStorage após envio bem-sucedido
      const storageKey = `interview-draft-${id}`;
      localStorage.removeItem(storageKey);

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Erro ao enviar entrevista:', error);
      alert('Erro ao salvar a entrevista. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] py-10 px-6">
      <div className="max-w-225 mx-auto">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Button
            onClick={() => navigate(`/admin/applications/${id}`)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <span>←</span> Voltar para Candidatura
          </Button>
        </div>

        {/* Header */}
        <header className="text-center mb-15">
          <div className="font-['IBM_Plex_Mono',monospace] text-[14px] font-semibold tracking-[3px] uppercase text-[#546e7a] mb-4">
            Ativos
          </div>
          <h1 className="text-[48px] font-extrabold leading-tight text-[#0a0e27] mb-3">
            Entrevista Principal
          </h1>
          <p className="text-[24px] font-medium text-[#546e7a] mb-6">
            Investigação Forense de Comportamento
          </p>
          <p className="max-w-175 mx-auto text-[18px] text-[#0a0e27] leading-relaxed">
            A entrevista principal não é uma conversa casual; é uma{' '}
            <strong>investigação forense</strong> sobre como o candidato pensa e
            age. O objetivo é encontrar evidências de que o comportamento
            passado dele é o melhor preditor do sucesso futuro na sua empresa.
          </p>
        </header>

        {/* Main Form */}
        <div className="bg-white border border-[#e0e7ef] rounded p-12 mb-10">
          {/* Section 1: O Mergulho Cronológico */}
          <FormSection
            number="Bloco 01"
            title="O Mergulho Cronológico"
            subtitle="Método Topgrading"
          >
            <InfoBlock title="Instruções:">
              <p>
                Para cada uma das últimas posições que o candidato ocupou
                (geralmente nos últimos 10 anos), faça as mesmas cinco perguntas
                básicas abaixo.
              </p>
            </InfoBlock>

            <QuestionBlock
              label="1. O que você foi contratado para fazer?"
              id="q1_1"
              value={formData.q1_1}
              onChange={value => handleFieldChange('q1_1', value)}
              error={errors.q1_1}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Verifica se o candidato tinha
                  clareza sobre sua missão e se ela estava alinhada com os
                  objetivos da empresa anterior.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label="2. Quais foram as realizações das quais você mais se orgulha?"
              id="q1_2"
              value={formData.q1_2}
              onChange={value => handleFieldChange('q1_2', value)}
              placeholder="Registre as realizações mencionadas..."
              error={errors.q1_2}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> A-Players tendem a focar em
                  resultados mensuráveis (outcomes) e não apenas em tarefas.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label="3. Quais foram os pontos baixos ou erros cometidos?"
              id="q1_3"
              value={formData.q1_3}
              onChange={value => handleFieldChange('q1_3', value)}
              placeholder="Registre os erros e a forma como foram apresentados..."
              error={errors.q1_3}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Avalia a humildade e a capacidade de
                  aprendizado. Candidatos que não assumem erros ou culpam o
                  mercado/chefia são "red flags" (sinais de alerta).
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label="4. Quem foram as pessoas com quem você trabalhou e o que elas diriam sobre sua performance?"
              id="q1_4"
              value={formData.q1_4}
              onChange={value => handleFieldChange('q1_4', value)}
              placeholder="Registre nomes e o que eles diriam..."
              error={errors.q1_4}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Prepara o terreno para a técnica
                  TORC (Threat of Reference Check). Isso força o candidato a ser
                  honesto, pois ele sabe que você falará com essas pessoas
                  depois.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.currentlyEmployed}
                  onChange={e =>
                    handleFieldChange('currentlyEmployed', e.target.checked)
                  }
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="text-[20px] font-semibold text-[#0a0e27]">
                  Candidato atualmente exerce alguma função
                </span>
              </label>
            </div>

            {!formData.currentlyEmployed && (
              <QuestionBlock
                label="5. Por que você deixou essa função?"
                id="q1_5"
                value={formData.q1_5}
                onChange={value => handleFieldChange('q1_5', value)}
                placeholder="Registre o motivo da saída..."
                error={errors.q1_5}
              >
                <InfoBlock>
                  <p>
                    <strong>Por quê:</strong> Revela padrões de carreira.
                    A-Players geralmente "correm em direção a algo melhor" e não
                    "fogem de algo ruim".
                  </p>
                </InfoBlock>
              </QuestionBlock>
            )}
          </FormSection>

          {/* Section 2: O Teste da Realidade */}
          <FormSection
            number="Bloco 02"
            title="O Teste da Realidade"
            subtitle="Números e Playbook"
          >
            <InfoBlock title="Objetivo:">
              <p>
                Estas duas perguntas são cruciais para separar quem "fala bem"
                de quem "executa bem".
              </p>
            </InfoBlock>

            <QuestionBlock
              label="Números: Me mostre o seu pipeline atual (ou os resultados do seu último projeto)"
              id="q2_1"
              value={formData.q2_1}
              onChange={value => handleFieldChange('q2_1', value)}
              placeholder="Registre os números apresentados e a segurança com que foram mencionados..."
              error={errors.q2_1}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Um A-Player conhece seus números de
                  cor (taxas de conversão, ticket médio, volume). Hesitação ou
                  respostas vagas indicam um B ou C-Player.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label="O Playbook: Como é uma semana típica na sua função?"
              id="q2_2"
              value={formData.q2_2}
              onChange={value => handleFieldChange('q2_2', value)}
              placeholder="Registre a descrição da rotina e processos..."
              error={errors.q2_2}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Revela se o candidato opera com
                  intenção e processo (calendário bloqueado para prospecção,
                  gestão de CRM) ou se apenas reage a incêndios.
                </p>
              </InfoBlock>
            </QuestionBlock>
          </FormSection>

          {/* Section 3: Perguntas Comportamentais */}
          <FormSection
            number="Bloco 03"
            title="Perguntas Comportamentais e de Competência"
            subtitle="Método STAR (Situação, Tarefa, Ação e Resultado)"
          >
            <QuestionBlock
              label="Ownership (Sentimento de Dono): Me conte sobre uma injustiça que você viveu no trabalho"
              id="q3_1"
              value={formData.q3_1}
              onChange={value => handleFieldChange('q3_1', value)}
              placeholder="Registre a resposta e a postura do candidato..."
              error={errors.q3_1}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> O objetivo é ver se o candidato age
                  como vítima (dobrando a aposta na reclamação) ou se ele diz:
                  "Sim, foi ruim, mas eu reconheci que não valia meu tempo
                  reclamar e foquei em resolver".
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label="Grit (Resiliência): Fale sobre uma vez em que você quis tanto algo que foi imparável em buscá-lo"
              id="q3_2"
              value={formData.q3_2}
              onChange={value => handleFieldChange('q3_2', value)}
              placeholder="Registre o exemplo de determinação..."
              error={errors.q3_2}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Startups são nebulosas e exigem
                  pessoas que aguentem a "monotonia do trabalho duro" e
                  obstáculos constantes.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label="Trabalho em Equipe: O que seus melhores amigos diriam que são suas maiores qualidades e defeitos?"
              id="q3_3"
              value={formData.q3_3}
              onChange={value => handleFieldChange('q3_3', value)}
              placeholder="Registre qualidades e defeitos mencionados..."
              error={errors.q3_3}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> As pessoas tendem a ser mais
                  honestas quando respondem através da perspectiva de terceiros.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label="Rigor Analítico: O que você tentou implementar no passado, mas acabou desistindo — e por quê?"
              id="q3_4"
              value={formData.q3_4}
              onChange={value => handleFieldChange('q3_4', value)}
              placeholder="Registre o exemplo e as razões da desistência..."
              error={errors.q3_4}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> A-Players são prolíficos e tentam
                  muitas ideias. Você quer ver se ele tem a maturidade de saber
                  quando "parar de martelar" algo que não funciona (Rigor
                  Analítico) ou se ele desiste por falta de resiliência.
                </p>
              </InfoBlock>
            </QuestionBlock>
          </FormSection>

          {/* Section 4: Potencial e Curiosidade */}
          <FormSection
            number="Bloco 04"
            title="Avaliando o Potencial e Curiosidade"
          >
            <InfoBlock title="Contexto:">
              <p>
                Como o mercado muda rápido (especialmente com IA), contratar por
                potencial é hoje mais importante do que contratar apenas por
                experiência passada.
              </p>
            </InfoBlock>

            <QuestionBlock
              label="Qual foi a última coisa que você estudou ou se interessou profundamente ('geeked out') por conta própria?"
              id="q4_1"
              value={formData.q4_1}
              onChange={value => handleFieldChange('q4_1', value)}
              placeholder="Registre o tema e a profundidade do interesse..."
              error={errors.q4_1}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> A-Players têm uma curiosidade
                  insaciável. Se a pessoa não sente necessidade de aprender
                  detalhes por conta própria, dificilmente terá alto impacto.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label="Em quem você se inspira na sua linha de trabalho e por quê?"
              id="q4_2"
              value={formData.q4_2}
              onChange={value => handleFieldChange('q4_2', value)}
              placeholder="Registre as referências e motivações..."
              error={errors.q4_2}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Isso demonstra se existe curiosidade
                  do candidato em adquirir conhecimento e, portanto, o grau de
                  sua busca por melhoramento.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label="Como você reage quando alguém desafia suas ideias?"
              id="q4_3"
              value={formData.q4_3}
              onChange={value => handleFieldChange('q4_3', value)}
              placeholder="Registre a resposta sobre receptividade a desafios..."
              error={errors.q4_3}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Avalia a abertura ao aprendizado e a
                  capacidade de adaptação em ambientes VICA (Voláteis, Incertos,
                  Complexos e Ambíguos).
                </p>
              </InfoBlock>
            </QuestionBlock>
          </FormSection>

          {/* Section 5: Teste de Vulnerabilidade */}
          <FormSection
            number="Bloco 05"
            title="O Teste da Vulnerabilidade e Autoconsciência"
            subtitle="De-risking"
          >
            <InfoBlock title="Leila Hormozi sugere uma pergunta poderosa:">
              <p>
                Esta pergunta ajuda a entender onde o candidato pode falhar e
                como ele lida com a realidade.
              </p>
            </InfoBlock>

            <QuestionBlock
              label="Se este trabalho não desse certo e eu tivesse que te demitir em 60 dias, qual seria o motivo mais provável?"
              id="q6_1"
              value={formData.q6_1}
              onChange={value => handleFieldChange('q6_1', value)}
              placeholder="Registre a resposta e avalie a autoconsciência..."
              error={errors.q6_1}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> A-Players têm alta autoconsciência.
                  Se ele der uma resposta "clichê" (ex: "sou perfeccionista"),
                  ele está performando. Se ele identificar um risco real de
                  adaptação (ex: "eu tendo a ir rápido demais antes de entender
                  todos os detalhes do legado"), você tem um sinal de
                  honestidade radical.
                </p>
              </InfoBlock>
            </QuestionBlock>
          </FormSection>

          {/* Submit Button */}
          <div className="mt-12 pt-8 border-t-2 border-[#e0e7ef] text-center">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-12 py-4.5 font-['IBM_Plex_Mono',monospace] text-[15px] font-semibold tracking-[1.5px] uppercase"
            >
              {isSubmitting ? 'Enviando...' : 'Finalizar Entrevista'}
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999">
          <div className="bg-white rounded-lg p-12 max-w-125 text-center shadow-2xl">
            <div className="text-[64px] mb-6">✓</div>
            <h2 className="text-[32px] font-extrabold text-[#0a0e27] mb-4">
              Entrevista Registrada!
            </h2>
            <p className="text-lg text-[#546e7a] mb-8">
              Todas as respostas foram registradas com sucesso.
            </p>
            <Button
              onClick={() => navigate(`/admin/applications/${id}`)}
              className="px-8 py-3"
            >
              Voltar para Candidatura
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
