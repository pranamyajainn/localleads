"use client";

import { useState, useRef, useCallback } from "react";
import { firebaseAuth } from "@/lib/firebase";
import type { Lead, RawPlace } from "@/lib/types";

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

function getQueryVariants(bType: string, loc: string, city: string): string[] {
  const bTypeLower = bType.toLowerCase();
  const isTravel =
    bTypeLower.includes("travel") ||
    bTypeLower.includes("tour") ||
    bTypeLower.includes("trip") ||
    bTypeLower.includes("holiday") ||
    bTypeLower.includes("ticket") ||
    bTypeLower.includes("visa");

  const locationStr =
    loc === city ? city : loc && city ? `${loc}, ${city}` : loc || city;

  const variants: string[] = [];

  if (isTravel) {
    variants.push(
      `travel agency ${locationStr}`,
      `tour operator ${locationStr}`,
      `tour and travels ${locationStr}`,
      `holiday planner ${locationStr}`,
      `trip planner ${locationStr}`,
      `ticket booking ${locationStr}`,
      `bus booking ${locationStr}`,
      `visa agent ${locationStr}`,
      `travels ${locationStr}`,
      `travel office ${locationStr}`,
      `travel agent near ${locationStr}`,
      `${locationStr} tours and travels`
    );
  } else {
    variants.push(
      `${bType} ${locationStr}`,
      `${bType} near ${locationStr}`,
      `${locationStr} ${bType}`,
      `${bType} office ${locationStr}`,
      `${bType} agency ${locationStr}`,
      `${bType} services ${locationStr}`,
      `${bType} agent ${locationStr}`
    );
  }

  return [...new Set(variants)];
}

function getGridPoints(center: { lat: number; lng: number }) {
  const { lat, lng } = center;
  const offset = 0.005;
  return [
    center,
    { lat: lat + offset, lng },
    { lat: lat - offset, lng },
    { lat, lng: lng + offset },
    { lat, lng: lng - offset },
  ];
}

