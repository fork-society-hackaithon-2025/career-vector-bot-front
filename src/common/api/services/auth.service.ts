import {ApiServiceClass} from "@/common/api/ApiServiceClass.ts";
import {AxiosInstance} from "axios";
import {ApiResponse} from "@/types/api.ts";
import {User} from "@/types/user.ts";

export class AuthService extends ApiServiceClass {
    constructor(axios: AxiosInstance) {
        super({
            axios: axios,
            serviceUrl: "auth",
            urlPrefix: "",
        });
    }

    async login(initData: string): Promise<ApiResponse<{ user: User; token: string }>> {
        return this.POST("/telegram/login", { initData });
    }
}