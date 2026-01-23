import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-popover border border-border p-3 rounded-lg shadow-lg'>
        <p className='text-sm font-medium text-popover-foreground mb-2'>
          {format(new Date(label), "MMM d, HH:mm")}
        </p>
        <p className='text-sm text-primary'>
          Time:{" "}
          <span className='font-mono font-bold'>{payload[0].value}ms</span>
        </p>
        <p
          className={`text-xs mt-1 ${
            payload[0].payload.success ? "text-green-500" : "text-red-500"
          }`}
        >
          {payload[0].payload.success ? "Success" : "Failed"}
        </p>
      </div>
    );
  }
  return null;
};

const ResponseTimeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className='h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border'>
        No data available for the selected period
      </div>
    );
  }

  return (
    <div className='h-[300px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray='3 3'
            stroke='var(--border)'
            vertical={false}
          />
          <XAxis
            dataKey='timestamp'
            tickFormatter={(str) => format(new Date(str), "HH:mm")}
            stroke='var(--muted-foreground)'
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke='var(--muted-foreground)'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            unit='ms'
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "var(--border)" }}
          />
          <Line
            type='monotone'
            dataKey='responseTime'
            stroke='var(--primary)'
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "var(--primary)" }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResponseTimeChart;
