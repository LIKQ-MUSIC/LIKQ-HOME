import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold text-danger">Unauthorized</h1>
      <p className="text-muted">
        You don&apos;t have permission to access this page.
      </p>
      <Link
        href="/dashboard"
        className="text-primary hover:text-primary-hover font-medium"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
