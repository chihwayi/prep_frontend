export interface MigrationResult {
  successful: boolean;
  errors?: string[];
  patientsProcessed?: number;
  visitsProcessed?: number;
  }