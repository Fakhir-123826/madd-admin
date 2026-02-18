import { useState } from "react";
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import SalesOrdersChart from "../component/SalesOrdersChart";
import TopSellingCategoriesChart from "../component/TopSellingCategoriesChart";
// import { FaBars, FaHome, FaStore, FaUsers } from "react-icons/fa";
// import logo from "../../public/madd-admin.png"

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="bg-white/70 rounded-xl p-5 space-y-6">
            {/* OVERVIEW SECTION */}
            <div>
                <h2 className="text-2xl font-semibold">Overview</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-10">
                    {[
                        { title: "Total Sales", value: "$40,689", percentage: 8.5, isPositive: true },
                        { title: "Total Orders", value: "10,293", percentage: 8.5, isPositive: true },
                        { title: "Active Vendors", value: "1,000", percentage: 8.5, isPositive: false },
                        { title: "New Customers", value: "255", percentage: 8.5, isPositive: false },
                        { title: "Pending Returns", value: "4,578", percentage: 8.5, isPositive: true },
                    ].map((card, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg p-5 w-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group border border-gray-100"
                        >
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 to-green-50/0 group-hover:from-teal-50/50 group-hover:to-green-50/50 transition-all duration-300" />

                            {/* Right gradient border */}
                            <span className="absolute right-0 top-0 h-full w-[6px] bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl shadow-lg shadow-teal-200/50" />

                            {/* Bottom gradient border */}
                            <span className="absolute bottom-0 left-0 h-[5px] w-full bg-gradient-to-r from-teal-400 to-green-400 shadow-lg shadow-green-200/50" />

                            {/* Floating glow effect */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-teal-200/20 to-green-200/20 rounded-full blur-3xl group-hover:from-teal-200/30 group-hover:to-green-200/30 transition-all duration-500" />

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Title with gradient on hover */}
                                <h4 className="text-gray-500 text-sm font-medium mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-teal-600 group-hover:to-green-600 group-hover:bg-clip-text transition-all duration-300">
                                    {card.title}
                                </h4>

                                {/* Value */}
                                <div className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                                    {card.value}
                                </div>

                                {/* Percentage with icons */}
                                <div
                                    className={`flex items-center text-sm font-medium ${
                                        card.isPositive ? "text-green-500" : "text-red-500"
                                    }`}
                                >
                                    {card.isPositive ? (
                                        <IoTrendingUp className="mr-1 text-lg" />
                                    ) : (
                                        <IoTrendingDown className="mr-1 text-lg" />
                                    )}

                                    <span className="font-bold">{card.percentage}%</span>

                                    <span className="text-gray-400 ml-2 font-normal group-hover:text-gray-500 transition-colors">
                                        vs yesterday
                                    </span>
                                </div>
                            </div>

                            {/* Shine effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CHART SECTION - Sales Orders */}
            <div className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden group border border-gray-100">
                <SalesOrdersChart />
            </div>

            {/* VENDORS PERFORMANCE TABLE */}
            <div className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden group border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Vendors Performance</h3>
                    <button className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium hover:shadow-lg transition-shadow">
                        This Year
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-600 border-b border-gray-200">
                                <th className="py-3 font-medium">Profile</th>
                                <th className="py-3 font-medium">Name</th>
                                <th className="py-3 font-medium">Email</th>
                                <th className="py-3 font-medium">Revenue</th>
                                <th className="py-3 font-medium">Total Orders</th>
                                <th className="py-3 font-medium">Success Rate</th>
                                <th className="py-3 font-medium"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="border-b border-gray-100 last:border-none hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center text-white text-xs font-bold">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    </td>
                                    <td className="py-3 font-medium">Christine Brooks</td>
                                    <td className="py-3 text-gray-500">info@gmail.com</td>
                                    <td className="py-3 font-semibold">$2,346</td>
                                    <td className="py-3">324 Orders</td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 bg-green-100 text-green-600 rounded-md text-xs font-medium">
                                            98%
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-400 to-green-500 text-white text-xs font-medium hover:shadow-md transition-shadow">
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TOP SELLING CATEGORIES CHART */}
            <div className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden group border border-gray-100">
                <TopSellingCategoriesChart />
            </div>
        </div>
    )
}

export default Dashboard;