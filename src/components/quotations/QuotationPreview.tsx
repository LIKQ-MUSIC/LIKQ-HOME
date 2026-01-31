'use client'

import React, { useLayoutEffect, useState, useRef } from 'react'
import { formatDateThaiBuddhist } from '@/utils/date'

interface Party {
  id: string
  legal_name: string
  display_name?: string
  address?: string
  tax_id?: string
}

interface QuotationItem {
  description: string
  quantity: number
  price: number
}

interface QuotationPreviewProps {
  formData: {
    quotation_number?: string
    issued_date?: string
    valid_until_date?: string
    items: QuotationItem[]
    total_amount: number
    currency: string
    contact_person_id?: string
    bill_to_party_id?: string
    payment_method?: string
    signature_date?: string
    status: string
    authorized_signature_url?: string
  }
  parties: Party[]
  vatRate?: number
  contentRef?: React.RefObject<HTMLDivElement>
}

// A4 Dimensions in mm (standard)
const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

// Approximate pixel conversion (96 DPI)
// 1mm = 3.78px
// 297mm = 1122.5px
// Safe height to prevent overflow (accounting for margins/padding visual variances)
const PAGE_HEIGHT_PX = 1122
const PADDING_MM = 15
const PADDING_PX = PADDING_MM * 3.78
// Usable height inside the padding
const USABLE_HEIGHT_PX = PAGE_HEIGHT_PX - PADDING_PX * 2

