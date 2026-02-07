import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  month: string;
  sales: number;
  orders: number;
};

const data: ChartData[] = [
  { month: "Jan", sales: 700, orders: 400 },
  { month: "Feb", sales: 350, orders: 90 },
  { month: "Mar", sales: 1000, orders: 160 },
  { month: "Apr", sales: 450, orders: 355 },
  { month: "May", sales: 500, orders: 600 },
  { month: "Jun", sales: 750, orders: 350 },
  { month: "Jul", sales: 350, orders: 90 },
  { month: "Aug", sales: 1000, orders: 150 },
  { month: "Sep", sales: 750, orders: 200 },
  { month: "Oct", sales: 450, orders: 260 },
  { month: "Nov", sales: 300, orders: 80 },
  { month: "Dec", sales: 950, orders: 420 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg bg-white p-3 shadow text-sm">
      <p className="font-medium mb-1">{label}</p>
      <p className="text-indigo-600">
        ● Sales: ${payload[0].value}
      </p>
      <p className="text-amber-500">
        ● Orders: {payload[1].value}
      </p>
    </div>
  );
};

const SalesOrdersChart = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Sales Trends and Orders Volume
      </h3>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={6}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            <Bar
              dataKey="sales"
              name="Sales"
              fill="#6366F1"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="orders"
              name="Orders Volume"
              fill="#F59E0B"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesOrdersChart;
