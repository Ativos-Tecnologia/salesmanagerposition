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
    missionAccepted: boolean;
    missionMotivation: string;
  };
  step1: {
    outcomes: OutcomeResponse[];
  };
  step2: {
    competencies: CompetencyResponse[];
  };
  step3: {
    personalInfo: PersonalInfo;
    contact: ContactInfo;
    salaryExpectation: string;
    finalNotes: string;
    files: File[];
  };
  currentStep: number;
}
