import fs from 'fs'
import path from 'path'
import { sitemapConfig } from './sitemap-config'

export interface SitemapEntry {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export class SitemapGenerator {
  private baseUrl: string
  private routes: string[] = []

  constructor(baseUrl: string = sitemapConfig.baseUrl) {
    this.baseUrl = baseUrl
  }

  // Scan app directory for routes
  scanRoutes(): string[] {
    const appDir = path.join(process.cwd(), 'app')
    const routes: string[] = []

    const scanDirectory = (dir: string, basePath: string = '') => {
      try {
        const items = fs.readdirSync(dir, { withFileTypes: true })
        
        for (const item of items) {
          if (item.isDirectory()) {
            // Skip special directories
            if (this.shouldSkipDirectory(item.name)) continue
            
            const currentPath = basePath + '/' + item.name
            const fullPath = path.join(dir, item.name)
            
            // Check for page file
            if (this.hasPageFile(fullPath)) {
              routes.push(currentPath)
            }
            
            // Recursive scan
            scanDirectory(fullPath, currentPath)
          }
        }
      } catch (error) {
        console.warn(`Could not scan directory ${dir}:`, error)
      }
    }

    // Add root route
    routes.push('')
    
    // Scan app directory
    scanDirectory(appDir)
    
    this.routes = routes
    return routes
  }

  // Check if directory should be skipped
  private shouldSkipDirectory(name: string): boolean {
    return (
      name.startsWith('(') ||
      name.startsWith('_') ||
      sitemapConfig.excludeRoutes.includes(name) ||
      sitemapConfig.excludeRoutes.some(excluded => name.startsWith(excluded))
    )
  }

  // Check if directory has a page file
  private hasPageFile(dirPath: string): boolean {
    const pageFiles = ['page.tsx', 'page.ts', 'page.jsx', 'page.js']
    return pageFiles.some(file => fs.existsSync(path.join(dirPath, file)))
  }

  // Generate sitemap entries
  generateSitemap(): SitemapEntry[] {
    const routes = this.scanRoutes()
    
    return routes.map(route => {
      const config = sitemapConfig.routeConfig[route as keyof typeof sitemapConfig.routeConfig] || 
                    sitemapConfig.routeConfig.default
      
      return {
        url: `${this.baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: config.changeFreq,
        priority: config.priority
      }
    })
  }

  // Get routes by category
  getRoutesByCategory() {
    const routes = this.scanRoutes()
    
    return {
      payment: routes.filter(route => 
        route.includes('buy-') || 
        route.includes('Payment') || 
        route.includes('charge-') ||
        route.includes('cashing-')
      ),
      accounts: routes.filter(route => 
        route.includes('opening-') || 
        route.includes('account')
      ),
      embassy: routes.filter(route => 
        route.includes('Embassy') || 
        route.includes('Paying-for-')
      ),
      education: routes.filter(route => 
        route.includes('university') || 
        route.includes('exam') ||
        route.includes('Payment') && (
          route.includes('toefl') || 
          route.includes('ielts') || 
          route.includes('gre')
        )
      ),
      other: routes.filter(route => 
        !route.includes('buy-') && 
        !route.includes('Payment') && 
        !route.includes('opening-') && 
        !route.includes('Embassy') &&
        route !== ''
      )
    }
  }
}