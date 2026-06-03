type JsonRecord = Record<string, unknown>;

type ResultSet = {
  name?: string;
  headers?: string[];
  rowSet?: unknown[][];
};

type StatsResponse = {
  resultSets?: ResultSet[];
  resultSet?: ResultSet;
};

type RawSnapshot = {
  generated_at: string;
  phase: 'regularSeason' | 'playIn' | 'playoffs';
  top_story: {
    title: string;
    subtitle: string;
  };
  scoreboard: unknown[];
  featured_players: unknown[];
  standings: {
    east: unknown[];
    west: unknown[];
  };
  playoffs: {
    east: unknown[];
    west: unknown[];
  };
};

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
type GameStatus = 'live' | 'scheduled' | 'final' | 'postponed';

type GameRow = {
  GAME_ID?: string;
  GameID?: string;
  GAME_STATUS_ID?: number;
  GameStatusID?: number;
  GAME_STATUS_TEXT?: string;
  GameStatusText?: string;
  HOME_TEAM_ID?: number;
  HomeTeamID?: number;
  VISITOR_TEAM_ID?: number;
  VisitorTeamID?: number;
  LIVE_PERIOD?: number;
  LivePeriod?: number;
  LIVE_PC_TIME?: string;
  LivePCTime?: string;
  PCTIMESTRING?: string;
};

type LineScoreRow = JsonRecord & {
  GAME_ID?: string;
  GameID?: string;
  TEAM_ID?: number;
  TeamID?: number;
  TEAM_ABBREVIATION?: string;
  TeamAbbreviation?: string;
  TEAM_CITY_NAME?: string;
  TeamCityName?: string;
  TEAM_NAME?: string;
  TeamName?: string;
  TEAM_NICKNAME?: string;
  TeamNickname?: string;
  PTS?: number | null;
};

type StandingRow = JsonRecord & {
  CONFERENCE?: string;
  Conference?: string;
  TEAM_CITY?: string;
  TeamCity?: string;
  TEAM_NAME?: string;
  TeamName?: string;
  TEAM_ABBREVIATION?: string;
  TeamAbbreviation?: string;
  TeamSlug?: string;
  WINS?: number;
  W?: number;
  LOSSES?: number;
  L?: number;
  GB?: number;
  GamesBehind?: number;
  STRK?: string;
  Streak?: string;
  L10?: string;
  Last10?: string;
  CONFERENCE_RANK?: number;
  PlayoffRank?: number;
  Rank?: number;
};

type PlayerStatRow = JsonRecord & {
  PLAYER_ID?: number;
  PlayerID?: number;
  PLAYER_NAME?: string;
  PlayerName?: string;
  TEAM_ABBREVIATION?: string;
  TeamAbbreviation?: string;
  PTS?: number;
  REB?: number;
  AST?: number;
  MIN?: number;
};

type GameCard = {
  id: string;
  status: GameStatus;
  away_team: {
    name: string;
    abbreviation: string;
    score: number | null;
  };
  home_team: {
    name: string;
    abbreviation: string;
    score: number | null;
  };
  period_label: string;
  clock: string;
};

const DEFAULT_HEADERS: HeadersInit = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Referer: 'https://www.nba.com/',
  Origin: 'https://www.nba.com',
  'Accept-Language': 'en-US,en;q=0.9'
};

