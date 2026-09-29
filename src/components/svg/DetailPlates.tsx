/**
 * Close-up construction "plates" — moody, architectural renderings used where
 * photography isn't available yet. All drawn at 1200 × 900 and cropped with `slice`.
 */

export type PlateKind =
  | 'framing'
  | 'texture'
  | 'flooring'
  | 'trim'
  | 'door'
  | 'window'
  | 'tile'
  | 'bath'
  | 'deck'
  | 'commercial'

const W = 1200
const H = 900

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#decbbb" />
        <stop offset="0.45" stopColor="#cfb59c" />
        <stop offset="1" stopColor="#e2d1c3" />
      </linearGradient>
      <linearGradient id={`${id}-oak`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e6d8cb" />
        <stop offset="1" stopColor="#cbae92" />
      </linearGradient>
      <radialGradient id={`${id}-light`} cx="0.7" cy="0.2" r="0.9">
        <stop offset="0" stopColor="#E9B872" stopOpacity="0.35" />
        <stop offset="0.5" stopColor="#E9B872" stopOpacity="0.06" />
        <stop offset="1" stopColor="#a89878" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a89878" stopOpacity="0.55" />
        <stop offset="0.4" stopColor="#a89878" stopOpacity="0" />
        <stop offset="1" stopColor="#a89878" stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id={`${id}-warm`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6d59a" />
        <stop offset="1" stopColor="#cdb397" />
      </linearGradient>
      <filter id={`${id}-knock`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="4" />
        <feColorMatrix values="0 0 0 0 0.93  0 0 0 0 0.9  0 0 0 0 0.84  0 0 0 -2.2 1.35" />
      </filter>
    </defs>
  )
}

function Framing({ id }: { id: string }) {
  const studs = Array.from({ length: 9 }, (_, i) => 60 + i * 140)
  return (
    <>
      <rect width={W} height={H} fill="#edebe9" />
      {studs.map((x, i) => (
        <g key={x}>
          <rect x={x} y="80" width="56" height="820" fill={`url(#${id}-wood)`} opacity={0.75 + (i % 3) * 0.08} />
          {Array.from({ length: 6 }, (_, k) => (
            <path key={k} d={`M${x + 8 + k * 8} 80C${x + 14 + k * 8} 300 ${x + 2 + k * 8} 600 ${x + 10 + k * 8} 900`} stroke="#eaded4" strokeOpacity="0.45" fill="none" />
          ))}
          <circle cx={x + 28} cy="112" r="3" fill="#b8b3a7" />
          <circle cx={x + 28} cy="128" r="3" fill="#b8b3a7" />
        </g>
      ))}
      <rect x="0" y="40" width={W} height="44" fill={`url(#${id}-wood)`} />
      <rect x="0" y="0" width={W} height="40" fill="#d9c4b1" />
      <rect x="0" y="480" width={W} height="40" fill={`url(#${id}-wood)`} opacity="0.85" transform="rotate(-2 600 500)" />
    </>
  )
}

function Texture({ id }: { id: string }) {
  return (
    <>
      <rect width={W} height={H} fill="#cfc8b8" />
      <rect width={W} height={H} filter={`url(#${id}-knock)`} opacity="0.55" />
      <linearGradient id={`${id}-rake`} x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0" stopColor="#fff3dc" stopOpacity="0.25" />
        <stop offset="1" stopColor="#a89878" stopOpacity="0.55" />
      </linearGradient>
      <rect width={W} height={H} fill={`url(#${id}-rake)`} />
      <rect width={W} height={H} fill="#a89878" opacity="0.2" />
    </>
  )
}

function Flooring({ id }: { id: string }) {
  const vx = 600
  const vy = -600
  const lines = Array.from({ length: 26 }, (_, i) => -900 + i * 120)
  return (
    <>
      <rect width={W} height={H} fill={`url(#${id}-oak)`} />
      {lines.map((x, i) => (
        <path key={i} d={`M${vx} ${vy}L${x} ${H}`} stroke="#ebe0d6" strokeOpacity="0.55" strokeWidth="2" />
      ))}
      {Array.from({ length: 16 }, (_, i) => {
        const t = 0.15 + (i / 16) * 0.85
        const y = vy + (H - vy) * t
        const x = -900 + ((i * 7) % 26) * 120
        const x1 = vx + (x - vx) * t
        const x2 = vx + (x + 120 - vx) * t
        return <path key={`j${i}`} d={`M${x1} ${y}L${x2} ${y}`} stroke="#ebe0d6" strokeOpacity="0.6" strokeWidth="2" />
      })}
      <rect width={W} height={H} fill={`url(#${id}-light)`} />
      <rect width={W} height={H} fill={`url(#${id}-shade)`} />
    </>
  )
}

function Trim() {
  return (
    <>
      <rect width={W} height={H} fill="#eaeaea" />
      <g fill="none" stroke="#b08a45" strokeWidth="2">
        {/* crown profile */}
        <path d="M200 160H560V190C520 190 510 210 500 230C480 270 450 260 430 300C410 340 380 330 360 360H330V400H200Z" />
        <path d="M200 160V400" strokeOpacity="0.4" strokeDasharray="4 6" />
        {/* casing profile */}
        <path d="M680 180H960V210H930C920 230 900 230 890 250H760C750 270 730 270 720 290H680Z" />
        {/* baseboard */}
        <path d="M680 560H1000V600C980 600 975 620 960 630H720C700 640 690 660 680 660V760H1000" />
      </g>
      <g stroke="#3a332a" strokeOpacity="0.5" fill="none">
        <path d="M200 440H560M200 430V450M560 430V450" />
        <path d="M600 160V400M590 160H610M590 400H610" />
        <path d="M680 320H960M680 310V330M960 310V330" />
      </g>
      <g fill="#b08a45" fontFamily="monospace" fontSize="16" letterSpacing="3">
        <text x="200" y="130">CROWN · DETAIL 1</text>
        <text x="680" y="150">CASING · DETAIL 2</text>
        <text x="680" y="530">BASE · DETAIL 3</text>
      </g>
      <g fill="#3a332a" fillOpacity="0.4" fontFamily="monospace" fontSize="13" letterSpacing="2">
        <text x="340" y="470">PROFILE</text>
        <text x="200" y="840">SCALE 1:2 · FINISH CARPENTRY</text>
      </g>
    </>
  )
}

function Door({ id }: { id: string }) {
  return (
    <>
      <rect width={W} height={H} fill="#d8d1c2" />
      <rect width={W} height={H} fill="#a89878" opacity="0.35" />
      <rect x="380" y="60" width="440" height="840" fill="#f1ece1" opacity="0.9" />
      <rect x="420" y="100" width="360" height="800" fill="#e3e3e3" />
      {[
        [450, 130, 300, 240],
        [450, 400, 300, 470],
      ].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#dedede" stroke="#ebebeb" strokeWidth="6" />
          <rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} fill="none" stroke="#d4d4d4" strokeWidth="2" />
        </g>
      ))}
      <rect x="730" y="470" width="10" height="90" rx="4" fill="#b08a45" />
      <rect width={W} height={H} fill={`url(#${id}-light)`} />
      <rect x="0" y="860" width={W} height="40" fill={`url(#${id}-oak)`} />
      <rect width={W} height={H} fill={`url(#${id}-shade)`} opacity="0.7" />
    </>
  )
}

