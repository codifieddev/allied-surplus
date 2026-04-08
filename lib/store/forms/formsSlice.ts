import { createSlice } from "@reduxjs/toolkit";
import {
  fetchForms,
  saveForm,
  deleteForm,
  fetchSubmissions,
} from "./formsThunk";

interface FormsState {
  allForms: any[];
  submissions: any[];
  loading: boolean;
  error: string | null;
  currentForm: any | null;
  hasFormsFetched: boolean;
}

const initialState: FormsState = {
  allForms: [],
  submissions: [],
  loading: false,
  error: null,
  currentForm: null,
  hasFormsFetched: false,
};

const formsSlice = createSlice({
  name: "adminForms",
  initialState,
  reducers: {
    setCurrentForm: (state, action) => {
      state.currentForm = action.payload;
    },
    resetCurrentForm: (state) => {
      state.currentForm = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Forms
      .addCase(fetchForms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        state.loading = false;
        state.allForms = action.payload;
        state.hasFormsFetched = true;
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.hasFormsFetched = true;
      })
      // Save Form
      .addCase(saveForm.fulfilled, (state, action) => {
        const index = state.allForms.findIndex(
          (f) => f._id === action.payload._id,
        );
        if (index !== -1) {
          state.allForms[index] = action.payload;
        } else {
          state.allForms.push(action.payload);
        }
      })
      // Delete Form
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.allForms = state.allForms.filter((f) => f._id !== action.payload);
      })
      // Fetch Submissions
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentForm, resetCurrentForm } = formsSlice.actions;
export default formsSlice.reducer;
