// lib/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { firebaseAuthService } from "../services/firebase-auth-services";
import { LoginFormData, RegisterFormData } from "../validations/auth";
import { User } from "../services/firebase-auth-services";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormData) =>
      firebaseAuthService.login(data.email, data.password),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      // Store token in localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data.user));
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      firebaseAuthService.register(data.name, data.email, data.password),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      // Store token in localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data.user));
    },
  });
};

export const useGoogleSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => firebaseAuthService.signInWithGoogle(),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      // Store token in localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data.user));
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => firebaseAuthService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.clear();
      // Clear localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (email: string) => firebaseAuthService.resetPassword(email),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<User>) =>
      firebaseAuthService.updateProfile(updates),
    onSuccess: (_, variables) => {
      // Update cached user data
      queryClient.setQueryData(["user"], (old: User | null) =>
        old ? { ...old, ...variables } : null
      );
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => firebaseAuthService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
