# Multi-Step Verification Form Implementation

## Overview
Implemented a comprehensive multi-step verification form that integrates Shahkar API for national ID verification, SMS OTP verification, and profile completion.

## Components Created

### 1. MultiStepVerification.tsx
**Location:** `components/customerAdmins/credintials/MultiStepVerification.tsx`

**Features:**
- **Step 1: Shahkar Verification**
  - National code input (10 digits with checksum validation)
  - Mobile number input (09xxxxxxxxx format)
  - Calls Shahkar API to verify if national code matches mobile number
  - Shows success modal on verification
  - Automatically proceeds to OTP step

- **Step 2: OTP Verification**
  - Receives 5-digit verification code
  - 2-minute countdown timer for resend
  - Option to go back and change phone number
  - Verifies code via SMS verification API

- **Step 3: Profile Completion**
  - First name and last name input
  - Shows verified national code and phone number
  - Saves data and sets credentials to "accepted" status
  - Auto-reloads page to refresh user data

**Props:**
```typescript
interface MultiStepVerificationProps {
  initialPhone?: string;
  initialNationalNumber?: string;
  onComplete?: () => void;
}
```

### 2. API Endpoints

#### `/api/verification/shahkar-verify` (POST)
**Location:** `app/api/verification/shahkar-verify/route.ts`

**Purpose:** Verifies national code matches mobile number using Shahkar API

**Request Body:**
```json
{
  "nationalCode": "0440814073",
  "phoneNumber": "09015528276"
}
```

**Response (Success):**
```json
{
  "verified": true,
  "message": "کد ملی و شماره موبایل با هم مطابقت دارند"
}
```

**Response (Failed):**
```json
{
  "verified": false,
  "error": "کد ملی و شماره موبایل با هم مطابقت ندارند"
}
```

#### `/api/verification/complete-profile` (POST)
**Location:** `app/api/verification/complete-profile/route.ts`

**Purpose:** Completes user profile after successful verification

**Request Body:**
```json
{
  "firstName": "علی",
  "lastName": "رضایی",
  "nationalNumber": "0440814073",
  "phoneNumber": "09015528276"
}
```

**What it does:**
- Updates `nationalCredentials` with firstName, lastName, nationalNumber
- Sets `nationalCredentials.status` to "accepted"
- Sets `verifications.phone.isVerified` to true
- Sets `verifications.phone.verifiedAt` to current date
- Updates `contactInfo.mobilePhone` if needed
- Sets user `status` to "active"
- Returns updated user data

### 3. Dashboard Integration
**Location:** `app/dashboard/page.tsx`

**Changes:**
- Imported `MultiStepVerification` component
- Modified the "nationalCredentials" menu item to conditionally render:
  - **IF** user hasn't completed verification (no firstName/lastName or phone not verified):
    → Show `MultiStepVerification` component
  - **ELSE** (verification complete):
    → Show original `NationalCredentials` component for image uploads

**Logic:**
```typescript
const hasCompletedVerification = !!(
  userData?.nationalCredentials?.firstName &&
  userData?.nationalCredentials?.lastName &&
  userData?.nationalCredentials?.nationalNumber &&
  userData?.verificationStatus?.phone?.isVerified
);
```

## Workflow

### User Journey:
```
1. User opens dashboard → Goes to "مدارک هویتی"
   ↓
2. System checks if user has completed verification
   ↓
3a. NOT VERIFIED:
   ├─ Shows MultiStepVerification form
   ├─ Step 1: Enter national code + phone → Shahkar verification
   ├─ Step 2: Receive OTP → Verify SMS code
   ├─ Step 3: Enter names → Complete profile
   └─ Success: Phone verified ✓, National credentials accepted ✓
   
3b. ALREADY VERIFIED:
   └─ Shows NationalCredentials form for uploading card images
```

## Database Changes

### User Model Updates (Automatic):
When verification completes, the following fields are updated:

```javascript
{
  nationalCredentials: {
    firstName: "علی",
    lastName: "رضایی",
    nationalNumber: "0440814073",
    status: "accepted", // ← Automatically set
    nationalCardImageUrl: "",
    verificationImageUrl: ""
  },
  verifications: {
    phone: {
      isVerified: true, // ← Set to true
      verifiedAt: new Date(), // ← Current timestamp
      verificationCode: undefined,
      verificationCodeExpires: undefined
    }
  },
  contactInfo: {
    mobilePhone: "09015528276" // ← Updated if changed
  },
  status: "active" // ← Changed from pending_verification
}
```

## Benefits

✅ **Security:** Shahkar government API ensures national code matches mobile number
✅ **User Experience:** Clean 3-step process with visual progress indicator
✅ **Automatic Approval:** No admin intervention needed for basic verification
✅ **SMS Verification:** Ensures phone number ownership
✅ **Data Integrity:** Validates all input formats (national code checksum, phone format)
✅ **Error Handling:** Comprehensive error messages in Persian
✅ **Auto-reload:** Page refreshes after completion to show updated data

## Testing

### Test with your data:
```
National Code: 0440814073
Phone Number: 09015528276
```

### Expected Flow:
1. Enter national code and phone → Click "تایید و ادامه"
2. Shahkar API verifies → Shows success modal
3. SMS code sent → Enter 5-digit code
4. Enter first name and last name → Click "ثبت نهایی اطلاعات"
5. Success message → Page reloads
6. User can now upload card images

## Files Modified/Created

### Created:
- `components/customerAdmins/credintials/MultiStepVerification.tsx`
- `app/api/verification/shahkar-verify/route.ts`
- `app/api/verification/complete-profile/route.ts`

### Modified:
- `app/dashboard/page.tsx` (added conditional rendering logic)

## Integration with Existing System

The new system integrates seamlessly with:
- ✅ Existing SMS verification (`/api/auth/send-sms`, `/api/auth/verify-sms`)
- ✅ Shahkar API service (`lib/nationalValidataion.ts`)
- ✅ User model (`models/users.ts`)
- ✅ Dashboard credential flow
- ✅ Service validation requirements (`validationeneed` field)

## Next Steps

After this verification:
1. ✅ Phone number is verified
2. ✅ National credentials status is "accepted"
3. User can upload card images (if needed for specific services)
4. User can order services that require `validationeneed: true`
