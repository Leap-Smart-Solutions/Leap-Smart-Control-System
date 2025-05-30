/**
 * Phone Input Validator Utility
 * Restricts telephone input fields to only accept numeric characters
 */

class PhoneInputValidator {
  constructor() {
    this.allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];
  }

  /**
   * Initialize phone validation for a specific input element
   * @param {HTMLInputElement} input - The telephone input element
   * @param {Object} options - Configuration options
   */
  init(input, options = {}) {
    if (!input || input.type !== 'tel') {
      console.warn('PhoneInputValidator: Input must be of type "tel"');
      return;
    }

    const config = {
      allowSpaces: false,
      allowDashes: false,
      allowParentheses: false,
      maxLength: 15,
      autoFormat: false,
      formatType: 'auto', // 'us', 'international', 'auto', 'none'
      ...options
    };

    this.setupEventListeners(input, config);
  }

  /**
   * Initialize phone validation for all tel input elements on the page
   * @param {Object} options - Configuration options
   */
  initAll(options = {}) {
    const telInputs = document.querySelectorAll('input[type="tel"]');
    telInputs.forEach(input => this.init(input, options));
  }

  /**
   * Setup event listeners for the input element
   * @param {HTMLInputElement} input - The input element
   * @param {Object} config - Configuration object
   */
  setupEventListeners(input, config) {
    // Prevent non-numeric keypress
    input.addEventListener('keypress', (e) => this.handleKeyPress(e, config));
    
    // Handle special keys and paste events
    input.addEventListener('keydown', (e) => this.handleKeyDown(e, config));
    
    // Clean input on paste and input events
    input.addEventListener('input', (e) => this.handleInput(e, config));
    
    // Prevent drop events with non-numeric content
    input.addEventListener('drop', (e) => this.handleDrop(e));
    
    // Prevent context menu paste of non-numeric content
    input.addEventListener('paste', (e) => this.handlePaste(e, config));
  }

  /**
   * Handle keypress events
   * @param {KeyboardEvent} e - The keyboard event
   * @param {Object} config - Configuration object
   */
  handleKeyPress(e, config) {
    const char = e.key;
    
    // Allow Ctrl/Cmd combinations first (copy, paste, select all, etc.)
    if (e.ctrlKey || e.metaKey) {
      return true;
    }
    
    // Allow control/navigation characters
    if (this.allowedKeys.includes(e.key)) {
      return true;
    }
    
    // Allow + symbol only at the beginning
    if (char === '+') {
      const currentValue = e.target.value;
      if (currentValue.length === 0 || (e.target.selectionStart === 0 && e.target.selectionEnd === currentValue.length)) {
        return true;
      } else {
        e.preventDefault();
        return false;
      }
    }
    
    // Allow numeric characters only (0-9)
    if (/^[0-9]$/.test(char)) {
      // Check max length before allowing the digit
      const currentDigits = e.target.value.replace(/\D/g, '');
      if (config.maxLength && currentDigits.length >= config.maxLength) {
        e.preventDefault();
        return false;
      }
      return true;
    }
    
    // Allow configured special characters only if explicitly enabled
    if (config.allowSpaces && char === ' ') return true;
    if (config.allowDashes && (char === '-' || char === '–')) return true;
    if (config.allowParentheses && (char === '(' || char === ')')) return true;
    
    // Prevent all other characters including letters, symbols, etc.
    e.preventDefault();
    return false;
  }

  /**
   * Handle keydown events
   * @param {KeyboardEvent} e - The keyboard event
   * @param {Object} config - Configuration object
   */
  handleKeyDown(e, config) {
    // Check max length
    if (config.maxLength && e.target.value.length >= config.maxLength) {
      if (!this.allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        return false;
      }
    }
    
    return true;
  }

  /**
   * Handle input events (includes paste and drag-drop)
   * @param {InputEvent} e - The input event
   * @param {Object} config - Configuration object
   */
  handleInput(e, config) {
    const input = e.target;
    
    // Get current value and extract only valid characters
    const currentValue = input.value;
    const digits = this.cleanPhoneNumber(currentValue, config);
    
    // Apply max length constraint
    const limitedDigits = config.maxLength ? digits.substring(0, config.maxLength) : digits;
    
    // Determine final value based on formatting preference
    let finalValue = limitedDigits;
    if (config.autoFormat && limitedDigits.length > 0) {
      finalValue = this.formatPhoneNumber(limitedDigits, config.formatType);
    }
    
    // Update the input value if it has changed
    if (input.value !== finalValue) {
      const cursorPosition = input.selectionStart;
      input.value = finalValue;
      
      // For simplicity and to avoid digit reordering, place cursor at the end
      // This ensures that as users type, digits maintain their order
      input.setSelectionRange(finalValue.length, finalValue.length);
    }
  }

  /**
   * Handle paste events
   * @param {ClipboardEvent} e - The clipboard event
   * @param {Object} config - Configuration object
   */
  handlePaste(e, config) {
    e.preventDefault();
    
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    const cleanPaste = this.cleanPhoneNumber(paste, config);
    
    if (cleanPaste) {
      const input = e.target;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const currentValue = input.value;
      
      // Insert cleaned paste content
      const newValue = currentValue.substring(0, start) + cleanPaste + currentValue.substring(end);
      
      // Apply max length
      const finalValue = config.maxLength ? newValue.substring(0, config.maxLength) : newValue;
      
      input.value = config.autoFormat ? this.formatPhoneNumber(finalValue, config.formatType) : finalValue;
      
      // Set cursor position after pasted content
      const newCursorPosition = start + cleanPaste.length;
      input.setSelectionRange(newCursorPosition, newCursorPosition);
      
      // Trigger input event
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  /**
   * Handle drop events
   * @param {DragEvent} e - The drag event
   */
  handleDrop(e) {
    e.preventDefault();
    // For simplicity, we're preventing all drop events
    // You could implement similar logic to paste if needed
  }

  /**
   * Clean phone number string to only include allowed characters
   * @param {string} value - The input value
   * @param {Object} config - Configuration object
   * @returns {string} Cleaned phone number
   */
  cleanPhoneNumber(value, config) {
    if (!value) return '';
    
    // Preserve + at the beginning if present, then extract digits
    const hasPlus = value.startsWith('+');
    const digits = value.replace(/\D/g, '');
    
    return hasPlus ? '+' + digits : digits;
  }

  /**
   * Format phone number for display (supports US and international formats)
   * @param {string} value - The phone number string
   * @param {string} formatType - Type of formatting ('us', 'international', 'auto', 'none')
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(value, formatType = 'auto') {
    const hasPlus = value.startsWith('+');
    const numbersOnly = value.replace(/\D/g, '');
    
    if (numbersOnly.length === 0) return hasPlus ? '+' : '';
    if (formatType === 'none') return hasPlus ? '+' + numbersOnly : numbersOnly;
    
    // Determine format type automatically if set to 'auto'
    let actualFormatType = formatType;
    if (formatType === 'auto') {
      actualFormatType = numbersOnly.length <= 10 ? 'us' : 'international';
    }
    
    if (actualFormatType === 'us') {
      // US format: (XXX) XXX-XXXX
      const prefix = hasPlus ? '+' : '';
      if (numbersOnly.length <= 3) return prefix + numbersOnly;
      if (numbersOnly.length <= 6) return `${prefix}(${numbersOnly.slice(0, 3)}) ${numbersOnly.slice(3)}`;
      return `${prefix}(${numbersOnly.slice(0, 3)}) ${numbersOnly.slice(3, 6)}-${numbersOnly.slice(6, 10)}`;
    }
    
    if (actualFormatType === 'international') {
      // International format: +XXX-XXX-XXX-XXX (groups of 3-4 digits)
      const prefix = hasPlus ? '+' : '';
      if (numbersOnly.length <= 3) return prefix + numbersOnly;
      if (numbersOnly.length <= 6) return `${prefix}${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
      if (numbersOnly.length <= 9) return `${prefix}${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 6)}-${numbersOnly.slice(6)}`;
      if (numbersOnly.length <= 12) return `${prefix}${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 6)}-${numbersOnly.slice(6, 9)}-${numbersOnly.slice(9)}`;
      return `${prefix}${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 6)}-${numbersOnly.slice(6, 9)}-${numbersOnly.slice(9, 12)}-${numbersOnly.slice(12)}`;
    }
    
    // Default fallback
    return hasPlus ? '+' + numbersOnly : numbersOnly;
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber - The phone number to validate
   * @returns {boolean} Whether the phone number is valid
   */
  isValidPhoneNumber(phoneNumber) {
    const numbersOnly = phoneNumber.replace(/\D/g, '');
    return numbersOnly.length >= 10 && numbersOnly.length <= 15;
  }

  /**
   * Get numeric value of phone number
   * @param {string} phoneNumber - The formatted phone number
   * @returns {string} Numbers only
   */
  getNumericValue(phoneNumber) {
    return phoneNumber.replace(/\D/g, '');
  }
}

// Create and export a singleton instance
const phoneInputValidator = new PhoneInputValidator();

export default phoneInputValidator;

// Also make it available globally for non-module usage
if (typeof window !== 'undefined') {
  window.PhoneInputValidator = phoneInputValidator;
}