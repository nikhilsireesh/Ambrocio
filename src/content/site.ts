// Single source of truth for company information.
// Everything here comes from the Ambrocio Construction & Remodeling flyer.
// Do not add claims (years, project counts, awards, addresses) that the business has not supplied.

export const site = {
  name: 'Ambrocio Construction & Remodeling',
  shortName: 'Ambrocio',
  tagline: 'Your Vision. Our Work.',
  taglines: {
    stronger: 'Stronger Spaces. Brighter Tomorrows.',
    bigger: 'Build Better. Live Bigger.',
    pillars: 'Build. Remodel. Improve.',
  },
  focus: 'General Construction',
  sectors: 'Residential & Commercial',
  area: 'DFW Metroplex & Surrounding Areas',
  contact: {
    name: 'Eduardo',
    phoneDisplay: '432-999-2398',
    phoneE164: '+14329992398',
  },
  languages: ['English', 'Español'],
  trust: ['Licensed', 'Insured', 'Reliable'],
  promise: 'Quality work that lasts longer.',
  cta: 'Free Estimates',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const

export const telHref = `tel:${site.contact.phoneE164}`
export const smsHref = (body?: string) =>
  `sms:${site.contact.phoneE164}${body ? `?&body=${encodeURIComponent(body)}` : ''}`

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Our Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
] as const

/**
 * `zone` ties each service to an area of the blueprint drawing in the services section.
 * Descriptions are intentionally short and general.
 */
export const services = [
  {
    id: 'general',
    name: 'General Construction',
    description: 'New construction and structural work for residential and commercial projects.',
    zone: 'structure',
  },
  {
    id: 'framing',
    name: 'Framing',
    description: 'Solid, square framing that sets up everything that follows.',
    zone: 'framing',
  },
  {
    id: 'cornice',
    name: 'Cornice & Trim',
    description: 'Cornice and trim details that give a room a clean, finished edge.',
    zone: 'cornice',
  },
  {
    id: 'decks',
    name: 'Decks & Patios',
    description: 'Outdoor decks and patios built for everyday living.',
    zone: 'deck',
  },
  {
    id: 'kitchen',
    name: 'Kitchen Remodeling',
    description:
      'Transform outdated kitchens into functional, modern spaces through thoughtful remodeling and finish work.',
    zone: 'kitchen',
  },
  {
    id: 'bathroom',
    name: 'Bathroom Remodeling',
    description: 'Outdated bathrooms remodeled into clean, comfortable spaces.',
    zone: 'bath',
  },
  {
    id: 'drywall',
    name: 'Drywall & Texture',
    description: 'Drywall and wall texture for smooth, consistent surfaces.',
    zone: 'drywall',
  },
  {
    id: 'fence',
    name: 'Fence Installation',
    description: 'Fences that define and finish the edges of a property.',
    zone: 'fence',
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    description: 'Carpentry work built with care, from structure to finish.',
    zone: 'stair',
  },
  {
    id: 'doors',
    name: 'Door & Window Installation',
    description: 'Doors and windows installed for a proper fit and a finished look.',
    zone: 'openings',
  },
  {
    id: 'tile',
    name: 'Tile & Flooring',
    description: 'Tile and flooring installed to stand up to daily life.',
    zone: 'floor',
  },
  {
    id: 'demo',
    name: 'Demo & Haul Away',
    description: 'Demolition and haul-away that clears the way for what comes next.',
    zone: 'demo',
  },
  {
    id: 'more',
    name: 'And More',
    description: "Have a project that isn't listed? Call Eduardo and ask.",
    zone: 'structure',
  },
] as const

export type Service = (typeof services)[number]
export type Zone = Service['zone']
