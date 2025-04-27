import { ApiServiceClass } from '@/common/api/ApiServiceClass';
import { AxiosInstance } from 'axios';
import {CreateOrderDto, Order} from '@/types/order';

export class OrdersService extends ApiServiceClass {
    constructor(axios: AxiosInstance) {
        super({
            axios,
            serviceUrl: 'orders',
            urlPrefix: '',
        });
    }

    async create(orderData: CreateOrderDto): Promise<Order> {
        return this.POST('', orderData);
    }

    async getAvailableDeliveryDates(): Promise<Date[]> {
        return this.GET('/available-dates');
    }
}