const TEAM_SLUG_TO_ABBREVIATION: Record<string, string> = {
  atlanta_hawks: 'ATL',
  hawks: 'ATL',
  boston_celtics: 'BOS',
  celtics: 'BOS',
  brooklyn_nets: 'BKN',
  nets: 'BKN',
  charlotte_hornets: 'CHA',
  hornets: 'CHA',
  chicago_bulls: 'CHI',
  bulls: 'CHI',
  cleveland_cavaliers: 'CLE',
  cavaliers: 'CLE',
  dallas_mavericks: 'DAL',
  mavericks: 'DAL',
  denver_nuggets: 'DEN',
  nuggets: 'DEN',
  detroit_pistons: 'DET',
  pistons: 'DET',
  golden_state_warriors: 'GSW',
  warriors: 'GSW',
  houston_rockets: 'HOU',
  rockets: 'HOU',
  indiana_pacers: 'IND',
  pacers: 'IND',
  la_clippers: 'LAC',
  los_angeles_clippers: 'LAC',
  clippers: 'LAC',
  la_lakers: 'LAL',
  los_angeles_lakers: 'LAL',
  lakers: 'LAL',
  memphis_grizzlies: 'MEM',
  grizzlies: 'MEM',
  miami_heat: 'MIA',
  heat: 'MIA',
  milwaukee_bucks: 'MIL',
  bucks: 'MIL',
  minnesota_timberwolves: 'MIN',
  timberwolves: 'MIN',
  new_orleans_pelicans: 'NOP',
  pelicans: 'NOP',
  new_york_knicks: 'NYK',
  knicks: 'NYK',
  oklahoma_city_thunder: 'OKC',
  thunder: 'OKC',
  orlando_magic: 'ORL',
  magic: 'ORL',
  philadelphia_76ers: 'PHI',
  sixers: 'PHI',
  '76ers': 'PHI',
  phoenix_suns: 'PHX',
  suns: 'PHX',
  portland_trail_blazers: 'POR',
  trail_blazers: 'POR',
  blazers: 'POR',
  sacramento_kings: 'SAC',
  kings: 'SAC',
  san_antonio_spurs: 'SAS',
  spurs: 'SAS',
  toronto_raptors: 'TOR',
  raptors: 'TOR',
  utah_jazz: 'UTA',
  jazz: 'UTA',
  washington_wizards: 'WAS',
  wizards: 'WAS'
};

function getNewYorkDateParts(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);

  const entries = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value])) as {
    year: string;
    month: string;
    day: string;
  };

  return {
    year: Number(entries.year),
    month: Number(entries.month),
    day: Number(entries.day)
  };
}

function formatGameDate(date: Date = new Date()) {
  const { month, day, year } = getNewYorkDateParts(date);
  return `${month}/${day}/${year}`;
}

function deriveSeason(date: Date = new Date()) {
  const { year, month } = getNewYorkDateParts(date);
  const startYear = month >= 10 ? year : year - 1;
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, '0')}`;
}

/**
 * Derive the approximate league phase from the current date (Eastern time).
 *
 * These thresholds are rough approximations of the typical NBA calendar:
 *  - Play-in tournament: mid-April (~Apr 10-14)
 *  - Playoffs (first round through Finals): mid-April through late June / early July
 *  - Regular season: October through mid-April
 *
 * The exact dates shift each year; this heuristic is good enough for editorial framing.
 */
function derivePhase(date: Date = new Date()): RawSnapshot['phase'] {
  const { month, day } = getNewYorkDateParts(date);

  if (month === 4 && day >= 15) return 'playoffs';
  if (month >= 5 && month <= 7) return 'playoffs'; // Finals can extend into July
  if (month === 4 && day >= 10) return 'playIn';
  return 'regularSeason';
}

function createStatsUrl(path: string, searchParams: Record<string, string>) {
  const url = new URL(`https://stats.nba.com/stats/${path}`);
  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

function getResultSets(payload: StatsResponse): ResultSet[] {
  if (Array.isArray(payload.resultSets)) return payload.resultSets;
  if (payload.resultSet) return [payload.resultSet];
  throw new Error('NBA stats response is missing result sets');
}

function findResultSet(payload: StatsResponse, names: string[]): ResultSet {
  const resultSets = getResultSets(payload);
  const loweredNames = names.map((name) => name.toLowerCase());
  const found = resultSets.find((resultSet) => loweredNames.includes(String(resultSet.name ?? '').toLowerCase()));

  if (!found) {
    throw new Error(`NBA stats response is missing ${names.join(' or ')}`);
  }

  return found;
}

function rowsToObjects(resultSet: ResultSet): JsonRecord[] {
  const headers = resultSet.headers ?? [];
  return (resultSet.rowSet ?? []).map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index]])) as JsonRecord
  );
}

