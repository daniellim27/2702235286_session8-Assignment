import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Your Firebase configuration with safe access to environment variables
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "demo-mode",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "demo-mode",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "demo-mode",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "demo-mode",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "demo-mode",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "demo-mode",
}

// Initialize Firebase with error handling
let app
let db

try {
  // Only initialize if we have valid config
  if (firebaseConfig.apiKey !== "demo-mode" && typeof window !== "undefined") {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  } else {
    console.log("Firebase running in demo mode - using localStorage")
  }
} catch (error) {
  console.error("Error initializing Firebase:", error)
}

export { db }
