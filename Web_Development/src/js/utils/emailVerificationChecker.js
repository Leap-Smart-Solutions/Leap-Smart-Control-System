// emailVerificationChecker.js - Monitor email verification status
import { auth } from "../firebase/firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

class EmailVerificationChecker {
  constructor() {
    this.isChecking = false;
    this.checkInterval = null;
  }

  /**
   * Initialize the email verification checker
   */
  init() {
    this.setupAuthStateListener();
    this.setupPeriodicCheck();
    this.updateButtonStates();
  }

  /**
   * Setup Firebase auth state listener
   */
  setupAuthStateListener() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.checkVerificationStatus(user);
      } else {
        // User not logged in, redirect to login
        console.log("No user found, redirecting to login");
        window.location.href = "login.html";
      }
    });
  }

  /**
   * Setup periodic checking for email verification
   */
  setupPeriodicCheck() {
    // Check every 3 seconds for email verification
    this.checkInterval = setInterval(() => {
      const user = auth.currentUser;
      if (user && !user.emailVerified) {
        this.refreshUserAndCheck();
      }
    }, 3000);
  }

  /**
   * Refresh user token and check verification status
   */
  async refreshUserAndCheck() {
    try {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        this.checkVerificationStatus(user);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  }

  /**
   * Check if user's email is verified and update UI
   */
  checkVerificationStatus(user) {
    const continueBtn = document.querySelector('#continue-to-phone-verification');
    const statusElement = document.querySelector('.verification-status');
    
    if (user.emailVerified) {
      // Email is verified
      this.onEmailVerified();
      
      // Clear the periodic check
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
      }
    } else {
      // Email not yet verified
      this.onEmailNotVerified();
    }
  }

  /**
   * Handle when email is verified
   */
  onEmailVerified() {
    const continueBtn = document.querySelector('#continue-to-phone-verification');
    const statusElement = document.querySelector('.verification-status');
    
    if (continueBtn) {
      continueBtn.disabled = false;
      continueBtn.style.opacity = '1';
      continueBtn.style.cursor = 'pointer';
    }
    
    if (statusElement) {
      // Update status to show email is verified
      const statusIcon = statusElement.querySelector('i');
      const statusTitle = statusElement.querySelector('h2');
      const statusMessages = statusElement.querySelectorAll('p');
      
      if (statusIcon) {
        statusIcon.className = 'fa-solid fa-check-circle';
        statusIcon.style.color = '#28a745';
      }
      
      if (statusTitle) {
        statusTitle.textContent = 'Email Verified!';
      }
      
      if (statusMessages.length > 0) {
        statusMessages[0].textContent = 'Your email has been successfully verified.';
        if (statusMessages.length > 1) {
          statusMessages[1].textContent = 'You can now proceed to phone verification.';
        }
      }
    }
    
    // Show success message
    this.showNotification('Email verified successfully! You can now proceed to phone verification.', 'success');
  }

  /**
   * Handle when email is not verified
   */
  onEmailNotVerified() {
    const continueBtn = document.querySelector('#continue-to-phone-verification');
    
    if (continueBtn) {
      continueBtn.disabled = true;
      continueBtn.style.opacity = '0.6';
      continueBtn.style.cursor = 'not-allowed';
    }
  }

  /**
   * Update button states based on verification status
   */
  updateButtonStates() {
    const user = auth.currentUser;
    if (user) {
      if (user.emailVerified) {
        this.onEmailVerified();
      } else {
        this.onEmailNotVerified();
      }
    }
  }

  /**
   * Show notification message
   */
  showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.email-verification-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'email-verification-notification';
      document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = `email-verification-notification ${type}`;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    `;
    
    if (type === 'success') {
      notification.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
      notification.style.backgroundColor = '#dc3545';
    } else {
      notification.style.backgroundColor = '#0366ff';
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (notification && notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          if (notification && notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  }

  /**
   * Cleanup function
   */
  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Create and export singleton instance
const emailVerificationChecker = new EmailVerificationChecker();
export default emailVerificationChecker;