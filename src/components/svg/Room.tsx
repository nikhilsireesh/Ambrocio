/**
 * One-point-perspective kitchen in two states.
 * show="all" stacks both so the renovation timeline can transform one into the other.
 * Class hooks: ba-* (before), a-* (after parts).
 */

const VP = { x: 800, y: 450 }
const BACK = { x0: 380, x1: 1220, y0: 200, y1: 700 }

const ceiling = `M0 0H1600L${BACK.x1} ${BACK.y0}H${BACK.x0}Z`
const floor = `M0 1000H1600L${BACK.x1} ${BACK.y1}H${BACK.x0}Z`
const leftWall = `M0 0L${BACK.x0} ${BACK.y0}V${BACK.y1}L0 1000Z`
const rightWall = `M1600 0L${BACK.x1} ${BACK.y0}V${BACK.y1}L1600 1000Z`
const backWall = `M${BACK.x0} ${BACK.y0}H${BACK.x1}V${BACK.y1}H${BACK.x0}Z`

const floorRay = (xb: number) => `M${xb} ${BACK.y1}L${VP.x + (xb - VP.x) * ((1000 - VP.y) / (BACK.y1 - VP.y))} 1000`

function planks() {
  let d = ''
  for (let xb = BACK.x0 - 400; xb <= BACK.x1 + 400; xb += 34) d += floorRay(xb)
  return d
}

function oldFloorGrid() {
  let d = ''
  for (let xb = BACK.x0 - 400; xb <= BACK.x1 + 400; xb += 70) d += floorRay(xb)
  for (const y of [730, 775, 840, 930]) d += `M0 ${y}H1600`
  return d
}

// deterministic scatter (no hydration mismatch)
// integer hash + rounding so server and browser produce identical attribute strings
const rand = (i: number) => {
  let h = Math.imul(i + 1, 2654435761) >>> 0
  h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0
  h ^= h >>> 13
  return (h >>> 0) / 4294967296
}
const r1 = (n: number) => Math.round(n * 10) / 10
const dust = Array.from({ length: 34 }, (_, i) => ({
  cx: r1(380 + rand(i) * 860),
  cy: r1(260 + rand(i + 50) * 520),
  r: r1(3 + rand(i + 99) * 10),
}))

