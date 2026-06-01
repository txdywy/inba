import { phaseLabels, type GameCard, type LeaguePhase, type Snapshot } from './types';

const heroPhaseLabels: Record<LeaguePhase, string> = {
  regularSeason: 'Regular season desk',
  playIn: 'Play-in command center',
  playoffs: 'Playoff command center'
};

function countGameStatuses(games: GameCard[]) {
  const counts = {
    liveCount: 0,
    scheduledCount: 0,
    finalCount: 0
  };

  for (const game of games) {
    if (game.status === 'live') counts.liveCount += 1;
    else if (game.status === 'scheduled') counts.scheduledCount += 1;
    else if (game.status === 'final') counts.finalCount += 1;
  }

  return counts;
}

export function formatSnapshotUpdatedAt(generatedAt: string, formatDate = (date: Date) => date.toLocaleString()) {
  const date = new Date(generatedAt);

  if (Number.isNaN(date.getTime())) {
    return 'Updated time unavailable';
  }

  return `Updated ${formatDate(date)}`;
}

export function formatFeaturedGameState(leaguePhase: LeaguePhase, game: GameCard | undefined) {
  if (!game) {
    return `Tracking the ${heroPhaseLabels[leaguePhase].toLowerCase()}.`;
  }

  if (game.status === 'scheduled') {
    return `${game.periodLabel} · ${game.awayTeam.name} at ${game.homeTeam.name}`;
  }

  return `${game.periodLabel} · ${game.clock} · ${game.awayTeam.name} at ${game.homeTeam.name}`;
}

export function summarizeSnapshot(snapshot: Snapshot) {
  const featuredPlayers = snapshot.featuredPlayers;
  const featuredGame = snapshot.games[0];
  const gameCounts = countGameStatuses(snapshot.games);

  return {
    featuredPlayers,
    railPlayers: featuredPlayers.slice(0, 4),
    featuredGame,
    leadPlayer: featuredPlayers[0],
    eastLeader: snapshot.standings.east[0],
    westLeader: snapshot.standings.west[0],
    ...gameCounts,
    phaseLabel: phaseLabels[snapshot.leaguePhase],
    heroPhaseLabel: heroPhaseLabels[snapshot.leaguePhase],
    featuredGameState: formatFeaturedGameState(snapshot.leaguePhase, featuredGame),
    updatedLabel: formatSnapshotUpdatedAt(snapshot.generatedAt)
  };
}

export type SnapshotSummary = ReturnType<typeof summarizeSnapshot>;
