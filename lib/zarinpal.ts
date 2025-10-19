// Production ZarinPal Configuration
const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID;
const ZARINPAL_REQUEST_URL =
  "https://payment.zarinpal.com/pg/v4/payment/request.json";
const ZARINPAL_VERIFY_URL =
  "https://payment.zarinpal.com/pg/v4/payment/verify.json";
const ZARINPAL_GATEWAY_URL = "https://payment.zarinpal.com/pg/StartPay/";

export interface PaymentRequestData {
  amount: number;
  description: string;
  callback_url: string;
  currency?: "IRT";
  metadata?: {
    mobile?: string;
    email?: string;
    order_id?: string;
  };
}

export interface PaymentRequestResponse {
  data: {
    code: number;
    message: string;
    authority: string;
    fee_type: string;
    fee: number;
  };
  errors: string[];
}

export interface PaymentVerifyData {
  amount: number;
  authority: string;
}

export interface PaymentVerifyResponse {
  data: {
    code: number;
    message: string;
    card_hash?: string;
    card_pan?: string;
    ref_id?: number;
    fee_type?: string;
    fee?: number;
  };
  errors: string[];
}

export class ZarinPal {
  static async requestPayment(
    data: PaymentRequestData
  ): Promise<PaymentRequestResponse> {
    try {
      // Validate merchant ID
      if (!ZARINPAL_MERCHANT_ID) {
        throw new Error("ZARINPAL_MERCHANT_ID environment variable is not set");
      }

      const requestData = {
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount: data.amount,
        description: data.description,
        callback_url: data.callback_url,
        currency: data.currency || "IRT",
        metadata: data.metadata || {},
      };

      console.log("ZarinPal Request:", {
        url: ZARINPAL_REQUEST_URL,
        merchantId: ZARINPAL_MERCHANT_ID
          ? `${ZARINPAL_MERCHANT_ID.substring(0, 8)}...`
          : "NOT_SET",
        amount: requestData.amount,
        currency: requestData.currency,
        environment: "production",
      });

      const response = await fetch(ZARINPAL_REQUEST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      console.log("ZarinPal Response:", {
        status: response.status,
        statusText: response.statusText,
        data: result,
      });

      if (!response.ok) {
        throw new Error(
          `ZarinPal request failed: ${result.message || response.statusText}`
        );
      }

      // Additional validation for authority format
      if (result.data && result.data.authority) {
        const authority = result.data.authority;
        const actualPrefix = authority.charAt(0);

        if (actualPrefix !== "A") {
          console.warn(
            `⚠️ Authority should start with 'A' for production, but got '${actualPrefix}'.`
          );
        }
      }

      return result;
    } catch (error) {
      console.error("ZarinPal request error:", error);
      throw error;
    }
  }

  static async verifyPayment(
    data: PaymentVerifyData
  ): Promise<PaymentVerifyResponse> {
    try {
      // Validate merchant ID
      if (!ZARINPAL_MERCHANT_ID) {
        throw new Error("ZARINPAL_MERCHANT_ID environment variable is not set");
      }

      const verifyData = {
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount: data.amount,
        authority: data.authority,
      };

      const response = await fetch(ZARINPAL_VERIFY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(verifyData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          `ZarinPal verify failed: ${result.message || response.statusText}`
        );
      }

      return result;
    } catch (error) {
      console.error("ZarinPal verify error:", error);
      throw error;
    }
  }

  static getPaymentUrl(authority: string): string {
    // Validate authority format for production
    const isValidAuthority = authority.startsWith("A");

    console.log("Authority Validation:", {
      authority: authority.substring(0, 10) + "...",
      isValid: isValidAuthority,
      environment: "production",
      gatewayUrl: ZARINPAL_GATEWAY_URL,
    });

    // Warn if authority doesn't start with 'A' for production
    if (!isValidAuthority) {
      console.warn('⚠️ Warning: Production authorities should start with "A"');
    }

    return `${ZARINPAL_GATEWAY_URL}${authority}`;
  }

  static formatAmount(amount: number): string {
    return `${amount.toLocaleString("fa-IR")} تومان`;
  }

  static getStatusMessage(code: number): string {
    const messages: { [key: number]: string } = {
      100: "تراکنش موفق",
      101: "تراکنش وریفای شده",
      102: "merchant یافت نشد",
      103: "merchant غیرفعال",
      104: "merchant نامعتبر",
      105: "amount بایستی بزرگتر از 1,000 ریال باشد",
      106: "callbackUrl نامعتبر می‌باشد. (شروع با http و یا https)",
      107: "شما به این متد دسترسی ندارید",
      108: "نوع merchant_id اشتباه است",
      110: "amount بیشتر از حد مجاز می‌باشد",
      111: "description حداکثر می‌تواند 255 کاراکتر باشد",
      112: "reseller_id نامعتبر می‌باشد",
      113: "amount منفی می‌باشد",
      114: "callback_url نامعتبر است",
      115: "شما مجاز به استفاده از این merchant_id نیستید",
      116: "IP شما در whitelist تعریف نشده است",
      117: "خطا در ارسال پارامترها",
      118: "درخواست شما reject شده است",
      119: "درخواست شما در صف انتظار قرار گرفته است",
      201: "قبلا وریفای شده",
      202: "سفارش پرداخت نشده یا ناموفق بوده است",
      203: "trackId نامعتبر می‌باشد",
    };

    // Handle negative error codes
    if (code < 0) {
      const negativeMessages: { [key: number]: string } = {
        9: "خطای اعتبار سنجی - Authority نامعتبر",
        10: "IP یا merchant_id شما غیرفعال است",
        11: "درخواست کننده معتبر نیست",
        12: "امکان انجام تراکنش وجود ندارد",
        14: "دامنه callback URL با دامنه ثبت شده در پنل مطابقت ندارد",
        15: "مبلغ پرداخت صحیح نیست",
        16: "سطح تأیید پذیرنده کافی نیست",
      };
      return negativeMessages[Math.abs(code)] || `خطای نامشخص (کد: ${code})`;
    }

    return messages[code] || `خطای نامشخص (کد: ${code})`;
  }
}
