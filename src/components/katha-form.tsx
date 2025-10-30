'use client';

import { useState } from "react";
import { createId, toISODate } from "@/lib/utils";
import type { Katha } from "@/types/katha";

interface KathaFormProps {
  onCreateKatha: (katha: Katha) => void;
}

export function KathaForm({ onCreateKatha }: KathaFormProps) {
  const [formState, setFormState] = useState({
    name: "",
    goalAmount: "",
    dailyContribution: "",
    members: "",
    startDate: toISODate(new Date()),
    description: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name.trim()) return;

    const kathaPayload: Katha = {
      id: createId("katha"),
      name: formState.name.trim(),
      goalAmount: Number.parseFloat(formState.goalAmount) || 0,
      dailyContribution: Number.parseFloat(formState.dailyContribution) || 0,
      description: formState.description.trim() || undefined,
      startDate: formState.startDate,
      members: formState.members
        .split(",")
        .map((member) => member.trim())
        .filter(Boolean),
    };

    onCreateKatha(kathaPayload);
    setFormState((prev) => ({
      ...prev,
      name: "",
      goalAmount: "",
      dailyContribution: "",
      members: "",
      description: "",
    }));
  };

  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm shadow-black/5 backdrop-blur dark:border-white/10 dark:bg-white/5">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Create New Katha
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Manage daily saving circles, members and contribution targets.
        </p>
      </header>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Katha name
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-white/15 dark:bg-white/10 dark:text-white"
            type="text"
            required
            value={formState.name}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, name: event.target.value }))
            }
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Target corpus
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-white/15 dark:bg-white/10 dark:text-white"
              type="number"
              min="0"
              step="0.01"
              value={formState.goalAmount}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  goalAmount: event.target.value,
                }))
              }
            />
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Daily contribution target
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-white/15 dark:bg-white/10 dark:text-white"
              type="number"
              min="0"
              step="0.01"
              value={formState.dailyContribution}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  dailyContribution: event.target.value,
                }))
              }
            />
          </label>
        </div>

        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Start date
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-white/15 dark:bg-white/10 dark:text-white"
            type="date"
            value={formState.startDate}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                startDate: event.target.value,
              }))
            }
          />
        </label>

        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Members (comma separated)
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-white/15 dark:bg-white/10 dark:text-white"
            type="text"
            placeholder="Sunita, Rajesh, Anita"
            value={formState.members}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                members: event.target.value,
              }))
            }
          />
        </label>

        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Notes
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-white/15 dark:bg-white/10 dark:text-white"
            placeholder="Add context about the saving circle..."
            value={formState.description}
            rows={3}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/30 transition active:scale-[0.99]"
        >
          Save Katha
        </button>
      </form>
    </section>
  );
}
