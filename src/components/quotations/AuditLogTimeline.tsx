'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { Clock, User, FileText } from 'lucide-react'
import { formatDateTimeShort } from '@/utils/date'

interface AuditLog {
  id: string
  user_id: string | null
  user_name?: string | null
  user_email?: string | null
  action: string
  target_table: string
  target_id: string | null
  old_value: any
  new_value: any
  created_at: string
}

interface AuditLogTimelineProps {
  quotationId: string
}

export default function AuditLogTimeline({
  quotationId
}: AuditLogTimelineProps) {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs', 'quotation', quotationId],
    queryFn: async () => {
      const res = await apiClient.get(`/quotations/${quotationId}/audit-logs`)
      return res.data as AuditLog[]
    }
  })

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE_QUOTATION: 'Created',
      UPDATE_QUOTATION: 'Updated',
      APPROVE_QUOTATION: 'Approved',
      REJECT_QUOTATION: 'Rejected'
    }
    return labels[action] || action
  }

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE_QUOTATION: 'bg-blue-500',
      UPDATE_QUOTATION: 'bg-yellow-500',
      APPROVE_QUOTATION: 'bg-green-500',
      REJECT_QUOTATION: 'bg-red-500'
    }
    return colors[action] || 'bg-gray-500'
  }

  if (isLoading) {
    return (
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock size={20} />
          Activity Timeline
        </h2>
        <div className="text-zinc-400 text-center py-8">Loading...</div>
      </div>
    )
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock size={20} />
          Activity Timeline
        </h2>
        <div className="text-zinc-400 text-center py-8">
          No activity recorded yet
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Clock size={20} />
        Activity Timeline
      </h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-700" />

        {/* Timeline items */}
        <div className="space-y-6">
          {logs.map((log, index) => (
            <div key={log.id} className="relative pl-12">
              {/* Timeline dot */}
              <div
                className={`absolute left-0 w-8 h-8 rounded-full ${getActionColor(log.action)} flex items-center justify-center`}
              >
                <FileText size={16} className="text-white" />
              </div>

              {/* Content */}
              <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-semibold">
                      {getActionLabel(log.action)}
                    </h3>
                    <p className="text-sm text-zinc-400 flex items-center gap-1 mt-1">
                      <User size={14} />
                      {log.user_name ||
                        log.user_email ||
                        log.user_id ||
                        'System'}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {formatDateTimeShort(log.created_at)}
                  </span>
                </div>

                {/* Show changes if available */}
                {log.new_value && (
                  <div className="mt-3 pt-3 border-t border-zinc-700">
                    <details className="text-sm">
                      <summary className="cursor-pointer text-zinc-400 hover:text-zinc-300">
                        View details
                      </summary>
                      <div className="mt-2 bg-zinc-900 rounded p-3 overflow-auto max-h-48">
                        <pre className="text-xs text-zinc-300">
                          {JSON.stringify(log.new_value, null, 2)}
                        </pre>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
