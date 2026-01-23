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
    GET: 'bg-blue-900/30 text-blue-300 border-blue-800',
    POST: 'bg-green-900/30 text-green-300 border-green-800',
    PUT: 'bg-orange-900/30 text-orange-300 border-orange-800',
    DELETE: 'bg-red-900/30 text-red-300 border-red-800',
    PATCH: 'bg-yellow-900/30 text-yellow-300 border-yellow-800'
  }

  return (
    <span
      className={`px-3 py-1 rounded-md text-sm font-bold border ${
        colors[method] || 'bg-zinc-800 text-zinc-300 border-zinc-700'
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
          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700"
          title="Copy JSON"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="bg-zinc-950 text-zinc-300 p-4 rounded-lg overflow-x-auto text-sm font-mono custom-scrollbar border border-zinc-800">
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

  const methodColors: Record<string, string> = {
    GET: 'border-blue-900/50 hover:bg-zinc-800/50',
    POST: 'border-green-900/50 hover:bg-zinc-800/50',
    PUT: 'border-orange-900/50 hover:bg-zinc-800/50',
    DELETE: 'border-red-900/50 hover:bg-zinc-800/50',
    PATCH: 'border-yellow-900/50 hover:bg-zinc-800/50'
  }

  const methodBorderColors: Record<string, string> = {
    GET: 'border-l-blue-500',
    POST: 'border-l-green-500',
    PUT: 'border-l-orange-500',
    DELETE: 'border-l-red-500',
    PATCH: 'border-l-yellow-500'
  }

  return (
    <div
      className={`border rounded-xl mb-4 overflow-hidden transition-all duration-200 ${
        isOpen ? 'shadow-md border-zinc-700' : 'shadow-sm border-zinc-800'
      } bg-zinc-900`}
    >
      <div
        className={`p-4 cursor-pointer flex items-center justify-between border-l-4 ${
          methodBorderColors[endpoint.method] || 'border-l-zinc-300'
        } ${isOpen ? 'bg-zinc-800/50' : 'hover:bg-zinc-800/30'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4 flex-1 overflow-hidden">
          <MethodBadge method={endpoint.method} />
          <code className="text-sm font-semibold text-zinc-200 font-mono truncate">
            {endpoint.path}
          </code>
          <span className="text-zinc-500 text-sm hidden sm:inline-block truncate">
            - {endpoint.title}
          </span>
        </div>
        <div className="text-zinc-400">
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </div>

      {isOpen && (
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50">
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-2">
              Description
            </h4>
            <p className="text-zinc-400 text-sm">
              {endpoint.description || endpoint.title}
            </p>
            {endpoint.authentication && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300 border border-purple-800">
                  Authentication Required
                </span>
                {endpoint.permissions?.map(perm => (
                  <span
                    key={perm}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700"
                  >
                    Permission: {perm}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-2">
              <span className="text-xs text-zinc-500 font-mono">
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
                  <h4 className="text-sm font-semibold text-white mb-3 border-b border-zinc-800 pb-1">
                    Path Parameters
                  </h4>
                  <div className="space-y-2">
                    {endpoint.pathParams?.map(param => (
                      <div
                        key={param.name}
                        className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-sm"
                      >
                        <div className="min-w-[120px]">
                          <code className="text-red-400 font-bold">
                            {param.name}
                          </code>
                          {param.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </div>
                        <div className="text-zinc-500 italic text-xs">
                          {param.type}
                        </div>
                        <div className="text-zinc-400 flex-1">
                          {param.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(endpoint.queryParams?.length ?? 0) > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3 border-b border-zinc-800 pb-1">
                    Query Parameters
                  </h4>
                  <div className="space-y-2">
                    {endpoint.queryParams?.map(param => (
                      <div
                        key={param.name}
                        className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-sm"
                      >
                        <div className="min-w-[120px]">
                          <code className="text-blue-400 font-bold">
                            {param.name}
                          </code>
                          {param.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </div>
                        <div className="text-zinc-500 italic text-xs">
                          {param.type}
                        </div>
                        <div className="text-zinc-400 flex-1">
                          {param.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(endpoint.bodyParams?.length ?? 0) > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3 border-b border-zinc-800 pb-1">
                    Request Body
                  </h4>
                  <div className="space-y-2">
                    {endpoint.bodyParams?.map(param => (
                      <div
                        key={param.name}
                        className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-sm"
                      >
                        <div className="min-w-[120px]">
                          <code className="text-purple-400 font-bold">
                            {param.name}
                          </code>
                          {param.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </div>
                        <div className="text-zinc-500 italic text-xs">
                          {param.type}
                        </div>
                        <div className="text-zinc-400 flex-1">
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
              <h4 className="text-sm font-semibold text-white mb-3 border-b border-zinc-800 pb-1">
                Responses
              </h4>
              <div className="space-y-4">
                {endpoint.responses.map((response, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          response.status >= 200 && response.status < 300
                            ? 'bg-green-900/30 text-green-300 border border-green-800'
                            : response.status >= 400
                              ? 'bg-red-900/30 text-red-300 border border-red-800'
                              : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {response.status}
                      </span>
                      <span className="text-sm text-zinc-400">
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
      <div className="bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-800">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && (
          <p className="mt-2 text-zinc-400 text-sm">{description}</p>
        )}
        <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
          <span className="font-semibold text-zinc-300">Base URL:</span>
          <code className="bg-zinc-950 px-2 py-1 rounded text-zinc-300 border border-zinc-800">
            {baseUrl}
          </code>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Filter endpoints..."
          className="w-full pl-4 pr-10 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white placeholder:text-zinc-600"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <div className="absolute right-3 top-2.5 text-zinc-500">
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
          <div className="text-center py-12 text-zinc-500 bg-zinc-900 rounded-xl border border-dashed border-zinc-800">
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
