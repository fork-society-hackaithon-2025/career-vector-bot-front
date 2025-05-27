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
        return this.POST("/telegram/login", { initData: "user=%7B%22id%22%3A398671427%2C%22first_name%22%3A%22damir%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22beebablaster%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FroHqLFtD3G5lFs19AR789-PBuPGyGuNkBQtpjevG77o.svg%22%7D&chat_instance=-6324683152467236166&chat_type=private&auth_date=1748366334&signature=7Eu3dtunTc9bNz0ksnEGHJoqUkZBCwZfYTK0Cv5mfnYRnnoV4Ivve9K8YRAl_uVLjQqM-dJpluQf-cKomrVrCg&hash=06ff93bd4c872dba1825307e8e8bef1a95c24884100aa3155d6d1602e2006b16" });
    }
}