"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "@/lib/firebase";
import type { UserDoc } from "@/lib/types";

// Handles both pre-migration (searchesUsed/searchesLimit) and new (leadsUsed/leadsLimit) documents
function normalizeUserDoc(data: Record<string, unknown>): UserDoc {
  return {
    ...data,
    leadsUsed: (data.leadsUsed ?? data.searchesUsed ?? 0) as number,
    leadsLimit: (data.leadsLimit ?? data.searchesLimit ?? 20) as number,
  } as UserDoc;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth(), async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const db = firebaseDb();
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          const newDoc = {
            email: firebaseUser.email!,
            plan: "free",
            leadsUsed: 0,
            leadsLimit: 20,
            planExpiresAt: null,
            createdAt: serverTimestamp(),
          };
          await setDoc(ref, newDoc);
          setUserDoc(newDoc as unknown as UserDoc);
          firebaseUser.getIdToken().then((token) => {
            fetch("/api/email/welcome", { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
          }).catch(() => {});
        } else {
          setUserDoc(normalizeUserDoc(snap.data() as Record<string, unknown>));
        }
      } else {
        setUserDoc(null);
      }

      setLoading(false);
    });

    return unsub;
  }, []);

  const refreshUserDoc = async () => {
    const currentUser = firebaseAuth().currentUser;
    if (!currentUser) return;
    const ref = doc(firebaseDb(), "users", currentUser.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) setUserDoc(normalizeUserDoc(snap.data() as Record<string, unknown>));
  };

  return { user, userDoc, loading, refreshUserDoc };
}
