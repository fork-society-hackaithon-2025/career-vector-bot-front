// hooks/useTelegramLogin.ts
import { useMutation } from "@tanstack/react-query";
import { api } from "@/common/api";
import { User } from "@/types/user.ts";
import {ApiResponse} from "@/types/api.ts";

export function useTelegramLogin() {
    return useMutation<User, Error, string>({
        mutationFn: async (initData: string) => {
            const response = await api.auth.login(initData) as ApiResponse<User>;

            if (!response.success) {
                throw new Error(response.data.message || 'Login failed');
            }

            return response.data.responseObject;
        }
    })
}
