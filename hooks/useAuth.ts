"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "@/lib/firebase";
import type { UserDoc } from "@/lib/types";

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
            searchesUsed: 0,
            searchesLimit: 1,
            planExpiresAt: null,
            createdAt: serverTimestamp(),
          };
          await setDoc(ref, newDoc);
          setUserDoc(newDoc as unknown as UserDoc);
        } else {
          setUserDoc(snap.data() as UserDoc);
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
    if (snap.exists()) setUserDoc(snap.data() as UserDoc);
  };

  return { user, userDoc, loading, refreshUserDoc };
}
