"use client";

import { useEffect, useState } from "react";
import { SimpleProductForm } from "@/components/products/SimpleProductForm";
import { use } from "react";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/ecommerce/products/${productId}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <div className="p-8 text-foreground">Loading product data...</div>;
  if (!product) return <div className="p-8 text-primary">Product not found.</div>;

  return (
    <div className="p-8 pt-0 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Edit Product</h1>
        <p className="text-muted-foreground">Modify {product.name || 'this product'} in your inventory.</p>
      </div>
      <SimpleProductForm initialData={product} />
    </div>
  );
}