function Before({ u }: { u: string }) {
  const studs = [110, 170, 230, 290]
  return (
    <g className="ba-before">
      <path d={ceiling} fill="#dfddd8" />
      <path d={leftWall} fill="#dad6cc" />
      <path d={rightWall} fill="#dedad0" />
      <path d={backWall} fill="#d4cfc4" />
      {/* missing drywall on the left wall */}
      <path d="M90 130L320 250V640L90 790Z" fill="#ece8e2" />
      {studs.map((x) => {
        const top = (200 * x) / 380 + 70
        const bot = 1000 - (300 * x) / 380 - 150
        return <path key={x} d={`M${x} ${top}L${x + 12} ${top + 6}V${bot - 4}L${x} ${bot}Z`} fill="#d6c3ae" />
      })}
      {/* stains + patches */}
      <g filter={`url(#${u}-blur)`} fill="#e3dfd5" opacity="0.8">
        <ellipse cx="520" cy="230" rx="90" ry="40" />
        <ellipse cx="1150" cy="300" rx="60" ry="110" />
        <ellipse cx="880" cy="640" rx="140" ry="30" />
      </g>
      <rect x="560" y="400" width="96" height="60" fill="#c4beb1" opacity="0.8" />
      <rect x="1090" y="500" width="70" height="90" fill="#c4beb1" opacity="0.7" />
      {/* old floor */}
      <path d={floor} fill="#dbd6cd" />
      <path d={oldFloorGrid()} stroke="#e7e3db" strokeWidth="2" fill="none" />
      <ellipse cx="700" cy="860" rx="160" ry="40" fill="#e5e0d8" opacity="0.8" />
      {/* old window with bent blinds */}
      <g className="ba-oldwin">
        <rect x="790" y="270" width="200" height="200" fill="#bfc8d0" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M796 ${285 + i * 18}L984 ${282 + i * 18 + (i === 4 ? 14 : i === 5 ? -6 : 0)}`} stroke="#9aa0a4" strokeWidth="4" />
        ))}
        <rect x="790" y="270" width="200" height="200" fill="none" stroke="#8f9396" strokeWidth="8" />
      </g>
      {/* dated cabinets */}
      <g className="ba-oldcab">
        <rect x="420" y="240" width="340" height="140" fill="#d8c6ae" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={i === 2 ? 'rotate(5 632 250)' : undefined}>
            <rect x={424 + i * 84} y="246" width="78" height="128" fill="#d4c0a5" stroke="#e2d3c2" strokeWidth="3" />
            <path d={`M${436 + i * 84} 364V290Q${463 + i * 84} 262 ${490 + i * 84} 290V364Z`} fill="none" stroke="#e2d3c2" strokeWidth="3" />
            <circle cx={i % 2 ? 432 + i * 84 : 492 + i * 84} cy="350" r="4" fill="#c6b189" />
          </g>
        ))}
        <rect x="412" y="545" width="596" height="16" fill="#b8a888" />
        <rect x="420" y="561" width="580" height="139" fill="#d8c6ae" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <rect x={426 + i * 96} y="570" width="88" height="122" fill="#d4c0a5" stroke="#e2d3c2" strokeWidth="3" />
            <path d={`M${440 + i * 96} 680V612Q${470 + i * 96} 586 ${500 + i * 96} 612V680Z`} fill="none" stroke="#e2d3c2" strokeWidth="3" />
          </g>
        ))}
        <rect x="1040" y="600" width="130" height="100" fill="#c8bca6" />
        <path d="M1040 600l20 -18h130l-20 18M1170 600l20 -18v100l-20 18" fill="#d4c9b1" />
      </g>
      {/* debris */}
      <g className="ba-debris" fill="#d2cbc0">
        <path d="M300 900l60 -20l30 30l-40 20z" />
        <path d="M1180 860l90 -10l10 24l-100 6z" />
        <rect x="560" y="930" width="120" height="10" transform="rotate(-8 620 935)" fill="#d6c3ae" />
      </g>
      {/* bare bulb */}
      <path d="M800 60V168" stroke="#e8e8e8" strokeWidth="2" />
      <circle className="ba-bulb" cx="800" cy="180" r="12" fill="#e8d9a8" />
      <circle className="ba-bulb" cx="800" cy="180" r="160" fill={`url(#${u}-bulbglow)`} />
      <rect className="ba-dim" width="1600" height="1000" fill="#a89878" opacity="0.32" />
    </g>
  )
}

function After({ staticState, u }: { staticState: boolean; u: string }) {
  const hidden = staticState ? undefined : { opacity: 0 }
  return (
    <g className="ba-after">
      {/* paint: walls + ceiling revealed by a sweeping wipe */}
      <g clipPath={`url(#${u}-wipe)`}>
        <path d={ceiling} fill="#e9e3d6" />
        <path d={leftWall} fill="#d9d1c0" />
        <path d={rightWall} fill="#cfc6b3" />
        <path d={backWall} fill="#e4ddcd" />
        {[
          [560, 70],
          [800, 70],
          [1040, 70],
          [640, 150],
          [960, 150],
        ].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="22" ry="6" fill="#fff6e0" />
        ))}
        {/* crown line */}
        <path d={`M0 12L${BACK.x0} ${BACK.y0 + 6}H${BACK.x1}L1600 12`} stroke="#fff" strokeOpacity="0.8" strokeWidth="6" fill="none" />
      </g>
      <rect className="a-roller" x={staticState ? -40 : 0} y="0" width="6" height="1000" fill="#b08a45" opacity={staticState ? 0 : 1} style={hidden} />

      {/* floor slides in */}
      <g clipPath={`url(#${u}-floorclip)`}>
        <g className="a-floor" style={hidden}>
          <path d={floor} fill={`url(#${u}-oak)`} />
          <path d={planks()} stroke="#decbba" strokeOpacity="0.55" strokeWidth="1.6" fill="none" />
          <path d={floor} fill={`url(#${u}-floorsheen)`} />
        </g>
      </g>

      {/* window: finished trim + evening view */}
      <g className="a-window" style={hidden}>
        <rect x="772" y="252" width="236" height="236" fill="#f7f3ea" />
        <rect x="790" y="270" width="200" height="200" fill={`url(#${u}-view)`} />
        <path d="M790 420C850 400 920 430 990 395V470H790Z" fill="#d9c3b0" opacity="0.6" />
        <path className="a-trim" d="M790 270H990V470H790ZM890 270V470M790 370H990" stroke="#e6e6e6" strokeWidth="8" fill="none" />
      </g>

      {/* backsplash */}
      <g className="a-splash">
        {Array.from({ length: 8 }, (_, r) =>
          Array.from({ length: 14 }, (_, c) => (
            <rect
              key={`${r}-${c}`}
              className="a-tile"
              x={420 + c * 26 + (r % 2 ? 13 : 0)}
              y={386 + r * 20}
              width="24"
              height="18"
              fill={(r + c) % 5 ? '#f1ede4' : '#e8e2d6'}
              style={hidden}
            />
          ))
        )}
      </g>

      {/* cabinets */}
      <g className="a-cab">
        <rect className="a-door" x="420" y="240" width="340" height="140" fill={`url(#${u}-oakv)`} style={hidden} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} className="a-door" style={hidden}>
            <rect x={422 + i * 85} y="242" width="81" height="136" fill={`url(#${u}-oakv)`} stroke="#e7dacd" strokeWidth="1.5" />
            <rect x={i % 2 ? 428 + i * 85 : 495 + i * 85} y="340" width="3" height="30" fill="#b08a45" />
          </g>
        ))}
        <rect className="a-door" x="420" y="560" width="580" height="140" fill="#e0e0e0" style={hidden} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i} className="a-door" style={hidden}>
            <rect x={422 + i * 96.3} y="562" width="94" height="136" fill="#dddddd" stroke="#e8e8e8" strokeWidth="1.5" />
            <rect x={440 + i * 96.3} y="578" width="58" height="3" fill="#b08a45" />
          </g>
        ))}
        <rect className="a-door" x="410" y="540" width="600" height="22" fill="#f4f1ea" style={hidden} />
        <g className="a-door" style={hidden}>
          <rect x="1030" y="240" width="170" height="460" fill={`url(#${u}-oakv)`} />
          <path d="M1115 240V700" stroke="#e7dacd" strokeWidth="2" />
          <rect x="1104" y="430" width="3" height="60" fill="#b08a45" />
          <rect x="1123" y="430" width="3" height="60" fill="#b08a45" />
        </g>
      </g>

      {/* island rises */}
      <g className="a-island" style={hidden}>
        <rect x="490" y="766" width="620" height="170" fill="#e2e2e2" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={500 + i * 152} y="776" width="146" height="150" fill="#dfdfdf" stroke="#e8e8e8" strokeWidth="1.5" />
        ))}
        <rect x="470" y="740" width="660" height="28" fill="#f7f4ee" />
        <rect x="470" y="740" width="28" height="196" fill="#f1ede5" />
        <rect x="1102" y="740" width="28" height="196" fill="#f1ede5" />
      </g>

      {/* lighting */}
      <g className="a-lights">
        {[640, 800, 960].map((x) => (
          <g key={x} className="a-pendant">
            <path d={`M${x} 40V520`} stroke="#e6e6e6" strokeWidth="2" />
            <path d={`M${x - 26} 562L${x - 10} 520H${x + 10}L${x + 26} 562Z`} fill="#e6e6e6" />
            <ellipse className="a-glow" cx={x} cy="562" rx="24" ry="5" fill="#ffe9bf" style={hidden} />
          </g>
        ))}
        <g className="a-glow" style={hidden}>
          {[640, 800, 960].map((x) => (
            <path key={x} d={`M${x - 24} 564L${x - 120} 740H${x + 120}L${x + 24} 564Z`} fill={`url(#${u}-cone)`} />
          ))}
          <rect x="420" y="380" width="340" height="6" fill="#ffe2a8" />
          <rect x="420" y="386" width="340" height="80" fill={`url(#${u}-under)`} />
          <rect width="1600" height="1000" fill={`url(#${u}-warm)`} style={{ mixBlendMode: 'soft-light' }} />
        </g>
      </g>
    </g>
  )
}

