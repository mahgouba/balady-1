/*
 * Firebase initialization (compat SDK from CDN — no build step required).
 *
 * IMPORTANT: Replace the placeholder values in `firebaseConfig` below with the
 * real values from Firebase Console → Project Settings → Your apps → Web app.
 * Project: ai-studio-applet-webapp-8abdf
 *
 * Required Firebase services to enable in the console:
 *   - Cloud Firestore  (collection: certificates)
 *   - Cloud Storage    (folder:    profileImages/)
 *
 * Exposes globals on `window`:
 *   - window.firebaseReady : Promise that resolves when SDK + init are done
 *   - window.db            : firebase.firestore() instance
 *   - window.storage       : firebase.storage() instance
 */
(function () {
  var FB_VERSION = '10.12.2';
  var SDK_BASE = 'https://www.gstatic.com/firebasejs/' + FB_VERSION + '/';

  var firebaseConfig = {
    apiKey: "REPLACE_WITH_API_KEY",
    authDomain: "ai-studio-applet-webapp-8abdf.firebaseapp.com",
    projectId: "ai-studio-applet-webapp-8abdf",
    storageBucket: "ai-studio-applet-webapp-8abdf.appspot.com",
    messagingSenderId: "REPLACE_WITH_SENDER_ID",
    appId: "REPLACE_WITH_APP_ID"
  };
  var hasPlaceholderConfig =
    !firebaseConfig.apiKey || firebaseConfig.apiKey.indexOf('REPLACE_WITH_') === 0 ||
    !firebaseConfig.messagingSenderId || firebaseConfig.messagingSenderId.indexOf('REPLACE_WITH_') === 0 ||
    !firebaseConfig.appId || firebaseConfig.appId.indexOf('REPLACE_WITH_') === 0;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }

  window.db = null;
  window.storage = null;
  window.firebaseDisabled = false;

  window.firebaseReady = (async function () {
    if (hasPlaceholderConfig) {
      // Keep pages working in local/dev mode even before real Firebase config is provided.
      window.firebaseDisabled = true;
      console.warn('Firebase config is incomplete. Falling back to local data mode.');
      return { db: null, storage: null };
    }

    await loadScript(SDK_BASE + 'firebase-app-compat.js');
    await loadScript(SDK_BASE + 'firebase-firestore-compat.js');
    await loadScript(SDK_BASE + 'firebase-storage-compat.js');

    if (typeof firebase !== 'undefined' && firebase) {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      window.db = (typeof firebase.firestore === 'function') ? firebase.firestore() : null;
      window.storage = (typeof firebase.storage === 'function') ? firebase.storage() : null;
    } else {
      throw new Error('Firebase SDK loaded but "firebase" global is undefined');
    }

    return { db: window.db, storage: window.storage };
  })().catch(function (err) {
    console.error('Firebase init failed:', err);
    // Do not hard-fail all pages; allow callers to fallback gracefully.
    window.firebaseDisabled = true;
    return { db: null, storage: null };
  });
})();
