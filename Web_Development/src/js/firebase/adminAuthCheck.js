import { auth, db } from "./firebaseConfig.js";
import {
  collection, getDocs, query, where
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Function to check if current user is an admin
export async function checkAdminAuth() {
  // Check if user is logged in
  const user = auth.currentUser;
  if (!user) {
    window.location.href = "../../../admin/login.html";
    return false;
  }

  // Check if email is verified
  if (!user.emailVerified) {
    alert("Please verify your email before accessing admin pages.");
    auth.signOut();
    window.location.href = "../../../admin/login.html";
    return false;
  }

  // Check if user is in admins collection
  const adminsRef = collection(db, 'admins');
  const adminQuery = query(
    adminsRef,
    where('email', '==', user.email),
    where('userID', '==', user.uid)
  );
  const adminSnapshot = await getDocs(adminQuery);
  
  if (adminSnapshot.empty) {
    alert("Access denied: You are not an admin.");
    auth.signOut();
    return false;
  }

  return true;
}

// Function to initialize admin auth check
export function initAdminAuthCheck() {
  // Check auth state changes
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "../../../admin/login.html";
      return;
    }
    
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return;
    }
  });
} 