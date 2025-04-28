// hooks/useTelegramLogin.ts
import { useMutation } from "@tanstack/react-query";
import { api } from "@/common/api";
import { User } from "@/types/user.ts";
import { ApiResponse } from "@/types/api.ts";
import { useAuth } from "@/contexts/AuthContext";

export function useTelegramLogin() {
    const { login } = useAuth();

    return useMutation<{ user: User; token: string }, Error, string>({
        mutationFn: async (initData: string) => {
            const response = await api.auth.login(initData);
            if (!response.success) {
                throw new Error(response.data.message || 'Login failed');
            }
            return response.data.responseObject;
        },
        onSuccess: async (data) => {
            await login(data.user, data.token);
        }
    });
}
