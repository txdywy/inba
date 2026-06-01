import type { FeaturedPlayer, GameCard, LeaguePhase, PlayoffRow, Snapshot, StandingRow, TeamLine } from './types';

function assertObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('NBA snapshot payload must be an object');
  }

  return value as Record<string, unknown>;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function mapLeaguePhase(value: unknown): LeaguePhase {
  switch (value) {
    case 'playIn':
    case 'play-in':
      return 'playIn';
    case 'playoffs':
      return 'playoffs';
    default:
      return 'regularSeason';
  }
}

function mapStatus(value: unknown): GameCard['status'] {
  switch (value) {
    case 'live':
    case 'final':
    case 'postponed':
    case 'scheduled':
      return value;
    default:
      return 'scheduled';
  }
}

function mapTeam(value: unknown): TeamLine {
  const team = assertObject(value);

  return {
    name: asString(team.name ?? team.team_name ?? team.team, 'Unknown Team'),
    abbreviation: asString(team.abbreviation ?? team.abbr ?? team.code, 'UNK'),
    score: typeof team.score === 'number' ? team.score : null
  };
}

function mapGame(value: unknown): GameCard {
  const game = assertObject(value);

  return {
    id: asString(game.id ?? game.game_id, 'unknown-game'),
    status: mapStatus(game.status),
    awayTeam: mapTeam(game.away_team ?? game.awayTeam ?? game.away),
    homeTeam: mapTeam(game.home_team ?? game.homeTeam ?? game.home),
    periodLabel: asString(game.period_label ?? game.periodLabel ?? game.period ?? game.quarter, 'TBD'),
    clock: asString(game.clock ?? game.game_clock ?? game.gameClock, '--:--')
  };
}

function mapStandingRow(value: unknown, fallbackRank: number): StandingRow {
  const row = assertObject(value);

  return {
    team: asString(row.team ?? row.team_name, 'Unknown Team'),
    abbreviation: asString(row.abbreviation ?? row.abbr ?? row.code, 'UNK'),
    wins: asNumber(row.wins),
    losses: asNumber(row.losses),
    gamesBehind: asNumber(row.games_behind ?? row.gamesBehind ?? row.gb),
    streak: asString(row.streak, '-'),
    last10: asString(row.last10 ?? row.last_10, '-'),
    rank: asNumber(row.rank, fallbackRank)
  };
}

function mapPlayoffRow(value: unknown): PlayoffRow {
  const row = assertObject(value);
  const rawStatus = asString(row.status, 'locked');

  return {
    seed: asNumber(row.seed),
    team: asString(row.team ?? row.team_name, 'Unknown Team'),
    status: rawStatus === 'play-in' ? 'play-in' : 'locked',
    matchup: typeof row.matchup === 'string' ? row.matchup : undefined
  };
}

function mapFeaturedPlayer(value: unknown): FeaturedPlayer {
  const player = assertObject(value);

  return {
    playerId: asNumber(player.playerId ?? player.player_id ?? player.PLAYER_ID ?? player.PlayerID),
    name: asString(player.name ?? player.player_name ?? player.PLAYER_NAME ?? player.PlayerName, 'Unknown Player'),
    teamAbbreviation: asString(
      player.teamAbbreviation ?? player.team_abbreviation ?? player.TEAM_ABBREVIATION ?? player.TeamAbbreviation,
      'UNK'
    ),
    points: asNumber(player.points ?? player.pts ?? player.PTS),
    rebounds: asNumber(player.rebounds ?? player.reb ?? player.REB),
    assists: asNumber(player.assists ?? player.ast ?? player.AST),
    minutes: asNumber(player.minutes ?? player.min ?? player.MIN)
  };
}

function ensureArray(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`NBA snapshot payload is missing ${label}`);
  }

  return value;
}

export function normalizeProviderSnapshot(raw: unknown): Snapshot {
  const payload = assertObject(raw);
  const generatedAt = asString(payload.generated_at ?? payload.generatedAt, new Date().toISOString());
  const scoreboard = ensureArray(payload.games ?? payload.scoreboard, 'games');
  const standings = assertObject(payload.standings ?? {});
  const playoffs = assertObject(payload.playoff_picture ?? payload.playoffPicture ?? payload.playoffs ?? {});
  const headline = assertObject(payload.headline ?? payload.top_story ?? {});
  const featuredPlayerSource = payload.featured_players ?? payload.featuredPlayers;

  return {
    generatedAt,
    leaguePhase: mapLeaguePhase(payload.league_phase ?? payload.phase),
    headline: {
      title: asString(headline.title, 'Tonight in the NBA'),
      subtitle: asString(headline.subtitle, 'Latest games, standings, and playoff context')
    },
    games: scoreboard.map(mapGame),
    featuredPlayers: Array.isArray(featuredPlayerSource) ? featuredPlayerSource.map(mapFeaturedPlayer) : [],
    standings: {
      east: ensureArray(standings.east ?? standings.eastern_conference, 'east standings').map((row, index) =>
        mapStandingRow(row, index + 1)
      ),
      west: ensureArray(standings.west ?? standings.western_conference, 'west standings').map((row, index) =>
        mapStandingRow(row, index + 1)
      )
    },
    playoffPicture: {
      east: ensureArray(playoffs.east ?? playoffs.eastern_conference, 'east playoff picture').map(mapPlayoffRow),
      west: ensureArray(playoffs.west ?? playoffs.western_conference, 'west playoff picture').map(mapPlayoffRow)
    }
  };
}
