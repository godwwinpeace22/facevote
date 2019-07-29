// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
let config = {
  apiKey: "AIzaSyA6kjTtvPaK5co3cqG2WZob9e7WdEineFA",
  authDomain: "facevote-eb748.firebaseapp.com",
  databaseURL: "https://facevote-eb748.firebaseio.com",
  projectId: "facevote-eb748",
  messagingSenderId: "742556427936"
};


const app = firebase.initializeApp(config);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});