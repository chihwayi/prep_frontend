import { Visit } from "./visit.model";

export enum Sex {
    Male = 'Male',
    Female = 'Female'
}

export enum PopulationType {
    SW = 'SW',
    MSM = 'MSM',
    TG = 'TG',
    AGYW = 'AGYW',
    OTHER = 'Other',
    GEN_POP = 'Gen Pop',
    SERO_DISCORDANT = 'Sero_discordant'
  }
  
export interface Patient {
    patientId?: string;
    prepNumber: string;
    dob: Date;
    sex: Sex;
    populationType: PopulationType;
    createdAt?: Date;
    visits: Visit[];
  }