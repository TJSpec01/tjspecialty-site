/* ==========================================================================
   FIREBASE CONFIG  —  THIS IS THE ONLY FILE YOU NEED TO EDIT
   ==========================================================================

   Paste the config object from your Firebase project below, then commit
   and push. Until you do, the punch list runs in LOCAL MODE: it still works,
   but each person's checkmarks stay on their own device.

   Where to get these values:
     1. console.firebase.google.com  →  Add project (or pick an existing one)
     2. Build → Firestore Database → Create database → Start in production mode
     3. Project settings (gear icon) → Your apps → Web app (</> icon) → Register
     4. Copy the firebaseConfig object it shows you → paste it over the block below

   Then in Firestore → Rules, paste this and click Publish:

     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /punchlists/{job} {
           allow read, write: if true;
         }
       }
     }

   That opens ONLY the punchlists collection — nothing else in your Firebase
   project is reachable. Anyone with the page link can check items off, which
   is the point. Don't put anything confidential in the notes fields.
   ========================================================================== */

window.FIREBASE_CONFIG = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE.appspot.com",
  messagingSenderId: "PASTE",
  appId: "PASTE",
};

/* The Firestore document this job writes to: punchlists/<JOB_ID> */
window.PUNCH_JOB_ID = "walther";
