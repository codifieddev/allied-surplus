import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { connectTenantDB } from "@/lib/db";
import { ObjectId } from "mongodb";

const JWT_SECRET =
  process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    console.log(email, password);

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    const db = await connectTenantDB();
    const userColl = await db.collection("users");
    let user = await userColl.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isValid = await bcrypt
      .compare(password, user.password)
      .catch((err) => {
        console.error("Bcrypt error:", err);
        return false;
      });

    // Support for plain-text password check (e.g., for early seeds)
    if (!isValid && password !== user.password) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const { password: userPassword, ...userWithoutPassword } = user;

    const forCustomer = {
      id: user._id.toString(),
      email: user.email,
      role: user.role || "customer",
      name: user.name,
      username: user.username,
    };

    const forAdmin = {
      id: user._id.toString(),
      email: user.email,
      role: user.role || "admin",
      isTenantOwner: user.isTenantOwner,
      name: user.name,
      username: user.username ? user.username : "",
    };

    const token = jwt.sign(
      user.role === "admin" ? forAdmin : forCustomer,
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Set HTTP-only cookie
    const cookieString = serialize("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful. Entry permitted.",
      user: { ...userWithoutPassword, _id: user._id.toString() },
    });

    response.headers.set("Set-Cookie", cookieString);
    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Central Processing Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No authentication token found" },
        { status: 401 },
      );
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);

    return NextResponse.json({
      success: true,
      message: "Authentication successful. Entry permitted.",
      user: decodedToken,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Central Processing Error" },
      { status: 500 },
    );
  }
}
