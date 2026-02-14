// 

// const VendorDashBoard = () => {
//   return (
//     <div>




//     </div>
//   )
// }

// export default VendorDashBoard


import { useState } from "react";
import SalesOrdersChart from "../../component/SalesOrdersChart";
import TopSellingCategoriesChart from "../../component/TopSellingCategoriesChart";

const stats = [
  { title: "Total Revenue", value: "$40,689", sub: "+8.5% from yesterday" },
  { title: "Total Orders", value: "10,293", sub: "+1.3% from yesterday" },
  { title: "Total Sales", value: "$35,567", sub: "+1.3% from yesterday" },
  { title: "Total Visitors", value: "23,456", sub: "+8.5% from yesterday" },
  { title: "Pending Orders", value: "245", sub: "-4.3% from yesterday" },
];

const VendorDashBoard = () => {
  const [range, setRange] = useState<"Yearly" | "Monthly">("Yearly");

  return (
    <div className="space-y-6">
      {/* OVERVIEW */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="text-2xl font-semibold mt-1">{item.value}</p>
              <p className="text-xs text-green-500 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SALES CHART */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Sales Trends and Orders Volume
          </h3>

          <button className="px-4 py-1 rounded-lg bg-blue-500 text-white text-sm">
            Yearly
          </button>
        </div>

        <SalesOrdersChart />
      </div>

      {/* TOP SELLING */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Selling Products</h3>

          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg bg-gray-100 text-sm">
              Category
            </button>
            <button className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm">
              Yearly
            </button>
          </div>
        </div>

        <TopSellingCategoriesChart />
      </div>

      {/* ORDERS HISTORY */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium">
          Orders History
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Order ID</th>
                <th>Customer Name</th>
                <th>Date & Time</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {[
                { id: "#726589", name: "John Smith", status: "Pending" },
                { id: "#726588", name: "John Smith", status: "Delivered" },
                { id: "#726587", name: "John Smith", status: "Canceled" },
              ].map((row) => (
                <tr key={row.id} className="border-b last:border-none">
                  <td className="py-3">{row.id}</td>
                  <td>{row.name}</td>
                  <td>14 Jun – 12:30 PM</td>
                  <td>2</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          row.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : row.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorDashBoard;
