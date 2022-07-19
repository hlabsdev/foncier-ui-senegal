import { Process } from '@app/core/models/process.model';

export interface ProcessStatistics {
  '@class': string;
  definition: Process;
  failedJobs: number;
  id: string;
  incidents: { incidentType: string, incidentCount: Number };
  instances: number;
}
