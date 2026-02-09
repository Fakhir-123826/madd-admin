import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type CategoryData = {
  name: string;
  value: number;
};

const data: CategoryData[] = [
  { name: "Electronics", value: 200 },
  { name: "Beauty", value: 30 },
  { name: "Fashion", value: 180 },
  { name: "Home Decor", value: 60 },
  { name: "Electronics", value: 200 },
  { name: "Beauty", value: 30 },
  { name: "Fashion", value: 180 },
  { name: "Home Decor", value: 60 },
  { name: "Fashion", value: 180 },
  { name: "Fashion", value: 180 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white p-2 rounded shadow text-xs">
      <p className="font-medium">{payload[0].payload.name}</p>
      <p className="text-emerald-500">{payload[0].value}%</p>
    </div>
  );
};

const TopSellingCategoriesChart = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Top Selling Categories</h3>

        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded-md text-sm text-gray-500">
            Category
          </button>
          <button className="px-4 py-1 rounded-md bg-green-500 text-white text-sm">
            Yearly
          </button>
        </div>
      </div>

      {/* CHART */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={10}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopSellingCategoriesChart;
