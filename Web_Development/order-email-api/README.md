# Order Email API

A Node.js API for sending order confirmation emails using Nodemailer. This API is designed to be deployed on Vercel.

## Features

- Sends beautifully formatted order confirmation emails
- Uses Gmail SMTP for reliable email delivery
- Includes order details, shipping information, and order summary
- CORS enabled for cross-origin requests
- Health check endpoint for monitoring

## Prerequisites

- Node.js 18 or higher
- A Gmail account
- Vercel account for deployment

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Configure your Gmail account:
   - Enable 2-factor authentication
   - Generate an App Password (Google Account → Security → App Passwords)
   - Use this App Password in your `.env` file

## Environment Variables

Create a `.env` file with the following variables:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
PORT=3000
```

## Local Development

Run the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Send Order Confirmation Email

```
POST /api/send-order-email
```

Request body:
```json
{
  "orderData": {
    "customer": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "address": "123 Main St",
      "city": "New York",
      "town": "Manhattan",
      "phone": "+1234567890"
    },
    "items": [
      {
        "name": "Product Name",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "summary": {
      "subtotal": 59.98,
      "shipping": 10.00,
      "tax": 8.40,
      "total": 78.38
    }
  }
}
```

### Health Check

```
GET /api/health
```

## Deployment to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add the environment variables from your `.env` file

## Security Notes

- Never commit your `.env` file
- Use environment variables in production
- Keep your Gmail App Password secure
- Enable CORS only for trusted domains

## License

MIT 