import { NextResponse } from "next/server";
import { getAttributeSetModel } from "@/models";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const contextFilters = url.searchParams.get("context");
  const appliesTo = url.searchParams.get("appliesTo");

  const query: any = {};
  if (contextFilters) query.contexts = contextFilters;
  if (appliesTo) query.appliesTo = appliesTo;

  try {
    const AttributeSet = await getAttributeSetModel();
    const sets = await AttributeSet.find(query).toArray();
    return NextResponse.json(sets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const AttributeSet = await getAttributeSetModel();

    if (!body.name || !body.attributes || !Array.isArray(body.attributes)) {
      return NextResponse.json({ error: "Name and attributes array are required" }, { status: 400 });
    }

    const setDoc = {
      name: body.name,
      key: body.key || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      appliesTo: body.appliesTo || 'product',
      contexts: body.contexts || [],
      attributes: body.attributes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await AttributeSet.insertOne(setDoc);

    return NextResponse.json({ success: true, setId: result.insertedId, key: setDoc.key, message: "Attribute Set created" });
  } catch (error: any) {
    if (error.code === 11000) return NextResponse.json({ error: "Conflict: Duplicate key" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
