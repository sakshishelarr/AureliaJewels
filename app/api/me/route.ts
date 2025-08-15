// app/api/me/route.ts
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function GET() {
  try {
    const session = await getSession()
    if (session) {
      return NextResponse.json({
        loggedIn: true,
        email: session.email,
        name: session.name,
      })
    }
    return NextResponse.json({ loggedIn: false })
  } catch {
    return NextResponse.json({ loggedIn: false })
  }
}
