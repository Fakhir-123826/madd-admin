import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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
import Order from './screens/OrdersManagement/OrderList.tsx'
import UserList from "./screens/Users/userlist.tsx"
import UsersRoles from "./screens/Users/UsersRoles.tsx"
import UsersGroup from "./screens/Users/UsersGroup.tsx"


const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {path : "/" , element : <Dashboard/>},
      {path : "/storeList" , element : <StoreList/>},
      {path : "/storeCardList" , element : <StoreCardList/>},
      {path : "/store" , element : <Store/>},
      {path : "/orderlist" , element : <Order/>},
      {path : "/CreateStore" , element : <CreateStore/>},
      {path : "/Verdor" , element : <VendorList/>},
      {path : "/Verder1" , element : <Vendor/>},
      {path : "/CreateVerder" , element : <CreateVendor/>},
      {path : "/CreateVerderOnboard" , element : <CreateVendoronBoard/>},
      {path : "/VerderOnboard" , element : <VendorOnboard/>},
      {path : "/VendorDashBoard" , element : <VendorDashBoard/>},
      {path : "/CreateSubscription" , element : <CreateSubscription/>},
      {path : "/SubscriptionList" , element : <SubscriptionList/>},
      {path : "/userlist" , element : <UserList />},
      {path : "/usersroles" , element : <UsersRoles/>},
      {path : "/usersgroup" , element : <UsersGroup/>},
      
    ]
  },
  { path: "/login", element: <Login /> },
  { path: "/otp", element: <EnterOTP /> },
  { path: "/pass", element: <ForgotPassword /> },
  { path: "/ddd", element: <Dashboard /> },
  { path: "/signup", element: <Signup /> },
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  </StrictMode>,
)
