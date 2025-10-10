// Sitemap configuration for different route types
export const sitemapConfig = {
  baseUrl: 'https://arziplus.com', // Update this with your actual domain
  
  // Route priorities and change frequencies
  routeConfig: {
    '/': { priority: 1.0, changeFreq: 'daily' as const },
    '/services': { priority: 0.9, changeFreq: 'weekly' as const },
    
    // Payment services - high priority
    '/buy-chatgpt-plus': { priority: 0.8, changeFreq: 'weekly' as const },
    '/buy-Claude': { priority: 0.8, changeFreq: 'weekly' as const },
    '/buy-Midjourney': { priority: 0.8, changeFreq: 'weekly' as const },
    '/HetznerInvoicePayment': { priority: 0.8, changeFreq: 'weekly' as const },
    
    // Account services
    '/opening-a-wise-account': { priority: 0.7, changeFreq: 'monthly' as const },
    '/Opening-a-PayPal-account': { priority: 0.7, changeFreq: 'monthly' as const },
    '/opening-a-payeer-account': { priority: 0.7, changeFreq: 'monthly' as const },
    
    // Embassy and education payments
    '/Paying-for-the-American-Embassy': { priority: 0.7, changeFreq: 'monthly' as const },
    '/Paying-for-the-Australia-Embassy': { priority: 0.7, changeFreq: 'monthly' as const },
    '/Paying-tuition-fees-at-a-foreign-university': { priority: 0.7, changeFreq: 'monthly' as const },
    
    // Default for other routes
    default: { priority: 0.6, changeFreq: 'monthly' as const }
  },
  
  // Routes to exclude from sitemap
  excludeRoutes: [
    '/admin',
    '/api',
    '/examples'
  ]
}

export function getRouteConfig(route: string) {
  return sitemapConfig.routeConfig[route as keyof typeof sitemapConfig.routeConfig] || 
         sitemapConfig.routeConfig.default
}