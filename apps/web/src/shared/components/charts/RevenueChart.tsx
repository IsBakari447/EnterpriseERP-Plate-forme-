"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 62000 },
  { month: "Fev", revenue: 74000 },
  { month: "Mar", revenue: 81000 },
  { month: "Avr", revenue: 96000 },
  { month: "Mai", revenue: 112000 },
  { month: "Juin", revenue: 128450 },
];

const moduleData = [
  { module: "CRM", value: 1208 },
  { module: "Ventes", value: 342 },
  { module: "Stock", value: 1842 },
  { module: "Factures", value: 524 },
  { module: "RH", value: 48 },
];

export function RevenueChart() {
  return (
    <div className="h-80 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
      <h2 className="mb-5 text-xl font-bold text-night">Evolution du CA</h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#00C2A9" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ModuleBarChart() {
  return (
    <div className="h-80 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
      <h2 className="mb-5 text-xl font-bold text-night">Activite par module</h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={moduleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="module" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#1E2A38" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
