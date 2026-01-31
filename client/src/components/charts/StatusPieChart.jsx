import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const StatusPieChart = ({ stats }) => {
  if (!stats) {
    return (
      <div className='h-[200px] flex items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 text-xs'>
        No data
      </div>
    );
  }

  const data = [
    { name: "Healthy", value: stats.healthyCount, color: "#22c55e" }, // green-500
    { name: "Warning", value: stats.warningCount, color: "#eab308" }, // yellow-500
    { name: "Down", value: stats.downCount, color: "#ef4444" }, // red-500
  ].filter((item) => item.value > 0);

  // If mostly healthy, just show one green ring
  const displayData =
    data.length > 0 ? data : [{ name: "No Data", value: 1, color: "#f3f4f6" }];

  return (
    <div className='h-[240px] w-full flex flex-col items-center justify-center'>
      <div className='h-[180px] w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={displayData}
              cx='50%'
              cy='50%'
              innerRadius={65}
              outerRadius={85}
              paddingAngle={0}
              dataKey='value'
              startAngle={90}
              endAngle={-270}
              stroke='none'
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#1f2937",
                padding: "8px",
              }}
              itemStyle={{ color: "#1f2937" }}
              cursor={false}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend Below */}
      <div className='flex items-center gap-2 mt-2'>
        {data.length > 0 ? (
          data.map((item) => (
            <div key={item.name} className='flex items-center gap-1.5'>
              <span
                className='w-2.5 h-2.5 rounded-full'
                style={{ backgroundColor: item.color }}
              ></span>
              <span
                className='text-sm font-medium'
                style={{ color: item.color }}
              >
                {item.name}
              </span>
            </div>
          ))
        ) : (
          <span className='text-xs text-gray-400'>No active monitors</span>
        )}
      </div>
    </div>
  );
};

export default StatusPieChart;
