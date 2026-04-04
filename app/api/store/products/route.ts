import { NextResponse } from "next/server";
import { getProductModel } from "@/models";

const DEFAULT_LIMIT = 12;

function normalizeId(value: any) {
  if (!value) return null;
  if (typeof value === "object" && "_id" in value) return normalizeId(value._id);
  if (typeof value?.toString === "function") return value.toString();
  return null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const requestedLimit =
    Number(url.searchParams.get("limit") || DEFAULT_LIMIT) || DEFAULT_LIMIT;
  const limit = Math.min(Math.max(requestedLimit, 1), 50);

  try {
    const Product = await getProductModel();
    const products = await Product.find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    const sanitized = products.map((product: any) => ({
      id: normalizeId(product._id),
      name: product.name,
      slug: product.slug,
      price: product.price ?? product.pricing?.price ?? 0,
      compareAtPrice:
        product.compareAtPrice ??
        product.pricing?.compareAtPrice ??
        product.pricing?.price ??
        0,
      description: product.description,
      primaryImage: product.primaryImageId || product.gallery?.[0] || "",
      categoryIds: (product.categoryIds || []).map(normalizeId).filter(Boolean),
      primaryCategoryId: normalizeId(product.primaryCategoryId),
      status: product.status,
      updatedAt: product.updatedAt,
      createdAt: product.createdAt,
    }));

    return NextResponse.json(sanitized);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
