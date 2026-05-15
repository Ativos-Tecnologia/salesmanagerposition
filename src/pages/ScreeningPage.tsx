import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { submitScreeningForm, getScreeningForm } from '../service/api';
import { FormSection } from '../components/form-interview/FormSection';
import { InfoBlock } from '../components/form-interview/InfoBlock';
import { QuestionBlock } from '../components/form-interview/QuestionBlock';
import { Button } from '../components/ui/button';

interface ScreeningFormData {
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  question5: string;
}

export function ScreeningPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [formData, setFormData] = useState<ScreeningFormData>({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
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
    if (showSuccessModal) return;

    const loadExistingData = async () => {
      if (id && user) {
        setIsLoadingData(true);
        try {
          const storageKey = `screening-draft-${id}`;
          const savedDraft = localStorage.getItem(storageKey);

          if (savedDraft) {
            const draftData = JSON.parse(savedDraft);
            setFormData(draftData);
          }

          const result = await getScreeningForm(id);
          if (result.success && result.data?.screening_data) {
            setFormData(result.data.screening_data);
            localStorage.removeItem(storageKey);
          }
        } catch (error) {
          console.error('Nenhum dado de triagem encontrado ou erro ao carregar:', error);
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
      const storageKey = `screening-draft-${id}`;
      localStorage.setItem(storageKey, JSON.stringify(formData));
    }
  }, [formData, id, showSuccessModal, isInitialized]);

  const handleFieldChange = (field: keyof ScreeningFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      if (!formData[key as keyof ScreeningFormData].trim()) {
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
      await submitScreeningForm(id, formData);
      const storageKey = `screening-draft-${id}`;
      localStorage.removeItem(storageKey);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Erro ao enviar triagem:', error);
      alert('Erro ao salvar a triagem. Tente novamente.');
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
            Triagem Inicial
          </h1>
          <p className="text-[24px] font-medium text-[#546e7a] mb-6">
            Race to No – Filtro de Alta Resistência
          </p>
          <p className="max-w-175 mx-auto text-[18px] text-[#0a0e27] leading-relaxed">
            Esta triagem é um filtro de alta resistência projetado para eliminar 80–90% dos candidatos
            em 15 a 20 minutos. O objetivo é identificar rapidamente o{' '}
            <strong>"teatro de marketing"</strong> (candidatos que falam muito sobre estética e
            campanhas, mas não dominam os números) e proteger o tempo para avaliar os verdadeiros
            líderes focados em crescimento, sob a{' '}
            <strong>mentalidade "Race to No"</strong>.
          </p>
        </header>

        {/* Main Form */}
        <div className="bg-white border border-[#e0e7ef] rounded p-12 mb-10">
          {/* Section 1: Abertura */}
          <FormSection
            number="Pergunta 01"
            title="Abertura: O Filtro de Expectativas e Visão de Negócios"
            subtitle="60-90 segundos"
          >
            <InfoBlock title="O que fazer:">
              <p>
                Explique o momento atual da empresa. Ex:{' '}
                <em>
                  "Estamos no estágio de tracionar vendas e precisamos transformar o marketing em um
                  motor de receita, adotando uma cultura AI-First."
                </em>
              </p>
            </InfoBlock>

            <InfoBlock title="O Motivo:">
              <p>
                <strong>Alinhamento de Propósito.</strong> A-Players buscam problemas complexos e
                missões transformadoras. O objetivo é ver se o candidato pensa como um executivo de
                negócios ou apenas como um <em>"guardião da marca"</em> tático.
              </p>
            </InfoBlock>

            <QuestionBlock
              label="Dada a nossa missão atual, por que você está aqui hoje e qual é o problema central que você acha que um Diretor de Marketing deve resolver na nossa operação?"
              id="question1"
              value={formData.question1}
              onChange={value => handleFieldChange('question1', value)}
              error={errors.question1}
            />
          </FormSection>

          {/* Section 2: O Placar */}
          <FormSection
            number="Pergunta 02"
            title="O Placar (Resultados Financeiros e Métricas Reais)"
          >
            <InfoBlock title="O Motivo:">
              <p>
                <strong>Verificação de Impacto e Fluência Financeira.</strong> A-Players no marketing
                atual são <strong>coproprietários da receita</strong>. Se o candidato focar apenas em{' '}
                <em>"Métricas de Vaidade"</em> (likes, impressões, prêmios) e não souber falar sobre{' '}
                <strong>CAC</strong> (Custo de Aquisição de Cliente), <strong>LTV</strong> (Valor do
                Tempo de Vida) e <strong>Pipeline Gerado</strong>, ele é um{' '}
                <em>"Red Flag: All Brand, No Numbers"</em>.
              </p>
            </InfoBlock>

            <QuestionBlock
              label="Nos seus últimos desafios, quais foram as estratégias de Go-To-Market que você desenhou e quais resultados financeiros quantificáveis você entregou? Como você prova o ROI das suas campanhas para o CEO/CFO?"
              id="question2"
              value={formData.question2}
              onChange={value => handleFieldChange('question2', value)}
              placeholder="Registre a resposta do candidato com foco em números concretos..."
              error={errors.question2}
            />
          </FormSection>

          {/* Section 3: O Playbook */}
          <FormSection
            number="Pergunta 03"
            title="O Playbook (Tecnologia, Inovação e Fim dos Silos)"
          >
            <InfoBlock title="O Motivo:">
              <p>
                <strong>Método, MarTech e AI-First.</strong> Resultados consistentes vêm de processos
                estruturados e uso inteligente de tecnologia. O líder moderno de marketing precisa ser
                um <strong>parceiro direto do CTO/CIO</strong> para unificar dados e não pode operar
                em silos. Deve demonstrar agilidade e proficiência para liderar a adoção de{' '}
                <strong>Inteligência Artificial</strong> e ganhar escala.
              </p>
            </InfoBlock>

            <QuestionBlock
              label='Como você estrutura a sua "stack" de marketing (tecnologias, dados e IA) no dia a dia? Como você garante o alinhamento interfuncional, especialmente a colaboração com Vendas e Tecnologia?'
              id="question3"
              value={formData.question3}
              onChange={value => handleFieldChange('question3', value)}
              placeholder="Registre a descrição da rotina operacional do candidato..."
              error={errors.question3}
            />
          </FormSection>

          {/* Section 4: Ownership e Resiliência */}
          <FormSection
            number="Pergunta 04"
            title="Ownership e Resiliência (O Filtro do Fracasso)"
          >
            <InfoBlock title="O Motivo:">
              <p>
                <strong>Autoconsciência e Accountability.</strong> Diretores de Marketing operam em
                realidades imperfeitas. Se o candidato terceirizar a culpa de uma falha para o CEO,
                para o produto ou para o mercado, é um forte sinal de alerta. A-Players mostram
                vulnerabilidade, analisam a falha com base em dados e extraem aprendizados acionáveis.
                Cuidado também com executivos de saídas rápidas (pulos de 12–18 meses), que abandonam
                antes de verem o resultado real de suas estratégias.
              </p>
            </InfoBlock>

            <QuestionBlock
              label="Conte-me sobre uma campanha ou estratégia de marketing que fracassou sob a sua liderança. Por que falhou e o que você mudou no seu processo após esse aprendizado?"
              id="question4"
              value={formData.question4}
              onChange={value => handleFieldChange('question4', value)}
              placeholder="Registre os objetivos de carreira e alinhamento com a vaga..."
              error={errors.question4}
            />
          </FormSection>

          {/* Section 5: Logística */}
          <FormSection
            number="Pergunta 05"
            title='Logística e "Fit" de Estágio de Crescimento'
          >
            <InfoBlock title="O Motivo:">
              <p>
                <strong>Eficiência Operacional Total.</strong> O perfil do líder de marketing precisa
                casar com o momento da empresa — um <em>"Construtor"</em> para Série A, um{' '}
                <em>"Escalador"</em> para Série B, ou um <em>"Operador Enterprise"</em> para Série
                C/IPO. Além disso, não vale gastar tempo se a remuneração ou o modelo de trabalho não
                estiverem alinhados.
              </p>
            </InfoBlock>

            <QuestionBlock
              label="Pensando no estágio de maturidade atual da nossa empresa, por que você é o líder certo para este momento específico? Você está alinhado(a) com a dedicação, o modelo de trabalho (presencial/híbrido) e a faixa orçamentária para a posição?"
              id="question5"
              value={formData.question5}
              onChange={value => handleFieldChange('question5', value)}
              placeholder="Registre a resposta do candidato sobre disponibilidade e regime presencial..."
              error={errors.question5}
            />
          </FormSection>

          {/* Observação para o Recrutador */}
          <div className="mb-12 p-7 bg-linear-to-br from-[#0a0e27] to-[#1a237e] border-l-4 border-[#00e676] rounded-r">
            <div className="font-['IBM_Plex_Mono',monospace] text-[13px] font-semibold tracking-[2px] text-[#00e676] mb-2 uppercase">
              Observação para o Recrutador
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Sinal final: rigor analítico nos primeiros 5 minutos
            </h3>
            <div className="p-5 bg-white/5 border-l-[3px] border-[#00e676] rounded-r">
              <p className="text-[#e0e0e0] text-[17px] leading-relaxed">
                Preste atenção extra ao <strong className="text-white">rigor analítico</strong> do
                candidato durante os primeiros 5 minutos. No nível de diretoria de marketing, a
                capacidade de responder de forma direta e estruturada (
                <strong className="text-white">método STAR</strong> — Situação, Tarefa, Ação,
                Resultado) é o principal indicador de aprovação para a próxima fase técnica. Se as
                respostas forem teóricas e não baseadas em métricas reais, acione o{' '}
                <em>"Race to No"</em> e encerre.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-12 pt-8 border-t-2 border-[#e0e7ef] text-center">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-12 py-4.5 font-['IBM_Plex_Mono',monospace] text-[15px] font-semibold tracking-[1.5px] uppercase"
            >
              {isSubmitting ? 'Enviando...' : 'Finalizar Triagem'}
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
              Triagem Registrada!
            </h2>
            <p className="text-lg text-[#546e7a] mb-8">
              As respostas foram registradas com sucesso.
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