export default function Room({
  show = 'all',
  className = '',
  id,
}: {
  show?: 'all' | 'before' | 'after'
  className?: string
  /** Unique prefix for SVG ids when the same state is rendered more than once. */
  id?: string
}) {
  const staticAfter = show === 'after'
  const u = id ?? `room-${show}`
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <defs>
        <filter id={`${u}-blur`}>
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <radialGradient id={`${u}-bulbglow`}>
          <stop offset="0" stopColor="#e8d9a8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#e8d9a8" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${u}-wipe`}>
          <rect className="a-wipe" x="0" y="0" width={staticAfter ? 1600 : 0} height="1000" />
        </clipPath>
        <clipPath id={`${u}-floorclip`}>
          <path d={floor} />
        </clipPath>
        <linearGradient id={`${u}-oak`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfb59c" />
          <stop offset="1" stopColor="#b8895a" />
        </linearGradient>
        <linearGradient id={`${u}-oakv`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c8ac8d" />
          <stop offset="1" stopColor="#d5bda7" />
        </linearGradient>
        <radialGradient id={`${u}-floorsheen`} cx="0.5" cy="0.2" r="0.8">
          <stop offset="0" stopColor="#ffe6b8" stopOpacity="0.28" />
          <stop offset="1" stopColor="#a89878" stopOpacity="0.25" />
        </radialGradient>
        <linearGradient id={`${u}-view`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9d1db" />
          <stop offset="0.6" stopColor="#c98b4c" />
          <stop offset="1" stopColor="#f0c088" />
        </linearGradient>
        <linearGradient id={`${u}-cone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe2a8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffe2a8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${u}-under`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe2a8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffe2a8" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${u}-warm`} cx="0.5" cy="0.55" r="0.75">
          <stop offset="0" stopColor="#ffcf86" stopOpacity="0.55" />
          <stop offset="1" stopColor="#a89878" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      {show !== 'after' && <Before u={u} />}
      {show !== 'before' && <After staticState={staticAfter} u={u} />}
      {show === 'all' && (
        <g className="ba-dust" style={{ opacity: 0 }}>
          {dust.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#cfc5b0" opacity={0.25 + (i % 4) * 0.1} />
          ))}
        </g>
      )}
    </svg>
  )
}
