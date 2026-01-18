'use client'

import { Eye } from 'lucide-react'
import { useState } from 'react'
import { usePdfGeneration } from '@/hooks/usePdfGeneration'
import { extractHtmlWithStyles } from '@/lib/extractHtml'

export interface ContractPDFProps {
  contract: {
    contract_number: string
    title: string
    origin: string
    current_status: string
    parties?: Array<{
      legal_name: string
      display_name?: string
      role: string
      sign_label?: string
      signed_date?: string
    }>
    latest_version?: {
      content_text: string
    }
  }
}

interface PDFExportButtonProps {
  contract?: ContractPDFProps['contract'] // Kept for type compatibility but not strictly used for Gotenberg preview
  disabled?: boolean
  mode?: 'gotenberg' // Only gotenberg supported now
  contentRef?: React.RefObject<HTMLDivElement>
}

export default function PDFExportButton({
  disabled,
  contentRef
}: PDFExportButtonProps) {
  const [loading, setLoading] = useState(false)
  const { previewPdf } = usePdfGeneration()

  const handlePreview = async () => {
    if (!contentRef?.current) {
      alert('Content is not ready for preview')
      return
    }

    setLoading(true)

    try {
      // Extract HTML
      const html = await extractHtmlWithStyles(contentRef.current)

      // Generate PDF via API using the hook (which handles apiClient correctly)
      await previewPdf(html)
    } catch (error) {
      console.error('Gotenberg preview failed:', error)
      alert('Failed to generate preview')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handlePreview}
      disabled={disabled || loading}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Eye size={18} className="animate-pulse" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Eye size={18} />
          <span>Preview PDF</span>
        </>
      )}
    </button>
  )
}
