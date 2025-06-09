// phoneVerification.js - WhatsApp OTP verification utility
import phoneVerificationConfig from '../config/phoneVerificationConfig.js';

class PhoneVerificationService {
  constructor() {
    this.config = phoneVerificationConfig;
    this.whatsappApiBase = 'https://whatsapp-otp-production.up.railway.app';
    this.corsProxies = [
      'https://cors-anywhere.herokuapp.com/',
      'https://corsproxy.io/?',
      'https://proxy.cors.sh/',
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/',
      'https://api.codetabs.com/v1/proxy?quest=',
      'https://cors.bridged.cc/',
      'https://cors.sh/',
      'https://cors.zimjs.com/',
      'https://cors-escape.herokuapp.com/',
      'https://thingproxy.freeboard.io/fetch/',
      'https://cors.io/?',
      'https://crossorigin.me/'
    ];
    this.currentProxyIndex = 0;
  }

  /**
   * Get current CORS proxy
   */
  getCurrentProxy() {
    return this.corsProxies[this.currentProxyIndex];
  }

  /**
   * Switch to next proxy
   */
  switchProxy() {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.corsProxies.length;
  }

  /**
   * Build proxied URL
   */
  buildProxyUrl(endpoint) {
    const proxy = this.getCurrentProxy();
    const targetUrl = `${this.whatsappApiBase}${endpoint}`;
    
    if (proxy.includes('allorigins.win')) {
      return `${proxy}${encodeURIComponent(targetUrl)}`;
    } else {
      return `${proxy}${targetUrl}`;
    }
  }

  /**
   * Make request with CORS proxy fallback
   */
  async makeProxiedRequest(endpoint, options = {}) {
    let lastError;
    
    for (let attempt = 0; attempt < this.corsProxies.length; attempt++) {
      try {
        const proxyUrl = this.buildProxyUrl(endpoint);
        
        if (this.config.debug.enabled) {
          console.log(`Trying proxy ${attempt + 1}/${this.corsProxies.length}: ${this.getCurrentProxy()}`);
        }
        
        const requestOptions = {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...options.headers
          }
        };

        const response = await fetch(proxyUrl, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data, proxy: this.getCurrentProxy() };

      } catch (error) {
        lastError = error;
        if (this.config.debug.enabled) {
          console.warn(`Proxy attempt ${attempt + 1} failed:`, error.message);
        }
        
        if (attempt < this.corsProxies.length - 1) {
          this.switchProxy();
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    throw new Error(`All CORS proxies failed. Last error: ${lastError.message}`);
  }

  /**
   * Format phone number for the API (remove spaces, dashes, parentheses)
   * @param {string} phoneNumber - Raw phone number input
   * @returns {string} - Formatted phone number
   */
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    let formatted = phoneNumber.replace(/[^\d]/g, '');
    
    // If it doesn't start with a country code, assume it needs one
    // You might want to modify this based on your app's requirements
    if (!formatted.startsWith('1') && !formatted.startsWith('2') && !formatted.startsWith('3')) {
      // Add a default country code if needed (you can modify this)
      // For now, we'll assume the user provides the full international number
    }
    
    return formatted;
  }

  /**
   * Send OTP to a phone number via WhatsApp
   * @param {string} phoneNumber - Phone number in international format
   * @returns {Promise<Object>} - API response
   */
  async sendOTP(phoneNumber) {
    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber);
      
      if (this.config.debug.enabled) {
        console.log('Sending OTP via CORS proxy to:', formattedNumber);
      }
      
      const result = await this.makeProxiedRequest('/send-otp', {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber: formattedNumber
        })
      });

      return {
        success: true,
        message: result.data.message || this.config.messages.success.otpSent,
        phoneNumber: result.data.phoneNumber || formattedNumber,
        method: 'cors-proxy',
        proxy: result.proxy
      };

    } catch (error) {
      if (this.config.debug.enabled) {
        console.error('Error sending OTP:', error);
      }
      return {
        success: false,
        message: error.message || this.config.messages.errors.networkError,
        error: error
      };
    }
  }

  /**
   * Verify OTP code
   * @param {string} phoneNumber - Phone number in international format
   * @param {string} otp - 6-digit OTP code
   * @returns {Promise<Object>} - Verification result
   */
  async verifyOTP(phoneNumber, otp) {
    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber);
      
      if (this.config.debug.enabled) {
        console.log('Verifying OTP via CORS proxy:', formattedNumber, otp);
      }
      
      const result = await this.makeProxiedRequest('/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber: formattedNumber,
          otp: otp.toString()
        })
      });

      return {
        success: true,
        message: result.data.message || this.config.messages.success.phoneVerified,
        method: 'cors-proxy',
        proxy: result.proxy
      };

    } catch (error) {
      if (this.config.debug.enabled) {
        console.error('Error verifying OTP:', error);
      }
      return {
        success: false,
        message: error.message || this.config.messages.errors.otpInvalid,
        error: error
      };
    }
  }

  /**
   * Check API service status
   * @returns {Promise<Object>} - Service status
   */
  async checkServiceStatus() {
    try {
      if (this.config.debug.enabled) {
        console.log('Checking service status via CORS proxy...');
      }
      
      const result = await this.makeProxiedRequest('/status', {
        method: 'GET'
      });
      
      return {
        success: true,
        clientReady: result.data.clientReady,
        qrAvailable: result.data.qrAvailable,
        method: 'cors-proxy',
        proxy: result.proxy
      };
      
    } catch (error) {
      if (this.config.debug.enabled) {
        console.error('Error checking service status:', error);
      }
      return {
        success: false,
        message: this.config.messages.errors.serviceUnavailable,
        error: error
      };
    }
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   * @returns {Object} - Validation result
   */
  validatePhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/[^\d]/g, '');
    
    if (cleaned.length < this.config.phoneValidation.minLength) {
      return {
        valid: false,
        message: this.config.messages.errors.invalidPhoneFormat
      };
    }
    
    if (cleaned.length > this.config.phoneValidation.maxLength) {
      return {
        valid: false,
        message: this.config.messages.errors.invalidPhoneFormat
      };
    }
    
    if (this.config.debug.logValidation) {
      console.log('Phone validation passed:', cleaned);
    }
    
    return {
      valid: true,
      formatted: cleaned
    };
  }

  /**
   * Validate OTP format
   * @param {string} otp - OTP code to validate
   * @returns {Object} - Validation result
   */
  validateOTP(otp) {
    const cleaned = otp.replace(/[^\d]/g, '');
    
    if (cleaned.length !== this.config.otp.length) {
      return {
        valid: false,
        message: this.config.messages.errors.invalidOtpFormat
      };
    }
    
    if (this.config.debug.logValidation) {
      console.log('OTP validation passed:', cleaned);
    }
    
    return {
      valid: true,
      otp: cleaned
    };
  }
}

// Create and export a singleton instance
const phoneVerificationService = new PhoneVerificationService();
export default phoneVerificationService;