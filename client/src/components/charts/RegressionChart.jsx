import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const RegressionChart = ({ baseline, current, data }) => {
  return (
    <div className='h-64'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
          <XAxis
            dataKey='timestamp'
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}ms`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value}ms`, "Response Time"]}
          />
          {baseline && (
            <ReferenceLine
              y={baseline}
              stroke='#22c55e'
              strokeDasharray='5 5'
              label={{ value: "Baseline", fill: "#22c55e", fontSize: 10 }}
            />
          )}
          <Line
            type='monotone'
            dataKey='responseTime'
            stroke='var(--primary)'
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegressionChart;
