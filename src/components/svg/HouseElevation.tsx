/**
 * Front elevation of a modern home, drawn as stacked construction layers.
 * Each layer carries a class (h-grid, h-found, h-frame …) that the hero timeline animates.
 * Pass `static` to render a fixed state (used as a backdrop elsewhere on the page).
 */

const GROUND = 720
const GRADE = 742

type Rect = { x: number; y: number; w: number; h: number }

// ---- volumes ----
const garage = { x0: 250, x1: 520, top: 520 }
const main = { x0: 520, x1: 1000, eave: 400, apexX: 760, apexY: 214 }
const box = { x0: 1000, x1: 1300, top: 330 }
const FLOOR2 = 540

// ---- openings ----
const garageDoor: Rect = { x: 285, y: 590, w: 200, h: 130 }
const frontDoor: Rect = { x: 560, y: 580, w: 70, h: 140 }
const sidelight: Rect = { x: 638, y: 580, w: 22, h: 140 }
const mainGround: Rect = { x: 700, y: 590, w: 260, h: 110 }
const upperL: Rect = { x: 575, y: 430, w: 120, h: 90 }
const upperR: Rect = { x: 825, y: 430, w: 120, h: 90 }
const gableWin: Rect = { x: 740, y: 290, w: 40, h: 84 }
const boxGround: Rect = { x: 1030, y: 572, w: 240, h: 143 }
const boxUpper: Rect = { x: 1030, y: 360, w: 140, h: 155 }
const slats: Rect = { x: 1182, y: 350, w: 104, h: 176 }

const openings = { garage: [garageDoor], main: [frontDoor, sidelight, mainGround, upperL, upperR, gableWin], box: [boxGround, boxUpper] }
const windows = [sidelight, mainGround, upperL, upperR, gableWin, boxGround, boxUpper]

const roofY = (x: number) => {
  // underside of the gable rake at x
  if (x <= main.apexX) return main.eave - ((x - main.x0) / (main.apexX - main.x0)) * (main.eave - main.apexY)
  return main.eave - ((main.x1 - x) / (main.x1 - main.apexX)) * (main.eave - main.apexY)
}

/** Stud wall path: studs broken around openings, headers, sills, plates. */
function studWall(x0: number, x1: number, top: (x: number) => number, holes: Rect[], spacing = 30) {
  let d = ''
  for (let x = x0; x <= x1 + 0.1; x += spacing) {
    const t = top(x)
    const hit = holes.find((o) => x > o.x - 2 && x < o.x + o.w + 2)
    if (!hit) {
      d += `M${x} ${t}V${GROUND}`
      continue
    }
    if (hit.y - 16 > t) d += `M${x} ${t}V${hit.y - 16}`
    if (hit.y + hit.h < GROUND - 4) d += `M${x} ${hit.y + hit.h + 8}V${GROUND}`
  }
  for (const o of holes) {
    // king + jack studs
    d += `M${o.x - 6} ${Math.max(top(o.x - 6), 0)}V${GROUND}M${o.x + o.w + 6} ${top(o.x + o.w + 6)}V${GROUND}`
    // header
    d += `M${o.x - 6} ${o.y - 16}H${o.x + o.w + 6}M${o.x - 6} ${o.y - 4}H${o.x + o.w + 6}`
    // rough sill
    if (o.y + o.h < GROUND - 4) d += `M${o.x - 6} ${o.y + o.h + 4}H${o.x + o.w + 6}`
  }
  // bottom plate
  d += `M${x0} ${GROUND - 4}H${x1}`
  return d
}

const frameGarage =
  studWall(garage.x0, garage.x1, () => garage.top, openings.garage) +
  `M${garage.x0} ${garage.top}H${garage.x1}M${garage.x0} ${garage.top + 5}H${garage.x1}`
const frameMain =
  studWall(main.x0, main.x1, roofY, openings.main, 30) +
  `M${main.x0} ${FLOOR2}H${main.x1}M${main.x0} ${FLOOR2 + 12}H${main.x1}` +
  `M${main.x0} ${main.eave}H${main.x1}` +
  `M${main.x0 - 24} ${main.eave + 14}L${main.apexX} ${main.apexY - 18}L${main.x1 + 24} ${main.eave + 14}` +
  `M${main.x0} ${main.eave}L${main.apexX} ${main.apexY}L${main.x1} ${main.eave}`
