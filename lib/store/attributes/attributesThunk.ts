import { createAsyncThunk } from "@reduxjs/toolkit";
import { AttributeSetRecord } from "./attributeSlices";

interface ApiError {
  message: string;
  status?: number;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const tenantHeader = process.env.NEXT_PUBLIC_TENANT_ID;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchAttributes = createAsyncThunk<
  ApiResponse<AttributeSetRecord[]>,
  void,
  { rejectValue: ApiError }
>("attributes/fetchAttributes", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/commerce/attribute-sets`, {
      headers: {
        "x-tenant-db": tenantHeader || "",
      },
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      return rejectWithValue({
        message: data?.message || "Failed to fetch attributes",
        status: res.status,
      });
    }
    return data;
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message || "Something went wrong",
    });
  }
});

export const createAttributeSet = createAsyncThunk<
  ApiResponse<any>,
  any,
  { rejectValue: ApiError }
>("attributes/createAttributeSet", async (payload, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/commerce/attribute-sets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tenant-db": tenantHeader || "",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return rejectWithValue({
        message: data?.message || "Failed to create attribute set",
        status: res.status,
      });
    }
    return data;
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message || "Something went wrong",
    });
  }
});

export const updateAttributeSet = createAsyncThunk<
  ApiResponse<any>,
  { id: string; payload: any },
  { rejectValue: ApiError }
>(
  "attributes/updateAttributeSet",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/commerce/attribute-sets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue({
          message: data?.message || "Failed to update attribute set",
          status: res.status,
        });
      }

      return data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error?.message || "Something went wrong",
      });
    }
  },
);

export const deleteAttributeSet = createAsyncThunk<
  ApiResponse<any>,
  string,
  { rejectValue: ApiError }
>("attributes/deleteAttributeSet", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/commerce/attribute-sets/${id}`, {
      method: "DELETE",
      headers: {
        "x-tenant-db": tenantHeader || "",
      },
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      return rejectWithValue({
        message: data?.message || "Failed to delete attribute set",
        status: res.status,
      });
    }
    return data.id;
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message || "Something went wrong",
    });
  }
});

export const bulkImportAttributes = createAsyncThunk<
  ApiResponse<any>,
  any[],
  { rejectValue: ApiError }
>("attributes/bulkImport", async (attributes, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/commerce/attribute-sets/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tenant-db": tenantHeader || "",
      },
      credentials: "include",
      body: JSON.stringify(attributes),
    });
    const data = await res.json();
    if (!res.ok) {
      return rejectWithValue({
        message: data?.error || "Failed to import attribute sets",
        status: res.status,
      });
    }
    return data.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message || "Something went wrong",
    });
  }
});
