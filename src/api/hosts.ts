import { api } from "./config";

export interface Host {
  name: string;
  id: number;
  user_id: number;
}

export interface HostCreate {
  name: string;
}

export interface HostUpdate {
  name?: string;
}

export const getHosts = async (skip = 0, limit = 100) => {
  const response = await api.get<Host[]>("/hosts/", {
    params: { skip, limit },
  });
  return response.data;
};

export const getHost = async (hostId: string) => {
  const response = await api.get<Host>(`/hosts/${hostId}`);
  return response.data;
};

export const createHost = async (hostData: HostCreate) => {
  const response = await api.post<Host>("/hosts/", hostData);
  return response.data;
};

export const updateHost = async (hostId: string, hostData: HostUpdate) => {
  const response = await api.put<Host>(`/hosts/${hostId}`, hostData);
  return response.data;
};

export const deleteHost = async (hostId: string) => {
  const response = await api.delete<Host>(`/hosts/${hostId}`);
  return response.data;
};

export const getDefaultHost = async () => {
  const response = await api.get<Host>("/hosts/default");
  return response.data;
};
