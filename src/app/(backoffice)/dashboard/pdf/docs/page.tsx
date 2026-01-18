'use client'

import React from 'react'
import ApiDocViewer from '@/components/common/ApiDocViewer/ApiDocViewer'
import { PDF_API_DOCS } from './pdf-api-data'

export default function PdfApiDocsPage() {
  return (
    <div className="container mx-auto max-w-5xl py-8">
      <ApiDocViewer
        title="PDF Generation API"
        description="API endpoints for converting HTML to PDF and managing PDF files."
        baseUrl="{{API_URL}}"
        endpoints={PDF_API_DOCS}
      />
    </div>
  )
}
