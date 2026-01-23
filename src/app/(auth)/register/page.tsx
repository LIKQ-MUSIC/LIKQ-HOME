'use client'

import React, { useTransition, useState } from 'react'
import { signup } from '@/actions/auth'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)

    // Basic client-side validation could go here
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm-password') as string

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    startTransition(async () => {
      const result = await signup(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-sm space-y-8 rounded-xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Get started with your dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
              {error}
            </div>
          )}
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="relative block w-full rounded-md border-zinc-700 bg-zinc-800 text-zinc-300 placeholder-zinc-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-3"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-md border-zinc-700 bg-zinc-800 text-zinc-300 placeholder-zinc-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-3"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full rounded-md border-zinc-700 bg-zinc-800 text-zinc-300 placeholder-zinc-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-3"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full rounded-md border-zinc-700 bg-zinc-800 text-zinc-300 placeholder-zinc-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-3"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {isPending ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Sign up'
              )}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-zinc-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
