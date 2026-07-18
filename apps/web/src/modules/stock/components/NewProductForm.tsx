"use client";

import { useState } from "react";
import { ProductDto } from "../services/product.service";

export default function NewProductForm({
  onSubmit,
}: {
  onSubmit: (product: ProductDto) => Promise<void>;
}) {
  const [product, setProduct] = useState<ProductDto>({
    name: "",
    sku: "",
    quantity: 0,
    status: "Disponible",
    value: 0,
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await onSubmit(product);

    setProduct({
      name: "",
      sku: "",
      quantity: 0,
      status: "Disponible",
      value: 0,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-5 gap-3">
      <input
        placeholder="Produit"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        className="rounded-xl border px-4 py-3"
        required
      />

      <input
        placeholder="SKU"
        value={product.sku}
        onChange={(e) => setProduct({ ...product, sku: e.target.value })}
        className="rounded-xl border px-4 py-3"
        required
      />

      <input
        placeholder="Quantité"
        type="number"
        value={product.quantity}
        onChange={(e) => setProduct({ ...product, quantity: Number(e.target.value) })}
        className="rounded-xl border px-4 py-3"
      />

      <select
        value={product.status}
        onChange={(e) => setProduct({ ...product, status: e.target.value })}
        className="rounded-xl border px-4 py-3"
      >
        <option>Disponible</option>
        <option>Stock faible</option>
        <option>Critique</option>
      </select>

      <input
        placeholder="Valeur"
        type="number"
        value={product.value}
        onChange={(e) => setProduct({ ...product, value: Number(e.target.value) })}
        className="rounded-xl border px-4 py-3"
      />

      <button className="col-span-5 rounded-xl bg-action px-6 py-3 font-semibold text-white">
        Enregistrer le produit
      </button>
    </form>
  );
}
