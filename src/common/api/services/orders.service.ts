import { ApiServiceClass } from '@/common/api/ApiServiceClass';
import { AxiosInstance } from 'axios';
import {CreateOrderDto, Order, OrderStatus} from '@/types/order';
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
}