import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectTenantDB } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const db = await connectTenantDB();
    const userColl = db.collection("users");

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 },
      );
    }

    const updateFields: any = {
      ...body,
      updatedAt: new Date(),
    };

    if (updateFields.addresses) {
      updateFields.addresses = updateFields.addresses.map((address: any) => {
        return {
          ...address,
          _id: ObjectId.isValid(address._id)
            ? new ObjectId(address._id)
            : new ObjectId(),
        };
      });
    }

    if (updateFields.password) {
      updateFields.password = await bcrypt.hash(updateFields.password, 10);
    }

    // Remove _id from updateFields to prevent MongoError
    delete updateFields._id;

    const result = await userColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during update" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const db = await connectTenantDB();
    const userColl = db.collection("users");

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 },
      );
    }

    const result = await userColl.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during deletion" },
      { status: 500 },
    );
  }
}
