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
import CouponManagement from "./screens/Return/Coupon management/CouponManagement.tsx";
import CouponManagementList from "./screens/Return/Coupon management/CouponManagementList.tsx";
import CreateCouponManagement from "./screens/Return/Coupon management/CreateCouponManagement.tsx";
import CreateEmailMarketing from "./screens/Return/Email Marketing/CreateEmailMarketing.tsx";
import CreateSEOSetting from "./screens/Return/SEO setting/CreateSEOSetting.tsx";
import SEOSettingList from "./screens/Return/SEO setting/SEOSettingList.tsx";
import EmailMarketingList from "./screens/Return/Email Marketing/EmailMarketingList.tsx";
import SEOSEtting from "./screens/Return/SEO setting/SEOSetting.tsx";
import MlmDashboard from "./screens/MlmDashboard/MlmDashboard.tsx";
import UserTree from "./component/MlmDashboard/UserTree.tsx";
import Earning from "./component/MlmDashboard/Earning.tsx";
import LevelWise from "./component/MlmDashboard/LevelWise.tsx";
import MemberGrowth from "./component/MlmDashboard/MemberGrowth.tsx";
import PaymentProviderManagement from "./screens/Payment/PaymentProviderManagement.tsx";
import PaymentProviderDetails from "./component/Payment/PaymentProviderDetails.tsx";
import AddStripe from "./component/Payment/AddStripe.tsx";
import AddProvider from "./component/Payment/AddProvider.tsx";
import ShippingProviderManagement from "./screens/Payment/ShippingProviderManagement.tsx";
import ShippingProviderDetail from "./component/Payment/ShipRocket/ShippingProviderDetail.tsx";
import AddShipping from "./component/Payment/ShipRocket/AddShipping.tsx";
import AddShipRocket from "./component/Payment/ShipRocket/AddShipRocket.tsx";
import Domain from "./screens/Domain/Domain.tsx";
import Ssl from "./screens/Domain/Ssl.tsx";
import Dns from "./screens/Domain/Dns.tsx";
import SubDomain from "./screens/Domain/SubDomain.tsx";
import AddDnsRecord from "./component/Domain/AddDnsRecord.tsx";
import AddSubdomain from "./component/Domain/AddSubDomain.tsx";
import AddSslCertificate from "./component/Domain/AddSslCertificate.tsx";
import MagentoOrderList from "./screens/Magento/Order/MagentoOrderList.tsx";
import MagentoProductList from "./screens/Magento/Product/MagentoProductList.tsx";
import AddMagentoProduct from "./screens/Magento/Product/AddMagentoProduct.tsx";
import AddMagentoCategory from "./screens/Magento/Category/AddMagentoCategory.tsx";
import MagentoCategoryList from "./screens/Magento/Category/MagentoCategoryList.tsx";
import MagentoCustomerList from "./screens/Magento/Customers/MagentoCustomerList.tsx";
import AddMagentoCustomer from "./screens/Magento/Customers/AddMagentoCustomer.tsx";
import MogentoOrder from "./screens/Magento/Order/MagentoOrder.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import MagentoInventoryList from "./screens/Magento/Inventory/MagentoInventoryList.tsx";
import UpdateMagentoInventory from "./screens/Magento/Inventory/UpdateMagentoInventory.tsx";
import MagentoAttributesLits from "./screens/Magento/Stores/Attributes/MagentoAttributesLits.tsx";
import AddMagentoAttribute from "./screens/Magento/Stores/Attributes/AddMagentoAttribute.tsx";
import MagentoAttributeSetsList from "./screens/Magento/Stores/AttributeSet/MagentoAttributeSetsList.tsx";
import AddMagentoAttributeSet from "./screens/Magento/Stores/AttributeSet/AddMagentoAttributeSet.tsx";
import NotFound from "./component/NotFound.tsx";
import MagentoPaymentServices from "./screens/Magento/PaymentService/MagentoPaymentServices.tsx";
import MagentoInvoiceList from "./screens/Magento/Invoices/MagentoInvoiceList.tsx";
import MagentoInvoiceDetail from "./screens/Magento/Invoices/MagentoInvoiceDetail.tsx";
import MagentoShipmentList from "./screens/Magento/Shipment/Magentoshipmentlist.tsx";
import MagentoShipmentDetail from "./screens/Magento/Shipment/Magentoshipmentdetail.tsx";
import MagentoCreditMemoList from "./screens/Magento/CreditMemo/Magentocreditmemolist.tsx";
import MagentoCreditMemoDetail from "./screens/Magento/CreditMemo/Magentocreditmemodetail.tsx";
import MagentoOnlineCustomers from "./screens/Magento/NowOnline/MagentoOnlineCustomers.tsx";
import AddMagentoCustomerGroup from "./screens/Magento/CustomerGroups/AddMagentoCustomerGroup.tsx";
import MagentoCustomerGroupsList from "./screens/Magento/CustomerGroups/MagentoCustomerGroupsList.tsx";
import AddMagentoCatalogPriceRule from "./screens/Magento/Marketing/CatalogPriceRule/AddMagentoCatalogPriceRule.tsx";
import MagentoCatalogPriceRuleList from "./screens/Magento/Marketing/CatalogPriceRule/MagentoCatalogPriceRuleList.tsx";
import MagentoCartPriceRulesList from "./screens/Magento/Marketing/CartPriceRules/MagentoCartPriceRulesList.tsx";
import AddMagentoCartPriceRule from "./screens/Magento/Marketing/CartPriceRules/AddMagentoCartPriceRule.tsx";
import MagentoUrlRewritesList from "./screens/Magento/Marketing/URLRewrites/MagentoUrlRewritesList.tsx";
import AddMagentoUrlRewrite from "./screens/Magento/Marketing/URLRewrites/AddMagentoUrlRewrite.tsx";
import AddMagentoSearchTerm from "./screens/Magento/Marketing/SearchTerms/AddMagentoSearchTerm.tsx";
import MagentoSearchTermsList from "./screens/Magento/Marketing/SearchTerms/MagentoSearchTermsList.tsx";
import AddMagentoSearchSynonym from "./screens/Magento/Marketing/SearchSynonyms/AddMagentoSearchSynonym.tsx";
import MagentoSearchSynonymsList from "./screens/Magento/Marketing/SearchSynonyms/MagentoSearchSynonymsList.tsx";
import AddMagentoSitemap from "./screens/Magento/Marketing/SiteMap/AddMagentoSitemap.tsx";
import MagentoSitemapList from "./screens/Magento/Marketing/SiteMap/MagentoSitemapList.tsx";
import AddMagentoReview from "./screens/Magento/Marketing/Reviews/AddMagentoReview.tsx";
import MagentoReviewsList from "./screens/Magento/Marketing/Reviews/MagentoReviewsList.tsx";
import MagentoEmailTemplatesList from "./screens/Magento/Marketing/EmailTemplates/MagentoEmailTemplatesList.tsx";
import AddMagentoEmailTemplate from "./screens/Magento/Marketing/EmailTemplates/AddMagentoEmailTemplate.tsx";
import MagentoNewsletterTemplatesList from "./screens/Magento/Marketing/NewsletterTemplates/MagentoNewsletterTemplatesList.tsx";
import AddMagentoNewsletterTemplate from "./screens/Magento/Marketing/NewsletterTemplates/AddMagentoNewsletterTemplate.tsx";
import AddMagentoStor from "./screens/Magento/Stores/Store/AddMagentoStor.tsx";
import MagentoManageStoresList from "./screens/Magento/Stores/Store/MagentoStoreList.tsx";
import MagentoConfigurationList from "./screens/Magento/Content/MagentoConfigurationList.tsx";
import MagentoTermsConditionsList from "./screens/Magento/Stores/TermsConditions/MagentoTermsConditionsList.tsx";
import AddMagentoTermsCondition from "./screens/Magento/Stores/TermsConditions/AddMagentoTermsCondition.tsx";
import AddMagentoOrderStatus from "./screens/Magento/Stores/OrderStatus/AddMagentoOrderStatus.tsx";
import MagentoOrderStatusList from "./screens/Magento/Stores/OrderStatus/MagentoOrderStatusList.tsx";
import MagentoSourcesList from "./screens/Magento/Stores/Source/MagentoSourcesList.tsx";
import AddMagentoSource from "./screens/Magento/Stores/Source/AddMagentoSource.tsx";
import MagentoTaxRulesList from "./screens/Magento/Stores/TaxRules/MagentoTaxRulesList.tsx";
import AddMagentoTaxRule from "./screens/Magento/Stores/TaxRules/AddMagentoTaxRule.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Dashboard /> },
      // Store Section
      { path: "/storeList", element: <StoreList /> },
      { path: "/storeCardList", element: <StoreCardList /> },
      { path: "/store", element: <Store /> },
      { path: "/CreateStore", element: <CreateStore /> },

      // Order Section
      { path: "/orderlist", element: <OrderList /> },
      { path: "/addorder", element: <AddOrder /> },
      { path: "/order/:id", element: <OrderDetails /> },

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
      { path: "/Category", element: <Category /> },
      { path: "/CreateCategory", element: <CreateCategory /> },
      { path: "/CreateCategory/:id", element: <CreateCategory /> },
      { path: "/InventoryManagementList", element: <InventoryManagementList /> },
      { path: "/CreateInventoryManagement", element: <CreateInventoryManagement /> },
      { path: "/CreateInventoryManagement/:id", element: <CreateInventoryManagement /> },
      { path: "/LegalityControlList", element: <LegalityControlList /> },
      { path: "/CreatelegalityControl", element: <CreatelegalityControl /> },
      { path: "/CreatelegalityControl/:id", element: <CreatelegalityControl /> },
      { path: "/ProductBaseList", element: <ProductBaseList /> },
      { path: "/ProductBase", element: <ProductBase /> },
      { path: "/CreateProductBase", element: <CreateProductBase /> },
      { path: "/CreateProductBase/:id", element: <CreateProductBase /> },
      { path: "/ProductSharingList", element: <ProductSharingList /> },
      { path: "/CreateProductSharing", element: <CreateProductSharing /> },
      { path: "/CreateProductSharing/:id", element: <CreateProductSharing /> },
      { path: "/CouponManagement", element: <CouponManagement /> },
      { path: "/CouponManagementList", element: <CouponManagementList /> },
      { path: "/CreateCouponManagement", element: <CreateCouponManagement /> },
      { path: "/CreateCouponManagement/:id", element: <CreateCouponManagement /> },
      { path: "/CreateEmailMarketing", element: <CreateEmailMarketing /> },
      { path: "/EmailMarketingList", element: <EmailMarketingList /> },
      { path: "/CreateSEOSetting", element: <CreateSEOSetting /> },
      { path: "/SEOSettingList", element: <SEOSettingList /> },
      { path: "/SEOSetting", element: <SEOSEtting /> },
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
      // MMl Dashboard
      { path: "/mlmdashboard", element: <MlmDashboard /> },
      { path: "/usertree", element: <UserTree /> },
      { path: "/reports", element: <Earning /> },
      { path: "/levelwise", element: <LevelWise /> },
      { path: "/membergrowth", element: <MemberGrowth /> },
      // Payment Provider Management 
      { path: "/payment-providers", element: <PaymentProviderManagement /> },
      { path: "/payment-provider/:id", element: <PaymentProviderDetails /> },
      { path: "/addstripe", element: <AddStripe /> },
      { path: "/addprovider", element: <AddProvider /> },
      // Shipping Provider Management
      { path: "/shipping-mangement", element: <ShippingProviderManagement /> },
      { path: "/add-shipping-provider", element: <AddShipping /> },
      { path: "/add-shiprocket", element: <AddShipRocket /> },
      { path: "/shipping-provider/:id", element: <ShippingProviderDetail /> },
      // Domain Section
      { path: "/domains", element: <Domain /> },
      { path: "/ssl", element: <Ssl /> },
      { path: "/dns", element: <Dns /> },
      { path: "/subdomains", element: <SubDomain /> },
      { path: "/add-dns-record", element: <AddDnsRecord /> },
      { path: "/add-subdomain", element: <AddSubdomain /> },
      { path: "/add-ssl-certificate", element: <AddSslCertificate /> },

      //Magento 
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/MagentoOrders", element: <MagentoOrderList /> },
          { path: "/MogentoOrder/:id", element: <MogentoOrder /> },
          { path: "/MagentoProducts", element: <MagentoProductList /> },
          { path: "/AddMagentoProduct", element: <AddMagentoProduct /> },
          { path: "/AddMagentoProduct/:sku", element: <AddMagentoProduct /> },
          { path: "/AddMagentoCategory", element: <AddMagentoCategory /> },
          { path: "/AddMagentoCategory/:id", element: <AddMagentoCategory /> },
          { path: "/MagentoCategoryList", element: <MagentoCategoryList /> },
          { path: "/AddMagentoCustomer", element: <AddMagentoCustomer /> },
          { path: "/MagentoCustomerList", element: <MagentoCustomerList /> },
          { path: "/AddMagentoCustomer/:id", element: <AddMagentoCustomer /> },
          { path: "/customers/:id", element: <AddMagentoCustomer /> },
          { path: "/MagentoStoreList", element: <MagentoManageStoresList /> },
          { path: "/MagentoInventoryList", element: <MagentoInventoryList /> },
          { path: "/UpdateMagentoInventory/:sku/:itemId", element: <UpdateMagentoInventory /> },
          { path: "/MagentoAttributesLits", element: <MagentoAttributesLits /> },
          { path: "/AddMagentoAttribute", element: <AddMagentoAttribute /> },
          { path: "/AddMagentoAttribute/:attribute_code", element: <AddMagentoAttribute /> },
          { path: "/MagentoAttributeSets", element: <MagentoAttributeSetsList /> },
          { path: "/AddMagentoAttributeSet", element: <AddMagentoAttributeSet /> },
          // { path: "/AddMagentoAttributeSet/:id", element: <AddMagentoAttributeSet /> }
          { path: "/MagentoPaymentService", element: <MagentoPaymentServices /> },
          { path: "/MagentoInvoiceList", element: <MagentoInvoiceList /> },
          { path: "/MagentoInvoiceDetail", element: <MagentoInvoiceDetail /> },
          { path: "/MagentoShipments", element: <MagentoShipmentList /> },
          { path: "/shipment/:id", element: < MagentoShipmentDetail /> },
          { path: "/MagentoCreditMemos", element: <MagentoCreditMemoList /> },
          { path: "/MagentoCreditMemoDetail", element: <MagentoCreditMemoDetail /> },
          { path: "/OnlineCustomers", element: <MagentoOnlineCustomers /> },
          { path: "/MagentoCustomerGroupsList", element: <MagentoCustomerGroupsList /> },
          { path: "/AddMagentoCustomerGroup/:id", element: <AddMagentoCustomerGroup /> },
          { path: "/AddMagentoCustomerGroup", element: <AddMagentoCustomerGroup /> },
          { path: "/AddCatalogPriceRule", element: <AddMagentoCatalogPriceRule /> },
          { path: "/AddCatalogPriceRule/:id", element: <AddMagentoCatalogPriceRule /> },
          { path: "/MagentoCatalogPriceRuleList", element: <MagentoCatalogPriceRuleList /> },
          { path: "/MagentoCartPriceRulesList", element: <MagentoCartPriceRulesList /> },
          { path: "/AddCartPriceRule", element: <AddMagentoCartPriceRule /> },
          { path: "/AddCartPriceRule/:id", element: <AddMagentoCartPriceRule /> },
          { path: "/MagentoUrlRewritesList", element: <MagentoUrlRewritesList /> },
          { path: "/AddMagentoUrlRewrite", element: <AddMagentoUrlRewrite /> },
          { path: "/AddMagentoUrlRewrite/:id", element: <AddMagentoUrlRewrite /> },
          { path: "/MagentoSearchTermsList", element: <MagentoSearchTermsList /> },
          { path: "/AddMagentoSearchTerm", element: <AddMagentoSearchTerm /> },
          { path: "/AddMagentoSearchTerm/:id", element: <AddMagentoSearchTerm /> },
          { path: "/AddMagentoSearchSynonym/:id", element: <AddMagentoSearchSynonym /> },
          { path: "/AddMagentoSearchSynonym", element: <AddMagentoSearchSynonym /> },
          { path: "/MagentoSearchSynonymsList", element: <MagentoSearchSynonymsList /> },
          { path: "/MagentoSitemapList", element: <MagentoSitemapList /> },
          { path: "/AddMagentoSitemap", element: <AddMagentoSitemap /> },
          { path: "/AddMagentoSitemap/:id", element: <AddMagentoSitemap /> },
          { path: "/MagentoReviewsList", element: <MagentoReviewsList /> },
          { path: "/AddMagentoReview", element: <AddMagentoReview /> },
          { path: "/AddMagentoReview/:id", element: <AddMagentoReview /> },
          { path: "/MagentoEmailTemplatesList", element: <MagentoEmailTemplatesList /> },
          { path: "/AddMagentoEmailTemplate", element: <AddMagentoEmailTemplate /> },
          { path: "/MagentoNewsletterTemplatesList", element: <MagentoNewsletterTemplatesList /> },
          { path: "/AddMagentoNewsletterTemplate", element: <AddMagentoNewsletterTemplate /> },
          { path: "/AddMagentoNewsletterTemplate/:id", element: <AddMagentoNewsletterTemplate /> },
          { path: "/AddMagentoStor/:id", element: <AddMagentoStor /> },
          { path: "/AddMagentoStor", element: <AddMagentoStor /> },
          { path: "/MagentoConfigurationList", element: <MagentoConfigurationList /> },
          { path: "/MagentoTermsConditionsList", element: <MagentoTermsConditionsList /> },
          { path: "/AddMagentoTermsCondition", element: <AddMagentoTermsCondition /> },
          { path: "/AddMagentoTermsCondition/:id", element: <AddMagentoTermsCondition /> },
          { path: "/MagentoOrderStatusList", element: <MagentoOrderStatusList /> },
          { path: "/AddMagentoOrderStatus", element: <AddMagentoOrderStatus /> },
          { path: "/AddMagentoOrderStatus/:id", element: <AddMagentoOrderStatus /> },
          { path: "/MagentoSourcesList", element: <MagentoSourcesList /> },
          { path: "/AddMagentoSource", element: <AddMagentoSource /> },
          { path: "/MagentoTaxRulesList", element: <MagentoTaxRulesList /> },
          { path: "/AddMagentoTaxRule", element: <AddMagentoTaxRule /> },

        ]
      },
    ]
  },

  { path: "*", element: <NotFound /> },
  { path: "/login", element: <Login /> },
  { path: "/otp", element: <EnterOTP /> },
  { path: "/pass", element: <ForgotPassword /> },
  { path: "/ddd", element: <Dashboard /> },
  { path: "/signup", element: <Signup /> },
])
