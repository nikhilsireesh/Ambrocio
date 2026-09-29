import type { Metadata, Viewport } from 'next'
import { Archivo, Manrope, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { site } from '@/content/site'
import SmoothScroll from '@/components/ui/SmoothScroll'
import Cursor from '@/components/ui/Cursor'

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

const title = 'Ambrocio Construction & Remodeling | DFW Construction & Remodeling'
const description =
  'General construction and remodeling for residential and commercial spaces across the DFW Metroplex and surrounding areas. Kitchens, bathrooms, framing, decks, flooring and more. Licensed and insured. Free estimates — call Eduardo at 432-999-2398. English / Español.'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  applicationName: site.name,
  keywords: [
    'Ambrocio Construction & Remodeling',
    'DFW construction',
    'DFW remodeling',
    'residential construction DFW',
    'commercial construction DFW',
    'home remodeling DFW',
    'kitchen remodeling DFW',
    'bathroom remodeling DFW',
    'general construction DFW',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: site.name,
    title,
    description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  formatDetection: { telephone: true },
}

export const viewport: Viewport = {
  themeColor: '#F8F5EE',
  colorScheme: 'light',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: site.name,
  slogan: site.tagline,
  description,
  url: site.url,
  telephone: site.contact.phoneE164,
  areaServed: { '@type': 'Place', name: 'Dallas–Fort Worth Metroplex, Texas' },
  knowsLanguage: ['en', 'es'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: site.contact.phoneE164,
    contactType: 'sales',
    name: site.contact.name,
    availableLanguage: ['English', 'Spanish'],
  },
  makesOffer: [
    'General Construction',
    'Framing',
    'Cornice & Trim',
    'Decks & Patios',
    'Kitchen Remodeling',
    'Bathroom Remodeling',
    'Drywall & Texture',
    'Fence Installation',
    'Carpentry',
    'Door & Window Installation',
    'Tile & Flooring',
    'Demo & Haul Away',
  ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${manrope.variable} ${instrument.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-gold focus:px-4 focus:py-3 focus:text-ink"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Cursor />
        {children}
      </body>
    </html>
  )
}
