'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'

export function usePdfGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Generate PDF from HTML and open in new tab for preview
   */
  const previewPdf = async (html: string) => {
    try {
      setIsGenerating(true)
      setError(null)

      const response = await apiClient.post(
        '/pdf/preview',
        { html },
        {
          responseType: 'blob'
        }
      )

      // Create blob URL and open in new tab
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')

      // Clean up after a delay
      setTimeout(() => URL.revokeObjectURL(url), 100)

      return true
    } catch (err: any) {
      console.error('PDF preview failed:', err)
      setError(err.response?.data?.message || 'Failed to generate PDF preview')
      return false
    } finally {
      setIsGenerating(false)
    }
  }

  /**
   * Generate PDF from HTML, upload to R2, and return URL
   */
  const savePdf = async (html: string, filename?: string) => {
    try {
      setIsGenerating(true)
      setError(null)

      const response = await apiClient.post('/pdf/save', {
        html,
        filename
      })

      return response.data.url as string
    } catch (err: any) {
      console.error('PDF save failed:', err)
      setError(err.response?.data?.message || 'Failed to save PDF')
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    previewPdf,
    savePdf,
    isGenerating,
    error
  }
}
