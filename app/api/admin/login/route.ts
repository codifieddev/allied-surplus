import { NextResponse } from "next/server";
import { getUserModel } from "@/models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import clientPromise from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

  console.log(email,password);
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }


    const client = await clientPromise;
    const potentialDbs = ["kalp_master", "kalp_tenant_furni"];
    let user = null;
    let foundDb = "";

    for (const dbName of potentialDbs) {
      console.log(`Searching for user in database: ${dbName}`);
      const db = client.db(dbName);
      const users = db.collection("users");
      user = await users.findOne({ email });
      if (user) {
        foundDb = dbName;
        break;
      }
    }

    if (!user) {
      console.log("User not found in any potential database.");
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    console.log(`User found in: ${foundDb}`);
    console.log("Comparing passwords...");
    const isValid = await bcrypt.compare(password, user.password).catch((err) => {
      console.error("Bcrypt error:", err);
      return false;
    });

    if (!isValid && password !== user.password) {
      console.log("Password mismatch in:", foundDb);
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    console.log("Login successful for:", user.email);
    const { password: userPassword, ...userWithoutPassword } = user;

    // Generate JWT
    const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role || 'admin' }, JWT_SECRET, { expiresIn: '1d' });

    // Set HTTP-only cookie
    const cookieString = serialize('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });

    const response = NextResponse.json({ 
      success: true, 
      user: { ...userWithoutPassword, _id: user._id.toString() } 
    });
    response.headers.set('Set-Cookie', cookieString);
    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
