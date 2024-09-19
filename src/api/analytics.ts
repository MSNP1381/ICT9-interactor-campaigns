import { api } from "./config";

export interface CampaignAnalytics {
  totalInteractions: number;
  uniqueUsers: number;
  widgetInteractions: { [key: string]: number };
  dailyInteractions: { date: string; interactions: number }[];
  conversionRate: number;
  averageEngagementTime: number;
  deviceBreakdown: { device: string; percentage: number }[];
  topPerformingWidgets: { name: string; interactions: number }[];
}

export const getCampaignAnalytics = async (campaignId: string): Promise<CampaignAnalytics> => {
  const response = await api.get<CampaignAnalytics>(`/campaigns/${campaignId}/analytics`);
  return response.data;
};