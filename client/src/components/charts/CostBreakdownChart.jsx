import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CostBreakdownChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className='h-64 flex items-center justify-center text-muted-foreground'>
        No cost data available
      </div>
    );
  }

  return (
    <div className='h-64'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
          <XAxis
            dataKey='date'
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [`$${value.toFixed(2)}`, "Cost"]}
          />
          <Bar dataKey='cost' fill='var(--primary)' radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostBreakdownChart;
