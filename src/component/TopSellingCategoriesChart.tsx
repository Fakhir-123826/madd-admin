import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { TopProduct } from "../app/api/DashboardSlices/DashboardApi";
import { FaBoxOpen } from "react-icons/fa";

interface TopSellingCategoriesChartProps {
  data?: TopProduct[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-sm">
      <p className="font-bold text-gray-800 mb-1">{payload[0].payload.name}</p>
      <div className="flex items-center gap-2 text-emerald-600 font-semibold">
        <span>Quantity:</span>
        <span>{payload[0].value}</span>
      </div>
    </div>
  );
};

const TopSellingCategoriesChart = ({ data }: TopSellingCategoriesChartProps) => {
  const chartData = data?.map((item) => ({
    name: item.product_name,
    value: item.total_quantity,
  })) || [];

  if (chartData.length === 0) {
    return (
      <div className="h-[320px] w-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/30 rounded-xl border border-dashed border-gray-200">
        <FaBoxOpen className="text-4xl text-gray-200 mb-3" />
        <span className="text-sm font-semibold text-gray-500 mb-1">No Products Sold</span>
        <span className="text-xs text-gray-400">There is no product data for the selected period.</span>
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 20 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            stroke="#f0f0f0"
          />

          <XAxis
            type="number"
            hide
          />

          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            width={100}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />

          <Bar
            dataKey="value"
            fill="url(#barGradient)"
            radius={[0, 4, 4, 0]}
            barSize={12}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopSellingCategoriesChart;

