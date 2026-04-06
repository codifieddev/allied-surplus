import { NextResponse } from "next/server";
import { getProductModel, getVariantModel } from "@/models";
import { authenticateAdmin } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search");
  const category = url.searchParams.get("category");
  const status = url.searchParams.get("status");
  const type = url.searchParams.get("type");

  const query: any = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (category && category !== "all") query.categoryIds = category;
  if (status) query.status = status;
  if (type) query.type = type;

  try {
    const Product = await getProductModel();
    const Variant = await getVariantModel();
    const products = await Product.find(query).toArray();

    // Enrich with variants
    const enriched = await Promise.all(products.map(async (p: any) => {
      const variants = await Variant.find({ productId: p._id }).toArray();
      return {
        ...p,
        variantCount: variants.length,
        totalStock: variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0),
        variants
      };
    }));

    return NextResponse.json({
      message: "Products fetched successfully",
      data: enriched
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const Product = await getProductModel();
    const Variant = await getVariantModel();

    if (!body.name || !body.sku) {
      return NextResponse.json({ message: "Name and SKU are required" }, { status: 400 });
    }

    const variants = body.variants || [];
    delete body.variants;

    const productDoc = {
      ...body,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await Product.insertOne(productDoc);
    const productId = result.insertedId;

    const variantWithId = variants.map((v: any) => ({
      ...v,
      productId: productId,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    if (variantWithId.length > 0) {
      await Variant.insertMany(variantWithId);
    }

    return NextResponse.json({
      message: "Product created successfully",
      data: { ...productDoc, _id: productId, variants: variantWithId }
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });

  try {
    const body = await req.json();
    const Product = await getProductModel();
    const Variant = await getVariantModel();

    const variants = body.variants || [];
    delete body.variants;
    delete body._id;

    await Product.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );

    // Update variants logic from reference
    if (variants && Array.isArray(variants)) {
       // For simplicity in this port, we sync variants by ID or recreate
       // Reference logic checks if variant exists then updates, else inserts.
       const existingVariants = await Variant.find({ productId: new ObjectId(id) }).toArray();
       const existingIds = existingVariants.map(v => v._id.toString());

       for (const v of variants) {
          if (v._id && existingIds.includes(v._id.toString())) {
             const vId = new ObjectId(v._id);
             const vData = { ...v };
             delete vData._id;
             await Variant.updateOne({ _id: vId }, { $set: { ...vData, updatedAt: new Date() } });
          } else {
             const vData = { ...v };
             delete vData._id;
             await Variant.insertOne({
                ...vData,
                productId: new ObjectId(id),
                createdAt: new Date(),
                updatedAt: new Date()
             });
          }
       }
    }

    return NextResponse.json({
      message: "Product updated successfully",
      data: { ...body, _id: id, variants }
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });

  try {
    const Product = await getProductModel();
    const Variant = await getVariantModel();

    // Soft delete as per reference logic
    await Product.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "archived", updatedAt: new Date() } }
    );

    await Variant.updateMany(
      { productId: new ObjectId(id) },
      { $set: { status: "inactive", updatedAt: new Date() } }
    );

    return NextResponse.json({
      message: "Product archived successfully",
      id: id
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
