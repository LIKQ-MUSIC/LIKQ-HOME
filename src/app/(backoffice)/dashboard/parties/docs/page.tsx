'use client'

import React from 'react'
import ApiDocViewer from '@/components/common/ApiDocViewer/ApiDocViewer'
import { PARTY_API_DOCS } from './party-api-data'

export default function PartyApiDocsPage() {
  return (
    <div className="container mx-auto max-w-5xl py-8">
      <ApiDocViewer
        title="Parties API Documentation"
        description="API documentation for managing parties (customers, vendors, etc.) in the system."
        baseUrl="{{API_URL}}"
        endpoints={PARTY_API_DOCS}
      />
    </div>
  )
}