function numberValue(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function stringValue(value: unknown, fallback = '') {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function gameIdKeys(value: unknown) {
  if (value === null || value === undefined) {
    return [];
  }

  const raw = String(value).trim();
  if (!raw) {
    return [];
  }

  const keys = new Set([raw]);
  const numeric = Number(raw);
  if (Number.isFinite(numeric)) {
    keys.add(String(numeric));
  }

  return [...keys];
}

function indexLineScores(lineScoreRows: LineScoreRow[]) {
  const byGame = new Map<string, Map<number, LineScoreRow>>();

  for (const row of lineScoreRows) {
    const teamId = numberValue(row.TEAM_ID ?? row.TeamID, Number.NaN);
    if (!Number.isFinite(teamId)) {
      continue;
    }

    for (const gameKey of gameIdKeys(row.GAME_ID ?? row.GameID)) {
      const byTeam = byGame.get(gameKey) ?? new Map<number, LineScoreRow>();
      byTeam.set(teamId, row);
      byGame.set(gameKey, byTeam);
    }
  }

  return byGame;
}

function findLineScore(
  lineScoresByGame: Map<string, Map<number, LineScoreRow>>,
  gameId: unknown,
  teamId: number
) {
  for (const gameKey of gameIdKeys(gameId)) {
    const lineScore = lineScoresByGame.get(gameKey)?.get(teamId);
    if (lineScore) {
      return lineScore;
    }
  }

  return undefined;
}

function parseGameStatus(headerRow: GameRow): GameStatus {
  const statusId = numberValue(headerRow.GAME_STATUS_ID ?? headerRow.GameStatusID);
  const statusText = stringValue(headerRow.GAME_STATUS_TEXT ?? headerRow.GameStatusText).toLowerCase();

  if (statusId === 2 || statusText.includes('in progress') || statusText.includes('live')) return 'live';
  if (statusId === 3 || statusText.includes('final')) return 'final';
  if (statusText.includes('postponed')) return 'postponed';
  return 'scheduled';
}

function parsePeriodLabel(headerRow: GameRow, status: GameStatus) {
  if (status === 'live') {
    const period = numberValue(headerRow.LIVE_PERIOD ?? headerRow.LivePeriod, 1);
    return period <= 4 ? `Q${period}` : `OT${period - 4}`;
  }
  if (status === 'final') return 'Final';
  return 'Tonight';
}

function parseClock(headerRow: GameRow, status: GameStatus) {
  if (status === 'live') {
    return stringValue(headerRow.LIVE_PC_TIME ?? headerRow.LivePCTime ?? headerRow.PCTIMESTRING, '--:--');
  }
  if (status === 'final') return 'Final';
  return stringValue(headerRow.GAME_STATUS_TEXT ?? headerRow.GameStatusText, '--:--');
}

function parseTeamLine(lineScoreRow: LineScoreRow) {
  const city = stringValue(lineScoreRow.TEAM_CITY_NAME ?? lineScoreRow.TeamCityName, 'Unknown');
  const teamName = stringValue(
    lineScoreRow.TEAM_NAME ?? lineScoreRow.TeamName ?? lineScoreRow.TEAM_NICKNAME ?? lineScoreRow.TeamNickname,
    'Team'
  );
  const fullName = teamName.toLowerCase().includes(city.toLowerCase()) ? teamName : `${city} ${teamName}`.trim();

  return {
    name: fullName,
    abbreviation: stringValue(lineScoreRow.TEAM_ABBREVIATION ?? lineScoreRow.TeamAbbreviation, 'UNK'),
    score: lineScoreRow.PTS === undefined || lineScoreRow.PTS === null ? null : numberValue(lineScoreRow.PTS, 0)
  };
}

function parsePlayerStat(playerRow: PlayerStatRow) {
  return {
    playerId: numberValue(playerRow.PLAYER_ID ?? playerRow.PlayerID),
    name: stringValue(playerRow.PLAYER_NAME ?? playerRow.PlayerName, 'Unknown Player'),
    teamAbbreviation: stringValue(playerRow.TEAM_ABBREVIATION ?? playerRow.TeamAbbreviation, 'UNK'),
    points: numberValue(playerRow.PTS, 0),
    rebounds: numberValue(playerRow.REB, 0),
    assists: numberValue(playerRow.AST, 0),
    minutes: numberValue(playerRow.MIN, 0)
  };
}

function deriveGames(scoreboardPayload: StatsResponse): GameCard[] {
  const gameHeader = rowsToObjects(findResultSet(scoreboardPayload, ['GameHeader'])) as JsonRecord[];
  const lineScore = rowsToObjects(findResultSet(scoreboardPayload, ['LineScore'])) as LineScoreRow[];
  const lineScoresByGame = indexLineScores(lineScore);

  return gameHeader
    .map((headerRow) => {
      const game = headerRow as GameRow;
      const gameId = stringValue(game.GAME_ID ?? game.GameID, 'unknown-game');
      const homeTeamId = numberValue(game.HOME_TEAM_ID ?? game.HomeTeamID);
      const awayTeamId = numberValue(game.VISITOR_TEAM_ID ?? game.VisitorTeamID);
      const status = parseGameStatus(game);
      const homeLine = findLineScore(lineScoresByGame, game.GAME_ID ?? game.GameID, homeTeamId);
      const awayLine = findLineScore(lineScoresByGame, game.GAME_ID ?? game.GameID, awayTeamId);

      return {
        id: gameId,
        status,
        away_team: awayLine ? parseTeamLine(awayLine) : { name: 'Away Team', abbreviation: 'AWY', score: null },
        home_team: homeLine ? parseTeamLine(homeLine) : { name: 'Home Team', abbreviation: 'HME', score: null },
        period_label: parsePeriodLabel(game, status),
        clock: parseClock(game, status)
      };
    })
    .sort((left, right) => {
      const order: Record<GameStatus, number> = { live: 0, scheduled: 1, final: 2, postponed: 3 };
      return order[left.status] - order[right.status];
    });
}

function mapStandingAbbreviation(row: StandingRow) {
  const explicit = stringValue(row.TEAM_ABBREVIATION ?? row.TeamAbbreviation, '').toUpperCase();
  if (explicit) {
    return explicit;
  }

  const slug = stringValue(row.TeamSlug, '').toLowerCase().replace(/\s+/g, '_');
  if (!slug) {
    return 'UNK';
  }

  return TEAM_SLUG_TO_ABBREVIATION[slug] ?? TEAM_SLUG_TO_ABBREVIATION[slug.replace(/-/g, '_')] ?? 'UNK';
}

function deriveStandingsRows(standingsPayload: StatsResponse, conferenceName: 'east' | 'west') {
  const rows = rowsToObjects(findResultSet(standingsPayload, ['Standings', 'LeagueStandings', 'LeagueStandingsV3'])) as StandingRow[];
  const conferenceKey = conferenceName.toLowerCase();

  return rows
    .filter((row) => stringValue(row.CONFERENCE ?? row.Conference, '').toLowerCase().includes(conferenceKey))
    .map((row, index) => ({
      team: `${stringValue(row.TEAM_CITY ?? row.TeamCity, 'Unknown')} ${stringValue(row.TEAM_NAME ?? row.TeamName, 'Team')}`.trim(),
      abbreviation: mapStandingAbbreviation(row),
      wins: numberValue(row.WINS ?? row.W),
      losses: numberValue(row.LOSSES ?? row.L),
      gamesBehind: numberValue(row.GB ?? row.GamesBehind, 0),
      streak: stringValue(row.STRK ?? row.Streak, '-'),
      last10: stringValue(row.L10 ?? row.Last10, '-'),
      rank: numberValue(row.CONFERENCE_RANK ?? row.PlayoffRank ?? row.Rank, index + 1)
    }))
    .sort((left, right) => left.rank - right.rank);
}

function derivePlayoffRows(rows: ReturnType<typeof deriveStandingsRows>) {
  return rows.slice(0, 8).map((row) => {
    const matchupSeed = row.rank <= 6 ? 9 - row.rank : null;
    return {
      seed: row.rank,
      team: row.team,
      status: row.rank <= 6 ? 'locked' : 'play-in',
      matchup: matchupSeed ? `vs. ${matchupSeed} seed` : 'play-in'
    };
  });
}

function deriveFeaturedPlayers(playerStatsPayload: StatsResponse) {
  const rows = rowsToObjects(findResultSet(playerStatsPayload, ['LeagueDashPlayerStats'])) as PlayerStatRow[];
  const featured: ReturnType<typeof parsePlayerStat>[] = [];
  const seenTeams = new Set<string>();

  for (const row of rows.sort((left, right) => numberValue(right.PTS, 0) - numberValue(left.PTS, 0))) {
    const player = parsePlayerStat(row);
    const teamKey = player.teamAbbreviation.toUpperCase();

    if (seenTeams.has(teamKey)) {
      continue;
    }

    seenTeams.add(teamKey);
    featured.push(player);

    if (featured.length === 8) {
      break;
    }
  }

  return featured;
}

function deriveHeadline(games: GameCard[], phase: RawSnapshot['phase']) {
  let liveCount = 0;
  let scheduledCount = 0;
  let finalCount = 0;
  for (const game of games) {
    if (game.status === 'live') liveCount += 1;
    else if (game.status === 'scheduled') scheduledCount += 1;
    else if (game.status === 'final') finalCount += 1;
  }

  if (liveCount > 0) {
    return {
      title: `${liveCount} game${liveCount === 1 ? '' : 's'} live right now`,
      subtitle: `${scheduledCount} more on the board and ${finalCount} final${finalCount === 1 ? '' : 's'} already in the book`
    };
  }

  if (phase === 'playoffs') {
    return {
      title: 'Playoff picture taking shape',
      subtitle: `${scheduledCount} matchup${scheduledCount === 1 ? '' : 's'} remain on today’s slate`
    };
  }

  return {
    title: 'Tonight in the NBA',
    subtitle: `${scheduledCount} matchup${scheduledCount === 1 ? '' : 's'} on the schedule`
  };
}

export async function fetchNbaStatsRawSnapshot({
  fetchImpl = fetch,
  now = new Date(),
  scoreboardUrl = createStatsUrl('scoreboardv2', {
    GameDate: formatGameDate(now),
    LeagueID: '00',
    DayOffset: '0'
  }),
  standingsUrl = createStatsUrl('leaguestandingsv3', {
    LeagueID: '00',
    Season: deriveSeason(now),
    SeasonType: 'Regular Season'
  }),
  playerStatsUrl = createStatsUrl('leaguedashplayerstats', {
    LeagueID: '00',
    Season: deriveSeason(now),
    SeasonType: 'Regular Season',
    PerMode: 'PerGame',
    MeasureType: 'Base',
    TeamID: '0',
    Rank: 'N',
    Month: '0',
    Period: '0'
  })
} = {}): Promise<RawSnapshot> {
  const playerStatsResponsePromise = fetchImpl(playerStatsUrl, { headers: DEFAULT_HEADERS }).catch(() => null);
  const [scoreboardResponse, standingsResponse] = await Promise.all([
    fetchImpl(scoreboardUrl, { headers: DEFAULT_HEADERS }),
    fetchImpl(standingsUrl, { headers: DEFAULT_HEADERS })
  ]);

  if (!scoreboardResponse.ok) {
    throw new Error(`NBA scoreboard request failed with ${scoreboardResponse.status}`);
  }

  if (!standingsResponse.ok) {
    throw new Error(`NBA standings request failed with ${standingsResponse.status}`);
  }

  const [scoreboardPayload, standingsPayload] = (await Promise.all([
    scoreboardResponse.json(),
    standingsResponse.json()
  ])) as [StatsResponse, StatsResponse];

  let featuredPlayers: ReturnType<typeof parsePlayerStat>[] = [];

  const playerStatsResponse = await playerStatsResponsePromise;
  if (playerStatsResponse?.ok) {
    try {
      const playerStatsPayload = (await playerStatsResponse.json()) as StatsResponse;
      featuredPlayers = deriveFeaturedPlayers(playerStatsPayload);
    } catch {
      featuredPlayers = [];
    }
  }

  const games = deriveGames(scoreboardPayload);
  const east = deriveStandingsRows(standingsPayload, 'east');
  const west = deriveStandingsRows(standingsPayload, 'west');
  const phase = derivePhase(now);

  return {
    generated_at: now.toISOString(),
    phase,
    top_story: deriveHeadline(games, phase),
    scoreboard: games,
    featured_players: featuredPlayers,
    standings: {
      east,
      west
    },
    playoffs: {
      east: derivePlayoffRows(east),
      west: derivePlayoffRows(west)
    }
  };
}
