/**
 * Isometric house generated from 3D coordinates.
 * Layer classes (iso-*) are animated by the Process section.
 */

const U = 26
const C = 0.866

type V = [number, number, number]
const P = ([x, y, z]: V) => [(x - y) * U * C, (x + y) * U * 0.5 - z * U] as const
const pt = (v: V) => {
  const [X, Y] = P(v)
  return `${X.toFixed(1)} ${Y.toFixed(1)}`
}
const poly = (...vs: V[]) => `M${vs.map(pt).join('L')}Z`
const line = (a: V, b: V) => `M${pt(a)}L${pt(b)}`

// footprint
const MW = 12
const MD = 8
const MH = 4.5
const RZ = 7
const G = { x0: 12, x1: 17, y0: 3, y1: 8, h: 3.2 }

function landGrid() {
  let d = ''
  for (let x = -5; x <= 23; x += 2) d += line([x, -5, -0.4], [x, 14, -0.4])
  for (let y = -5; y <= 14; y += 2) d += line([-5, y, -0.4], [23, y, -0.4])
  return d
}

function studsAlongX(y: number, x0: number, x1: number, h: number, z0 = 0) {
  let d = ''
  for (let x = x0; x <= x1 + 0.01; x += 1) d += line([x, y, z0], [x, y, h])
  return d + line([x0, y, h], [x1, y, h]) + line([x0, y, z0], [x1, y, z0])
}
function studsAlongY(x: number, y0: number, y1: number, h: number | ((y: number) => number), z0 = 0) {
  let d = ''
  const top = typeof h === 'number' ? () => h : h
  for (let y = y0; y <= y1 + 0.01; y += 1) d += line([x, y, z0], [x, y, top(y)])
  return d
}
const gableTop = (y: number) => (y <= 4 ? MH + (y / 4) * (RZ - MH) : MH + ((8 - y) / 4) * (RZ - MH))

const frame =
  studsAlongX(0, 0, MW, MH) +
  studsAlongY(0, 0, MD, gableTop) +
  studsAlongX(MD, 0, MW, MH) +
  studsAlongY(MW, 0, MD, gableTop) +
  studsAlongX(G.y1, G.x0, G.x1, G.h) +
  studsAlongY(G.x1, G.y0, G.y1, G.h) +
  studsAlongX(G.y0, G.x0, G.x1, G.h)

let rafters = line([0, 4, RZ], [MW, 4, RZ])
for (let x = 0; x <= MW; x += 1) rafters += line([x, 0, MH], [x, 4, RZ]) + line([x, 4, RZ], [x, 8, MH])
for (let x = G.x0; x <= G.x1; x += 1) rafters += line([x, G.y0, G.h], [x, G.y1, G.h])

// openings on the y = 8 face (x-range, z-range) and x = 12 face (y-range, z-range)
const frontWins: [number, number, number, number][] = [
  [1.4, 3.6, 1.2, 3.6],
  [7.4, 10.6, 1.2, 3.6],
]
const door: [number, number, number, number] = [5, 6.3, 0, 3]
const gableWins: [number, number, number, number][] = [
  [0.8, 2.6, 1.2, 3.6],
  [3.5, 4.5, 4.9, 6.1],
]
const faceY = ([a, b, z0, z1]: number[], y = MD) => poly([a, y, z0], [b, y, z0], [b, y, z1], [a, y, z1])
const faceX = ([a, b, z0, z1]: number[], x = MW) => poly([x, a, z0], [x, b, z0], [x, b, z1], [x, a, z1])

function boards(y: number, x0: number, x1: number, h: number) {
  let d = ''
  for (let x = x0 + 0.5; x < x1; x += 0.5) d += line([x, y, 0], [x, y, h])
  return d
}
function gableBoards() {
  let d = ''
  for (let y = 0.5; y < 8; y += 0.5) d += line([MW, y, 0], [MW, y, gableTop(y)])
  return d
}
function roofSeams(front: boolean) {
  let d = ''
  for (let x = 0; x <= MW + 0.01; x += 0.75)
    d += front ? line([x, 4, RZ], [x, 8.4, MH - 0.25]) : line([x, -0.4, MH - 0.25], [x, 4, RZ])
  return d
}

const trees: [number, number, number][] = [
  [-2.5, 10.5, 1.5],
  [-3, 3, 1.2],
  [20, 1, 1.4],
  [20.5, 10, 1.7],
  [9, 12, 1.1],
]

