const fs = require('fs')
const path = require('path')

// Simple sitemap validation script
function validateSitemap() {
  console.log('🔍 Validating sitemap configuration...\n')
  
  // Check if sitemap files exist
  const sitemapPath = path.join(__dirname, '../app/sitemap.ts')
  const robotsPath = path.join(__dirname, '../app/robots.ts')
  const configPath = path.join(__dirname, '../lib/sitemap-config.ts')
  
  const files = [
    { path: sitemapPath, name: 'sitemap.ts' },
    { path: robotsPath, name: 'robots.ts' },
    { path: configPath, name: 'sitemap-config.ts' }
  ]
  
  files.forEach(file => {
    if (fs.existsSync(file.path)) {
      console.log(`✅ ${file.name} exists`)
    } else {
      console.log(`❌ ${file.name} missing`)
    }
  })
  
  // Count routes in app directory
  const appDir = path.join(__dirname, '../app')
  let routeCount = 0
  
  function countRoutes(dir, basePath = '') {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true })
      
      for (const item of items) {
        if (item.isDirectory() && !item.name.startsWith('(') && !item.name.startsWith('_') && item.name !== 'api') {
          const fullPath = path.join(dir, item.name)
          const hasPage = fs.existsSync(path.join(fullPath, 'page.tsx'))
          
          if (hasPage) {
            routeCount++
            console.log(`📄 Found route: ${basePath}/${item.name}`)
          }
          
          countRoutes(fullPath, basePath + '/' + item.name)
        }
      }
    } catch (error) {
      console.warn(`Could not scan ${dir}`)
    }
  }
  
  console.log('\n🔍 Scanning for routes...')
  countRoutes(appDir)
  console.log(`\n📊 Total routes found: ${routeCount + 1} (including root)`)
  
  console.log('\n✅ Sitemap validation complete!')
  console.log('\n💡 To test your sitemap:')
  console.log('1. Run: npm run build')
  console.log('2. Run: npm run start')
  console.log('3. Visit: http://localhost:3000/sitemap.xml')
  console.log('4. Visit: http://localhost:3000/robots.txt')
}

validateSitemap()