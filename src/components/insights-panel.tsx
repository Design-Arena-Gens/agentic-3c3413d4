'use client';

import { useMemo } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Katha, LedgerEntry } from "@/types/katha";

interface InsightsPanelProps {
  entries: LedgerEntry[];
  kathas: Katha[];
}

export function InsightsPanel({ entries, kathas }: InsightsPanelProps) {
  const insights = useMemo(() => {
    if (entries.length === 0) return null;

    const sortedDeposits = [...entries]
      .filter((entry) => entry.type === "deposit" || entry.type === "income")
      .sort((a, b) => b.amount - a.amount);
    const sortedExpenses = [...entries]
      .filter((entry) => entry.type === "withdrawal" || entry.type === "expense")
      .sort((a, b) => b.amount - a.amount);

    const totalsByDate = entries.reduce<Record<string, number>>((acc, entry) => {
      const multiplier =
        entry.type === "withdrawal" || entry.type === "expense" ? -1 : 1;
      acc[entry.date] = (acc[entry.date] ?? 0) + multiplier * entry.amount;
      return acc;
    }, {});

    const busiestDate = Object.entries(totalsByDate).sort(
      (a, b) => Math.abs(b[1]) - Math.abs(a[1])
    )[0];

    const balanceByKatha = kathas.map((katha) => {
      const relevant = entries.filter((entry) => entry.kathaId === katha.id);
      const deposits = relevant
        .filter((entry) => entry.type === "deposit" || entry.type === "income")
        .reduce((acc, entry) => acc + entry.amount, 0);
      const payouts = relevant
        .filter((entry) => entry.type === "withdrawal" || entry.type === "expense")
        .reduce((acc, entry) => acc + entry.amount, 0);
      return {
        katha,
        balance: deposits - payouts,
      };
    });

    const healthiest = balanceByKatha
      .filter((record) => record.balance > 0)
      .sort((a, b) => b.balance - a.balance)[0];

    const biggestCashflowCategory = entries
      .reduce<Record<string, number>>((acc, entry) => {
        const multiplier =
          entry.type === "withdrawal" || entry.type === "expense" ? -1 : 1;
        acc[entry.category] = (acc[entry.category] ?? 0) + multiplier * entry.amount;
        return acc;
      }, {});

    const standoutCategory = Object.entries(biggestCashflowCategory).sort(
      (a, b) => Math.abs(b[1]) - Math.abs(a[1])
    )[0];

    return {
      topDeposit: sortedDeposits[0],
      topExpense: sortedExpenses[0],
      busiestDate,
      healthiest,
      standoutCategory,
    };
  }, [entries, kathas]);

  if (!insights) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-sm text-slate-600 shadow-sm shadow-black/5 dark:border-white/15 dark:bg-white/[0.03] dark:text-slate-300">
        Insights will appear once you begin logging entries.
      </section>
    );
  }

  const { topDeposit, topExpense, healthiest, busiestDate, standoutCategory } =
    insights;

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-blue-500/5 via-white to-emerald-500/5 p-6 shadow-sm shadow-emerald-500/10 dark:border-white/15 dark:from-blue-500/10 dark:via-white/[0.04] dark:to-emerald-500/10">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Smart Insights
      </h2>
      <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-200">
        {topDeposit && (
          <InsightItem
            title="Largest contribution"
            detail={`${formatCurrency(topDeposit.amount)} on ${formatDate(
              topDeposit.date
            )}`}
            caption={getKathaName(kathas, topDeposit?.kathaId)}
          />
        )}
        {topExpense && (
          <InsightItem
            title="Largest payout"
            detail={`${formatCurrency(topExpense.amount)} for ${topExpense.category}`}
            caption={formatDate(topExpense.date)}
          />
        )}
        {busiestDate && (
          <InsightItem
            title="Busiest cashflow day"
            detail={formatDate(busiestDate[0])}
            caption={`Net impact: ${formatCurrency(busiestDate[1])}`}
          />
        )}
        {standoutCategory && (
          <InsightItem
            title="Standout category"
            detail={standoutCategory[0]}
            caption={`Net cashflow: ${formatCurrency(standoutCategory[1])}`}
          />
        )}
        {healthiest && (
          <InsightItem
            title="Healthiest katha balance"
            detail={healthiest.katha.name}
            caption={`Net balance: ${formatCurrency(healthiest.balance)}`}
          />
        )}
      </ul>
    </section>
  );
}

function InsightItem({
  title,
  detail,
  caption,
}: {
  title: string;
  detail: string;
  caption?: string;
}) {
  return (
    <li className="rounded-xl border border-white/50 bg-white/70 px-4 py-3 shadow-sm shadow-black/5 dark:border-white/10 dark:bg-white/[0.06]">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
        {title}
      </p>
      <p className="text-base font-medium text-slate-900 dark:text-white">{detail}</p>
      {caption && (
        <p className="text-xs text-slate-500 dark:text-slate-300">{caption}</p>
      )}
    </li>
  );
}

function getKathaName(kathas: Katha[], id?: string) {
  if (!id) return undefined;
  return kathas.find((item) => item.id === id)?.name;
}
