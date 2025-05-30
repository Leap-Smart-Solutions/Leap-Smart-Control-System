// alternativeVerification.js - CORS-enabled SMS verification alternatives

class AlternativeVerificationService {
  constructor() {
    this.smsServices = [
      {
        name: 'TextBelt',
        baseUrl: 'https://textbelt.com/text',
        method: 'POST',
        corsEnabled: true,
        free: true,
        quotaPerDay: 1
      },
      {
        name: 'SMS77',
        baseUrl: 'https://gateway.sms77.io/api/sms',
        method: 'POST',
        corsEnabled: true,
        free: false,
        requiresApiKey: true
      }
    ];
    
    this.emailServices = [
      {
        name: 'EmailJS',
        baseUrl: 'https://api.emailjs.com/api/v1.0/email/send',
        method: 'POST',
        corsEnabled: true,
        free: true,
        requiresConfig: true
      }
    ];
    
    this.activeOTPs = new Map();
    this.currentService = 0;
  }

  /**
   * Generate random OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Store OTP with expiration
   */
  storeOTP(identifier, otp) {
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 5);
    
    this.activeOTPs.set(identifier, {
      otp,
      expiry: expiryTime,
      attempts: 0
    });
    
    // Auto-cleanup after 5 minutes
    setTimeout(() => {
      this.activeOTPs.delete(identifier);
    }, 5 * 60 * 1000);
  }

  /**
   * Send SMS via TextBelt (Free tier - 1 SMS per day per IP)
   */
  async sendSMSViaTextBelt(phoneNumber, message) {
    try {
      const response = await fetch('https://textbelt.com/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          message: message,
          key: 'textbelt' // Free key, limited quota
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          message: 'SMS sent successfully',
          provider: 'TextBelt',
          quotaRemaining: data.quotaRemaining
        };
      } else {
        throw new Error(data.error || 'Failed to send SMS');
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        provider: 'TextBelt'
      };
    }
  }

  /**
   * Send email via EmailJS
   */
  async sendEmailViaEmailJS(email, otp) {
    try {
      // Note: Requires EmailJS account setup
      const serviceId = 'your_service_id'; // Replace with actual EmailJS service ID
      const templateId = 'your_template_id'; // Replace with actual template ID
      const publicKey = 'your_public_key'; // Replace with actual public key
      
      const templateParams = {
        to_email: email,
        otp_code: otp,
        expires_in: '5 minutes'
      };
      
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: templateParams
        })
      });
      
      if (response.ok) {
        return {
          success: true,
          message: 'Email sent successfully',
          provider: 'EmailJS'
        };
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        provider: 'EmailJS'
      };
    }
  }

  /**
   * Send OTP via SMS (fallback method)
   */
  async sendSMSOTP(phoneNumber) {
    try {
      const otp = this.generateOTP();
      const message = `Your verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`;
      
      // Clean phone number
      const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
      
      // Try TextBelt first (free but limited)
      const result = await this.sendSMSViaTextBelt(cleanPhone, message);
      
      if (result.success) {
        this.storeOTP(cleanPhone, otp);
        return {
          success: true,
          message: result.message,
          provider: result.provider,
          phoneNumber: cleanPhone,
          quotaInfo: result.quotaRemaining ? `Quota remaining: ${result.quotaRemaining}` : null
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to send SMS OTP'
      };
    }
  }

  /**
   * Send OTP via Email
   */
  async sendEmailOTP(email) {
    try {
      const otp = this.generateOTP();
      
      const result = await this.sendEmailViaEmailJS(email, otp);
      
      if (result.success) {
        this.storeOTP(email, otp);
        return {
          success: true,
          message: 'Verification code sent to your email',
          provider: result.provider,
          email: email
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to send email OTP'
      };
    }
  }

  /**
   * Verify OTP for any method
   */
  async verifyOTP(identifier, otp) {
    try {
      const cleanIdentifier = identifier.replace(/[^\d+@.]/g, '');
      const storedData = this.activeOTPs.get(cleanIdentifier);
      
      if (!storedData) {
        return {
          success: false,
          message: 'No OTP found or expired'
        };
      }
      
      // Check expiry
      if (new Date() > storedData.expiry) {
        this.activeOTPs.delete(cleanIdentifier);
        return {
          success: false,
          message: 'OTP has expired'
        };
      }
      
      // Check attempts
      if (storedData.attempts >= 3) {
        this.activeOTPs.delete(cleanIdentifier);
        return {
          success: false,
          message: 'Too many failed attempts'
        };
      }
      
      // Verify OTP
      if (storedData.otp === otp.toString()) {
        this.activeOTPs.delete(cleanIdentifier);
        return {
          success: true,
          message: 'OTP verified successfully'
        };
      } else {
        storedData.attempts++;
        return {
          success: false,
          message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Verification failed'
      };
    }
  }

  /**
   * Check service availability
   */
  async checkServiceAvailability() {
    const results = {
      sms: { available: false, provider: null, limitation: null },
      email: { available: false, provider: null, requirement: null }
    };
    
    // Check TextBelt availability
    try {
      const response = await fetch('https://textbelt.com/quota/textbelt', {
        method: 'GET'
      });
      const data = await response.json();
      
      if (data.quotaRemaining > 0) {
        results.sms = {
          available: true,
          provider: 'TextBelt',
          limitation: `${data.quotaRemaining} SMS remaining today`
        };
      } else {
        results.sms = {
          available: false,
          provider: 'TextBelt',
          limitation: 'Daily quota exceeded'
        };
      }
    } catch (error) {
      results.sms = {
        available: false,
        provider: 'TextBelt',
        limitation: 'Service unavailable'
      };
    }
    
    // EmailJS is always available if configured
    results.email = {
      available: true,
      provider: 'EmailJS',
      requirement: 'Requires EmailJS account setup'
    };
    
    return results;
  }

  /**
   * Get service status
   */
  getServiceStatus() {
    return {
      activeOTPs: this.activeOTPs.size,
      availableServices: ['SMS (TextBelt)', 'Email (EmailJS)'],
      limitations: {
        sms: 'Free tier: 1 SMS per day per IP',
        email: 'Requires EmailJS account configuration'
      }
    };
  }

  /**
   * Clear expired OTPs manually
   */
  clearExpiredOTPs() {
    const now = new Date();
    let cleared = 0;
    
    for (const [identifier, data] of this.activeOTPs.entries()) {
      if (now > data.expiry) {
        this.activeOTPs.delete(identifier);
        cleared++;
      }
    }
    
    return { cleared };
  }

  /**
   * Format phone number for SMS
   */
  formatPhoneForSMS(phoneNumber) {
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // Add + if not present and starts with country code
    if (!cleaned.startsWith('+') && cleaned.length > 10) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Smart verification method selection
   */
  async sendOTPSmart(identifier) {
    // Determine if it's email or phone
    if (this.validateEmail(identifier)) {
      return await this.sendEmailOTP(identifier);
    } else {
      // Assume it's a phone number
      const formattedPhone = this.formatPhoneForSMS(identifier);
      return await this.sendSMSOTP(formattedPhone);
    }
  }
}

// Create singleton instance
const alternativeVerification = new AlternativeVerificationService();
export default alternativeVerification;