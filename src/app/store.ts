import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./Slices/counterSlice";
import { authApi } from "./api/AuthSlices/AuthSlices";
import { subscriptionApi } from "./api/SubscriptionSclices/SubscriptionSclices";
import { magentoApi } from "./api/MagentoSlices/magentoApi";
import { magentoCategoryApi } from "./api/CategorySlice/CategorySlice"; // ✅ import the category API
import { magentoCustomerApi } from "./api/CustomerSlice/CustomerSlice";
import { productApi } from "./api/ProductSlice/ProductSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [authApi.reducerPath]: authApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [magentoApi.reducerPath]: magentoApi.reducer,
    [magentoCategoryApi.reducerPath]: magentoCategoryApi.reducer,
    [magentoCustomerApi.reducerPath]: magentoCustomerApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      subscriptionApi.middleware,
      magentoApi.middleware,
      magentoCategoryApi.middleware,
      magentoCustomerApi.middleware,
      productApi.middleware 
    ),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;