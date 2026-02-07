import React from 'react'
import { useState } from "react";
import { FaBars, FaHome, FaStore, FaUsers } from "react-icons/fa";
import logo from "../../public/madd-admin.png"
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div>
            <div className="min-h-screen flex bg-gray-100">

                <aside
                    className={`${collapsed ? "w-20" : "w-64"
                        } bg-white flex flex-col transition-all duration-300`}
                >
                    {/* LOGO */}
                    <div className={`h-20 flex items-center justify-center ${collapsed ? "" : "mb-10"}`}>
                        {collapsed ? (
                            <img src={logo} className="w-8" />
                        ) : (
                            <img src={logo} className="w-40" />
                        )}
                    </div>

                    {/* NAV */}
                    <nav className="flex-1 px-4 space-y-3 text-sm">

                        {/* DASHBOARD (ACTIVE)  */}
                        <div
                            className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-4"
                                } py-4 rounded-xl bg-blue-500 text-white cursor-pointer`}
                        >
                            <FaHome className="text-lg" />
                            {!collapsed && <span className="font-medium">Dashboard</span>}
                        </div>

                        {/* STORES */}
                        <div
                            className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-4"
                                } py-4 rounded-xl text-gray-600 hover:bg-gray-100 cursor-pointer`}
                        >
                            <FaStore className="text-lg" />
                            {!collapsed && <span>Stores</span>}
                        </div>

                        {/* USERS */}
                        <div
                            className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-4"
                                } py-4 rounded-xl text-gray-600 hover:bg-gray-100 cursor-pointer`}
                        >
                            <FaUsers className="text-lg" />
                            {!collapsed && <span>Users</span>}
                        </div>

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
                            <span className="font-medium">Dashboard</span>

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

                    <Outlet/>

                </main>
            </div>


        </div>
    )
}

export default Layout