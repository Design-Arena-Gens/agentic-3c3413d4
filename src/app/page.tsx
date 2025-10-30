"use client";

import { useMemo, useState } from "react";
import { DailyLedger } from "@/components/daily-ledger";
import { EntryForm } from "@/components/entry-form";
import { InsightsPanel } from "@/components/insights-panel";
import { KathaForm } from "@/components/katha-form";
import { KathaOverview } from "@/components/katha-overview";
import { SummaryCards } from "@/components/summary-cards";
import { usePersistentState } from "@/hooks/usePersistentState";
import { seedEntries, seedKathas } from "@/data/seed";
import { formatCurrency, toISODate } from "@/lib/utils";
import type { Katha, LedgerEntry } from "@/types/katha";

export default function Home() {
  const [kathas, setKathas, kathasHydrated] = usePersistentState<Katha[]>(
    "katha-manager:kathas",
    seedKathas
  );
  const [entries, setEntries, entriesHydrated] = usePersistentState<LedgerEntry[]>(
    "katha-manager:entries",
    seedEntries
  );
  const hydrated = kathasHydrated && entriesHydrated;

  const [selectedKathaId, setSelectedKathaId] = useState<string | null>(null);

  const activeKathaId = useMemo(() => {
    if (selectedKathaId && kathas.some((katha) => katha.id === selectedKathaId)) {
      return selectedKathaId;
    }
    return kathas[0]?.id ?? null;
  }, [kathas, selectedKathaId]);

  const filteredEntries = useMemo(() => {
    if (!activeKathaId) return entries;
    return entries.filter((entry) => entry.kathaId === activeKathaId);
  }, [activeKathaId, entries]);

  const metrics = useMemo(() => {
    const deposits = entries
      .filter((entry) => entry.type === "deposit" || entry.type === "income")
      .reduce((acc, entry) => acc + entry.amount, 0);
    const withdrawals = entries
      .filter((entry) => entry.type === "withdrawal" || entry.type === "expense")
      .reduce((acc, entry) => acc + entry.amount, 0);
    const balance = deposits - withdrawals;
    const today = toISODate(new Date());
    const todayNet = entries
      .filter((entry) => entry.date === today)
      .reduce((acc, entry) => {
        const multiplier =
          entry.type === "withdrawal" || entry.type === "expense" ? -1 : 1;
        return acc + entry.amount * multiplier;
      }, 0);

    return {
      totalBalance: balance,
      totalDeposits: deposits,
      totalWithdrawals: withdrawals,
      todayTotal: todayNet,
    };
  }, [entries]);

  const handleCreateKatha = (katha: Katha) => {
    setKathas((previous) => [katha, ...previous]);
    setSelectedKathaId(katha.id);
  };

  const handleCreateEntry = (entry: LedgerEntry) => {
    setEntries((previous) => [entry, ...previous]);
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries((previous) => previous.filter((entry) => entry.id !== entryId));
  };

  if (!hydrated) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-blue-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950">
        <div className="animate-pulse rounded-2xl bg-white/70 px-8 py-12 text-center shadow-xl shadow-emerald-500/20 backdrop-blur dark:bg-white/10">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
            Loading Katha Manager
          </p>
          <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
            Preparing your daily finance workspace...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-900 transition dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.12),_transparent_55%)]" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-white to-blue-500/10 p-8 shadow-lg shadow-emerald-500/10 backdrop-blur dark:from-emerald-500/10 dark:via-white/[0.04] dark:to-blue-500/10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Daily financial clarity
            </span>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Katha Management Workspace
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-200">
              Stay on top of your community savings circles. Capture daily contributions,
              manage payouts and surface insights that keep every katha transparent and on
              track.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
            <span>
              Total Kathas: <strong className="font-semibold">{kathas.length}</strong>
            </span>
            <span>
              Tracked Entries: <strong className="font-semibold">{entries.length}</strong>
            </span>
            <span>
              Net Balance: <strong className="font-semibold">{formatCurrency(metrics.totalBalance)}</strong>
            </span>
          </div>
        </header>

        <SummaryCards {...metrics} />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <EntryForm
            kathas={kathas}
            onCreateEntry={handleCreateEntry}
            activeKathaId={activeKathaId}
          />
          <KathaForm onCreateKatha={handleCreateKatha} />
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <DailyLedger
            entries={filteredEntries}
            kathas={kathas}
            onDeleteEntry={handleDeleteEntry}
          />
          <InsightsPanel entries={filteredEntries} kathas={kathas} />
        </section>

        <section className="grid gap-6 pb-12">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Katha Snapshots
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Review balances, progress and member participation across all saving
                circles.
              </p>
            </div>
            {activeKathaId && (
              <div className="rounded-full border border-emerald-400/50 bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-200">
                Focused on:{" "}
                <span className="font-semibold">
                  {kathas.find((katha) => katha.id === activeKathaId)?.name}
                </span>
              </div>
            )}
          </div>
          <KathaOverview
            kathas={kathas}
            entries={entries}
            onSelect={setSelectedKathaId}
            selectedKathaId={activeKathaId}
          />
        </section>
      </div>
    </main>
  );
}
