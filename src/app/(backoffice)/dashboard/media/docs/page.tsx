'use client'

import React from 'react'
import ApiDocViewer from '@/components/common/ApiDocViewer/ApiDocViewer'
import { MEDIA_API_DOCS } from './media-api-data'

export default function MediaApiDocsPage() {
  return (
    <div className="container mx-auto max-w-5xl py-8">
      <ApiDocViewer
        title="Media API Documentation"
        description="API endpoints for uploading and managing media files."
        baseUrl="{{API_URL}}"
        endpoints={MEDIA_API_DOCS}
      />
    </div>
  )
}
