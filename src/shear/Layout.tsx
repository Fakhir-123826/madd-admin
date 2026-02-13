import { useState } from "react";
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
} from "react-icons/fa";

import { Link, Outlet } from "react-router-dom";
import logo from "../../public/madd-admin.png";

const menuItems = [
  { label: "Dashboard", icon: FaHome, path: "/" },
  {
    label: "Stores",
    icon: FaStore,
    path: "/store",
    children: [
      { label: "All Subscription", path: "/SubscriptionList" },
    ],
  },
  { label: "Catalog", icon: FaBox, path: "/" },
  { label: "Users", icon: FaUsers, path: "/" },
  // { label: "Vendors", icon: FaHandshake, path: "/Verder" },
  {
    label: "Vendors",
    icon: FaHandshake,
    path: "/Vendor",
    children: [
      { label: "All Vendors", path: "/Verdor" },
      { label: "Add Vendor Onboard", path: "/CreateVerderOnboard" },
      { label: "Vendor Requests", path: "/vendor/requests" },
    ],
  },
  { label: "Settlements", icon: FaExchangeAlt, path: "/" },
  { label: "CMS", icon: FaFileAlt, path: "/" },
  { label: "OMS", icon: FaCogs, path: "/" },
  { label: "Integrations", icon: FaGlobe, path: "/" },
  { label: "Local Companies", icon: FaBuilding, path: "/" },
  { label: "Marketplace", icon: FaShoppingBag, path: "/" },
  { label: "MLM System", icon: FaProjectDiagram, path: "/" },
  { label: "Settings", icon: FaCog, path: "/" },
  { label: "Domain", icon: FaGlobe, path: "/" },
  { label: "Return Platform", icon: FaUndoAlt, path: "/" },
  { label: "Marketing", icon: FaBullhorn, path: "/" },
  { label: "Payments", icon: FaCreditCard, path: "/" },
  { label: "Taxes", icon: FaMoneyBill, path: "/" },
  { label: "Shipping", icon: FaTruck, path: "/" },
  { label: "Reports", icon: FaChartBar, path: "/" },
];


const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [openMenu, setOpenMenu] = useState<string | null>(null);


  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside
        className={`${collapsed ? "w-20" : "w-64"
          } bg-white flex flex-col transition-all duration-300`}
      >
        {/* LOGO */}
        <div className="h-20 flex items-center justify-center">
          <img
            src={logo}
            className={`transition-all duration-300 ${collapsed ? "w-8" : "w-40"
              }`}
          />
        </div>

        {/* NAV */}
        <nav
          className={`flex-1 px-4 space-y-2 text-sm ${!collapsed ? "mt-6" : ""
            }`}
        >
          {/* {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.label;

            return (
              <div key={item.label} className="relative">
                {isActive && (
                  <span className="absolute -left-4 top-3 bottom-3 w-1 rounded-full bg-blue-500" />
                )}

                <Link to={item.path}>

                  <div
                    onClick={() => setActive(item.label)}
                    className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-6"
                      } py-4 rounded-xl cursor-pointer transition-all
                  ${isActive
                        ? "bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <Icon className="text-lg" />
                    {!collapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </div>

                </Link>
              </div>

            );
          })} */}


          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = Array.isArray(item.children) && item.children.length > 0;
            const isActive = active === item.label;
            const isOpen = openMenu === item.label;

            const MenuContent = (
              <div
                onClick={() => {
                  setActive(item.label);

                  if (hasChildren) {
                    setOpenMenu(isOpen ? null : item.label);
                  } else {
                    setOpenMenu(null);
                  }
                }}
                className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-6"
                  } py-4 rounded-xl cursor-pointer transition-all
                    ${isActive
                    ? "bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Icon className="text-lg" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </div>
            );

            return (
              <div key={item.label} className="relative">
                {isActive && (
                  <span className="absolute -left-4 top-3 bottom-3 w-1 rounded-full bg-blue-500" />
                )}

                {/* MAIN ITEM */}
                {hasChildren ? (
                  MenuContent
                ) : (
                  <Link to={item.path}>{MenuContent}</Link>
                )}

                {/* SUB MENU */}
                {!collapsed && hasChildren && isOpen && (
                  <div className="ml-10 mt-2 space-y-1">
                    {item.children!.map((child) => (
                      <Link key={child.label} to={child.path}>
                        <div
                          onClick={() => setActive(child.label)}
                          className="py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-100 text-sm"
                        >
                          {child.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}



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
            <span className="font-medium">{active}</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-1 rounded-lg bg-green-500 text-white text-sm">
              Yearly
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-200" />
              <span className="text-sm">Admin Portal</span>
            </div>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
