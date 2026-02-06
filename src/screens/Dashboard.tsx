import React from 'react'
import { useState } from "react";
import { FaBars, FaHome, FaStore, FaUsers } from "react-icons/fa";
import logo from "../../public/madd-admin.png"

const Dashboard = () => {
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

                        {/* DASHBOARD (ACTIVE) */}
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

                    {/* OVERVIEW */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Overview</h2>

                        <div className="grid grid-cols-5 gap-4">
                            {[
                                { title: "Total Sales", value: "$40,689" },
                                { title: "Total Orders", value: "10,293" },
                                { title: "Active Vendors", value: "1,000" },
                                { title: "New Customers", value: "255" },
                                { title: "Pending Returns", value: "4,578" },
                            ].map((card) => (
                                <div
                                    key={card.title}
                                    className="bg-white rounded-xl p-4 border-l-4 border-green-400 shadow-sm"
                                >
                                    <p className="text-sm text-gray-500">{card.title}</p>
                                    <p className="text-xl font-semibold mt-1">{card.value}</p>
                                    <p className="text-xs text-green-500 mt-1">▲ 8.5% Up from yesterday</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CHART SECTION */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">
                            Sales Trends and Orders Volume
                        </h3>

                        {/* Chart placeholder */}
                        <div className="h-[300px] flex items-center justify-center border border-dashed rounded-lg text-gray-400">
                            Chart goes here
                        </div>
                    </div>

                    {/* TABLE SECTION */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Vendors Performance</h3>
                            <button className="px-4 py-1 rounded-lg bg-green-500 text-white text-sm">
                                Yearly
                            </button>
                        </div>

                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="py-2">Profile</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Revenue</th>
                                    <th>Total Orders</th>
                                    <th>Success Rate</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {[1, 2, 3].map((i) => (
                                    <tr key={i} className="border-b last:border-none">
                                        <td className="py-3">
                                            <div className="h-8 w-8 rounded-full bg-gray-300" />
                                        </td>
                                        <td>Christine Brooks</td>
                                        <td>info@gmail.com</td>
                                        <td>$2,346</td>
                                        <td>324 Orders</td>
                                        <td>98%</td>
                                        <td>
                                            <button className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 text-xs">
                                                View Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </main>
            </div>

        </div>
    )
}

export default Dashboard
