"use client";

import { useEffect, useState } from "react";
import { productService, ProductDto } from "../services/product.service";

export function useProducts() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      const data = await productService.findAll();
      setProducts(data);
    } catch {
      setError("stock.loadError");
    } finally {
      setLoading(false);
    }
  }

  async function createProduct(product: ProductDto) {
    await productService.create(product);
    await loadProducts();
  }

  async function deleteProduct(id?: string) {
    if (!id) return;
    await productService.remove(id);
    await loadProducts();
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    createProduct,
    deleteProduct,
    reload: loadProducts,
  };
}
