export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  clientName: string;
  clientPhone: string;
  deliveryDate: string;
  items: OrderItem[];
  totalPrice: number;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "DELIVERED";

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