import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

//get all pages
export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("kolp_tenant_acadivate");
        const pages = await db.collection("pages").find({}).toArray();
        return NextResponse.json({ success: true, pages });
    } catch (error) {
        console.error("Error fetching pages:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch pages" }, { status: 500 });
    }
}   
