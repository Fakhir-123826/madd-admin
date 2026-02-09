// import React from 'react'
import { useState } from "react";
import SalesOrdersChart from "../component/SalesOrdersChart";
import TopSellingCategoriesChart from "../component/TopSellingCategoriesChart";
// import { FaBars, FaHome, FaStore, FaUsers } from "react-icons/fa";
// import logo from "../../public/madd-admin.png"

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>


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
            {/* <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">
                            Sales Trends and Orders Volume
                        </h3>

                        <div className="h-[300px] flex items-center justify-center border border-dashed rounded-lg text-gray-400">
                            <SalesOrdersChart/>
                        </div>
                    </div> */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SalesOrdersChart />
                </div>

                
            </div> */}


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-full">
                    <SalesOrdersChart />
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


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-full">
                    <TopSellingCategoriesChart />
                </div>
            </div>
        </>
    )
}

export default Dashboard
