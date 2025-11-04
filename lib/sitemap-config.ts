// Sitemap configuration for different route types
export const sitemapConfig = {
  baseUrl: "https://arziPlus.com",

  routeConfig: {
    "/": { priority: 1.0, changeFreq: "daily" as const },
    "/services": { priority: 0.9, changeFreq: "weekly" as const },
    "/lottery": { priority: 0.9, changeFreq: "weekly" as const },
    "/about": { priority: 0.8, changeFreq: "monthly" as const },
    "/contact": { priority: 0.8, changeFreq: "monthly" as const },
    "/terms-and-conditions": { priority: 0.7, changeFreq: "yearly" as const },

    // AI Services
    "/buy-chatgpt-plus": { priority: 0.8, changeFreq: "weekly" as const },
    "/buy-Claude": { priority: 0.8, changeFreq: "weekly" as const },
    "/buy-Midjourney": { priority: 0.8, changeFreq: "weekly" as const },
    "/buy-DALL-E": { priority: 0.8, changeFreq: "weekly" as const },
    "/buy-D-ID": { priority: 0.8, changeFreq: "weekly" as const },

    // Booking Services
    "/buy-Airbnb": { priority: 0.8, changeFreq: "weekly" as const },
    "/buy-booking": { priority: 0.8, changeFreq: "weekly" as const },

    // Hosting & Infrastructure
    "/HetznerInvoicePayment": { priority: 0.8, changeFreq: "weekly" as const },
    "/HostingerHostingPayment": {
      priority: 0.8,
      changeFreq: "weekly" as const,
    },

    // Account Opening Services
    "/opening-a-wise-account": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },
    "/Opening-a-PayPal-account": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },
    "/opening-a-payeer-account": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },
    "/opening-a-perfect-money-account": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },
    "/opening-a-Upwork-account": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },

    // Account Charging Services
    "/charge-wise-account": { priority: 0.7, changeFreq: "monthly" as const },
    "/charge-paypal-account": { priority: 0.7, changeFreq: "monthly" as const },
    "/charge-payeer-account": { priority: 0.7, changeFreq: "monthly" as const },
    "/charge-perfect-Money-account": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },

    // Cashing Out Services
    "/cashing-out-wise-account": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },
    "/cashing-out-PayPal-balance": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },
    "/cashing-out-Payer-balance": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },
    "/cashing-out-PerfectMoney-balance": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },

    // Embassy Payments
    "/Paying-for-the-American-Embassy": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },
    "/Paying-for-the-Australia-Embassy": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },
    "/Paying-for-the-england-Embassy": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },

    // Education Payments
    "/Paying-tuition-fees-at-a-foreign-university": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },
    "/ApplicationFeePayment": { priority: 0.7, changeFreq: "monthly" as const },
    "/depositFeePayment": { priority: 0.7, changeFreq: "monthly" as const },
    "/UniAssistPayment": { priority: 0.7, changeFreq: "monthly" as const },

    // Exam Payments
    "/IeltsPayment": { priority: 0.7, changeFreq: "monthly" as const },
    "/toeflPayment": { priority: 0.7, changeFreq: "monthly" as const },
    "/grePayment": { priority: 0.7, changeFreq: "monthly" as const },
    "/duolingoPayment": { priority: 0.7, changeFreq: "monthly" as const },
    "/prometricPayment": { priority: 0.7, changeFreq: "monthly" as const },
    "/jokerPayment": { priority: 0.7, changeFreq: "monthly" as const },
    "/register-international-exams": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },

    // SIM Card Services
    "/EnglishSimCard": { priority: 0.7, changeFreq: "monthly" as const },
    "/EstonianSimCard": { priority: 0.7, changeFreq: "monthly" as const },
    "/GermanSimCard": { priority: 0.7, changeFreq: "monthly" as const },
    "/MalaysianSimCard": { priority: 0.7, changeFreq: "monthly" as const },
    "/InternationalSimRecharge": {
      priority: 0.7,
      changeFreq: "monthly" as const,
    },

    // Other Services
    "/AddressVerificationDocuments": {
      priority: 0.6,
      changeFreq: "monthly" as const,
    },

    default: { priority: 0.5, changeFreq: "monthly" as const },
  },

  excludeRoutes: [
    "api",
    "auth",
    "dashboard",
    "payment",
    "wallet",
    "test",
    "sitemap-index.xml",
  ],
};

export function getRouteConfig(route: string) {
  return (
    sitemapConfig.routeConfig[
      route as keyof typeof sitemapConfig.routeConfig
    ] || sitemapConfig.routeConfig.default
  );
}
