import { api } from "@/services/api";

export type Product = {
  id: string;
  name: string;
  sku: string;
  quantity?: number | null;
  status?: string | null;
  value?: number | string | null;
};

export type ProductInput = {
  name: string;
  sku: string;
  quantity: number;
  status: string;
  value: number;
};

type ProductsEnvelope = {
  products?: Product[];
  data?: Product[];
};

export async function getProducts(): Promise<Product[]> {
  const response = await api<Product[] | ProductsEnvelope>("/api/products");

  if (Array.isArray(response)) {
    return response;
  }

  return response.products ?? response.data ?? [];
}

export async function createProduct(payload: ProductInput): Promise<Product> {
  return api<Product>("/api/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
