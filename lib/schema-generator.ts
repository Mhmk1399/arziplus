import { sitemapConfig } from './sitemap-config'
import { getSchemaConfig } from './schema-config'

export interface SchemaData {
  type: 'Service' | 'WebPage' | 'Organization' | 'Product' | 'Article'
  title: string
  description: string
  url: string
  price?: string
  currency?: string
  category?: string
  provider?: string
  features?: string[]
  steps?: string[]
}

export class SchemaGenerator {
  private baseUrl: string

  constructor(baseUrl: string = sitemapConfig.baseUrl) {
    this.baseUrl = baseUrl
  }

  // تشخیص نوع صفحه بر اساس URL
  detectPageType(route: string): SchemaData['type'] {
    if (route.includes('buy-') || route.includes('Payment') || route.includes('charge-')) {
      return 'Service'
    }
    if (route.includes('opening-') || route.includes('account')) {
      return 'Service'
    }
    if (route === '' || route === '/services') {
      return 'Organization'
    }
    return 'WebPage'
  }

  // استخراج اطلاعات از URL
  extractPageInfo(route: string): Partial<SchemaData> {
    // ابتدا از تنظیمات استفاده کن
    const configData = getSchemaConfig(route)
    if (configData) {
      return configData
    }

    // اگر در تنظیمات نبود، تولید خودکار
    return {
      title: this.generateTitleFromRoute(route),
      description: this.generateDescriptionFromRoute(route)
    }
  }

  // تولید عنوان از URL
  private generateTitleFromRoute(route: string): string {
    if (route === '') return 'ارزی پلاس - خدمات پرداخت ارزی'
    
    const cleanRoute = route.replace(/^\//, '').replace(/-/g, ' ')
    return `${cleanRoute} - ارزی پلاس`
  }

  // تولید توضیحات از URL
  private generateDescriptionFromRoute(route: string): string {
    if (route === '') return 'ارائه خدمات پرداخت ارزی، خرید اشتراک و باز کردن حساب خارجی'
    
    return `خدمات ${route.replace(/^\//, '').replace(/-/g, ' ')} با ارزی پلاس`
  }

  // تولید Schema JSON-LD
  generateSchema(route: string, additionalData?: Partial<SchemaData>): object {
    const pageType = this.detectPageType(route)
    const pageInfo = { ...this.extractPageInfo(route), ...additionalData }
    const url = `${this.baseUrl}${route}`

    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': pageType,
      name: pageInfo.title,
      description: pageInfo.description,
      url: url,
      provider: {
        '@type': 'Organization',
        name: 'ارزی پلاس',
        url: this.baseUrl
      }
    }

    // Schema مخصوص خدمات
    if (pageType === 'Service') {
      return {
        ...baseSchema,
        serviceType: pageInfo.category,
        areaServed: 'Iran',
        availableLanguage: 'fa',
        ...(pageInfo.price && {
          offers: {
            '@type': 'Offer',
            price: pageInfo.price,
            priceCurrency: pageInfo.currency || 'IRR'
          }
        })
      }
    }

    // Schema مخصوص سازمان
    if (pageType === 'Organization') {
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'ارزی پلاس',
        url: this.baseUrl,
        description: 'ارائه خدمات پرداخت ارزی و خرید اشتراک خارجی',
        areaServed: 'Iran',
        serviceType: ['Payment Services', 'Currency Exchange', 'Digital Services']
      }
    }

    return baseSchema
  }
}