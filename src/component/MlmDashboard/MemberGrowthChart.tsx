import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FiChevronDown, FiTrendingUp } from "react-icons/fi";

type MonthlyData = {
  name: string;
  members: number;
  growth: string;
};

const data: MonthlyData[] = [
  { name: "Jan", members: 10990, growth: "+8.2%" },
  { name: "Feb", members: 900, growth: "+2.1%" },
  { name: "Mar", members: 5000, growth: "+4.3%" },
  { name: "Apr", members: 1100, growth: "+1.2%" },
  { name: "May", members: 7200, growth: "+6.5%" },
  { name: "Jun", members: 950, growth: "+0.8%" },
  { name: "Jul", members: 8300, growth: "+7.1%" },
  { name: "Aug", members: 7500, growth: "+5.6%" },
  { name: "Sep", members: 3500, growth: "+3.4%" },
  { name: "Oct", members: 6800, growth: "+4.9%" },
  { name: "Nov", members: 7200, growth: "+6.2%" },
  { name: "Dec", members: 10800, growth: "+9.4%" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="bg-white px-4 py-3 rounded-xl shadow-lg border text-xs">
      <p className="text-gray-700 font-medium mb-1">{label}</p>

      <div className="flex items-center gap-2 text-blue-500 font-semibold">
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
        {item.members.toLocaleString()} Members
      </div>

      <div className="flex items-center gap-1 text-green-500 text-[11px] mt-1">
        <FiTrendingUp size={12} />
        {item.growth}
      </div>
    </div>
  );
};

const MemberGrowthChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Member Growth
        </h3>

        <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white bg-gradient-to-r from-teal-400 to-green-500 hover:opacity-90 transition">
          Yearly
          <FiChevronDown size={16} />
        </button>
      </div>

      {/* CHART */}
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={32}>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />

            <Bar
              dataKey="members"
              fill="#3B82F6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MemberGrowthChart;
