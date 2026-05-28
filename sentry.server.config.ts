import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://0aafd6c5705339948d7a270035b2e285@o4511415204577280.ingest.us.sentry.io/4511467874091008",
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
