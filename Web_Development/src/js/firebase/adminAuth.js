// adminAuth.js file for admin-only login
import { auth, db } from "./firebaseConfig.js";
import {
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  collection, getDocs, query, where, getDoc, doc
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Signing in the admins
if(document.querySelector('#login-form')) {
  const loginForm = document.querySelector('#login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // get user info 
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;

    signInWithEmailAndPassword(auth, email, password).then(async (cred) => {
      // Check if email is verified
      if (!cred.user.emailVerified) {
        alert("Please verify your email before signing in.");
        auth.signOut();
        return;
      }
      
      // ADMIN CHECK: Only allow users in 'admins' subcollection
      const adminsRef = collection(db, 'admins');
      const adminQuery = query(
        adminsRef,
        where('email', '==', cred.user.email),
        where('userID', '==', cred.user.uid)
      );
      const adminSnapshot = await getDocs(adminQuery);
      if (adminSnapshot.empty) {
        alert("Access denied: You are not an admin.");
        window.location.href = "../src/pages/auth/login.html";
        auth.signOut();
        return;
      }
      
      // Optionally, you can add more admin-specific logic here
      // For now, just redirect to the admin dashboard or homepage
      loginForm.reset();
      window.location.href = "./Users.html";
    }).catch(error => {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    });
  });
} 