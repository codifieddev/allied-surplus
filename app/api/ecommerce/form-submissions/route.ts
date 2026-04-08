import { NextResponse } from "next/server";
import { getFormSubmissionModel } from "@/models";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const formId = searchParams.get("formId");
    const productId = searchParams.get("productId");

    const submissionCollection = await getFormSubmissionModel();
    const query: any = {};
    if (formId) query.formId = formId;
    if (productId) query.productId = productId;

    const submissions = await submissionCollection.find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ data: submissions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const submissionCollection = await getFormSubmissionModel();

    const newSubmission = {
      ...body,
      createdAt: new Date(),
    };

    const result = await submissionCollection.insertOne(newSubmission);
    return NextResponse.json({ data: { ...newSubmission, _id: result.insertedId } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
