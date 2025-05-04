// profile.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyBpIQxQrQSwIO6EXwmO9rTfdKS1TuWylZM",

  authDomain: "leap-smart-band.firebaseapp.com",

  databaseURL: "https://leap-smart-band-default-rtdb.firebaseio.com",

  projectId: "leap-smart-band",

  storageBucket: "leap-smart-band.firebasestorage.app",

  messagingSenderId: "766851527627",

  appId: "1:766851527627:web:d58454d39f0c6ec506bc4e",

  measurementId: "G-T5053F5ZLY"

};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Listen for auth state changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, fetch their document from the "users" collection
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

	const usernameP = document.querySelector('#username');
	usernameP.innerText = '#' + userData.username;

	const emailInput = document.querySelector('#email');
	emailInput.value = userData.email;
	emailInput.setAttribute('disabled', true);

	const phoneInput = document.querySelector('#phone');
	phoneInput.value = userData.phone;
        phoneInput.setAttribute('disabled', 'true');
      } else {
//        console.log("No user data found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    // If no user is logged in, redirect to the login page (or index)
//    window.location.href = "./index.html";
  }
});

