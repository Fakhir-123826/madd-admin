import { createBrowserRouter, useNavigate } from "react-router-dom";
import Login from './screens/Login.tsx'
import Signup from './screens/Signup.tsx'
import VerifyEmail from "./screens/VerifyEmail.tsx";
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
import MagentoOrderList from "./screens/Magento/Sales/Order/MagentoOrderList.tsx";
import MagentoProductList from "./screens/Magento/Product/MagentoProductList.tsx";
import AddMagentoProduct from "./screens/Magento/Product/AddMagentoProduct.tsx";
import AddMagentoCategory from "./screens/Magento/Category/AddMagentoCategory.tsx";
import MagentoCategoryList from "./screens/Magento/Category/MagentoCategoryList.tsx";
import MagentoCustomerList from "./screens/Magento/Customers/MagentoCustomerList.tsx";
import AddMagentoCustomer from "./screens/Magento/Customers/AddMagentoCustomer.tsx";
import MogentoOrder from "./screens/Magento/Sales/Order/MagentoOrder.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import MagentoInventoryList from "./screens/Magento/Inventory/MagentoInventoryList.tsx";
import UpdateMagentoInventory from "./screens/Magento/Inventory/UpdateMagentoInventory.tsx";
import MagentoAttributesLits from "./screens/Magento/Stores/Attributes/MagentoAttributesLits.tsx";
import AddMagentoAttribute from "./screens/Magento/Stores/Attributes/AddMagentoAttribute.tsx";
import MagentoAttributeSetsList from "./screens/Magento/Stores/AttributeSet/MagentoAttributeSetsList.tsx";
import AddMagentoAttributeSet from "./screens/Magento/Stores/AttributeSet/AddMagentoAttributeSet.tsx";
import NotFound from "./component/NotFound.tsx";
import MagentoPaymentServices from "./screens/Magento/Sales/PaymentService/MagentoPaymentServices.tsx";
import MagentoInvoiceList from "./screens/Magento/Sales/Invoices/MagentoInvoiceList.tsx";
import MagentoInvoiceDetail from "./screens/Magento/Sales/Invoices/MagentoInvoiceDetail.tsx";
import MagentoShipmentList from "./screens/Magento/Sales/Shipment/Magentoshipmentlist.tsx";
import MagentoShipmentDetail from "./screens/Magento/Sales/Shipment/Magentoshipmentdetail.tsx";
import MagentoCreditMemoList from "./screens/Magento/Sales/CreditMemo/Magentocreditmemolist.tsx";
import MagentoCreditMemoDetail from "./screens/Magento/Sales/CreditMemo/Magentocreditmemodetail.tsx";
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
import MagentoProductRatingsList from "./screens/Magento/Stores/Rating/MagentoProductRatingsList.tsx";
import AddMagentoRating from "./screens/Magento/Stores/Rating/AddMagentoProductRating.tsx";
import MagentoStockList from "./screens/Magento/Stores/Stock/MagentoStockList.tsx";
import AddMagentoStock from "./screens/Magento/Stores/Stock/AddMagentoStock.tsx";
import MagentoTaxZonesList from "./screens/Magento/Stores/TaxZoneAndRates/MagentoTaxZonesList.tsx";
import AddMagentoTaxZone from "./screens/Magento/Stores/TaxZoneAndRates/AddMagentoTaxZone.tsx";
import AddCurrencySymbols from "./screens/Magento/Stores/CurrencySymbols/AddCurrencySymbols.tsx";
import AddCurrencyRates from "./screens/Magento/Stores/CurrencyRates/AddCurrencyRates.tsx";
import MagentoBillingAgreementsList from "./screens/Magento/Sales/BillingAgreements/MagentoBillingAgreementsList.tsx";
import MagentoTransactionList from "./screens/Magento/Sales/Transactions/MagentoTransactionList.tsx";
import BraintreeVirtualTerminal from "./screens/Magento/Sales/BraintreeVirtualTerminal/BraintreeVirtualTerminal.tsx";
import MagentoProductsInCartsList from "./screens/Magento/Reports/ProductsInCart/MagentoProductsInCartsList.tsx";
import MagentoSearchTermsListForReports from "./screens/Magento/Reports/SearchTerms/MagentoSearchTermsListForReports.tsx";
import MagentoAbandonedCartsList from "./screens/Magento/Reports/AbandonedCarts/MagentoAbandonedCartsList.tsx";
import MagentoNewsletterProblemsReportList from "./screens/Magento/Reports/NewsletterProblemReports/MagentoNewsletterProblemsReportList.tsx";
import MagentoCustomerReviewsReportList from "./screens/Magento/Reports/ByCustomers/MagentoCustomerReviewsReportList.tsx";
import MagentoProductReviewsReportList from "./screens/Magento/Reports/ByProducts/MagentoProductReviewsReportList.tsx";
import MagentoOrderUpdatedReportList from "./screens/Magento/Reports/Orders/MagentoOrderUpdatedReportList.tsx";
import MagentoTaxReportList from "./screens/Magento/Reports/Tax/MagentoTaxReportList.tsx";
import MagentoInvoiceReportList from "./screens/Magento/Reports/Invoiced/MagentoInvoiceReportList.tsx";
import MagentoShippingReportList from "./screens/Magento/Reports/Shipping/MagentoShippingReportList.tsx";
import MagentoRefundsReportList from "./screens/Magento/Reports/Refunds/MagentoRefundsReportList.tsx";
import MagentoCouponsReportList from "./screens/Magento/Reports/Coupons/MagentoCouponsReportList.tsx";
import MagentoPayPalSettlementReportList from "./screens/Magento/Reports/PayPalSettlement/MagentoPayPalSettlementReportList.tsx";
import MagentoBraintreeSettlementReportList from "./screens/Magento/Reports/BraintreeSettlement/MagentoBraintreeSettlementReportList.tsx";
import MagentoOrderTotalReportList from "./screens/Magento/Reports/OrderTotal/MagentoOrderTotalReportList.tsx";
import MagentoOrderCountReportList from "./screens/Magento/Reports/OrderCount/MagentoOrderCountReportList.tsx";
import MagentoNewAccountsReportList from "./screens/Magento/Reports/New/MagentoNewAccountsReportList.tsx";
import MagentoProductViewsReportList from "./screens/Magento/Reports/Views/MagentoProductViewsReportList.tsx";
import MagentoBestsellersReportList from "./screens/Magento/Reports/Bestsellers/MagentoBestsellersReportList.tsx";
import MagentoLowStockReportList from "./screens/Magento/Reports/LowStock/MagentoLowStockReportList.tsx";
import MagentoOrderedProductsReportList from "./screens/Magento/Reports/Ordered/MagentoOrderedProductsReportList.tsx";
import MagentoDownloadsReportList from "./screens/Magento/Reports/Downloads/MagentoDownloadsReportList.tsx";
import PageBuilderScreen from "./screens/Magento/Content/Pages/PageBuilder/PageBuilderScreen.tsx";
import MagentoNotificationsList from "./screens/System/Notification/MagentoNotificationsList.tsx";


