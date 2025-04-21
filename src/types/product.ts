import { Brand } from '@/data/brands';
import { Category } from '@/data/categories';

export interface Product {
  id: number;
  name: string;
  brand: Brand;
  category: Category;
  grossPrice: number;
  clientPrice: number;
  availableAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  brand: Brand;
  category: Category;
  grossPrice: number;
  clientPrice: number;
  availableAmount: number;
}

export interface UpdateProductDto {
  name?: string;
  brand?: Brand;
  category?: Category;
  grossPrice?: number;
  clientPrice?: number;
  availableAmount?: number;
}
