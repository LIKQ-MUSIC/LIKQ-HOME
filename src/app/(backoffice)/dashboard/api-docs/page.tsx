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
      icon: <Users className="w-6 h-6" />,
      accent:
        'bg-primary/10 text-primary dark:bg-blue-500/10 dark:text-blue-300'
    },
    {
      title: 'Quotations',
      description: 'API documentation for Quotations management.',
      href: '/dashboard/quotations/docs',
      icon: <FileText className="w-6 h-6" />,
      accent:
        'bg-success/10 text-success dark:bg-teal-500/10 dark:text-teal-300'
    },
    {
      title: 'PDF Generation',
      description: 'API documentation for PDF generation services.',
      href: '/dashboard/pdf/docs',
      icon: <FileCode className="w-6 h-6" />,
      accent:
        'bg-warning/10 text-warning dark:bg-orange-500/10 dark:text-orange-300'
    },
    {
      title: 'Media Management',
      description: 'API documentation for Media upload and management.',
      href: '/dashboard/media/docs',
      icon: <ImagePlus className="w-6 h-6" />,
      accent:
        'bg-secondary/20 text-secondary-dark dark:bg-purple-500/10 dark:text-purple-300'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title mb-2">API Documentation</h1>
        <p className="text-muted">
          Centralized documentation for all system API domains.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {domains.map(domain => (
          <Link
            key={domain.title}
            href={domain.href}
            className="group relative block p-6 card-base hover:shadow-md hover:border-primary/20 transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`p-3 rounded-lg ${domain.accent} transition-colors`}
              >
                {domain.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-heading group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                  {domain.title}
                </h3>
              </div>
            </div>

            <p className="text-muted text-sm mb-6 min-h-[40px]">
              {domain.description}
            </p>

            <div className="flex items-center text-sm font-medium text-muted group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
              <span>View Documentation</span>
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
