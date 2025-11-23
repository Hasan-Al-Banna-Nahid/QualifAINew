// lib/firebase/env.ts
export function validateFirebaseEnv() {
  const required = [
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn("Missing Firebase environment variables:", missing);

    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Missing required Firebase environment variables: ${missing.join(", ")}`
      );
    }

    return false;
  }

  return true;
}

// Validate on import
validateFirebaseEnv();
