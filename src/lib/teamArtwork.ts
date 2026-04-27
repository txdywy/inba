const TEAM_PALETTES: Record<string, [string, string, string]> = {
  ATL: ['#e03a3e', '#fff1c1', '#0c2340'],
  BOS: ['#007a33', '#f7f4ea', '#ba9653'],
  BKN: ['#111111', '#ffffff', '#6f6f6f'],
  CHA: ['#1d1160', '#00788c', '#a1a1a1'],
  CHI: ['#ce1141', '#ffffff', '#111111'],
  CLE: ['#6f263d', '#ffb81c', '#041e42'],
  DAL: ['#00538c', '#b8c4ca', '#1d428a'],
  DEN: ['#0e2240', '#fec524', '#8b2131'],
  DET: ['#c8102e', '#006bb6', '#ffffff'],
  GSW: ['#1d428a', '#ffc72c', '#006bb6'],
  HOU: ['#ce1141', '#ffffff', '#c4ced4'],
  IND: ['#002d62', '#fdbb30', '#bec0c2'],
  LAC: ['#c8102e', '#1d428a', '#ffffff'],
  LAL: ['#552583', '#fdb927', '#000000'],
  MEM: ['#5d76a9', '#12173f', '#e9ecef'],
  MIA: ['#98002e', '#f9a01b', '#000000'],
  MIL: ['#00471b', '#eee1c6', '#0077c0'],
  MIN: ['#0c2340', '#236192', '#78be20'],
  NOP: ['#0c2340', '#c8102e', '#85714d'],
  NYK: ['#006bb6', '#f58426', '#ffffff'],
  OKC: ['#007ac1', '#ef3b24', '#fdbb30'],
  ORL: ['#0077c0', '#c4ced4', '#000000'],
  PHI: ['#006bb6', '#ed174c', '#002b5c'],
  PHX: ['#e56020', '#1d1160', '#000000'],
  POR: ['#e03a3e', '#ffffff', '#000000'],
  SAC: ['#5a2d81', '#63727a', '#ffffff'],
  SAS: ['#c4ced4', '#000000', '#a5a5a5'],
  TOR: ['#ce1141', '#000000', '#a1a1a1'],
  UTA: ['#00471b', '#f9a01b', '#002b5c'],
  WAS: ['#002b5c', '#e31837', '#c4ced4'],
};

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function hashTeam(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function getPalette(teamKey: string) {
  return TEAM_PALETTES[teamKey] ?? ['#f3c05d', '#0e1324', '#7ef0dc'];
}

export function createTeamArtwork(teamName: string, abbreviation: string) {
  const teamKey = abbreviation.toUpperCase();
  const [primary, accent, dark] = getPalette(teamKey);
  const seed = hashTeam(`${teamName}-${teamKey}`);
  const tilt = 10 + (seed % 18);
  const halo = 68 + (seed % 20);
  const flare = 20 + (seed % 16);
  const title = escapeXml(teamName);
  const code = escapeXml(teamKey);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
      <title id="title">${title}</title>
      <desc id="desc">Decorative team artwork for ${title}</desc>
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primary}" />
          <stop offset="100%" stop-color="${dark}" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="46%" r="72%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.95" />
          <stop offset="55%" stop-color="${accent}" stop-opacity="0.18" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="stripe" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0.72" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#bg)" />
      <rect width="1200" height="675" fill="url(#glow)" />
      <g opacity="0.32" transform="translate(${flare} ${flare}) rotate(${tilt} 600 337)">
        <rect x="-40" y="120" width="1280" height="18" rx="9" fill="url(#stripe)" />
        <rect x="-40" y="236" width="1280" height="18" rx="9" fill="url(#stripe)" />
        <rect x="-40" y="352" width="1280" height="18" rx="9" fill="url(#stripe)" />
        <rect x="-40" y="468" width="1280" height="18" rx="9" fill="url(#stripe)" />
      </g>
      <circle cx="948" cy="156" r="${halo}" fill="#ffffff" fill-opacity="0.12" />
      <circle cx="220" cy="522" r="${halo + 18}" fill="#ffffff" fill-opacity="0.08" />
      <g transform="translate(94 108)">
        <rect x="0" y="0" width="430" height="460" rx="48" fill="#ffffff" fill-opacity="0.08" />
        <rect x="34" y="34" width="362" height="392" rx="34" fill="#000000" fill-opacity="0.12" />
        <text x="52%" y="49%" text-anchor="middle" fill="#ffffff" font-size="150" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="8">${code}</text>
        <text x="52%" y="69%" text-anchor="middle" fill="#ffffff" fill-opacity="0.84" font-size="40" font-family="Arial, Helvetica, sans-serif" font-weight="600" letter-spacing="6">${title}</text>
      </g>
      <g transform="translate(612 112)">
        <rect x="0" y="0" width="486" height="444" rx="44" fill="#ffffff" fill-opacity="0.07" />
        <circle cx="238" cy="210" r="164" fill="#ffffff" fill-opacity="0.12" />
        <circle cx="238" cy="210" r="114" fill="#ffffff" fill-opacity="0.18" />
        <circle cx="238" cy="210" r="68" fill="#ffffff" fill-opacity="0.26" />
        <text x="238" y="223" text-anchor="middle" fill="#ffffff" font-size="62" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="5">NBA</text>
      </g>
      <text x="1032" y="610" text-anchor="end" fill="#ffffff" fill-opacity="0.42" font-size="30" font-family="Arial, Helvetica, sans-serif" font-weight="600" letter-spacing="6">LIVE HUB</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}

