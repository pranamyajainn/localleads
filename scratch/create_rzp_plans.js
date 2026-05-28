const Razorpay = require("razorpay");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) {
    console.error(".env.local does not exist");
    return {};
  }
  const content = fs.readFileSync(envPath, "utf8");
  const env = {};
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const parts = trimmed.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
      env[key] = val;
      process.env[key] = val;
    }
  }
  return env;
}

function updateEnvFile(newPlans) {
  const envPath = path.join(__dirname, "../.env.local");
  let content = fs.readFileSync(envPath, "utf8");

  for (const [key, val] of Object.entries(newPlans)) {
    const regex = new RegExp(`^${key}=.*$`, "m");
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${val}`);
    } else {
      content += `\n${key}=${val}`;
    }
  }

  fs.writeFileSync(envPath, content, "utf8");
  console.log(".env.local updated with new plan IDs!");
}

async function run() {
  loadEnv();
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    console.error("Missing Razorpay Key or Secret in .env.local");
    return;
  }

  const razorpay = new Razorpay({
    key_id,
    key_secret,
  });

  const planTemplates = [
    { key: "RAZORPAY_PLAN_STARTER", name: "Starter Plan", amount: 49900 },
    { key: "RAZORPAY_PLAN_GROWTH", name: "Growth Plan", amount: 99900 },
    { key: "RAZORPAY_PLAN_PRO", name: "Pro Plan", amount: 249900 },
    { key: "RAZORPAY_PLAN_AGENCY", name: "Agency Plan", amount: 499900 },
  ];

  const createdPlans = {};

  for (const template of planTemplates) {
    try {
      console.log(`Creating plan: ${template.name}...`);
      const plan = await razorpay.plans.create({
        period: "daily", // Using daily/weekly/monthly. Let's use monthly since description says monthly.
        // Wait, for local testing, if it's test mode, monthly is fine.
        period: "monthly",
        interval: 1,
        item: {
          name: template.name,
          amount: template.amount,
          currency: "INR",
          description: `${template.name} - Subscription for LocalLeads`,
        },
      });
      console.log(`Successfully created: ${template.name} with ID: ${plan.id}`);
      createdPlans[template.key] = plan.id;
    } catch (err) {
      console.error(`Failed to create plan ${template.name}:`, err);
    }
  }

  if (Object.keys(createdPlans).length > 0) {
    updateEnvFile(createdPlans);
  } else {
    console.log("No plans were created.");
  }
}

run();
