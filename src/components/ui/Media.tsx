import Image from 'next/image'
import type { Photo } from '@/content/media'

/**
 * Shows the real photo when one is configured in src/content/media.ts,
 * otherwise renders the supplied architectural drawing.
 * The caller positions it (e.g. `absolute inset-0`); a photo needs a positioned wrapper for `fill`.
 */
export default function Media({
  photo,
  sizes = '100vw',
  className = '',
  priority,
  children,
}: {
  photo: Photo
  sizes?: string
  className?: string
  priority?: boolean
  children: React.ReactNode
}) {
  if (photo.src) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    )
  }
  return <div className={`overflow-hidden ${className}`}>{children}</div>
}
