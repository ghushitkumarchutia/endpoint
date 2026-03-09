import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CURRENCY_SYMBOLS = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
};

const CostBreakdownChart = ({ data, currency = "USD" }) => {
  const currencySymbol = CURRENCY_SYMBOLS[currency] || "$";

  const formatCurrency = useMemo(
    () => (value) => {
      if (value >= 1000) {
        return `${currencySymbol}${(value / 1000).toFixed(1)}k`;
      }
      return `${currencySymbol}${value.toFixed(value < 1 ? 2 : 0)}`;
    },
    [currencySymbol],
  );

  const tooltipFormatter = useMemo(
    () => (value) => [
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
      }).format(value),
      "Cost",
    ],
    [currency],
  );

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
            dataKey='name'
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={tooltipFormatter}
          />
          <Bar dataKey='value' fill='var(--primary)' radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostBreakdownChart;
