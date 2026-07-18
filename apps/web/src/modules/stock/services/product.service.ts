import { apiClient } from "@shared/api/client";

export type ProductDto = {
  id?: string;
  name: string;
  sku: string;
  quantity: number;
  status: string;
  value: number;
};

export const productService = {
  async findAll(): Promise<ProductDto[]> {
    const { data } = await apiClient.get<ProductDto[]>("/products");
    return data;
  },

  async create(product: ProductDto): Promise<ProductDto> {
    const { data } = await apiClient.post<ProductDto>("/products", product);
    return data;
  },

  async update(id: string, product: Partial<ProductDto>): Promise<ProductDto> {
    const { data } = await apiClient.put<ProductDto>(`/products/${id}`, product);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};
