import type { AnalyticsFilter, AggregationResult, TimeGranularity } from '../types';
import { aggregateByGranularity, applyDateFilter, computeSummary } from '../aggregations';

interface WarehouseFact {
  id: string;
  companyId: string;
  metric: string;
  value: number;
  date: Date;
  dimensions: Record<string, string>;
}

class DataWarehouse {
  private facts: WarehouseFact[] = [];

  ingest(fact: WarehouseFact): void {
    this.facts.push(fact);
  }

  ingestBatch(facts: WarehouseFact[]): void {
    this.facts.push(...facts);
  }

  query(metric: string, filter?: AnalyticsFilter): WarehouseFact[] {
    let result = this.facts.filter((f) => f.metric === metric);
    if (filter) {
      result = applyDateFilter(
        result.map((f) => ({ ...f, date: f.date })),
        { dateStart: filter.dateStart, dateEnd: filter.dateEnd },
      );
    }
    return result;
  }

  aggregate(metric: string, granularity: TimeGranularity, filter?: AnalyticsFilter): AggregationResult[] {
    const data = this.query(metric, filter).map((f) => ({ date: f.date, value: f.value }));
    return aggregateByGranularity(data, granularity);
  }

  getSummary(metric: string, filter?: AnalyticsFilter) {
    const values = this.query(metric, filter).map((f) => f.value);
    return computeSummary(values);
  }

  getAvailableMetrics(): string[] {
    return [...new Set(this.facts.map((f) => f.metric))];
  }

  getDateRange(metric: string): { min: Date; max: Date } | null {
    const data = this.facts.filter((f) => f.metric === metric);
    if (data.length === 0) return null;
    const dates = data.map((f) => f.date);
    return { min: new Date(Math.min(...dates.map(Number))), max: new Date(Math.max(...dates.map(Number))) };
  }

  clear(): void {
    this.facts = [];
  }

  count(): number {
    return this.facts.length;
  }
}

export const dataWarehouse = new DataWarehouse();

export type { WarehouseFact };
