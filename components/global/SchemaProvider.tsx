'use client'

import { useSchema } from '@/hooks/useSchema'
import { SchemaData } from '@/lib/schema-generator'

interface SchemaProviderProps {
  children: React.ReactNode
  customData?: Partial<SchemaData>
}

export default function SchemaProvider({ children, customData }: SchemaProviderProps) {
  // خودکار Schema تزریق میکند
  useSchema({ customData, autoInject: true })

  return <>{children}</>
}

// کامپوننت جداگانه برای Schema دستی
export function ManualSchema({ data }: { data: Partial<SchemaData> }) {
  const { generateSchema } = useSchema({ autoInject: false })
  
  const schema = generateSchema(data)
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  )
}