import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Without a .env, undefined fields break initializeApp and crash the whole SPA (blank page).
// Placeholders are only for init when env vars are missing; AuthContext uses AUTH_DISABLED for local dev.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "local-dev-placeholder",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "local-dev-placeholder.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "local-dev-placeholder",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "local-dev-placeholder.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:000000000000:web:localdev",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
