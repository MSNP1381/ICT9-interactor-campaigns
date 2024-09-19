import { login, register, logout } from "../auth";
import { api, setAuthToken } from "../config";
import { getDefaultHost } from "../hosts";

jest.mock("../config");
jest.mock("../hosts");

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("login", () => {
    it("should login successfully and set token and default host", async () => {
      const mockLoginResponse = { data: { access_token: "test_token" } };
      const mockDefaultHost = { id: 1, name: "Test Host" };

      (api.post as jest.Mock).mockResolvedValue(mockLoginResponse);
      (getDefaultHost as jest.Mock).mockResolvedValue(mockDefaultHost);

      await login({ email: "test@example.com", password: "password" });

      expect(api.post).toHaveBeenCalledWith("/users/users/token", {
        email: "test@example.com",
        password: "password",
      });
      expect(setAuthToken).toHaveBeenCalledWith("test_token");
      expect(localStorage.getItem("defaultHostId")).toBe("1");
      expect(localStorage.getItem("defaultHostName")).toBe("Test Host");
    });

    it("should handle error when fetching default host fails", async () => {
      const mockLoginResponse = { data: { access_token: "test_token" } };
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      (api.post as jest.Mock).mockResolvedValue(mockLoginResponse);
      (getDefaultHost as jest.Mock).mockRejectedValue(
        new Error("Failed to fetch host"),
      );

      await login({ email: "test@example.com", password: "password" });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch default host:",
        expect.any(Error),
      );
      expect(localStorage.getItem("defaultHostId")).toBeNull();
      expect(localStorage.getItem("defaultHostName")).toBeNull();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const mockRegisterResponse = {
        data: { id: 1, email: "test@example.com" },
      };
      (api.post as jest.Mock).mockResolvedValue(mockRegisterResponse);

      const result = await register({
        email: "test@example.com",
        password: "password",
      });

      expect(api.post).toHaveBeenCalledWith("/users/users/", {
        email: "test@example.com",
        password: "password",
      });
      expect(result).toEqual(mockRegisterResponse.data);
    });
  });

  describe("logout", () => {
    it("should remove auth token and default host information", () => {
      localStorage.setItem("token", "test_token");
      localStorage.setItem("defaultHostId", "1");
      localStorage.setItem("defaultHostName", "Test Host");

      logout();

      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("defaultHostId")).toBeNull();
      expect(localStorage.getItem("defaultHostName")).toBeNull();
    });
  });
});
