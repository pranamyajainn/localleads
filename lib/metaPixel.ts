declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

export function firePixelEvent(
  eventName: string,
  eventId: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params || {}, { eventID: eventId });
  }
}

export async function fireEvent(
  eventName: string,
  params?: Record<string, unknown>,
  userData?: { email?: string; phone?: string }
) {
  const eventId = `${eventName}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const eventSourceUrl = typeof window !== "undefined" ? window.location.href : "";

  // Client-side pixel
  firePixelEvent(eventName, eventId, params);

  // Attempt to get Firebase auth token for server-side dedup
  let authHeader: Record<string, string> = {};
  try {
    if (typeof window !== "undefined") {
      const { firebaseAuth } = await import("@/lib/firebase");
      const currentUser = firebaseAuth().currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        authHeader = { Authorization: `Bearer ${token}` };
      }
    }
  } catch {
    // proceed without auth
  }

  // Server-side CAPI (fire-and-forget)
  await fetch("/api/meta/event", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader },
    body: JSON.stringify({
      eventName,
      eventId,
      eventSourceUrl,
      email: userData?.email,
      phone: userData?.phone,
    }),
  }).catch(() => {});
}
