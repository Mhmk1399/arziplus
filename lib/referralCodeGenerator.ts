import User from "@/models/users";

/**
 * Generate a unique referral code for a user
 * Format: 6-8 alphanumeric characters (uppercase)
 */
export async function generateUniqueReferralCode(): Promise<string> {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codeLength = 8;
  let referralCode = "";
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    // Generate random code
    referralCode = "";
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      referralCode += characters[randomIndex];
    }

    // Check if code already exists
    const existingUser = await User.findOne({ referralCode });
    if (!existingUser) {
      isUnique = true;
    }

    attempts++;
  }

  if (!isUnique) {
    // Fallback: use timestamp-based code to ensure uniqueness
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    referralCode = `${timestamp}${randomSuffix}`.substring(0, codeLength);
  }

  return referralCode;
}

/**
 * Ensure user has a referral code, create one if missing
 */
export async function ensureUserHasReferralCode(userId: string): Promise<string> {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error("User not found");
  }

  // If user already has a referral code, return it
  if (user.referralCode) {
    return user.referralCode;
  }

  // Generate new referral code
  const referralCode = await generateUniqueReferralCode();
  
  // Update user with new referral code
  user.referralCode = referralCode;
  await user.save();

  return referralCode;
}

/**
 * Generate referral code based on user info (for better readability)
 * Example: JOHN1234, SARA5678
 */
export async function generateReadableReferralCode(
  firstName?: string,
  lastName?: string
): Promise<string> {
  const characters = "0123456789";
  const numberLength = 4;
  let prefix = "";

  // Create prefix from name if available
  if (firstName) {
    prefix = firstName.substring(0, 4).toUpperCase();
  } else if (lastName) {
    prefix = lastName.substring(0, 4).toUpperCase();
  } else {
    // Fallback to random letters
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 4; i++) {
      prefix += letters[Math.floor(Math.random() * letters.length)];
    }
  }

  // Remove non-ASCII characters (Persian characters)
  prefix = prefix.replace(/[^A-Z]/g, "");
  
  // Ensure prefix is at least 4 characters
  while (prefix.length < 4) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    prefix += letters[Math.floor(Math.random() * letters.length)];
  }

  let referralCode = "";
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 100;

  while (!isUnique && attempts < maxAttempts) {
    // Generate random numbers
    let numbers = "";
    for (let i = 0; i < numberLength; i++) {
      numbers += characters[Math.floor(Math.random() * characters.length)];
    }

    referralCode = `${prefix}${numbers}`;

    // Check if code already exists
    const existingUser = await User.findOne({ referralCode });
    if (!existingUser) {
      isUnique = true;
    }

    attempts++;
  }

  if (!isUnique) {
    // Fallback to fully random code
    return await generateUniqueReferralCode();
  }

  return referralCode;
}

/**
 * Validate referral code format
 */
export function isValidReferralCode(code: string): boolean {
  // Check if code is alphanumeric and between 6-12 characters
  const regex = /^[A-Z0-9]{6,12}$/;
  return regex.test(code);
}
