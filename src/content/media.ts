// Photo manifest.
//
// Put real project photos in /public/media and reference them here, e.g. src: '/media/kitchen-01.jpg'.
// Next.js serves them as responsive AVIF/WebP automatically.
// Anything left as `null` falls back to the architectural drawing built into the site,
// and portfolio slots without a photo are clearly marked as placeholders.

export type Photo = { src: string | null; alt: string }

export type PortfolioSlot = {
  id: string
  /** Project name. Leave null until the business supplies one — never invent it. */
  project: string | null
  category: string
  /** Only fill in if the business provides it. */
  location: string | null
  photo: Photo
  /** Controls the frame shape in the horizontal gallery. */
  shape: 'wide' | 'portrait' | 'classic'
  /** Drawing shown while the photo slot is empty. */
  plate: 'kitchen' | 'bath' | 'exterior' | 'deck' | 'framing' | 'commercial'
}

export const portfolio: PortfolioSlot[] = [
  {
    id: 'slot-01',
    project: null,
    category: 'Kitchen Remodeling',
    location: null,
    photo: { src: null, alt: 'Kitchen remodeling project by Ambrocio Construction & Remodeling' },
    shape: 'wide',
    plate: 'kitchen',
  },
  {
    id: 'slot-02',
    project: null,
    category: 'Bathroom Remodeling',
    location: null,
    photo: { src: null, alt: 'Bathroom remodeling project by Ambrocio Construction & Remodeling' },
    shape: 'portrait',
    plate: 'bath',
  },
  {
    id: 'slot-03',
    project: null,
    category: 'General Construction',
    location: null,
    photo: { src: null, alt: 'General construction project by Ambrocio Construction & Remodeling' },
    shape: 'classic',
    plate: 'exterior',
  },
  {
    id: 'slot-04',
    project: null,
    category: 'Decks & Patios',
    location: null,
    photo: { src: null, alt: 'Deck and patio project by Ambrocio Construction & Remodeling' },
    shape: 'wide',
    plate: 'deck',
  },
  {
    id: 'slot-05',
    project: null,
    category: 'Framing',
    location: null,
    photo: { src: null, alt: 'Framing project by Ambrocio Construction & Remodeling' },
    shape: 'portrait',
    plate: 'framing',
  },
  {
    id: 'slot-06',
    project: null,
    category: 'Commercial',
    location: null,
    photo: { src: null, alt: 'Commercial project by Ambrocio Construction & Remodeling' },
    shape: 'classic',
    plate: 'commercial',
  },
]

/** Optional photos for the cinematic sections. Drawings are used until these are filled in. */
export const featurePhotos: Record<'build' | 'remodel' | 'improve' | 'finishedHome', Photo> = {
  build: { src: null, alt: 'New construction framing' },
  remodel: { src: null, alt: 'Remodeled interior' },
  improve: { src: null, alt: 'Finished trim and door detail' },
  finishedHome: { src: null, alt: 'Finished home at dusk' },
}
