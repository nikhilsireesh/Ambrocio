import { ImageResponse } from 'next/og'

export const alt = 'Ambrocio Construction & Remodeling — Your Vision. Our Work.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#F8F5EE',
          color: '#2B2620',
          padding: 72,
          fontFamily: 'sans-serif',
          backgroundImage:
            'linear-gradient(rgba(143,108,47,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(143,108,47,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 8, color: '#8F6C2F' }}>
          GENERAL CONSTRUCTION · RESIDENTIAL & COMMERCIAL
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 150, fontWeight: 900, letterSpacing: -4, lineHeight: 0.9 }}>AMBROCIO</div>
          <div style={{ fontSize: 34, letterSpacing: 12, marginTop: 18, color: 'rgba(43,38,32,0.85)' }}>
            CONSTRUCTION & REMODELING
          </div>
          <div style={{ width: 240, height: 2, background: '#8F6C2F', marginTop: 28 }} />
          <div style={{ fontSize: 46, marginTop: 24, fontStyle: 'italic' }}>Your Vision. Our Work.</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: 'rgba(43,38,32,0.7)' }}>
          <span>DFW Metroplex & Surrounding Areas</span>
          <span style={{ color: '#8F6C2F' }}>Free Estimates · 432-999-2398</span>
        </div>
      </div>
    ),
    size
  )
}
