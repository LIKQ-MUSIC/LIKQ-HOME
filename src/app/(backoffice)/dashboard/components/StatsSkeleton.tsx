export default function StatsSkeleton() {
  return (
    <div className="stats-card animate-pulse">
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-neutral-200 p-3 h-12 w-12" />
        <div className="space-y-2">
          <div className="h-4 w-16 bg-neutral-200 rounded" />
          <div className="h-8 w-8 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  )
}
