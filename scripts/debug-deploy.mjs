import { readFileSync } from "fs";
import { GoogleAuth } from "google-auth-library";

const project = "amda-cf25f";

const envRaw = readFileSync(".env.local", "utf8");
const saLine = envRaw.split("\n").find(l => l.startsWith("FIREBASE_SERVICE_ACCOUNT_KEY="));
const saJson = JSON.parse(saLine.replace("FIREBASE_SERVICE_ACCOUNT_KEY=", "").trim());
console.log("SA project_id:", saJson.project_id, "| email:", saJson.client_email);

const auth = new GoogleAuth({
  credentials: saJson,
  scopes: ["https://www.googleapis.com/auth/cloud-platform", "https://www.googleapis.com/auth/firebase"]
});
const client = await auth.getClient();
const tokenRes = await client.getAccessToken();
const token = tokenRes.token;
console.log("Token obtained:", token ? token.substring(0, 20) + "..." : "NULL");

// Try the simplest possible ruleset first
const simpleRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`;

const body = JSON.stringify({
  source: { files: [{ name: "firestore.rules", content: simpleRules }] }
});
console.log("Body length:", body.length);

const res = await fetch(`https://firebaserules.googleapis.com/v1/projects/${project}/rulesets`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body
});
const json = await res.json();
console.log("Status:", res.status);
console.log("Response:", JSON.stringify(json, null, 2));
