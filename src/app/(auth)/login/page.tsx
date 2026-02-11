'use client'

import React, { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/actions/auth'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { Input } from '@/ui/Input'
import Button from '@/ui/Button'
import { Label } from '@/ui/Label'
import GoogleButton from '@/components/auth/GoogleButton'

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#153051] to-[#0f2340] px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Image
            src="/logo-default.svg"
            alt="LIKQ"
            width={120}
            height={40}
            className="mx-auto"
            priority
          />
          <h2 className="mt-8 text-2xl font-bold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Sign in to access your dashboard
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-200 border border-red-500/20 text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Email address</Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white/80">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-white/60 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/20"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white border-0"
            >
              {isPending ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#122946] px-2 text-white/40 text-xs uppercase">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleButton />
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-white/40">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-white hover:text-indigo-300 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
