export default function StatsSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm animate-pulse">
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-zinc-800 p-3 h-12 w-12" />
        <div className="space-y-2">
          <div className="h-4 w-16 bg-zinc-800 rounded" />
          <div className="h-8 w-8 bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  )
}
