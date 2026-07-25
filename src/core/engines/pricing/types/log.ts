export interface PricingLogEntry {
  id: string;
  timestamp: Date;
  executionTimeMs: number;
  serviceId: string;
  componentsExecuted: string[];
  errors: string[];
  warnings: string[];
  success: boolean;
}

export type PricingLog = PricingLogEntry[];
