import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/ecommerce/products");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch products");
      return data; // Slice expects { data, message }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/ecommerce/products?category=${category}&status=active`,
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch products");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/ecommerce/products/${id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch product");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const saveProduct = createAsyncThunk(
  "products/save",
  async (
    { id, payload }: { id?: string; payload: any },
    { rejectWithValue },
  ) => {
    try {
      const endpoint = id
        ? `/api/ecommerce/products?id=${id}` // Changed to query param for compatibility with base route PUT
        : "/api/ecommerce/products";
      const method = id ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to save product");
      }

      return { ...data, id }; // Return data and id for slice logic
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/ecommerce/products?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete product");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const bulkImportProducts = createAsyncThunk(
  "products/bulkImport",
  async (products: any[], { rejectWithValue }) => {
    try {
      const response = await fetch("/api/ecommerce/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(products),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to import products");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
