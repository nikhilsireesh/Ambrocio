import { NextResponse } from 'next/server'

type Estimate = {
  name: string
  phone: string
  email?: string
  projectType?: string
  sector?: string
  service?: string
  description?: string
  contactMethod?: string
  company?: string // honeypot
}

const clean = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

/**
 * Receives estimate requests and forwards them to ESTIMATE_WEBHOOK_URL
 * (Formspree, Zapier, Make, Slack incoming webhook, a CRM…).
 * Without a webhook configured it answers 503 so the page can offer text/call instead —
 * requests are never silently dropped.
 */
export async function POST(req: Request) {
  let body: Estimate
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid' }, { status: 400 })
  }

  // bots fill the hidden field; pretend success
  if (clean(body.company)) return NextResponse.json({ ok: true })

  const data = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 40),
    email: clean(body.email, 160),
    projectType: clean(body.projectType, 80),
    sector: clean(body.sector, 40),
    service: clean(body.service, 80),
    description: clean(body.description, 2000),
    contactMethod: clean(body.contactMethod, 40),
  }

  if (!data.name || (!data.phone && !data.email)) {
    return NextResponse.json({ ok: false, reason: 'missing' }, { status: 422 })
  }

  const webhook = process.env.ESTIMATE_WEBHOOK_URL
  if (!webhook) {
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  const text = [
    `New free-estimate request — ${data.name}`,
    `Phone: ${data.phone || '—'}   Email: ${data.email || '—'}`,
    `Project: ${data.projectType || '—'} · ${data.sector || '—'} · ${data.service || '—'}`,
    `Preferred contact: ${data.contactMethod || '—'}`,
    data.description ? `\n${data.description}` : '',
  ].join('\n')

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...data, text, source: 'website', submittedAt: new Date().toISOString() }),
    })
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`)
  } catch (err) {
    console.error('[estimate] delivery failed', err)
    return NextResponse.json({ ok: false, reason: 'delivery_failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
