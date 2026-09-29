'use client'

import { useState } from 'react'
import { services, site, smsHref, telHref } from '@/content/site'
import Button from '@/components/ui/Button'

type Status = 'idle' | 'sending' | 'sent' | 'fallback'

const projectTypes = ['New construction', 'Remodel', 'Improvement', 'Not sure yet']
const contactMethods = ['Phone call', 'Text message', 'Email']

function Field({ code, label, htmlFor, children, optional }: { code: string; label: string; htmlFor?: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div className="relative">
      <label htmlFor={htmlFor} className="mono-tag flex items-center gap-3 text-bone/55">
        <span className="text-gold">{code}</span>
        {label}
        {optional && <span className="text-bone/30">(optional)</span>}
      </label>
      {children}
    </div>
  )
}

export default function EstimateForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [summary, setSummary] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const data = Object.fromEntries(fd.entries()) as Record<string, string>
    if (!data.phone && !data.email) {
      setError('Please add a phone number or an email so Eduardo can reach you.')
      return
    }
    setError('')
    setStatus('sending')

    const text = [
      `Hi Eduardo, I'd like a free estimate.`,
      `Name: ${data.name}`,
      data.phone && `Phone: ${data.phone}`,
      data.email && `Email: ${data.email}`,
      data.projectType && `Project: ${data.projectType}`,
      data.sector && `Type: ${data.sector}`,
      data.service && `Service: ${data.service}`,
      data.description && `Details: ${data.description}`,
      data.contactMethod && `Best way to reach me: ${data.contactMethod}`,
    ]
      .filter(Boolean)
      .join('\n')
    setSummary(text)

    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('sent')
        form.reset()
        return
      }
      setStatus('fallback')
    } catch {
      setStatus('fallback')
    }
  }

  if (status === 'sent') {
    return (
      <div className="border border-gold/40 p-8 md:p-12" role="status">
        <p className="mono-tag text-gold">Request received</p>
        <p className="display mt-4 text-4xl text-bone md:text-5xl">Thank you.</p>
        <p className="mt-4 max-w-md text-bone/70">
          Your estimate request was sent. {site.contact.name} will get back to you. For anything urgent, call{' '}
          <a className="text-gold underline underline-offset-4" href={telHref}>
            {site.contact.phoneDisplay}
          </a>
          .
        </p>
      </div>
    )
  }

  if (status === 'fallback') {
    return (
      <div className="border border-gold/40 p-8 md:p-12" role="alert">
        <p className="mono-tag text-gold">One more step</p>
        <p className="display mt-4 text-3xl text-bone md:text-4xl">Send it straight to {site.contact.name}.</p>
        <p className="mt-4 max-w-lg text-bone/70">
          Online requests couldn&apos;t be delivered right now. Your details are ready to go — tap below to text them, or
          call directly.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href={smsHref(summary)} variant="solid">
            Text my request
          </Button>
          <Button href={telHref} variant="ghost">
            Call {site.contact.phoneDisplay}
          </Button>
        </div>
        <button type="button" onClick={() => setStatus('idle')} className="mono-tag mt-8 text-bone/50 underline underline-offset-4 hover:text-bone">
          Back to the form
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-x-10 gap-y-9 md:grid-cols-2" noValidate={false}>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <Field code="A-01" label="Name" htmlFor="f-name">
        <input id="f-name" name="name" required autoComplete="name" className="field" placeholder="Your full name" />
      </Field>
      <Field code="A-02" label="Phone" htmlFor="f-phone">
        <input id="f-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" className="field" placeholder="(000) 000-0000" />
      </Field>
      <Field code="A-03" label="Email" htmlFor="f-email" optional>
        <input id="f-email" name="email" type="email" autoComplete="email" className="field" placeholder="you@email.com" />
      </Field>
      <Field code="A-04" label="Project type" htmlFor="f-type">
        <select id="f-type" name="projectType" className="field" defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          {projectTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>

      <fieldset className="md:col-span-1">
        <legend className="mono-tag flex items-center gap-3 text-bone/55">
          <span className="text-gold">A-05</span> Residential / Commercial
        </legend>
        <div className="mt-4 flex gap-3">
          {['Residential', 'Commercial'].map((s) => (
            <label key={s} className="relative flex-1">
              <input type="radio" name="sector" value={s} className="peer sr-only" defaultChecked={s === 'Residential'} />
              <span className="display-wide block border border-bone/20 px-4 py-3.5 text-center text-xs text-bone/70 transition-colors peer-checked:border-gold peer-checked:bg-gold/10 peer-checked:text-gold peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
                {s}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field code="A-06" label="Service needed" htmlFor="f-service">
        <select id="f-service" name="service" className="field" defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          {services.map((s) => (
            <option key={s.id} value={s.id === 'more' ? 'Other' : s.name}>
              {s.id === 'more' ? 'Something else' : s.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="md:col-span-2">
        <Field code="A-07" label="Project description" htmlFor="f-desc">
          <textarea id="f-desc" name="description" rows={4} className="field resize-none" placeholder="Tell us about the space and what you have in mind" />
        </Field>
      </div>

      <fieldset className="md:col-span-2">
        <legend className="mono-tag flex items-center gap-3 text-bone/55">
          <span className="text-gold">A-08</span> Preferred contact method
        </legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {contactMethods.map((m) => (
            <label key={m} className="relative">
              <input type="radio" name="contactMethod" value={m} className="peer sr-only" defaultChecked={m === 'Phone call'} />
              <span className="display-wide block border border-bone/20 px-5 py-3.5 text-xs text-bone/70 transition-colors peer-checked:border-gold peer-checked:bg-gold/10 peer-checked:text-gold peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
                {m}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-bone/50" aria-live="polite">
          {error || 'Free estimates · English / Español'}
        </p>
        <Button type="submit" variant="solid" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Request Free Estimate'}
        </Button>
      </div>
    </form>
  )
}
