import { NextRequest, NextResponse } from "next/server";
import { getCategoryModel } from "@/models";
import { authenticateAdmin } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get("type");

  const query: any = {};
  if (type) query.type = type;

  console.log("====>>", query);

  try {
    const Category = await getCategoryModel();
    const categories = await Category.find(query).toArray();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const Category = await getCategoryModel();

    if (!body.name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 },
      );
    }

    // Check if slug already exists
    const slug =
      body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { message: "Conflict: Duplicate slug" },
        { status: 409 },
      );
    }

    const categoryDoc = {
      ...body,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await Category.insertOne(categoryDoc);

    return NextResponse.json({
      message: "Category created successfully",
      data: { ...categoryDoc, _id: result.insertedId },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const idValue = url.searchParams.get("id");

  if (!idValue)
    return NextResponse.json({ message: "ID is required" }, { status: 400 });

  try {
    const body = await req.json();
    const Category = await getCategoryModel();

    // Check hex vs string ID
    const isHex = /^[0-9a-fA-F]{24}$/.test(idValue);
    const id = (isHex ? new ObjectId(idValue) : idValue) as any;

    const { _id, ...updateData } = body;

    const result = await Category.updateOne(
      { _id: id },
      { $set: { ...updateData, updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Category updated successfully",
      data: { ...updateData, _id: idValue },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const idValue = url.searchParams.get("id");

  if (!idValue)
    return NextResponse.json({ message: "ID is required" }, { status: 400 });

  try {
    const Category = await getCategoryModel();

    // Check if category has subcategories
    const hasSubcategories = await Category.findOne({ parentId: idValue });
    if (hasSubcategories) {
      return NextResponse.json(
        { message: "Cannot delete category with subcategories" },
        { status: 400 },
      );
    }

    const isHex = /^[0-9a-fA-F]{24}$/.test(idValue);
    const id = (isHex ? new ObjectId(idValue) : idValue) as any;

    const result = await Category.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Category deleted successfully",
      data: idValue,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
