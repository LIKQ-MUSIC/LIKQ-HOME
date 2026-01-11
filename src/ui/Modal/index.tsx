'use client'

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
}

const Modal = ({ isOpen, onClose, children, title, className }: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 p-4"
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          'bg-white border border-transparent rounded-2xl shadow-xl w-full max-w-4xl relative overflow-hidden animate-modal',
          className
        )}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100 absolute right-0 top-0 z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 md:p-8 pt-12 md:pt-14 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
