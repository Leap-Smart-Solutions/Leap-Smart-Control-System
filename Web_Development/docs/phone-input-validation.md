# Phone Input Validation Documentation

## Overview

The Phone Input Validation feature provides robust, client-side validation for telephone input fields (`<input type="tel">`). It restricts input to numeric characters only while providing flexible configuration options for formatting, length limits, and special character handling.

## Features

- **Numbers Only**: Automatically filters out non-numeric characters
- **Auto-Formatting**: Optional US phone number formatting (XXX) XXX-XXXX
- **Length Limits**: Configurable maximum character length
- **Paste Protection**: Filters non-numeric content from pasted text
- **Drag & Drop Protection**: Prevents non-numeric content from being dropped
- **Special Key Support**: Allows navigation keys (arrows, backspace, delete, etc.)
- **Real-time Validation**: Immediate feedback on input validity
- **International Support**: Configurable for different phone number formats

## Quick Start

### 1. Import the Module

```javascript
import phoneInputValidator from './js/utils/phoneInputValidator.js';
```

### 2. Initialize for a Single Input

```javascript
const phoneInput = document.getElementById('phone');
phoneInputValidator.init(phoneInput);
```

### 3. Initialize for All Tel Inputs

```javascript
phoneInputValidator.initAll();
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowSpaces` | boolean | `false` | Allow space characters in input |
| `allowDashes` | boolean | `false` | Allow dash/hyphen characters |
| `allowParentheses` | boolean | `false` | Allow parentheses characters |
| `maxLength` | number | `15` | Maximum number of characters allowed |
| `autoFormat` | boolean | `false` | Enable automatic US phone formatting |

## Usage Examples

### Basic Number-Only Input

```javascript
// Simple numbers-only validation
phoneInputValidator.init(phoneInput, {
    maxLength: 10
});
```

### Auto-Formatted US Phone Number

```javascript
// US phone number with auto-formatting
phoneInputValidator.init(phoneInput, {
    maxLength: 10,
    autoFormat: true
});
```

### International Phone Number

```javascript
// International phone with extended length
phoneInputValidator.init(phoneInput, {
    maxLength: 15,
    autoFormat: true
});
```

### Flexible Input with Special Characters

```javascript
// Allow spaces and dashes
phoneInputValidator.init(phoneInput, {
    allowSpaces: true,
    allowDashes: true,
    allowParentheses: true,
    maxLength: 20
});
```

## HTML Integration

### Basic HTML Structure

```html
<div class="form-group">
    <label for="phone">Phone Number:</label>
    <input type="tel" id="phone" name="phone" placeholder="(555) 123-4567" required>
</div>
```

### With Enhanced Styling

```html
<div class="form-group">
    <label for="phone">Phone Number:</label>
    <div class="phone-input-container">
        <input type="tel" id="phone" name="phone" placeholder="(555) 123-4567" required>
    </div>
    <div class="phone-validation-message" id="phone-message"></div>
</div>
```

## CSS Integration

Include the phone input CSS for enhanced styling:

```html
<link rel="stylesheet" href="./assets/styles/phone-input.css">
```

### CSS Classes Available

- `.phone-input-container` - Container with phone icon
- `.phone-input-icon` - Alternative icon styling
- `.phone-validation-message` - Validation message styling
- `.phone-input-loading` - Loading state
- `.phone-input-success` - Success state
- `.phone-input-error` - Error state

## API Reference

### Methods

#### `init(input, options)`
Initialize validation for a specific input element.

**Parameters:**
- `input` (HTMLInputElement) - The telephone input element
- `options` (Object) - Configuration options

**Returns:** void

#### `initAll(options)`
Initialize validation for all telephone inputs on the page.

**Parameters:**
- `options` (Object) - Configuration options applied to all inputs

**Returns:** void

#### `isValidPhoneNumber(phoneNumber)`
Validate if a phone number meets minimum requirements.

**Parameters:**
- `phoneNumber` (string) - The phone number to validate

**Returns:** boolean

#### `getNumericValue(phoneNumber)`
Extract only numeric characters from a phone number.

**Parameters:**
- `phoneNumber` (string) - The formatted phone number

**Returns:** string

#### `formatPhoneNumber(value)`
Format a numeric string as a US phone number.

**Parameters:**
- `value` (string) - The numeric phone number string

**Returns:** string

#### `cleanPhoneNumber(value, config)`
Remove non-allowed characters based on configuration.

**Parameters:**
- `value` (string) - The input value to clean
- `config` (Object) - Configuration object

**Returns:** string

