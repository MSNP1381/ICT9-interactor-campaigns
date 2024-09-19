import { api } from "./config";

export interface WidgetTemplate {
  id: string;
  name: string;
  description?: string;
  type: string;
  template: string;
  config: any;
  host_id: string;
}


export interface GenAi {
  prompt: string;
  template: string;
  config: any;
}

export const getWidgetTemplates = async () => {
  const response = await api.get<WidgetTemplate[]>("/widget-templates/");
  return response.data;
};

export const getWidgetTemplate = async (templateId: string) => {
  const response = await api.get<WidgetTemplate>(
    `/widget-templates/${templateId}/`,
  );
  return response.data;
};

export const createWidgetTemplate = async (
  templateData: Omit<WidgetTemplate, "id">,
) => {
  const response = await api.post<WidgetTemplate>(
    "/widget-templates/",
    templateData,
  );
  return response.data;
};
export const createGenAIReq = async (
  templateData:any,
) => {
  const response = await api.post<GenAi>(
    "/widget-templates/generate_template_with_ai",
    templateData,
  );
  return response.data;
};

export const updateWidgetTemplate = async (
  templateId: string,
  templateData: Partial<Omit<WidgetTemplate, "id">>,
) => {
  const response = await api.put<WidgetTemplate>(
    `/widget-templates/${templateId}/`,
    templateData,
  );
  return response.data;
};
