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
  deliveryAddress: string;
  deliveryDate: string;
  orderItems: OrderItem[];
  totalPrice: number;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  editDeadline: string;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "DELIVERED";

export interface CreateOrderDto {
  name: string;
  phone: string;
  deliveryAddress: string;
  deliveryDate: Date;
  items: {
    productId: number;
    quantity: number;
  }[];
  totalPrice: number;
}

export interface UpdateOrderDto {
  clientName?: string;
  clientPhone?: string;
  deliveryAddress?: string;
  deliveryDate?: Date;
  items?: {
    productId: number;
    quantity: number;
  }[];
  totalPrice?: number;
}