// src/screens/Config/Config.tsx
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    FaGlobe,
    FaFileContract,
    FaMoneyBillWave,
    FaLanguage,
    FaPalette,
    FaTruck,
} from "react-icons/fa";

const CONFIG_TABS = [
    { key: "countries", label: "Countries", icon: <FaGlobe className="text-sm" /> },
    { key: "sales-policies", label: "Sales Policies", icon: <FaFileContract className="text-sm" /> },
    { key: "currencies", label: "Currencies", icon: <FaMoneyBillWave className="text-sm" /> },
    { key: "languages", label: "Languages", icon: <FaLanguage className="text-sm" /> },
    { key: "themes", label: "Themes", icon: <FaPalette className="text-sm" /> },
    { key: "couriers", label: "Couriers", icon: <FaTruck className="text-sm" /> },
];

const Config = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentTab = location.pathname.split("/").pop() || "countries";

    const handleTabChange = (tab: string) => {
        navigate(`/config/${tab}`);
    };

    return (
        <div className="bg-white min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">System Configuration</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage countries, currencies, languages, themes, and shipping carriers
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
                    {CONFIG_TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => handleTabChange(tab.key)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all whitespace-nowrap
                                ${currentTab === tab.key
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

export default Config;