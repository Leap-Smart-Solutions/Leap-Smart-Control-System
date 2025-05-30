// firebaseConfig.js
import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth }  from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getStorage }  from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";

// ← your existing config
const firebaseConfig = {
  apiKey: "AIzaSyBpIQxQrQSwIO6EXwmO9rTfdKS1TuWylZM",
  authDomain: "leap-smart-band.firebaseapp.com",
  databaseURL: "https://leap-smart-band-default-rtdb.firebaseio.com",
  projectId: "leap-smart-band",
  storageBucket: "leap-smart-band.appspot.com",
  messagingSenderId: "766851527627",
  appId: "1:766851527627:web:d58454d39f0c6ec506bc4e",
  measurementId: "G-T5053F5ZLY"
};

// Only initialize if there’s no default app yet :contentReference[oaicite:1]{index=1}
const app = !getApps().length 
  ? initializeApp(firebaseConfig) 
  : getApp();

const auth    = getAuth(app);
const db      = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

