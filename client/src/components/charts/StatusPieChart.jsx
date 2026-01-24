import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const StatusPieChart = ({ stats }) => {
  if (!stats) {
    return (
      <div className='h-[250px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border'>
        No API data available
      </div>
    );
  }

  const data = [
    { name: "Healthy", value: stats.healthyCount, color: "#22c55e" }, // green-500
    { name: "Warning", value: stats.warningCount, color: "#eab308" }, // yellow-500
    { name: "Down", value: stats.downCount, color: "#ef4444" }, // red-500
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div className='h-[250px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border'>
        No API data available
      </div>
    );
  }

  return (
    <div className='h-[250px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey='value'
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke='none' />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--popover)",
              borderColor: "var(--border)",
              borderRadius: "0.5rem",
              color: "var(--popover-foreground)",
            }}
            itemStyle={{ color: "var(--popover-foreground)" }}
          />
          <Legend verticalAlign='bottom' height={36} iconType='circle' />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusPieChart;
