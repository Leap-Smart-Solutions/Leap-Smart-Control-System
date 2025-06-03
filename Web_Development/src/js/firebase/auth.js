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
  doc, setDoc, collection, getDocs, getDoc
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import phoneInputValidator from "../utils/phoneInputValidator.js";
import phoneVerificationService from "../utils/phoneVerification.js";

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
  
  // Initialize phone input validation
  const phoneInput = document.querySelector('#phone');
  if (phoneInput) {
    phoneInputValidator.init(phoneInput, {
      maxLength: 16,  // Increased to accommodate + symbol for country codes
      autoFormat: false
    });
  }
  
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
        // Store phone number for verification and redirect to verification page
        sessionStorage.setItem('pendingPhoneVerification', phone);
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

    signInWithEmailAndPassword(auth, email, password).then(async (cred) => {
      // Check if email is verified
      if (!cred.user.emailVerified) {
        alert("Please verify your email before signing in.");
        auth.signOut();
        return;
      }
      
      try {
        // Check if phone verification is completed
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        const userData = userDoc.data();
        
        if (userData && userData.phone && !userData.phoneVerified) {
          // User has a phone number but hasn't verified it
          sessionStorage.setItem('pendingPhoneVerification', userData.phone);
          loginForm.reset();
          window.location.href = "../../pages/auth/verify-phone.html";
          return;
        }
        
        loginForm.reset();
        window.location.href = "../../pages/shopping/index.html";
      } catch (error) {
        console.error("Error checking user verification status:", error);
        // If there's an error, proceed to profile page
        loginForm.reset();
        window.location.href = "../../pages/shopping/index.html";
      }
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

// Phone verification functionality
if(document.querySelector('#verify-phone-form')) {
  const verifyPhoneForm = document.querySelector('#verify-phone-form');
  const phoneDisplay = document.querySelector('#phone-display');
  
  // Display the phone number being verified
  const pendingPhone = sessionStorage.getItem('pendingPhoneVerification');
  if(pendingPhone && phoneDisplay) {
    phoneDisplay.textContent = `Phone: ${pendingPhone}`;
  }
  
  // Send OTP when page loads
  if(pendingPhone) {
    phoneVerificationService.sendOTP(pendingPhone)
      .then(result => {
        if(result.success) {
          console.log("OTP sent successfully");
        } else {
          console.error("Failed to send OTP:", result.message);
          alert("Failed to send verification code: " + result.message);
        }
      });
  }
  
  verifyPhoneForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const otpCode = verifyPhoneForm['otp-code'].value;
    const phoneNumber = sessionStorage.getItem('pendingPhoneVerification');
    
    if(!phoneNumber) {
      alert("Phone number not found. Please restart the verification process.");
      window.location.href = "signup.html";
      return;
    }
    
    // Validate OTP format
    const otpValidation = phoneVerificationService.validateOTP(otpCode);
    if(!otpValidation.valid) {
      alert(otpValidation.message);
      return;
    }
    
    // Show loading state
    const submitBtn = verifyPhoneForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Verifying...";
    submitBtn.disabled = true;
    
    try {
      const result = await phoneVerificationService.verifyOTP(phoneNumber, otpCode);
      
      if(result.success) {
        // Update user document with phone verification status
        const user = auth.currentUser;
        if(user) {
          await setDoc(doc(db, 'users', user.uid), {
            phoneVerified: true,
            phoneVerifiedAt: new Date().toISOString()
          }, { merge: true });
        }
        
        // Clear pending phone verification
        sessionStorage.removeItem('pendingPhoneVerification');
        
        alert("Phone number verified successfully!");
        window.location.href = "profile.html";
      } else {
        alert("Verification failed: " + result.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Verification error: " + error.message);
    } finally {
      // Restore button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Resend phone OTP
if(document.querySelector('#resend-otp')) {
  const resendOtpBtn = document.querySelector('#resend-otp');
  resendOtpBtn.addEventListener('click', async () => {
    const phoneNumber = sessionStorage.getItem('pendingPhoneVerification');
    
    if(!phoneNumber) {
      alert("Phone number not found. Please restart the verification process.");
      return;
    }
    
    // Show loading state
    const originalText = resendOtpBtn.textContent;
    resendOtpBtn.textContent = "Sending...";
    resendOtpBtn.disabled = true;
    
    try {
      const result = await phoneVerificationService.sendOTP(phoneNumber);
      
      if(result.success) {
        alert("Verification code sent again!");
      } else {
        alert("Failed to resend code: " + result.message);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("Error resending code: " + error.message);
    } finally {
      // Restore button state
      resendOtpBtn.textContent = originalText;
      resendOtpBtn.disabled = false;
    }
  });
}

// Continue to phone verification from email verification page
if(document.querySelector('#continue-to-phone-verification')) {
  const continueBtn = document.querySelector('#continue-to-phone-verification');
  continueBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    if(user && user.emailVerified) {
      window.location.href = "verify-phone.html";
    } else {
      alert("Please verify your email first before proceeding to phone verification.");
    }
  });
}
