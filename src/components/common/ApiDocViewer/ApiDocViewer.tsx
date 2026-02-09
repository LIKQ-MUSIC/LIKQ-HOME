'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react'

export interface ApiParam {
  name: string
  type: string
  required: boolean
  description: string
}

export interface ApiResponse {
  status: number
  description: string
  example: any
}

export interface ApiEndpoint {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  title: string
  description?: string
  authentication?: boolean
  permissions?: string[]
  pathParams?: ApiParam[]
  queryParams?: ApiParam[]
  bodyParams?: ApiParam[]
  responses: ApiResponse[]
}

export interface ApiDocViewerProps {
  title: string
  description?: string
  baseUrl: string
  endpoints: ApiEndpoint[]
}

const MethodBadge = ({ method }: { method: string }) => {
  const colors: Record<string, string> = {
    GET: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    POST: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    PUT: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
    DELETE:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
    PATCH:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
  }

  return (
    <span
      className={`px-3 py-1 rounded-md text-sm font-bold border ${
        colors[method] ||
        'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700'
      }`}
    >
      {method}
    </span>
  )
}

const JsonViewer = ({ data }: { data: any }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="p-1 rounded bg-neutral-200 hover:bg-neutral-300 text-neutral-500 hover:text-neutral-700 border border-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-300 dark:border-neutral-600"
          title="Copy JSON"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="bg-primary text-neutral-200 p-4 rounded-lg overflow-x-auto text-sm font-mono custom-scrollbar border border-primary-active">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

const EndpointItem = ({
  endpoint,
  baseUrl
}: {
  endpoint: ApiEndpoint
  baseUrl: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const methodBorderColors: Record<string, string> = {
    GET: 'border-l-blue-500',
    POST: 'border-l-green-500',
    PUT: 'border-l-orange-500',
    DELETE: 'border-l-red-500',
    PATCH: 'border-l-amber-500'
  }

  return (
    <div
      className={`border rounded-xl mb-4 overflow-hidden transition-all duration-200 ${
        isOpen
          ? 'shadow-md border-neutral-300 dark:border-neutral-600'
          : 'shadow-sm border-neutral-200 dark:border-neutral-700'
      } bg-white dark:bg-[#1E293B]`}
    >
      <div
        className={`p-4 cursor-pointer flex items-center justify-between border-l-4 ${
          methodBorderColors[endpoint.method] || 'border-l-neutral-300'
        } ${isOpen ? 'bg-neutral-50 dark:bg-[#0F172A]' : 'hover:bg-neutral-50 dark:hover:bg-white/5'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4 flex-1 overflow-hidden">
          <MethodBadge method={endpoint.method} />
          <code className="text-sm font-semibold text-primary dark:text-blue-300 font-mono truncate">
            {endpoint.path}
          </code>
          <span className="text-neutral-400 text-sm hidden sm:inline-block truncate">
            - {endpoint.title}
          </span>
        </div>
        <div className="text-neutral-400">
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </div>

      {isOpen && (
        <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-[#0F172A]/50">
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-heading mb-2">
              Description
            </h4>
            <p className="text-muted text-sm">
              {endpoint.description || endpoint.title}
            </p>
            {endpoint.authentication && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary-dark border border-secondary/30 dark:text-neutral-300">
                  Authentication Required
                </span>
                {endpoint.permissions?.map(perm => (
                  <span
                    key={perm}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
                  >
                    Permission: {perm}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-2">
              <span className="text-xs text-muted font-mono">
                Full URL: {baseUrl}
                {endpoint.path}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Request Section */}
            <div className="space-y-6">
              {(endpoint.pathParams?.length ?? 0) > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-heading mb-3 border-b border-neutral-200 dark:border-neutral-700 pb-1">
                    Path Parameters
                  </h4>
                  <div className="space-y-2">
                    {endpoint.pathParams?.map(param => (
                      <div
                        key={param.name}
                        className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-sm"
                      >
                        <div className="min-w-[120px]">
                          <code className="text-warning font-bold dark:text-orange-400">
                            {param.name}
                          </code>
                          {param.required && (
                            <span className="text-danger ml-1">*</span>
                          )}
                        </div>
                        <div className="text-neutral-400 italic text-xs">
                          {param.type}
                        </div>
                        <div className="text-body flex-1">
                          {param.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(endpoint.queryParams?.length ?? 0) > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-heading mb-3 border-b border-neutral-200 dark:border-neutral-700 pb-1">
                    Query Parameters
                  </h4>
                  <div className="space-y-2">
                    {endpoint.queryParams?.map(param => (
                      <div
                        key={param.name}
                        className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-sm"
                      >
                        <div className="min-w-[120px]">
                          <code className="text-primary font-bold dark:text-blue-400">
                            {param.name}
                          </code>
                          {param.required && (
                            <span className="text-danger ml-1">*</span>
                          )}
                        </div>
                        <div className="text-neutral-400 italic text-xs">
                          {param.type}
                        </div>
                        <div className="text-body flex-1">
                          {param.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(endpoint.bodyParams?.length ?? 0) > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-heading mb-3 border-b border-neutral-200 dark:border-neutral-700 pb-1">
                    Request Body
                  </h4>
                  <div className="space-y-2">
                    {endpoint.bodyParams?.map(param => (
                      <div
                        key={param.name}
                        className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-sm"
                      >
                        <div className="min-w-[120px]">
                          <code className="text-secondary-dark font-bold dark:text-purple-400">
                            {param.name}
                          </code>
                          {param.required && (
                            <span className="text-danger ml-1">*</span>
                          )}
                        </div>
                        <div className="text-neutral-400 italic text-xs">
                          {param.type}
                        </div>
                        <div className="text-body flex-1">
                          {param.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Response Section */}
            <div>
              <h4 className="text-sm font-semibold text-heading mb-3 border-b border-neutral-200 dark:border-neutral-700 pb-1">
                Responses
              </h4>
              <div className="space-y-4">
                {endpoint.responses.map((response, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          response.status >= 200 && response.status < 300
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : response.status >= 400
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                        }`}
                      >
                        {response.status}
                      </span>
                      <span className="text-sm text-muted">
                        {response.description}
                      </span>
                    </div>
                    {response.example && <JsonViewer data={response.example} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ApiDocViewer({
  title,
  description,
  baseUrl,
  endpoints
}: ApiDocViewerProps) {
  const [filter, setFilter] = useState('')

  const filteredEndpoints = endpoints.filter(
    ep =>
      filter === '' ||
      ep.path.includes(filter) ||
      ep.title.toLowerCase().includes(filter.toLowerCase()) ||
      ep.method.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="card-base p-6">
        <h1 className="text-2xl font-bold text-heading">{title}</h1>
        {description && (
          <p className="mt-2 text-muted text-sm">{description}</p>
        )}
        <div className="mt-4 flex items-center gap-2 text-sm text-muted">
          <span className="font-semibold text-body">Base URL:</span>
          <code className="bg-primary/5 px-2 py-1 rounded text-primary border border-primary/10 text-xs">
            {baseUrl}
          </code>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Filter endpoints..."
          className="input-base pl-4 pr-10"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <div className="absolute right-3 top-2.5 text-neutral-400">
          <SearchIcon />
        </div>
      </div>

      <div className="space-y-4">
        {filteredEndpoints.map(endpoint => (
          <EndpointItem
            key={endpoint.id}
            endpoint={endpoint}
            baseUrl={baseUrl}
          />
        ))}

        {filteredEndpoints.length === 0 && (
          <div className="text-center py-12 text-muted card-base border-dashed">
            No endpoints found matching your filter.
          </div>
        )}
      </div>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )
}
