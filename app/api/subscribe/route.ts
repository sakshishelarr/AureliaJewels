import { NextResponse } from 'next/server'

export async function POST() {
  // TODO: send to your email provider (e.g., Resend, Mailchimp)
  return NextResponse.json({ ok: true })
}
