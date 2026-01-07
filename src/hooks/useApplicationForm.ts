import { useState, useEffect, useCallback } from 'react';
import type { ApplicationFormData, OutcomeResponse, CompetencyResponse } from '../types/application';

const STORAGE_KEY = 'ativos_application_form';
const TOTAL_STEPS = 5;

const initialFormData: ApplicationFormData = {
  step0: { accepted: false },
  step1: { accepted: false, missionReflection: '' },
  step2: {
    outcomes: {
      playbook: { accepted: false, comment: '' },
      teamRestructure: { accepted: false, comment: '' },
      operationalDiscipline: { accepted: false, comment: '' },
      highPerformance: { accepted: false, comment: '' },
      barRaiser: { accepted: false, comment: '' },
      accountability: { accepted: false, comment: '' },
      conversion: { accepted: false, comment: '' },
      ai: { accepted: false, comment: '' },
    },
  },
  step3: {
    competencies: [],
  },
  step4: {
    personalInfo: {
      fullName: '',
      cpf: '',
      birthDate: '',
      city: '',
      state: '',
    },
    contact: {
      email: '',
      whatsapp: '',
    },
    salaryExpectation: '',
    finalNotes: '',
    files: [],
  },
  currentStep: 0,
};

export function useApplicationForm() {
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega dados do localStorage na inicialização
  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setFormData({ ...initialFormData, ...parsed, step4: { ...initialFormData.step4, ...parsed.step4, files: [] } });
        } catch (error) {
          console.error('Erro ao carregar dados do localStorage:', error);
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Salva dados no localStorage sempre que houver mudança
  useEffect(() => {
    if (!isLoading) {
      const dataToSave = { ...formData };
      // Remove arquivos do localStorage (apenas metadados serão salvos)
      const fileNames = formData.step4.files.map((f: File) => f.name);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...dataToSave, step4: { ...dataToSave.step4, files: fileNames } }));
    }
  }, [formData, isLoading]);

  const updateStep0 = useCallback((accepted: boolean) => {
    setFormData((prev) => ({
      ...prev,
      step0: { accepted },
    }));
  }, []);

  const updateStep1 = useCallback((data: { accepted?: boolean; missionReflection?: string }) => {
    setFormData((prev: ApplicationFormData) => ({
      ...prev,
      step1: {
        ...prev.step1,
        ...data,
      },
    }));
  }, []);

  const updateOutcome = useCallback((outcomeKey: keyof ApplicationFormData['step2']['outcomes'], data: Partial<OutcomeResponse>) => {
    setFormData((prev: ApplicationFormData) => ({
      ...prev,
      step2: {
        outcomes: {
          ...prev.step2.outcomes,
          [outcomeKey]: {
            ...prev.step2.outcomes[outcomeKey],
            ...data,
          },
        },
      },
    }));
  }, []);

  const updateCompetency = useCallback((index: number, data: Partial<CompetencyResponse>) => {
    setFormData((prev: ApplicationFormData) => {
      const competencies = [...prev.step3.competencies];
      if (competencies[index]) {
        competencies[index] = { ...competencies[index], ...data };
      } else {
        competencies[index] = { name: '', rating: '', example: '', ...data };
      }
      return {
        ...prev,
        step3: { competencies },
      };
    });
  }, []);

  const updateStep4 = useCallback((data: Partial<ApplicationFormData['step4']>) => {
    setFormData((prev: ApplicationFormData) => ({
      ...prev,
      step4: {
        ...prev.step4,
        ...data,
        personalInfo: data.personalInfo ? { ...prev.step4.personalInfo, ...data.personalInfo } : prev.step4.personalInfo,
        contact: data.contact ? { ...prev.step4.contact, ...data.contact } : prev.step4.contact,
      },
    }));
  }, []);

  const nextStep = useCallback(() => {
    setFormData((prev: ApplicationFormData) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, TOTAL_STEPS),
    }));
  }, []);

  const previousStep = useCallback(() => {
    setFormData((prev: ApplicationFormData) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  }, []);

  const clearForm = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(initialFormData);
  }, []);

  // Função genérica para submissão (preparada para API)
  const submitApplication = useCallback(async () => {
    try {
      console.log('Dados da aplicação:', formData);
      
      // Aqui você integrará com sua API
      // const response = await fetch('/api/application', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      return { success: true, data: formData };
    } catch (error) {
      console.error('Erro ao enviar aplicação:', error);
      return { success: false, error };
    }
  }, [formData]);

  return {
    formData,
    isLoading,
    updateStep0,
    updateStep1,
    updateOutcome,
    updateCompetency,
    updateStep4,
    nextStep,
    previousStep,
    clearForm,
    submitApplication,
    totalSteps: TOTAL_STEPS,
  };
}

