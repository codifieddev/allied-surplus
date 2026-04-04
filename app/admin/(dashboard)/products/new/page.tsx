import { SimpleProductForm } from "@/components/products/SimpleProductForm";

export default function NewProductPage() {
  return (
    <div className="p-8 pt-0 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Add New Product</h1>
        <p className="text-muted-foreground">Fill in the basic details to add a new furniture item to your inventory.</p>
      </div>
      <SimpleProductForm />
    </div>
  );
}
