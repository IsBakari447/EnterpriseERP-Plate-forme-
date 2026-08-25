import { api } from "@/services/api";

export type Product = {
  id: string;
  name: string;
  sku: string;
  quantity?: number | null;
  status?: string | null;
  value?: number | string | null;
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
