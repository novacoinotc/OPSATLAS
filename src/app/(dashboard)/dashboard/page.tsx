"use client";

import { useEffect, useState, useCallback } from "react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PaymentsChart } from "@/components/dashboard/payments-chart";
import { PaymentsTable } from "@/components/dashboard/payments-table";
import { PaymentFiltersBar } from "@/components/dashboard/payment-filters";
import { PaymentDetailModal } from "@/components/dashboard/payment-detail-modal";
import { RefreshCw, Download } from "lucide-react";

interface Payment {
  id: string;
  trackingKey: string;
  amount: number;
  payerName: string;
  payerAccount: string;
  beneficiaryAccount: string;
  concept: string | null;
  numericalReference: string | null;
  receivedTimestamp: string;
  company: string;
}

interface Stats {
  totalPayments: number;
  todayPayments: number;
  todayAmount: number;
  weekAmount: number;
  monthAmount: number;
  byCompany: { company: string; total: number; count: number }[];
  recentPayments: Payment[];
  dailyChart: { date: string; total: number; count: number }[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Filters {
  search: string;
  company: string;
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<Filters>({
    search: "",
    company: "",
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/payments/stats");
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    }
  }, []);

  const fetchPayments = useCallback(
    async (page = 1) => {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "25");
      if (filters.search) params.set("search", filters.search);
      if (filters.company) params.set("company", filters.company);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);
      if (filters.minAmount) params.set("minAmount", filters.minAmount);
      if (filters.maxAmount) params.set("maxAmount", filters.maxAmount);

      const res = await fetch(`/api/payments?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments);
        setPagination(data.pagination);
      }
    },
    [filters]
  );

  useEffect(() => {
    Promise.all([fetchStats(), fetchPayments()]).finally(() =>
      setLoading(false)
    );
  }, [fetchStats, fetchPayments]);

  async function handleRefresh() {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchPayments(pagination.page)]);
    setRefreshing(false);
  }

  function handleExport() {
    const params = new URLSearchParams();
    if (filters.company) params.set("company", filters.company);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    window.open(`/api/payments/export?${params}`, "_blank");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-muted text-sm">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted text-sm mt-1">
            Monitoreo de pagos SPEI en tiempo real
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground glass border border-border hover:border-border-bright transition-all"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-accent to-accent-blue hover:from-accent-light hover:to-accent-blue-light transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && <StatsCards stats={stats} />}

      {/* Chart */}
      {stats && stats.dailyChart.length > 0 && (
        <PaymentsChart data={stats.dailyChart} />
      )}

      {/* Filters */}
      <PaymentFiltersBar
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters);
        }}
        onApply={() => fetchPayments(1)}
      />

      {/* Table */}
      <PaymentsTable
        payments={payments}
        pagination={pagination}
        onPageChange={(page) => fetchPayments(page)}
        onSelectPayment={setSelectedPayment}
      />

      {/* Detail Modal */}
      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
}
