import {ApiServiceClass} from '@/common/api/ApiServiceClass';
import {AxiosInstance} from 'axios';
import {ApiResponse} from "@/types/api.ts";
import {Category, CreateCategoryDto} from "@/types/category.ts";

export class CategoriesService extends ApiServiceClass {
    constructor(axios: AxiosInstance) {
        super({
            axios,
            serviceUrl: 'categories',
            urlPrefix: '',
        });
    }

    async list(): Promise<ApiResponse<Category[]>> {
        return this.GET('');
    }

    async get(id: number): Promise<ApiResponse<Category>> {
        return this.GET(`/${id}`);
    }

    async create(categoryData: CreateCategoryDto): Promise<ApiResponse<Category>> {
        return this.POST('', categoryData);
    }

    async update(id: number, categoryData: Partial<CreateCategoryDto>): Promise<ApiResponse<Category>> {
        return this.PUT(`/${id}`, categoryData);
    }

    async delete(id: number): Promise<ApiResponse<string>> {
        return this.DELETE(`/${id}`);
    }
}