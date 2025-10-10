import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { sitemapConfig, getRouteConfig } from '@/lib/sitemap-config'

// Get all routes from the app directory
function getRoutes(): string[] {
  const appDir = path.join(process.cwd(), 'app')
  const routes: string[] = []

  function scanDirectory(dir: string, basePath: string = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const item of items) {
      if (item.isDirectory()) {
        // Skip special Next.js directories and excluded routes
        if (item.name.startsWith('(') || item.name.startsWith('_') || 
            sitemapConfig.excludeRoutes.includes(item.name)) {
          continue
        }
        
        const currentPath = basePath + '/' + item.name
        const fullPath = path.join(dir, item.name)
        
        // Check if directory has a page.tsx file
        const hasPage = fs.existsSync(path.join(fullPath, 'page.tsx'))
        if (hasPage) {
          routes.push(currentPath)
        }
        
        // Recursively scan subdirectories
        scanDirectory(fullPath, currentPath)
      }
    }
  }

  // Add root route
  routes.push('')
  
  // Scan app directory
  scanDirectory(appDir)
  
  return routes
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = getRoutes()
  
  return routes.map((route) => {
    const config = getRouteConfig(route)
    
    return {
      url: `${sitemapConfig.baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: config.changeFreq,
      priority: config.priority,
    }
  })
}