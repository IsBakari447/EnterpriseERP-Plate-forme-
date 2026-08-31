import { apiClient } from "@shared/api/client";
import { products as fallbackProducts } from "../data";

export type ProductDto = {
  id?: string;
  name: string;
  sku: string;
  quantity: number;
  status: string;
  value: number;
};

const STORAGE_KEY = "enterpriseerp-cloud.products";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function createLocalId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseAmount(value: string | number) {
  return Number(String(value).replace(/[^\d.-]/g, "")) || 0;
}

function normalizeProduct(product: ProductDto): ProductDto {
  return {
    ...product,
    id: product.id ?? createLocalId(),
    quantity: Number(product.quantity || 0),
    value: Number(product.value || 0),
  };
}

function getFallbackProducts(): ProductDto[] {
  return fallbackProducts.map((product) =>
    normalizeProduct({
      id: product.sku,
      name: product.name,
      sku: product.sku,
      quantity: product.stock,
      status: product.status,
      value: parseAmount(product.value),
    })
  );
}

function readLocalProducts(): ProductDto[] {
  if (!canUseStorage()) return getFallbackProducts();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeProduct);
    }
  } catch {
    return getFallbackProducts();
  }

  return getFallbackProducts();
}

function writeLocalProducts(products: ProductDto[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products.map(normalizeProduct)));
}

export const productService = {
  async findAll(): Promise<ProductDto[]> {
    try {
      const { data } = await apiClient.get<ProductDto[]>("/products");
      if (Array.isArray(data)) {
        const products = data.map(normalizeProduct);
        writeLocalProducts(products);
        return products;
      }
    } catch {
      // Keep the stock module usable while auth/API setup is unavailable.
    }

    return readLocalProducts();
  },

  async create(product: ProductDto): Promise<ProductDto> {
    const nextProduct = normalizeProduct(product);

    try {
      const { data } = await apiClient.post<ProductDto>("/products", nextProduct);
      const savedProduct = normalizeProduct(data);
      const products = readLocalProducts();
      writeLocalProducts([savedProduct, ...products.filter((item) => item.id !== savedProduct.id)]);
      return savedProduct;
    } catch {
      const products = readLocalProducts();
      writeLocalProducts([nextProduct, ...products]);
      return nextProduct;
    }
  },

  async update(id: string, product: Partial<ProductDto>): Promise<ProductDto> {
    const products = readLocalProducts();
    const existing = products.find((item) => item.id === id);
    const updated = normalizeProduct({
      name: "",
      sku: "",
      quantity: 0,
      status: "Disponible",
      value: 0,
      ...existing,
      ...product,
      id,
    });

    try {
      const { data } = await apiClient.put<ProductDto>(`/products/${id}`, updated);
      const savedProduct = normalizeProduct(data);
      writeLocalProducts(products.map((item) => (item.id === id ? savedProduct : item)));
      return savedProduct;
    } catch {
      writeLocalProducts(products.map((item) => (item.id === id ? updated : item)));
      return updated;
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch {
      // Delete locally even when the remote API is unavailable.
    }

    writeLocalProducts(readLocalProducts().filter((product) => product.id !== id));
  },
};
