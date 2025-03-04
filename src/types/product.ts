
export interface Product {
  id: string;
  name: string;
  grossPrice: number;
  price: number; // Client price
  inventory: number;
  image?: string;
}
