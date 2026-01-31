import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white border border-gray-100 p-3 rounded-lg shadow-xl'>
        <p className='text-xs font-bold text-gray-500 mb-1'>
          {format(new Date(label), "MMM d, HH:mm")}
        </p>
        <p className='text-sm font-bold text-gray-900'>{payload[0].value}ms</p>
      </div>
    );
  }
  return null;
};

const ResponseTimeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className='h-full flex items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 text-sm'>
        No data available
      </div>
    );
  }

  return (
    <div className='h-full w-full min-h-[300px]'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey='timestamp'
            tickFormatter={(str) => format(new Date(str), "HH:mm")}
            stroke='#9ca3af'
            fontSize={10}
            tickLine={false}
            axisLine={false}
            dy={10}
            minTickGap={30}
          />
          <YAxis
            stroke='#9ca3af'
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}ms`}
            dx={-5}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
          />
          <Line
            type='monotone'
            dataKey='responseTime'
            stroke='#14412B'
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: "#14412B", strokeWidth: 0 }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResponseTimeChart;
