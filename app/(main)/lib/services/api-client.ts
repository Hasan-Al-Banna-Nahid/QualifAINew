// lib/services/api-client.ts
import axios from "axios";

// O(1) lookup table for tokens
class TokenManager {
  private tokens = new Map<string, { token: string; expiry: number }>();

  setToken(key: string, token: string, expiresIn: number = 3600) {
    this.tokens.set(key, {
      token,
      expiry: Date.now() + expiresIn * 1000,
    });
  }

  getToken(key: string): string | null {
    const tokenData = this.tokens.get(key);
    if (!tokenData || Date.now() > tokenData.expiry) {
      this.tokens.delete(key);
      return null;
    }
    return tokenData.token;
  }

  removeToken(key: string) {
    this.tokens.delete(key);
  }

  clear() {
    this.tokens.clear();
  }
}

export const tokenManager = new TokenManager();

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  timeout: 10000,
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken("auth");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      tokenManager.removeToken("auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
