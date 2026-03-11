import { useState, useEffect, useCallback } from 'react';
import { submitApplication } from '../service/api';
import type {
  ApplicationFormData,
  OutcomeResponse,
  CompetencyResponse,
} from '../types/application';

const STORAGE_KEY = 'ativos_application_form_v2';
const TOTAL_STEPS = 4;

const initialFormData: ApplicationFormData = {
  step0: {
    accepted: false,
    missionMotivation: '',
  },
  step1: {
    outcomes: [],
  },
  step2: {
    competencies: [],
  },
  step3: {
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
    githubLink: '',
    salaryExpectation: '',
    availability: '',
    finalNotes: '',
    files: [],
  },
  currentStep: 0,
};

export function useApplicationForm() {
  const [formData, setFormData] =
    useState<ApplicationFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setFormData({
            ...initialFormData,
            ...parsed,
            step3: {
              ...initialFormData.step3,
              ...parsed.step3,
              files: [],
            },
          });
        } catch (error) {
          console.error('Erro ao carregar dados do localStorage:', error);
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const dataToSave = {
        ...formData,
        step3: {
          ...formData.step3,
          files: [],
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [formData, isLoading]);

  const updateStep0 = useCallback(
    (data: { accepted?: boolean; missionMotivation?: string }) => {
      setFormData(prev => ({
        ...prev,
        step0: { ...prev.step0, ...data },
      }));
    },
    []
  );

  const updateOutcome = useCallback(
    (index: number, data: Partial<OutcomeResponse>) => {
      setFormData(prev => {
        const outcomes = [...prev.step1.outcomes];
        const existing = outcomes[index] || { accepted: false, comment: '' };
        outcomes[index] = { ...existing, ...data };
        return { ...prev, step1: { outcomes } };
      });
    },
    []
  );

  const updateCompetency = useCallback(
    (index: number, data: Partial<CompetencyResponse>) => {
      setFormData(prev => {
        const competencies = [...prev.step2.competencies];
        if (competencies[index]) {
          competencies[index] = { ...competencies[index], ...data };
        } else {
          competencies[index] = { name: '', rating: '', example: '', ...data };
        }
        return { ...prev, step2: { competencies } };
      });
    },
    []
  );

  const updateStep3 = useCallback(
    (data: Partial<ApplicationFormData['step3']>) => {
      setFormData(prev => ({
        ...prev,
        step3: {
          ...prev.step3,
          ...data,
          personalInfo: data.personalInfo
            ? { ...prev.step3.personalInfo, ...data.personalInfo }
            : prev.step3.personalInfo,
          contact: data.contact
            ? { ...prev.step3.contact, ...data.contact }
            : prev.step3.contact,
        },
      }));
    },
    []
  );

  const nextStep = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, TOTAL_STEPS),
    }));
  }, []);

  const previousStep = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  }, []);

  const clearForm = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(initialFormData);
  }, []);

  const submitApplicationData = useCallback(async () => {
    return await submitApplication(formData);
  }, [formData]);

  return {
    formData,
    isLoading,
    updateStep0,
    updateOutcome,
    updateCompetency,
    updateStep3,
    nextStep,
    previousStep,
    clearForm,
    submitApplication: submitApplicationData,
    totalSteps: TOTAL_STEPS,
  };
}
