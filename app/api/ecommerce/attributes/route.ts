import { getAttributeSetModel } from "@/models";
import { authenticateAdmin } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const attributeColl = await getAttributeSetModel();
    const attributes = await attributeColl.find({}).toArray();

    return NextResponse.json({
      data: attributes,
      message: "Attributes fetched successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch attributes" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateAdmin();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const attributeColl = await getAttributeSetModel();
    const result = await attributeColl.insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      data: { ...body, _id: result.insertedId },
      message: "Attribute set created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create attribute set" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const auth = await authenticateAdmin();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Attribute ID is required" },
        { status: 400 },
      );
    }

    const attributeColl = await getAttributeSetModel();
    const { _id, ...updateData } = body;

    const result = await attributeColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Attribute set not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: { ...updateData, _id: id },
      message: "Attributes updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update attributes" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await authenticateAdmin();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Attribute ID is required" },
        { status: 400 },
      );
    }

    const attributeColl = await getAttributeSetModel();
    const result = await attributeColl.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Attribute set not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Attribute set deleted successfully",
      data: id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete attribute set" },
      { status: 500 },
    );
  }
}
