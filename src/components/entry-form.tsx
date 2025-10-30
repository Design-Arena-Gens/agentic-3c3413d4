'use client';

import { useMemo, useState } from "react";
import { createId, toISODate } from "@/lib/utils";
import type { Katha, LedgerEntry } from "@/types/katha";

interface EntryFormProps {
  kathas: Katha[];
  onCreateEntry: (entry: LedgerEntry) => void;
  activeKathaId: string | null;
}

const entryTypes = [
  { value: "deposit", label: "Deposit", accent: "bg-emerald-500/10" },
  { value: "income", label: "Income", accent: "bg-blue-500/10" },
  { value: "withdrawal", label: "Withdrawal", accent: "bg-rose-500/10" },
  { value: "expense", label: "Expense", accent: "bg-amber-500/10" },
] as const;

export function EntryForm({
  kathas,
  onCreateEntry,
  activeKathaId,
}: EntryFormProps) {
  const [selectedKathaId, setSelectedKathaId] = useState<string | null>(null);
  const todayISO = useMemo(() => toISODate(new Date()), []);
  const [formState, setFormState] = useState({
    date: todayISO,
    amount: "",
    category: "",
    type: "deposit" as LedgerEntry["type"],
    note: "",
  });

  const resolvedKathaId = useMemo(() => {
    if (
      selectedKathaId &&
      kathas.some((katha) => katha.id === selectedKathaId)
    ) {
      return selectedKathaId;
    }
    if (activeKathaId && kathas.some((katha) => katha.id === activeKathaId)) {
      return activeKathaId;
    }
    return kathas[0]?.id ?? "";
  }, [activeKathaId, kathas, selectedKathaId]);

  const disabled = kathas.length === 0 || !resolvedKathaId;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resolvedKathaId) return;
    const amountValue = Number.parseFloat(formState.amount);
    if (Number.isNaN(amountValue) || amountValue <= 0) return;

    const payload: LedgerEntry = {
      id: createId("entry"),
      kathaId: resolvedKathaId,
      date: formState.date,
      type: formState.type,
      amount: Math.round(amountValue * 100) / 100,
      category: formState.category || "General",
      note: formState.note.trim() || undefined,
    };

    onCreateEntry(payload);
    setFormState({
      date: todayISO,
      amount: "",
      category: "",
      type: payload.type,
      note: "",
    });
  };

  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm shadow-black/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          New Ledger Entry
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Track daily deposits, withdrawals and other cash flow activities.
        </p>
      </header>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Katha
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-white/15 dark:bg-white/10 dark:text-white"
              value={resolvedKathaId}
              disabled={disabled}
              onChange={(event) => setSelectedKathaId(event.target.value)}
            >
              {kathas.map((katha) => (
                <option key={katha.id} value={katha.id}>
                  {katha.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Date
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-white/15 dark:bg-white/10 dark:text-white"
              type="date"
              value={formState.date}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, date: event.target.value }))
              }
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Amount
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-white/15 dark:bg-white/10 dark:text-white"
              type="number"
              min="0"
              step="0.01"
              required
              value={formState.amount}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, amount: event.target.value }))
              }
            />
          </label>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Category
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-white/15 dark:bg-white/10 dark:text-white"
              type="text"
              placeholder="Daily saving, rent, utilities..."
              value={formState.category}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  category: event.target.value,
                }))
              }
            />
          </label>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Entry Type
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {entryTypes.map((entry) => (
              <label
                key={entry.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition hover:border-slate-400 dark:border-white/10 dark:hover:border-white/40 ${
                  formState.type === entry.value
                    ? "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/10"
                    : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <input
                  type="radio"
                  name="entryType"
                  value={entry.value}
                  checked={formState.type === entry.value}
                  onChange={() =>
                    setFormState((prev) => ({ ...prev, type: entry.value }))
                  }
                  className="h-4 w-4 accent-emerald-600"
                />
                <span className={`rounded-full px-2 py-1 text-xs ${entry.accent}`}>
                  {entry.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Notes
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-white/15 dark:bg-white/10 dark:text-white"
            rows={3}
            placeholder="Add context for this entry..."
            value={formState.note}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, note: event.target.value }))
            }
          />
        </label>

        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-300/30 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          {disabled ? "Create a Katha to get started" : "Add Ledger Entry"}
        </button>
      </form>
    </section>
  );
}
