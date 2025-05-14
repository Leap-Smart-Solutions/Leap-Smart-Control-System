// auth.js file
import { auth, db } from "./firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  doc, setDoc, collection, getDocs
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// listen for auth status changes
auth.onAuthStateChanged(user => {
//  console.log(user);
  if(user) {
//    console.log('user logged in: ', user);

    // Get Data
    const actTableRef = collection(db, 'ACT-Table');
    getDocs(actTableRef)
     .then(snapshot => {
       if (!snapshot.empty) {
         snapshot.docs.forEach(doc => {
//           console.log(doc.id, doc.data());
         });
       } else {
//         console.log("No data found");
       }
     })
     .catch(error => {
       console.error("Error fetching documents:", error);
     });

  } else {
//    console.log('user logged out');
  }
});


// Signing up the users
if (document.querySelector('#signup-form')) {
  const signupForm = document.querySelector('#signup-form');
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    // get user info 
    const email = signupForm['email'].value;
    const username = signupForm['username'].value;
    const phone = signupForm['phone'].value;
    const password = signupForm['password'].value;

//    console.log(email, username, phone, password);

    // sign up the user
    createUserWithEmailAndPassword(auth, email, password).then(cred => {
        // Send email verification
        sendEmailVerification(cred.user)
          .then(() => {
            console.log("Verification email sent");
          })
          .catch(error => {
            console.error("Error sending verification email:", error);
          });
          
        // Use the user's UID to create a document in the "users" collection
        return setDoc(doc(db, 'users', cred.user.uid), {
          username: username,
          email: email,
          phone: phone
          // Do not store the password here!
        });
      })
      .then(() => {
        // Redirect to verification page
        window.location.assign("../../pages/auth/verify-email.html");
      })
      .catch(error => {
        console.error("Error during signup or saving user data:", error);
        alert("Signup error: " + error.message);
      });

    signupForm.reset();
  });}

// Signing out the users
if(document.querySelector('#logout')) {
  const logoutbtn = document.querySelector('#logout');
  logoutbtn.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
//    window.location.href = "./index.html";
  })
}

// Signing in the users
if(document.querySelector('#login-form')) {
  const loginForm = document.querySelector('#login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // get user info 
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;

    signInWithEmailAndPassword(auth, email, password).then((cred) => {
      // Check if email is verified
      if (!cred.user.emailVerified) {
        alert("Please verify your email before signing in.");
        auth.signOut();
        return;
      }
      
      loginForm.reset();
      window.location.href = "../../pages/auth/profile.html";
    }).catch(error => {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    });
  });
}

// Password reset functionality
if(document.querySelector('#forgot-password-form')) {
  const forgotPasswordForm = document.querySelector('#forgot-password-form');
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = forgotPasswordForm['reset-email'].value;
    
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent. Please check your inbox.");
        forgotPasswordForm.reset();
      })
      .catch(error => {
        console.error("Error sending reset email:", error);
        alert("Error: " + error.message);
      });
  });
}

// Change password functionality
if(document.querySelector('#change-password-form')) {
  const changePasswordForm = document.querySelector('#change-password-form');
  changePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const currentPassword = changePasswordForm['current-password'].value;
    const newPassword = changePasswordForm['new-password'].value;
    const confirmPassword = changePasswordForm['confirm-password'].value;
    
    if(newPassword !== confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    
    const user = auth.currentUser;
    if(user) {
      // Reauthenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      
      reauthenticateWithCredential(user, credential)
        .then(() => {
          return updatePassword(user, newPassword);
        })
        .then(() => {
          alert("Password updated successfully");
          changePasswordForm.reset();
          // Close modal if exists
          const modal = document.getElementById('password-modal');
          if(modal) modal.style.display = "none";
        })
        .catch(error => {
          console.error("Error updating password:", error);
          alert("Error: " + error.message);
        });
    }
  });
}

// Resend verification email
if(document.querySelector('#resend-verification')) {
  const resendBtn = document.querySelector('#resend-verification');
  resendBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    if(user) {
      sendEmailVerification(user)
        .then(() => {
          alert("Verification email sent again!");
        })
        .catch(error => {
          console.error("Error sending verification email:", error);
          alert("Error: " + error.message);
        });
    } else {
      alert("You need to be logged in to request a verification email");
    }
  });
}
