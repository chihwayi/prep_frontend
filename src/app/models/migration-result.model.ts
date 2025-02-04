export interface MigrationResult {
  successful: boolean;
  message: string;
  patientsProcessed: number;
  visitsProcessed: number;
  errors?: string[];
  }