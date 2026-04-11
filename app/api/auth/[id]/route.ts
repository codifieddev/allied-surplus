import { connectTenantDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET =
  process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const body = await request.json();
    const finalSet: any = {};

    console.log(body);

    const editAddress = searchParams.get("editaddress");
    const deleteAddress = searchParams.get("deleteaddress");

    const db = await connectTenantDB();
    const userColl = await db.collection("users");

    let user: any = await userColl.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (body.name) {
      finalSet.name = body.name;
    }
    if (body.username) {
      finalSet.username = body.username;
    }
    if (body.wishlist) {
      finalSet.wishlist = body.wishlist;
    }

    if (
      body.currentPassword &&
      body.newPassword &&
      body.confirmPassword === body.newPassword
    ) {
      const verify = await bcrypt.compare(body.currentPassword, user.password);
      if (!verify) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 },
        );
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.newPassword, salt);
      finalSet.password = hashedPassword;
    }

    if (body.address) {
      if (editAddress) {
        const mappedAddress = user.address.map((d: any) =>
          d._id == editAddress
            ? { ...body.address, _id: new ObjectId(editAddress) }
            : d,
        );
        finalSet.address = mappedAddress;
      } else if (deleteAddress) {
        finalSet.address = user.address.filter(
          (d: any) => d._id != deleteAddress,
        );
      } else {
        finalSet.address = [
          ...user.address,
          { ...body.address, _id: new ObjectId() },
        ];
      }
    }

    const patched = await userColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: finalSet },
    );

    if (patched.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 400 },
      );
    }

    user = { ...user, ...finalSet };

    return NextResponse.json({
      success: true,
      message: "Authentication successful. Entry permitted.",
      user: user,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
