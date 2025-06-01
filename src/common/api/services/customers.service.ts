import {ApiServiceClass} from '@/common/api/ApiServiceClass';
import {AxiosInstance} from 'axios';
import {ApiResponse} from "@/types/api.ts";

export class CustomersService extends ApiServiceClass {
    constructor(axios: AxiosInstance) {
        super({
            axios,
            serviceUrl: 'customers',
            urlPrefix: '',
        });
    }

    async list(): Promise<ApiResponse<never>> {
        return this.GET(`/financial-list`);
    }

    async getFinancialSummary(telegramId: string): Promise<ApiResponse<never>> {
        return this.GET(`/${telegramId}/financial-summary`);
    }

    async createPayment(telegramId: number, params: any): Promise<ApiResponse<never>> {
        return this.POST(`/${telegramId}/payment`, params);
    }
}