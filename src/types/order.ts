import { Product } from "./product";

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number; // Price at time of order
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryDate: Date;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "REJECTED";

export interface CreateOrderDto {
  name: string;
  phone: string;
  deliveryDate: Date;
  items: {
    productId: number;
    quantity: number;
  }[];
  totalPrice: number;
}