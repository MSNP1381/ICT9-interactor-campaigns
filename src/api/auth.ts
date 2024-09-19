import { api, setAuthToken, removeAuthToken } from "./config";
import { getDefaultHost } from "./hosts";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
}

export const login = async (loginData: LoginData) => {
  const response = await api.post("/users/users/token", loginData);
  setAuthToken(response.data.access_token);

  // Fetch default host
  try {
    const defaultHost = await getDefaultHost();
    localStorage.setItem("defaultHostId", defaultHost.id.toString());
    localStorage.setItem("defaultHostName", defaultHost.name);
  } catch (error) {
    console.error("Failed to fetch default host:", error);
  }

  return response.data;
};

export const register = async (registerData: RegisterData) => {
  const response = await api.post("/users/users/", registerData);
  return response.data;
};

export const logout = () => {
  removeAuthToken();
  localStorage.removeItem("defaultHostId");
  localStorage.removeItem("defaultHostName");
};
