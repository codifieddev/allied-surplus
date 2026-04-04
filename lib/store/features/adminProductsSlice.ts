import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AdminProductsState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminProductsState = {
  items: [],
  loading: true,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'adminProducts/fetchProducts',
  async () => {
    const response = await fetch('/api/ecommerce/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }
);

const adminProductsSlice = createSlice({
  name: 'adminProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error loading products';
      });
  },
});

export const selectAdminProducts = (state: { adminProducts: AdminProductsState }) => state.adminProducts.items;
export const selectAdminProductsLoading = (state: { adminProducts: AdminProductsState }) => state.adminProducts.loading;
export const selectAdminProductsError = (state: { adminProducts: AdminProductsState }) => state.adminProducts.error;

export default adminProductsSlice.reducer;
