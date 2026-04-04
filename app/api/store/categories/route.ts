import { NextResponse } from "next/server";
import { getCategoryModel } from "@/models";

export async function GET() {
  try {
    const Category = await getCategoryModel();
    const categories = await Category.find({ type: "product" })
      .sort({ createdAt: -1 })
      .toArray();

    const sanitized = categories.map((category: any) => ({
      id: category._id?.toString?.() ?? "",
      name: category.name,
      slug: category.slug,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));

    return NextResponse.json(sanitized);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
