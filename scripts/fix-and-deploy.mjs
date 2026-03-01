import { readFileSync, writeFileSync } from "fs";
import { GoogleAuth } from "google-auth-library";

const project = "amda-cf25f";

const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return signedIn() && request.auth.uid == userId;
    }

    function myRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.get('role', 'student');
    }

    function isRecruiterOrAdmin() {
      return signedIn() && (myRole() == 'recruiter' || myRole() == 'admin');
    }

    function isAdmin() {
      return signedIn() && myRole() == 'admin';
    }

    match /users/{userId} {
      allow read: if isOwner(userId) || isRecruiterOrAdmin();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if false;
    }

    match /challenges/{challengeId} {
      allow read: if signedIn();
      allow write: if isAdmin();
    }

    match /submissions/{submissionId} {
      allow read: if signedIn() && (resource.data.userId == request.auth.uid || isRecruiterOrAdmin());
      allow create: if signedIn()
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.challengeId is string
        && request.resource.data.code is string
        && request.resource.data.explanation is string
        && request.resource.data.conceptualReasoning is string;
      allow update: if isAdmin();
      allow delete: if false;
    }

    match /scores/{userId} {
      allow read: if isOwner(userId) || isRecruiterOrAdmin();
      allow write: if isAdmin();
    }

    match /leaderboard/{entryId} {
      allow read: if signedIn();
      allow write: if isAdmin();
    }

    match /skillExchanges/{exchangeId} {
      allow read: if signedIn();
      allow create: if signedIn();
      allow update: if signedIn()
        && (resource.data.teacherId == request.auth.uid || resource.data.learnerId == request.auth.uid || isAdmin());
      allow delete: if false;
    }

    match /sessions/{sessionId} {
      allow read: if signedIn();
      allow write: if isAdmin();
    }

    match /recruiters/{recruiterId} {
      allow read: if isRecruiterOrAdmin();
      allow write: if isAdmin();
    }

    match /logs/{logId} {
      allow read: if isRecruiterOrAdmin();
      allow create: if signedIn();
      allow update, delete: if isAdmin();
    }

    match /analytics/{docId} {
      allow read: if isRecruiterOrAdmin();
      allow write: if isAdmin();
    }
  }
}`;

// Fix the firestore.rules file
writeFileSync("firestore.rules", rules, "utf8");
console.log("firestore.rules written cleanly.");

// Get service account from .env.local
const envRaw = readFileSync(".env.local", "utf8");
const saLine = envRaw.split("\n").find(l => l.startsWith("FIREBASE_SERVICE_ACCOUNT_KEY="));
const saJson = JSON.parse(saLine.replace("FIREBASE_SERVICE_ACCOUNT_KEY=", "").trim());

const auth = new GoogleAuth({
  credentials: saJson,
  scopes: ["https://www.googleapis.com/auth/cloud-platform", "https://www.googleapis.com/auth/firebase"]
});
const client = await auth.getClient();
const tokenRes = await client.getAccessToken();
const token = tokenRes.token;
console.log("OAuth2 token obtained.");

const base = `https://firebaserules.googleapis.com/v1/projects/${project}`;
const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

// Create ruleset
const rulesetRes = await fetch(`${base}/rulesets`, {
  method: "POST",
  headers,
  body: JSON.stringify({ source: { files: [{ name: "firestore.rules", content: rules }] } })
});
const ruleset = await rulesetRes.json();

if (!rulesetRes.ok) {
  console.error("Ruleset creation failed:", rulesetRes.status, JSON.stringify(ruleset));
  process.exit(1);
}
console.log("Ruleset created:", ruleset.name);

// Try to patch existing release first, then create if it doesn't exist
const releaseBody = JSON.stringify({
  release: { name: `projects/${project}/releases/cloud.firestore`, rulesetName: ruleset.name }
});

let releaseRes = await fetch(`${base}/releases/cloud.firestore`, {
  method: "PATCH",
  headers,
  body: releaseBody
});

if (releaseRes.status === 404) {
  releaseRes = await fetch(`${base}/releases`, {
    method: "POST",
    headers,
    body: releaseBody
  });
}

const release = await releaseRes.json();
if (!releaseRes.ok) {
  console.error("Release update failed:", releaseRes.status, JSON.stringify(release));
  process.exit(1);
}

console.log("\n✅  Firestore security rules deployed successfully to", project);