export default function QuotationPreview({
  formData,
  parties,
  vatRate = 7,
  contentRef
}: QuotationPreviewProps) {
  // Helper to find party details
  const getParty = (id?: string) => parties.find(p => p.id === id)
  const billToParty = getParty(formData.bill_to_party_id)
  const contactPerson = getParty(formData.contact_person_id)

  // Formatting helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formData.currency || 'THB',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Measurements State
  const [paginatedData, setPaginatedData] = useState<{
    pages: {
      items: QuotationItem[]
      startIndex: number
    }[]
  }>({ pages: [] })

  const [isMeasuring, setIsMeasuring] = useState(true)
  const measureContainerRef = useRef<HTMLDivElement>(null)

  // Trigger measurement when items change
  useLayoutEffect(() => {
    setIsMeasuring(true)
  }, [formData.items])

  // Measurement Logic
  useLayoutEffect(() => {
    if (!isMeasuring || !measureContainerRef.current) return

    const container = measureContainerRef.current

    // Measure fixed elements
    const headerHeight =
      container.querySelector('#measure-header-1')?.getBoundingClientRect()
        .height || 200
    const contHeaderHeight =
      container.querySelector('#measure-header-cont')?.getBoundingClientRect()
        .height || 50
    const footerHeight =
      container.querySelector('#measure-footer')?.getBoundingClientRect()
        .height || 250
    const tableHeaderHeight =
      container.querySelector('#measure-table-header')?.getBoundingClientRect()
        .height || 40
    const pageFooterTextHeight = 60 // Approx for "LiKQ MUSIC..." footer + spacing

    // Measure all rows
    const rowHeights: number[] = []
    formData.items.forEach((_, index) => {
      const row = container.querySelector(`#measure-item-${index}`)
      rowHeights.push(row?.getBoundingClientRect().height || 30)
    })

    // Pagination Algorithm
    const newPages: { items: QuotationItem[]; startIndex: number }[] = []
    let currentItems: QuotationItem[] = []
    let currentHeight = headerHeight + tableHeaderHeight + pageFooterTextHeight // Start with page 1 header
    let startIndex = 0
    let currentPageIndex = 0

    formData.items.forEach((item, index) => {
      const rowHeight = rowHeights[index]

      // Check if adding this row exceeds limit
      if (currentHeight + rowHeight > USABLE_HEIGHT_PX) {
        // Push current page
        newPages.push({ items: currentItems, startIndex })

        // Reset for next page (Page > 1)
        currentItems = []
        startIndex = index
        currentHeight =
          contHeaderHeight +
          tableHeaderHeight +
          pageFooterTextHeight +
          rowHeight
        currentPageIndex++
      } else {
        currentHeight += rowHeight
      }
      currentItems.push(item)
    })

    // Check if Footer fits on the last page
    if (currentHeight + footerHeight > USABLE_HEIGHT_PX) {
      // Footer doesn't fit - only push empty page if we have items to separate
      if (currentItems.length > 0) {
        newPages.push({ items: currentItems, startIndex })
        newPages.push({ items: [], startIndex: formData.items.length })
      } else if (newPages.length > 0) {
        // Footer doesn't fit on current empty page, push it
        newPages.push({ items: [], startIndex: formData.items.length })
      }
    } else {
      // Footer fits, push the last page only if it has content or is the first page
      if (currentItems.length > 0 || newPages.length === 0) {
        newPages.push({ items: currentItems, startIndex })
      }
    }

    setPaginatedData({ pages: newPages })
    setIsMeasuring(false)
  }, [isMeasuring, formData.items])

  // Calculate totals
  const subtotal = formData.total_amount
  const vatAmount = (subtotal * vatRate) / 100
  const grandTotal = subtotal + vatAmount
  const totalPages = paginatedData.pages.length

  return (
    <div className="w-full overflow-x-auto bg-zinc-800/50 p-8 rounded-lg flex flex-col items-center gap-8">
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
        {/* Measure Header 1 */}
        <div id="measure-header-1">
          <div className="flex justify-between items-start mb-8 border-b-2 border-gray-200 pb-4">
            {/* Logo Placeholder Height */}
            <div className="h-12 w-12"></div>
            <div className="h-20 w-full"></div>
          </div>
          <div className="flex justify-between mb-8 text-sm h-40">
            {' '}
            {/* Approx height of customer info */}
            <div className="w-[48%] h-full"></div>
            <div className="w-[45%] h-full"></div>
          </div>
        </div>

        {/* Measure Continuation Header */}
        <div
          id="measure-header-cont"
          className="mb-4 h-8 border-b border-dashed border-gray-300"
        ></div>

        {/* Measure Table Header */}
        <div
          id="measure-table-header"
          className="h-10 bg-gray-100 border-y border-gray-300"
        ></div>

        {/* Measure Items */}
        <table className="w-full text-sm">
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={index} id={`measure-item-${index}`}>
                <td className="py-3 px-2">{index + 1}</td>
                <td className="py-3 px-2 line-clamp-3">{item.description}</td>
                <td className="py-3 px-2">{item.quantity}</td>
                <td className="py-3 px-2">{formatCurrency(item.price)}</td>
                <td className="py-3 px-2">
                  {formatCurrency(item.quantity * item.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Measure Footer */}
        <div id="measure-footer" className="mt-8">
          <div className="h-40 bg-gray-50 rounded-lg"></div>
          <div className="h-40 border-t border-gray-200 mt-8"></div>
        </div>
      </div>

      {isMeasuring ? (
        <div className="text-white animate-pulse">Calculating layout...</div>
      ) : (
        /* Actual Render Container */
        <div ref={contentRef} className="flex flex-col pdf-page-gap">
          {paginatedData.pages.map((page, pageIndex) => {
            const isLastPage = pageIndex === totalPages - 1
            const isFirstPage = pageIndex === 0

            return (
              <div
                key={pageIndex}
                className={`bg-white text-black shadow-xl relative print:shadow-none ${!isLastPage ? 'print:break-after-page' : ''}`}
                style={{
                  width: `${A4_WIDTH_MM}mm`,
                  height: `${A4_HEIGHT_MM}mm`, // STRICT HEIGHT
                  overflow: 'hidden', // PREVENT STRETCHING
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
                    {/* Logo */}
                    <img
                      src="/logo-hover.svg"
                      alt="Company Logo"
                      className="h-12 w-auto"
                    />
                    <div>
                      <h1 className="font-bold text-xl text-indigo-900 font-sans">
                        LiKQ MUSIC
                      </h1>
                      <p className="text-xs text-gray-500 font-sans">
                        Music Production & Entertainment Services
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-800 font-sans">
                      QUOTATION
                    </h2>
                    <p className="text-sm font-semibold text-gray-600 font-sarabun">
                      ใบเสนอราคา
                    </p>
                    <div className="mt-2 text-sm text-gray-600 font-sans">
                      <span className="font-semibold">Page:</span>{' '}
                      {pageIndex + 1} / {totalPages}
                    </div>
                  </div>
                </div>

                {/* Page 1 Specific Info */}
                {isFirstPage && (
                  <div className="flex justify-between mb-8 text-sm">
                    <div className="w-[45%] flex flex-col gap-6">
                      {/* Contact Person Section */}
                      <div>
                        <h3 className="font-bold text-gray-800 border-b border-gray-300 mb-2 pb-1 font-sans">
                          Contact Person (ผู้ติดต่อ)
                        </h3>
                        {contactPerson ? (
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-800 font-sans">
                              {contactPerson.legal_name ||
                                contactPerson.display_name}
                            </p>
                            <p className="text-gray-600 whitespace-pre-wrap font-sarabun">
                              {contactPerson.address}
                            </p>
                            {contactPerson.tax_id && (
                              <p className="text-gray-600 font-sans">
                                Tax ID: {contactPerson.tax_id}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-400 italic">
                            No contact person
                          </p>
                        )}
                      </div>

                      {/* Quotation Details */}
                      <div className="space-y-2">
                        <div className="flex justify-between border-b border-gray-100 pb-1">
                          <span className="text-gray-600 font-sans">
                            No. (เลขที่):
                          </span>
                          <span className="font-semibold font-sans">
                            {formData.quotation_number || 'DRAFT'}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-1">
                          <span className="text-gray-600 font-sans">
                            Date (วันที่):
                          </span>
                          <span className="font-sans">
                            {formatDateThaiBuddhist(formData.issued_date)}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-1">
                          <span className="text-gray-600 font-sans">
                            Valid Until (ใช้ได้ถึง):
                          </span>
                          <span className="font-sans">
                            {formatDateThaiBuddhist(formData.valid_until_date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-[48%]">
                      <h3 className="font-bold text-gray-800 border-b border-gray-300 mb-2 pb-1 text-right font-sans">
                        Bill To (ลูกค้า)
                      </h3>
                      {billToParty ? (
                        <div className="space-y-1 text-right">
                          <p className="font-semibold font-sans">
                            {billToParty.legal_name}
                          </p>
                          {billToParty.address && (
                            <p className="text-gray-600 whitespace-pre-wrap font-sarabun">
                              {billToParty.address}
                            </p>
                          )}
                          {billToParty.tax_id && (
                            <p className="text-gray-600 font-sans">
                              Tax ID: {billToParty.tax_id}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic text-right">
                          No customer selected
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Continuation Header */}
                {!isFirstPage && (
                  <div className="mb-4 text-sm text-gray-500 italic border-b border-dashed border-gray-300 pb-2">
                    Continuation of Quotation No.{' '}
                    {formData.quotation_number || 'DRAFT'}
                  </div>
                )}

                {/* Items Table - Render only if there are items */}
                {page.items.length > 0 && (
                  <div className="flex-grow">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700 font-semibold border-y border-gray-300">
                          <th className="py-2 px-2 text-center w-12">#</th>
                          <th className="py-2 px-2 text-left">
                            Description (รายการ)
                          </th>
                          <th className="py-2 px-2 text-center w-20">Qty</th>
                          <th className="py-2 px-2 text-right w-32">
                            Price/Unit
                          </th>
                          <th className="py-2 px-2 text-right w-32">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {page.items.map((item, idx) => {
                          // Calculate correct continuous index
                          const itemIndex = page.startIndex + idx
                          return (
                            <tr key={idx} className="border-b border-gray-50">
                              <td className="py-3 px-2 text-center text-gray-500">
                                {itemIndex + 1}
                              </td>
                              <td className="py-3 px-2 text-gray-800 whitespace-pre-wrap">
                                {item.description}
                              </td>
                              <td className="py-3 px-2 text-center text-gray-800">
                                {item.quantity}
                              </td>
                              <td className="py-3 px-2 text-right text-gray-800">
                                {formatCurrency(item.price)}
                              </td>
                              <td className="py-3 px-2 text-right font-medium text-gray-900">
                                {formatCurrency(item.quantity * item.price)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Footer Summary - Only on Last Page */}
                {isLastPage && (
                  // If items are empty (summary page only), remove mt-auto to pull it up.
                  // Otherwise, keep mt-auto to push it to bottom.
                  <div
                    className={
                      page.items.length === 0 ? 'mt-4 flex-grow-0' : 'mt-auto'
                    }
                  >
                    <div className="flex justify-between items-end mb-8 gap-8">
                      {/* Left Column: Payment Method */}
                      <div className="w-[50%]">
                        {formData.payment_method && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <span className="text-gray-600 font-medium block text-xs uppercase tracking-wide">
                              วิธีการชำระเงิน (Payment Method)
                            </span>
                            <p className="text-gray-900 font-medium mt-2 whitespace-pre-wrap text-sm">
                              {formData.payment_method}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Totals */}
                      <div className="w-[45%] space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Subtotal (รวมเงิน):
                          </span>
                          <span className="font-semibold">
                            {formatCurrency(subtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">VAT {vatRate}%:</span>
                          <span className="font-semibold">
                            {formatCurrency(vatAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-300 pt-2 mt-2 text-base">
                          <span className="font-bold text-indigo-900">
                            Grand Total (รวมทั้งสิ้น):
                          </span>
                          <span className="font-bold text-indigo-900">
                            {formatCurrency(grandTotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200 mb-8">
                      <div className="text-center relative">
                        <div className="mb-2 border-b border-gray-400 w-2/3 mx-auto h-16 relative flex items-end justify-center">
                          {formData.authorized_signature_url && (
                            <img
                              src={formData.authorized_signature_url}
                              alt="Authorized Signature"
                              className="absolute bottom-0 h-16 object-contain"
                            />
                          )}
                        </div>
                        <p className="font-semibold text-gray-900">
                          {contactPerson?.legal_name || 'LiKQ MUSIC'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Authorized Signature
                        </p>
                        {formData.signature_date ? (
                          <p className="text-xs text-gray-600 mt-1">
                            Date: {formatDateThaiBuddhist(formData.signature_date)}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Date: ____/____/____
                          </p>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="mb-2 border-b border-gray-400 w-2/3 mx-auto h-16"></div>
                        <p className="font-semibold text-gray-900">
                          (___________________)
                        </p>
                        <p className="text-xs text-gray-500">ผู้อนุมัติ</p>
                        <p className="text-xs text-gray-500">
                          Date: ____/____/____
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Page footer text - Fixed at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 pt-2 border-t border-gray-100 text-xs text-center text-gray-400"
                  style={{
                    padding: `2mm ${PADDING_MM}mm ${PADDING_MM}mm ${PADDING_MM}mm`
                  }}
                >
                  LiKQ MUSIC - Music Production & Entertainment Services
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
