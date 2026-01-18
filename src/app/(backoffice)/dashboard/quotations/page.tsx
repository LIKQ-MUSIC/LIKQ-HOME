'use client'

import React from 'react'
import Link from 'next/link'
import { Book } from 'lucide-react'

export default function QuotationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Quotations</h1>
          <p className="text-zinc-400 mt-1">Manage quotations</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/quotations/docs"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700"
          >
            <Book size={20} />
            <span>API Docs</span>
          </Link>
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/50 text-white/50 cursor-not-allowed rounded-lg transition-colors"
          >
            <span>+ Create Quotation</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center h-64 border border-zinc-800 rounded-lg bg-zinc-900 border-dashed">
        <span className="text-zinc-500">Quotation management coming soon.</span>
      </div>
    </div>
  )
}
