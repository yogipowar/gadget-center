import type { ProductCondition, ProductType, RefurbishedGrade } from "@/constants/products";

export type CatalogProduct = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  productType: ProductType;
  condition: ProductCondition;
  grade?: RefurbishedGrade;
  price: number;
  salePrice: number;
  warranty: string;
  specs: string[];
  shortDescription: string;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  inStock: boolean;
  accent: "navy" | "slate" | "teal" | "stone";
  image?: string;
  images?: string[];
};

export type CatalogQuery = {
  categorySlug?: string;
  brand?: string;
  condition?: ProductCondition;
  productType?: ProductType;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  refurbished?: boolean;
};
