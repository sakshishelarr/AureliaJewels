// lib/session.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface SessionData { email: string; name: string }

export async function getSession(): Promise<SessionData | null> {
  try {
    const store = await cookies()
    const raw = store.get('session')?.value
    if (!raw) return null
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf8'))
  } catch {
    return null
  }
}

export function setSession(response: NextResponse, data: SessionData) {
  const raw = Buffer.from(JSON.stringify(data)).toString('base64')
  response.cookies.set('session', raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export function clearSession(response: NextResponse) {
  response.cookies.delete('session')
}
