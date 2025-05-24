import { Brand } from '@/data/brands';

export type QuantityType = 'BLOCK' | 'CRATE';

export interface Product {
  id: number;
  name: string;
  brand: Brand;
  categoryId: number;
  grossPrice: number;
  clientPrice: number;
  availableAmount: number;
  quantityType: QuantityType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  brand: Brand;
  categoryId: number;
  grossPrice: number;
  clientPrice: number;
  availableAmount: number;
  quantityType?: QuantityType;
}

export interface UpdateProductDto {
  name?: string;
  brand?: Brand;
  categoryId?: number;
  grossPrice?: number;
  clientPrice?: number;
  availableAmount?: number;
  quantityType?: QuantityType;
}
