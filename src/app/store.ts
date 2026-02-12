import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./Slices/counterSlice";
import { authApi } from "../app/AuthSlices/AuthSlices";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
