// src/screens/Settings/Settings.tsx
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    FaCog,
    FaCreditCard,
    FaTruck,
    FaFileInvoiceDollar,
    FaEnvelope,
    FaShieldAlt,
    FaDatabase,
} from "react-icons/fa";

const SETTINGS_TABS = [
    { key: "system", label: "System Settings", icon: <FaCog className="text-sm" /> },
    { key: "payment", label: "Payment Settings", icon: <FaCreditCard className="text-sm" /> },
    { key: "shipping", label: "Shipping Settings", icon: <FaTruck className="text-sm" /> },
    { key: "tax", label: "Tax Settings", icon: <FaFileInvoiceDollar className="text-sm" /> },
    { key: "email", label: "Email Settings", icon: <FaEnvelope className="text-sm" /> },
];

const Settings = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentTab = location.pathname.split("/").pop() || "system";

    const handleTabChange = (tab: string) => {
        navigate(`/settings/${tab}`);
    };

    return (
        <div className="bg-white min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Configure your system preferences and configurations</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
                    {SETTINGS_TABS.map((tab) => (
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

                {/* Content */}
                <Outlet />
            </div>
        </div>
    );
};

export default Settings;