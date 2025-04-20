import {ApiServiceClass} from "@/common/api/ApiServiceClass.ts";
import {AxiosInstance} from "axios";

export class AuthService extends ApiServiceClass {
    constructor(axios: AxiosInstance) {
        super({
            axios: axios,
            serviceUrl: "auth",
            urlPrefix: "",
        });
    }

    async login(initData: string) {
        // return this.POST("/telegram/login", { initData });
        // for testing
        return this.POST("/telegram/login", {
            initData: "query_id=AAFDPsMXAAAAAEM-wxdDOFVz&user=%7B%22id%22%3A398671427%2C%22first_name%22%3A%22damir%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22beebablaster%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FroHqLFtD3G5lFs19AR789-PBuPGyGuNkBQtpjevG77o.svg%22%7D&auth_date=1745172417&signature=Pc9lBfNpgApvhFWTkpMZNbxFMilobqiTJD4yPjBCEQtK9k3S_I3m57_raxbYaE4hW8emiQkHMSG8jMqKeNw0Cw&hash=f66d5a2c43eef86cd39863f6297dfc6875e8e6803f3fccef22146b0df62902bc",
        });
    }
}