import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';

// Initialize Firebase Admin if not already initialized
function initFirebaseAdmin(): App | undefined {
  if (!getApps().length) {
    try {
      // Prioritize explicit service account variables
      if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        const app = initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Replace literal \n with actual newlines
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
        });
        console.log('Firebase Admin initialized with individual environment variables.');
        return app;
      } 
      // Fallback to service account JSON string if provided
      else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        const app = initializeApp({
          credential: cert(serviceAccount),
        });
        console.log('Firebase Admin initialized with FIREBASE_SERVICE_ACCOUNT.');
        return app;
      } 
      else {
        console.warn('WARNING: Firebase Admin credentials not found. Push notifications will fail.');
      }
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
    }
  } else {
    return getApps()[0];
  }
  return undefined;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  url?: string;
  imageUrl?: string;
}

export class PushNotificationService {
  /**
   * Send a multicast push notification to an array of FCM tokens.
   */
  static async sendToTokens(tokens: string[], payload: PushNotificationPayload) {
    if (!tokens || tokens.length === 0) return { successCount: 0, failureCount: 0 };
    
    const app = initFirebaseAdmin();

    if (!app) {
      console.error('Cannot send push notification: Firebase Admin is not initialized.');
      return { successCount: 0, failureCount: tokens.length };
    }

    const message: MulticastMessage = {
      tokens,
      notification: {
        title: payload.title,
        body: payload.body,
        ...(payload.imageUrl ? { imageUrl: payload.imageUrl } : {}),
      },
      webpush: {
        fcmOptions: {
          link: payload.url || 'https://yardvybz.news',
        },
      },
    };

    try {
      const response = await getMessaging(app).sendEachForMulticast(message);
      console.log(`Successfully sent ${response.successCount} messages; ${response.failureCount} failed.`);
      
      // We could handle response.responses here to remove invalid tokens from the DB
      // but for simplicity we'll just log it for now.
      
      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses
      };
    } catch (error) {
      console.error('Error sending multicast push notification:', error);
      return { successCount: 0, failureCount: tokens.length, error };
    }
  }
}
