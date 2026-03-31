"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface ChartProps {
  data: { date: string; total: number; count: number }[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-strong rounded-xl p-3 border border-accent/20">
      <p className="text-xs text-muted mb-1">
        {new Date(label + "T12:00:00").toLocaleDateString("es-MX", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </p>
      <p className="text-sm font-bold text-accent-light">
        {formatCurrency(payload[0].value)}
      </p>
      {payload[1] && (
        <p className="text-xs text-muted-foreground">
          {payload[1].value} operaciones
        </p>
      )}
    </div>
  );
}

export function PaymentsChart({ data }: ChartProps) {
  const chartData = data.map((d) => ({
    date: d.date,
    total: Number(d.total),
    count: Number(d.count),
  }));

  return (
    <div className="glass rounded-2xl p-6 glow-purple">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Pagos Últimos 30 Días
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(124,58,237,0.08)"
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "rgba(124,58,237,0.1)" }}
              tickFormatter={(value) => {
                const date = new Date(value + "T12:00:00");
                return date.toLocaleDateString("es-MX", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value >= 1000
                  ? `$${(value / 1000).toFixed(0)}k`
                  : `$${value}`
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#7c3aed"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
