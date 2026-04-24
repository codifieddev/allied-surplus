import { createAsyncThunk } from "@reduxjs/toolkit";

const tenantHeader = process.env.NEXT_PUBLIC_TENANT_ID;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchForms = createAsyncThunk(
  "forms/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forms`, {
        headers: {
          "Content-Type": "application/json",
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch forms");
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const saveForm = createAsyncThunk(
  "forms/save",
  async (
    { id, payload }: { id?: string; payload: any },
    { rejectWithValue },
  ) => {
    try {
      const endpoint = id
        ? `${API_BASE_URL}/forms?id=${id}`
        : `${API_BASE_URL}/forms`;
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
      if (!response.ok) throw new Error(data.error || "Failed to save form");
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteForm = createAsyncThunk(
  "forms/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forms?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete form");
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchSubmissions = createAsyncThunk(
  "forms/fetchSubmissions",
  async (
    { formId, productId }: { formId?: string; productId?: string } = {},
    { rejectWithValue },
  ) => {
    try {
      let url = "/api/ecommerce/form-submissions";
      const params = new URLSearchParams();
      if (formId) params.append("formId", formId);
      if (productId) params.append("productId", productId);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to fetch submissions");
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const submitForm = createAsyncThunk(
  "forms/submit",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/ecommerce/form-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit form");
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
