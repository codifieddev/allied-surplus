import { connectTenantDB } from "@/lib/db";
import { getCartModel } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET;

export const getSessionId = async () => {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart_session_id")?.value;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set("cart_session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
  }
  return sessionId;
};

export const getUserId = async () => {
  const cookieStore = await cookies();
  let userId = cookieStore.get("auth_token")?.value;
  if (!userId || !JWT_SECRET) return null;
  let verify = jwt.verify(userId, JWT_SECRET);
  return verify;
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const user: any = await getUserId();
    const sessionId = await getSessionId();
    const Cart = await getCartModel();
    let cart = await Cart.findOne({ sessionId });

    if (user?.id) {
      const userCart = await Cart.findOne({
        userId: new ObjectId(user.id),
      });
      if (
        userCart &&
        userCart?.items.length > 0 &&
        cart &&
        cart?.items.length > 0
      ) {
        for (let i of cart?.items) {
          const existingItemIndex = userCart?.items.findIndex(
            (item: any) => item.cartItemId === i.cartItemId,
          );
          if (existingItemIndex > -1) {
            userCart.items[existingItemIndex].quantity += i.quantity;
          } else {
            userCart?.items.push(i);
          }
        }
        await Cart.updateOne(
          { userId: new ObjectId(user.id) },
          { $set: { items: userCart?.items, updatedAt: new Date() } },
        );
        cart = userCart;
      } else if (userCart && userCart?.items.length > 0) {
        cart = userCart;
      } else {
        await Cart.insertOne({
          userId: new ObjectId(user.id),
          items: cart?.items || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      cart = userCart;
      await Cart.deleteOne({ sessionId });
      cookieStore.delete("cart_session_id");
    }

    return NextResponse.json({
      message: "Cart fetched successfully",
      data: cart?.items || [],
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, status: 500 },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = await getSessionId();
    const user: any = await getUserId();
    const item = await request.json();
    const Cart = await getCartModel();

    if (user?.id) {
      const userCart = await Cart.findOne({
        userId: new ObjectId(user.id),
      });
      const existingItemIndex = userCart?.items.findIndex(
        (i: any) => i.cartItemId === item.cartItemId,
      );
      if (userCart && existingItemIndex > -1) {
        userCart.items[existingItemIndex].quantity += item.quantity;
        await Cart.updateOne(
          { userId: user.id },
          { $set: { items: userCart?.items, updatedAt: new Date() } },
        );
        return NextResponse.json({
          message: "Item added to cart",
          data: userCart.items,
          status: 200,
        });
      } else {
        const newCart = {
          userId: new ObjectId(user.id),
          items: [item],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await Cart.insertOne(newCart);
        return NextResponse.json({
          message: "Item added to cart",
          data: newCart.items,
          status: 200,
        });
      }
    } else {
      const cart = await Cart.findOne({ sessionId: sessionId });

      if (cart) {
        const existingItemIndex = cart?.items.findIndex(
          (i: any) => i.cartItemId === item.cartItemId,
        );
        if (existingItemIndex > -1) {
          cart.items[existingItemIndex].quantity += item.quantity;
          await Cart.updateOne(
            { sessionId: sessionId },
            { $set: { items: cart?.items, updatedAt: new Date() } },
          );
          return NextResponse.json({
            message: "Item added to cart",
            data: cart.items,
            status: 200,
          });
        } else {
          cart.items.push(item);
          await Cart.updateOne(
            { sessionId: sessionId },
            { $set: { items: cart?.items, updatedAt: new Date() } },
          );
          return NextResponse.json({
            message: "Item added to cart",
            data: cart.items,
            status: 200,
          });
        }
      } else {
        const newCart = {
          sessionId: sessionId,
          items: [item],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await Cart.insertOne(newCart);
        return NextResponse.json({
          message: "Item added to cart",
          data: newCart.items,
          status: 200,
        });
      }
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, status: 500 },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionId = await getSessionId();
    const user: any = await getUserId();
    const { cartItemId, quantity } = await request.json();
    const Cart = await getCartModel();

    let updateItems: any[] = [];

    if (user?.id) {
      const userCart = await Cart.findOne({
        userId: new ObjectId(user.id),
      });
      const cartItemIndex = userCart?.items.findIndex(
        (i: any) => i.cartItemId === cartItemId,
      );
      if (userCart && cartItemIndex > -1) {
        userCart.items[cartItemIndex].quantity = quantity;
        if (userCart.items[cartItemIndex].quantity === 0) {
          userCart.items.splice(cartItemIndex, 1);
        }
        await Cart.updateOne(
          { userId: new ObjectId(user.id) },
          { $set: { items: userCart?.items, updatedAt: new Date() } },
        );
        updateItems = userCart.items;
      }
    } else {
      const cart = await Cart.findOne({ sessionId: sessionId });
      const cartItemIndex = cart?.items.findIndex(
        (i: any) => i.cartItemId === cartItemId,
      );
      if (cart && cartItemIndex > -1) {
        cart.items[cartItemIndex].quantity = quantity;
        if (cart.items[cartItemIndex].quantity === 0) {
          cart.items.splice(cartItemIndex, 1);
        }
        await Cart.updateOne(
          { sessionId: sessionId },
          { $set: { items: cart?.items, updatedAt: new Date() } },
        );
        updateItems = cart.items;
      }
    }

    return NextResponse.json({
      message: "Cart updated successfully",
      data: updateItems,
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, status: 500 },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = await getSessionId();
    const user: any = await getUserId();
    const url = new URL(request.url);
    const cartItemId = url.searchParams.get("cartItemId");
    const clear = url.searchParams.get("clear");
    const Cart = await getCartModel();

    let updatedItems: any[] = [];

    if (user?.id) {
      const cart = await Cart.findOne({ userId: new ObjectId(user.id) });
      if (clear === "true") {
        await Cart.updateOne(
          { userId: user.id },
          { $set: { items: [], updatedAt: new Date() } },
        );
        updatedItems = [];
        return NextResponse.json({
          message: "Cart cleared successfully",
          data: [],
          status: 200,
        });
      } else {
        updatedItems = cart?.items.filter(
          (item: any) => item.cartItemId !== cartItemId,
        );
        await Cart.updateOne(
          { userId: new ObjectId(user.id) },
          { $set: { items: updatedItems, updatedAt: new Date() } },
        );
      }
    } else {
      const cart = await Cart.findOne({ sessionId: sessionId });
      if (clear === "true") {
        await Cart.updateOne(
          { sessionId: sessionId },
          { $set: { items: [], updatedAt: new Date() } },
        );
        return NextResponse.json({
          message: "Cart cleared successfully",
          data: [],
          status: 200,
        });
      } else {
        updatedItems = cart?.items.filter(
          (item: any) => item.cartItemId !== cartItemId,
        );
        await Cart.updateOne(
          { sessionId: sessionId },
          { $set: { items: updatedItems, updatedAt: new Date() } },
        );
      }
    }

    return NextResponse.json({
      message: "Item removed from cart",
      data: updatedItems,
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, status: 500 },
      { status: 500 },
    );
  }
}