## Integration Examples

### With Form Validation

```javascript
document.getElementById('signup-form').addEventListener('submit', (e) => {
    const phoneInput = document.getElementById('phone');
    const phoneValue = phoneInput.value;
    
    if (!phoneInputValidator.isValidPhoneNumber(phoneValue)) {
        e.preventDefault();
        alert('Please enter a valid phone number');
        return false;
    }
    
    // Get clean numeric value for backend
    const numericPhone = phoneInputValidator.getNumericValue(phoneValue);
    console.log('Submitting phone:', numericPhone);
});
```

### With Real-time Validation Feedback

```javascript
const phoneInput = document.getElementById('phone');
const messageDiv = document.getElementById('phone-message');

phoneInputValidator.init(phoneInput, {
    maxLength: 10,
    autoFormat: true
});

phoneInput.addEventListener('input', function() {
    const isValid = phoneInputValidator.isValidPhoneNumber(this.value);
    const numericLength = phoneInputValidator.getNumericValue(this.value).length;
    
    if (this.value === '') {
        messageDiv.textContent = '';
        messageDiv.className = 'phone-validation-message';
    } else if (numericLength < 10) {
        messageDiv.textContent = `Enter ${10 - numericLength} more digits`;
        messageDiv.className = 'phone-validation-message info';
    } else if (isValid) {
        messageDiv.textContent = 'Valid phone number';
        messageDiv.className = 'phone-validation-message success';
    } else {
        messageDiv.textContent = 'Invalid phone number format';
        messageDiv.className = 'phone-validation-message error';
    }
});
```

### With Firebase/Backend Integration

```javascript
// In your form submission handler
const phone = phoneInputValidator.getNumericValue(phoneInput.value);

// Store in Firebase/backend
await setDoc(doc(db, 'users', userId), {
    username: username,
    email: email,
    phone: phone // Clean numeric value
});
```

## Current Project Integration

The phone input validation is already integrated into:

### 1. Signup Form (`src/pages/auth/signup.html`)
- Location: `#phone` input field
- Configuration: Auto-formatting enabled, 15 character limit
- File: `src/js/firebase/auth.js`

### 2. Checkout Form (`src/pages/shopping/checkout.html`)
- Location: `#phone` input field  
- Configuration: Auto-formatting enabled, 15 character limit
- File: `src/js/components/shopping/checkout.js`

## Browser Support

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Mobile**: iOS Safari 12+, Android Chrome 60+
- **Legacy**: Graceful degradation (input still works, just without filtering)

## Performance Considerations

- **Lightweight**: ~8KB minified
- **No Dependencies**: Vanilla JavaScript only
- **Event Delegation**: Efficient event handling
- **Memory Safe**: Proper event cleanup

## Troubleshooting

### Common Issues

**Input not filtering characters:**
- Ensure the input has `type="tel"`
- Check that the initialization is called after DOM load
- Verify no other scripts are interfering with the input

**Auto-formatting not working:**
- Confirm `autoFormat: true` is set in options
- Check that the input has proper focus/blur events

**Paste not being filtered:**
- Modern browsers required for full paste support
- Some mobile browsers may have limited paste event support

**Validation not triggering:**
- Ensure event listeners are properly attached
- Check browser console for JavaScript errors

### Debug Mode

Enable debug logging:

```javascript
// Add this for debugging
phoneInput.addEventListener('keypress', (e) => {
    console.log('Key pressed:', e.key, 'Allowed:', !e.defaultPrevented);
});

phoneInput.addEventListener('input', (e) => {
    console.log('Input value:', e.target.value);
});
```

## Migration Guide

### From Basic Tel Inputs

1. Import the validator module
2. Initialize after DOM load
3. Add CSS for enhanced styling (optional)
4. Update form validation to use validator methods

### From Other Validation Libraries

1. Remove existing phone validation scripts
2. Replace initialization calls with `phoneInputValidator.init()`
3. Update validation checks to use `isValidPhoneNumber()`
4. Update form submission to use `getNumericValue()`

## Best Practices

1. **Always validate on the server side** - Client-side validation is for UX only
2. **Use appropriate maxLength** - 10 for US, 15 for international
3. **Provide clear feedback** - Show validation messages to users
4. **Test on mobile devices** - Ensure touch interactions work properly
5. **Consider accessibility** - Ensure screen readers can understand validation states

## Demo and Testing

Visit the demo page for interactive examples:
- Location: `src/pages/demo/phone-validation-demo.html`
- Features: Multiple input configurations, real-time testing, validation examples