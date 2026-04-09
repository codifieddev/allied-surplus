// import { NextResponse } from "next/server";
// import { getOrderModel } from "@/models";
// import { authenticateAdmin } from "@/lib/auth";
// import { ObjectId } from "mongodb";

// export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;
//   const auth = await authenticateAdmin();
//   if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   try {
//     const body = await req.json();
//     const Order = await getOrderModel();

//     const order = await Order.findOneAndUpdate(
//       { _id: new ObjectId(id) },
//       { $set: {
//           ...((body.status !== undefined) && { status: body.status }),
//           ...((body.notes !== undefined) && { notes: body.notes }),
//           ...((body.shippingAddress !== undefined) && { shippingAddress: body.shippingAddress }),
//           updatedAt: new Date()
//         }
//       },
//       { returnDocument: 'after' }
//     );

//     if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     return NextResponse.json({ success: true, message: "Order updated", order });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;
//   const auth = await authenticateAdmin();
//   if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   try {
//     const Order = await getOrderModel();
//     const order = await Order.findOne({ _id: new ObjectId(id) });

//     if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     return NextResponse.json(order);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { getOrderModel } from "@/models";
import { ObjectId } from "mongodb";

function isValidObjectId(id: string) {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const ordersColl = await getOrderModel();

    let query: any = { _id: id };
    if (isValidObjectId(id)) {
      query = {
        $or: [{ _id: new ObjectId(id) }, { _id: id }],
      };
    }

    const order = await ordersColl.findOne(query);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Fetch Order by ID Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during fetch" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();
    const ordersColl = await getOrderModel();

    let query: any = { _id: id };
    if (isValidObjectId(id)) {
      query = {
        $or: [{ _id: new ObjectId(id) }, { _id: id }],
      };
    }

    // Remove immutable fields and construct update
    const { _id, createdAt, orderNumber, ...updateData } = body;
    updateData.updatedAt = new Date();

    const result = await ordersColl.findOneAndUpdate(
      query,
      { $set: updateData },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Order not found or update failed" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update Order Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during update" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const ordersColl = await getOrderModel();

    let query: any = { _id: id };
    if (isValidObjectId(id)) {
      query = {
        $or: [{ _id: new ObjectId(id) }, { _id: id }],
      };
    }

    const result = await ordersColl.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during deletion" },
      { status: 500 },
    );
  }
}
