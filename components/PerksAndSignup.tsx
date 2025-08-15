'use client'

import { useState } from 'react'

function Perk({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3 px-4">
      <div className="h-14 w-14 rounded-full bg-champagne/40 flex items-center justify-center">
        <span className="text-2xl">{icon}</span>
      </div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-600 max-w-[20rem]">{desc}</p>
    </div>
  )
}

export default function PerksAndSignup() {
  const [email, setEmail] = useState('')
  const [ok, setOk] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ok || !email) return
    try {
      setLoading(true)
      // Optional: wire up to your backend — this route just returns { ok: true }
      await fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
      })
      setDone(true)
      setEmail('')
      setOk(false)
    } catch {
      // no-op for demo
    } finally {
      setLoading(false)
    }
  }

  return (
    <section aria-labelledby="perks" >
      
      <div className="bg-alabaster">
        <div className="container mx-auto px-4 pt-6 pb-10 md:pt-8 md:pb-12 -mt-4 md:-mt-6">
          <div className="glass-card luxury-shadow bg-white/70 rounded-2xl p-6 md:p-8">
            <div className="grid md:grid-cols-5 gap-6 md:gap-10 items-center">
              <div className="md:col-span-2 space-y-2">
                <p className="uppercase tracking-[0.2em] text-xs text-gray-500">
                  Exclusive invite
                </p>
                <h3 className="font-playfair text-2xl md:text-3xl text-black">
                  10% off your next purchase
                </h3>
                <p className="text-sm text-gray-600">
                  Join our circle for early access to new drops, styling tips, and
                  private events.
                </p>
              </div>

              <form
                onSubmit={onSubmit}
                className="md:col-span-3 flex flex-col gap-3"
                aria-label="newsletter signup"
              >
                <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 outline-none"
                    aria-label="Email address"
                  />
                  <button
                    type="submit"
                    disabled={!ok || loading}
                    className="px-5 md:px-6 py-3 bg-softgold text-white font-semibold disabled:opacity-60"
                  >
                    {loading ? 'Signing up…' : done ? 'Thanks!' : 'Sign Up'}
                  </button>
                </div>

                <label className="flex items-start gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={ok}
                    onChange={(e) => setOk(e.target.checked)}
                    className="mt-0.5"
                  />
                  I accept the{' '}
                  <a href="#" className="underline underline-offset-2">
                    privacy policy
                  </a>
                  .
                </label>

                <p className="text-[11px] text-gray-500">
                  *Exclusions apply. You’ll receive a single-use code by email.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
