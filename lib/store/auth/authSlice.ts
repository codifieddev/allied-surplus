import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginThunk } from './authThunks';

interface User {
  userName?: string;
  password?: string;
  role?: string;
  email?: string;
  id?: string;
  _id?: string;
}

interface AuthState {
  nestCraftUser: User | null;
  nestCraftToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const loadState = (): AuthState => {
  try {
    const serializedUser = localStorage.getItem('nestCraftUser');
    const serializedToken = localStorage.getItem('nestCraftToken');
    if (serializedUser === null) {
      return {
        nestCraftUser: null,
        nestCraftToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    }
    return {
      nestCraftUser: JSON.parse(serializedUser),
      nestCraftToken: serializedToken,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
  } catch (err) {
    return {
      nestCraftUser: null,
      nestCraftToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
  }
};

const initialState: AuthState = typeof window !== 'undefined' ? loadState() : {
  nestCraftUser: null,
  nestCraftToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.nestCraftUser = action.payload.user;
      state.nestCraftToken = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('nestCraftUser', JSON.stringify(action.payload.user));
        localStorage.setItem('nestCraftToken', action.payload.token);
      }
    },
    logout: (state) => {
      state.nestCraftUser = null;
      state.nestCraftToken = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nestCraftUser');
        localStorage.removeItem('nestCraftToken');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(loginThunk.fulfilled, (state, action: any) => {
   
      state.nestCraftUser = action.payload.user;
        if(action.payload.user?.role=="admin"){
             state.isAuthenticated = true;
        }
  
      state.isLoading = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('nestCraftUser', JSON.stringify(action.payload.user));
        // Note: token is not currently in the loginThunk payload, 
        // but if it were, we would set it here as well.
      }
    })
    .addCase(loginThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  }
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
