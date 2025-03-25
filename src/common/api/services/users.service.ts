import {ApiServiceClass} from "@/common/api/ApiServiceClass.ts";
import {AxiosInstance} from "axios";

export class UsersService extends ApiServiceClass {

    constructor(axios: AxiosInstance) {
        super({
            axios: axios,
            serviceUrl: "users",
            urlPrefix: "",
        });
    }

    async list() {
        return this.GET("");
    }
}