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

function derivePhase(date: Date = new Date()): RawSnapshot['phase'] {
  const { month, day } = getNewYorkDateParts(date);

  if (month === 4 && day >= 15) return 'playoffs';
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
  const nickname = stringValue(lineScoreRow.TEAM_NICKNAME ?? lineScoreRow.TeamNickname, 'Team');

  return {
    name: `${city} ${nickname}`.trim(),
    abbreviation: stringValue(lineScoreRow.TEAM_ABBREVIATION ?? lineScoreRow.TeamAbbreviation, 'UNK'),
    score: lineScoreRow.PTS === undefined || lineScoreRow.PTS === null ? null : numberValue(lineScoreRow.PTS, 0)
  };
}

function deriveGames(scoreboardPayload: StatsResponse): GameCard[] {
  const gameHeader = rowsToObjects(findResultSet(scoreboardPayload, ['GameHeader'])) as JsonRecord[];
  const lineScore = rowsToObjects(findResultSet(scoreboardPayload, ['LineScore'])) as LineScoreRow[];

  return gameHeader
    .map((headerRow) => {
      const game = headerRow as GameRow;
      const gameId = stringValue(game.GAME_ID ?? game.GameID, 'unknown-game');
      const homeTeamId = numberValue(game.HOME_TEAM_ID ?? game.HomeTeamID);
      const awayTeamId = numberValue(game.VISITOR_TEAM_ID ?? game.VisitorTeamID);
      const status = parseGameStatus(game);
      const lines = lineScore.filter((row) => numberValue(row.GAME_ID ?? row.GameID) === numberValue(game.GAME_ID ?? game.GameID));
      const homeLine = lines.find((row) => numberValue(row.TEAM_ID ?? row.TeamID) === homeTeamId);
      const awayLine = lines.find((row) => numberValue(row.TEAM_ID ?? row.TeamID) === awayTeamId);

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

function deriveStandingsRows(standingsPayload: StatsResponse, conferenceName: 'east' | 'west') {
  const rows = rowsToObjects(findResultSet(standingsPayload, ['Standings', 'LeagueStandings', 'LeagueStandingsV3'])) as StandingRow[];
  const conferenceKey = conferenceName.toLowerCase();

  return rows
    .filter((row) => stringValue(row.CONFERENCE ?? row.Conference, '').toLowerCase().includes(conferenceKey))
    .map((row, index) => ({
      team: `${stringValue(row.TEAM_CITY ?? row.TeamCity, 'Unknown')} ${stringValue(row.TEAM_NAME ?? row.TeamName, 'Team')}`.trim(),
      abbreviation: stringValue(row.TEAM_ABBREVIATION ?? row.TeamAbbreviation ?? row.TeamSlug, 'UNK'),
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

function deriveHeadline(games: GameCard[], phase: RawSnapshot['phase']) {
  const liveCount = games.filter((game) => game.status === 'live').length;
  const scheduledCount = games.filter((game) => game.status === 'scheduled').length;
  const finalCount = games.filter((game) => game.status === 'final').length;

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
  scoreboardUrl = createStatsUrl('scoreboardv2', {
    GameDate: formatGameDate(),
    LeagueID: '00',
    DayOffset: '0'
  }),
  standingsUrl = createStatsUrl('leaguestandingsv3', {
    LeagueID: '00',
    Season: deriveSeason(),
    SeasonType: 'Regular Season'
  })
} = {}): Promise<RawSnapshot> {
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

  const games = deriveGames(scoreboardPayload);
  const east = deriveStandingsRows(standingsPayload, 'east');
  const west = deriveStandingsRows(standingsPayload, 'west');
  const phase = derivePhase();

  return {
    generated_at: new Date().toISOString(),
    phase,
    top_story: deriveHeadline(games, phase),
    scoreboard: games,
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
