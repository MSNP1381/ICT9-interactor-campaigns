import { api } from "./config";

export interface User {
  id: number;
  email: string;
}

export interface UserCreate {
  email: string;
  password: string;
}

export interface UserUpdate {
  email?: string;
  password?: string;
}

export const getUsers = async (skip = 0, limit = 100) => {
  const response = await api.get<User[]>("/users/users/", {
    params: { skip, limit },
  });
  return response.data;
};

export const getUser = async (userId: number) => {
  const response = await api.get<User>(`/users/users/${userId}`);
  return response.data;
};

export const createUser = async (userData: UserCreate) => {
  const response = await api.post<User>("/users/users/", userData);
  return response.data;
};

export const updateUser = async (userId: number, userData: UserUpdate) => {
  const response = await api.put<User>(`/users/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId: number) => {
  const response = await api.delete<User>(`/users/users/${userId}`);
  return response.data;
};
