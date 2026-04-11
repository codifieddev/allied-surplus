import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response: any = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Authentication failed");
      }

      return {
        status: response.status,
        user: data.user,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  },
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Logout failed");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  },
);

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Registration failed");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An unexpected error occurred during recruitment",
      );
    }
  },
);

export const getAuthUserThunk = createAsyncThunk(
  "auth/getAuthUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Authentication failed");
      }

      return {
        status: response.status,
        user: data.user,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  },
);

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async (
    {
      userData,
      userId,
      editingAddressId,
      deleteaddressId,
    }: {
      userData: any;
      userId?: string;
      editingAddressId?: string;
      deleteaddressId?: string;
    },
    { rejectWithValue, getState },
  ) => {
    try {
      const { auth } = getState() as any;
      const params = new URLSearchParams();
      if (editingAddressId) {
        params.append("editaddress", editingAddressId);
      }
      if (deleteaddressId) {
        params.append("deleteaddress", deleteaddressId);
      }
      
      const response = await fetch(
        `/api/auth/${userId || auth.user._id}?${params.toString()}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Profile update failed");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  },
);
