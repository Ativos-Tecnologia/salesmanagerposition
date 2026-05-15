import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { submitInterviewForm, getInterviewForm } from '../service/api';
import { FormSection } from '../components/form-interview/FormSection';
import { InfoBlock } from '../components/form-interview/InfoBlock';
import { QuestionBlock } from '../components/form-interview/QuestionBlock';
import { Button } from '../components/ui/button';

interface InterviewFormData {
  currentlyEmployed: boolean;
  q1_1: string;
  q1_2: string;
  q1_3: string;
  q1_4: string;
  q1_5: string;
  q2_1: string;
  q2_2: string;
  q3_1: string;
  q3_2: string;
  q3_3: string;
  q3_4: string;
  q4_1: string;
  q4_2: string;
  q4_3: string;
  q6_1: string;
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

  useEffect(() => {
    const loadExistingData = async () => {
      if (showSuccessModal) return;

      if (id && user) {
        setIsLoadingData(true);
        try {
          const storageKey = `interview-draft-${id}`;
          const savedDraft = localStorage.getItem(storageKey);

          if (savedDraft) {
            const draftData = JSON.parse(savedDraft);
            setFormData(draftData);
          }

          const result = await getInterviewForm(id);
          if (result.success && result.data?.interview_data) {
            setFormData(result.data.interview_data);
            localStorage.removeItem(storageKey);
          }
        } catch (error) {
          console.error('Nenhum dado de entrevista encontrado ou erro ao carregar:', error);
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
      if (key === 'q1_5' && formData.currentlyEmployed) return;
      if (key === 'currentlyEmployed') return;
      if (!formData[key as keyof InterviewFormData]) {
        newErrors[key] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      const firstErrorElement = document.querySelector('.border-\\[\\#e53935\\]');
      firstErrorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
            <strong>investigação forense</strong> sobre como o executivo de marketing pensa, age e
            analisa dados. O objetivo é encontrar evidências de que o candidato é um{' '}
            <strong>Arquiteto de Crescimento</strong> e não apenas um gestor focado em estética.
            Comportamento passado e entrega de ROI real são os melhores preditores do sucesso futuro.
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
                Para cada uma das últimas posições de <strong>liderança de marketing</strong> que o
                candidato ocupou nos últimos 10 anos, faça as cinco perguntas básicas abaixo.
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
                  <strong>Por quê:</strong> Verifica se o candidato tinha clareza sobre sua missão e
                  se a via como um papel puramente criativo ou como um{' '}
                  <strong>motor de crescimento</strong> alinhado aos objetivos da empresa.
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
                  <strong>Por quê:</strong> A-Players traduzem realizações em{' '}
                  <strong>impacto no negócio</strong>. Se o candidato focar apenas em métricas de
                  vaidade (prêmios, likes, rebrandings) e não em outcomes (ROI, redução de CAC,
                  aumento de LTV, pipeline gerado), é um forte sinal de alerta.
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
                  <strong>Por quê:</strong> Em marketing, campanhas falham. Avalia a autoconsciência
                  e o <em>ownership</em>. Candidatos que culpam o Produto, o CEO, Vendas ou o mercado
                  por campanhas malsucedidas reprovam neste quesito.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label="4. Quem foram as pessoas com quem você trabalhou (CFO, CTO, Head de Vendas) e o que elas diriam sobre sua performance e colaboração?"
              id="q1_4"
              value={formData.q1_4}
              onChange={value => handleFieldChange('q1_4', value)}
              placeholder="Registre nomes e o que eles diriam..."
              error={errors.q1_4}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Prepara o terreno para a técnica{' '}
                  <strong>TORC</strong> (Threat of Reference Check). Força a honestidade e avalia
                  especificamente a capacidade do candidato de{' '}
                  <strong>destruir silos</strong> e operar interfuncionalmente com Finanças e
                  Tecnologia.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.currentlyEmployed}
                  onChange={e => handleFieldChange('currentlyEmployed', e.target.checked)}
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
                    <strong>Por quê:</strong> Pulos rápidos na carreira (12 a 18 meses) em cargos de
                    Diretoria de Marketing são grandes <em>red flags</em>, pois indicam líderes que
                    saem antes de verem o real resultado a longo prazo de suas estratégias.
                  </p>
                </InfoBlock>
              </QuestionBlock>
            )}
          </FormSection>

          {/* Section 2: O Teste da Realidade */}
          <FormSection
            number="Bloco 02"
            title="O Teste da Realidade"
            subtitle="Números, Stack e Playbook"
          >
            <InfoBlock title="Objetivo:">
              <p>
                Estas duas perguntas separam quem apenas{' '}
                <strong>"fala de marketing"</strong> de quem executa de forma orientada a dados e
                domina a arquitetura de canais.
              </p>
            </InfoBlock>

            <QuestionBlock
              label="Números Financeiros e Métricas: Me mostre os números da sua operação atual ou do seu último grande projeto. Como você provava o ROI para o CEO/CFO?"
              id="q2_1"
              value={formData.q2_1}
              onChange={value => handleFieldChange('q2_1', value)}
              placeholder="Registre os números apresentados e a segurança com que foram mencionados..."
              error={errors.q2_1}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Um Diretor de Marketing de alto nível conhece de cor suas
                  taxas de conversão, <strong>CAC, LTV</strong> e o tempo de <em>payback</em>.
                  Hesitação, respostas vagas ou tentativa de desviar para "engajamento de marca"
                  indicam um perfil fraco em negócios.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label='O Playbook e MarTech: Como você estrutura a sua "stack" de tecnologia (MarTech) e como é a rotina de otimização de campanhas na sua semana típica?'
              id="q2_2"
              value={formData.q2_2}
              onChange={value => handleFieldChange('q2_2', value)}
              placeholder="Registre a descrição da rotina e processos..."
              error={errors.q2_2}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Revela se o candidato tem fluência técnica para integrar
                  ferramentas (CRM, Analytics, IA) e se a equipe opera com testes contínuos (A/B) e
                  ajustes guiados por dados, ou se operam no achismo.
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
              label="Ownership e Alinhamento com Vendas (Fim da Vítima): Me conte sobre uma vez em que Vendas reclamou que os leads gerados pelo Marketing eram ruins, ou que uma campanha fracassou por 'culpa' de outra área. Como você lidou com isso?"
              id="q3_1"
              value={formData.q3_1}
              onChange={value => handleFieldChange('q3_1', value)}
              placeholder="Registre a resposta e a postura do candidato..."
              error={errors.q3_1}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> O alinhamento Marketing-Vendas é crítico. O objetivo é
                  ver se ele age como vítima (dobrando a aposta na guerra de silos) ou se estabelece{' '}
                  <strong>SLAs claros</strong> e assume a{' '}
                  <strong>copropriedade da receita</strong>.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label="Agilidade e Pivôs (Resiliência): Fale sobre uma vez em que você teve que pivotar dramaticamente uma estratégia de marketing devido a mudanças no mercado ou baixa performance inicial."
              id="q3_2"
              value={formData.q3_2}
              onChange={value => handleFieldChange('q3_2', value)}
              placeholder="Registre o exemplo de determinação..."
              error={errors.q3_2}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> O mercado muda rápido. Você quer ouvir uma história de{' '}
                  <strong>rápida adaptação</strong>, uso de dados para justificar a mudança de rota e
                  agilidade na comunicação com os stakeholders.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label="Trabalho em Equipe Interfuncional: O que o CTO (ou CIO) e o CFO da sua última empresa diriam que são suas maiores qualidades e defeitos?"
              id="q3_3"
              value={formData.q3_3}
              onChange={value => handleFieldChange('q3_3', value)}
              placeholder="Registre qualidades e defeitos mencionados..."
              error={errors.q3_3}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Diretores de Marketing modernos precisam ser parceiros
                  estratégicos dessas duas cadeiras. Se o candidato operava isolado da Tecnologia ou
                  era visto como um <em>"gastador irresponsável"</em> por Finanças, a resposta
                  revelará as falhas.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label='Rigor Analítico: Qual foi uma "ideia brilhante" ou campanha que você adorava, mas acabou cancelando/desistindo – e por que, a partir dos dados?'
              id="q3_4"
              value={formData.q3_4}
              onChange={value => handleFieldChange('q3_4', value)}
              placeholder="Registre o exemplo e as razões da desistência..."
              error={errors.q3_4}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Você quer ver se o líder tem maturidade e rigor para{' '}
                  <strong>matar campanhas de estimação</strong> ou projetos que não fecham o CAC/LTV,
                  demonstrando que decide com base em fatos e não em emoção.
                </p>
              </InfoBlock>
            </QuestionBlock>
          </FormSection>

          {/* Section 4: Potencial e Curiosidade */}
          <FormSection
            number="Bloco 04"
            title="Avaliando o Potencial e Curiosidade (AI-First)"
          >
            <InfoBlock title="Contexto:">
              <p>
                O marketing moderno exige adoção de novas tecnologias (especialmente Inteligência
                Artificial). O candidato precisa ser <strong>"Future-ready"</strong>.
              </p>
            </InfoBlock>

            <QuestionBlock
              label="Proficiência em Inovação: Como você está aplicando, na prática, ferramentas de Inteligência Artificial (GenAI, análise preditiva) no seu dia a dia ou na operação do seu time de marketing hoje?"
              id="q4_1"
              value={formData.q4_1}
              onChange={value => handleFieldChange('q4_1', value)}
              placeholder="Registre o tema e a profundidade do interesse..."
              error={errors.q4_1}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Se o candidato fala de IA apenas de forma teórica ou
                  superficial, ele está <strong>obsoleto</strong>. Você busca evidências de automação
                  de processos, escala na geração de conteúdo ou ganho de eficiência real (ROI)
                  através da IA.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label="Referências de Crescimento: Em quem ou em quais marcas você se inspira na sua linha de trabalho para estratégias de Growth e MarTech, e por quê?"
              id="q4_2"
              value={formData.q4_2}
              onChange={value => handleFieldChange('q4_2', value)}
              placeholder="Registre as referências e motivações..."
              error={errors.q4_2}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Demonstra de onde o candidato consome conhecimento e se
                  ele está acompanhando{' '}
                  <strong>tendências reais de negócios</strong> em vez de apenas estéticas de marca.
                </p>
              </InfoBlock>
            </QuestionBlock>

            <QuestionBlock
              label="Gestão de Stakeholders: Como você reage e o que você faz quando a alta liderança (CEO/Conselho) discorda frontalmente da sua estratégia de marketing proposta?"
              id="q4_3"
              value={formData.q4_3}
              onChange={value => handleFieldChange('q4_3', value)}
              placeholder="Registre a resposta sobre receptividade a desafios..."
              error={errors.q4_3}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Avalia a inteligência emocional e a capacidade de
                  persuasão. Um A-Player não briga nem cede cegamente; ele{' '}
                  <strong>defende a estratégia usando dados e testes de mercado</strong> para provar
                  seu ponto.
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
                Esta pergunta ajuda a entender onde o candidato pode falhar e como ele lida com a
                realidade.
              </p>
            </InfoBlock>

            <QuestionBlock
              label="Se este trabalho não desse certo e eu tivesse que te demitir em 6 meses porque a máquina de aquisição não tracionou ou os silos entre Marketing e Vendas/Tech não caíram, qual seria o motivo mais provável de você ter falhado aqui?"
              id="q6_1"
              value={formData.q6_1}
              onChange={value => handleFieldChange('q6_1', value)}
              placeholder="Registre a resposta e avalie a autoconsciência..."
              error={errors.q6_1}
            >
              <InfoBlock>
                <p>
                  <strong>Por quê:</strong> Exige alta autoconsciência. Um verdadeiro líder de
                  marketing reconhecerá gargalos reais de execução (ex:{' '}
                  <em>"Talvez eu tenha focado muito na marca antes de arrumar o CRM"</em>, ou{' '}
                  <em>
                    "Talvez eu não tenha conseguido alinhar a linguagem do meu time criativo com o
                    rigor do time de dados"
                  </em>
                  ). Respostas genéricas mostram que o candidato ainda está no{' '}
                  <strong>"teatro" da entrevista</strong>.
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
