'use client';

import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  totalBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  todayTotal: number;
}

const summaryConfig = [
  {
    key: "totalBalance" as const,
    label: "Net Balance",
    accent: "from-emerald-500/80 via-emerald-500 to-emerald-600",
  },
  {
    key: "totalDeposits" as const,
    label: "Total Contributions",
    accent: "from-blue-500/80 via-blue-500 to-blue-600",
  },
  {
    key: "totalWithdrawals" as const,
    label: "Total Payouts",
    accent: "from-rose-500/80 via-rose-500 to-rose-600",
  },
  {
    key: "todayTotal" as const,
    label: "Today's Net",
    accent: "from-amber-500/80 via-amber-500 to-amber-600",
  },
];

export function SummaryCards(props: SummaryCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {summaryConfig.map(({ key, label, accent }) => (
        <article
          key={key}
          className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/70 p-5 shadow-sm shadow-black/5 backdrop-blur dark:border-white/5 dark:bg-white/5`}
        >
          <div
            className={`absolute inset-0 -z-10 bg-gradient-to-br ${accent} opacity-20`}
            aria-hidden
          />
          <h2 className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {label}
          </h2>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            {formatCurrency(props[key])}
          </p>
        </article>
      ))}
    </section>
  );
}
