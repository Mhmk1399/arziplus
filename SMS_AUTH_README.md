# SMS Authentication System

## Overview
A complete SMS-based authentication system using SMS.ir for phone verification with automatic user detection and registration.

## Features

### 🔐 Authentication Flow
- **Phone Input**: Users enter their phone number
- **Auto Detection**: System checks if phone exists in database
- **Smart Registration**: 
  - Existing users → Login flow
  - New users → Auto-registration with phone only
- **SMS Verification**: 6-digit code sent via SMS.ir
- **JWT Authentication**: Secure token-based session management

### 📱 User Experience
- **Responsive Design**: Beautiful UI with Persian/Farsi support
- **Real-time Feedback**: Toast notifications for all actions
- **Countdown Timer**: SMS resend functionality with 2-minute cooldown
- **Progressive Profile**: Optional profile completion after verification

### 🏗️ Architecture
- **Next.js 13+ App Router**: Modern React framework
- **MongoDB with Mongoose**: Robust user model with organized data sections
- **SMS.ir Integration**: Iranian SMS service for reliable delivery
- **JWT Tokens**: Secure authentication with role-based access

## API Endpoints

### Authentication
- `POST /api/auth/send-sms` - Send verification code
- `POST /api/auth/verify-sms` - Verify code and authenticate
- `GET /api/auth/me` - Get current user data
- `POST /api/auth/complete-profile` - Update user profile

## Pages

### User-Facing
- `/auth/sms` - Main authentication page
- `/admin` - Admin panel dashboard
- `/complete-profile` - Profile completion form

## Environment Variables Required

```bash
SMS_IR_API_KEY=your_api_key
SMS_IR_LINE_NUMBER=your_line_number  
SMS_IR_TEMPLATE_ID=your_template_id
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_uri
```

## Usage Instructions

### 1. Setup Environment
1. Copy `.env.example` to `.env.local`
2. Fill in your SMS.ir credentials
3. Set MongoDB URI and JWT secret

### 2. SMS.ir Template Setup
Create a verification template in SMS.ir dashboard with:
- Template content: "کد تایید شما: {CODE}"
- Variable name: "CODE"

### 3. Authentication Flow
1. User visits `/auth/sms`
2. Enters phone number (09XXXXXXXXX format)
3. Receives SMS with 6-digit code
4. Enters verification code
5. Automatically redirected to:
   - `/admin` - If profile is complete
   - `/complete-profile` - If profile needs completion

### 4. Database Schema
The system uses the existing robust user model with:
- `contactInfo.mobilePhone` - User's phone number
- `nationalCredentials` - Name and identity info
- `verifications.phone` - Phone verification status
- `roles` - User permissions array
- `status` - Account status

## Security Features
- Phone number format validation
- Verification code expiration (5 minutes)
- JWT token expiration (7 days)
- Secure password hashing (if passwords used)
- Role-based access control

## Testing the Flow
1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000/auth/sms`
3. Enter a valid Iranian phone number (09XXXXXXXXX)
4. Check your phone for the SMS code
5. Enter the code to complete authentication
6. You'll be redirected to the appropriate panel

## Customization
- Modify UI components in `/app/auth/sms/page.tsx`
- Adjust user model in `/models/users.ts`
- Update SMS templates in SMS.ir dashboard
- Customize admin panel in `/app/admin/page.tsx`