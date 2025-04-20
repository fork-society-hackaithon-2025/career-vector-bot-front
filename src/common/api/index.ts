import axios, {AxiosInstance} from "axios";
import cookie from "js-cookie";
import {UsersService} from "@/common/api/services/users.service.ts";
import {ProductsService} from "@/common/api/services/products.service.ts";
import {AuthService} from "@/common/api/services/auth.service.ts";

export const apiConfig = {
    baseUrl: import.meta.env.VITE_API_URL
}

export class Api {
    private axios: AxiosInstance;

    public users: UsersService;
    public products: ProductsService;
    public auth: AuthService;

    constructor() {
        this.axios = axios.create({
            baseURL: apiConfig.baseUrl,
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
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
        this.products = new ProductsService(this.axios);
        this.auth = new AuthService(this.axios);
    }
}

export const api = new Api();