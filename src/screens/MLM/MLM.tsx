// src/screens/MLM/MLM.tsx
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    FaUsers,
    FaMoneyBillWave,
    FaProjectDiagram,
    FaLayerGroup,
    FaChartLine,
} from "react-icons/fa";

const MLM_TABS = [
    { key: "dashboard", label: "Dashboard", icon: <FaChartLine className="text-sm" /> },
    { key: "agents", label: "Agents", icon: <FaUsers className="text-sm" /> },
    { key: "commissions", label: "Commissions", icon: <FaMoneyBillWave className="text-sm" /> },
    { key: "structure", label: "Structure", icon: <FaProjectDiagram className="text-sm" /> },
    { key: "levels", label: "Levels", icon: <FaLayerGroup className="text-sm" /> },
];

const MLM = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get current tab from URL
    const currentTab = location.pathname.split("/").pop() || "dashboard";

    const handleTabChange = (tab: string) => {
        navigate(`/mlm/${tab}`);
    };

    return (
        <div className="bg-white min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">MLM Management</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage agents, commissions, and MLM structure
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
                    {MLM_TABS.map((tab) => (
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

export default MLM;