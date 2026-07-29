/* ==========================================================================
   FIREBASE CONFIG — live.

   Project:  tjsc-punchlists  ("TJ Specialty Punch Lists")
   Console:  https://console.firebase.google.com/project/tjsc-punchlists
   Rules:    punch/firebase/firestore.rules  (deploy with:
             cd punch/firebase && firebase deploy --only firestore:rules)

   These keys are meant to be public — that's how Firebase web apps work.
   Security comes from the Firestore rules, which allow access ONLY to the
   punchlists collection. Nothing else in the project is reachable with them.

   Because the rules are open, anyone with a page link can check items off.
   That's deliberate so subs don't need logins. Don't post the links publicly
   and don't put anything confidential in the notes fields.
   ========================================================================== */

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBVRbVZVvNAOidn3KEbe8aPAk6KaRm9zPk",
  authDomain: "tjsc-punchlists.firebaseapp.com",
  projectId: "tjsc-punchlists",
  storageBucket: "tjsc-punchlists.firebasestorage.app",
  messagingSenderId: "310399630942",
  appId: "1:310399630942:web:5a01d7a19c371b5fddfecf",
};

/* Firestore document for this job: punchlists/<JOB_ID>.
   A new job = copy this folder, change this one line. */
window.PUNCH_JOB_ID = "walther";
