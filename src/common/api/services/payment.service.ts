import { ApiServiceClass } from '@/common/api/ApiServiceClass';
import { AxiosInstance } from 'axios';
import { ApiResponse } from '@/types/api';

interface Payment {
    id: number;
    orderId: number;
    paymentType: 'DELIVERY_PAYMENT' | 'DEBT_REPAYMENT';
    amount: number;
    paymentDate: Date;
}

interface UnpaidOrder {
    orderId: number;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    deliveryDate: Date;
}

export interface DebtPayment {
    id: number;
    amount: number;
    paymentDate: Date;
}

export interface ClientDebt {
    totalDebt: number;
    unpaidOrders: UnpaidOrder[];
    debtPayments: DebtPayment[];
}

interface ClientDebtSummary {
    userId: number;
    name: string;
    phone: string | null;
    totalDebt: number;
    lastPaymentDate: Date | null;
    orderCount: number;
}

export class PaymentService extends ApiServiceClass {
    constructor(axios: AxiosInstance) {
        super({
            axios,
            serviceUrl: 'payments',
            urlPrefix: '',
        });
    }

    async recordDeliveryPayment(orderId: number, amount: number): Promise<ApiResponse<Payment>> {
        return this.POST(`/order/${orderId}/delivery`, { amount });
    }

    async recordDebtRepayment(userId: number, amount: number): Promise<ApiResponse<Payment>> {
        return this.POST(`/user/${userId}/repayment`, { amount });
    }

    async getClientDebt(userId: number): Promise<ApiResponse<ClientDebt>> {
        return this.GET(`/user/${userId}/debt`);
    }

    async getAllClientsDebt(): Promise<ApiResponse<ClientDebtSummary[]>> {
        return this.GET('/clients/debt');
    }
} 