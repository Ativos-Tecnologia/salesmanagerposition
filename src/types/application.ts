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

export interface OutcomeResponse {
  accepted: boolean;
  comment: string;
}

export interface CompetencyResponse {
  name: string;
  rating: string;
  example: string;
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
    salaryExpectation: string;
    finalNotes: string;
    files: File[];
  };
  currentStep: number;
}

