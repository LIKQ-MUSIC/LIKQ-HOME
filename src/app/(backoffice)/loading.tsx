import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-surface p-8 shadow-xl border border-default">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted">Loading...</p>
      </div>
    </div>
  )
}
