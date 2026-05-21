import type { Timestamp } from "firebase/firestore";

export type Plan = "free" | "starter" | "growth" | "pro" | "agency";

export interface UserDoc {
  email: string;
  plan: Plan;
  leadsUsed: number;
  leadsLimit: number;
  // Legacy fields — present on pre-migration users, read via normalizeUserDoc in useAuth
  searchesUsed?: number;
  searchesLimit?: number;
  planExpiresAt: Timestamp | null;
  createdAt: Timestamp;
  welcomeEmailSent?: boolean;
  upgradeEmailSent?: boolean;
  subscriptionId?: string;
  subscriptionStatus?: "active" | "cancelling" | "halted" | null;
}

export interface Lead {
  name: string;
  phone: string;
  mapsUrl: string;
}

export interface RawPlace {
  place_id: string;
  name: string;
}

export interface PlaceDetailsResult {
  name: string;
  phone: string | null;
  website: string | null;
  mapsUrl: string;
}

export interface SearchState {
  status: string;
  results: Lead[];
  isSearching: boolean;
  phoneCount: number;
  error: string | null;
}

export interface SearchHistoryEntry {
  searchId: string;
  businessType: string;
  city: string;
  localities: string;
  leadsFound: number;
  leads: Lead[];
  createdAt: Timestamp;
}

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 20,
  starter: 500,
  growth: 2000,
  pro: 10000,
  agency: 50000,
};

// Amounts in paise (₹ × 100) — used directly with Razorpay, do NOT multiply by 100
export const PLAN_PRICES: Record<string, number> = {
  starter: 49900,
  growth: 99900,
  pro: 249900,
  agency: 499900,
};
