import { createAsyncThunk } from "@reduxjs/toolkit";

const tenantHeader = process.env.NEXT_PUBLIC_TENANT_ID;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/commerce/products`, {
        headers: {
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch products");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (
    {
      category,
      filters,
    }: {
      category: string;
      filters: any;
    },
    { rejectWithValue },
  ) => {
    try {
      const parmas = new URLSearchParams(filters);

      const response = await fetch(
        `${API_BASE_URL}/commerce/products?category=${category}&${parmas.toString()}`,
        {
          headers: {
            "x-tenant-db": tenantHeader || "",
          },
          credentials: "include",
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch products");

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
      const response = await fetch(`${API_BASE_URL}/commerce/products/${id}`, {
        headers: {
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch product");
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
        ? `${API_BASE_URL}/commerce/products/${id}` // Changed to query param for compatibility with base route PUT
        : `${API_BASE_URL}/commerce/products`;
      const method = id ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to save product");
      }

      return { data: data.data, editingId: id }; // Return data and id for slice logic
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
        headers: {
          "Content-Type": "application/json",
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to delete product");
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
        headers: {
          "Content-Type": "application/json",
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
        body: JSON.stringify(products),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to import products");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
