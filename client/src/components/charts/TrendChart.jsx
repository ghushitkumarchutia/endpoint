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

const TrendChart = ({
  data,
  dataKey = "value",
  xKey = "date",
  threshold,
  unit = "",
}) => {
  if (!data || data.length === 0) {
    return (
      <div className='h-64 flex items-center justify-center text-muted-foreground'>
        No trend data available
      </div>
    );
  }

  return (
    <div className='h-64'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}${unit}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value}${unit}`, "Value"]}
          />
          {threshold && (
            <ReferenceLine
              y={threshold}
              stroke='#ef4444'
              strokeDasharray='5 5'
              label={{ value: "Threshold", fill: "#ef4444", fontSize: 10 }}
            />
          )}
          <Line
            type='monotone'
            dataKey={dataKey}
            stroke='var(--primary)'
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
