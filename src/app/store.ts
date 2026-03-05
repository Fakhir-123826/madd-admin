import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./Slices/counterSlice";
import { authApi } from "./api/AuthSlices/AuthSlices";
import { subscriptionApi } from "./api/SubscriptionSclices/SubscriptionSclices";
import { magentoApi } from "./api/MagentoSlices/magentoApi";
import { magentoCategoryApi } from "./api/MagentoSlices/CategorySlice"; // ✅ import the category API
import { magentoCustomerApi } from "./api/MagentoSlices/CustomerSlice";
import { productApi } from "./api/MagentoSlices/ProductSlice"
import { orderApi } from "./api/MagentoSlices/OrderSlice";
import authReducer from "./api/AuthSlices/authSlice";
import { storeApi } from "./api/MagentoSlices/StoreSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,                                        // ✅ sahi
    [authApi.reducerPath]: authApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [magentoApi.reducerPath]: magentoApi.reducer,
    [magentoCategoryApi.reducerPath]: magentoCategoryApi.reducer,
    [magentoCustomerApi.reducerPath]: magentoCustomerApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [storeApi.reducerPath]: storeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      subscriptionApi.middleware,
      magentoApi.middleware,
      magentoCategoryApi.middleware,
      magentoCustomerApi.middleware,
      productApi.middleware,
      orderApi.middleware,
      storeApi.middleware
    ),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;