import SettlementList from "./screens/Settlements/Settlementlist.tsx";
import SettlementDetail from "./screens/Settlements/SettlementDetail.tsx";
import GenerateSettlement from "./screens/Settlements/GenerateSettlement.tsx";
// router.tsx

// ==================== ROUTE CONSTANTS ====================
export const ROUTES = {
  // Public Routes
  LOGIN: "/login",
  OTP: "/otp",
  FORGOT_PASSWORD: "/forgot-password",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  RESET_PASSWORD: "/reset-password",
  PAGE_BUILDER: "/page-builder",
  NOT_FOUND: "*",

  // Protected Routes
  DASHBOARD: "/",

  // Store Section
  STORE_LIST: "/storeList",
  STORE_CARD_LIST: "/storeCardList",
  STORE: "/store",
  CREATE_STORE: "/CreateStore",

  // Order Section
  ORDER_LIST: "/orderlist",
  ADD_ORDER: "/addorder",
  ORDER_DETAILS: (id: string | number = ":id") => `/order/${id}`,

  // Vendor Section
  VENDOR_LIST: "/Vendor",
  VENDOR_DETAIL: "/Verder1",
  CREATE_VENDOR: "/CreateVerder",
  CREATE_VENDOR_ONBOARD: "/CreateVerderOnboard",
  VENDOR_ONBOARD: "/VerderOnboard",
  VENDOR_DASHBOARD: "/VendorDashBoard",

  // Subscription Section
  CREATE_SUBSCRIPTION: "/CreateSubscription",
  SUBSCRIPTION_LIST: "/SubscriptionList",
  EDIT_SUBSCRIPTION: (id: string | number = ":id") => `/CreateSubscription/${id}`,

  // Catalog - Category
  CATEGORY_LIST: "/CategoryList",
  CATEGORY_DETAIL: "/Category",
  CREATE_CATEGORY: "/CreateCategory",
  EDIT_CATEGORY: (id: string | number = ":id") => `/CreateCategory/${id}`,

  // Catalog - Inventory
  INVENTORY_LIST: "/InventoryManagementList",
  CREATE_INVENTORY: "/CreateInventoryManagement",
  EDIT_INVENTORY: (id: string | number = ":id") => `/CreateInventoryManagement/${id}`,

  // Catalog - Legality Control
  LEGALITY_CONTROL_LIST: "/LegalityControlList",
  CREATE_LEGALITY_CONTROL: "/CreatelegalityControl",
  EDIT_LEGALITY_CONTROL: (id: string | number = ":id") => `/CreatelegalityControl/${id}`,

  // Catalog - Product Base
  PRODUCT_BASE_LIST: "/ProductBaseList",
  PRODUCT_BASE_DETAIL: "/ProductBase",
  CREATE_PRODUCT_BASE: "/CreateProductBase",
  EDIT_PRODUCT_BASE: (id: string | number = ":id") => `/CreateProductBase/${id}`,

  // Catalog - Product Sharing
  PRODUCT_SHARING_LIST: "/ProductSharingList",
  CREATE_PRODUCT_SHARING: "/CreateProductSharing",
  EDIT_PRODUCT_SHARING: (id: string | number = ":id") => `/CreateProductSharing/${id}`,

  // Coupon Management
  COUPON_MANAGEMENT: "/CouponManagement",
  COUPON_LIST: "/CouponManagementList",
  CREATE_COUPON: "/CreateCouponManagement",
  EDIT_COUPON: (id: string | number = ":id") => `/CreateCouponManagement/${id}`,

  // Email Marketing
  CREATE_EMAIL_MARKETING: "/CreateEmailMarketing",
  EMAIL_MARKETING_LIST: "/EmailMarketingList",

  // SEO Settings
  CREATE_SEO_SETTING: "/CreateSEOSetting",
  SEO_SETTING_LIST: "/SEOSettingList",
  SEO_SETTING_DETAIL: "/SEOSetting",

  // Users
  USER_LIST: "/userlist",
  ADD_USER: "/adduser",
  USER_DETAILS: (id: string | number = ":id") => `/user/${id}`,

  // User Roles
  USER_ROLES: "/usersroles",
  ADD_ROLE: "/addrole",
  ROLE_DETAILS: (id: string | number = ":id") => `/role/${id}`,

  // User Groups
  USER_GROUPS: "/usersgroup",
  ADD_GROUP: "/addgroup",
  GROUP_DETAILS: (id: string | number = ":id") => `/group/${id}`,

  // Local Companies
  COUNTRY_MANAGEMENT: "/country-management",
  ADD_COUNTRY: "/addcountry",
  CURRENCY_MANAGEMENT: "/currency-management",
  ADD_CURRENCY: "/addcurrency",
  LANGUAGE_MANAGEMENT: "/language-management",
  ADD_LANGUAGE: "/addlanguage",

  // Taxes
  TAXES: "/taxes",
  ADD_RULE: "/add-rule",
  INVOICE_MANAGEMENT: "/invoicemanagement",

  // Settings
  TRANSLATION: "/translation",
  UPDATES: "/updates",
  BACKUPS: "/backups",
  ADD_BACKUP: "/addbackup",
  AUDIT_LOGS: "/auditlogs",

  // MLM Dashboard
  MLM_DASHBOARD: "/mlmdashboard",
  USER_TREE: "/usertree",
  EARNINGS_REPORT: "/reports",
  LEVEL_WISE: "/levelwise",
  MEMBER_GROWTH: "/membergrowth",

  // Payment Providers
  PAYMENT_PROVIDERS: "/payment-providers",
  PAYMENT_PROVIDER_DETAILS: (id: string | number = ":id") => `/payment-provider/${id}`,
  ADD_STRIPE: "/addstripe",
  ADD_PROVIDER: "/addprovider",

  // Shipping Providers
  SHIPPING_MANAGEMENT: "/shipping-mangement",
  ADD_SHIPPING_PROVIDER: "/add-shipping-provider",
  ADD_SHIPROCKET: "/add-shiprocket",
  SHIPPING_PROVIDER_DETAILS: (id: string | number = ":id") => `/shipping-provider/${id}`,

  // Domain Management
  DOMAINS: "/domains",
  SSL: "/ssl",
  DNS: "/dns",
  SUBDOMAINS: "/subdomains",
  ADD_DNS_RECORD: "/add-dns-record",
  ADD_SUBDOMAIN: "/add-subdomain",
  ADD_SSL_CERTIFICATE: "/add-ssl-certificate",

  // Magento - Orders
  MAGENTO_ORDERS: "/MagentoOrders",
  MAGENTO_ORDER_DETAILS: (id: string | number = ":id") => `/MogentoOrder/${id}`,

  // Magento - Products
  MAGENTO_PRODUCTS: "/MagentoProducts",
  ADD_MAGENTO_PRODUCT: "/AddMagentoProduct",
  EDIT_MAGENTO_PRODUCT: (sku: string = ":sku") => `/AddMagentoProduct/${sku}`,

  // Magento - Categories
  ADD_MAGENTO_CATEGORY: "/AddMagentoCategory",
  EDIT_MAGENTO_CATEGORY: (id: string | number = ":id") => `/AddMagentoCategory/${id}`,
  MAGENTO_CATEGORY_LIST: "/MagentoCategoryList",

  // Magento - Customers
  ADD_MAGENTO_CUSTOMER: "/AddMagentoCustomer",
  EDIT_MAGENTO_CUSTOMER: (id: string | number = ":id") => `/AddMagentoCustomer/${id}`,
  MAGENTO_CUSTOMER_LIST: "/MagentoCustomerList",
  CUSTOMER_DETAILS: (id: string | number = ":id") => `/customers/${id}`,

  // Magento - Stores
  MAGENTO_STORE_LIST: "/MagentoStoreList",

  // Magento - Inventory
  MAGENTO_INVENTORY_LIST: "/MagentoInventoryList",
  UPDATE_MAGENTO_INVENTORY: (sku: string = ":sku", itemId: string = ":itemId") => `/UpdateMagentoInventory/${sku}/${itemId}`,

  // Magento - Attributes
  MAGENTO_ATTRIBUTES_LIST: "/MagentoAttributesLits",
  ADD_MAGENTO_ATTRIBUTE: "/AddMagentoAttribute",
  EDIT_MAGENTO_ATTRIBUTE: (code: string = ":attribute_code") => `/AddMagentoAttribute/${code}`,
  MAGENTO_ATTRIBUTE_SETS: "/MagentoAttributeSets",
  ADD_MAGENTO_ATTRIBUTE_SET: "/AddMagentoAttributeSet",

  // Magento - Sales
  MAGENTO_PAYMENT_SERVICE: "/MagentoPaymentService",
  MAGENTO_INVOICE_LIST: "/MagentoInvoiceList",
  MAGENTO_INVOICE_DETAIL: "/MagentoInvoiceDetail",
  MAGENTO_SHIPMENTS: "/MagentoShipments",
  MAGENTO_SHIPMENT_DETAILS: (id: string | number = ":id") => `/shipment/${id}`,
  MAGENTO_CREDIT_MEMOS: "/MagentoCreditMemos",
  MAGENTO_CREDIT_MEMO_DETAIL: "/MagentoCreditMemoDetail",
  ONLINE_CUSTOMERS: "/OnlineCustomers",

  // Magento - Customer Groups
  MAGENTO_CUSTOMER_GROUPS_LIST: "/MagentoCustomerGroupsList",
  ADD_MAGENTO_CUSTOMER_GROUP: "/AddMagentoCustomerGroup",
  EDIT_MAGENTO_CUSTOMER_GROUP: (id: string | number = ":id") => `/AddMagentoCustomerGroup/${id}`,

  // Magento - Marketing
  ADD_CATALOG_PRICE_RULE: "/AddCatalogPriceRule",
  EDIT_CATALOG_PRICE_RULE: (id: string | number = ":id") => `/AddCatalogPriceRule/${id}`,
  MAGENTO_CATALOG_PRICE_RULE_LIST: "/MagentoCatalogPriceRuleList",
  MAGENTO_CART_PRICE_RULES_LIST: "/MagentoCartPriceRulesList",
  ADD_CART_PRICE_RULE: "/AddCartPriceRule",
  EDIT_CART_PRICE_RULE: (id: string | number = ":id") => `/AddCartPriceRule/${id}`,
  MAGENTO_URL_REWRITES_LIST: "/MagentoUrlRewritesList",
  ADD_MAGENTO_URL_REWRITE: "/AddMagentoUrlRewrite",
  EDIT_MAGENTO_URL_REWRITE: (id: string | number = ":id") => `/AddMagentoUrlRewrite/${id}`,
  MAGENTO_SEARCH_TERMS_LIST: "/MagentoSearchTermsList",
  ADD_MAGENTO_SEARCH_TERM: "/AddMagentoSearchTerm",
  EDIT_MAGENTO_SEARCH_TERM: (id: string | number = ":id") => `/AddMagentoSearchTerm/${id}`,
  ADD_MAGENTO_SEARCH_SYNONYM: "/AddMagentoSearchSynonym",
  EDIT_MAGENTO_SEARCH_SYNONYM: (id: string | number = ":id") => `/AddMagentoSearchSynonym/${id}`,
  MAGENTO_SEARCH_SYNONYMS_LIST: "/MagentoSearchSynonymsList",
  MAGENTO_SITEMAP_LIST: "/MagentoSitemapList",
  ADD_MAGENTO_SITEMAP: "/AddMagentoSitemap",
  EDIT_MAGENTO_SITEMAP: (id: string | number = ":id") => `/AddMagentoSitemap/${id}`,
  MAGENTO_REVIEWS_LIST: "/MagentoReviewsList",
  ADD_MAGENTO_REVIEW: "/AddMagentoReview",
  EDIT_MAGENTO_REVIEW: (id: string | number = ":id") => `/AddMagentoReview/${id}`,
  MAGENTO_EMAIL_TEMPLATES_LIST: "/MagentoEmailTemplatesList",
  ADD_MAGENTO_EMAIL_TEMPLATE: "/AddMagentoEmailTemplate",
  MAGENTO_NEWSLETTER_TEMPLATES_LIST: "/MagentoNewsletterTemplatesList",
  ADD_MAGENTO_NEWSLETTER_TEMPLATE: "/AddMagentoNewsletterTemplate",
  EDIT_MAGENTO_NEWSLETTER_TEMPLATE: (id: string | number = ":id") => `/AddMagentoNewsletterTemplate/${id}`,

  // Magento - Store Management
  ADD_MAGENTO_STORE: "/AddMagentoStor",
  EDIT_MAGENTO_STORE: (id: string | number = ":id") => `/AddMagentoStor/${id}`,
  MAGENTO_CONFIGURATION_LIST: "/MagentoConfigurationList",
  MAGENTO_TERMS_CONDITIONS_LIST: "/MagentoTermsConditionsList",
  ADD_MAGENTO_TERMS_CONDITION: "/AddMagentoTermsCondition",
  EDIT_MAGENTO_TERMS_CONDITION: (id: string | number = ":id") => `/AddMagentoTermsCondition/${id}`,
  MAGENTO_ORDER_STATUS_LIST: "/MagentoOrderStatusList",
  ADD_MAGENTO_ORDER_STATUS: "/AddMagentoOrderStatus",
  EDIT_MAGENTO_ORDER_STATUS: (id: string | number = ":id") => `/AddMagentoOrderStatus/${id}`,
  MAGENTO_SOURCES_LIST: "/MagentoSourcesList",
  ADD_MAGENTO_SOURCE: "/AddMagentoSource",
  MAGENTO_TAX_RULES_LIST: "/MagentoTaxRulesList",
  ADD_MAGENTO_TAX_RULE: "/AddMagentoTaxRule",
  ADD_CURRENCY_SYMBOLS: "/AddCurrencySymbols",
  ADD_CURRENCY_RATES: "/AddCurrencyRates",
  MAGENTO_PRODUCT_RATINGS_LIST: "/MagentoProductRatingsList",
  MAGENTO_TAX_ZONES_LIST: "/MagentoTaxZonesList",
  ADD_MAGENTO_TAX_ZONE: "/AddMagentoTaxZone",
  ADD_MAGENTO_RATING: "/AddMagentoRating",
  MAGENTO_STOCK_LIST: "/MagentoStockList",
  ADD_MAGENTO_STOCK: "/AddMagentoStock",
  MAGENTO_BILLING_AGREEMENTS_LIST: "/MagentoBillingAgreementsList",
  MAGENTO_TRANSACTION_LIST: "/MagentoTransactionList",
  BRAINTREE_VIRTUAL_TERMINAL: "/BraintreeVirtualTerminal",

  // Magento - Reports
  MAGENTO_PRODUCTS_IN_CARTS_LIST: "/MagentoProductsInCartsList",
  MAGENTO_SEARCH_TERMS_REPORT: "/MagentoSearchTermsListForReports",
  MAGENTO_ABANDONED_CARTS_LIST: "/MagentoAbandonedCartsList",
  MAGENTO_NEWSLETTER_PROBLEMS_REPORT: "/MagentoNewsletterProblemsReportList",
  MAGENTO_CUSTOMER_REVIEWS_REPORT: "/MagentoCustomerReviewsReportList",
  MAGENTO_PRODUCT_REVIEWS_REPORT: "/MagentoProductReviewsReportList",
  MAGENTO_ORDER_UPDATED_REPORT: "/MagentoOrderUpdatedReportList",
  MAGENTO_TAX_REPORT: "/MagentoTaxReportList",
  MAGENTO_INVOICE_REPORT: "/MagentoInvoiceReportList",
  MAGENTO_SHIPPING_REPORT: "/MagentoShippingReportList",
  MAGENTO_REFUNDS_REPORT: "/MagentoRefundsReportList",
  MAGENTO_COUPONS_REPORT: "/MagentoCouponsReportList",
  MAGENTO_PAYPAL_SETTLEMENT_REPORT: "/MagentoPayPalSettlementReportList",
  MAGENTO_BRAINTREE_SETTLEMENT_REPORT: "/MagentoBraintreeSettlementReportList",
  MAGENTO_ORDER_TOTAL_REPORT: "/MagentoOrderTotalReportList",
  MAGENTO_ORDER_COUNT_REPORT: "/MagentoOrderCountReportList",
  MAGENTO_NEW_ACCOUNTS_REPORT: "/MagentoNewAccountsReportList",
  MAGENTO_PRODUCT_VIEWS_REPORT: "/MagentoProductViewsReportList",
  MAGENTO_BESTSELLERS_REPORT: "/MagentoBestsellersReportList",
  MAGENTO_LOW_STOCK_REPORT: "/MagentoLowStockReportList",
  MAGENTO_ORDERED_PRODUCTS_REPORT: "/MagentoOrderedProductsReportList",
  MAGENTO_DOWNLOADS_REPORT: "/MagentoDownloadsReportList",
  MAGENTO_NOTIFICATIONS_LIST: "/MagentoNotificationsList",

  VENDOR: "/Verdor",


MAGENTO_SETTLEMENTS_LIST: "/settlements",
MAGENTO_SETTLEMENT_DETAIL: (id: string | number = ":id") => `/settlements/${id}`,
MAGENTO_SETTLEMENT_GENERATE: "/settlements/generate",




} as const;

