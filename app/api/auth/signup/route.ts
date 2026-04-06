import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMasterDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, username, email, address, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const db = await connectMasterDB();
    const users = db.collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Identifier already registered in central database." }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = {
      name,
      username: username || name.toLowerCase().replace(/\s+/g, "_"),
      email,
      address: address || "UNALLOCATED",
      password: hashedPassword,
      role: "customer", // Defaulting to customer for this specific project context
      createdAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    if (result.acknowledged) {
      return NextResponse.json({ 
        success: true, 
        message: "Recruitment successful. Identity established.",
        userId: result.insertedId.toString()
      }, { status: 201 });
    }

    return NextResponse.json({ success: false, message: "Failed to establish identity." }, { status: 500 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ success: false, message: "Central Processing Error" }, { status: 500 });
  }
}
