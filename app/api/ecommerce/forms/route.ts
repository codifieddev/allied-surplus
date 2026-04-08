import { NextResponse } from "next/server";
import { getFormModel } from "@/models";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const formsCollection = await getFormModel();
    const forms = await formsCollection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ data: forms });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const formsCollection = await getFormModel();

    const newForm = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await formsCollection.insertOne(newForm);
    return NextResponse.json({ data: { ...newForm, _id: result.insertedId } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID REQUIRED" }, { status: 400 });

    const body = await req.json();
    const formsCollection = await getFormModel();

    // Remove _id from body to prevent update error
    const { _id, ...updateData } = body;

    const result = await formsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "FORM NOT FOUND" }, { status: 404 });
    }

    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID REQUIRED" }, { status: 400 });

    const formsCollection = await getFormModel();
    const result = await formsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "FORM NOT FOUND" }, { status: 404 });
    }

    return NextResponse.json({ message: "FORM DELETED SUCCESSFULLY" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
