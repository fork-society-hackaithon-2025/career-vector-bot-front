export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  grossPrice: number;
  clientPrice: number;
  availableAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  brand: string;
  category: string;
  grossPrice: number;
  clientPrice: number;
  availableAmount: number;
}

export interface UpdateProductDto {
  name?: string;
  brand?: string;
  category?: string;
  grossPrice?: number;
  clientPrice?: number;
  availableAmount?: number;
}
