"use client";

import {
  DollarSign,
  TrendingUp,
  Calendar,
  Activity,
  Building2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface StatsProps {
  stats: {
    totalPayments: number;
    todayPayments: number;
    todayAmount: number;
    weekAmount: number;
    monthAmount: number;
    byCompany: { company: string; total: number; count: number }[];
  };
}

export function StatsCards({ stats }: StatsProps) {
  const cards = [
    {
      label: "Pagos Hoy",
      value: stats.todayPayments.toString(),
      subvalue: formatCurrency(stats.todayAmount),
      icon: Activity,
      gradient: "from-accent to-purple-700",
      glow: "glow-purple",
    },
    {
      label: "Semana",
      value: formatCurrency(stats.weekAmount),
      subvalue: "Últimos 7 días",
      icon: TrendingUp,
      gradient: "from-accent-blue to-blue-700",
      glow: "glow-blue",
    },
    {
      label: "Mes",
      value: formatCurrency(stats.monthAmount),
      subvalue: "Mes actual",
      icon: Calendar,
      gradient: "from-indigo-600 to-accent",
      glow: "glow-purple",
    },
    {
      label: "Total Pagos",
      value: stats.totalPayments.toLocaleString("es-MX"),
      subvalue: "Histórico",
      icon: DollarSign,
      gradient: "from-violet-600 to-accent-blue",
      glow: "glow-blue",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`glass rounded-xl sm:rounded-2xl p-3 sm:p-5 hover-lift ${card.glow}`}
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-muted text-[10px] sm:text-xs font-medium uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent truncate">
                  {card.value}
                </p>
                <p className="text-muted text-[10px] sm:text-xs mt-0.5 sm:mt-1">{card.subvalue}</p>
              </div>
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shrink-0`}
              >
                <card.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Company breakdown */}
      {stats.byCompany.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {stats.byCompany.map((company) => (
            <div
              key={company.company}
              className="glass rounded-xl sm:rounded-2xl p-3 sm:p-5 hover-lift"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
                    company.company === "Gamingo"
                      ? "bg-accent/15 text-accent-light"
                      : "bg-accent-blue/15 text-accent-blue-light"
                  }`}
                >
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span className="font-semibold text-sm sm:text-base">{company.company}</span>
                <span className="text-muted text-[10px] sm:text-xs ml-auto">
                  {company.count} pagos
                </span>
              </div>
              <p className="text-base sm:text-xl font-bold bg-gradient-to-r from-accent-light to-accent-blue-light bg-clip-text text-transparent">
                {formatCurrency(company.total)}
              </p>
              <div className="mt-2 sm:mt-3 h-1 sm:h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${
                    company.company === "Gamingo"
                      ? "from-accent to-purple-500"
                      : "from-accent-blue to-blue-400"
                  }`}
                  style={{
                    width: `${Math.min(
                      (company.total /
                        Math.max(
                          ...stats.byCompany.map((c) => c.total),
                          1
                        )) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
