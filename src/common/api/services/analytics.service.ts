import { ApiServiceClass } from '@/common/api/ApiServiceClass';
import { AxiosInstance } from 'axios';
import { ApiResponse } from "@/types/api.ts";
import { ProfitOverview, SalesBreakdown, TopProducts } from '@/types/analytics';

export class AnalyticsService extends ApiServiceClass {
    constructor(axios: AxiosInstance) {
        super({
            axios,
            serviceUrl: 'analytics',
            urlPrefix: '',
        });
    }

    async profit(): Promise<ApiResponse<ProfitOverview>> {
        return this.GET('/profit-overview');
    }

    async sales(): Promise<ApiResponse<SalesBreakdown>> {
        return this.GET('/sales-breakdown');
    }

    async topProducts(): Promise<ApiResponse<TopProducts>> {
        return this.GET('/top-products');
    }
}