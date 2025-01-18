export interface DashboardStats {
    totalPatients: number;
    activePatients: number;
    visitsThisMonth: number;
    statusDistribution: { [key: string]: number };
    populationTypeDistribution: { [key: string]: number };
  }