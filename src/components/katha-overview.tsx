'use client';

import { formatCurrency, formatDate } from "@/lib/utils";
import type { Katha, LedgerEntry } from "@/types/katha";

interface KathaOverviewProps {
  kathas: Katha[];
  entries: LedgerEntry[];
  onSelect: (kathaId: string) => void;
  selectedKathaId: string | null;
}

export function KathaOverview({
  kathas,
  entries,
  onSelect,
  selectedKathaId,
}: KathaOverviewProps) {
  if (kathas.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center shadow-sm shadow-black/5 dark:border-white/20 dark:bg-white/[0.02]">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Add your first Katha to start tracking daily contributions, payouts and
          attendance.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {kathas.map((katha) => {
        const kathaEntries = entries.filter((entry) => entry.kathaId === katha.id);
        const deposits = kathaEntries
          .filter((entry) => entry.type === "deposit" || entry.type === "income")
          .reduce((acc, entry) => acc + entry.amount, 0);
        const payouts = kathaEntries
          .filter((entry) => entry.type === "withdrawal" || entry.type === "expense")
          .reduce((acc, entry) => acc + entry.amount, 0);
        const balance = deposits - payouts;
        const progress =
          katha.goalAmount > 0 ? Math.min((balance / katha.goalAmount) * 100, 100) : 0;
        const contributionsThisWeek = kathaEntries
          .filter((entry) => {
            const entryDate = new Date(entry.date);
            const today = new Date();
            const diff =
              (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
            return diff <= 7;
          })
          .reduce((acc, entry) => acc + entry.amount, 0);

        return (
          <article
            key={katha.id}
            className={`flex flex-col gap-4 rounded-2xl border p-5 transition-all hover:-translate-y-[1px] hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/20 ${
              selectedKathaId === katha.id
                ? "border-emerald-500/60 bg-white shadow-md shadow-emerald-500/20 dark:border-emerald-400/50 dark:bg-emerald-500/5"
                : "border-slate-200 bg-white/70 dark:border-white/15 dark:bg-white/[0.04]"
            }`}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(katha.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                onSelect(katha.id);
              }
            }}
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {katha.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  Started {formatDate(katha.startDate)}
                </p>
              </div>
              {katha.members.length > 0 && (
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  {katha.members.length} members
                </span>
              )}
            </header>

            <dl className="grid gap-3 sm:grid-cols-2">
              <Metric label="Current balance" value={formatCurrency(balance)} />
              <Metric
                label="Contributed this week"
                value={formatCurrency(contributionsThisWeek)}
              />
              <Metric
                label="Goal"
                value={
                  katha.goalAmount > 0
                    ? formatCurrency(katha.goalAmount)
                    : "Not set"
                }
              />
              <Metric
                label="Daily target"
                value={
                  katha.dailyContribution > 0
                    ? formatCurrency(katha.dailyContribution)
                    : "Not set"
                }
              />
            </dl>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-300">
                <span>Progress towards goal</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200/80 dark:bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {katha.description && (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {katha.description}
              </p>
            )}
          </article>
        );
      })}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-white/70 p-3 text-sm dark:border-white/10 dark:bg-white/5">
      <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
        {label}
      </dt>
      <dd className="mt-1 font-semibold text-slate-900 dark:text-white">{value}</dd>
    </div>
  );
}
