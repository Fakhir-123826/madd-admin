// src/screens/Reports/Reports.tsx
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    FaChartLine,
    FaMoneyBillWave,
    FaShoppingCart,
    FaStore,
    FaBox,
    FaDownload,
} from "react-icons/fa";

const REPORT_TABS = [
    { key: "platform", label: "Platform", icon: <FaChartLine className="text-sm" /> },
    { key: "financial", label: "Financial", icon: <FaMoneyBillWave className="text-sm" /> },
    { key: "sales", label: "Sales", icon: <FaShoppingCart className="text-sm" /> },
    { key: "vendor-performance", label: "Vendor Performance", icon: <FaStore className="text-sm" /> },
    { key: "product-performance", label: "Product Performance", icon: <FaBox className="text-sm" /> },
    { key: "export", label: "Export", icon: <FaDownload className="text-sm" /> },
];

const Reports = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.split("/").pop() || "platform";

    const handleTabChange = (tab: string) => {
        navigate(`/reports/${tab}`);
    };

    return (
        <div className="bg-white min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        View detailed platform performance and analytics
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
                    {REPORT_TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => handleTabChange(tab.key)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all whitespace-nowrap
                                ${currentPath === tab.key
                                    ? "text-teal-600 border-b-2 border-teal-500 bg-teal-50/30"
                                    : "text-gray-500 hover:text-teal-600 border-b-2 border-transparent"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Nested Route Content */}
                <Outlet />
            </div>
        </div>
    );
};

export default Reports;