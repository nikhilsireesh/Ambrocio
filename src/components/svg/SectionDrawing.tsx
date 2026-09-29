import type { Zone } from '@/content/site'

/**
 * Building cross-section with one highlightable group per service zone.
 * Local coordinates: 1000 × 700, ground at y = 560.
 */

function stairPath() {
  let d = 'M460 560'
  for (let i = 0; i < 12; i++) d += 'v-14h10.8'
  return d
}

function pickets() {
  let d = ''
  for (let x = 36; x <= 166; x += 12) d += `M${x} 560V478l4 -8l4 8V560`
  return d + 'M30 492H172M30 540H172'
}

function balusters() {
  let d = 'M760 470H902M760 530H902M760 540H902'
  for (let x = 770; x < 900; x += 12) d += `M${x} 470V530`
  return d + 'M800 540V560M860 540V560M896 540V560'
}

function tileTicks() {
  let d = 'M212 552H748'
  for (let x = 228; x < 748; x += 16) d += `M${x} 552V560`
  return d
}

function planks() {
  let d = 'M212 372H748'
  for (let x = 240; x < 748; x += 46) d += `M${x} 372V380`
  return d
}

function stipple() {
  let d = ''
  for (let y = 248; y < 368; y += 12)
    for (let x = 236 + ((y / 12) % 2) * 6; x < 520; x += 12) d += `M${x} ${y}h0.8`
  return d
}

type ZoneDef = { hl: string; lines: string; anchor: [number, number] }

export const zones: Record<Zone, ZoneDef> = {
  structure: {
    hl: 'M190 560V232L480 84L770 232V580H190Z',
    lines: 'M190 560h580v20h-580zM200 560V220M212 560V228M748 560V228M760 560V220M200 380H760M200 392H760M200 220H760M170 232L480 84L790 232',
    anchor: [300, 570],
  },
  framing: {
    hl: 'M200 220L480 100L760 220Z',
    lines: 'M200 220L480 100L760 220M480 100V220M340 160V220M620 160V220M340 220L410 130M620 220L550 130M270 190V220M690 190V220',
    anchor: [410, 160],
  },
  cornice: {
    hl: 'M150 216h58v34h-58zM752 216h58v34h-58z',
    lines: 'M158 232h44v14h-44zM158 246q8 0 10 -8M758 232h44v14h-44zM802 246q-8 0 -10 -8M212 392q10 0 12 10M736 392q-10 0 -12 10M212 228q10 0 12 10M736 228q-10 0 -12 10',
    anchor: [180, 232],
  },
  kitchen: {
    hl: 'M212 392h238v168h-238z',
    lines: 'M230 490h150v62h-150zM226 484h158v6h-158zM305 490v62M230 400h120v48h-120zM290 400v48M420 392v40M406 446l6 -14h16l6 14z',
    anchor: [300, 470],
  },
  stair: {
    hl: 'M450 392h150v168h-150z',
    lines: `${stairPath()}M460 520L590 352M460 520v40M590 352v40`,
    anchor: [525, 470],
  },
  openings: {
    hl: 'M192 424h28v82h-28zM192 254h28v82h-28zM740 436h28v124h-28z',
    lines: 'M198 430h16v70h-16zM198 465h16M198 260h16v70h-16zM198 295h16M746 440h16v120h-16zM754 440v120',
    anchor: [206, 465],
  },
  floor: {
    hl: 'M212 548h536v14h-536zM212 368h536v14h-536z',
    lines: `${tileTicks()}${planks()}`,
    anchor: [680, 556],
  },
  drywall: {
    hl: 'M212 228h328v144h-328z',
    lines: `M536 228V372M544 228V372${stipple()}`,
    anchor: [380, 300],
  },
  bath: {
    hl: 'M544 228h204v144h-204z',
    lines: 'M560 330h130v42h-130zM566 330v-8M600 262v14l-10 6M700 322h40v50h-40zM704 262h32v44h-32zM720 322v-6',
    anchor: [620, 320],
  },
  deck: {
    hl: 'M756 462h150v100h-150z',
    lines: balusters(),
    anchor: [830, 500],
  },
  fence: {
    hl: 'M26 462h150v100h-150z',
    lines: pickets(),
    anchor: [100, 500],
  },
  demo: {
    hl: 'M906 486h94v76h-94z',
    lines: 'M912 522h86l-8 38h-70zM926 522l8 -18l10 10l12 -22l8 16l14 -8l6 22M920 541h74',
    anchor: [955, 530],
  },
}

const order: Zone[] = ['structure', 'framing', 'cornice', 'kitchen', 'stair', 'openings', 'floor', 'drywall', 'bath', 'deck', 'fence', 'demo']

export default function SectionDrawing({
  active,
  className = '',
  children,
  viewBox = '0 0 1000 700',
  offset = [0, 0],
}: {
  active: Zone
  className?: string
  children?: React.ReactNode
  viewBox?: string
  offset?: [number, number]
}) {
  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true" fill="none" data-active={active}>
      <defs>
        <radialGradient id="zoneGlow" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0" stopColor="#b08a45" stopOpacity="0.3" />
          <stop offset="1" stopColor="#b08a45" stopOpacity="0.06" />
        </radialGradient>
      </defs>
      <g transform={`translate(${offset[0]} ${offset[1]})`}>
        {/* ground */}
        <path d="M0 560H1000" stroke="#3a332a" strokeOpacity="0.25" />
        <path d="M0 580H1000" stroke="#3a332a" strokeOpacity="0.08" strokeDasharray="2 6" />
        {order.map((z) => {
          const on = z === active
          return (
            <g key={z} className={`zone zone-${z}`}>
              <path
                d={zones[z].hl}
                fill="url(#zoneGlow)"
                stroke="#b08a45"
                strokeOpacity={on ? 0.7 : 0}
                strokeDasharray="3 5"
                style={{ opacity: on ? 1 : 0, transition: 'opacity .5s ease' }}
              />
              <path
                className="zl"
                d={zones[z].lines}
                stroke={on ? '#E9C88A' : '#3a332a'}
                strokeOpacity={on ? 1 : z === 'structure' ? 0.5 : 0.28}
                strokeWidth={on ? 1.8 : 1.1}
                style={{ transition: 'stroke .4s ease, stroke-opacity .4s ease' }}
              />
            </g>
          )
        })}
      </g>
      {children}
    </svg>
  )
}