// ==================== ROUTE CONFIGURATION ====================
const protectedRoutes = [
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },

  // Store Section
  { path: ROUTES.STORE_LIST, element: <StoreList /> },
  { path: ROUTES.STORE_CARD_LIST, element: <StoreCardList /> },
  { path: ROUTES.STORE, element: <Store /> },
  { path: ROUTES.CREATE_STORE, element: <CreateStore /> },

  // Order Section
  { path: ROUTES.ORDER_LIST, element: <OrderList /> },
  { path: ROUTES.ADD_ORDER, element: <AddOrder /> },
  { path: ROUTES.ORDER_DETAILS(), element: <OrderDetails /> },

  // Vendor Section
  { path: ROUTES.VENDOR_LIST, element: <VendorList /> },
  { path: ROUTES.VENDOR_DETAIL, element: <Vendor /> },
  { path: ROUTES.CREATE_VENDOR, element: <CreateVendor /> },
  { path: ROUTES.CREATE_VENDOR_ONBOARD, element: <CreateVendoronBoard /> },
  { path: ROUTES.VENDOR_ONBOARD, element: <VendorOnboard /> },
  { path: ROUTES.VENDOR_DASHBOARD, element: <VendorDashBoard /> },

  // Subscription Section
  { path: ROUTES.CREATE_SUBSCRIPTION, element: <CreateSubscription /> },
  { path: ROUTES.SUBSCRIPTION_LIST, element: <SubscriptionList /> },
  { path: ROUTES.EDIT_SUBSCRIPTION(), element: <CreateSubscription /> },

  // Catalog - Category
  { path: ROUTES.CATEGORY_LIST, element: <CategoryList /> },
  { path: ROUTES.CATEGORY_DETAIL, element: <Category /> },
  { path: ROUTES.CREATE_CATEGORY, element: <CreateCategory /> },
  { path: ROUTES.EDIT_CATEGORY(), element: <CreateCategory /> },

  // Catalog - Inventory
  { path: ROUTES.INVENTORY_LIST, element: <InventoryManagementList /> },
  { path: ROUTES.CREATE_INVENTORY, element: <CreateInventoryManagement /> },
  { path: ROUTES.EDIT_INVENTORY(), element: <CreateInventoryManagement /> },

  // Catalog - Legality Control
  { path: ROUTES.LEGALITY_CONTROL_LIST, element: <LegalityControlList /> },
  { path: ROUTES.CREATE_LEGALITY_CONTROL, element: <CreatelegalityControl /> },
  { path: ROUTES.EDIT_LEGALITY_CONTROL(), element: <CreatelegalityControl /> },

  // Catalog - Product Base
  { path: ROUTES.PRODUCT_BASE_LIST, element: <ProductBaseList /> },
  { path: ROUTES.PRODUCT_BASE_DETAIL, element: <ProductBase /> },
  { path: ROUTES.CREATE_PRODUCT_BASE, element: <CreateProductBase /> },
  { path: ROUTES.EDIT_PRODUCT_BASE(), element: <CreateProductBase /> },

  // Catalog - Product Sharing
  { path: ROUTES.PRODUCT_SHARING_LIST, element: <ProductSharingList /> },
  { path: ROUTES.CREATE_PRODUCT_SHARING, element: <CreateProductSharing /> },
  { path: ROUTES.EDIT_PRODUCT_SHARING(), element: <CreateProductSharing /> },

  // Coupon Management
  { path: ROUTES.COUPON_MANAGEMENT, element: <CouponManagement /> },
  { path: ROUTES.COUPON_LIST, element: <CouponManagementList /> },
  { path: ROUTES.CREATE_COUPON, element: <CreateCouponManagement /> },
  { path: ROUTES.EDIT_COUPON(), element: <CreateCouponManagement /> },

  // Email Marketing
  { path: ROUTES.CREATE_EMAIL_MARKETING, element: <CreateEmailMarketing /> },
  { path: ROUTES.EMAIL_MARKETING_LIST, element: <EmailMarketingList /> },

  // SEO Settings
  { path: ROUTES.CREATE_SEO_SETTING, element: <CreateSEOSetting /> },
  { path: ROUTES.SEO_SETTING_LIST, element: <SEOSettingList /> },
  { path: ROUTES.SEO_SETTING_DETAIL, element: <SEOSEtting /> },

  // Users
  { path: ROUTES.USER_LIST, element: <UserList /> },
  { path: ROUTES.ADD_USER, element: <AddUser /> },
  { path: ROUTES.USER_DETAILS(), element: <UserDetails /> },

  // User Roles
  { path: ROUTES.USER_ROLES, element: <UsersRoles /> },
  { path: ROUTES.ADD_ROLE, element: <AddRole /> },
  { path: ROUTES.ROLE_DETAILS(), element: <RoleDetails /> },

  // User Groups
  { path: ROUTES.USER_GROUPS, element: <UsersGroup /> },
  { path: ROUTES.ADD_GROUP, element: <AddGroup /> },
  { path: ROUTES.GROUP_DETAILS(), element: <GroupDetails /> },

  // Local Companies
  { path: ROUTES.COUNTRY_MANAGEMENT, element: <CountryManagement /> },
  { path: ROUTES.ADD_COUNTRY, element: <AddCountry /> },
  { path: ROUTES.CURRENCY_MANAGEMENT, element: <CurrencyManagement /> },
  { path: ROUTES.ADD_CURRENCY, element: <AddCurrency /> },
  { path: ROUTES.LANGUAGE_MANAGEMENT, element: <LanguageManagement /> },
  { path: ROUTES.ADD_LANGUAGE, element: <AddLanguage /> },

  // Taxes
  { path: ROUTES.TAXES, element: <Taxes /> },
  { path: ROUTES.ADD_RULE, element: <AddRule /> },
  { path: ROUTES.INVOICE_MANAGEMENT, element: <InvoiceManagement /> },

  // Settings
  { path: ROUTES.TRANSLATION, element: <Translation /> },
  { path: ROUTES.UPDATES, element: <Updates /> },
  { path: ROUTES.BACKUPS, element: <Backups /> },
  { path: ROUTES.ADD_BACKUP, element: <AddBackup /> },
  { path: ROUTES.AUDIT_LOGS, element: <AuditLogs /> },

  // MLM Dashboard
  { path: ROUTES.MLM_DASHBOARD, element: <MlmDashboard /> },
  { path: ROUTES.USER_TREE, element: <UserTree /> },
  { path: ROUTES.EARNINGS_REPORT, element: <Earning /> },
  { path: ROUTES.LEVEL_WISE, element: <LevelWise /> },
  { path: ROUTES.MEMBER_GROWTH, element: <MemberGrowth /> },

  // Payment Providers
  { path: ROUTES.PAYMENT_PROVIDERS, element: <PaymentProviderManagement /> },
  { path: ROUTES.PAYMENT_PROVIDER_DETAILS(), element: <PaymentProviderDetails /> },
  { path: ROUTES.ADD_STRIPE, element: <AddStripe /> },
  { path: ROUTES.ADD_PROVIDER, element: <AddProvider /> },

  // Shipping Providers
  { path: ROUTES.SHIPPING_MANAGEMENT, element: <ShippingProviderManagement /> },
  { path: ROUTES.ADD_SHIPPING_PROVIDER, element: <AddShipping /> },
  { path: ROUTES.ADD_SHIPROCKET, element: <AddShipRocket /> },
  { path: ROUTES.SHIPPING_PROVIDER_DETAILS(), element: <ShippingProviderDetail /> },

  // Domain Management
  { path: ROUTES.DOMAINS, element: <Domain /> },
  { path: ROUTES.SSL, element: <Ssl /> },
  { path: ROUTES.DNS, element: <Dns /> },
  { path: ROUTES.SUBDOMAINS, element: <SubDomain /> },
  { path: ROUTES.ADD_DNS_RECORD, element: <AddDnsRecord /> },
  { path: ROUTES.ADD_SUBDOMAIN, element: <AddSubdomain /> },
  { path: ROUTES.ADD_SSL_CERTIFICATE, element: <AddSslCertificate /> },

  // Magento Routes (all)
  { path: ROUTES.MAGENTO_ORDERS, element: <MagentoOrderList /> },
  { path: ROUTES.MAGENTO_ORDER_DETAILS(), element: <MogentoOrder /> },
  { path: ROUTES.MAGENTO_PRODUCTS, element: <MagentoProductList /> },
  { path: ROUTES.ADD_MAGENTO_PRODUCT, element: <AddMagentoProduct /> },
  { path: ROUTES.EDIT_MAGENTO_PRODUCT(), element: <AddMagentoProduct /> },
  { path: ROUTES.ADD_MAGENTO_CATEGORY, element: <AddMagentoCategory /> },
  { path: ROUTES.EDIT_MAGENTO_CATEGORY(), element: <AddMagentoCategory /> },
  { path: ROUTES.MAGENTO_CATEGORY_LIST, element: <MagentoCategoryList /> },
  { path: ROUTES.ADD_MAGENTO_CUSTOMER, element: <AddMagentoCustomer /> },
  { path: ROUTES.MAGENTO_CUSTOMER_LIST, element: <MagentoCustomerList /> },
  { path: ROUTES.EDIT_MAGENTO_CUSTOMER(), element: <AddMagentoCustomer /> },
  { path: ROUTES.CUSTOMER_DETAILS(), element: <AddMagentoCustomer /> },
  { path: ROUTES.MAGENTO_STORE_LIST, element: <MagentoManageStoresList /> },
  { path: ROUTES.MAGENTO_INVENTORY_LIST, element: <MagentoInventoryList /> },
  { path: ROUTES.UPDATE_MAGENTO_INVENTORY(), element: <UpdateMagentoInventory /> },
  { path: ROUTES.MAGENTO_ATTRIBUTES_LIST, element: <MagentoAttributesLits /> },
  { path: ROUTES.ADD_MAGENTO_ATTRIBUTE, element: <AddMagentoAttribute /> },
  { path: ROUTES.EDIT_MAGENTO_ATTRIBUTE(), element: <AddMagentoAttribute /> },
  { path: ROUTES.MAGENTO_ATTRIBUTE_SETS, element: <MagentoAttributeSetsList /> },
  { path: ROUTES.ADD_MAGENTO_ATTRIBUTE_SET, element: <AddMagentoAttributeSet /> },
  { path: ROUTES.MAGENTO_PAYMENT_SERVICE, element: <MagentoPaymentServices /> },
  { path: ROUTES.MAGENTO_INVOICE_LIST, element: <MagentoInvoiceList /> },
  { path: ROUTES.MAGENTO_INVOICE_DETAIL, element: <MagentoInvoiceDetail /> },
  { path: ROUTES.MAGENTO_SHIPMENTS, element: <MagentoShipmentList /> },
  { path: ROUTES.MAGENTO_SHIPMENT_DETAILS(), element: <MagentoShipmentDetail /> },
  { path: ROUTES.MAGENTO_CREDIT_MEMOS, element: <MagentoCreditMemoList /> },
  { path: ROUTES.MAGENTO_CREDIT_MEMO_DETAIL, element: <MagentoCreditMemoDetail /> },
  { path: ROUTES.ONLINE_CUSTOMERS, element: <MagentoOnlineCustomers /> },
  { path: ROUTES.MAGENTO_CUSTOMER_GROUPS_LIST, element: <MagentoCustomerGroupsList /> },
  { path: ROUTES.EDIT_MAGENTO_CUSTOMER_GROUP(), element: <AddMagentoCustomerGroup /> },
  { path: ROUTES.ADD_MAGENTO_CUSTOMER_GROUP, element: <AddMagentoCustomerGroup /> },
  { path: ROUTES.ADD_CATALOG_PRICE_RULE, element: <AddMagentoCatalogPriceRule /> },
  { path: ROUTES.EDIT_CATALOG_PRICE_RULE(), element: <AddMagentoCatalogPriceRule /> },
  { path: ROUTES.MAGENTO_CATALOG_PRICE_RULE_LIST, element: <MagentoCatalogPriceRuleList /> },
  { path: ROUTES.MAGENTO_CART_PRICE_RULES_LIST, element: <MagentoCartPriceRulesList /> },
  { path: ROUTES.ADD_CART_PRICE_RULE, element: <AddMagentoCartPriceRule /> },
  { path: ROUTES.EDIT_CART_PRICE_RULE(), element: <AddMagentoCartPriceRule /> },
  { path: ROUTES.MAGENTO_URL_REWRITES_LIST, element: <MagentoUrlRewritesList /> },
  { path: ROUTES.ADD_MAGENTO_URL_REWRITE, element: <AddMagentoUrlRewrite /> },
  { path: ROUTES.EDIT_MAGENTO_URL_REWRITE(), element: <AddMagentoUrlRewrite /> },
  { path: ROUTES.MAGENTO_SEARCH_TERMS_LIST, element: <MagentoSearchTermsList /> },
  { path: ROUTES.ADD_MAGENTO_SEARCH_TERM, element: <AddMagentoSearchTerm /> },
  { path: ROUTES.EDIT_MAGENTO_SEARCH_TERM(), element: <AddMagentoSearchTerm /> },
  { path: ROUTES.EDIT_MAGENTO_SEARCH_SYNONYM(), element: <AddMagentoSearchSynonym /> },
  { path: ROUTES.ADD_MAGENTO_SEARCH_SYNONYM, element: <AddMagentoSearchSynonym /> },
  { path: ROUTES.MAGENTO_SEARCH_SYNONYMS_LIST, element: <MagentoSearchSynonymsList /> },
  { path: ROUTES.MAGENTO_SITEMAP_LIST, element: <MagentoSitemapList /> },
  { path: ROUTES.ADD_MAGENTO_SITEMAP, element: <AddMagentoSitemap /> },
  { path: ROUTES.EDIT_MAGENTO_SITEMAP(), element: <AddMagentoSitemap /> },
  { path: ROUTES.MAGENTO_REVIEWS_LIST, element: <MagentoReviewsList /> },
  { path: ROUTES.ADD_MAGENTO_REVIEW, element: <AddMagentoReview /> },
  { path: ROUTES.EDIT_MAGENTO_REVIEW(), element: <AddMagentoReview /> },
  { path: ROUTES.MAGENTO_EMAIL_TEMPLATES_LIST, element: <MagentoEmailTemplatesList /> },
  { path: ROUTES.ADD_MAGENTO_EMAIL_TEMPLATE, element: <AddMagentoEmailTemplate /> },
  { path: ROUTES.MAGENTO_NEWSLETTER_TEMPLATES_LIST, element: <MagentoNewsletterTemplatesList /> },
  { path: ROUTES.ADD_MAGENTO_NEWSLETTER_TEMPLATE, element: <AddMagentoNewsletterTemplate /> },
  { path: ROUTES.EDIT_MAGENTO_NEWSLETTER_TEMPLATE(), element: <AddMagentoNewsletterTemplate /> },
  { path: ROUTES.EDIT_MAGENTO_STORE(), element: <AddMagentoStor /> },
  { path: ROUTES.ADD_MAGENTO_STORE, element: <AddMagentoStor /> },
  { path: ROUTES.MAGENTO_CONFIGURATION_LIST, element: <MagentoConfigurationList /> },
  { path: ROUTES.MAGENTO_TERMS_CONDITIONS_LIST, element: <MagentoTermsConditionsList /> },
  { path: ROUTES.ADD_MAGENTO_TERMS_CONDITION, element: <AddMagentoTermsCondition /> },
  { path: ROUTES.EDIT_MAGENTO_TERMS_CONDITION(), element: <AddMagentoTermsCondition /> },
  { path: ROUTES.MAGENTO_ORDER_STATUS_LIST, element: <MagentoOrderStatusList /> },
  { path: ROUTES.ADD_MAGENTO_ORDER_STATUS, element: <AddMagentoOrderStatus /> },
  { path: ROUTES.EDIT_MAGENTO_ORDER_STATUS(), element: <AddMagentoOrderStatus /> },
  { path: ROUTES.MAGENTO_SOURCES_LIST, element: <MagentoSourcesList /> },
  { path: ROUTES.ADD_MAGENTO_SOURCE, element: <AddMagentoSource /> },
  { path: ROUTES.MAGENTO_TAX_RULES_LIST, element: <MagentoTaxRulesList /> },
  { path: ROUTES.ADD_MAGENTO_TAX_RULE, element: <AddMagentoTaxRule /> },
  { path: ROUTES.ADD_CURRENCY_SYMBOLS, element: <AddCurrencySymbols /> },
  { path: ROUTES.ADD_CURRENCY_RATES, element: <AddCurrencyRates /> },
  { path: ROUTES.MAGENTO_PRODUCT_RATINGS_LIST, element: <MagentoProductRatingsList /> },
  { path: ROUTES.MAGENTO_TAX_ZONES_LIST, element: <MagentoTaxZonesList /> },
  { path: ROUTES.ADD_MAGENTO_TAX_ZONE, element: <AddMagentoTaxZone /> },
  { path: ROUTES.ADD_MAGENTO_RATING, element: <AddMagentoRating /> },
  { path: ROUTES.MAGENTO_STOCK_LIST, element: <MagentoStockList /> },
  { path: ROUTES.ADD_MAGENTO_STOCK, element: <AddMagentoStock /> },
  { path: ROUTES.MAGENTO_BILLING_AGREEMENTS_LIST, element: <MagentoBillingAgreementsList /> },
  { path: ROUTES.MAGENTO_TRANSACTION_LIST, element: <MagentoTransactionList /> },
  { path: ROUTES.BRAINTREE_VIRTUAL_TERMINAL, element: <BraintreeVirtualTerminal /> },

  // Reports
  { path: ROUTES.MAGENTO_PRODUCTS_IN_CARTS_LIST, element: <MagentoProductsInCartsList /> },
  { path: ROUTES.MAGENTO_SEARCH_TERMS_REPORT, element: <MagentoSearchTermsListForReports /> },
  { path: ROUTES.MAGENTO_ABANDONED_CARTS_LIST, element: <MagentoAbandonedCartsList /> },
  { path: ROUTES.MAGENTO_NEWSLETTER_PROBLEMS_REPORT, element: <MagentoNewsletterProblemsReportList /> },
  { path: ROUTES.MAGENTO_CUSTOMER_REVIEWS_REPORT, element: <MagentoCustomerReviewsReportList /> },
  { path: ROUTES.MAGENTO_PRODUCT_REVIEWS_REPORT, element: <MagentoProductReviewsReportList /> },
  { path: ROUTES.MAGENTO_ORDER_UPDATED_REPORT, element: <MagentoOrderUpdatedReportList /> },
  { path: ROUTES.MAGENTO_TAX_REPORT, element: <MagentoTaxReportList /> },
  { path: ROUTES.MAGENTO_INVOICE_REPORT, element: <MagentoInvoiceReportList /> },
  { path: ROUTES.MAGENTO_SHIPPING_REPORT, element: <MagentoShippingReportList /> },
  { path: ROUTES.MAGENTO_REFUNDS_REPORT, element: <MagentoRefundsReportList /> },
  { path: ROUTES.MAGENTO_COUPONS_REPORT, element: <MagentoCouponsReportList /> },
  { path: ROUTES.MAGENTO_PAYPAL_SETTLEMENT_REPORT, element: <MagentoPayPalSettlementReportList /> },
  { path: ROUTES.MAGENTO_BRAINTREE_SETTLEMENT_REPORT, element: <MagentoBraintreeSettlementReportList /> },
  { path: ROUTES.MAGENTO_ORDER_TOTAL_REPORT, element: <MagentoOrderTotalReportList /> },
  { path: ROUTES.MAGENTO_ORDER_COUNT_REPORT, element: <MagentoOrderCountReportList /> },
  { path: ROUTES.MAGENTO_NEW_ACCOUNTS_REPORT, element: <MagentoNewAccountsReportList /> },
  { path: ROUTES.MAGENTO_PRODUCT_VIEWS_REPORT, element: <MagentoProductViewsReportList /> },
  { path: ROUTES.MAGENTO_BESTSELLERS_REPORT, element: <MagentoBestsellersReportList /> },
  { path: ROUTES.MAGENTO_LOW_STOCK_REPORT, element: <MagentoLowStockReportList /> },
  { path: ROUTES.MAGENTO_ORDERED_PRODUCTS_REPORT, element: <MagentoOrderedProductsReportList /> },
  { path: ROUTES.MAGENTO_DOWNLOADS_REPORT, element: <MagentoDownloadsReportList /> },
  { path: ROUTES.MAGENTO_NOTIFICATIONS_LIST, element: <MagentoNotificationsList /> },
  { path: ROUTES.VENDOR, element: <VendorList/> },


