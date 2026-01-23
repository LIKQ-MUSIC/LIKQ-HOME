import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-zinc-900 p-8 shadow-xl border border-zinc-800">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="text-sm font-medium text-zinc-400">
          Loading Dashboard...
        </p>
      </div>
    </div>
  )
}
