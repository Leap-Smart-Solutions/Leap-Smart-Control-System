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
  doc, setDoc, collection, getDocs, getDoc, query, where
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import phoneInputValidator from "../utils/phoneInputValidator.js";
import phoneVerificationService from "../utils/phoneVerification.js";

// Add this function at the top of the file, after the imports
function showNotification(message, type = 'success') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification-popup';
  notification.innerHTML = `
    <i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span class="message">${message}</span>
    <button class="close-btn">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  // Add to document
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => notification.classList.add('show'), 100);

  // Add close button functionality
  const closeBtn = notification.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

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
    const firstName = signupForm['firstName'].value;
    const lastName = signupForm['lastName'].value;
    const phone = signupForm['phone'].value;
    const password = signupForm['password'].value;
    const confirmPassword = signupForm['confirm-password'].value;

    // Validate passwords match
    if (password !== confirmPassword) {
      showNotification("Passwords do not match!", 'error');
      return;
    }

    // sign up the user
    createUserWithEmailAndPassword(auth, email, password).then(cred => {
        // Send email verification
        sendEmailVerification(cred.user)
          .then(() => {
            showNotification("Verification email sent");
          })
          .catch(error => {
            showNotification("Error sending verification email: " + error.message, 'error');
          });
          
        // Use the user's UID to create a document in the "users" collection
        return setDoc(doc(db, 'users', cred.user.uid), {
          username: username,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          fullName: `${firstName} ${lastName}`,
          createdAt: new Date().toISOString(),
          profilePicture: "https://i.ibb.co/277hTSg8/generic-profile.jpg" 
          // Do not store the password here!
        });
      })
      .then(() => {
        // Store phone number for verification and redirect to verification page
        sessionStorage.setItem('pendingPhoneVerification', phone);
        window.location.assign("../../pages/auth/verify-email.html");
      })
      .catch(error => {
        showNotification("Error during signup or saving user data: " + error.message, 'error');
      });

    signupForm.reset();
  });
}

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
        showNotification("Please verify your email before signing in.", 'error');
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

        // Check for completed orders
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', cred.user.uid),
          where('status', '==', 'completed')
        );
        const querySnapshot = await getDocs(q);
        
        loginForm.reset();
        
        // Redirect based on whether user has completed orders
        if (!querySnapshot.empty) {
          window.location.href = "../../pages/rooms/livingroom.html";
        } else {
          window.location.href = "../../pages/shopping/index.html";
        }
      } catch (error) {
        showNotification("Error checking user verification status: " + error.message, 'error');
        // If there's an error, proceed to shopping page
        loginForm.reset();
        window.location.href = "../../pages/shopping/index.html";
      }
    }).catch(error => {
      showNotification("Login failed: " + error.message, 'error');
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
        showNotification("Password reset email sent. Please check your inbox.");
        forgotPasswordForm.reset();
      })
      .catch(error => {
        showNotification("Error sending reset email: " + error.message, 'error');
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
      showNotification("New passwords don't match", 'error');
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
          showNotification("Password updated successfully");
          changePasswordForm.reset();
          // Close modal if exists
          const modal = document.getElementById('password-modal');
          if(modal) modal.style.display = "none";
        })
        .catch(error => {
          showNotification("Error updating password: " + error.message, 'error');
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
          showNotification("Verification email sent again!");
        })
        .catch(error => {
          showNotification("Error sending verification email: " + error.message, 'error');
        });
    } else {
      showNotification("You need to be logged in to request a verification email", 'error');
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
          showNotification("OTP sent successfully");
        } else {
          showNotification("Failed to send OTP: " + result.message, 'error');
        }
      });
  }
  
  verifyPhoneForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const otpCode = verifyPhoneForm['otp-code'].value;
    const phoneNumber = sessionStorage.getItem('pendingPhoneVerification');
    
    if(!phoneNumber) {
      showNotification("Phone number not found. Please restart the verification process.", 'error');
      window.location.href = "signup.html";
      return;
    }
    
    // Validate OTP format
    const otpValidation = phoneVerificationService.validateOTP(otpCode);
    if(!otpValidation.valid) {
      showNotification(otpValidation.message, 'error');
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
        
        showNotification("Phone number verified successfully!");
        setTimeout(() => {
          window.location.href = "../shopping/index.html";
        }, 2000);
      } else {
        showNotification("Verification failed: " + result.message, 'error');
      }
    } catch (error) {
      showNotification("Error verifying OTP: " + error.message, 'error');
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
      showNotification("Phone number not found. Please restart the verification process.", 'error');
      return;
    }
    
    // Show loading state
    const originalText = resendOtpBtn.textContent;
    resendOtpBtn.textContent = "Sending...";
    resendOtpBtn.disabled = true;
    
    try {
      const result = await phoneVerificationService.sendOTP(phoneNumber);
      
      if(result.success) {
        showNotification("Verification code sent again!");
      } else {
        showNotification("Failed to resend code: " + result.message, 'error');
      }
    } catch (error) {
      showNotification("Error resending OTP: " + error.message, 'error');
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
      showNotification("Please verify your email first before proceeding to phone verification.", 'error');
    }
  });
}
