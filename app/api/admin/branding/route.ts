import { NextResponse } from "next/server";
import { getTenantRegistryModel } from "@/models";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const TenantRegistry = await getTenantRegistryModel();
    // Assuming there's a primary registry document or we retrieve the first one
    const registryData = await TenantRegistry.findOne({ type: "branding" });

    return NextResponse.json({ branding: registryData || null });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const TenantRegistry = await getTenantRegistryModel();

    delete body._id;

    // The user requested to save data in tenant_registry and also save additional field named "branding"
    await TenantRegistry.updateOne(
      {},
      { $set: { ...body, type: "branding" } },
      { upsert: true },
    );

    return NextResponse.json({
      success: true,
      message: "Branding updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
