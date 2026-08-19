'use client';

import { useEffect, useState } from 'react';
import { onMessage, getToken } from 'firebase/messaging';
import { initializeMessaging } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    const setupMessaging = async () => {
      const messaging = await initializeMessaging();
      if (!messaging) return;

      // Request permission if not granted
      if (Notification.permission === 'default') {
        try {
          const perm = await Notification.requestPermission();
          setPermission(perm);
          
          if (perm === 'granted') {
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY // Optional, but recommended for web push
            });
            if (currentToken) {
              console.log('FCM Token:', currentToken);
              // TODO: Send this token to your server to send push notifications to this user
            }
          }
        } catch (error) {
          console.error('An error occurred while requesting permission ', error);
        }
      } else if (Notification.permission === 'granted') {
         // Already granted, just get token
         try {
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
            });
            if (currentToken) {
              console.log('FCM Token:', currentToken);
            }
         } catch (e) {
            console.error('Error getting token', e);
         }
      }

      // Listen for foreground messages
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        toast(
          (t) => (
            <div>
              <b>{payload.notification?.title}</b>
              <p>{payload.notification?.body}</p>
            </div>
          ),
          { duration: 5000 }
        );
      });

      return () => {
        unsubscribe();
      };
    };

    if (permission !== 'denied') {
      setupMessaging();
    }
  }, [permission]);

  // We don't render anything visually, it just runs in the background
  return null;
}
