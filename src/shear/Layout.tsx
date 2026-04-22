import { useState, useEffect } from "react";
import {
  FaBars,
  FaHome,
  FaStore,
  FaUsers,
  FaBox,
  FaHandshake,
  FaExchangeAlt,
  FaFileAlt,
  FaCogs,
  FaGlobe,
  FaMoneyBill,
  FaTruck,
  FaChartBar,
  FaBuilding,
  FaShoppingBag,
  FaProjectDiagram,
  FaCog,
  FaUndoAlt,
  FaBullhorn,
  FaCreditCard,
  FaShoppingCart,
  FaMagento,
  FaChevronDown,
  FaChevronRight,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../app/api/AuthSlices/AuthSlices";
import { ROUTES } from "../router.tsx";

import { router } from "../router";

// ============ TYPES ============
interface MenuItem {
  label: string;
  path?: string;
  icon?: any;
  children?: MenuItem[];
  matchPaths?: string[];
}

// ============ HELPER — check if any child/grandchild path is active ============
const isDescendantActive = (item: MenuItem, currentPath: string): boolean => {
  if (item.path) {
    if (item.path === "/") {
      // exact match only for root
      if (currentPath === "/") return true;
    } else if (currentPath.startsWith(item.path)) return true;
  }

  if (item.matchPaths && item.matchPaths.some(p => currentPath.startsWith(p))) return true;

  if (item.children) {
    return item.children.some(child => isDescendantActive(child, currentPath));
  }

  return false;
};

// ============ RECURSIVE MENU ITEM ============
interface RecursiveMenuItemProps {
  item: MenuItem;
  depth?: number;
  collapsed: boolean;
  currentPath: string;
  openMenus: string[];
  toggleMenu: (key: string) => void;
}

const RecursiveMenuItem = ({
  item,
  depth = 0,
  collapsed,
  currentPath,
  openMenus,
  toggleMenu,
}: RecursiveMenuItemProps) => {
  const Icon = item.icon;
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  // Unique key for this menu item
  const menuKey = `${depth}-${item.label}`;
  const isOpen = openMenus.includes(menuKey);

  const isExact = item.path === currentPath;

  const isActive =
    isExact ||
    (item.matchPaths && item.matchPaths.some(p => currentPath.startsWith(p))) ||
    isDescendantActive(item, currentPath);

  // Indent based on depth
  const paddingLeft = depth === 0
    ? "px-6"
    : depth === 1
      ? "pl-8 pr-4"
      : depth === 2
        ? "pl-12 pr-4"
        : "pl-16 pr-4";

  const content = (
    <div
      onClick={() => {
        if (hasChildren) {
          toggleMenu(menuKey);
        }
      }}
      className={`flex items-center justify-between ${collapsed && depth === 0 ? "justify-center px-0" : paddingLeft
        } py-3 rounded-xl cursor-pointer transition-all
        ${isActive
          ? depth === 0
            ? "bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white"
            : "bg-blue-50 text-blue-600 font-medium"
          : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      <div className="flex items-center gap-3">
        {/* Icon — sirf depth 0 pe */}
        {Icon && depth === 0 && !collapsed && <Icon className="text-lg flex-shrink-0" />}
        {Icon && depth === 0 && collapsed && <Icon className="text-lg" />}

        {/* Label */}
        {!collapsed && (
          <span className="text-sm font-medium truncate max-w-40">{item.label}</span>
        )}
      </div>

      {/* Chevron — sirf children wale pe */}
      {hasChildren && !collapsed && (
        <span className="text-xs opacity-60">
          {isOpen ? <FaChevronDown /> : <FaChevronRight />}
        </span>
      )}
    </div>
  );

  return (
    <div className="relative">
      {/* Active left bar — sirf depth 0 pe */}
      {isActive && depth === 0 && (
        <span className="absolute -left-4 top-2 bottom-2 w-1 rounded-full bg-blue-500" />
      )}
      {/* Item — link ya div */}
      {!hasChildren && item.path ? (
        <Link to={item.path}>{content}</Link>
      ) : (
        content
      )}

      {/* Children — recursive */}
      {hasChildren && isOpen && !collapsed && (
        <div className={`mt-1 space-y-0.5 ${depth === 0 ? "ml-3 border-l-2 border-gray-200 pl-2" : "ml-3 border-l-2 border-gray-200 pl-2"}`}>
          {item.children!.map((child) => (
            <RecursiveMenuItem
              key={child.label}
              item={child}
              depth={depth + 1}
              collapsed={collapsed}
              currentPath={currentPath}
              openMenus={openMenus}
              toggleMenu={toggleMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============ LAYOUT ============
const Layout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);

  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();
  const handleLogout = async () => {
    await logoutApi({});
    navigate("/login");
  };

  const navigate = useNavigate();

  // Get user from localStorage
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  
  // Check if user has admin or super_admin role
  const hasAdminAccess = user?.roles?.some(
    (role: string) => role === "super_admin" || role === "admin"
  ) || false;

  // ================= FULL MENU ITEMS (Moved inside component to use user role) =================
  const getFullMenuItems = (): MenuItem[] => [
    { label: "Dashboard", icon: FaHome, path: "/" },

    {
      label: "Magento",
      icon: FaMagento,
      path: "/magento",
      children: [
        // Inventory
        { label: "All Magento Inventory", path: "/MagentoInventoryList" },

        // Sales
        {
          label: "Sales",
          icon: FaStore,
          children: [
            { label: "Orders", path: "/MagentoOrders" },
            { label: "Payment Service", path: "/MagentoPaymentService" },
            { label: "Invoice", path: "/MagentoInvoiceList" },
            { label: "Shipment", path: "/MagentoShipments" },
            { label: "Credit Memos", path: "/MagentoCreditMemos" },
            { label: "Billing Agreements", path: "/MagentoBillingAgreementsList" },
            { label: "Transactions", path: "/MagentoTransactionList" },
            { label: "Braintree Virtual Terminal", path: "/BraintreeVirtualTerminal" },
          ],
        },

        // Catalog
        {
          label: "Catalog",
          icon: FaStore,
          children: [
            {
              label: "Products",
              path: "/MagentoProducts",
              matchPaths: ["/MagentoProducts", "/AddMagentoProduct", "/AddMagentoProduct/:sku"]
            },
            {
              label: "Categories",
              path: "/MagentoCategoryList",
              matchPaths: ["/MagentoCategoryList", "/AddMagentoCategory", "/AddMagentoCategory/:id"]
            },
          ],
        },

        // Customers
        {
          label: "Customers",
          icon: FaStore,
          children: [
            {
              label: "All Customers",
              path: "/MagentoCustomerList",
              matchPaths: ["/MagentoCustomerList", "/AddMagentoCustomer", "/AddMagentoCustomer/:id", "/customers/:id"]
            },
            { label: "Now Online", path: "/OnlineCustomers" },
            // { label: "! Login as Customer Log", path: "/storeList12" },
            {
              label: "Customer Groups",
              path: "/MagentoCustomerGroupsList",
              matchPaths: ["/MagentoCustomerGroupsList", "/AddMagentoCustomerGroup", "/AddMagentoCustomerGroup/:id"]
            },
          ],
        },

        // Marketing
        {
          label: "Marketing",
          icon: FaStore,
          children: [
            {
              label: "Promotions",
              icon: FaStore,
              children: [
                {
                  label: "Catalog Price Rule",
                  path: "/MagentoCatalogPriceRuleList",
                  matchPaths: ["/MagentoCatalogPriceRuleList", "/AddCatalogPriceRule", "/AddCatalogPriceRule/:id"]
                },
                {
                  label: "Cart Price Rules",
                  path: "/MagentoCartPriceRulesList",
                  matchPaths: ["/MagentoCartPriceRulesList", "/AddCartPriceRule", "/AddCartPriceRule/:id"]
                },
              ],
            },
            {
              label: "SEO & Search",
              icon: FaStore,
              children: [
                {
                  label: "URL Rewrites",
                  path: "/MagentoUrlRewritesList",
                  matchPaths: ["/MagentoUrlRewritesList", "/AddMagentoUrlRewrite", "/AddMagentoUrlRewrite/:id"]
                },
                {
                  label: "Search Terms",
                  path: "/MagentoSearchTermsList",
                  matchPaths: ["/MagentoSearchTermsList", "/AddMagentoSearchTerm", "/AddMagentoSearchTerm/:id"]
                },
                {
                  label: "Search Synonyms",
                  path: "/MagentoSearchSynonymsList",
                  matchPaths: ["/MagentoSearchSynonymsList", "/AddMagentoSearchSynonym", "/AddMagentoSearchSynonym/:id"]
                },
                {
                  label: "Site Map",
                  path: "/MagentoSitemapList",
                  matchPaths: ["/MagentoSitemapList", "/AddMagentoSitemap", "/AddMagentoSitemap/:id"]
                },
              ],
            },
            {
              label: "Communications",
              icon: FaStore,
              children: [
                {
                  label: "Email Templates",
                  path: "/MagentoEmailTemplatesList",
                  matchPaths: ["/MagentoEmailTemplatesList", "/AddMagentoEmailTemplate", "/AddMagentoEmailTemplate/:id"]
                },
                {
                  label: "Newsletter Templates",
                  path: "/MagentoNewsletterTemplatesList",
                  matchPaths: ["/MagentoNewsletterTemplatesList", "/AddMagentoNewsletterTemplate", "/AddMagentoNewsletterTemplate/:id"]
                },
              ],
            },
            {
              label: "User Content",
              icon: FaStore,
              children: [
                {
                  label: "All Reviews",
                  path: "/MagentoReviewsList",
                  matchPaths: ["/MagentoReviewsList", "/AddMagentoReview", "/AddMagentoReview/:id"]
                },
              ],
            },
          ],
        },

        // Content
        {
          label: "Content",
          icon: FaStore,
          children: [
            {
              label: "Elements",
              icon: FaStore,
              children: [
                { label: "Pages", path: "/pageBuilder" },
                { label: "Blogs", path: "/SubscriptionList10" },
                { label: "Widgets", path: "/SubscriptionList10" },
                { label: "Templates", path: "/SubscriptionList10" },
              ],
            },
            {
              label: "Media",
              icon: FaStore,
              children: [
                { label: "Media Gallery", path: "/SubscriptionList10" },
              ],
            },
            {
              label: "Design",
              icon: FaStore,
              children: [
                { label: "Configuration", path: "/SubscriptionList10" },
                { label: "Themes", path: "/SubscriptionList10" },
                { label: "Schedule", path: "/SubscriptionList10" },
              ],
            },
          ],
        },

        // Reports
        {
          label: "Reports",
          icon: FaChartBar,
          children: [
            {
              label: "Marketing",
              children: [
                { label: "Products in Cart", path: "/MagentoProductsInCartsList" },
                { label: "Search Terms", path: "/MagentoSearchTermsListForReports" },
                { label: "Abandoned Carts", path: "/MagentoAbandonedCartsList" },
                { label: "Newsletter Problem Reports", path: "/MagentoNewsletterProblemsReportList" },
              ],
            },
            {
              label: "Reviews",
              children: [
                { label: "By Customers", path: "/MagentoCustomerReviewsReportList" },
                { label: "By Products", path: "/MagentoProductReviewsReportList" },
              ],
            },
            {
              label: "Sales",
              children: [
                { label: "Orders", path: "/MagentoOrderUpdatedReportList" },
                { label: "Tax", path: "/MagentoTaxReportList" },
                { label: "Invoiced", path: "/MagentoInvoiceReportList" },
                { label: "Shipping", path: "/MagentoShippingReportList" },
                { label: "Refunds", path: "/MagentoRefundsReportList" },
                { label: "Coupons", path: "/MagentoCouponsReportList" },
                { label: "PayPal Settlement", path: "/MagentoPayPalSettlementReportList" },
                { label: "Braintree Settlement", path: "/MagentoBraintreeSettlementReportList" },
              ],
            },
            {
              label: "Customers",
              children: [
                { label: "Order Total", path: "/MagentoOrderTotalReportList" },
                { label: "Order Count", path: "/MagentoOrderCountReportList" },
                { label: "New", path: "/MagentoNewAccountsReportList" },
              ],
            },
            {
              label: "Products",
              children: [
                {
                  label: "Views",
                  path: "/MagentoProductViewsReportList",
                },
                { label: "Bestsellers", path: "/MagentoBestsellersReportList" },
                { label: "Low Stock", path: "/MagentoLowStockReportList" },
                { label: "Ordered", path: "/MagentoOrderedProductsReportList" },
                { label: "Downloads", path: "/MagentoDownloadsReportList" },
              ],
            },
            {
              label: "Business Intelligence",
              children: [
                { label: "Advanced Reporting", path: "/reports/advanced-reporting" },
                { label: "BI Essentials", path: "/reports/bi-essentials" },
              ],
            },
          ],
        },

        // Stores
        {
          label: "Stores",
          icon: FaStore,
          children: [
            {
              label: "Settings",
              children: [
                {
                  label: "All Stores",
                  path: "/MagentoStoreList",
                  matchPaths: ["/MagentoStoreList", "/AddMagentoStor", "/AddMagentoStor/:id"]
                },
                // { label: "! Configuration", path: "/stores/configuration" },
                {
                  label: "Terms and Conditions",
                  path: "/MagentoTermsConditionsList",
                  matchPaths: ["/MagentoTermsConditionsList", "/AddMagentoTermsCondition", "/AddMagentoTermsCondition/:id"]
                },
                {
                  label: "Order Status",
                  path: "/MagentoOrderStatusList",
                  matchPaths: ["/MagentoOrderStatusList", "/AddMagentoOrderStatus", "/AddMagentoOrderStatus/:id"]
                },
              ],
            },
            {
              label: "Inventory",
              children: [
                { label: "Sources", path: "/MagentoSourcesList" },
                {
                  label: "Stocks",
                  path: "/MagentoStockList",
                  matchPaths: ["/MagentoStockList", "/AddMagentoStock"]
                },
              ],
            },
            {
              label: "Taxes",
              children: [
                {
                  label: "Tax Rules",
                  path: "/MagentoTaxRulesList",
                  matchPaths: ["/MagentoTaxRulesList", "/AddMagentoTaxRule"]
                },
                { label: "Tax Zones and Rates", path: "/MagentoTaxZonesList" },
              ],
            },
            {
              label: "Currency",
              children: [
                { label: "Currency Rates", path: "/AddCurrencyRates" },
                { label: "Currency Symbols", path: "/AddCurrencySymbols" },
              ],
            },
            {
              label: "Attributes",
              children: [
                {
                  label: "Product",
                  path: "/MagentoAttributesLits",
                  matchPaths: ["/MagentoAttributesLits", "/AddMagentoAttribute", "/AddMagentoAttribute/:attribute_code"]
                },
                {
                  label: "Attribute Set",
                  path: "/MagentoAttributeSets",
                  matchPaths: ["/MagentoAttributeSets", "/AddMagentoAttributeSet"]
                },
                {
                  label: "Rating",
                  path: "/MagentoProductRatingsList",
                  matchPaths: ["/MagentoProductRatingsList", "/AddMagentoRating"]
                },
              ],
            },
          ],
        },
        {
          label: "System",
          icon: FaStore,
          children: [
            {
              label: "Other Settings",
              icon: FaStore,
              children: [
                {
                  label: "Notification",
                  path: "/MagentoNotificationsList",
                },
                {
                  label: "Cart Price Rules",
                  path: "/MagentoCartPriceRulesList",
                },
              ],
            },
            {
              label: "Categories",
              icon: FaStore,
              children: [
                {
                  label: "Catalog Price Rule",
                  path: "/MagentoCatalogPriceRuleList",
                },
                {
                  label: "Cart Price Rules",
                  path: "/MagentoCartPriceRulesList",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "Order Management",
      icon: FaShoppingCart,
      path: "/orderlist",
      children: [
        {
          label: "All Orders",
          path: "/orderlist",
          matchPaths: ["/orderlist", "/orders/:uuid"]
        },
        {
          label: "Order Statistics",
          path: "/OrderStatistics",
          matchPaths: ["/OrderStatistics"]
        },
      ]
    },
    {
      label: "Stores",
      icon: FaStore,
      path: "/store",
      children: [
        { label: "All Subscription", path: "/SubscriptionList" },
        { label: "Stores list", path: "/storeList" },
      ],
    },
    {
      label: "Catalog",
      icon: FaBox,
      path: "/catalog",
      children: [
        { label: "All Inventiries", path: "/InventoryManagementList" },
        { label: "All Product Bases", path: "/ProductBaseList" },
        { label: "All Legality Control", path: "/LegalityControlList" },
        { label: "All Product Sharing", path: "/ProductSharingList" },
        { label: "All Category", path: "/CategoryList" },
      ],
    },
    {
      label: "Users",
      icon: FaUsers,
      path: "/users",
      children: [
        { label: "Users List", path: "/userlist" },
        { label: "Roles", path: "/usersroles" },
        { label: "Group", path: "/usersgroup" },
      ],
    },
    {
      label: "Vendors",
      icon: FaHandshake,
      path: "/vendors",
      children: [
        { label: "All Vendors", path: "/Verdor" },
        { label: "Add Vendor Onboard", path: "/CreateVerderOnboard" },
        { label: "Vendor Requests", path: "/vendor/requests" },
      ],
    },
    { label: "Settlements", icon: FaExchangeAlt, path: "/settlements" },
    { label: "CMS", icon: FaFileAlt, path: "/cms" },
    { label: "OMS", icon: FaCogs, path: "/oms" },
    { label: "Integrations", icon: FaGlobe, path: "/integrations" },
    {
      label: "Local Companies",
      icon: FaBuilding,
      path: "/local-companies",
      children: [
        { label: "Country Management", path: "/country-management" },
        { label: "Currency Managment", path: "/currency-management" },
        { label: "Languages Managment", path: "/language-management" },
      ],
    },
    { label: "Marketplace", icon: FaShoppingBag, path: "/marketplace" },
    {
      label: "MLM System",
      icon: FaProjectDiagram,
      path: "/mlm",
      children: [
        { label: "Mlm Dashboard", path: "/mlmdashboard" },
        { label: "User Tree", path: "/usertree" },
        { label: "Reports", path: "/reports" },
      ],
    },
    {
      label: "Settings",
      icon: FaCog,
      path: "/settings",
      children: [
        { label: "Translation", path: "/translation" },
        { label: "Updates", path: "/updates" },
        { label: "Backups", path: "/backups" },
        { label: "Audit Logs", path: "/auditlogs" },
      ],
    },
    { label: "Domain", icon: FaGlobe, path: "/domains" },
    {
      label: "Return Platform",
      icon: FaUndoAlt,
      path: "/return-platform",
      children: [
        { label: "Coupon Management", path: "/CouponManagementList" },
        { label: "Email Marketing", path: "/EmailMarketingList" },
        { label: "SEOSettingList", path: "/SEOSettingList" },
      ],
    },
    { label: "Marketing", icon: FaBullhorn, path: "/marketing" },
    { label: "Payments", icon: FaCreditCard, path: "/payment-providers" },
    { label: "Shipping", icon: FaTruck, path: "/shipping-mangement" },
    {
      label: "Taxes",
      icon: FaMoneyBill,
      path: "/taxes-management",
      children: [
        { label: "Taxes", path: "/taxes" },
        { label: "Invoice", path: "/invoicemanagement" },
      ],
    },
    { label: "Reports", icon: FaChartBar, path: "/reports-main" },
  ];

  // Filter menu items based on user role
  useEffect(() => {
    const fullMenu = getFullMenuItems();
    
    if (hasAdminAccess) {
      // If user is admin or super_admin, show all menus
      setFilteredMenuItems(fullMenu);
    } else {
      // If not admin, only show Dashboard and Magento
      const allowedMenus = fullMenu.filter(item => 
        item.label === "Dashboard" || item.label === "Magento"
      );
      setFilteredMenuItems(allowedMenus);
    }
  }, [hasAdminAccess]);

  // Auto open parent menus based on current path
  useEffect(() => {
    const autoOpen: string[] = [];

    const findOpenMenus = (items: MenuItem[], depth: number) => {
      items.forEach((item) => {
        if (item.children) {
          const menuKey = `${depth}-${item.label}`;
          if (isDescendantActive(item, location.pathname)) {
            autoOpen.push(menuKey);
            findOpenMenus(item.children, depth + 1);
          }
        }
      });
    };

    findOpenMenus(filteredMenuItems, 0);
    setOpenMenus(autoOpen);
  }, [location.pathname, filteredMenuItems]);

  // Add this useEffect inside your Layout component
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showSearch) {
        setShowSearch(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showSearch]);

  const toggleMenu = (key: string) => {
    setOpenMenus(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const getActiveLabel = (): string => {
    const findActive = (items: MenuItem[]): string | null => {
      for (const item of items) {
        const isExact = item.path === location.pathname;
        const isMatchPath = item.matchPaths?.some(p => location.pathname.startsWith(p));
        const hasActiveChild = item.children?.some(child => findActive([child]));

        if (isExact || isMatchPath || hasActiveChild) return item.label;
      }
      return null;
    };
    return findActive(filteredMenuItems) || "Dashboard";
  };

  // Active parent label for top bar
  const getActiveParentLabel = (): string => {
    const findParent = (items: MenuItem[], child: string): string => {
      for (const item of items) {
        if (item.children?.some(c => c.label === child)) return item.label;
        if (item.children) {
          const found = findParent(item.children, child);
          if (found) return found;
        }
      }
      return "";
    };
    const active = getActiveLabel();
    return findParent(filteredMenuItems, active) || active;
  };

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-x-hidden">
      {/* SIDEBAR */}
      <aside className={`${collapsed ? "w-20" : "w-64"} bg-white flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* LOGO */}
        <div className="h-20 flex items-center justify-center">
          <img
            src="madd-admin.png"
            alt="Logo"
            className={`transition-all duration-300 ${collapsed ? "w-8" : "w-40"}`}
          />
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 space-y-1 text-sm overflow-y-auto overflow-x-hidden">
          {filteredMenuItems.map((item) => (
            <RecursiveMenuItem
              key={item.label}
              item={item}
              depth={0}
              collapsed={collapsed}
              currentPath={location.pathname}
              openMenus={openMenus}
              toggleMenu={toggleMenu}
            />
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 space-y-6 overflow-x-hidden">
        {/* TOP BAR */}
        <div className="h-14 bg-white rounded-xl shadow-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-gray-700">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <FaBars />
            </button>
            <span className="font-medium">{getActiveParentLabel()}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                title="Search"
              >
                <FaSearch className="text-xl text-gray-600" />
              </button>

              {/* Search Input - Slides in */}
              {showSearch && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search orders, products, customers..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500 text-sm"
                      autoFocus
                    />
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 px-2">
                    Press ESC to close
                  </p>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative cursor-pointer group">
              <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors relative">
                <FaBell className="text-xl text-gray-600" />
                {/* Notification Dot */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded right-0 -bottom-8 whitespace-nowrap">
                Notifications
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-xl transition-all"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {user ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() : "A"}
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {user ? `${user.first_name} ${user.last_name}` : "Admin"}
                </span>
                <span className="text-gray-400 text-xs">•••</span>
              </button>

              {showDropdown && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                  {/* Dropdown */}
                  <div className="absolute right-0 top-12 z-20 bg-white rounded-xl shadow-lg border border-gray-100 w-52 overflow-hidden">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-800">
                        {user ? `${user.first_name} ${user.last_name}` : "Admin"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{user?.email ?? ""}</p>
                      {user?.roles && (
                        <p className="text-xs text-gray-400 mt-1">
                          Role: {user.roles.join(", ")}
                        </p>
                      )}
                    </div>
                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default Layout;