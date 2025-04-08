import {ApiServiceClass} from "@/common/api/ApiServiceClass.ts";
import {AxiosInstance} from "axios";

export class ProductsService extends ApiServiceClass {

    constructor(axios: AxiosInstance) {
        super({
            axios: axios,
            serviceUrl: "products",
            urlPrefix: "",
        });
    }

    async list() {
        console.log('booty')
        return this.GET("");
    }

    async get(id: string) {
        return this.GET(`/${id}`);
    }
}