import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FiChevronDown } from "react-icons/fi";

type MonthlyData = {
  name: string;
  value: number;
};

const data: MonthlyData[] = [
  { name: "Jan", value: 10000 },
  { name: "Feb", value: 800 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 1200 },
  { name: "May", value: 6500 },
  { name: "Jun", value: 900 },
  { name: "Jul", value: 7000 },
  { name: "Aug", value: 7500 },
  { name: "Sep", value: 3500 },
  { name: "Oct", value: 6200 },
  { name: "Nov", value: 6800 },
  { name: "Dec", value: 9500 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white p-3 rounded-lg shadow-md text-xs border">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      <p className="text-blue-500 font-semibold">
        ${payload[0].value.toLocaleString()}
      </p>
      <p className="text-green-500 text-[10px]">+5.6%</p>
    </div>
  );
};

const MonthlyCommissionPayout = () => {
  return (
    <div className="">
      <div className="bg-white rounded-xl p-6 shadow-sm">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Monthly Commission Payout
          </h3>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm text-gray-600 bg-gray-50">
              Commission Payout
              <FiChevronDown size={16} />
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-500 text-white text-sm">
              Yearly
              <FiChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* CHART */}
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={30}>
              <CartesianGrid
                strokeDasharray="3 3"
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
                tickFormatter={(value) => `$${value / 1000}k`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />

              <Bar
                dataKey="value"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MonthlyCommissionPayout;
