// phoneVerificationConfig.js - Configuration for phone verification system

export const phoneVerificationConfig = {
  // WhatsApp OTP API Configuration (using CORS proxies)
  api: {
    // Direct API base (will be proxied automatically)
    baseUrl: 'https://whatsapp-otp-production.up.railway.app',
    endpoints: {
      sendOtp: '/send-otp',
      verifyOtp: '/verify-otp',
      status: '/status'
    },
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 2000 // 2 seconds between retries
  },

  // OTP Configuration
  otp: {
    length: 6,
    expiryMinutes: 5,
    allowedCharacters: '0123456789',
    caseSensitive: false
  },

  // Phone Number Validation
  phoneValidation: {
    minLength: 10,
    maxLength: 15,
    allowedFormats: [
      'international', // +1234567890
      'national',      // 1234567890
      'formatted'      // +1 234 567 890
    ],
    defaultCountryCode: null // Set to default country code if needed
  },

  // UI Configuration
  ui: {
    autoSendOnLoad: true,
    showPhoneNumber: true,
    allowSkip: true,
    resendCooldown: 30, // seconds
    maxResendAttempts: 3
  },

  // Session Management
  session: {
    storageKey: 'pendingPhoneVerification',
    expiryHours: 24,
    clearOnVerification: true
  },

  // Error Messages
  messages: {
    errors: {
      invalidPhoneFormat: 'Phone number must be 10-15 digits',
      invalidOtpFormat: 'OTP must be exactly 6 digits',
      serviceUnavailable: 'Verification service is currently unavailable',
      networkError: 'Network connection error. Please try again.',
      otpExpired: 'OTP has expired. Please request a new code.',
      otpInvalid: 'Invalid OTP code. Please try again.',
      maxAttemptsReached: 'Maximum verification attempts reached',
      phoneRequired: 'Phone number is required',
      otpRequired: 'Verification code is required'
    },
    success: {
      otpSent: 'Verification code sent successfully',
      phoneVerified: 'Phone number verified successfully',
      resendSuccess: 'New verification code sent'
    },
    info: {
      checkWhatsapp: 'Please check your WhatsApp for the verification code',
      codeExpiry: 'Code will expire in 5 minutes',
      resendAvailable: 'You can request a new code in {seconds} seconds'
    }
  },

  // Development/Debug Settings
  debug: {
    enabled: true, // Enabled for CORS proxy debugging
    logApiCalls: true,
    logValidation: true,
    mockApiResponses: false
  },

  // Feature Flags
  features: {
    enableResend: true,
    enableSkip: true,
    enableAutoFormat: true,
    enableStatusCheck: true,
    enableRetry: true
  }
};

// Environment-specific overrides
if (typeof window !== 'undefined') {
  // Enable debug mode for all environments when using CORS proxies
  phoneVerificationConfig.debug.enabled = true;
  phoneVerificationConfig.debug.logApiCalls = true;
  phoneVerificationConfig.debug.logValidation = true;
}

export default phoneVerificationConfig;