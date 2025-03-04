
import { Product } from "./product";

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number; // Price at time of order
}

export type OrderStatus = "pending" | "confirmed" | "rejected" | "delivered";

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