function Window({ id }: { id: string }) {
  return (
    <>
      <rect width={W} height={H} fill="#bdb5a4" />
      <rect width={W} height={H} fill="#a89878" opacity="0.45" />
      <rect x="300" y="100" width="600" height="700" fill="#e7e1d4" opacity="0.8" />
      <rect x="340" y="140" width="520" height="620" fill={`url(#${id}-warm)`} />
      <path d="M340 600C480 560 620 620 860 540V760H340Z" fill="#e6d8cb" opacity="0.6" />
      <g stroke="#e8e8e8" strokeWidth="14" fill="none">
        <rect x="340" y="140" width="520" height="620" />
        <path d="M600 140V760M340 450H860" />
      </g>
      <rect x="280" y="800" width="640" height="24" fill="#efe9dc" />
      <rect width={W} height={H} fill={`url(#${id}-shade)`} opacity="0.6" />
    </>
  )
}

function Tile({ id }: { id: string }) {
  const rows = []
  for (let y = 0; y < H; y += 60) {
    for (let x = (y / 60) % 2 ? -90 : 0; x < W; x += 180) {
      rows.push(<rect key={`${x}-${y}`} x={x + 2} y={y + 2} width="176" height="56" fill={(x + y) % 7 ? '#e6e0d3' : '#ddd6c8'} />)
    }
  }
  return (
    <>
      <rect width={W} height={H} fill="#9a968d" />
      {rows}
      <rect width={W} height={H} fill={`url(#${id}-light)`} />
      <rect width={W} height={H} fill="#a89878" opacity="0.28" />
      <rect width={W} height={H} fill={`url(#${id}-shade)`} opacity="0.5" />
    </>
  )
}

