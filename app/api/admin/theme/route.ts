import { NextResponse } from "next/server";
import { getTenantRegistryModel } from "@/models";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const TenantRegistry = await getTenantRegistryModel();
    const registryData = await TenantRegistry.findOne({ type: "theme" });

    return NextResponse.json({ theme: registryData ? registryData.config : null });
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

    // Use type: "theme" to keep it separate from branding (type: "branding")
    await TenantRegistry.updateOne(
      { type: "theme" },
      { $set: { config: body, type: "theme", updatedAt: new Date() } },
      { upsert: true },
    );

    return NextResponse.json({
      success: true,
      message: "Theme updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
