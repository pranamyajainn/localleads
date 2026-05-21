import crypto from "crypto";

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_TOKEN;

function hashValue(value: string): string {
  return crypto
    .createHash("sha256")
    .update(value.toLowerCase().trim())
    .digest("hex");
}

interface CAPIEvent {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  userData: {
    email?: string;
    phone?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
  };
  customData?: Record<string, unknown>;
}

export async function sendCAPIEvent(event: CAPIEvent) {
  if (!PIXEL_ID || !ACCESS_TOKEN) return;

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.eventSourceUrl,
        action_source: "website",
        user_data: {
          em: event.userData.email
            ? hashValue(event.userData.email)
            : undefined,
          ph: event.userData.phone
            ? hashValue(event.userData.phone)
            : undefined,
          client_ip_address: event.userData.clientIpAddress,
          client_user_agent: event.userData.clientUserAgent,
        },
        custom_data: event.customData,
      },
    ],
  };

  await fetch(
    `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  ).catch((err) => console.error("CAPI error:", err));
}