const frameBox =
  studWall(box.x0, box.x1, () => box.top, openings.box, 30) +
  `M${box.x0} ${FLOOR2}H${box.x1}M${box.x0} ${FLOOR2 + 12}H${box.x1}M${box.x0} ${box.top}H${box.x1}M${box.x0} ${box.top + 5}H${box.x1}`

const outline =
  `M${garage.x0} ${GROUND}V${garage.top}H${garage.x1}` +
  `M${main.x0} ${GROUND}V${main.eave}L${main.apexX} ${main.apexY}L${main.x1} ${main.eave}V${GROUND}` +
  `M${box.x0} ${box.top}H${box.x1}V${GROUND}` +
  `M180 ${GROUND}H1420` +
  [garageDoor, frontDoor, sidelight, mainGround, upperL, upperR, gableWin, boxGround, boxUpper]
    .map((o) => `M${o.x} ${o.y}h${o.w}v${o.h}h${-o.w}Z`)
    .join('')

const rectPath = (o: Rect) => `M${o.x} ${o.y}h${o.w}v${o.h}h${-o.w}Z`

function battens(x0: number, x1: number, spacing: number) {
  let d = ''
  for (let x = x0 + spacing; x < x1; x += spacing) d += `M${x} ${roofY(x) + 2}V${GROUND}`
  return d
}

function lines(x0: number, x1: number, y0: number, y1: number, step: number, dir: 'h' | 'v') {
  let d = ''
  if (dir === 'h') for (let y = y0 + step; y < y1; y += step) d += `M${x0} ${y}H${x1}`
  else for (let x = x0 + step; x < x1; x += step) d += `M${x} ${y0}V${y1}`
  return d
}

function mullions(o: Rect, cols: number, rows = 1) {
  let d = ''
  for (let i = 1; i < cols; i++) d += `M${o.x + (o.w / cols) * i} ${o.y}v${o.h}`
  for (let j = 1; j < rows; j++) d += `M${o.x} ${o.y + (o.h / rows) * j}h${o.w}`
  return d
}

