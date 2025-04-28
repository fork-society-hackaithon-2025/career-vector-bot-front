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
        return this.POST("/telegram/login", { initData: "query_id=AAFDPsMXAAAAAEM-wxdF2QHd&user=%7B%22id%22%3A398671427%2C%22first_name%22%3A%22damir%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22beebablaster%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FroHqLFtD3G5lFs19AR789-PBuPGyGuNkBQtpjevG77o.svg%22%7D&auth_date=1745870840&signature=xhb4yoxq9v1bZG-D_ufjHyEGOYBerlZqOaLsH8ylbVI10GiXkv-39AemIjonr8zFds6upuDF6r8wA7RB2RqyBg&hash=eedbf489d4c1e8023249569fdbd9e240f7e960bdceab688d325270469517bb7e" });
    }
}