import { ApiServiceClass } from '@/common/api/ApiServiceClass';
import { AxiosInstance } from 'axios';
import {CreateOrderDto, Order, OrderStatus} from '@/types/order';

export class OrdersService extends ApiServiceClass {
    constructor(axios: AxiosInstance) {
        super({
            axios,
            serviceUrl: 'orders',
            urlPrefix: '',
        });
    }

    async list(): Promise<Order[]> {
        return this.GET('');
    }

    async get(id: number): Promise<Order[]> {
        return this.GET(`/${id}`);
    }

    async create(orderData: CreateOrderDto): Promise<Order> {
        return this.POST('', orderData);
    }

    async updateStatus(id: number, orderStatus: OrderStatus): Promise<Order> {
        return this.POST(`/${id}/status`, {orderStatus});
    }

    async getAvailableDeliveryDates(): Promise<Date[]> {
        return this.GET('/available-dates');
    }
}