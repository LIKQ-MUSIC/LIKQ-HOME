'use client'

import React from 'react'
import ApiDocViewer from '@/components/common/ApiDocViewer/ApiDocViewer'
import { QUOTATION_API_DOCS } from './quotation-api-data'

export default function QuotationApiDocsPage() {
  return (
    <div className="container mx-auto max-w-5xl py-8">
      <ApiDocViewer
        title="Quotations API Documentation"
        description="API documentation for managing quotations."
        baseUrl="{{API_URL}}"
        endpoints={QUOTATION_API_DOCS}
      />
    </div>
  )
}
