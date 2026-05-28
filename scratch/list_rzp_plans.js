const Razorpay = require("razorpay");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) {
    console.error(".env.local does not exist");
    return;
  }
  const content = fs.readFileSync(envPath, "utf8");
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const parts = trimmed.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
      process.env[key] = val;
    }
  }
}

async function listPlans() {
  loadEnv();
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  console.log("Using Razorpay Key:", key_id);
  if (!key_id || !key_secret) {
    console.error("Missing Razorpay Key or Secret in env");
    return;
  }

  const razorpay = new Razorpay({
    key_id,
    key_secret,
  });

  try {
    const plans = await razorpay.plans.all();
    console.log("Available Plans on this account:");
    console.log(JSON.stringify(plans, null, 2));
  } catch (err) {
    console.error("Failed to fetch plans:", err);
  }
}

listPlans();
