import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectTenantDB } from "@/lib/db";
import { authenticateAdmin } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  const auth = await authenticateAdmin();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const files: any[] = formData.getAll("files") as any[];
    const names: string[] = formData.getAll("name") as string[];
    const alts: string[] = formData.getAll("altText") as string[];
    const foldernames: string[] = formData.getAll("foldername") as string[];

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let array: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const name = names[i] || `media-${Date.now()}-${file.name}`;
      const alt = alts[i] || "ALT TEXT NOT ADDED";
      const foldername = foldernames[i] || "Uncategorized";

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.promises.writeFile(path.join(uploadDir, name), buffer);

      array.push({
        filename: name,
        alt: alt,
        foldername: foldername,
        url: `/uploads/${name}`,
        size: buffer.length,
        type: "image",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    if (array.length > 0) {
      const db = await connectTenantDB();
      const mediaColl = db.collection("media");
      const insertResult = await mediaColl.insertMany(array);
      array = array.map((item: any, index: number) => {
        item._id = insertResult.insertedIds[index];
        return item;
      });
    }

    return NextResponse.json({ success: true, data: array });
  } catch (error: any) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { error: "Failed to upload media: " + error.message },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const db = await connectTenantDB();
    const mediaColl = db.collection("media");
    const media = await mediaColl.find().sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ success: true, data: media });
  } catch (error: any) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media: " + error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await authenticateAdmin();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ error: "Media ID required" }, { status: 400 });

    const db = await connectTenantDB();
    const mediaColl = db.collection("media");

    // Check if ID is hex or string
    const queryId = ObjectId.isValid(id) ? new ObjectId(id) : id;

    const result = await mediaColl.deleteOne({ _id: queryId as any });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Failed to delete media: " + error.message },
      { status: 500 },
    );
  }
}
