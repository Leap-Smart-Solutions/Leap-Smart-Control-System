# Phone Verification System Documentation

## Overview

This phone verification system integrates WhatsApp OTP (One-Time Password) verification into the authentication flow using the WhatsApp OTP API service hosted at `https://whatsapp-otp-production.up.railway.app`.

## Features

- **WhatsApp OTP Integration**: Send verification codes via WhatsApp messages
- **Seamless Authentication Flow**: Integrates with existing email verification
- **Real-time Verification**: Instant OTP verification via API or WhatsApp reply
- **User-friendly Interface**: Clean UI for phone verification process
- **Error Handling**: Comprehensive error handling and user feedback
- **Testing Tools**: Built-in test page for debugging

## Architecture

### Components

1. **phoneVerification.js** - Core service for API communication
2. **emailVerificationChecker.js** - Monitors email verification status
3. **auth.js** - Enhanced with phone verification logic
4. **verify-phone.html** - Phone verification UI page
5. **test-phone-verification.html** - Testing and debugging page

### Authentication Flow

```
User Signup → Email Verification → Phone Verification → Profile Access
     ↓              ↓                      ↓               ↓
  Store phone    Check email          Send WhatsApp      Complete
  in Firestore   verification         OTP code          registration
```

## Integration Points

### 1. Signup Process (`auth.js`)

```javascript
// After successful signup, phone number is stored for verification
sessionStorage.setItem('pendingPhoneVerification', phone);
window.location.assign("../../pages/auth/verify-email.html");
```

### 2. Email Verification (`verify-email.html`)

- User verifies email first
- System checks verification status automatically
- Enables "Continue to Phone Verification" button when email is verified

### 3. Phone Verification (`verify-phone.html`)

- Automatically sends OTP when page loads
- User enters 6-digit verification code
- Verifies code against WhatsApp OTP API
- Updates Firestore with verification status

### 4. Login Process

- Checks if phone verification is complete
- Redirects to phone verification if pending
- Allows profile access if fully verified

## API Endpoints

### WhatsApp OTP Service

**Base URL**: `https://whatsapp-otp-production.up.railway.app`

#### Send OTP
```http
POST /send-otp
Content-Type: application/json

{
  "phoneNumber": "201234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "phoneNumber": "201234567890@c.us"
}
```

#### Verify OTP
```http
POST /verify-otp
Content-Type: application/json

{
  "phoneNumber": "201234567890",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

#### Check Service Status
```http
GET /status
```

**Response:**
```json
{
  "clientReady": true,
  "qrAvailable": false
}
```

## Usage Examples

### Basic Phone Verification

```javascript
import phoneVerificationService from "./phoneVerification.js";

// Send OTP
const result = await phoneVerificationService.sendOTP("201234567890");
if (result.success) {
  console.log("OTP sent successfully");
}

// Verify OTP
const verification = await phoneVerificationService.verifyOTP("201234567890", "123456");
if (verification.success) {
  console.log("Phone verified!");
}
```

### Validation

```javascript
// Validate phone number format
const phoneValidation = phoneVerificationService.validatePhoneNumber("+20 123 456 7890");
if (!phoneValidation.valid) {
  alert(phoneValidation.message);
}

// Validate OTP format
const otpValidation = phoneVerificationService.validateOTP("123456");
if (!otpValidation.valid) {
  alert(otpValidation.message);
}
```

## Phone Number Format

### Supported Formats

- International format: `201234567890` (country code + number)
- With plus sign: `+201234567890`
- With spaces/dashes: `+20 123 456 7890` or `+20-123-456-7890`

### Processing

The system automatically:
- Removes all non-digit characters
- Validates length (10-15 digits)
- Formats for API compatibility

## Error Handling

### Common Error Scenarios

1. **Service Unavailable**
   - WhatsApp client not connected
   - Network connectivity issues
   - API service downtime

2. **Invalid Phone Number**
   - Incorrect format
   - Non-existent number
   - Unsupported country code

3. **OTP Issues**
   - Expired OTP (5-minute timeout)
   - Invalid code format
   - Multiple failed attempts

### Error Messages

```javascript
// Service errors
"WhatsApp service is not connected"
"Failed to send WhatsApp message"
"Unable to connect to verification service"

// Validation errors
"Phone number must be at least 10 digits"
"Phone number cannot exceed 15 digits"
"OTP must be exactly 6 digits"

// Verification errors
"Invalid OTP or expired"
"Phone number not found"
```

## Testing

### Test Page Usage

1. Navigate to `/pages/test-phone-verification.html`
2. Check service status
3. Enter phone number and send OTP
4. Check WhatsApp for verification code
5. Enter code and verify

### Test Phone Numbers

For testing purposes, use:
- Format: `[country_code][phone_number]`
- Example: `201234567890` (Egypt)
- Example: `1234567890` (US - may need country code)

### Manual Testing Steps

1. **Complete Signup Flow**
   ```
   1. Register new account
   2. Verify email
   3. Check phone verification redirect
   4. Complete phone verification
   5. Access profile
   ```

2. **Login Flow Testing**
   ```
   1. Login with verified account
   2. Check direct profile access
   3. Login with unverified phone
   4. Check phone verification redirect
   ```

## Firestore Integration

### User Document Structure

```javascript
{
  username: "johndoe",
  email: "john@example.com",
  phone: "+201234567890",
  phoneVerified: true,
  phoneVerifiedAt: "2024-01-15T10:30:00.000Z"
}
```

### Database Operations

```javascript
// Update verification status
await setDoc(doc(db, 'users', user.uid), {
  phoneVerified: true,
  phoneVerifiedAt: new Date().toISOString()
}, { merge: true });

// Check verification status
const userDoc = await getDoc(doc(db, 'users', user.uid));
const isPhoneVerified = userDoc.data()?.phoneVerified || false;
```

## Security Considerations

1. **OTP Expiration**: Codes expire after 5 minutes
2. **Session Storage**: Phone numbers stored temporarily in sessionStorage
3. **API Communication**: HTTPS-only communication with OTP service
4. **No Local Storage**: OTP codes never stored locally
5. **Firestore Rules**: Ensure proper read/write permissions

## Troubleshooting

### Common Issues

**OTP Not Received**
- Check phone number format
- Verify WhatsApp is installed and active
- Check service status via test page

**Verification Fails**
- Ensure OTP is entered within 5-minute window
- Check for typos in OTP code
- Verify phone number matches sent number

**Service Unavailable**
- Check internet connection
- Verify API service status
- Check browser console for errors

### Debug Mode

Enable console logging by uncommenting debug lines in `phoneVerification.js`:

```javascript
console.log("Sending OTP to:", formattedNumber);
console.log("API Response:", data);
```

## Configuration

### Environment Variables

The phone verification service may require configuration for:
- API endpoints
- Timeout values
- Retry attempts
- Rate limiting

### Customization

You can customize:
- OTP message format (API side)
- UI styling in `signup.css`
- Validation rules in `phoneVerification.js`
- Redirect flows in `auth.js`

## Dependencies

- Firebase Auth
- Firebase Firestore
- WhatsApp OTP API service
- ES6 Modules support

## Browser Support

- Modern browsers with ES6 module support
- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 16+