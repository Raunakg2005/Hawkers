/**
 * Flat 2D illustration for the landing hero: a Mumbai naka at 7 a.m. — chai
 * tapri, painted kerb, street sign, and five workers waiting with their tools.
 * Pure SVG (no images, no WebGL), colours from tokens so it follows the theme.
 */

type Tool = 'wrench' | 'roller' | 'trowel' | 'coil' | 'tiffin';

interface Person {
  x: number;
  scale: number;
  skin: string;
  shirt: string;
  pants: string;
  hair: 'short' | 'bun';
  hat?: 'hard' | 'cap';
  moustache?: boolean;
  kurta?: boolean;
  gamcha?: boolean;
  tool: Tool;
}

const INK = '#1c1410';
const STEEL = '#8a8f99';

const PEOPLE: Person[] = [
  { x: 196, scale: 1, skin: '#a8693a', shirt: 'var(--trade-plumber)', pants: '#3d4f5c', hair: 'short', moustache: true, tool: 'wrench' },
  { x: 274, scale: 0.95, skin: '#c68642', shirt: 'var(--trade-painter)', pants: '#efe4d2', hair: 'bun', kurta: true, tool: 'roller' },
  { x: 352, scale: 1.05, skin: '#7a4a26', shirt: 'var(--trade-mason)', pants: '#2b2f45', hair: 'short', hat: 'hard', moustache: true, tool: 'trowel' },
  { x: 430, scale: 1, skin: '#b0794a', shirt: 'var(--trade-electrician)', pants: '#4a3b32', hair: 'short', hat: 'cap', tool: 'coil' },
  { x: 506, scale: 0.94, skin: '#8d5524', shirt: 'var(--trade-labour)', pants: '#3d4f5c', hair: 'short', gamcha: true, tool: 'tiffin' },
];

