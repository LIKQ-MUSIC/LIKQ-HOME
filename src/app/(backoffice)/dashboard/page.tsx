import { Suspense } from 'react'
import WorksCountCard from './components/WorksCountCard'
import StatsSkeleton from './components/StatsSkeleton'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading">Dashboard</h1>
        <p className="mt-2 text-muted">
          Overview of your application activity.
        </p>
      </div>

      <div className="stats-grid">
        {/* Stats Card 1 */}
        <div className="stats-card">
          <div className="flex items-center gap-4">
            <div className="stats-icon-wrapper accent-primary">
              {/* Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-users"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted">Total Users</p>
              <p className="text-2xl font-bold text-heading">2</p>
            </div>
          </div>
        </div>

        {/* Stats Card 2 */}
        <div className="stats-card">
          <div className="flex items-center gap-4">
            <div className="stats-icon-wrapper accent-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-activity"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted">
                Active Sessions
              </p>
              <p className="text-2xl font-bold text-heading">12</p>
            </div>
          </div>
        </div>

        <Suspense fallback={<StatsSkeleton />}>
          <WorksCountCard />
        </Suspense>
      </div>

      {/* Content Area Example */}
      <div className="card-base p-6">
        <h2 className="text-lg font-semibold text-heading mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-default pb-4 last:border-0 last:pb-0">
            <div className="flex flex-col">
              <span className="text-body text-sm">New user registered</span>
              <span className="text-subtle text-xs">Phuree K. via Email</span>
            </div>
            <span className="text-subtle text-xs">2 mins ago</span>
          </div>
          <div className="flex items-center justify-between border-b border-default pb-4 last:border-0 last:pb-0">
            <div className="flex flex-col">
              <span className="text-body text-sm">Work item updated</span>
              <span className="text-subtle text-xs">
                "Summer Vibes" Project
              </span>
            </div>
            <span className="text-subtle text-xs">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
