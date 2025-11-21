// lib/services/auth-service.ts
import apiClient from "./api-client";
import { tokenManager } from "./api-client";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

// O(1) operations for auth state management
class AuthService {
  private userCache = new Map<string, User>(); // O(1) user lookup

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    const { user, token, expiresIn } = response.data;

    // O(1) storage operations
    tokenManager.setToken("auth", token, expiresIn);
    this.userCache.set(user.id, user);
    localStorage.setItem("current_user", JSON.stringify(user));

    return response.data;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      userData
    );

    const { user, token, expiresIn } = response.data;

    // O(1) storage operations
    tokenManager.setToken("auth", token, expiresIn);
    this.userCache.set(user.id, user);
    localStorage.setItem("current_user", JSON.stringify(user));

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // O(1) cleanup operations
      tokenManager.removeToken("auth");
      this.userCache.clear();
      localStorage.removeItem("current_user");
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<User>("/auth/me");
      this.userCache.set(response.data.id, response.data);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  // O(1) user retrieval from cache
  getCachedUser(userId: string): User | undefined {
    return this.userCache.get(userId);
  }

  // Binary search for user lookup (O(log n)) - useful for sorted user lists
  findUserById(users: User[], userId: string): User | null {
    let left = 0;
    let right = users.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const user = users[mid];

      if (user.id === userId) return user;
      if (user.id < userId) left = mid + 1;
      else right = mid - 1;
    }

    return null;
  }
}

export const authService = new AuthService();
