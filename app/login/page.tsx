export const dynamic = 'force-dynamic';

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/products'

  useEffect(() => {
    setError('')
  }, [mode])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const url = mode === 'login' ? '/api/login' : '/api/signup'
      const body =
        mode === 'login'
          ? { email: email.trim(), password: password.trim() }
          : { name: name.trim(), email: email.trim(), password: password.trim() }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        try {
          window.dispatchEvent(
            new CustomEvent('aurelia:auth:login', {
              detail: {
                email: (data.user?.email ?? email).trim(),
                name: (data.user?.name ?? name).trim(),
              },
            })
          )
          localStorage.setItem('aj-auth-ping', String(Date.now()))
        } catch {}
        router.push(returnTo)
        router.refresh()
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated blush gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f3e2c3] via-[#e4cead] to-[#d8b487] animate-gradient-slow" />
      {/* glow highlight */}
      <div className="absolute -top-28 left-1/2 w-[500px] h-[500px] -translate-x-1/2 rounded-full bg-white/40 blur-3xl opacity-50 pointer-events-none" />

      <div className="relative w-full max-w-md bg-white/30 backdrop-blur-2xl border border-white/40 rounded-3xl p-6 sm:p-8 drop-shadow-lg">
        {/* Tabs */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <button
            className={`pb-2 text-sm tracking-wide ${
              mode === 'login'
                ? 'text-gray-900 font-semibold border-b-2 border-gray-900'
                : 'text-gray-700 hover:text-gray-900'
            }`}
            onClick={() => setMode('login')}
          >
            Sign in
          </button>
          <button
            className={`pb-2 text-sm tracking-wide ${
              mode === 'signup'
                ? 'text-gray-900 font-semibold border-b-2 border-gray-900'
                : 'text-gray-700 hover:text-gray-900'
            }`}
            onClick={() => setMode('signup')}
          >
            Create account
          </button>
        </div>

        <div className="text-center mb-6">
          <h1 className="font-playfair text-3xl text-gray-900">
            {mode === 'login' ? 'Welcome Back' : 'Join Aurelia'}
          </h1>
          <p className="text-gray-700 mt-1">
            {mode === 'login'
              ? 'Sign in to continue shopping'
              : 'Create your account to save favorites & checkout faster'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                placeholder="Aurelia Customer"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="you@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-300 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            {loading
              ? (mode === 'login' ? 'Signing in…' : 'Creating account…')
              : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {mode === 'login' && (
          <p className="mt-4 text-center text-xs text-gray-700">
            Don’t have an account?{' '}
            <button className="underline underline-offset-2" onClick={() => setMode('signup')}>
              Create one
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
