import type { Timestamp } from "firebase/firestore";

export type Plan = "free" | "starter" | "pro";

export interface UserDoc {
  email: string;
  plan: Plan;
  searchesUsed: number;
  searchesLimit: number;
  planExpiresAt: Timestamp | null;
  createdAt: Timestamp;
  welcomeEmailSent?: boolean;
  upgradeEmailSent?: boolean;
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

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 1,
  starter: 10,
  pro: 50,
};

export const PLAN_PRICES: Record<string, number> = {
  starter: 499,
  pro: 999,
};
