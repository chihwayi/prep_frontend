export interface MissingFollowUpDTO {
    patientId: string;
    sex: string;
    populationType: string;
    lastInjectionDate: Date;
    daysSinceLastInjection: number;
  }