# Leap Smart Invoice API

This API handles sending order invoice emails to customers after they place an order.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

Note: For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an App Password (Google Account > Security > App Passwords)
3. Use that App Password in the EMAIL_PASSWORD variable

## Running the API

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### POST /api/send-order-email
Sends an invoice email to the customer.

Request body:
```json
{
  "orderData": {
    "orderId": "string",
    "customer": {
      "fullName": "string",
      "email": "string",
      "address": "string",
      "city": "string",
      "town": "string"
    },
    "items": [
      {
        "name": "string",
        "quantity": "number",
        "price": "number"
      }
    ],
    "summary": {
      "subtotal": "number",
      "shipping": "number",
      "tax": "number",
      "total": "number"
    }
  }
}
```

Response:
```json
{
  "message": "Invoice email sent successfully"
}
``` 