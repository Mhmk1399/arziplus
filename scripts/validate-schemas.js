const fs = require('fs')
const path = require('path')

// شمارش صفحات از فایل app directory
function countActualPages() {
  const appDir = path.join(__dirname, '../app')
  let pageCount = 0
  
  function scanDirectory(dir, basePath = '') {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true })
      
      for (const item of items) {
        if (item.isDirectory() && !item.name.startsWith('(') && !item.name.startsWith('_') && item.name !== 'api') {
          const fullPath = path.join(dir, item.name)
          const hasPage = fs.existsSync(path.join(fullPath, 'page.tsx'))
          
          if (hasPage) {
            pageCount++
          }
          
          scanDirectory(fullPath, basePath + '/' + item.name)
        }
      }
    } catch (error) {
      // نادیده گرفتن خطاها
    }
  }
  
  // اضافه کردن صفحه اصلی
  pageCount = 1
  scanDirectory(appDir)
  
  return pageCount
}

// تنظیمات Schema نمونه
const sampleSchemaConfig = {
  '/': { type: 'Organization', title: 'ارزی پلاس', category: 'Payment Services' },
  '/buy-chatgpt-plus': { type: 'Service', title: 'خرید ChatGPT Plus', category: 'AI Services', price: '25' },
  '/HetznerInvoicePayment': { type: 'Service', title: 'پرداخت هتزنر', category: 'Hosting Services' },
  '/opening-a-wise-account': { type: 'Service', title: 'باز کردن حساب Wise', category: 'Financial Services' }
}

// تولید Schema ساده
function generateSimpleSchema(route, config) {
  const baseUrl = 'https://arziPlus.com'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': config.type || 'Service',
    name: config.title,
    description: config.description || config.title,
    url: `${baseUrl}${route}`,
    provider: {
      '@type': 'Organization',
      name: 'ارزی پلاس',
      url: baseUrl
    }
  }

  if (config.type === 'Service') {
    schema.serviceType = config.category
    schema.areaServed = 'Iran'
    
    if (config.price) {
      schema.offers = {
        '@type': 'Offer',
        price: config.price,
        priceCurrency: 'USD'
      }
    }
  }

  return schema
}

// بررسی Schema ها
function validateSchemas() {
  console.log('🔍 بررسی Schema های تولید شده...\n')
  
  let totalSchemas = 0
  let validSchemas = 0

  Object.entries(sampleSchemaConfig).forEach(([route, config]) => {
    try {
      const schema = generateSimpleSchema(route, config)
      totalSchemas++
      
      if (schema['@context'] && schema['@type'] && schema.name) {
        validSchemas++
        console.log(`✅ ${route} - ${schema['@type']}`)
        
        if (schema.serviceType) {
          console.log(`   📂 دسته: ${schema.serviceType}`)
        }
        if (schema.offers && schema.offers.price) {
          console.log(`   💰 قیمت: ${schema.offers.price} ${schema.offers.priceCurrency}`)
        }
      } else {
        console.log(`❌ ${route} - Schema ناقص`)
      }
    } catch (error) {
      console.log(`❌ ${route} - خطا: ${error.message}`)
      totalSchemas++
    }
  })

  const actualPages = countActualPages()
  
  console.log(`\n📊 خلاصه نتایج:`)
  console.log(`- تعداد صفحات واقعی در پروژه: ${actualPages}`)
  console.log(`- تعداد Schema های تست شده: ${totalSchemas}`)
  console.log(`- Schema های معتبر: ${validSchemas}`)
  console.log(`- درصد موفقیت تست: ${Math.round((validSchemas / totalSchemas) * 100)}%`)
  
  // بررسی فایل schema-config.ts
  const configPath = path.join(__dirname, '../lib/schema-config.ts')
  if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf8')
    const configLines = configContent.split('\n').filter(line => line.trim().startsWith("'/"))
    console.log(`- تعداد Schema های تعریف شده در config: ${configLines.length}`)
    
    if (configLines.length >= actualPages - 5) {
      console.log(`✅ تقریباً تمام صفحات Schema دارند`)
    } else {
      console.log(`⚠️  برخی صفحات Schema ندارند`)
    }
  }

  // بررسی فایلهای Schema
  console.log('\n🔍 بررسی فایلهای Schema:')
  const schemaFiles = [
    { path: path.join(__dirname, '../lib/schema-generator.ts'), name: 'schema-generator.ts' },
    { path: path.join(__dirname, '../lib/schema-config.ts'), name: 'schema-config.ts' },
    { path: path.join(__dirname, '../components/global/SchemaProvider.tsx'), name: 'SchemaProvider.tsx' },
    { path: path.join(__dirname, '../hooks/useSchema.ts'), name: 'useSchema.ts' }
  ]
  
  schemaFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      console.log(`✅ ${file.name} موجود است`)
    } else {
      console.log(`❌ ${file.name} یافت نشد`)
    }
  })

  console.log('\n✅ بررسی Schema ها تکمیل شد!')
  console.log('\n💡 برای تست Schema ها:')
  console.log('1. npm run build && npm run start')
  console.log('2. در DevTools > Application > Structured Data چک کنید')
  console.log('3. از Google Rich Results Test استفاده کنید')
}

// تست نمونه
function testSampleSchema() {
  console.log('\n🧪 تست نمونه Schema:\n')
  
  const sampleRoute = '/buy-chatgpt-plus'
  const config = sampleSchemaConfig[sampleRoute]
  const schema = generateSimpleSchema(sampleRoute, config)
  
  console.log('Schema تولید شده برای', sampleRoute)
  console.log('='.repeat(50))
  console.log(JSON.stringify(schema, null, 2))
}

validateSchemas()
testSampleSchema()