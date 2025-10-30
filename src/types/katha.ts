export type EntryType = "deposit" | "withdrawal" | "expense" | "income";

export interface Katha {
  id: string;
  name: string;
  goalAmount: number;
  dailyContribution: number;
  members: string[];
  startDate: string;
  description?: string;
}

export interface LedgerEntry {
  id: string;
  kathaId: string;
  date: string; // ISO date (yyyy-mm-dd)
  amount: number;
  type: EntryType;
  category: string;
  note?: string;
}
