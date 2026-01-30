'use client'

import React, { useLayoutEffect, useState, useRef } from 'react'

interface ContractPreviewProps {
  content: string
  contractNumber: string
  title?: string
  contentRef?: React.RefObject<HTMLDivElement>
  parties?: Array<{
    legal_name: string
    role: string
    signed_date?: string
    sign_label?: string
  }>
}

// A4 Dimensions in mm (standard)
const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

// Approximate pixel conversion (96 DPI)
const PAGE_HEIGHT_PX = 1122
const PADDING_MM = 15
const PADDING_PX = PADDING_MM * 3.78
const USABLE_HEIGHT_PX = PAGE_HEIGHT_PX - PADDING_PX * 2

export default function ContractPreview({
  content,
  contractNumber,
  title,
  contentRef,
  parties = []
}: ContractPreviewProps) {
  const measureContainerRef = useRef<HTMLDivElement>(null)
  const [isMeasuring, setIsMeasuring] = useState(true)
  const [paginatedPages, setPaginatedPages] = useState<
    { content: string; hasSignature: boolean }[]
  >([])

  const formatDate = (dateString?: string) => {
    if (!dateString) return '..../..../....'
    try {
      const date = new Date(dateString)
      const day = date.getDate()
      const month = date.getMonth() + 1
      const buddhistYear = date.getFullYear() + 543
      return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${buddhistYear}`
    } catch {
      return dateString
    }
  }

  const findPartyByRole = (role: string) => {
    return parties.find(party => party.role === role)
  }

  // Trigger measurement when content changes
  useLayoutEffect(() => {
    setIsMeasuring(true)
  }, [content])

  // Measurement Logic
  useLayoutEffect(() => {
    if (!isMeasuring || !measureContainerRef.current) return

    const container = measureContainerRef.current

    // Measure fixed elements
    const headerHeight =
      container.querySelector('#measure-header-1')?.getBoundingClientRect()
        .height || 180
    const contHeaderHeight =
      container.querySelector('#measure-header-cont')?.getBoundingClientRect()
        .height || 50
    const signaturesHeight =
      container.querySelector('#measure-signatures')?.getBoundingClientRect()
        .height || 300
    const pageFooterTextHeight = 60

    // Measure content blocks
    const contentDiv = container.querySelector('#measure-content')
    if (!contentDiv) return

    const children = Array.from(contentDiv.children) as HTMLElement[]
    const blockHeights: { html: string; height: number }[] = []

    children.forEach(child => {
      const rect = child.getBoundingClientRect()
      const style = window.getComputedStyle(child)
      const marginTop = parseFloat(style.marginTop) || 0
      const marginBottom = parseFloat(style.marginBottom) || 0
      blockHeights.push({
        html: child.outerHTML,
        height: rect.height + marginTop + marginBottom
      })
    })

    // Pagination Algorithm
    const newPages: { content: string; hasSignature: boolean }[] = []
    let currentContent = ''
    let currentHeight = headerHeight + pageFooterTextHeight // Page 1 starts with full header
    let isFirstPage = true

    blockHeights.forEach(block => {
      const availableHeight = isFirstPage
        ? USABLE_HEIGHT_PX - headerHeight - pageFooterTextHeight
        : USABLE_HEIGHT_PX - contHeaderHeight - pageFooterTextHeight

      if (currentHeight + block.height > USABLE_HEIGHT_PX) {
        // Push current page
        newPages.push({ content: currentContent, hasSignature: false })

        // Reset for next page
        currentContent = block.html
        currentHeight = contHeaderHeight + pageFooterTextHeight + block.height
        isFirstPage = false
      } else {
        currentContent += block.html
        currentHeight += block.height
      }
    })

    // Check if signatures fit on the last page
    const remainingHeight = USABLE_HEIGHT_PX - currentHeight
    if (remainingHeight >= signaturesHeight) {
      // Signatures fit on current page
      newPages.push({ content: currentContent, hasSignature: true })
    } else {
      // Signatures don't fit - push current content, then new page for signatures
      if (currentContent) {
        newPages.push({ content: currentContent, hasSignature: false })
      }
      newPages.push({ content: '', hasSignature: true })
    }

    setPaginatedPages(newPages)
    setIsMeasuring(false)
  }, [isMeasuring, content])

  const totalPages = paginatedPages.length

  return (
    <div className="w-full overflow-auto bg-zinc-800/50 p-8 rounded-lg flex flex-col items-start gap-8">
      {/* Hidden Measurement Container */}
      <div
        ref={measureContainerRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          width: `${A4_WIDTH_MM}mm`,
          padding: `${PADDING_MM}mm`
        }}
      >
        {/* Measure Header Page 1 */}
        <div id="measure-header-1">
          <div className="flex justify-between items-start mb-8 border-b-2 border-gray-200 pb-4">
            <div className="h-12 w-12"></div>
            <div className="h-20 w-full"></div>
          </div>
          <div className="mb-8 flex justify-between text-sm border-b border-gray-100 pb-6">
            <div className="h-12"></div>
            <div className="h-12"></div>
          </div>
        </div>

        {/* Measure Continuation Header */}
        <div
          id="measure-header-cont"
          className="mb-4 h-8 border-b border-dashed border-gray-300"
        ></div>

        {/* Measure Content */}
        <div
          id="measure-content"
          className="prose-sm max-w-none font-sarabun text-[14pt] leading-normal text-black [&_p]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Measure Signatures */}
        <div id="measure-signatures" className="mt-8 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12">
            <div className="text-center">
              <div className="h-12 w-3/4 mx-auto mb-2"></div>
              <p className="h-4"></p>
              <p className="h-4"></p>
              <p className="h-4"></p>
            </div>
            <div className="text-center">
              <div className="h-12 w-3/4 mx-auto mb-2"></div>
              <p className="h-4"></p>
              <p className="h-4"></p>
              <p className="h-4"></p>
            </div>
            <div className="text-center">
              <div className="h-12 w-3/4 mx-auto mb-2"></div>
              <p className="h-4"></p>
              <p className="h-4"></p>
              <p className="h-4"></p>
            </div>
            <div className="text-center">
              <div className="h-12 w-3/4 mx-auto mb-2"></div>
              <p className="h-4"></p>
              <p className="h-4"></p>
              <p className="h-4"></p>
            </div>
          </div>
        </div>
      </div>

      {isMeasuring ? (
        <div className="text-white animate-pulse">Calculating layout...</div>
      ) : (
        <div ref={contentRef} className="flex flex-col pdf-page-gap">
          {paginatedPages.map((page, pageIndex) => {
            const isLastPage = pageIndex === totalPages - 1
            const isFirstPage = pageIndex === 0

            return (
              <div
                key={pageIndex}
                className={`bg-white text-black shadow-xl relative print:shadow-none ${!isLastPage ? 'print:break-after-page' : ''}`}
                style={{
                  width: `${A4_WIDTH_MM}mm`,
                  height: `${A4_HEIGHT_MM}mm`,
                  overflow: 'hidden',
                  padding: `${PADDING_MM}mm`,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  fontFamily: '"TH Sarabun New", "Sarabun", sans-serif'
                }}
              >
                {/* Header - Show on ALL pages */}
                <div className="flex justify-between items-start mb-8 border-b-2 border-gray-200 pb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src="/logo-hover.svg"
                      alt="LiKQ"
                      className="h-12 w-auto"
                    />
                    <div>
                      <h1 className="font-bold text-xl text-indigo-900 font-sans">
                        LiKQ MUSIC
                      </h1>
                      <p className="text-xs text-gray-500 font-sans">
                        Music Production & Entertainment
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-xl font-bold text-gray-800 font-sans">
                      CONTRACT
                    </h2>
                    <p className="text-sm font-semibold text-gray-600 font-sarabun">
                      สัญญาจ้าง
                    </p>
                    <p className="text-sm font-medium text-indigo-900 mt-1 font-sans">
                      {contractNumber || 'DRAFT'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-sans">
                      Page {pageIndex + 1} / {totalPages}
                    </p>
                  </div>
                </div>

                {/* Page 1 Specific Info */}
                {isFirstPage && (
                  <div className="mb-8 flex justify-between text-sm border-b border-gray-100 pb-6">
                    <div>
                      <span className="text-gray-500 block font-sans">
                        Title (เรื่อง):
                      </span>
                      <span className="font-semibold">{title || '-'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500 block font-sans">
                        Date (วันที่):
                      </span>
                      <span>{formatDate(new Date().toISOString())}</span>
                    </div>
                  </div>
                )}

                {/* Continuation Header */}
                {!isFirstPage && (
                  <div className="mb-4 text-sm text-gray-500 italic border-b border-dashed border-gray-300 pb-2">
                    Continuation of Contract No. {contractNumber || 'DRAFT'}
                  </div>
                )}

                {/* Content */}
                {page.content && (
                  <div
                    className={`flex-grow prose-sm max-w-none font-sarabun text-[14pt] leading-normal text-black [&_p]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold ${!page.hasSignature ? 'pb-12' : ''}`}
                    dangerouslySetInnerHTML={{ __html: page.content }}
                  />
                )}

                {/* Signatures */}
                {page.hasSignature && (
                  <div
                    className={
                      page.content ? 'mt-auto pb-12' : 'mt-4 flex-grow-0 pb-12'
                    }
                  >
                    <div className="pt-8 border-t border-gray-200 font-sarabun">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                        <div className="text-center">
                          <div className="border-b border-gray-400 w-3/4 mx-auto mb-2 relative h-12"></div>
                          <p className="font-semibold text-sm">
                            ผู้ว่าจ้าง (Employer)
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            ({' '}
                            {findPartyByRole('ผู้ว่าจ้าง')?.legal_name ||
                              '................................................'}{' '}
                            )
                          </p>
                          <p className="text-xs text-gray-400">
                            Date:{' '}
                            {formatDate(findPartyByRole('ผู้ว่าจ้าง')?.signed_date)}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="border-b border-gray-400 w-3/4 mx-auto mb-2 relative h-12"></div>
                          <p className="font-semibold text-sm">
                            ผู้รับจ้าง (Contractor)
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            ({' '}
                            {findPartyByRole('ผู้รับจ้าง')?.legal_name ||
                              '................................................'}{' '}
                            )
                          </p>
                          <p className="text-xs text-gray-400">
                            Date:{' '}
                            {formatDate(findPartyByRole('ผู้รับจ้าง')?.signed_date)}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="border-b border-gray-400 w-3/4 mx-auto mb-2 relative h-12"></div>
                          <p className="font-semibold text-sm">พยาน (Witness)</p>
                          <p className="text-xs text-gray-500 mt-1">
                            ({' '}
                            {findPartyByRole('พยาน 1')?.legal_name ||
                              '................................................'}{' '}
                            )
                          </p>
                          <p className="text-xs text-gray-400">
                            Date:{' '}
                            {formatDate(findPartyByRole('พยาน 1')?.signed_date)}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="border-b border-gray-400 w-3/4 mx-auto mb-2 relative h-12"></div>
                          <p className="font-semibold text-sm">พยาน (Witness)</p>
                          <p className="text-xs text-gray-500 mt-1">
                            ({' '}
                            {findPartyByRole('พยาน 2')?.legal_name ||
                              '................................................'}{' '}
                            )
                          </p>
                          <p className="text-xs text-gray-400">
                            Date:{' '}
                            {formatDate(findPartyByRole('พยาน 2')?.signed_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Page footer text - Fixed at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 pt-2 border-t border-gray-100 text-xs text-center text-gray-400 font-sans"
                  style={{
                    padding: `2mm ${PADDING_MM}mm ${PADDING_MM}mm ${PADDING_MM}mm`
                  }}
                >
                  LiKQ MUSIC - Contract ID: {contractNumber}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
