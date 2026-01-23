import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

const SLAGaugeChart = ({ compliance }) => {
  const compliant = compliance?.overall ? 1 : 0;
  const data = [
    { name: "Compliant", value: compliant },
    { name: "Non-Compliant", value: 1 - compliant },
  ];

  return (
    <div className='h-48'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            innerRadius={40}
            outerRadius={60}
            paddingAngle={5}
            dataKey='value'
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
          />
          <Legend
            verticalAlign='bottom'
            height={36}
            formatter={(value) => (
              <span style={{ color: "var(--foreground)", fontSize: "12px" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SLAGaugeChart;
