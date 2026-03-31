"use client";

import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface Filters {
  search: string;
  company: string;
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
}

interface Props {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onApply: () => void;
}

export function PaymentFiltersBar({ filters, onFiltersChange, onApply }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  function updateFilter(key: keyof Filters, value: string) {
    onFiltersChange({ ...filters, [key]: value });
  }

  function clearFilters() {
    onFiltersChange({
      search: "",
      company: "",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
    });
    setTimeout(onApply, 0);
  }

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2 sm:space-y-3">
      {/* Main bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Buscar por nombre, referencia, concepto..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onApply()}
            className="w-full pl-10"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <select
            value={filters.company}
            onChange={(e) => {
              updateFilter("company", e.target.value);
              setTimeout(onApply, 0);
            }}
            className="flex-1 sm:w-40"
          >
            <option value="">Todas</option>
            <option value="Gamingo">Gamingo</option>
            <option value="Oasat">Oasat</option>
          </select>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
              showAdvanced
                ? "bg-accent/10 text-accent-light border border-accent/20"
                : "text-muted-foreground hover:text-foreground glass border border-border"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros</span>
          </button>

          <button
            onClick={onApply}
            className="px-3 sm:px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-accent to-accent-blue hover:from-accent-light hover:to-accent-blue-light transition-all shrink-0"
          >
            Buscar
          </button>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="p-2 rounded-xl text-muted-foreground hover:text-danger hover:bg-danger/5 transition-all shrink-0"
              title="Limpiar filtros"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-border fade-in">
          <div>
            <label className="block text-xs text-muted mb-1">Fecha desde</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter("dateFrom", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Fecha hasta</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter("dateTo", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Monto mínimo</label>
            <input
              type="number"
              placeholder="$0.00"
              value={filters.minAmount}
              onChange={(e) => updateFilter("minAmount", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Monto máximo</label>
            <input
              type="number"
              placeholder="$999,999.99"
              value={filters.maxAmount}
              onChange={(e) => updateFilter("maxAmount", e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
