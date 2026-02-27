import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./Slices/counterSlice";
import { authApi } from "./api/AuthSlices/AuthSlices";
import { subscriptionApi } from "./api/SubscriptionSclices/SubscriptionSclices";
import { magentoApi } from "./api/MagentoSlices/magentoApi";
import { magentoCategoryApi } from "./api/CategorySlice/CategorySlice"; // ✅ import the category API

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [authApi.reducerPath]: authApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [magentoApi.reducerPath]: magentoApi.reducer,
    [magentoCategoryApi.reducerPath]: magentoCategoryApi.reducer, // ✅ add category API reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      subscriptionApi.middleware,
      magentoApi.middleware,
      magentoCategoryApi.middleware // ✅ add category API middleware
    ),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;