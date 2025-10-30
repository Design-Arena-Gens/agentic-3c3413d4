import type { Katha, LedgerEntry } from "@/types/katha";
import { toISODate } from "@/lib/utils";

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);

export const seedKathas: Katha[] = [
  {
    id: "katha_community",
    name: "Community Katha",
    goalAmount: 150000,
    dailyContribution: 1500,
    members: ["Sunita", "Rajesh", "Anita", "Prakash"],
    startDate: toISODate(twoDaysAgo),
    description:
      "Daily savings circle for neighbourhood grocery vendors to manage working capital.",
  },
  {
    id: "katha_staff",
    name: "Staff Support Katha",
    goalAmount: 100000,
    dailyContribution: 1200,
    members: ["Arjun", "Mina", "Kiran"],
    startDate: toISODate(yesterday),
    description:
      "Emergency fund created by the staff to cover sudden medical or family expenses.",
  },
];

export const seedEntries: LedgerEntry[] = [
  {
    id: "entry_one",
    kathaId: "katha_community",
    date: toISODate(today),
    amount: 3200,
    type: "deposit",
    category: "Daily savings",
    note: "Collected cash from all members",
  },
  {
    id: "entry_two",
    kathaId: "katha_community",
    date: toISODate(today),
    amount: 1500,
    type: "expense",
    category: "Loan disbursement",
    note: "Advanced to Rekha for raw materials",
  },
  {
    id: "entry_three",
    kathaId: "katha_staff",
    date: toISODate(yesterday),
    amount: 1800,
    type: "deposit",
    category: "Daily savings",
  },
  {
    id: "entry_four",
    kathaId: "katha_staff",
    date: toISODate(twoDaysAgo),
    amount: 2500,
    type: "income",
    category: "Interest income",
  },
  {
    id: "entry_five",
    kathaId: "katha_community",
    date: toISODate(twoDaysAgo),
    amount: 2000,
    type: "withdrawal",
    category: "Emergency fund",
    note: "Paid out to Prakash for medical support",
  },
];
