import { createAsyncThunk } from '@reduxjs/toolkit';
import { setCredentials, setLoading, setError } from './authSlice';



export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: any, { rejectWithValue }) => {
    console.log(credentials);
    try {
      const response: any = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Authentication failed');
      }

      console.log("is response data", data);
      return {
        status: response.status,
        user: data.user,
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'An unexpected error occurred');
    }
  }
);
