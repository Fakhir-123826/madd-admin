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
import LegalityControlList from './screens/Catalog/legalityControl/LegalityControlList.tsx'
import ProductBaseList from './screens/Catalog/ProductBase/ProductBaseList.tsx'
import CreatelegalityControl from './screens/Catalog/legalityControl/CreatelegalityControl.tsx'
import CreateProductSharing from './screens/Catalog/ProductSharing/CreateProductSharing.tsx'
import CreateProductBase from './screens/Catalog/ProductBase/CreateProductBase.tsx'
import ProductSharingList from './screens/Catalog/ProductSharing/ProductSharingList.tsx'
import UsersRoles from "./screens/Users/UsersRoles.tsx";
import UserList from "./screens/Users/UserList.tsx";
import UsersGroup from "./screens/Users/UsersGroup.tsx";
import AddUser from "./component/Users/AddUser.tsx";
import UserDetails from "./component/Users/UserDetails.tsx";
import AddRole from "./component/Users/UserRole/AddRole.tsx";
import RoleDetails from "./component/Users/UserRole/RoleDetails.tsx";
import OrderDetails from "./component/orderManagement/OrderDetails.tsx";
import AddOrder from "./component/orderManagement/AddOrder.tsx";
import GroupDetails from "./component/Users/UserGroup/GroupDetails.tsx";
import AddGroup from "./component/Users/UserGroup/AddGroup.tsx";
import Taxes from "./screens/Taxes/Taxes.tsx";
import InvoiceManagement from "./screens/Taxes/InvoiceManagement.tsx";
import AddRule from "./component/Taxes/AddRule.tsx";
import CountryManagement from "./screens/LocalCompanies/CountryManagement.tsx";
import AddCountry from "./component/LocalCompanies/AddCountry.tsx";
import CurrencyManagement from "./component/LocalCompanies/CurrencyManagement.tsx";
import LanguageManagement from "./component/LocalCompanies/LanguageManagement.tsx";
import AddLanguage from "./component/LocalCompanies/Language Management/AddLanguage.tsx";
import AddCurrency from "./component/LocalCompanies/Currency Management/AddCurrency.tsx";
import Translation from "./screens/Setting/Translation.tsx";
import Updates from "./screens/Setting/Updates.tsx";
import Backups from "./screens/Setting/Backups.tsx";
import AddBackup from "./component/Setting/Backup/AddBackup.tsx";
import AuditLogs from "./screens/Setting/Audit.logs.tsx";
import ProductBase from "./screens/Catalog/ProductBase/ProductBase.tsx";
import Category from "./screens/Catalog/Category/Category.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/storeList", element: <StoreList /> },
      { path: "/storeCardList", element: <StoreCardList /> },
      { path: "/store", element: <Store /> },
      { path: "/orderlist", element: <OrderList /> },
      { path: "/addorder", element: <AddOrder /> },
      { path: "/order/:id", element: <OrderDetails /> },
      { path: "/CreateStore", element: <CreateStore /> },
      { path: "/Verdor", element: <VendorList /> },
      { path: "/Verder1", element: <Vendor /> },
      { path: "/CreateVerder", element: <CreateVendor /> },
      { path: "/CreateVerderOnboard", element: <CreateVendoronBoard /> },
      { path: "/VerderOnboard", element: <VendorOnboard /> },
      { path: "/VendorDashBoard", element: <VendorDashBoard /> },
      { path: "/CreateSubscription", element: <CreateSubscription /> },
      { path: "/SubscriptionList", element: <SubscriptionList /> },
      { path: "/CreateSubscription/:id", element: <CreateSubscription /> },
      { path: "/CategoryList", element: <CategoryList /> },
      { path: "/Category", element: <Category/> },
      { path: "/CreateCategory", element: <CreateCategory /> },
      { path: "/CreateCategory/:id", element: <CreateCategory /> },
      { path: "/InventoryManagementList", element: <InventoryManagementList /> },
      { path: "/CreateInventoryManagement", element: <CreateInventoryManagement /> },
      { path: "/CreateInventoryManagement/:id", element: <CreateInventoryManagement /> },
      { path: "/LegalityControlList", element: <LegalityControlList /> },
      { path: "/CreatelegalityControl", element: <CreatelegalityControl /> },
      { path: "/CreatelegalityControl/:id", element: <CreatelegalityControl /> },
      { path: "/ProductBaseList", element: <ProductBaseList /> },
      { path: "/ProductBase", element: <ProductBase/> },
      { path: "/CreateProductBase", element: <CreateProductBase /> },
      { path: "/CreateProductBase/:id", element: <CreateProductBase /> },
      { path: "/ProductSharingList", element: <ProductSharingList /> },
      { path: "/CreateProductSharing", element: <CreateProductSharing /> },
      { path: "/CreateProductSharing/:id", element: <CreateProductSharing /> },
      // User List Section
      { path: "/userlist", element: <UserList /> },
      { path: "/adduser", element: <AddUser /> },
      { path: "/user/:id", element: <UserDetails /> },

      // User Role Section
      { path: "/usersroles", element: <UsersRoles /> },
      { path: "/addrole", element: <AddRole /> },
      { path: "/role/:id", element: <RoleDetails /> },

      // User Group Section
      { path: "/usersgroup", element: <UsersGroup /> },
      { path: "/addgroup", element: <AddGroup /> },
      { path: "/group/:id", element: <GroupDetails /> },
      
      // Local Companies....
      // Country Managment
      { path: "/country-management", element: <CountryManagement /> },
      { path: "/addcountry", element: <AddCountry /> },
      // Currency Managment
      { path: "/currency-management", element: <CurrencyManagement /> },
      { path: "/addcurrency", element: <AddCurrency /> },
      // Languages Managment
      { path: "/language-management", element: <LanguageManagement /> },
      { path: "/addlanguage", element: <AddLanguage /> },

      // Taxes
      { path: "/taxes", element: <Taxes /> },
      { path: "/add-rule", element: <AddRule /> },
      { path: "/invoicemanagement", element: <InvoiceManagement /> },

      // Settings
      { path: "/translation", element: <Translation /> },
      { path: "/updates", element: <Updates /> },
      { path: "/backups", element: <Backups /> },
      { path: "addbackup", element: <AddBackup /> },
      { path: "auditlogs", element: <AuditLogs /> },
      


    ]
  },
  { path: "/login", element: <Login /> },
  { path: "/otp", element: <EnterOTP /> },
  { path: "/pass", element: <ForgotPassword /> },
  { path: "/ddd", element: <Dashboard /> },
  { path: "/signup", element: <Signup /> },
])
