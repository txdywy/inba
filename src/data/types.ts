export type LeaguePhase = 'regularSeason' | 'playIn' | 'playoffs';

export interface Snapshot {
  generatedAt: string;
  leaguePhase: LeaguePhase;
  headline: {
    title: string;
    subtitle: string;
  };
  games: GameCard[];
  featuredPlayers: FeaturedPlayer[];
  standings: {
    east: StandingRow[];
    west: StandingRow[];
  };
  playoffPicture: {
    east: PlayoffRow[];
    west: PlayoffRow[];
  };
}

export interface GameCard {
  id: string;
  status: 'scheduled' | 'live' | 'final' | 'postponed';
  awayTeam: TeamLine;
  homeTeam: TeamLine;
  periodLabel: string;
  clock: string;
}

export interface TeamLine {
  name: string;
  abbreviation: string;
  score: number | null;
}

export interface FeaturedPlayer {
  playerId: number;
  name: string;
  teamAbbreviation: string;
  points: number;
  rebounds: number;
  assists: number;
  minutes: number;
}

export interface StandingRow {
  team: string;
  abbreviation: string;
  wins: number;
  losses: number;
  gamesBehind: number;
  streak: string;
  last10: string;
  rank: number;
}

export interface PlayoffRow {
  seed: number;
  team: string;
  status: string;
  matchup?: string;
}