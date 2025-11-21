// lib/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth-service";
import { LoginFormData, RegisterFormData } from "../validations/auth";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormData) =>
      authService.login(data.email, data.password),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterFormData) =>
      authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.clear();
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