function ToolShape({ tool, skin }: { tool: Tool; skin: string }) {
  switch (tool) {
    case 'wrench':
      return (
        <g transform="translate(28 -80) rotate(-12)">
          <rect x="-3" y="0" width="6" height="34" rx="3" fill={STEEL} />
          <path d="M-7 36 A8 8 0 1 0 7 36" fill="none" stroke={STEEL} strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    case 'roller':
      return (
        <g>
          <path d="M24 -118 L40 -186" stroke="#6b4a2b" strokeWidth="4" strokeLinecap="round" />
          <rect x="24" y="-200" width="40" height="14" rx="7" fill="var(--trade-painter)" />
          <rect x="26" y="-197" width="36" height="4" rx="2" fill="#fff" opacity="0.35" />
          <circle cx="24" cy="-118" r="5.5" fill={skin} />
        </g>
      );
    case 'trowel':
      return (
        <g transform="translate(29 -78)">
          <rect x="-2" y="-2" width="4" height="10" rx="2" fill="#6b4a2b" />
          <path d="M0 6 L9 20 L0 28 L-9 20 Z" fill={STEEL} />
        </g>
      );
    case 'coil':
      return (
        <g fill="none" stroke="#c0392b" strokeLinecap="round">
          <circle cx="-17" cy="-114" r="15" strokeWidth="5" />
          <circle cx="-17" cy="-114" r="9" strokeWidth="3" />
          <rect x="7" y="-126" width="3.5" height="13" rx="1.5" fill="var(--trade-electrician)" stroke="none" />
        </g>
      );
    case 'tiffin':
      return (
        <g transform="translate(-28 -76)">
          <path d="M-8 4 Q0 -8 8 4" fill="none" stroke={STEEL} strokeWidth="2.5" />
          <rect x="-11" y="4" width="22" height="9" rx="3" fill="#c9d1d9" />
          <rect x="-11" y="14" width="22" height="9" rx="3" fill="#b8c1ca" />
          <rect x="-11" y="24" width="22" height="9" rx="3" fill="#c9d1d9" />
        </g>
      );
  }
}

function Worker({ p }: { p: Person }) {
  const raised = p.tool === 'roller';
  const bottom = p.kurta ? -44 : -66;
  return (
    <g transform={`translate(${p.x} 434) scale(${p.scale})`}>
      <ellipse cx="0" cy="2" rx="27" ry="5" fill="#000" opacity="0.12" />
      {/* legs + chappals */}
      <rect x="-13" y="-72" width="11" height="70" rx="5" fill={p.pants} />
      <rect x="2" y="-72" width="11" height="70" rx="5" fill={p.pants} />
      <rect x="-16" y="-5" width="15" height="6" rx="3" fill={INK} />
      <rect x="1" y="-5" width="15" height="6" rx="3" fill={INK} />
      {p.tool === 'roller' && (
        <g fill="var(--trade-painter)">
          <circle cx="-8" cy="-30" r="2" />
          <circle cx="7" cy="-18" r="1.6" />
          <circle cx="-5" cy="-12" r="1.4" />
        </g>
      )}
      {/* arms behind torso */}
      <path d="M-20 -126 L-25 -106" stroke={p.shirt} strokeWidth="11" strokeLinecap="round" />
      <path d="M-25 -106 L-28 -82" stroke={p.skin} strokeWidth="8.5" strokeLinecap="round" />
      <circle cx="-28" cy="-80" r="5.5" fill={p.skin} />
      {raised ? (
        <>
          <path d="M20 -126 L30 -112" stroke={p.shirt} strokeWidth="11" strokeLinecap="round" />
          <path d="M30 -112 L25 -120" stroke={p.skin} strokeWidth="8.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M20 -126 L25 -106" stroke={p.shirt} strokeWidth="11" strokeLinecap="round" />
          <path d="M25 -106 L28 -82" stroke={p.skin} strokeWidth="8.5" strokeLinecap="round" />
          <circle cx="28" cy="-80" r="5.5" fill={p.skin} />
        </>
      )}
      {/* torso */}
      <path
        d={`M-23 ${bottom} C-24 -100 -25 -118 -20 -128 Q-14 -136 0 -136 Q14 -136 20 -128 C25 -118 24 -100 23 ${bottom} Z`}
        fill={p.shirt}
      />
      <path d="M-6 -136 L0 -126 L6 -136 Z" fill={p.skin} />
      {p.kurta && <path d="M-20 -128 Q0 -100 22 -76" stroke="#efe4d2" strokeWidth="6" fill="none" opacity="0.85" />}
      {p.gamcha && (
        <g>
          <path d="M8 -136 Q22 -134 22 -122 L22 -96 L14 -96 L14 -122 Q14 -128 6 -130 Z" fill="#c0392b" />
          <path d="M14 -112 H22 M14 -104 H22" stroke="#fff" strokeWidth="1.6" opacity="0.8" />
        </g>
      )}
      <ToolShape tool={p.tool} skin={p.skin} />
      {/* neck + head */}
      <rect x="-5" y="-147" width="10" height="13" rx="3" fill={p.skin} />
      <ellipse cx="0" cy="-160" rx="14" ry="16" fill={p.skin} />
      <path d="M-14 -162 C-15 -176 -6 -180 0 -180 C9 -180 15 -174 14 -162 C11 -170 5 -172 0 -172 C-6 -172 -11 -170 -14 -162 Z" fill={INK} />
      {p.hair === 'bun' && (
        <>
          <circle cx="0" cy="-182" r="7" fill={INK} />
          <path d="M-14 -162 C-15 -150 -12 -146 -10 -144 L-13 -160 Z M14 -162 C15 -150 12 -146 10 -144 L13 -160 Z" fill={INK} />
        </>
      )}
      <circle cx="-5" cy="-160" r="1.5" fill={INK} />
      <circle cx="5" cy="-160" r="1.5" fill={INK} />
      {p.moustache ? (
        <path d="M-6 -152 Q0 -156 6 -152 Q0 -150 -6 -152 Z" fill={INK} />
      ) : (
        <path d="M-4 -151 Q0 -148 4 -151" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      )}
      {p.hair === 'bun' && <circle cx="0" cy="-167" r="1.6" fill="#c0392b" />}
      {p.hat === 'hard' && (
        <g>
          <path d="M-16 -167 A16 14 0 0 1 16 -167 Z" fill="#ffc21a" />
          <rect x="-19" y="-168" width="38" height="4.5" rx="2" fill="#f0a500" />
          <rect x="-1.5" y="-180" width="3" height="12" rx="1.5" fill="#f0a500" />
        </g>
      )}
      {p.hat === 'cap' && (
        <g fill="#2b2f45">
          <path d="M-14 -167 A14 12 0 0 1 14 -167 Z" />
          <path d="M6 -169 H22 A2.5 2.5 0 0 1 22 -164 H6 Z" />
        </g>
      )}
    </g>
  );
}

export default function NakaScene() {
  const kerb = Array.from({ length: 21 });
  return (
    <svg className="naka-scene" viewBox="0 0 640 520" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="ns-clip">
          <rect width="640" height="520" rx="28" />
        </clipPath>
      </defs>
      <g clipPath="url(#ns-clip)">
        {/* morning sky + sun */}
        <rect width="640" height="520" fill="var(--scene-sky)" />
        <circle cx="468" cy="168" r="66" fill="var(--scene-window)" opacity="0.55" />
        <circle cx="468" cy="168" r="44" fill="var(--scene-window)" opacity="0.8" />

        {/* far skyline */}
        <g fill="var(--scene-building-2)">
          <rect x="0" y="230" width="58" height="160" />
          <rect x="62" y="180" width="46" height="210" />
          <rect x="112" y="250" width="70" height="140" />
          <rect x="188" y="160" width="52" height="230" />
          <rect x="246" y="215" width="80" height="175" />
          <rect x="332" y="140" width="56" height="250" />
          <rect x="394" y="205" width="74" height="185" />
          <rect x="474" y="175" width="60" height="215" />
          <rect x="540" y="230" width="100" height="160" />
        </g>
        <g fill="var(--scene-window)" opacity="0.45">
          {[
            [72, 200], [88, 200], [72, 226], [88, 252], [198, 180], [216, 206], [198, 232], [216, 258],
            [342, 160], [360, 160], [342, 190], [360, 220], [342, 250], [484, 196], [502, 222], [484, 248],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="9" height="12" rx="1.5" />
          ))}
        </g>

        {/* chawl block with balconies */}
        <g>
          <rect x="520" y="262" width="140" height="128" fill="var(--scene-building)" />
          {[282, 314, 346].map((y) => (
            <g key={y}>
              <rect x="530" y={y} width="120" height="4" fill="var(--scene-road)" />
              {[536, 566, 596, 626].map((x) => (
                <rect key={x} x={x} y={y - 16} width="14" height="14" rx="2" fill="var(--scene-building-2)" />
              ))}
            </g>
          ))}
          <path d="M548 300 h26 M600 332 h22" stroke="var(--trade-painter)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* chai tapri */}
        <g>
          <rect x="22" y="300" width="124" height="90" rx="4" fill="var(--trade-carpenter)" />
          <rect x="30" y="330" width="108" height="8" rx="2" fill="#000" opacity="0.15" />
          <g>
            {Array.from({ length: 7 }).map((_, i) => (
              <path key={i} d={`M${14 + i * 20} 282 h20 l-2 26 h-16 z`} fill={i % 2 ? '#fff' : 'var(--color-brand)'} />
            ))}
          </g>
          <rect x="44" y="254" width="80" height="26" rx="4" fill="#fff" />
          <text x="84" y="273" textAnchor="middle" fontSize="16" fontWeight="800" fill="#c0392b" fontFamily="var(--font-body)">
            चाय
          </text>
          {[44, 58, 72].map((x) => (
            <rect key={x} x={x} y="318" width="8" height="12" rx="1.5" fill="#fff" opacity="0.8" />
          ))}
          <path d="M104 330 v-14 a8 8 0 0 1 16 0 v14 z" fill={STEEL} />
        </g>

        {/* footpath, painted kerb, road */}
        <rect y="388" width="640" height="52" fill="var(--scene-ground)" />
        {kerb.map((_, i) => (
          <rect key={i} x={i * 32 - 8} y="436" width="32" height="14" fill={i % 2 ? '#2a2a2a' : '#f2c200'} />
        ))}
        <rect y="450" width="640" height="70" fill="var(--scene-road)" />
        <path d="M0 488 H640" stroke="#fff" strokeWidth="4" strokeDasharray="34 26" opacity="0.6" />

        {/* lamp post + blue street sign */}
        <g>
          <rect x="598" y="196" width="7" height="242" rx="3" fill="#3d382f" />
          <path d="M601 200 Q601 186 586 186 H566" stroke="#3d382f" strokeWidth="6" fill="none" strokeLinecap="round" />
          <ellipse cx="562" cy="190" rx="12" ry="6" fill="var(--scene-window)" />
          <rect x="538" y="300" width="92" height="40" rx="4" fill="#1f4fa0" stroke="#fff" strokeWidth="2" />
          <text x="584" y="317" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" fontFamily="var(--font-body)">
            कुर्ला नाका
          </text>
          <text x="584" y="332" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" letterSpacing="1" fontFamily="var(--font-body)">
            KURLA NAKA
          </text>
        </g>

        {/* job pins: dashed lines from the floating tickets down to two workers */}
        <g fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeDasharray="5 6" strokeLinecap="round">
          <path d="M150 118 C160 170 190 200 196 244" />
          <path className="pin-2" d="M500 160 C480 200 440 214 430 244" />
        </g>
        <circle cx="196" cy="248" r="5" fill="var(--color-brand)" />
        <circle className="pin-2" cx="430" cy="248" r="5" fill="var(--color-brand)" />

        {PEOPLE.map((p) => (
          <Worker key={p.x} p={p} />
        ))}
      </g>
    </svg>
  );
}
