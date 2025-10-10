'use client'

import { usePathname } from 'next/navigation'
import { SchemaGenerator, SchemaData } from '@/lib/schema-generator'
import { useEffect } from 'react'

interface DynamicSchemaProps {
  customData?: Partial<SchemaData>
  pageTitle?: string
  pageDescription?: string
}

export default function DynamicSchema({ 
  customData, 
  pageTitle, 
  pageDescription 
}: DynamicSchemaProps) {
  const pathname = usePathname()
  const generator = new SchemaGenerator()

  useEffect(() => {
    // حذف Schema قبلی
    const existingSchema = document.querySelector('script[data-schema="dynamic"]')
    if (existingSchema) {
      existingSchema.remove()
    }

    // تولید Schema جدید
    const additionalData: Partial<SchemaData> = {
      ...customData,
      ...(pageTitle && { title: pageTitle }),
      ...(pageDescription && { description: pageDescription })
    }

    const schema = generator.generateSchema(pathname, additionalData)
    
    // اضافه کردن Schema به head
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'dynamic')
    script.textContent = JSON.stringify(schema, null, 2)
    document.head.appendChild(script)

    return () => {
      const schemaElement = document.querySelector('script[data-schema="dynamic"]')
      if (schemaElement) {
        schemaElement.remove()
      }
    }
  }, [pathname, customData, pageTitle, pageDescription])

  return null
}