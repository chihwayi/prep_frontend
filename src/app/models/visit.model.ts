import { Patient } from './patient.model';

export enum CurrentStatus {
    PX = 'PX', D = 'D', AE = 'AE', AED = 'AED', MV = 'MV', SWD = 'SWD'
  }
  
  export enum AdverseEventSeverity {
    MILD = 'MILD',
    MODERATE = 'MODERATE',
    SEVERE = 'SEVERE'
  }
  
  export enum PrepExperienceStatus {
    NAIVE = 'NAIVE',
    TRANSITIONING_OP = 'TRANSITIONING_OP',
    TRANSITIONING_DVR = 'TRANSITIONING_DVR',
    CAB_LA_FOLLOWUP_VISIT = 'CAB_LA_FOLLOWUP_VISIT'
  }
  
  export interface Visit {
    visitId?: string;
    patient: Patient;
    injectionDate: Date;
    typeOfInjection: string;
    currentStatus: CurrentStatus;
    discontinuationReason?: string;
    adverseEventSeverity?: AdverseEventSeverity;
    prepExperienceStatus: PrepExperienceStatus;
  }