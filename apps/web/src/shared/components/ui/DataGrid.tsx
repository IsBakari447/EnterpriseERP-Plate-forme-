"use client";

import { useMemo, useState } from "react";
import Badge from "@shared/components/ui/Badge";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";

type Column<T> = {
  key: keyof T;
  label: string;
  badge?: boolean;
};

export default function DataGrid<T extends Record<string, string | number | undefined>>({
  columns,
  data,
  actions,
}: {
  columns: Column<T>[];
  data: T[];
  actions?: (row: T) => React.ReactNode;
}) {
  const { locale } = useI18n();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const tFixed = (value: string) => translateFixedLabel(value, locale);

  const statusColumn = columns.find((column) => String(column.key) === "status");

  const statuses = useMemo(() => {
    if (!statusColumn) return [];
    return ["Tous", ...Array.from(new Set(data.map((row) => String(row[statusColumn.key]))))];
  }, [data, statusColumn]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesSearch = Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "Tous" ||
        !statusColumn ||
        String(row[statusColumn.key]) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter, statusColumn]);

  const badgeColor = (value: string) => {
    if (["Payee", "Valide", "Present", "Disponible", "Livree", "Actif"].includes(value)) return "green";
    if (["En attente", "A declarer", "Conge", "Stock faible", "Prospect"].includes(value)) return "yellow";
    if (["En retard", "Critique"].includes(value)) return "red";
    return "cyan";
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={tFixed("Rechercher...")}
          className="w-full max-w-md rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
        />

        {statusColumn && (
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{tFixed(status)}</option>
            ))}
          </select>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[680px]">
          <thead className="bg-slate-50 text-left text-sm text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="p-4">{column.label}</th>
              ))}
              {actions && <th className="p-4">{tFixed("Actions")}</th>}
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="border-t border-slate-100 hover:bg-slate-50">
                {columns.map((column) => {
                  const value = row[column.key];

                  return (
                    <td key={String(column.key)} className="p-4">
                      {column.badge ? (
                        <Badge color={badgeColor(String(value))}>{tFixed(String(value))}</Badge>
                      ) : (
                        <span className="font-medium text-slate-700">{String(value ?? "")}</span>
                      )}
                    </td>
                  );
                })}

                {actions && <td className="p-4">{actions(row)}</td>}
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="p-8 text-center text-slate-500">
                  {tFixed("Aucun resultat trouve.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
