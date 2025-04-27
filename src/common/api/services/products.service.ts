import {ApiServiceClass} from "@/common/api/ApiServiceClass.ts";
import {AxiosInstance} from "axios";
import type { Product, CreateProductDto, UpdateProductDto } from "@/types/product";
import {ApiResponse} from "@/types/api.ts";

export class ProductsService extends ApiServiceClass {

    constructor(axios: AxiosInstance) {
        super({
            axios: axios,
            serviceUrl: "products",
            urlPrefix: "",
        });
    }

    async list(): Promise<ApiResponse<Product[]>> {
        return this.GET("");
    }

    async batch(ids: number[]): Promise<ApiResponse<Product[]>> {
        return this.GET("/batch", {ids});
    }

    async get(id: number): Promise<ApiResponse<Product>> {
        return this.GET(`/${id}`);
    }

    async create(product: CreateProductDto): Promise<Product> {
        return this.POST("", product);
    }

    async update(id: number, product: UpdateProductDto): Promise<Product> {
        return this.PATCH(`/${id}`, product);
    }

    async delete(id: number): Promise<void> {
        return this.DELETE(`/${id}`);
    }
}