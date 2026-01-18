'use client'

import React from 'react'
import TipTapEditor from './TipTapEditor'

interface ContractPreviewProps {
  content: string
  contractNumber: string
  onChange: (content: string) => void
  contentRef?: React.RefObject<HTMLDivElement>
  parties?: Array<{
    legal_name: string
    role: string
    signed_date?: string
  }>
}

export default function ContractPreview({
  content,
  contractNumber,
  onChange,
  contentRef,
  parties = []
}: ContractPreviewProps) {
  const findPartyByRole = (role: string) => {
    return parties.find(p => p.role === role)
  }

  return (
    <div className="w-full overflow-x-auto bg-zinc-800/50 p-8 rounded-lg flex justify-start">
      <div
        ref={contentRef}
        className="bg-white text-black shadow-xl flex-shrink-0 relative print:shadow-none"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '0',
          position: 'relative',
          boxSizing: 'border-box'
        }}
      >
        {/* Header with Logo - break-inside: avoid */}
        <div
          className="px-[20mm] pt-[20mm] pb-6 border-b-2 border-gray-200 font-sans"
          style={{ breakInside: 'avoid' }}
        >
          <div className="flex justify-between items-start">
            <img
              src="/logo-hover.svg"
              alt="Company Logo"
              className="h-16 w-auto"
            />
            <div className="text-right font-sans">
              <p className="text-sm font-semibold text-gray-700">เลขที่สัญญา</p>
              <p className="text-lg font-bold text-gray-900">
                {contractNumber || 'PENDING'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-[20mm] py-8 font-sarabun">
          <TipTapEditor content={content} onChange={onChange} />
        </div>

        {/* Signatures - break-inside: avoid */}
        <div
          className="px-[20mm] pb-[20mm] pt-12 mt-8 border-t border-gray-200 font-sarabun"
          style={{ breakInside: 'avoid' }}
        >
          <div className="grid grid-cols-2 gap-x-12 gap-y-16">
            <div className="text-center flex flex-col items-center">
              <div className="mb-2 w-full max-w-[200px]">
                <p className="text-sm text-gray-600 mb-1">ลงชื่อ</p>
                <div className="border-b border-gray-400 w-full h-8"></div>
              </div>
              <p className="font-semibold text-gray-900 text-sm">ผู้ว่าจ้าง</p>
              <p className="text-[13px] text-gray-800 mt-1">
                ({' '}
                {findPartyByRole('ผู้ว่าจ้าง')?.legal_name ||
                  '................................................'}{' '}
                )
              </p>
              <p className="text-[12px] text-gray-500 mt-2">
                วันที่{' '}
                {findPartyByRole('ผู้ว่าจ้าง')?.signed_date ||
                  '........ / ........ / ........'}
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="mb-2 w-full max-w-[200px]">
                <p className="text-sm text-gray-600 mb-1">ลงชื่อ</p>
                <div className="border-b border-gray-400 w-full h-8"></div>
              </div>
              <p className="font-semibold text-gray-900 text-sm">ผู้รับจ้าง</p>
              <p className="text-[13px] text-gray-800 mt-1">
                ({' '}
                {findPartyByRole('ผู้รับจ้าง')?.legal_name ||
                  '................................................'}{' '}
                )
              </p>
              <p className="text-[12px] text-gray-500 mt-2">
                วันที่{' '}
                {findPartyByRole('ผู้รับจ้าง')?.signed_date ||
                  '........ / ........ / ........'}
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="mb-2 w-full max-w-[200px]">
                <p className="text-sm text-gray-600 mb-1">ลงชื่อ</p>
                <div className="border-b border-gray-400 w-full h-8"></div>
              </div>
              <p className="font-semibold text-gray-900 text-sm">พยาน 1</p>
              <p className="text-[13px] text-gray-800 mt-1">
                ({' '}
                {findPartyByRole('พยาน 1')?.legal_name ||
                  '................................................'}{' '}
                )
              </p>
              <p className="text-[12px] text-gray-500 mt-2">
                วันที่{' '}
                {findPartyByRole('พยาน 1')?.signed_date ||
                  '........ / ........ / ........'}
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="mb-2 w-full max-w-[200px]">
                <p className="text-sm text-gray-600 mb-1">ลงชื่อ</p>
                <div className="border-b border-gray-400 w-full h-8"></div>
              </div>
              <p className="font-semibold text-gray-900 text-sm">พยาน 2</p>
              <p className="text-[13px] text-gray-800 mt-1">
                ({' '}
                {findPartyByRole('พยาน 2')?.legal_name ||
                  '................................................'}{' '}
                )
              </p>
              <p className="text-[12px] text-gray-500 mt-2">
                วันที่{' '}
                {findPartyByRole('พยาน 2')?.signed_date ||
                  '........ / ........ / ........'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
