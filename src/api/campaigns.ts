import { api } from "./config";

export interface Campaign {
  id: string;
  name: string;
  host_id: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  type: string;
  widget_id: string;
  script_tag: string;
}

export interface CreateCampaignData {
  name: string;
  host_id: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  type: string;
  widget_id: string;
  script_tag: string;
}

export interface UpdateCampaignData {
  name?: string;
  host_id: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: "draft" | "active" | "expired";
  type?: "email" | "social_media" | "display_ads" | "content_marketing" | "event";
}

export type CampaignUpdate = {
  name: string;
  host_id: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'expired' | undefined;
  type: string;
};

export const getCampaigns = async (skip = 0, limit = 100, host_id?: string) => {
  const response = await api.get<Campaign[]>("/campaigns/", {
    params: { skip, limit, host_id },
  });
  return response.data;
};

export const getCampaign = async (campaignId: string) => {
  const response = await api.get<Campaign>(`/campaigns/${campaignId}`);
  return response.data;
};

export const createCampaign = async (campaignData: CreateCampaignData) => {
  const response = await api.post<Campaign>("/campaigns/", campaignData);
  return response.data;
};

export const updateCampaign = async (campaignId: string, campaignData: UpdateCampaignData) => {
  const response = await api.put<Campaign>(`/campaigns/${campaignId}`, campaignData);
  return response.data;
};

export const deleteCampaign = async (campaignId: string) => {
  await api.delete(`/campaigns/${campaignId}`);
};
