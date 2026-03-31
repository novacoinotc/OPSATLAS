"use client";

import { X, Copy, Check } from "lucide-react";
import { formatCurrency, formatDate, formatClabe } from "@/lib/utils";
import { useState } from "react";

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

interface Props {
  payment: Payment;
  onClose: () => void;
}

export function PaymentDetailModal({ payment, onClose }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  }

  const fields = [
    { label: "Clave de Rastreo", value: payment.trackingKey, copyable: true },
    { label: "Monto", value: formatCurrency(payment.amount) },
    { label: "Ordenante", value: payment.payerName },
    {
      label: "CLABE Origen",
      value: formatClabe(payment.payerAccount),
      copyable: true,
      rawValue: payment.payerAccount,
    },
    {
      label: "CLABE Destino",
      value: formatClabe(payment.beneficiaryAccount),
      copyable: true,
      rawValue: payment.beneficiaryAccount,
    },
    { label: "Empresa", value: payment.company },
    { label: "Concepto", value: payment.concept || "Sin concepto" },
    {
      label: "Referencia Numérica",
      value: payment.numericalReference || "—",
    },
    {
      label: "Fecha de Recepción",
      value: formatDate(payment.receivedTimestamp),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg glass-strong rounded-2xl glow-purple fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-bold">Detalle del Pago</h2>
            <p className="text-xs text-muted mt-0.5 font-mono">
              {payment.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-accent/10 text-muted hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount highlight */}
        <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-accent/5 to-accent-blue/5">
          <p className="text-sm text-muted mb-1">Monto recibido</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-accent-light to-accent-blue-light bg-clip-text text-transparent">
            {formatCurrency(payment.amount)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                payment.company === "Gamingo"
                  ? "bg-accent/15 text-accent-light"
                  : "bg-accent-blue/15 text-accent-blue-light"
              }`}
            >
              {payment.company}
            </span>
            <span className="text-xs text-muted">
              {formatDate(payment.receivedTimestamp)}
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
          {fields.map((field) => (
            <div key={field.label} className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted font-medium uppercase tracking-wider">
                  {field.label}
                </p>
                <p className="text-sm mt-0.5 font-mono">{field.value}</p>
              </div>
              {field.copyable && (
                <button
                  onClick={() =>
                    copyToClipboard(field.rawValue || field.value, field.label)
                  }
                  className="p-1.5 rounded-lg hover:bg-accent/10 text-muted hover:text-accent-light transition-all mt-2"
                  title="Copiar"
                >
                  {copied === field.label ? (
                    <Check className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