export function createTeamInitials(teamName: string) {
  return teamName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 3)
    .join('')
    .toUpperCase();
}

const TEAM_IDS: Record<string, number> = {
  ATL: 1610612737,
  BOS: 1610612738,
  BKN: 1610612751,
  CHA: 1610612766,
  CHI: 1610612741,
  CLE: 1610612739,
  DAL: 1610612742,
  DEN: 1610612743,
  DET: 1610612765,
  GSW: 1610612744,
  HOU: 1610612745,
  IND: 1610612754,
  LAC: 1610612746,
  LAL: 1610612747,
  MEM: 1610612763,
  MIA: 1610612748,
  MIL: 1610612749,
  MIN: 1610612750,
  NOP: 1610612740,
  NYK: 1610612752,
  OKC: 1610612760,
  ORL: 1610612753,
  PHI: 1610612755,
  PHX: 1610612756,
  POR: 1610612757,
  SAC: 1610612758,
  SAS: 1610612759,
  TOR: 1610612761,
  UTA: 1610612762,
  WAS: 1610612764,
};

export function createTeamLogoUrl(abbreviation: string) {
  const teamId = TEAM_IDS[abbreviation.toUpperCase()];
  if (!teamId) {
    return createTeamArtwork(abbreviation, abbreviation);
  }

  return `https://cdn.nba.com/logos/nba/${teamId}/primary/L/logo.svg`;
}

export function createPlayerHeadshotUrl(playerId: number) {
  return `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`;
}

export function createMatchupArtwork(
  awayTeamName: string,
  awayAbbreviation: string,
  homeTeamName: string,
  homeAbbreviation: string,
) {
  const awayKey = awayAbbreviation.toUpperCase();
  const homeKey = homeAbbreviation.toUpperCase();
  const [awayPrimary, awayAccent, awayDark] = getPalette(awayKey);
  const [homePrimary, homeAccent, homeDark] = getPalette(homeKey);
  const seed = hashTeam(`${awayTeamName}-${awayKey}-${homeTeamName}-${homeKey}`);
  const tilt = 10 + (seed % 12);
  const flare = 16 + (seed % 18);
  const leftTitle = escapeXml(awayTeamName);
  const rightTitle = escapeXml(homeTeamName);
  const leftCode = escapeXml(awayKey);
  const rightCode = escapeXml(homeKey);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
      <title id="title">${leftTitle} vs ${rightTitle}</title>
      <desc id="desc">Decorative matchup artwork for ${leftTitle} and ${rightTitle}</desc>
      <defs>
        <linearGradient id="left" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${awayPrimary}" />
          <stop offset="100%" stop-color="${awayDark}" />
        </linearGradient>
        <linearGradient id="right" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${homePrimary}" />
          <stop offset="100%" stop-color="${homeDark}" />
        </linearGradient>
        <radialGradient id="awayGlow" cx="24%" cy="48%" r="52%">
          <stop offset="0%" stop-color="${awayAccent}" stop-opacity="0.9" />
          <stop offset="72%" stop-color="${awayAccent}" stop-opacity="0.14" />
          <stop offset="100%" stop-color="${awayAccent}" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="homeGlow" cx="76%" cy="52%" r="52%">
          <stop offset="0%" stop-color="${homeAccent}" stop-opacity="0.9" />
          <stop offset="72%" stop-color="${homeAccent}" stop-opacity="0.14" />
          <stop offset="100%" stop-color="${homeAccent}" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="stripe" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0.68" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="#080b14" />
      <rect width="1200" height="675" fill="url(#left)" opacity="0.92" />
      <rect width="1200" height="675" fill="url(#right)" opacity="0.9" />
      <rect width="1200" height="675" fill="url(#awayGlow)" />
      <rect width="1200" height="675" fill="url(#homeGlow)" />
      <g opacity="0.28" transform="translate(${flare} ${flare}) rotate(${tilt} 600 337)">
        <rect x="-40" y="96" width="1280" height="16" rx="8" fill="url(#stripe)" />
        <rect x="-40" y="196" width="1280" height="16" rx="8" fill="url(#stripe)" />
        <rect x="-40" y="296" width="1280" height="16" rx="8" fill="url(#stripe)" />
        <rect x="-40" y="396" width="1280" height="16" rx="8" fill="url(#stripe)" />
        <rect x="-40" y="496" width="1280" height="16" rx="8" fill="url(#stripe)" />
      </g>
      <g opacity="0.18" fill="#ffffff">
        <circle cx="164" cy="118" r="62" />
        <circle cx="1040" cy="558" r="76" />
      </g>
      <g transform="translate(82 96)">
        <rect x="0" y="0" width="424" height="474" rx="44" fill="#000000" fill-opacity="0.22" />
        <rect x="28" y="28" width="368" height="418" rx="34" fill="#ffffff" fill-opacity="0.06" />
        <text x="52%" y="46%" text-anchor="middle" fill="#fff7df" font-size="140" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="10">${leftCode}</text>
        <text x="52%" y="68%" text-anchor="middle" fill="#fff7df" fill-opacity="0.8" font-size="36" font-family="Arial, Helvetica, sans-serif" font-weight="600" letter-spacing="6">${leftTitle}</text>
      </g>
      <g transform="translate(694 96)">
        <rect x="0" y="0" width="424" height="474" rx="44" fill="#000000" fill-opacity="0.22" />
        <rect x="28" y="28" width="368" height="418" rx="34" fill="#ffffff" fill-opacity="0.06" />
        <text x="52%" y="46%" text-anchor="middle" fill="#fff7df" font-size="140" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="10">${rightCode}</text>
        <text x="52%" y="68%" text-anchor="middle" fill="#fff7df" fill-opacity="0.8" font-size="36" font-family="Arial, Helvetica, sans-serif" font-weight="600" letter-spacing="6">${rightTitle}</text>
      </g>
      <g transform="translate(478 138)">
        <circle cx="122" cy="198" r="176" fill="#fff2ca" fill-opacity="0.08" />
        <circle cx="122" cy="198" r="144" fill="#fff2ca" fill-opacity="0.14" />
        <circle cx="122" cy="198" r="108" fill="#fff2ca" fill-opacity="0.2" />
        <circle cx="122" cy="198" r="72" fill="#fff2ca" fill-opacity="0.28" />
        <text x="122" y="208" text-anchor="middle" fill="#fff7df" font-size="60" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="6">VS</text>
      </g>
      <text x="1084" y="604" text-anchor="end" fill="#fff7df" fill-opacity="0.48" font-size="30" font-family="Arial, Helvetica, sans-serif" font-weight="600" letter-spacing="6">LIVE MATCHUP</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}

