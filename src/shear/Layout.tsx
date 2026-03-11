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
} from "react-icons/fa";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../public/madd-admin.png";

// ============ TYPES ============
interface MenuItem {
  label: string;
  path?: string;
  icon?: any;
  children?: MenuItem[];
}

// ============ MENU ITEMS ============
const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: FaHome, path: "/" },
  {
    label: "Magento", icon: FaMagento, path: "/magento",
    children: [
      // { label: "All Magento Products", path: "/MagentoProducts" },
      // { label: "All Magento Category", path: "/MagentoCategoryList" },
      // { label: "All Magento Customer", path: "/MagentoCustomerList" },
      // { label: "All Magento Order", path: "/MagentoOrders" },
      // { label: "All Magento Store", path: "/MagentoStoreList" },
      { label: "All Magento Inventory", path: "/MagentoInventoryList" },
      // { label: "All Attributes", path: "/MagentoAttributesLits" },
      // { label: "Attribute Sets", path: "/MagentoAttributeSets" },
      {
        label: "Sales", icon: FaStore,
        children: [
          { label: "Orders", path: "/MagentoOrders" },
          { label: "Payment Service", path: "/MagentoPaymentService" },
          { label: "Invoice", path: "/MagentoInvoiceList" },
          { label: "Shipment", path: "/MagentoShipments" },
          { label: "Credit Memos", path: "/MagentoCreditMemos" },
          { label: "Billing Agreements", path: "/storeList5" },
          { label: "Transactions", path: "/storeList6" },
          { label: "Braintree Virtual Terminal", path: "/storeList7" },
        ],
      },
      {
        label: "Catalog", icon: FaStore,
        children: [
          { label: "Products", path: "/MagentoProducts" },
          { label: "Categories", path: "/MagentoCategoryList" },
        ],
      },
      {
        label: "Customers", icon: FaStore,
        children: [
          { label: "All Customers", path: "/MagentoCustomerList" },
          { label: "Now Online", path: "/OnlineCustomers" },
          { label: "Login as Customer Log", path: "/storeList12" },
          { label: "Customer Groups", path: "/MagentoCustomerGroupsList" },
        ],
      },
      {
        label: "Marketing", icon: FaStore,
        children: [
          {
            label: "Promotions", icon: FaStore,
            children: [
              { label: "Catalog Price Rule", path: "/MagentoCatalogPriceRuleList" },
              { label: "Cart Price Rules", path: "/MagentoCartPriceRulesList" },
            ]
          },
          {
            label: "SEO & Search", icon: FaStore,
            children: [
              { label: "URL Rewrites", path: "/MagentoUrlRewritesList" },
              { label: "Search Terms", path: "/MagentoSearchTermsList" },
              { label: "Search Synonyms", path: "/MagentoSearchSynonymsList" },
              { label: "Site Map", path: "/MagentoSitemapList" },
            ]
          },
          {
            label: "Communications", icon: FaStore,
            children: [
              { label: "Email Templates", path: "/SubscriptionList10" },
              { label: "Newsletter Templates", path: "/storeList11" },
              { label: "Newsletter Queue", path: "/storeList12" },
              { label: "Newsletter Subscribers", path: "/storeList12" },
            ]
          },
          {
            label: "User Content", icon: FaStore,
            children: [
              { label: "All Reviews", path: "/MagentoReviewsList" },
              { label: "Pending Reviews", path: "/storeList11" },
            ]
          },
        ],
      },
      {
        label: "Content", icon: FaStore,
        children: [
          {
            label: "Elements", icon: FaStore,
            children: [
              { label: "Pages", path: "/SubscriptionList10" },
              { label: "Blogs", path: "/SubscriptionList10" },
              { label: "Widgets", path: "/SubscriptionList10" },
              { label: "Templates", path: "/SubscriptionList10" },
            ]
          },
          {
            label: "Media", icon: FaStore,
            children: [
              { label: "Media Gallery", path: "/SubscriptionList10" },
            ]
          },
          {
            label: "Design", icon: FaStore,
            children: [
              { label: "Configuration", path: "/SubscriptionList10" },
              { label: "Themes", path: "/SubscriptionList10" },
              { label: "Schedule", path: "/SubscriptionList10" },
            ]
          },
        ],
      },
      {
        label: "Reports", icon: FaChartBar,
        children: [
          {
            label: "Marketing",
            children: [
              { label: "Products in Cart", path: "/reports/products-in-cart" },
              { label: "Search Terms", path: "/reports/search-terms" },
              { label: "Abandoned Carts", path: "/reports/abandoned-carts" },
              { label: "Newsletter Problem Reports", path: "/reports/newsletter-problems" },
            ]
          },
          {
            label: "Reviews",
            children: [
              { label: "By Customers", path: "/reports/reviews-customers" },
              { label: "By Products", path: "/reports/reviews-products" },
            ]
          },
          {
            label: "Sales",
            children: [
              { label: "Orders", path: "/reports/orders" },
              { label: "Tax", path: "/reports/tax" },
              { label: "Invoiced", path: "/reports/invoiced" },
              { label: "Shipping", path: "/reports/shipping" },
              { label: "Refunds", path: "/reports/refunds" },
              { label: "Coupons", path: "/reports/coupons" },
              { label: "PayPal Settlement", path: "/reports/paypal-settlement" },
              { label: "Braintree Settlement", path: "/reports/braintree-settlement" },
            ]
          },
          {
            label: "Customers",
            children: [
              { label: "Order Total", path: "/reports/order-total" },
              { label: "Order Count", path: "/reports/order-count" },
              { label: "New", path: "/reports/new-customers" },
            ]
          },
          {
            label: "Products",
            children: [
              { label: "Views", path: "/reports/product-views" },
              { label: "Bestsellers", path: "/reports/bestsellers" },
              { label: "Low Stock", path: "/reports/low-stock" },
              { label: "Ordered", path: "/reports/ordered" },
              { label: "Downloads", path: "/reports/downloads" },
            ]
          },
          {
            label: "Business Intelligence",
            children: [
              { label: "Advanced Reporting", path: "/reports/advanced-reporting" },
              { label: "BI Essentials", path: "/reports/bi-essentials" },
            ]
          },
        ],
      },
      {
        label: "Stores", icon: FaStore,
        children: [
          {
            label: "Settings",
            children: [
              { label: "All Stores", path: "/MagentoStoreList" },
              { label: "Configuration", path: "/stores/configuration" },
              { label: "Terms and Conditions", path: "/stores/terms-conditions" },
              { label: "Order Status", path: "/stores/order-status" },
            ]
          },
          {
            label: "Inventory",
            children: [
              { label: "Sources", path: "/stores/sources" },
              { label: "Stocks", path: "/stores/stocks" },
            ]
          },
          {
            label: "Taxes",
            children: [
              { label: "Tax Rules", path: "/stores/tax-rules" },
              { label: "Tax Zones and Rates", path: "/stores/tax-zones" },
            ]
          },
          {
            label: "Currency",
            children: [
              { label: "Currency Rates", path: "/stores/currency-rates" },
              { label: "Currency Symbols", path: "/stores/currency-symbols" },
            ]
          },
          {
            label: "Attributes",
            children: [
              { label: "Product", path: "/MagentoAttributesLits" },
              { label: "Attribute Set", path: "/MagentoAttributeSets" },
              { label: "Rating", path: "/MagentoAttributeSets" },
            ]
          },
        ],
      },
    ]
  },
  { label: "Order Management", icon: FaShoppingCart, path: "/orderlist" },
  {
    label: "Stores", icon: FaStore, path: "/store",
    children: [
      { label: "All Subscription", path: "/SubscriptionList" },
      { label: "Stores list", path: "/storeList" },
    ],
  },
  {
    label: "Catalog", icon: FaBox, path: "/catalog",
    children: [
      { label: "All Inventiries", path: "/InventoryManagementList" },
      { label: "All Product Bases", path: "/ProductBaseList" },
      { label: "All Legality Control", path: "/LegalityControlList" },
      { label: "All Product Sharing", path: "/ProductSharingList" },
      { label: "All Category", path: "/CategoryList" }
    ],
  },
  {
    label: "Users", icon: FaUsers, path: "/users",
    children: [
      { label: "Users List", path: "/userlist" },
      { label: "Roles", path: "/usersroles" },
      { label: "Group", path: "/usersgroup" },
    ],
  },
  {
    label: "Vendors", icon: FaHandshake, path: "/vendors",
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
    label: "Local Companies", icon: FaBuilding, path: "/local-companies",
    children: [
      { label: "Country Management", path: "/country-management" },
      { label: "Currency Managment", path: "/currency-management" },
      { label: "Languages Managment", path: "/language-management" },
    ],
  },
  { label: "Marketplace", icon: FaShoppingBag, path: "/marketplace" },
  {
    label: "MLM System", icon: FaProjectDiagram, path: "/mlm",
    children: [
      { label: "Mlm Dashboard", path: "/mlmdashboard" },
      { label: "User Tree", path: "/usertree" },
      { label: "Reports", path: "/reports" },
    ],
  },
  {
    label: "Settings", icon: FaCog, path: "/settings",
    children: [
      { label: "Translation", path: "/translation" },
      { label: "Updates", path: "/updates" },
      { label: "Backups", path: "/backups" },
      { label: "Audit Logs", path: "/auditlogs" },
    ],
  },
  { label: "Domain", icon: FaGlobe, path: "/domains" },
  {
    label: "Return Platform", icon: FaUndoAlt, path: "/return-platform",
    children: [
      { label: "Coupon Management", path: "/CouponManagementList" },
      { label: "Email Marketing", path: "/EmailMarketingList" },
      { label: "SEOSettingList", path: "/SEOSettingList" },
    ]
  },
  { label: "Marketing", icon: FaBullhorn, path: "/marketing" },
  { label: "Payments", icon: FaCreditCard, path: "/payment-providers" },
  { label: "Shipping", icon: FaTruck, path: "/shipping-mangement" },
  {
    label: "Taxes", icon: FaMoneyBill, path: "/taxes-management",
    children: [
      { label: "Taxes", path: "/taxes" },
      { label: "Invoice", path: "/invoicemanagement" },
    ],
  },
  { label: "Reports", icon: FaChartBar, path: "/reports-main" },
];