export default function HouseElevation({
  className = '',
  static: staticState,
  id = 'house',
}: {
  className?: string
  /** Render a fixed finished (or framed) state with no animation hooks needed. */
  static?: 'finished' | 'framing'
  id?: string
}) {
  const s = staticState
  const vis = (layer: string) => {
    if (!s) return undefined
    const finished = ['h-sky', 'h-found', 'h-walls', 'h-roof', 'h-win', 'h-glow', 'h-land', 'h-interior']
    const framing = ['h-grid', 'h-found', 'h-frame', 'h-outline', 'h-dims']
    return { opacity: (s === 'finished' ? finished : framing).includes(layer) ? 1 : 0 }
  }
  const p = (k: string) => `${id}-${k}`

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={p('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ececec" />
          <stop offset="0.55" stopColor="#ede8e3" />
          <stop offset="0.8" stopColor="#e9ded4" />
          <stop offset="1" stopColor="#e6d9cc" />
        </linearGradient>
        <radialGradient id={p('halo')} cx="0.5" cy="0.78" r="0.55">
          <stop offset="0" stopColor="#b08a45" stopOpacity="0.22" />
          <stop offset="1" stopColor="#b08a45" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={p('ground')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eae9e5" />
          <stop offset="1" stopColor="#eeeeee" />
        </linearGradient>
        <linearGradient id={p('wallMain')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f887a" />
          <stop offset="1" stopColor="#bdb5a3" />
        </linearGradient>
        <linearGradient id={p('wood')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d5bda7" />
          <stop offset="1" stopColor="#e2d1c3" />
        </linearGradient>
        <linearGradient id={p('glass')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dadfe3" />
          <stop offset="1" stopColor="#e6eaed" />
        </linearGradient>
        <linearGradient id={p('warm')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d59a" />
          <stop offset="0.6" stopColor="#E9B872" />
          <stop offset="1" stopColor="#c9af8f" />
        </linearGradient>
        <radialGradient id={p('spill')} cx="0.5" cy="0" r="0.7">
          <stop offset="0" stopColor="#E9B872" stopOpacity="0.5" />
          <stop offset="1" stopColor="#E9B872" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={p('lamp')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe7b8" stopOpacity="0.95" />
          <stop offset="0.3" stopColor="#E9B872" stopOpacity="0.35" />
          <stop offset="1" stopColor="#E9B872" stopOpacity="0" />
        </radialGradient>
        <pattern id={p('hatch')} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V10" stroke="#b08a45" strokeOpacity="0.35" strokeWidth="1" />
        </pattern>
        <pattern id={p('gridMinor')} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#b08a45" strokeOpacity="0.08" strokeWidth="0.6" />
        </pattern>
        <pattern id={p('gridMajor')} width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M100 0H0V100" fill="none" stroke="#b08a45" strokeOpacity="0.16" strokeWidth="0.8" />
        </pattern>
        <clipPath id={p('frameClip')}>
          <rect className="h-frame-clip" x="0" y={s ? 0 : GROUND} width="1600" height="900" />
        </clipPath>
        <clipPath id={p('wallClip')}>
          <rect className="h-wall-clip" x="0" y={s ? 0 : GROUND} width="1600" height="900" />
        </clipPath>
      </defs>

      {/* base */}
      <rect width="1600" height="900" fill="#ececec" />
      <rect className="h-sky" width="1600" height="900" fill={`url(#${p('sky')})`} style={vis('h-sky') ?? { opacity: 0 }} />
      <ellipse className="h-sky" cx="800" cy="700" rx="900" ry="420" fill={`url(#${p('halo')})`} style={vis('h-sky') ?? { opacity: 0 }} />

      {/* blueprint grid */}
      <g className="h-grid" style={vis('h-grid') ?? { opacity: 0 }}>
        <rect width="1600" height="900" fill={`url(#${p('gridMinor')})`} />
        <rect width="1600" height="900" fill={`url(#${p('gridMajor')})`} />
      </g>

      {/* ghost silhouette shown before the build starts */}
      <path
        className="h-ghost"
        d={outline}
        fill="none"
        stroke="#3a332a"
        strokeOpacity="0.1"
        strokeWidth="1"
        style={{ opacity: s ? 0 : 1 }}
      />

      {/* dimensions + annotations */}
      <g className="h-dims" style={vis('h-dims') ?? { opacity: 0 }} fill="none" stroke="#b08a45" strokeWidth="1">
        {[250, 520, 1000, 1300].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 118V${GROUND}`} strokeDasharray="4 8" strokeOpacity="0.35" />
            <circle cx={x} cy="100" r="16" strokeOpacity="0.8" />
            <text x={x} y="105" textAnchor="middle" fill="#b08a45" stroke="none" fontSize="14" fontFamily="monospace">
              {String.fromCharCode(65 + i)}
            </text>
          </g>
        ))}
        <path d="M250 160H1300M250 150v20M520 150v20M1000 150v20M1300 150v20" strokeOpacity="0.7" />
        <path d={`M1370 330V${GROUND}M1360 330h20M1360 ${FLOOR2}h20M1360 ${GROUND}h20`} strokeOpacity="0.7" />
        <g fill="#b08a45" stroke="none" fontFamily="monospace" fontSize="12" letterSpacing="2">
          <text x="120" y={FLOOR2 - 6}>LEVEL 02</text>
          <text x="120" y={GROUND - 6}>T.O. SLAB</text>
          <text x="120" y={main.eave - 6}>PLATE HT.</text>
          <text x="1236" y="860">FRONT ELEVATION · A-201</text>
        </g>
        <path d={`M120 ${FLOOR2}H240M120 ${GROUND}H240M120 ${main.eave}H240`} strokeOpacity="0.5" />
      </g>

      {/* blueprint linework (drawn on scroll) */}
      <path className="h-outline" d={outline} fill="none" stroke="#3a332a" strokeOpacity="0.75" strokeWidth="1.2" style={vis('h-outline')} />

      {/* foundation */}
      <g className="h-found" style={vis('h-found') ?? { opacity: 0 }}>
        <rect x="230" y={GROUND} width="1090" height={GRADE - GROUND} fill="#c2bfbb" />
        <rect x="230" y={GROUND} width="1090" height={GRADE - GROUND} fill={`url(#${p('hatch')})`} />
        <path
          className="h-footings"
          d={`M250 ${GRADE}v40h40v-40M520 ${GRADE}v40h40v-40M990 ${GRADE}v40h40v-40M1270 ${GRADE}v40h40v-40`}
          fill="none"
          stroke="#9a968d"
          strokeDasharray="5 5"
        />
      </g>

      {/* framing */}
      <g clipPath={`url(#${p('frameClip')})`}>
        <g className="h-frame" style={vis('h-frame') ?? { opacity: 0 }} fill="none" stroke="#b88a57" strokeWidth="2.2" strokeLinecap="square">
          <path d={frameGarage} />
          <path d={frameMain} />
          <path d={frameBox} />
        </g>
      </g>

      {/* exterior walls + cladding (rise with clip) */}
      <g clipPath={`url(#${p('wallClip')})`}>
        <g className="h-walls" style={vis('h-walls') ?? { opacity: 0 }}>
          {/* garage wing */}
          <rect x={garage.x0} y={garage.top} width={garage.x1 - garage.x0} height={GROUND - garage.top} fill="#dbdbdb" />
          <path d={lines(garage.x0, garage.x1, garage.top, GROUND, 14, 'h')} stroke="#d6d6d6" strokeWidth="1" />
          {/* main gable – board & batten */}
          <path
            d={`M${main.x0} ${GROUND}V${main.eave}L${main.apexX} ${main.apexY}L${main.x1} ${main.eave}V${GROUND}Z`}
            fill={`url(#${p('wallMain')})`}
          />
          <path d={battens(main.x0, main.x1, 24)} stroke="#b3afa6" strokeOpacity="0.55" strokeWidth="1.5" />
          {/* modern box */}
          <rect x={box.x0} y={box.top} width={box.x1 - box.x0} height={GROUND - box.top} fill="#e1e1e1" />
          <path d={`M${box.x0} ${FLOOR2}H${box.x1}`} stroke="#d8d8d8" strokeWidth="2" />
          <rect x={slats.x} y={slats.y} width={slats.w} height={slats.h} fill={`url(#${p('wood')})`} />
          <path d={lines(slats.x, slats.x + slats.w, slats.y, slats.y + slats.h, 8, 'v')} stroke="#e7d9cd" strokeWidth="2" />
          {/* garage door */}
          <rect x={garageDoor.x} y={garageDoor.y} width={garageDoor.w} height={garageDoor.h} fill={`url(#${p('wood')})`} />
          <path d={lines(garageDoor.x, garageDoor.x + garageDoor.w, garageDoor.y, garageDoor.y + garageDoor.h, 10, 'h')} stroke="#e7d9cd" strokeWidth="1.5" />
          {/* front door */}
          <rect x={frontDoor.x} y={frontDoor.y} width={frontDoor.w} height={frontDoor.h} fill="#e6e6e6" />
          <path d={`M${frontDoor.x + 52} ${frontDoor.y + 58}v34`} stroke="#b08a45" strokeWidth="3" strokeLinecap="round" />
          {/* door canopy */}
          <rect x={frontDoor.x - 20} y={frontDoor.y - 22} width={frontDoor.w + 62} height="8" fill="#e6e6e6" />
        </g>
      </g>

      {/* roof */}
      <g className="h-roof" style={vis('h-roof') ?? { opacity: 0 }}>
        <rect x={garage.x0 - 14} y={garage.top - 14} width={garage.x1 - garage.x0 + 26} height="16" fill="#e6e6e6" />
        <rect x={box.x0 - 12} y={box.top - 14} width={box.x1 - box.x0 + 26} height="16" fill="#e6e6e6" />
        <path
          className="h-rake"
          d={`M${main.x0 - 26} ${main.eave + 14}L${main.apexX} ${main.apexY - 20}L${main.x1 + 26} ${main.eave + 14}`}
          fill="none"
          stroke="#e6e6e6"
          strokeWidth="18"
          strokeLinejoin="miter"
        />
        <path
          d={`M${main.x0 - 26} ${main.eave + 5}L${main.apexX} ${main.apexY - 29}L${main.x1 + 26} ${main.eave + 5}`}
          fill="none"
          stroke="#b08a45"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
      </g>

      {/* glass */}
      <g className="h-win" style={vis('h-win') ?? { opacity: 0 }}>
        {windows.map((o, i) => (
          <rect key={i} x={o.x} y={o.y} width={o.w} height={o.h} fill={`url(#${p('glass')})`} />
        ))}
      </g>

      {/* interior light */}
      <g className="h-glow" style={vis('h-glow') ?? { opacity: 0 }}>
        {windows.map((o, i) => (
          <rect key={i} x={o.x} y={o.y} width={o.w} height={o.h} fill={`url(#${p('warm')})`} opacity={i === 4 ? 0.7 : 0.92} />
        ))}
      </g>

      {/* interior silhouettes */}
      <g className="h-interior" style={vis('h-interior') ?? { opacity: 0 }}>
        {[760, 830, 900].map((x) => (
          <g key={x}>
            <path d={`M${x} ${mainGround.y}v22`} stroke="#e7dacd" strokeWidth="1.5" />
            <path d={`M${x - 10} ${mainGround.y + 34}h20l-4 -12h-12z`} fill="#ebe1d6" />
            <circle cx={x} cy={mainGround.y + 40} r="16" fill={`url(#${p('lamp')})`} />
          </g>
        ))}
        <path
          d={`M${boxUpper.x + 10} ${boxUpper.y + boxUpper.h}l20 -18h20l20 -18h20l20 -18h20l20 -18`}
          fill="none"
          stroke="#dac8b3"
          strokeWidth="5"
        />
        <path d={`M${mainGround.x} ${mainGround.y + 88}h${mainGround.w}`} stroke="#d3bda3" strokeOpacity="0.5" strokeWidth="14" />
      </g>

      {/* frames & mullions on top of light */}
      <g className="h-win" style={vis('h-win') ?? { opacity: 0 }} fill="none" stroke="#eaeaea" strokeWidth="5">
        {windows.map((o, i) => (
          <path key={i} d={rectPath(o)} />
        ))}
        <path d={mullions(mainGround, 3)} strokeWidth="4" />
        <path d={mullions(boxGround, 3)} strokeWidth="4" />
        <path d={mullions(boxUpper, 1, 2)} strokeWidth="4" />
        <path d={mullions(upperL, 2)} strokeWidth="4" />
        <path d={mullions(upperR, 2)} strokeWidth="4" />
      </g>

      {/* landscape + exterior lighting */}
      <g className="h-land" style={vis('h-land') ?? { opacity: 0 }}>
        <rect x="0" y={GRADE} width="1600" height={900 - GRADE} fill={`url(#${p('ground')})`} />
        <path d={`M0 ${GRADE}H1600`} stroke="#b08a45" strokeOpacity="0.25" />
        <path d={`M${frontDoor.x} ${GRADE}h${frontDoor.w}l60 158h-190z`} fill="#e5e3de" />
        {[mainGround, boxGround, garageDoor].map((o, i) => (
          <ellipse key={i} cx={o.x + o.w / 2} cy={GRADE + 4} rx={o.w * 0.75} ry="60" fill={`url(#${p('spill')})`} />
        ))}
        {/* shrubs */}
        {[690, 730, 775, 820, 865, 910, 955, 1045, 1100, 1160, 1220].map((x, i) => (
          <ellipse key={x} className="h-shrub" cx={x} cy={GROUND + 6} rx={i % 3 === 0 ? 30 : 24} ry={i % 2 ? 18 : 22} fill="#e7ebe6" />
        ))}
        {/* cypress left */}
        <path
          className="h-tree"
          d={`M170 ${GROUND + 20}C140 600 150 420 176 330C200 420 212 600 184 ${GROUND + 20}Z`}
          fill="#e8ede7"
        />
        <path className="h-tree" d={`M112 ${GROUND + 20}C92 640 100 520 118 462C136 520 142 640 124 ${GROUND + 20}Z`} fill="#e9eee8" />
        {/* canopy tree right */}
        <g className="h-tree">
          <path d={`M1440 ${GROUND + 20}V540`} stroke="#edede9" strokeWidth="10" />
          <circle cx="1440" cy="480" r="78" fill="#e8ede7" />
          <circle cx="1392" cy="520" r="54" fill="#e6ece5" />
          <circle cx="1494" cy="512" r="58" fill="#e9eee7" />
          <circle cx="1450" cy="420" r="52" fill="#e6ebe4" />
        </g>
        {/* uplight on tree */}
        <ellipse cx="1440" cy="560" rx="70" ry="160" fill={`url(#${p('lamp')})`} opacity="0.25" />
        {/* sconces */}
        {[frontDoor.x - 14, sidelight.x + sidelight.w + 12].map((x) => (
          <g key={x}>
            <rect x={x - 3} y="612" width="6" height="16" fill="#eaeaea" />
            <ellipse cx={x} cy="628" rx="22" ry="54" fill={`url(#${p('lamp')})`} opacity="0.7" />
          </g>
        ))}
      </g>
    </svg>
  )
}
