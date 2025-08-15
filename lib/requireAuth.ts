// lib/requireAuth.ts
'use client'
import { useRouter, usePathname } from 'next/navigation'

export function useRequireAuth() {
  const router = useRouter()
  const pathname = usePathname()
  return async () => {
    const res = await fetch('/api/me', { cache: 'no-store' })
    const user = await res.json()
    if (!user?.loggedIn) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`)
      return false
    }
    return true
  }
}
