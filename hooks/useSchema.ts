'use client'

import { usePathname } from 'next/navigation'
import { SchemaGenerator, SchemaData } from '@/lib/schema-generator'
import { useEffect } from 'react'

interface UseSchemaOptions {
  customData?: Partial<SchemaData>
  autoInject?: boolean
}

export function useSchema(options: UseSchemaOptions = {}) {
  const pathname = usePathname()
  const { customData, autoInject = true } = options
  const generator = new SchemaGenerator()

  // تولید Schema
  const generateSchema = (additionalData?: Partial<SchemaData>) => {
    const mergedData = { ...customData, ...additionalData }
    return generator.generateSchema(pathname, mergedData)
  }

  // تزریق خودکار Schema
  useEffect(() => {
    if (!autoInject) return

    const schema = generateSchema()
    
    // حذف Schema قبلی
    const existingSchema = document.querySelector('script[data-schema="auto"]')
    if (existingSchema) {
      existingSchema.remove()
    }

    // اضافه کردن Schema جدید
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'auto')
    script.textContent = JSON.stringify(schema, null, 2)
    document.head.appendChild(script)

    return () => {
      const schemaElement = document.querySelector('script[data-schema="auto"]')
      if (schemaElement) {
        schemaElement.remove()
      }
    }
  }, [pathname, customData, autoInject])

  return {
    generateSchema,
    currentPath: pathname,
    schemaType: generator.detectPageType(pathname)
  }
}