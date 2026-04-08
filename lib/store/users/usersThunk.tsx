import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk(
  "adminCustomers/fetchUsers",
  async (
    {
      role,
      search,
      currentPage,
      itemsPerPage,
    }: {
      role?: string;
      search?: string;
      currentPage?: number;
      itemsPerPage?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(
        `/api/admin/users?role=${role}&search=${search || ""}&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const addUser = createAsyncThunk(
  "adminCustomers/addUser",
  async (
    { userData, role }: { userData: any; role: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/admin/users?role=${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add user");
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateUser = createAsyncThunk(
  "adminCustomers/updateUser",
  async (
    { id, userData }: { id: string; userData: any },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update user");
      }
      return { id, userData };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteUser = createAsyncThunk(
  "adminCustomers/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
