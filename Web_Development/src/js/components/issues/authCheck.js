import { auth } from "../../firebase/firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Check authentication state
const checkAuth = () => {
  console.log('Starting authentication check...');
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed. User:', user ? 'Logged in' : 'Not logged in');
      if (user) {
        console.log('User details:', {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified
        });
        unsubscribe(); // Stop listening to auth state changes
        resolve(user);
      } else {
        console.log('No authenticated user found, redirecting to login...');
        unsubscribe(); // Stop listening to auth state changes
        window.location.href = "../../pages/auth/login.html";
        reject(new Error('User not authenticated'));
      }
    });
  });
};

// Initialize auth check when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, checking authentication...');
  checkAuth()
    .then(user => {
      console.log('Authentication successful for user:', user.email);
    })
    .catch(error => {
      console.error('Authentication error:', error);
    });
});

export default checkAuth; 