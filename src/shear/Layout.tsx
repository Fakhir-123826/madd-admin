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

import { Outlet } from "react-router-dom";
import logo from "../../public/madd-admin.png";

const menuItems = [
  { label: "Dashboard", icon: FaHome },
  { label: "Stores", icon: FaStore },
  { label: "Catalog", icon: FaBox },
  { label: "Users", icon: FaUsers },
  { label: "Vendors", icon: FaHandshake },
  { label: "Settlements", icon: FaExchangeAlt },
  { label: "CMS", icon: FaFileAlt },
  { label: "OMS", icon: FaCogs },
  { label: "Integrations", icon: FaGlobe },
  { label: "Local Companies", icon: FaBuilding },
  { label: "Marketplace", icon: FaShoppingBag },
  { label: "MLM System", icon: FaProjectDiagram },
  { label: "Settings", icon: FaCog },
  { label: "Domain", icon: FaGlobe },
  { label: "Return Platform", icon: FaUndoAlt },
  { label: "Marketing", icon: FaBullhorn },
  { label: "Payments", icon: FaCreditCard },
  { label: "Taxes", icon: FaMoneyBill },
  { label: "Shipping", icon: FaTruck },
  { label: "Reports", icon: FaChartBar },
];


const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-white flex flex-col transition-all duration-300`}
      >
        {/* LOGO */}
        <div className="h-20 flex items-center justify-center">
          <img
            src={logo}
            className={`transition-all duration-300 ${
              collapsed ? "w-8" : "w-40"
            }`}
          />
        </div>

        {/* NAV */}
        <nav
        className={`flex-1 px-4 space-y-2 text-sm ${
            !collapsed ? "mt-6" : ""
        }`}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.label;

            return (
              <div key={item.label} className="relative">
                {/* LEFT BLUE LINE (ACTIVE) */}
                {isActive && (
                  <span className="absolute -left-4 top-3 bottom-3 w-1 rounded-full bg-blue-500" />
                )}

                <div
                  onClick={() => setActive(item.label)}
                  className={`flex items-center ${
                    collapsed ? "justify-center" : "gap-3 px-6"
                  } py-4 rounded-xl cursor-pointer transition-all
                  ${
                    isActive
                      ? "bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="text-lg" />
                  {!collapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </div>
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
