import { Loader2 } from 'lucide-react'

export default function BackofficeLoading() {
  return (
    <main className="flex-1 overflow-y-auto bg-page p-4 lg:p-8">
      <div className="mx-auto max-w-5xl flex h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    </main>
  )
}