{ path: ROUTES.MAGENTO_SETTLEMENTS_LIST, element: <SettlementList /> },
{ path: ROUTES.MAGENTO_SETTLEMENT_DETAIL(), element: <SettlementDetail /> },
{ path: ROUTES.MAGENTO_SETTLEMENT_GENERATE, element: <GenerateSettlement /> },


];

// ==================== CREATE ROUTER ====================
export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: protectedRoutes,
      },
    ],
  },
  // Public routes
  { path: ROUTES.PAGE_BUILDER, element: <PageBuilderScreen /> },
  { path: ROUTES.LOGIN, element: <Login /> },
  { path: ROUTES.VERIFY_EMAIL, element: <VerifyEmail /> },
  { path: ROUTES.OTP, element: <EnterOTP /> },
  { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: ROUTES.REGISTER, element: <Signup /> },
  { path: ROUTES.NOT_FOUND, element: <NotFound /> },
]);

// ==================== HELPER HOOKS ====================
export const useAppNavigate = () => {
  const navigate = useNavigate();

  return {
    navigateToLogin: () => navigate(ROUTES.LOGIN),
    navigateToDashboard: () => navigate(ROUTES.DASHBOARD),
    navigateToOrderDetails: (id: string | number) => navigate(ROUTES.ORDER_DETAILS(id)),
    navigateToUserDetails: (id: string | number) => navigate(ROUTES.USER_DETAILS(id)),
    navigateToRoleDetails: (id: string | number) => navigate(ROUTES.ROLE_DETAILS(id)),
    navigateToGroupDetails: (id: string | number) => navigate(ROUTES.GROUP_DETAILS(id)),
    navigateToPaymentProvider: (id: string | number) => navigate(ROUTES.PAYMENT_PROVIDER_DETAILS(id)),
    navigateToShippingProvider: (id: string | number) => navigate(ROUTES.SHIPPING_PROVIDER_DETAILS(id)),
    navigateToMagentoOrder: (id: string | number) => navigate(ROUTES.MAGENTO_ORDER_DETAILS(id)),
    navigateToMagentoShipment: (id: string | number) => navigate(ROUTES.MAGENTO_SHIPMENT_DETAILS(id)),
  };
};