export function useLeadSearch() {
  const [status, setStatus] = useState("Ready");
  const [results, setResults] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [phoneCount, setPhoneCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const allRawPlaces = useRef(new Map<string, RawPlace>());
  const allResults = useRef<Lead[]>([]);
  const shouldStop = useRef(false);

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const currentUser = firebaseAuth().currentUser;
    if (!currentUser) throw new Error("Not authenticated");
    const token = await currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  };

  const performTextSearchWithPagination = useCallback(
    async (query: string, headers: Record<string, string>, pagetoken?: string): Promise<void> => {
      if (shouldStop.current) return;

      const params = new URLSearchParams();
      if (!pagetoken) params.set("query", query);
      if (pagetoken) params.set("pagetoken", pagetoken);

      let retries = 3;

      const attempt = async (): Promise<void> => {
        try {
          const res = await fetch(`/api/maps/textsearch?${params}`, { headers });
          if (!res.ok) return;
          const data = await res.json();

          if (data.status === "OVER_QUERY_LIMIT") {
            if (retries > 0) {
              retries--;
              await delay(5000);
              return attempt();
            }
            return;
          }

          for (const p of data.results || []) {
            if (!allRawPlaces.current.has(p.place_id)) {
              allRawPlaces.current.set(p.place_id, { place_id: p.place_id, name: p.name });
            }
          }

          if (data.next_page_token && !shouldStop.current) {
            await delay(2500);
            await performTextSearchWithPagination(query, headers, data.next_page_token);
          }
        } catch {
          // Skip on network error
        }
      };

      await attempt();
    },
    []
  );

  const performNearbySearchWithPagination = useCallback(
    async (
      location: { lat: number; lng: number },
      keyword: string,
      headers: Record<string, string>,
      pagetoken?: string
    ): Promise<void> => {
      if (shouldStop.current) return;

      const params = new URLSearchParams();
      if (!pagetoken) {
        params.set("lat", String(location.lat));
        params.set("lng", String(location.lng));
        params.set("keyword", keyword);
      } else {
        params.set("pagetoken", pagetoken);
      }

      let retries = 3;

      const attempt = async (): Promise<void> => {
        try {
          const res = await fetch(`/api/maps/nearbysearch?${params}`, { headers });
          if (!res.ok) return;
          const data = await res.json();

          if (data.status === "OVER_QUERY_LIMIT") {
            if (retries > 0) {
              retries--;
              await delay(5000);
              return attempt();
            }
            return;
          }

          for (const p of data.results || []) {
            if (!allRawPlaces.current.has(p.place_id)) {
              allRawPlaces.current.set(p.place_id, { place_id: p.place_id, name: p.name });
            }
          }

          if (data.next_page_token && !shouldStop.current) {
            await delay(2500);
            await performNearbySearchWithPagination(location, keyword, headers, data.next_page_token);
          }
        } catch {
          // Skip on network error
        }
      };

      await attempt();
    },
    []
  );

  const geocodeLocality = useCallback(
    async (
      loc: string,
      city: string,
      headers: Record<string, string>
    ): Promise<{ lat: number; lng: number } | null> => {
      const addressStr = loc && loc !== city ? `${loc}, ${city}` : city;
      try {
        const res = await fetch(
          `/api/maps/geocode?query=${encodeURIComponent(addressStr)}`,
          { headers }
        );
        if (!res.ok) return null;
        const data = await res.json();
        return data.location || null;
      } catch {
        return null;
      }
    },
    []
  );

  const fetchPlaceDetails = useCallback(
    async (
      placeId: string,
      fallbackName: string,
      headers: Record<string, string>,
      retries = 5
    ): Promise<{
      name: string;
      phone: string | null;
      website: string | null;
      mapsUrl: string;
    } | null> => {
      try {
        const res = await fetch(
          `/api/maps/details?placeId=${encodeURIComponent(placeId)}`,
          { headers }
        );
        if (!res.ok) return null;
        const data = await res.json();

        if (data.status === "OVER_QUERY_LIMIT" && retries > 0) {
          const waitMs = (6 - retries) * 1500;
          await delay(waitMs);
          return fetchPlaceDetails(placeId, fallbackName, headers, retries - 1);
        }

        return data.result
          ? { ...data.result, name: data.result.name || fallbackName }
          : null;
      } catch {
        return null;
      }
    },
    []
  );

  const processLocality = useCallback(
    async (
      bType: string,
      loc: string,
      city: string,
      idx: number,
      total: number,
      headers: Record<string, string>
    ) => {
      if (shouldStop.current) return;
      setStatus(`Processing locality [${idx}/${total}]: ${loc}...`);

      const variants = getQueryVariants(bType, loc, city);
      for (let i = 0; i < variants.length; i++) {
        if (shouldStop.current) return;
        setStatus(`[${loc}] Query ${i + 1}/${variants.length}: "${variants[i]}"...`);
        await performTextSearchWithPagination(variants[i], headers);
        await delay(800);
      }

      setStatus(`[${loc}] Resolving coordinates for grid search...`);
      const center = await geocodeLocality(loc, city, headers);

      if (center && !shouldStop.current) {
        const gridPoints = getGridPoints(center);
        for (let i = 0; i < gridPoints.length; i++) {
          if (shouldStop.current) return;
          setStatus(`[${loc}] Grid node ${i + 1}/${gridPoints.length}...`);
          await performNearbySearchWithPagination(gridPoints[i], bType, headers);
          await delay(800);
        }
      }
    },
    [performTextSearchWithPagination, geocodeLocality, performNearbySearchWithPagination]
  );

  const enrichAndFilterResults = useCallback(
    async (headers: Record<string, string>, maxLeads: number) => {
      const places = Array.from(allRawPlaces.current.values());
      let processed = 0;
      let found = 0;

      for (const place of places) {
        if (shouldStop.current) break;
        if (found >= maxLeads) break;
        processed++;
        setStatus(
          `Qualifying place [${processed}/${places.length}]... (Found: ${found} contacts)`
        );

        const details = await fetchPlaceDetails(place.place_id, place.name, headers);

        if (details && details.phone && !details.website) {
          const lead: Lead = {
            name: details.name,
            phone: details.phone,
            mapsUrl: details.mapsUrl,
          };
          allResults.current.push(lead);
          found++;
          setPhoneCount(found);
          setResults((prev) => [...prev, lead]);
        }

        await delay(600);
      }
    },
    [fetchPlaceDetails]
  );

  const performSearch = useCallback(
    async (bType: string, city: string, localitiesInput: string, maxLeads = Infinity) => {
      if (!bType || !city || isSearching) return;

      // Reset state
      allRawPlaces.current.clear();
      allResults.current = [];
      shouldStop.current = false;
      setResults([]);
      setPhoneCount(0);
      setError(null);
      setIsSearching(true);

      try {
        const headers = await getAuthHeaders();

        // Deduct credit before starting
        const creditRes = await fetch("/api/credits/deduct", {
          method: "POST",
          headers,
        });

        if (creditRes.status === 403) {
          const data = await creditRes.json();
          fetch("/api/email/upgrade-nudge", { method: "POST", headers }).catch(() => {});
          setError(data.message || "Search limit reached. Upgrade to continue.");
          setIsSearching(false);
          setStatus("Limit reached");
          return;
        }

        if (!creditRes.ok) {
          throw new Error("Failed to start search");
        }

        const localities = localitiesInput
          ? localitiesInput.split(",").map((s) => s.trim()).filter(Boolean)
          : [city];

        setStatus("Starting expanded search sequence...");

        for (let i = 0; i < localities.length; i++) {
          if (shouldStop.current) break;
          await processLocality(bType, localities[i], city, i + 1, localities.length, headers);
        }

        if (!shouldStop.current) {
          setStatus(`Qualifying ${allRawPlaces.current.size} unique businesses...`);
          await enrichAndFilterResults(headers, maxLeads);
        }

        if (!shouldStop.current) {
          setStatus(
            `Complete. Found ${allResults.current.length} contacts from ${allRawPlaces.current.size} unique businesses.`
          );
        } else {
          setStatus("Search stopped.");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Search failed";
        setError(msg);
        setStatus("Error");
      } finally {
        setIsSearching(false);
      }
    },
    [isSearching, processLocality, enrichAndFilterResults]
  );

  const stopSearch = useCallback(() => {
    shouldStop.current = true;
  }, []);

  const clearResults = useCallback(() => {
    shouldStop.current = true;
    allRawPlaces.current.clear();
    allResults.current = [];
    setResults([]);
    setPhoneCount(0);
    setError(null);
    setStatus("Results cleared.");
    setIsSearching(false);
  }, []);

  const exportCSV = useCallback(() => {
    if (allResults.current.length === 0) return;

    let csv = "Company Name,Phone Number,Google Maps Link\n";
    allResults.current.forEach((row) => {
      csv += `"${row.name.replace(/"/g, '""')}","${row.phone}","${row.mapsUrl}"\n`;
    });

    const bom = "﻿";
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "extracted_leads.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  return {
    status,
    results,
    isSearching,
    phoneCount,
    error,
    performSearch,
    stopSearch,
    clearResults,
    exportCSV,
  };
}
