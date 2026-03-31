"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Props {
  payments: Payment[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onSelectPayment: (payment: Payment) => void;
}

export function PaymentsTable({
  payments,
  pagination,
  onPageChange,
  onSelectPayment,
}: Props) {
  if (payments.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="w-8 h-8 text-accent/40" />
        </div>
        <p className="text-muted-foreground font-medium">
          No se encontraron pagos
        </p>
        <p className="text-muted text-sm mt-1">
          Ajusta los filtros o espera a que lleguen nuevos pagos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mobile card view */}
      <div className="lg:hidden space-y-2">
        {payments.map((payment) => (
          <div
            key={payment.id}
            onClick={() => onSelectPayment(payment)}
            className="glass rounded-xl p-3 cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{payment.payerName}</p>
              </div>
              <p className="text-sm font-bold text-accent-light ml-2">
                {formatCurrency(payment.amount)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    payment.company === "Gamingo"
                      ? "bg-accent/15 text-accent-light"
                      : "bg-accent-blue/15 text-accent-blue-light"
                  }`}
                >
                  {payment.company}
                </span>
                {payment.concept && (
                  <span className="text-[10px] text-muted truncate max-w-[100px]">
                    {payment.concept}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted">
                {formatDate(payment.receivedTimestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden lg:block glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Ordenante</th>
                <th>Monto</th>
                <th>Empresa</th>
                <th>Concepto</th>
                <th>Clave Rastreo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="cursor-pointer"
                  onClick={() => onSelectPayment(payment)}
                >
                  <td className="whitespace-nowrap text-muted-foreground">
                    {formatDate(payment.receivedTimestamp)}
                  </td>
                  <td>
                    <div className="font-medium">{payment.payerName}</div>
                    <div className="text-xs text-muted font-mono">
                      {payment.payerAccount}
                    </div>
                  </td>
                  <td className="font-semibold text-accent-light whitespace-nowrap">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        payment.company === "Gamingo"
                          ? "bg-accent/15 text-accent-light"
                          : "bg-accent-blue/15 text-accent-blue-light"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current pulse-dot" />
                      {payment.company}
                    </span>
                  </td>
                  <td className="max-w-[200px] truncate text-muted-foreground">
                    {payment.concept || "\u2014"}
                  </td>
                  <td className="font-mono text-xs text-muted whitespace-nowrap">
                    {payment.trackingKey.length > 25
                      ? payment.trackingKey.substring(0, 25) + "..."
                      : payment.trackingKey}
                  </td>
                  <td>
                    <button className="p-1.5 rounded-lg hover:bg-accent/10 text-muted hover:text-accent-light transition-all">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 sm:px-4 py-3 glass rounded-2xl">
          <p className="text-xs sm:text-sm text-muted">
            <span className="font-medium text-foreground">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>
            {" - "}
            <span className="font-medium text-foreground">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>
            {" de "}
            <span className="font-medium text-foreground">
              {pagination.total.toLocaleString("es-MX")}
            </span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from(
              { length: Math.min(pagination.totalPages, 5) },
              (_, i) => {
                let pageNum: number;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      pageNum === pagination.page
                        ? "bg-accent text-white"
                        : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
