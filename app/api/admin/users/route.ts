import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectTenantDB } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const db = await connectTenantDB();
    const userColl = db.collection("users");
    const params = req.nextUrl.searchParams;
    const role = params.get("role") || null;

    const query: any = {};

    if (role == "customer") {
      query.role = role;
    } else {
      query.role = {
        $ne: "customer",
      };
    }


    const itemsPerPageCustomers = Number(params.get("itemsPerPage")) || 50;
    const currentPageCustomers = Number(params.get("currentPage")) || 1;
    const searchQueryCustomers = params.get("search") || "";

    const skipCustomers = (currentPageCustomers - 1) * itemsPerPageCustomers;

    // Fetch all users with role "customers"
    let users = null;
    let totalusers = 0;

    if (role == "customer") {
      users = await userColl
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skipCustomers)
        .limit(itemsPerPageCustomers)
        .toArray();
      totalusers = await userColl.countDocuments(query);
    } else {
      users = await userColl.find(query).sort({ createdAt: -1 }).toArray();
    }

    // Map to remove sensitive fields
    const safeCustomers = users.map((c) => {
      const { password, ...safe } = c;
      return safe;
    });

    if (role == "customer") {
      return NextResponse.json({
        success: true,
        message: "Customers fetched successfully",
        customers: safeCustomers,
        totalCustomers: totalusers,
        type: "customer",
      });
    } else {
      return NextResponse.json({
        success: true,
        message: "Users fetched successfully",
        users: safeCustomers,
        type: "admin",
      });
    }
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during fetch" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const role = searchParams.get("role");

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    const db = await connectTenantDB();
    const userColl = db.collection("users");

    // Check if user already exists
    const existingUser = await userColl.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Customer already exists with this email" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    if (role == "customer") {
      // Ensure addresses exists and is an array
      const addresses = Array.isArray(body.addresses) ? body.addresses : [];
      
      body.addresses = addresses.map((address: any) => {
        return {
          ...address,
          _id: new ObjectId(),
        };
      });

      const newCustomer = {
        ...body,
        addresses: body.addresses,
        role: role,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await userColl.insertOne(newCustomer as any);

      return NextResponse.json({
        success: true,
        message: "Customer created successfully",
        data: {
          ...newCustomer,
          _id: result.insertedId,
        },
        type: "customer",
      });
    } else {
      const newadmin = {
        ...body,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await userColl.insertOne(newadmin as any);

      return NextResponse.json({
        success: true,
        message: "Admin created successfully",
        data: {
          ...newadmin,
          _id: result.insertedId,
        },
        type: "admin",
      });
    }
  } catch (error) {
    console.error("Create Customer Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during creation" },
      { status: 500 },
    );
  }
}
