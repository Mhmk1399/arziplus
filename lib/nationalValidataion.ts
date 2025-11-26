/**
 * Shahkar API Service for National ID and Mobile Number Verification
 * Uses api.ir Shahkar Lite endpoint
 */

interface ShahkarLiteRequest {
  nationalCode: string;
  mobile: string;
}

interface ShahkarLiteResponse {
  data: boolean;
  success: boolean;
  code: number;
  error: string | null;
  message: string | null;
}

/**
 * Verify if a national code matches with a mobile number using Shahkar Lite API
 * @param nationalCode - Iranian national code (10 digits)
 * @param mobile - Mobile number in format 09xxxxxxxxx
 * @returns Promise<boolean> - true if match, false otherwise
 */
export async function verifyNationalCodeWithMobile(
  nationalCode: string,
  mobile: string
): Promise<boolean> {
  try {
    // Validate input format
    if (!nationalCode || !mobile) {
      console.error("❌ Shahkar: National code and mobile are required");
      return false;
    }

    // Validate national code format (10 digits)
    if (!/^\d{10}$/.test(nationalCode)) {
      console.error("❌ Shahkar: Invalid national code format. Must be 10 digits");
      return false;
    }

    // Validate mobile format (09xxxxxxxxx)
    if (!/^09\d{9}$/.test(mobile)) {
      console.error("❌ Shahkar: Invalid mobile format. Must be 09xxxxxxxxx");
      return false;
    }

    const apiToken = process.env.API_IR_TOKEN;
    if (!apiToken) {
      console.error("❌ Shahkar: API_IR_TOKEN not found in environment variables");
      return false;
    }

    console.log("🔍 Shahkar: Verifying", {
      nationalCode,
      mobile,
      timestamp: new Date().toISOString(),
    });

    const requestBody: ShahkarLiteRequest = {
      nationalCode,
      mobile,
    };

    const response = await fetch("https://s.api.ir/api/sw1/ShahkarLite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiToken,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("❌ Shahkar API Error:", {
        status: response.status,
        statusText: response.statusText,
      });
      return false;
    }

    const result: ShahkarLiteResponse = await response.json();

    console.log("📊 Shahkar Response:", {
      success: result.success,
      data: result.data,
      code: result.code,
      error: result.error,
      message: result.message,
    });

    // Return the verification result
    if (result.success && result.data === true) {
      console.log("✅ Shahkar: Verification successful - National code matches mobile");
      return true;
    } else {
      console.log("❌ Shahkar: Verification failed - National code does not match mobile");
      return false;
    }
  } catch (error) {
    console.error("❌ Shahkar: Error during verification:", error);
    return false;
  }
}

/**
 * Verify if a national code matches with a mobile number using full Shahkar API (encrypted)
 * @param nationalCode - Iranian national code (10 digits) or company national ID
 * @param mobile - Mobile number in format 09xxxxxxxxx
 * @param isCompany - Whether this is a company (default: false)
 * @returns Promise<boolean> - true if match, false otherwise
 */
export async function verifyNationalCodeWithMobileFull(
  nationalCode: string,
  mobile: string,
  isCompany: boolean = false
): Promise<boolean> {
  try {
    // Validate input format
    if (!nationalCode || !mobile) {
      console.error("❌ Shahkar Full: National code and mobile are required");
      return false;
    }

    // Validate national code format
    if (!isCompany && !/^\d{10}$/.test(nationalCode)) {
      console.error("❌ Shahkar Full: Invalid national code format. Must be 10 digits");
      return false;
    }

    // Validate mobile format (09xxxxxxxxx)
    if (!/^09\d{9}$/.test(mobile)) {
      console.error("❌ Shahkar Full: Invalid mobile format. Must be 09xxxxxxxxx");
      return false;
    }

    const apiToken = process.env.API_IR_TOKEN;
    if (!apiToken) {
      console.error("❌ Shahkar Full: API_IR_TOKEN not found in environment variables");
      return false;
    }

    console.log("🔍 Shahkar Full: Verifying", {
      nationalCode,
      mobile,
      isCompany,
      timestamp: new Date().toISOString(),
    });

    const requestBody = {
      nationalCode,
      mobile,
      isCompany,
    };

    const response = await fetch("https://s.api.ir/api/sw1/Shahkar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiToken,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("❌ Shahkar Full API Error:", {
        status: response.status,
        statusText: response.statusText,
      });
      return false;
    }

    const result: ShahkarLiteResponse = await response.json();

    console.log("📊 Shahkar Full Response:", {
      success: result.success,
      data: result.data,
      code: result.code,
      error: result.error,
      message: result.message,
    });

    // Return the verification result
    if (result.success && result.data === true) {
      console.log("✅ Shahkar Full: Verification successful");
      return true;
    } else {
      console.log("❌ Shahkar Full: Verification failed");
      return false;
    }
  } catch (error) {
    console.error("❌ Shahkar Full: Error during verification:", error);
    return false;
  }
}
