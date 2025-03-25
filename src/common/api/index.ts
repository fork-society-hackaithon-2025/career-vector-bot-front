import axios, { AxiosInstance } from "axios";
import cookie from "js-cookie";
import {UsersService} from "@/common/api/services/users.service.ts";

export const apiConfig = {
    baseUrl: import.meta.env.VITE_API_URL
}

export class Api {
    private axios: AxiosInstance;

    public users: UsersService;

    constructor() {
        this.axios = axios.create({
            baseURL: apiConfig.baseUrl,
            headers: {
                "Content-Type": "application/json",
            }
        });

        this.axios.interceptors.request.use(
            async (config) => {
                if (config?.headers) {
                    config.headers["Authorization"] = `Bearer ${cookie.get(
                        "accessToken",
                    )}`;
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        this.users = new UsersService(this.axios);
    }
}

export const api = new Api();