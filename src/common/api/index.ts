import axios, {AxiosInstance} from "axios";
import {UsersService} from "@/common/api/services/users.service.ts";
import {ProductsService} from "@/common/api/services/products.service.ts";
import {AuthService} from "@/common/api/services/auth.service.ts";
import {OrdersService} from "@/common/api/services/orders.service.ts";
import {AnalyticsService} from "@/common/api/services/analytics.service.ts";
import {CategoriesService} from "@/common/api/services/categories.service.ts";
import {CustomersService} from "@/common/api/services/customers.service.ts";

export const apiConfig = {
    baseUrl: import.meta.env.VITE_API_URL
}

export class Api {
    private axios: AxiosInstance;

    public users: UsersService;
    public products: ProductsService;
    public auth: AuthService;
    public orders: OrdersService;
    public analytics: AnalyticsService;
    public categories: CategoriesService;
    public customers: CustomersService;

    constructor() {
        this.axios = axios.create({
            baseURL: apiConfig.baseUrl,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("jwtToken");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem("jwtToken");
                    localStorage.removeItem("telegramShopUser");
                    this.axios.defaults.headers.common["Authorization"] = "";
                }
                return Promise.reject(error);
            }
        );

        this.users = new UsersService(this.axios);
        this.products = new ProductsService(this.axios);
        this.auth = new AuthService(this.axios);
        this.orders = new OrdersService(this.axios);
        this.analytics = new AnalyticsService(this.axios);
        this.categories = new CategoriesService(this.axios);
        this.customers = new CustomersService(this.axios);
    }

    /** call this immediately after you get your JWT */
    public setAuthToken(token: string) {
        // sets on .defaults so **all** subsequent requests have it
        this.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
}

export const api = new Api();