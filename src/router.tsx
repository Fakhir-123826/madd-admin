import { createBrowserRouter } from "react-router-dom";
import Login from './screens/Login.tsx'
import Signup from './screens/Signup.tsx'
import ForgotPassword from './screens/ForgotPassword.tsx'
import EnterOTP from './screens/EnterOTP.tsx'
import Dashboard from './screens/Dashboard.tsx'
import Layout from './shear/Layout.tsx'
import StoreList from './screens/Store/StoreList.tsx'
import StoreCardList from './screens/Store/StoreCardList.tsx'
import Store from './screens/Store/Store.tsx'
import CreateStore from './screens/Store/CreateStore.tsx'
import VendorList from './screens/Vender/VendorList.tsx'
import Vendor from './screens/Vender/Vendor.tsx'
import CreateVendor from './screens/Vender/CreateVendor.tsx'
import CreateVendoronBoard from './screens/Vender/Vendor Onboarding/CreateVendoronBoard.tsx'
import VendorOnboard from './screens/Vender/Vendor Onboarding/VendorOnboard.tsx'
import VendorDashBoard from './screens/Vender/VendorDashBoard.tsx'
import CreateSubscription from './screens/Subscription/CreateSubscription.tsx'
import SubscriptionList from './screens/Subscription/SubscriptionList.tsx'
import OrderList from './screens/OrdersManagement/OrderList.tsx'
import CategoryList from './screens/Catalog/Category/CategoryList.tsx'
import CreateCategory from './screens/Catalog/Category/CreateCategory.tsx'
import InventoryManagementList from './screens/Catalog/InventoryManagement/InventoryManagementList.tsx'
import CreateInventoryManagement from './screens/Catalog/InventoryManagement/CreateInventoryManagement.tsx'
import LegalityControlList from './screens/Catalog/legalityControl/legalityControlList.tsx'
import ProductBaseList from './screens/Catalog/ProductBase/ProductBaseList.tsx'
import CreatelegalityControl from './screens/Catalog/legalityControl/CreatelegalityControl.tsx'
import CreateProductSharing from './screens/Catalog/ProductSharing/CreateProductSharing.tsx'
import CreateProductBase from './screens/Catalog/ProductBase/CreateProductBase.tsx'
import ProductSharingList from './screens/Catalog/ProductSharing/ProductSharingList.tsx'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {path : "/" , element : <Dashboard/>},
      {path : "/storeList" , element : <StoreList/>},
      {path : "/storeCardList" , element : <StoreCardList/>},
      {path : "/store" , element : <Store/>},
      {path : "/orderlist" , element : <OrderList/>},
      {path : "/CreateStore" , element : <CreateStore/>},
      {path : "/Verdor" , element : <VendorList/>},
      {path : "/Verder1" , element : <Vendor/>},
      {path : "/CreateVerder" , element : <CreateVendor/>},
      {path : "/CreateVerderOnboard" , element : <CreateVendoronBoard/>},
      {path : "/VerderOnboard" , element : <VendorOnboard/>},
      {path : "/VendorDashBoard" , element : <VendorDashBoard/>},
      {path : "/CreateSubscription" , element : <CreateSubscription/>},
      {path : "/SubscriptionList" , element : <SubscriptionList/>},
      {path: "/CreateSubscription/:id", element: <CreateSubscription /> },
      {path: "/CategoryList", element: <CategoryList /> },
      {path: "/CreateCategory", element: <CreateCategory/> },
      {path: "/CreateCategory/:id", element: <CreateCategory/> },
      {path: "/InventoryManagementList", element: <InventoryManagementList /> },
      {path: "/CreateInventoryManagement", element: <CreateInventoryManagement /> },
      {path: "/CreateInventoryManagement/:id", element: <CreateInventoryManagement /> },
      {path: "/LegalityControlList", element: <LegalityControlList/> },
      {path: "/CreatelegalityControl", element: <CreatelegalityControl/> },
      {path: "/CreatelegalityControl/:id", element: <CreatelegalityControl/> },
      {path: "/ProductBaseList", element: <ProductBaseList/> },
      {path: "/CreateProductBase", element: <CreateProductBase/> },
      {path: "/CreateProductBase/:id", element: <CreateProductBase/> },
      {path: "/ProductSharingList", element: <ProductSharingList/> },
      {path: "/CreateProductSharing", element: <CreateProductSharing/> },
      {path: "/CreateProductSharing/:id", element: <CreateProductSharing/> },
    ]
  },
  { path: "/login", element: <Login /> },
  { path: "/otp", element: <EnterOTP /> },
  { path: "/pass", element: <ForgotPassword /> },
  { path: "/ddd", element: <Dashboard /> },
  { path: "/signup", element: <Signup /> },
])