// ============ HELPER — check if any child/grandchild path is active ============
const isDescendantActive = (item: MenuItem, currentPath: string): boolean => {
  if (item.path && item.path === currentPath) return true;
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

  // Is this item or any descendant active?
  const isActive = item.path
    ? item.path === currentPath
    : isDescendantActive(item, currentPath);

  // Indent based on depth
  const paddingLeft = depth === 0 ? "px-6" : `pl-${4 + depth * 4} pr-4`;

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
          <span className="text-sm font-medium truncate">{item.label}</span>
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
      {isActive && (
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
  const navigate = useNavigate();
  // Admin info localStorage se
  const adminRaw = localStorage.getItem("admin");
  const admin = adminRaw ? JSON.parse(adminRaw) : null;
  const initials = admin
    ? `${admin.firstname?.[0] ?? ""}${admin.lastname?.[0] ?? ""}`.toUpperCase()
    : "A";

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("token");
    navigate("/login"); // ya jo bhi login route ho
  };
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

    findOpenMenus(menuItems, 0);
    setOpenMenus(autoOpen);
  }, [location.pathname]);

  const toggleMenu = (key: string) => {
    setOpenMenus(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  // Active label for top bar
  const getActiveLabel = (): string => {
    const findActive = (items: MenuItem[]): string => {
      for (const item of items) {
        if (item.path === location.pathname) return item.label;
        if (item.children) {
          const found = findActive(item.children);
          if (found) return found;
        }
      }
      return "Dashboard";
    };
    return findActive(menuItems);
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
    return findParent(menuItems, active) || active;
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className={`${collapsed ? "w-20" : "w-64"} bg-white flex flex-col transition-all duration-300`}>

        {/* LOGO */}
        <div className="h-20 flex items-center justify-center">
          <img
            src={logo}
            className={`transition-all duration-300 ${collapsed ? "w-8" : "w-40"}`}
          />
        </div>

        {/* NAV */}
        <nav className={`flex-1 px-4 space-y-1 text-sm overflow-y-auto ${!collapsed ? "mt-6" : ""}`}>
          {menuItems.map((item) => (
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
      <main className="flex-1 p-6 space-y-6">
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
            <button className="px-4 py-1 rounded-lg bg-green-500 text-white text-sm">
              Yearly
            </button>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-xl transition-all"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {admin ? `${admin.firstname} ${admin.lastname}` : "Admin"}
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
                    {/* Admin info */}
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-800">
                        {admin ? `${admin.firstname} ${admin.lastname}` : "Admin"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{admin?.email ?? ""}</p>
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