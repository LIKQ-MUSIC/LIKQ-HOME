'use client'

import React from 'react'
import Link from 'next/link'
import {
  Book,
  ChevronRight,
  FileText,
  Users,
  FileCode,
  ImagePlus
} from 'lucide-react'

export default function ApiDocsPage() {
  const domains = [
    {
      title: 'Parties',
      description: 'API documentation for Parties management.',
      href: '/dashboard/parties/docs',
      icon: <Users className="w-6 h-6 text-indigo-400" />
    },
    {
      title: 'Quotations',
      description: 'API documentation for Quotations management.',
      href: '/dashboard/quotations/docs',
      icon: <FileText className="w-6 h-6 text-teal-400" />
    },
    {
      title: 'PDF Generation',
      description: 'API documentation for PDF generation services.',
      href: '/dashboard/pdf/docs',
      icon: <FileCode className="w-6 h-6 text-red-400" />
    },
    {
      title: 'Media Management',
      description: 'API documentation for Media upload and management.',
      href: '/dashboard/media/docs',
      icon: <ImagePlus className="w-6 h-6 text-purple-400" />
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          API Documentation
        </h1>
        <p className="text-zinc-400">
          Centralized documentation for all system API domains.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map(domain => (
          <Link
            key={domain.title}
            href={domain.href}
            className="group relative block p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800/50 hover:border-zinc-700 transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                {domain.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                  {domain.title}
                </h3>
              </div>
            </div>

            <p className="text-zinc-400 text-sm mb-6 min-h-[40px]">
              {domain.description}
            </p>

            <div className="flex items-center text-sm font-medium text-zinc-500 group-hover:text-white transition-colors">
              <span>View Documentation</span>
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