export default function IsoBuilding({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="-430 -250 1000 760" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="iso-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#E9B872" stopOpacity="0.3" />
          <stop offset="1" stopColor="#E9B872" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="iso-warm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d59a" />
          <stop offset="1" stopColor="#c6aa89" />
        </linearGradient>
        <radialGradient id="iso-fade" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="iso-land-mask" maskUnits="userSpaceOnUse" x="-500" y="-300" width="1200" height="900">
          <ellipse cx="70" cy="190" rx="520" ry="300" fill="url(#iso-fade)" />
        </mask>
        <clipPath id="iso-frame-clip">
          <rect className="iso-frame-clip" x="-600" y="460" width="1200" height="800" />
        </clipPath>
        <clipPath id="iso-wall-clip">
          <rect className="iso-wall-clip" x="-600" y="460" width="1200" height="800" />
        </clipPath>
      </defs>

      <ellipse className="iso-halo" cx="40" cy="120" rx="520" ry="320" fill="url(#iso-halo)" opacity="0" />

      {/* 01 empty land */}
      <g className="iso-land" mask="url(#iso-land-mask)">
        <path d={poly([-5, -5, -0.4], [23, -5, -0.4], [23, 14, -0.4], [-5, 14, -0.4])} fill="#eae8e6" />
        <path d={landGrid()} stroke="#b08a45" strokeOpacity="0.1" strokeWidth="0.8" fill="none" />
        <g className="iso-stakes" stroke="#b08a45" strokeWidth="1.5">
          {([[0, 0], [MW, 0], [G.x1, G.y0], [G.x1, G.y1], [0, MD]] as const).map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <path d={line([x, y, -0.4], [x, y, 1])} />
              <path d={poly([x, y, 1], [x + 0.6, y, 0.8], [x, y, 0.6])} fill="#b08a45" stroke="none" />
            </g>
          ))}
        </g>
      </g>

      {/* 02 plan + slab */}
      <g className="iso-plan" fill="none" stroke="#3a332a" strokeWidth="1.2">
        <path className="iso-plan-line" d={poly([0, 0, 0], [MW, 0, 0], [MW, G.y0, 0], [G.x1, G.y0, 0], [G.x1, G.y1, 0], [0, MD, 0])} />
        <path className="iso-plan-line" d={line([0, 10, 0], [G.x1, 10, 0]) + line([0, 9.6, 0], [0, 10.4, 0]) + line([G.x1, 9.6, 0], [G.x1, 10.4, 0]) + line([-2, 0, 0], [-2, MD, 0]) + line([-2.4, 0, 0], [-1.6, 0, 0]) + line([-2.4, MD, 0], [-1.6, MD, 0])} stroke="#b08a45" />
      </g>
      <g className="iso-slab">
        <path d={poly([0, MD, -0.4], [G.x1, MD, -0.4], [G.x1, MD, 0], [0, MD, 0])} fill="#b9b7b1" />
        <path d={poly([G.x1, G.y0, -0.4], [G.x1, MD, -0.4], [G.x1, MD, 0], [G.x1, G.y0, 0])} fill="#c4c2bd" />
        <path d={poly([MW, 0, -0.4], [MW, G.y0, -0.4], [MW, G.y0, 0], [MW, 0, 0])} fill="#c4c2bd" />
        <path d={poly([0, 0, 0], [MW, 0, 0], [MW, G.y0, 0], [G.x1, G.y0, 0], [G.x1, G.y1, 0], [0, MD, 0])} fill="#8a867d" />
      </g>

      {/* 03 framing */}
      <g clipPath="url(#iso-frame-clip)">
        <g className="iso-frame" fill="none" stroke="#c49261" strokeWidth="1.3">
          <path d={frame} />
          <path className="iso-rafters" d={rafters} />
        </g>
      </g>

      {/* 04 walls */}
      <g clipPath="url(#iso-wall-clip)">
        <g className="iso-walls">
          <path d={poly([MW, 0, 0], [MW, MD, 0], [MW, MD, MH], [MW, 4, RZ], [MW, 0, MH])} fill="#9c9585" />
          <path d={gableBoards()} stroke="#b4afa5" strokeWidth="1" />
          <path d={poly([0, MD, 0], [MW, MD, 0], [MW, MD, MH], [0, MD, MH])} fill="#cdc5b3" />
          <path d={boards(MD, 0, MW, MH)} stroke="#aaa291" strokeWidth="1" />
          {/* garage */}
          <path d={poly([G.x0, G.y1, 0], [G.x1, G.y1, 0], [G.x1, G.y1, G.h], [G.x0, G.y1, G.h])} fill="#d8d8d8" />
          <path d={poly([G.x1, G.y0, 0], [G.x1, G.y1, 0], [G.x1, G.y1, G.h], [G.x1, G.y0, G.h])} fill="#e0e0e0" />
          <path d={faceY([12.6, 16.4, 0, 2.6], G.y1)} fill="#d9c3b0" />
          <path d={faceY([12.6, 16.4, 0.65, 0.65], G.y1) + faceY([12.6, 16.4, 1.3, 1.3], G.y1) + faceY([12.6, 16.4, 1.95, 1.95], G.y1)} stroke="#e7d9cd" fill="none" />
          <path d={faceY(door)} fill="#e6e6e6" />
        </g>
      </g>

      {/* windows */}
      <g className="iso-win">
        {frontWins.map((w, i) => (
          <path key={i} d={faceY(w)} fill="#dde2e7" stroke="#eaeaea" strokeWidth="2" />
        ))}
        {gableWins.map((w, i) => (
          <path key={i} d={faceX(w)} fill="#dde2e7" stroke="#eaeaea" strokeWidth="2" />
        ))}
        <path d={faceX([5, 7, 1.5, 2.5], G.x1)} fill="#dde2e7" stroke="#eaeaea" strokeWidth="2" />
      </g>
      <g className="iso-glow" opacity="0">
        {frontWins.map((w, i) => (
          <path key={i} d={faceY(w)} fill="url(#iso-warm)" />
        ))}
        {gableWins.map((w, i) => (
          <path key={i} d={faceX(w)} fill="url(#iso-warm)" />
        ))}
        <path d={faceX([5, 7, 1.5, 2.5], G.x1)} fill="url(#iso-warm)" />
        <path d={line([2.5, MD, 1.2], [2.5, MD, 3.6]) + line([9, MD, 1.2], [9, MD, 3.6])} stroke="#eaeaea" strokeWidth="2" />
      </g>

      {/* roof */}
      <g className="iso-roof">
        <path d={poly([-0.3, -0.4, MH - 0.25], [MW + 0.3, -0.4, MH - 0.25], [MW + 0.3, 4, RZ], [-0.3, 4, RZ])} fill="#dbdbdb" />
        <path d={roofSeams(false)} stroke="#b08a45" strokeOpacity="0.1" />
        <path d={poly([-0.3, 4, RZ], [MW + 0.3, 4, RZ], [MW + 0.3, 8.4, MH - 0.25], [-0.3, 8.4, MH - 0.25])} fill="#e2e2e2" />
        <path d={roofSeams(true)} stroke="#b08a45" strokeOpacity="0.14" />
        <path d={line([MW + 0.3, -0.4, MH - 0.25], [MW + 0.3, 4, RZ]) + line([MW + 0.3, 4, RZ], [MW + 0.3, 8.4, MH - 0.25])} stroke="#b08a45" strokeOpacity="0.5" strokeWidth="1.5" />
        <path d={poly([G.x0, G.y0 - 0.2, G.h], [G.x1 + 0.3, G.y0 - 0.2, G.h], [G.x1 + 0.3, G.y1 + 0.3, G.h], [G.x0, G.y1 + 0.3, G.h])} fill="#d5d5d5" />
      </g>

      {/* 05 landscape */}
      <g className="iso-landscape">
        <path d={poly([5, MD, -0.38], [6.3, MD, -0.38], [6.3, 13.5, -0.38], [5, 13.5, -0.38])} fill="#deddd8" />
        {trees.map(([x, y, r], i) => {
          const [tx, ty] = P([x, y, 0])
          return (
            <g key={i} className="iso-tree">
              <path d={`M${tx} ${ty}V${ty - r * U * 1.4}`} stroke="#eae6e0" strokeWidth="4" />
              <circle cx={tx} cy={ty - r * U * 1.9} r={r * U} fill={i % 2 ? '#e3eae0' : '#e5eedb'} />
              <circle cx={tx - r * 8} cy={ty - r * U * 2.1} r={r * U * 0.55} fill="#dfe8d8" />
            </g>
          )
        })}
        {[1, 2.5, 4, 7.5, 9, 10.5].map((x) => {
          const [sx, sy] = P([x, MD + 0.6, 0])
          return <ellipse key={x} className="iso-shrub" cx={sx} cy={sy - 6} rx="14" ry="9" fill="#e4ece0" />
        })}
        {(() => {
          const [lx, ly] = P([5.65, MD + 0.4, 0])
          return <ellipse cx={lx} cy={ly} rx="70" ry="26" fill="#E9B872" opacity="0.25" />
        })()}
      </g>
    </svg>
  )
}
