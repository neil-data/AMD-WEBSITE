// One-shot script to deploy firestore.rules to Firebase via REST API.
// Uses the service account from .env.local — no firebase-tools login needed.
import { readFileSync } from "fs";
import { GoogleAuth } from "google-auth-library";

const project = "amda-cf25f";

// Parse service account JSON from .env.local
const envRaw = readFileSync(".env.local", "utf8");
const saLine = envRaw.split("\n").find(l => l.startsWith("FIREBASE_SERVICE_ACCOUNT_KEY="));
const saJson = JSON.parse(saLine.replace("FIREBASE_SERVICE_ACCOUNT_KEY=", "").trim());

// Get an access token from the service account
const auth = new GoogleAuth({
  credentials: saJson,
  scopes: ["https://www.googleapis.com/auth/cloud-platform", "https://www.googleapis.com/auth/firebase"]
});
const client = await auth.getClient();
const tokenRes = await client.getAccessToken();
const token = tokenRes.token;

const rulesSource = readFileSync("firestore.rules", "utf8");

const base = `https://firebaserules.googleapis.com/v1/projects/${project}`;
const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

// Step 1: create a new ruleset
const rulesetRes = await fetch(`${base}/rulesets`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    source: {
      files: [{ name: "firestore.rules", content: rulesSource }]
    }
  })
});
const ruleset = await rulesetRes.json();
if (!rulesetRes.ok) {
  console.error("Failed to create ruleset:", JSON.stringify(ruleset, null, 2));
  process.exit(1);
}
const rulesetName = ruleset.name;
console.log("Created ruleset:", rulesetName);

// Step 2: point the cloud.firestore release to the new ruleset
const releaseRes = await fetch(`${base}/releases/cloud.firestore`, {
  method: "PATCH",
  headers,
  body: JSON.stringify({ release: { name: `${base}/releases/cloud.firestore`, rulesetName } })
});
const release = await releaseRes.json();
if (!releaseRes.ok) {
  // Release may not exist yet — try creating it
  if (releaseRes.status === 404 || releaseRes.status === 409) {
    const createRes = await fetch(`${base}/releases`, {
      method: "POST",
      headers,
      body: JSON.stringify({ release: { name: `projects/${project}/releases/cloud.firestore`, rulesetName } })
    });
    const created = await createRes.json();
    if (!createRes.ok) {
      console.error("Failed to create release:", JSON.stringify(created, null, 2));
      process.exit(1);
    }
    console.log("Created release:", created.name);
  } else {
    console.error("Failed to update release:", JSON.stringify(release, null, 2));
    process.exit(1);
  }
} else {
  console.log("Updated release:", release.name ?? "ok");
}

console.log("\n✅  Firestore rules deployed to", project);
