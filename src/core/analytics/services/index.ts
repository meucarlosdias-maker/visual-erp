import type { AnalyticsFilter, MetricValue, TimeSeries, KpiCard, AnalyticsSummary, MetricCategory } from '../types';
import { getAllMetrics, getMetric, calculateChange, calculateAchievement } from '../metrics';
import { dataWarehouse } from '../warehouse';
import { computeSummary } from '../aggregations';
import { analyticsCache } from '../cache';

class AnalyticsServiceCore {
  async getKpis(companyId: string, category?: MetricCategory): Promise<KpiCard[]> {
    const cacheKey = `kpis:${companyId}:${category ?? 'all'}`;
    const cached = analyticsCache.get<KpiCard[]>(cacheKey);
    if (cached) return cached;

    const metrics = category ? getAllMetrics().filter((m) => m.category === category) : getAllMetrics();
    const cards: KpiCard[] = [];

    for (const metric of metrics) {
      const current = dataWarehouse.getSummary(metric.id, { dateStart: new Date(Date.now() - 30 * 86400000).toISOString() });
      const previous = dataWarehouse.getSummary(metric.id, { dateStart: new Date(Date.now() - 60 * 86400000).toISOString(), dateEnd: new Date(Date.now() - 30 * 86400000).toISOString() });

      const value = current.total;
      const prevValue = previous.total;
      const { change, changePercentage } = calculateChange(value, prevValue);
      const achievement = metric.target ? calculateAchievement(value, metric.target) : null;

      cards.push({
        id: metric.id,
        title: metric.name,
        value,
        previousValue: prevValue,
        change,
        changeType: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'stable',
        unit: metric.unit,
        target: metric.target ?? null,
        achievement,
        category: metric.category,
        icon: getMetricIcon(metric.category),
        higherIsBetter: metric.higherIsBetter,
      });
    }

    analyticsCache.set(cacheKey, cards, 300000);
    return cards;
  }

  async getTimeSeries(companyId: string, metric: string, filter?: AnalyticsFilter): Promise<TimeSeries> {
    const data = dataWarehouse.aggregate(metric, filter?.granularity ?? 'month', filter);
    const values = data.map((d) => d.value);
    const summary = computeSummary(values);

    return {
      metric,
      label: getMetric(metric)?.name ?? metric,
      data: data.map((d) => ({ date: d.period, value: d.value })),
      total: summary.total,
      average: summary.average,
      min: summary.min,
      max: summary.max,
    };
  }

  async getSummary(companyId: string): Promise<AnalyticsSummary> {
    const kpis = await this.getKpis(companyId);
    return {
      totalDashboards: 0,
      totalReports: 0,
      totalMetrics: getAllMetrics().length,
      lastUpdated: new Date(),
      topMetrics: kpis.slice(0, 5).map((k) => ({
        metric: k.id,
        value: k.value,
        label: k.title,
        unit: k.unit,
        category: k.category,
        referenceDate: new Date(),
      })),
    };
  }
}

function getMetricIcon(category: MetricCategory): string {
  const icons: Record<MetricCategory, string> = {
    commercial: 'DollarSign',
    crm: 'Users',
    projects: 'FolderKanban',
    production: 'HardHat',
    financial: 'TrendingUp',
    installation: 'Truck',
    team: 'UserCog',
    clients: 'Building2',
    general: 'BarChart3',
  };
  return icons[category] ?? 'BarChart3';
}

export const analyticsServiceCore = new AnalyticsServiceCore();
export { type AnalyticsFilter };
