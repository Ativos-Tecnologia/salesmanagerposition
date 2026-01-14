export interface PersonalInfo {
  fullName: string;
  cpf: string;
  birthDate: string;
  city: string;
  state: string;
}

export interface ContactInfo {
  email: string;
  whatsapp: string;
}

export interface SocialMedia {
  name: string;
  url: string;
}

export interface OutcomeResponse {
  accepted: boolean;
  comment: string;
}

export interface CompetencyResponse {
  name: string;
  rating: string;
  example: string;
}

export interface ScreeningFormData {
  question1: string; // Abertura
  question2: string; // Placar
  question3: string; // Playbook
  question4: string; // Objetivos
  question5: string; // Logística
}

export interface InterviewFormData {
  currentlyEmployed: boolean;
  q1_1: string; // Contratação
  q1_2: string; // Realizações
  q1_3: string; // Erros
  q1_4: string; // Referências
  q1_5: string; // Motivo saída
  q2_1: string; // Números
  q2_2: string; // Playbook
  q3_1: string; // Ownership
  q3_2: string; // Grit
  q3_3: string; // Trabalho em Equipe
  q3_4: string; // Rigor Analítico
  q4_1: string; // Aprendizado
  q4_2: string; // Inspiração
  q4_3: string; // Receptividade
  q6_1: string; // Risco de demissão
}

export interface ApplicationFormData {
  step0: {
    accepted: boolean;
  };
  step1: {
    accepted: boolean;
    missionReflection: string;
  };
  step2: {
    outcomes: {
      playbook: OutcomeResponse;
      teamRestructure: OutcomeResponse;
      operationalDiscipline: OutcomeResponse;
      highPerformance: OutcomeResponse;
      barRaiser: OutcomeResponse;
      accountability: OutcomeResponse;
      conversion: OutcomeResponse;
      ai: OutcomeResponse;
    };
  };
  step3: {
    competencies: CompetencyResponse[];
  };
  step4: {
    personalInfo: PersonalInfo;
    contact: ContactInfo;
    socialMedia: SocialMedia[];
    salaryExpectation: string;
    finalNotes: string;
    files: File[];
    photo: File | null;
  };
  currentStep: number;
}

