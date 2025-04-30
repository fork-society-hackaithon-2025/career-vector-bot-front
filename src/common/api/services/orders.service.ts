import { ApiServiceClass } from '@/common/api/ApiServiceClass';
import { AxiosInstance } from 'axios';
import {CreateOrderDto, Order, OrderStatus, UpdateOrderDto} from '@/types/order';
import {ApiResponse} from "@/types/api.ts";

export class OrdersService extends ApiServiceClass {
    constructor(axios: AxiosInstance) {
        super({
            axios,
            serviceUrl: 'orders',
            urlPrefix: '',
        });
    }

    async list(): Promise<ApiResponse<Order[]>> {
        return this.GET('');
    }

    async get(id: number): Promise<ApiResponse<Order>> {
        return this.GET(`/${id}`);
    }

    async create(orderData: CreateOrderDto): Promise<ApiResponse<Order>> {
        return this.POST('', orderData);
    }

    async updateStatus(id: number, orderStatus: OrderStatus): Promise<Order> {
        return this.PATCH(`/${id}/status`, {orderStatus});
    }

    async getAvailableDeliveryDates(): Promise<ApiResponse<string[]>> {
        return this.GET('/available-dates');
    }

    async update(id: number, orderData: Partial<UpdateOrderDto>): Promise<ApiResponse<Order>> {
        return this.PATCH(`/${id}`, orderData);
    }

    async exportToPDF(startDate: string, endDate: string): Promise<Blob> {
        console.log(endDate);
        const response = await this.GET('/export/pdf', { 
            startDate: startDate,
            endDate: endDate,
        }, {}, "blob");
        return response.data;
    }

    async exportToExcel(startDate: string, endDate: string): Promise<Blob> {
        const response = await this.GET('/export/excel', { 
            startDate: startDate,
            endDate: endDate,
        }, {}, "blob");
        return response.data;
    }
}