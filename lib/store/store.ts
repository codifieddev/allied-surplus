import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cartSlice';
import adminProductsReducer from './features/adminProductsSlice';
import adminCategoriesReducer from './features/adminCategoriesSlice';
import adminAttributesReducer from './features/adminAttributesSlice';
import adminVariantsReducer from './features/adminVariantsSlice';
import adminOrdersReducer from './features/adminOrdersSlice';
import pagesReducer from './pages/pagesSlice';
import commentsReducer from './comments/commentSlice';
import authReducer from './auth/authSlice';
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      pages: pagesReducer,
      comments: commentsReducer,
      cart: cartReducer,
      adminProducts: adminProductsReducer,
      adminCategories: adminCategoriesReducer,
      adminAttributes: adminAttributesReducer,
      adminVariants: adminVariantsReducer,
      adminOrders: adminOrdersReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
