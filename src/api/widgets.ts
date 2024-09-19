import { api } from "./config";

export interface Widget {
  id: string;
  name: string;
  description?: string;
  body?: string;
  aggregator_config?: string;
  widget_template_id: string;
  host_id: string;
  campaign_id: string; // Add this line
}

export interface WidgetCreate {
  name: string;
  description?: string;
  host_id: string;
  config: string;
  widget_template_id: string;
  campaign_id: string; // Add this line
}

export interface WidgetUpdate {
  name?: string;
  description?: string;
  body?: string;
  aggregator_config?: string;
}

export const getWidgets = async (skip = 0, limit = 100) => {
  const response = await api.get<Widget[]>("/widgets/", {
    params: { skip, limit },
  });
  return response.data;
};

export const getWidget = async (widgetId: string) => {
  const response = await api.get<Widget>(`/widgets/${widgetId}`);
  return response.data;
};

export const createWidget = async (widgetData: WidgetCreate) => {
  const response = await api.post<Widget>("/widgets/", widgetData);
  return response.data;
};

export const updateWidget = async (
  widgetId: string,
  widgetData: WidgetUpdate,
) => {
  const response = await api.put<Widget>(`/widgets/${widgetId}`, widgetData);
  return response.data;
};

export const deleteWidget = async (widgetId: string) => {
  const response = await api.delete<Widget>(`/widgets/${widgetId}`);
  return response.data;
};

export const getWidgetHtml = async (widgetId: string) => {
  const response = await api.get<string>(`/widgets/${widgetId}/html`);
  return response.data;
};
