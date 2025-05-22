import { Brand } from '@/data/brands';

export interface Product {
  id: number;
  name: string;
  brand: Brand;
  categoryId: number;
  grossPrice: number;
  clientPrice: number;
  availableAmount: number;
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
}

export interface UpdateProductDto {
  name?: string;
  brand?: Brand;
  categoryId?: number;
  grossPrice?: number;
  clientPrice?: number;
  availableAmount?: number;
}
