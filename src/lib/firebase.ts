import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, isSupported, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if it hasn't been initialized already and if config exists
const app = getApps().length === 0 && firebaseConfig.apiKey ? initializeApp(firebaseConfig) : getApps()[0];

let messaging: Messaging | null = null;

export const initializeMessaging = async () => {
  if (app && typeof window !== 'undefined') {
    try {
      const supported = await isSupported();
      if (supported) {
        messaging = getMessaging(app);
      }
    } catch (error) {
      console.error('Firebase Messaging is not supported', error);
    }
  }
  return messaging;
};

export { app, messaging };
