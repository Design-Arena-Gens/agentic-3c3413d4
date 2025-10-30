'use client';

import { useMemo, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { EntryType, Katha, LedgerEntry } from "@/types/katha";

interface DailyLedgerProps {
  entries: LedgerEntry[];
  kathas: Katha[];
  onDeleteEntry: (entryId: string) => void;
}

const FILTERS: { value: EntryType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "deposit", label: "Deposits" },
  { value: "income", label: "Income" },
  { value: "withdrawal", label: "Withdrawals" },
  { value: "expense", label: "Expenses" },
];

export function DailyLedger({ entries, kathas, onDeleteEntry }: DailyLedgerProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<EntryType | "all">("all");

  const groupedEntries = useMemo(() => {
    const filtered = entries.filter((entry) => {
      if (filter !== "all" && entry.type !== filter) return false;
      if (!query) return true;
      const terms = query.toLowerCase();
      return (
        entry.category.toLowerCase().includes(terms) ||
        (entry.note?.toLowerCase().includes(terms) ?? false)
      );
    });

    const groups = filtered.reduce<Record<string, LedgerEntry[]>>((acc, entry) => {
      if (!acc[entry.date]) acc[entry.date] = [];
      acc[entry.date].push(entry);
      return acc;
    }, {});

    return Object.entries(groups)
      .sort(([dateA], [dateB]) => (dateA > dateB ? -1 : 1))
      .map(([date, items]) => ({
        date,
        items: items.sort((a, b) => (a.id > b.id ? -1 : 1)),
        total: items.reduce((acc, item) => {
          const multiplier =
            item.type === "withdrawal" || item.type === "expense" ? -1 : 1;
          return acc + item.amount * multiplier;
        }, 0),
      }));
  }, [entries, filter, query]);

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm shadow-black/5 backdrop-blur dark:border-white/15 dark:bg-white/[0.04]">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Daily Ledger
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Review all entries grouped by date and filter by type.
          </p>
        </div>
        <input
          type="search"
          placeholder="Search category or note..."
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-white/15 dark:bg-white/10 dark:text-white sm:w-72"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </header>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              filter === value
                ? "border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400 dark:text-emerald-200"
                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 dark:border-white/15 dark:bg-white/5 dark:text-slate-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {groupedEntries.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-600 dark:border-white/20 dark:bg-white/[0.02] dark:text-slate-300">
            No ledger entries yet. Record contributions or expenses to see them here.
          </p>
        )}

        {groupedEntries.map(({ date, items, total }) => (
          <article
            key={date}
            className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/15 dark:bg-white/[0.04]"
          >
            <header className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-white/[0.06]">
              <span className="font-medium text-slate-800 dark:text-white">
                {formatDate(date)}
              </span>
              <span
                className={`font-semibold ${
                  total >= 0 ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {formatCurrency(total)}
              </span>
            </header>
            <ul className="divide-y divide-slate-200/70 dark:divide-white/10">
              {items.map((entry) => {
                const katha = kathas.find((item) => item.id === entry.kathaId);
                const isPositive =
                  entry.type === "deposit" || entry.type === "income";
                return (
                  <li
                    key={entry.id}
                    className="flex flex-col gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-100 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide ${
                            isPositive
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-300"
                          }`}
                        >
                          {entry.type}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {entry.category}
                        </span>
                        {katha && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            · {katha.name}
                          </span>
                        )}
                      </div>
                      {entry.note && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                          {entry.note}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <span
                        className={`font-semibold ${
                          isPositive ? "text-emerald-600" : "text-rose-500"
                        }`}
                      >
                        {isPositive ? "+" : "-"}
                        {formatCurrency(entry.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteEntry(entry.id)}
                        className="rounded-full border border-transparent px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-rose-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:border-rose-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-200"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
