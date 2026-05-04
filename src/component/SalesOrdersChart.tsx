import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { DailyDataPoint } from "../app/api/DashboardSlices/DashboardApi";
import { FaChartBar } from "react-icons/fa";

interface SalesOrdersChartProps {
  data?: {
    daily_sales: DailyDataPoint[];
    daily_orders: DailyDataPoint[];
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl bg-white p-3 shadow-lg border border-gray-100 text-sm">
      <p className="font-bold text-gray-800 mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-gray-500">Sales:</span>
          <span className="font-bold text-indigo-600">${Number(payload[0].value).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-gray-500">Orders:</span>
          <span className="font-bold text-amber-600">{payload[1].value}</span>
        </div>
      </div>
    </div>
  );
};

const SalesOrdersChart = ({ data }: SalesOrdersChartProps) => {
  const mergedData = data?.daily_sales?.map((sale) => {
    const order = data.daily_orders?.find((o) => o.date === sale.date);
    const dateObj = new Date(sale.date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });

    return {
      date: formattedDate,
      sales: sale.total ?? 0,
      orders: order?.count ?? 0,
    };
  }) || [];

  if (mergedData.length === 0) {
    return (
      <div className="h-[320px] w-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/30 rounded-xl border border-dashed border-gray-200">
        <FaChartBar className="text-4xl text-gray-200 mb-3" />
        <span className="text-sm font-semibold text-gray-500 mb-1">No Data Available</span>
        <span className="text-xs text-gray-400">There are no sales or orders for the selected period.</span>
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={mergedData} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            content={({ payload }) => (
              <div className="flex justify-end gap-4 mb-4">
                {payload?.map((entry: any, index: number) => (
                  <div key={`item-${index}`} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs font-medium text-gray-500">{entry.value}</span>
                  </div>
                ))}
              </div>
            )}
          />

          <Bar
            dataKey="sales"
            name="Sales"
            fill="#6366F1"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
          <Bar
            dataKey="orders"
            name="Orders"
            fill="#F59E0B"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesOrdersChart;


