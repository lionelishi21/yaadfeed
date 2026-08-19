importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// TODO: Replace these placeholders with your actual Firebase Web config
const firebaseConfig = {
  apiKey: "AIzaSyA53y3CtghhNzOR2QHSfQCWV2oeNHfKVUU",
  authDomain: "yardvybz-news.firebaseapp.com",
  projectId: "yardvybz-news",
  storageBucket: "yardvybz-news.firebasestorage.app",
  messagingSenderId: "769034492100",
  appId: "1:769034492100:web:770e0948bcde4e09fad191",
  measurementId: "G-1N9X600LMX"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'YaadFeed Update';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new update.',
    icon: '/icons/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