function Bath({ id }: { id: string }) {
  return (
    <>
      <Tile id={id} />
      <rect x="360" y="120" width="480" height="340" rx="4" fill="#d7dde1" stroke="#b08a45" strokeWidth="6" />
      <rect x="360" y="120" width="480" height="340" fill={`url(#${id}-light)`} />
      <rect x="300" y="560" width="600" height="340" fill={`url(#${id}-wood)`} />
      <rect x="290" y="540" width="620" height="28" fill="#f3efe6" />
      <path d="M600 540V500H640" stroke="#b08a45" strokeWidth="8" fill="none" />
      <path d="M340 720H860" stroke="#e7d9cd" strokeWidth="4" />
      <rect x="560" y="610" width="80" height="6" fill="#b08a45" />
      <rect x="560" y="780" width="80" height="6" fill="#b08a45" />
      <rect width={W} height={H} fill={`url(#${id}-shade)`} opacity="0.6" />
    </>
  )
}

function Deck({ id }: { id: string }) {
  const boards = Array.from({ length: 22 }, (_, i) => i)
  return (
    <>
      <rect width={W} height={H} fill="#ede8e3" />
      <rect width={W} height="420" fill="#e9ded4" />
      <rect width={W} height="420" fill={`url(#${id}-light)`} />
      {boards.map((i) => {
        const t0 = i / 22
        const t1 = (i + 1) / 22
        const y0 = 420 + Math.pow(t0, 1.6) * 480
        const y1 = 420 + Math.pow(t1, 1.6) * 480
        return <rect key={i} x="0" y={y0} width={W} height={y1 - y0 - 2} fill={`url(#${id}-wood)`} opacity={0.55 + t0 * 0.4} />
      })}
      <g stroke="#ebebeb" strokeWidth="10">
        <path d="M0 250H1200M0 400H1200" />
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d={`M${20 + i * 52} 250V420`} strokeWidth="8" />
        ))}
      </g>
      <rect width={W} height={H} fill={`url(#${id}-shade)`} opacity="0.5" />
    </>
  )
}

function Commercial({ id }: { id: string }) {
  return (
    <>
      <rect width={W} height={H} fill="#ebebeb" />
      <rect x="80" y="160" width="1040" height="600" fill="#e1e1e1" />
      <rect x="80" y="140" width="1040" height="40" fill="#e6e6e6" />
      <rect x="140" y="260" width="920" height="440" fill={`url(#${id}-warm)`} opacity="0.85" />
      <g stroke="#eaeaea" strokeWidth="10" fill="none">
        <rect x="140" y="260" width="920" height="440" />
        <path d="M370 260V700M600 260V700M830 260V700M140 340H1060" />
      </g>
      <rect x="140" y="200" width="920" height="30" fill="#d9d9d9" />
      <rect x="0" y="760" width={W} height="140" fill="#eae9e5" />
      <ellipse cx="600" cy="770" rx="560" ry="70" fill="#E9B872" opacity="0.12" />
      <rect width={W} height={H} fill={`url(#${id}-shade)`} opacity="0.4" />
    </>
  )
}

export default function DetailPlate({ kind, className = '', id }: { kind: PlateKind; className?: string; id?: string }) {
  const uid = id ?? `pl-${kind}`
  const body = {
    framing: <Framing id={uid} />,
    texture: <Texture id={uid} />,
    flooring: <Flooring id={uid} />,
    trim: <Trim />,
    door: <Door id={uid} />,
    window: <Window id={uid} />,
    tile: <Tile id={uid} />,
    bath: <Bath id={uid} />,
    deck: <Deck id={uid} />,
    commercial: <Commercial id={uid} />,
  }[kind]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <Defs id={uid} />
      {body}
    </svg>
  )
}
