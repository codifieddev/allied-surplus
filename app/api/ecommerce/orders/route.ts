// import { NextResponse } from "next/server";
// import { getOrderModel } from "@/models";
// import { authenticateAdmin } from "@/lib/auth";

import { getOrderModel } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { getSessionId, getUserId } from "../cart/route";
import { ObjectId } from "mongodb";

// export async function GET(req: Request) {
//   const auth = await authenticateAdmin();
//   if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const url = new URL(req.url);
//   const status = url.searchParams.get("status");

//   const query: any = {};
//   if (status) query.status = status;

//   try {
//     const Order = await getOrderModel();
//     const orders = await Order.find(query).sort({ createdAt: -1 }).toArray();
//     return NextResponse.json(orders);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const ordersColl = await getOrderModel();
    const params = req.nextUrl.searchParams;

    const itemsPerPage = Number(params.get("itemsPerPage")) || 50;
    const currentPage = Number(params.get("currentPage")) || 1;
    const searchQuery = params.get("search") || "";
    const skip = (currentPage - 1) * itemsPerPage;

    const query: any = {};
    if (searchQuery) {
      query.$or = [
        { orderNumber: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
        { "shippingAddress.firstName": { $regex: searchQuery, $options: "i" } },
        { "shippingAddress.lastName": { $regex: searchQuery, $options: "i" } },
      ];
    }

    const orders = await ordersColl
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage)
      .toArray();

    const totalOrders = await ordersColl.countDocuments(query);

    return NextResponse.json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
      totalOrders,
      currentPage,
      totalPages: Math.ceil(totalOrders / itemsPerPage),
    });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during fetch" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = await getSessionId();
    const user: any = await getUserId();

    const ordersColl = await getOrderModel();

    if (!sessionId && !user?.userId) {
      return NextResponse.json(
        { success: false, message: "Session ID not found" },
        { status: 400 },
      );
    }

    if (user?.userId) {
      body.userId = new ObjectId(user.userId);
    }

    if (sessionId) {
      body.sessionId = sessionId;
    }

    body.email = user?.email
      ? user.email
      : body.shippingAddress.email
        ? body.shippingAddress.email
        : "";

    // Generate Order Number if not provided
    let orderNumber = body.orderNumber;
    if (!orderNumber) {
      // e.g. ORD-20260408-0001
      const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
      const todaysOrdersCount = await ordersColl.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      });
      orderNumber = `ORD-${dateStr}-${String(todaysOrdersCount + 1).padStart(4, "0")}`;
    }

    const newOrder = {
      ...body,
      orderNumber,
      status: body.status || "pending",
      paymentStatus: body.paymentStatus || "pending",
      fulfillmentStatus: body.fulfillmentStatus || "unfulfilled",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // console.log(newOrder);

    const result = await ordersColl.insertOne(newOrder as any);

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      // data: newOrder,
      data: {
        ...newOrder,
        _id: result.insertedId,
      },
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during order creation" },
      { status: 500 },
    );
  }
}
