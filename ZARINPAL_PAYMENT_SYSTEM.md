# 🛒 ZarinPal Payment System - ArziPlus

A comprehensive payment integration system using ZarinPal gateway for the ArziPlus platform. This system provides a complete payment solution with user-friendly interfaces, secure transactions, and detailed payment management.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Payment Flow](#payment-flow)
- [File Structure](#file-structure)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Security Considerations](#security-considerations)
- [Testing](#testing)

## 🌟 Overview

This payment system integrates ZarinPal (Iran's leading payment gateway) with the ArziPlus platform, providing:
- Secure payment processing
- Real-time payment tracking
- Comprehensive payment history
- Multi-currency support (IRR/IRT)
- Admin and user role management
- Responsive Persian/Farsi UI

**Merchant ID**: `8e3cc6e1-a0c8-4090-ba27-890f6c8a4bf0`

## ✨ Features

### 🔐 Security & Authentication
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/User)
- ✅ Secure API endpoints
- ✅ Payment verification system
- ✅ Protection against duplicate payments

### 💳 Payment Processing
- ✅ ZarinPal gateway integration
- ✅ 3-step payment flow (Request → Redirect → Verify)
- ✅ Multiple payment status tracking
- ✅ Automatic payment verification
- ✅ Manual verification support
- ✅ Payment retry functionality

### 📊 Payment Management
- ✅ Complete payment history
- ✅ Advanced filtering and search
- ✅ Payment statistics and analytics
- ✅ Export functionality (CSV)
- ✅ Real-time status checking
- ✅ Receipt generation (Print/Download)

### 🎨 User Interface
- ✅ Persian/Farsi RTL layout
- ✅ Responsive design (Mobile/Desktop)
- ✅ Consistent branding (Orange #FF7A00, Blue #4DBFF0)
- ✅ Loading states and animations
- ✅ Toast notifications
- ✅ Error handling with user-friendly messages

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   ZarinPal      │
│   (Next.js)     │◄──►│   (Next.js)     │◄──►│   Gateway       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Pages   │    │   API Routes    │    │   Payment       │
│   - Dashboard   │    │   - Request     │    │   Processing    │
│   - History     │    │   - Callback    │    │                 │
│   - Status      │    │   - Verify      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Database                             │
│   Collections: payments, users                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Payment Flow

### 1. **Payment Initiation**
```
User → Payment Request Page → Fill Form → Submit
  ↓
API validates input → Creates payment record → Calls ZarinPal API
  ↓
ZarinPal returns Authority code → User redirected to payment gateway
```

### 2. **Payment Processing**
```
User completes payment on ZarinPal → ZarinPal redirects back
  ↓
Callback handler receives Status & Authority → Updates payment record
  ↓
Success: Redirect to success page | Failure: Redirect to failure page
```

### 3. **Payment Verification**
```
Success page → Auto-verify payment → Call ZarinPal verify API
  ↓
Update payment status → Show final receipt → Complete transaction
```

## 📁 File Structure

### Backend Files

#### **1. Database Model**
```typescript
📄 models/payment.ts
```
- **Purpose**: MongoDB schema for payment data
- **Features**: Complete payment tracking, status management, ZarinPal response storage
- **Key Fields**: 
  - `userId`: Reference to user
  - `amount`, `currency`: Payment amount and currency type
  - `status`: Payment status (pending/paid/verified/failed/cancelled/refunded)
  - `authority`: ZarinPal tracking code
  - `refId`, `cardPan`: Payment verification details
  - `createdAt`, `paidAt`, `verifiedAt`: Timestamps

#### **2. ZarinPal Integration**
```typescript
📄 lib/zarinpal.ts
```
- **Purpose**: ZarinPal API integration utility
- **Features**: Payment request, verification, status mapping
- **Merchant ID**: `8e3cc6e1-a0c8-4090-ba27-890f6c8a4bf0`
- **Key Methods**:
  - `requestPayment()`: Initiate payment with ZarinPal
  - `verifyPayment()`: Verify completed payment
  - `getStatusMessage()`: Get localized status messages

#### **3. API Endpoints**

```typescript
📄 app/api/payment/request/route.ts
```
- **Method**: POST
- **Purpose**: Create new payment request
- **Features**: Input validation, duplicate prevention, ZarinPal integration
- **Flow**: Validate → Create DB record → Call ZarinPal → Return payment URL

```typescript
📄 app/api/payment/callback/route.ts
```
- **Method**: GET
- **Purpose**: Handle ZarinPal callback
- **Parameters**: `Authority`, `Status`
- **Flow**: Validate callback → Update payment status → Redirect to result page

```typescript
📄 app/api/payment/verify/route.ts
```
- **Method**: POST
- **Purpose**: Manually verify payment
- **Features**: Duplicate verification prevention, status updates
- **Flow**: Find payment → Call ZarinPal verify → Update status → Return result

```typescript
📄 app/api/payment/history/route.ts
```
- **Methods**: GET (list), POST (single payment)
- **Purpose**: Payment history and statistics
- **Features**: Pagination, filtering, role-based access, aggregation statistics
- **GET Flow**: Apply filters → Paginate results → Calculate stats → Return data
- **POST Flow**: Find specific payment → Return details

### Frontend Pages

#### **1. Payment Dashboard**
```typescript
📄 app/payment/page.tsx
```
- **Route**: `/payment`
- **Purpose**: Main payment hub and overview
- **Features**:
  - Welcome message with user info
  - Payment statistics cards (total amount, successful, failed, pending)
  - Quick action buttons (New Payment, Check Status, History)
  - Recent payments list with status indicators
  - Security notice about ZarinPal
- **Key Components**:
  - Statistics display with icons and colors
  - Action cards with hover effects
  - Recent transactions table
  - Navigation to other payment pages

#### **2. Payment Request**
```typescript
📄 app/payment/request/page.tsx
```
- **Route**: `/payment/request`
- **Purpose**: Create new payment requests
- **Features**:
  - Amount input with IRR/IRT currency toggle
  - Real-time currency conversion display
  - Description field with character counter
  - Optional service ID and order ID fields
  - Form validation with error messages
  - Integration with ZarinPal API
- **Key Components**:
  - Currency selector (IRR/IRT)
  - Amount formatter with Persian numbers
  - Form validation with toast notifications
  - Loading states during submission
  - Direct redirect to ZarinPal gateway

#### **3. Payment Success**
```typescript
📄 app/payment/success/page.tsx
```
- **Route**: `/payment/success`
- **Purpose**: Display successful payment details
- **Features**:
  - Payment confirmation with green checkmark animation
  - Complete payment details (amount, tracking codes, card info)
  - Auto-verification of paid transactions
  - Receipt generation (print and download)
  - Action buttons (print, download, history, home)
  - Copy-to-clipboard functionality for tracking codes
- **Key Components**:
  - Success animation and status display
  - Payment details table with copy buttons
  - Receipt generation (text and print formats)
  - Navigation buttons to other sections
  - Support information section

#### **4. Payment Failed**
```typescript
📄 app/payment/failed/page.tsx
```
- **Route**: `/payment/failed`
- **Purpose**: Handle failed payments
- **Features**:
  - Failed payment details with red error indicators
  - Failure reason explanation based on status codes
  - List of possible failure causes
  - Retry payment functionality
  - Support contact information
  - Tips for successful payments
- **Key Components**:
  - Error status display with appropriate icons
  - Failure reason mapping (NOK, cancel, error, timeout)
  - Retry button with preserved payment details
  - Support contact cards
  - Helpful tips section

#### **5. Payment History**
```typescript
📄 app/payment/history/page.tsx
```
- **Route**: `/payment/history`
- **Purpose**: Complete payment management
- **Features**:
  - Comprehensive payment statistics dashboard
  - Advanced filtering (status, date range, search)
  - Paginated payment list with sorting
  - Export functionality to CSV
  - Individual payment actions (view details)
  - Real-time status updates
- **Key Components**:
  - Statistics cards with payment metrics
  - Advanced filter panel with date pickers
  - Sortable and paginated data table
  - Export and download functionality
  - Status badges with color coding
  - Pagination with page controls

#### **6. Payment Status Checker**
```typescript
📄 app/payment/status/page.tsx
```
- **Route**: `/payment/status`
- **Purpose**: Check payment status by tracking code
- **Features**:
  - Authority code input with validation
  - Real-time payment status lookup
  - Detailed payment information display
  - Manual verification option for paid transactions
  - Status-specific color coding and animations
  - Quick actions based on payment status
- **Key Components**:
  - Search form with authority code validation
  - Status display with appropriate colors and icons
  - Payment details panel with copy functionality
  - Action buttons based on payment state
  - Help section with tracking code information

## 🔌 API Endpoints

### Payment Request
```http
POST /api/payment/request
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "amount": 100000,
  "currency": "IRR",
  "description": "Payment for service",
  "serviceId": "optional",
  "orderId": "optional"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://www.zarinpal.com/pg/StartPay/...",
    "authority": "A00000000000000000000000000123456789",
    "paymentId": "64f7b1c2e5a8f9d123456789"
  }
}
```

### Payment Callback
```http
GET /api/payment/callback?Authority=<CODE>&Status=<OK|NOK>
```

**Redirects to:**
- Success: `/payment/success?Authority=<CODE>`
- Failed: `/payment/failed?Authority=<CODE>&Status=<STATUS>`

### Payment Verification
```http
POST /api/payment/verify
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "authority": "A00000000000000000000000000123456789"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "verified",
    "refId": 123456789,
    "cardPan": "1234",
    "amount": 100000
  }
}
```

### Payment History
```http
GET /api/payment/history?page=1&limit=10&status=verified
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalPayments": 47,
      "limit": 10
    },
    "statistics": {
      "totalAmount": 5000000,
      "successfulPayments": 42,
      "failedPayments": 3,
      "pendingPayments": 2
    }
  }
}
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB database
- ZarinPal merchant account

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/arziplus

# Authentication
JWT_SECRET=your_jwt_secret_key

# ZarinPal Configuration
ZARINPAL_MERCHANT_ID=8e3cc6e1-a0c8-4090-ba27-890f6c8a4bf0
ZARINPAL_SANDBOX=false  # true for testing

# Application URLs
NEXTAUTH_URL=http://localhost:3000
CALLBACK_URL=http://localhost:3000/api/payment/callback
```

### 3. Database Setup
The payment model will be automatically created when first used. Ensure MongoDB is running and accessible.

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

### 5. Build for Production
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## ⚙️ Configuration

### ZarinPal Settings
```typescript
// lib/zarinpal.ts
const MERCHANT_ID = '8e3cc6e1-a0c8-4090-ba27-890f6c8a4bf0';
const ZARINPAL_REQUEST_URL = 'https://api.zarinpal.com/pg/v4/payment/request.json';
const ZARINPAL_VERIFY_URL = 'https://api.zarinpal.com/pg/v4/payment/verify.json';
const ZARINPAL_GATEWAY_URL = 'https://www.zarinpal.com/pg/StartPay/';
```

### Payment Status Configuration
```typescript
// Payment statuses supported
type PaymentStatus = 
  | 'pending'    // Initial state
  | 'paid'       // Payment completed at ZarinPal
  | 'verified'   // Payment verified by our system
  | 'failed'     // Payment failed
  | 'cancelled'  // Payment cancelled by user
  | 'refunded'   // Payment refunded
```

### Currency Configuration
```typescript
// Supported currencies
type Currency = 'IRR' | 'IRT';  // Iranian Rial | Iranian Toman
// 1 Toman = 10 Rials
```

## 💡 Usage Examples

### Creating a Payment Request
```typescript
// Frontend component
const handlePayment = async () => {
  const paymentData = {
    amount: 50000,
    currency: 'IRR',
    description: 'خرید محصول آرزی پلاس',
    serviceId: 'SERVICE_123'
  };

  const response = await fetch('/api/payment/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(paymentData)
  });

  const result = await response.json();
  
  if (result.success) {
    // Redirect to ZarinPal
    window.location.href = result.data.paymentUrl;
  }
};
```

### Checking Payment Status
```typescript
// Check payment by authority code
const checkPayment = async (authority: string) => {
  const response = await fetch('/api/payment/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ authority })
  });

  const result = await response.json();
  return result.data; // Payment details
};
```

### Manual Verification
```typescript
// Verify a paid payment
const verifyPayment = async (authority: string) => {
  const response = await fetch('/api/payment/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ authority })
  });

  const result = await response.json();
  return result.data; // Verification result
};
```

## 🛠️ Error Handling

### Common Error Codes
- `INVALID_AMOUNT`: Amount is invalid or below minimum
- `PAYMENT_NOT_FOUND`: Payment record not found
- `ALREADY_VERIFIED`: Payment already verified
- `VERIFICATION_FAILED`: ZarinPal verification failed
- `UNAUTHORIZED`: Invalid or missing authentication token

### Error Response Format
```json
{
  "success": false,
  "error": "Error message in Persian/English",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  }
}
```

### Frontend Error Handling
```typescript
try {
  const response = await fetch('/api/payment/request', options);
  const result = await response.json();
  
  if (!response.ok || !result.success) {
    showToast.error(result.error || 'خطا در پردازش درخواست');
    return;
  }
  
  // Handle success
} catch (error) {
  showToast.error('خطا در اتصال به سرور');
}
```

## 🔐 Security Considerations

### Authentication
- All payment endpoints require valid JWT token
- User authorization checked for each request
- Admin users can view all payments, regular users only their own

### Payment Security
- Payment amounts validated server-side
- Authority codes validated against database
- Duplicate payment prevention
- ZarinPal verification required for final confirmation

### Data Protection
- Sensitive payment data encrypted in database
- Card information (PAN) partially masked in responses
- Audit logging for all payment operations
- HTTPS required for all payment operations

## 🧪 Testing

### Unit Tests
```bash
# Run payment model tests
npm test models/payment

# Run ZarinPal utility tests
npm test lib/zarinpal

# Run API endpoint tests
npm test api/payment
```

### Integration Testing
```bash
# Test complete payment flow
npm test integration/payment-flow

# Test ZarinPal integration
npm test integration/zarinpal
```

### Manual Testing Checklist

#### Payment Request
- [ ] Valid amount submission
- [ ] Invalid amount handling
- [ ] Currency conversion display
- [ ] Form validation errors
- [ ] Authentication required

#### Payment Callback
- [ ] Successful payment callback
- [ ] Failed payment callback
- [ ] Invalid authority handling
- [ ] Status parameter validation

#### Payment Verification
- [ ] Successful verification
- [ ] Already verified handling
- [ ] Invalid authority handling
- [ ] ZarinPal API errors

#### Payment History
- [ ] Pagination functionality
- [ ] Filter and search
- [ ] Export functionality
- [ ] Role-based access
- [ ] Statistics calculation

## 📊 Monitoring & Analytics

### Key Metrics to Monitor
- Payment success rate
- Average payment amount
- Failed payment reasons
- Payment processing time
- User payment patterns

### Logging
- All payment requests logged with user ID
- ZarinPal API calls logged with response codes
- Payment status changes tracked with timestamps
- Error conditions logged with context

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript strict mode
2. Use Persian/Farsi for user-facing text
3. Maintain RTL layout consistency
4. Add proper error handling
5. Include loading states
6. Write unit tests for new features

### Code Style
- Use ESLint and Prettier configurations
- Follow Next.js 13+ app directory structure
- Use Tailwind CSS for styling
- Maintain consistent component structure

## 📞 Support & Contact

### Technical Support
- **Developer**: Mhmk1399
- **Repository**: arziplus
- **Branch**: main

### ZarinPal Support
- **Merchant ID**: 8e3cc6e1-a0c8-4090-ba27-890f6c8a4bf0
- **Documentation**: https://docs.zarinpal.com/
- **Support**: https://www.zarinpal.com/contact

---

## 📄 License

This project is part of the ArziPlus platform. All rights reserved.

---

*Last updated: October 14, 2025*
*Version: 1.0.0*
*Payment System Status: ✅ Production Ready*