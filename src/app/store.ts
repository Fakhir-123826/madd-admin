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
import { inventoryApi } from "./api/MagentoSlices/InventoryApi";
import { attributeApi } from "./api/MagentoSlices/Attributes";
import { attributeSetApi } from "./api/MagentoSlices/AttributeSetApi";

import { vendorApi } from "./api/VendorSlices/VendorApi";
import vendorReducer from "./api/VendorSlices/VendorSlice";
import { userApi } from "./api/UserSlices/UserApi";

import { storeListApi } from "./api/StoreSlices/StoreApi";

//Settlements
import { settlementApi } from "./api/SettlementSlices/SettlementApi";

import { dashboardApi } from './api/DashboardSlices/DashboardApi';


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [magentoApi.reducerPath]: magentoApi.reducer,
    [magentoCategoryApi.reducerPath]: magentoCategoryApi.reducer,
    [magentoCustomerApi.reducerPath]: magentoCustomerApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [storeApi.reducerPath]: storeApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [attributeApi.reducerPath]: attributeApi.reducer,
    [attributeSetApi.reducerPath]: attributeSetApi.reducer,

    vendor: vendorReducer,
    [vendorApi.reducerPath]: vendorApi.reducer,
    [userApi.reducerPath]: userApi.reducer,

    [storeListApi.reducerPath]: storeListApi.reducer,

    [settlementApi.reducerPath]: settlementApi.reducer ,
    
    [dashboardApi.reducerPath]: dashboardApi.reducer ,


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
      storeApi.middleware,
      inventoryApi.middleware,
      attributeApi.middleware,
      attributeSetApi.middleware,
      vendorApi.middleware,  
      userApi.middleware,      
      storeListApi.middleware,
      settlementApi.middleware,
      dashboardApi.middleware
    ),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;