export function createConferenceArtwork(label: string) {
  const seed = hashTeam(label);
  const warm = 40 + (seed % 30);
  const halo = 56 + (seed % 18);
  const accent = seed % 2 === 0 ? '#f3c05d' : '#7ef0dc';
  const title = escapeXml(label);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
      <title id="title">${title} conference artwork</title>
      <desc id="desc">Decorative conference artwork for ${title}</desc>
      <defs>
        <radialGradient id="glow" cx="50%" cy="40%" r="72%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.84" />
          <stop offset="68%" stop-color="${accent}" stop-opacity="0.12" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="panel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#151b2d" />
          <stop offset="100%" stop-color="#080b14" />
        </linearGradient>
        <linearGradient id="stripe" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0.56" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#panel)" />
      <rect width="1200" height="675" fill="url(#glow)" />
      <g opacity="0.24" transform="rotate(${warm - 16} 600 337)">
        <rect x="-120" y="144" width="1440" height="14" rx="7" fill="url(#stripe)" />
        <rect x="-120" y="260" width="1440" height="14" rx="7" fill="url(#stripe)" />
        <rect x="-120" y="376" width="1440" height="14" rx="7" fill="url(#stripe)" />
        <rect x="-120" y="492" width="1440" height="14" rx="7" fill="url(#stripe)" />
      </g>
      <g opacity="0.2" fill="#ffffff">
        <circle cx="188" cy="170" r="${halo}" />
        <circle cx="996" cy="510" r="${halo + 20}" />
      </g>
      <g transform="translate(126 108)">
        <rect x="0" y="0" width="948" height="460" rx="48" fill="#000000" fill-opacity="0.18" />
        <rect x="38" y="38" width="872" height="384" rx="34" fill="#ffffff" fill-opacity="0.06" />
        <text x="50%" y="48%" text-anchor="middle" fill="#fff7df" font-size="128" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="12">${title}</text>
        <text x="50%" y="66%" text-anchor="middle" fill="#fff7df" fill-opacity="0.82" font-size="42" font-family="Arial, Helvetica, sans-serif" font-weight="600" letter-spacing="8">POSTSEASON</text>
      </g>
      <text x="1050" y="596" text-anchor="end" fill="#fff7df" fill-opacity="0.42" font-size="30" font-family="Arial, Helvetica, sans-serif" font-weight="600" letter-spacing="6">CONFERENCE BRACKET</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}
