import { createAsyncThunk } from "@reduxjs/toolkit";

const tenantHeader = process.env.NEXT_PUBLIC_TENANT_ID;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/commerce/cart`, {
        headers: {
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (item: any, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/commerce/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-db": tenantHeader || "",
        },
        body: JSON.stringify(item),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantity",
  async (
    { cartItemId, quantity }: { cartItemId: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/commerce/cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-db": tenantHeader || "",
        },
        body: JSON.stringify({ cartItemId, quantity }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update quantity");
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/commerce/cart?cartItemId=${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-db": tenantHeader || "",
          },
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error("Failed to remove from cart");
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/commerce/cart?clear=true`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to clear cart");
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
    
  },
);
