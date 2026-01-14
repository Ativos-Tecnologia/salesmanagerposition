import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { submitScreeningForm, getScreeningForm } from '../service/api';
import { FormSection } from '../components/form-interview/FormSection';
import { InfoBlock } from '../components/form-interview/InfoBlock';
import { QuestionBlock } from '../components/form-interview/QuestionBlock';
import { Button } from '../components/ui/button';

interface ScreeningFormData {
  question1: string; // Abertura
  question2: string; // Placar
  question3: string; // Playbook
  question4: string; // Objetivos
  question5: string; // Logística
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

  // Buscar dados existentes do formulário
  useEffect(() => {
    // Não recarregar dados se já teve sucesso
    if (showSuccessModal) return;

    const loadExistingData = async () => {
      if (id && user) {
        setIsLoadingData(true);
        try {
          // Primeiro, tentar carregar do localStorage
          const storageKey = `screening-draft-${id}`;
          const savedDraft = localStorage.getItem(storageKey);

          if (savedDraft) {
            const draftData = JSON.parse(savedDraft);
            setFormData(draftData);
          }

          // Depois, buscar dados da API (se existirem, sobrescreverão o draft)
          const result = await getScreeningForm(id);
          if (result.success && result.data?.screening_data) {
            setFormData(result.data.screening_data);
            // Limpar o draft se já existe na API
            localStorage.removeItem(storageKey);
          }
        } catch (error) {
          console.error(
            'Nenhum dado de triagem encontrado ou erro ao carregar:',
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
      await submitScreeningForm(id, formData);

      // Limpar o rascunho do localStorage após envio bem-sucedido
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
            A triagem inicial não é uma conversa de "conhecimento mútuo"
            amigável, mas sim um filtro de alta resistência projetado para
            eliminar 80-90% dos candidatos em apenas 15 a 20 minutos. A
            eficiência máxima é alcançada através da{' '}
            <strong>mentalidade "Race to No"</strong>: seu objetivo é encontrar
            um motivo para desqualificar o candidato o mais rápido possível,
            protegendo seu tempo para os verdadeiros A-Players.
          </p>
        </header>

        {/* Main Form */}
        <div className="bg-white border border-[#e0e7ef] rounded p-12 mb-10">
          {/* Section 1: Abertura */}
          <FormSection
            number="Pergunta 01"
            title="Abertura: O Filtro de Expectativas"
            subtitle="60-90 segundos"
          >
            <InfoBlock title="O que fazer:">
              <p>
                Explique a missão da Ativos e o problema que a vaga resolve
                (exemplo: "Construir nossa máquina de vendas do zero").
              </p>
            </InfoBlock>

            <InfoBlock title="O Motivo:">
              <p>
                <strong>Alinhamento de Propósito.</strong> A-Players buscam
                missões desafiadoras. Se a resposta for genérica ("preciso de um
                emprego"), você já tem um sinal de alerta. O objetivo é ver se
                ele se "apaixona" pelo problema técnico ou pela visão da
                empresa.
              </p>
            </InfoBlock>

            <QuestionBlock
              label="Por que você está aqui hoje?"
              id="question1"
              value={formData.question1}
              onChange={value => handleFieldChange('question1', value)}
              error={errors.question1}
            />
          </FormSection>

          {/* Section 2: O Placar */}
          <FormSection number="Pergunta 02" title="O Placar (Resultados Reais)">
            <InfoBlock title="O Motivo:">
              <p>
                <strong>Verificação de Impacto.</strong> A-Players têm uma
                relação íntima com seus números (taxas de conversão, CAC,
                pipeline). Se o candidato hesitar ou der respostas vagas, ele
                provavelmente é um "falador" (B ou C-Player). A eficiência aqui
                é identificar se ele entende que performance é o que importa,
                não apenas atividades.
              </p>
            </InfoBlock>

            <QuestionBlock
              label="Nos seus últimos desafios, quais resultados você entregou? Tem como você me dar uma noção de números?"
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
            title="O Playbook (Operação Diária)"
          >
            <InfoBlock title="O Motivo:">
              <p>
                <strong>Consistência e Método.</strong> Resultados sem processo
                são sorte. Este ponto avalia se o candidato tem disciplina
                operacional e se trabalha com intenção ou apenas reage a
                incêndios. Para a Ativos, que busca estruturar processos, alguém
                que não sabe descrever seu próprio método não servirá.
              </p>
            </InfoBlock>

            <QuestionBlock
              label="Como é uma semana típica na sua função atual/passada?"
              id="question3"
              value={formData.question3}
              onChange={value => handleFieldChange('question3', value)}
              placeholder="Registre a descrição da rotina operacional do candidato..."
              error={errors.question3}
            />
          </FormSection>

          {/* Section 4: Objetivos e Fit */}
          <FormSection
            number="Pergunta 04"
            title='Objetivos e "Fit" de Carreira'
          >
            <InfoBlock title="O Motivo:">
              <p>
                <strong>Previsibilidade de Retenção.</strong> Se o plano dele
                não cabe na Ativos, a contratação será um desperdício de
                recursos a médio prazo.
              </p>
            </InfoBlock>

            <QuestionBlock
              label="Quais seus objetivos para os próximos 5 anos e como esta vaga te ajuda?"
              id="question4"
              value={formData.question4}
              onChange={value => handleFieldChange('question4', value)}
              placeholder="Registre os objetivos de carreira e alinhamento com a vaga..."
              error={errors.question4}
            />
          </FormSection>

          {/* Section 5: Logística */}
          <FormSection number="Pergunta 05" title="Logística">
            <InfoBlock title="O Motivo:">
              <p>
                <strong>Eficiência Operacional Total.</strong> Nada é menos
                eficiente do que gastar 4 horas em uma entrevista técnica
                profunda para descobrir no final que o candidato custa o dobro
                do seu orçamento. Acerte o "ingresso para o jogo" agora.
              </p>
            </InfoBlock>

            <QuestionBlock
              label="Você compreende que essa vaga exige dedicação exclusiva e que é totalmente presencial?"
              id="question5"
              value={formData.question5}
              onChange={value => handleFieldChange('question5', value)}
              placeholder="Registre a resposta do candidato sobre disponibilidade e regime presencial..."
              error={errors.question5}
            />
          </FormSection>

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
