import { describe, expect, it } from 'vitest';
import snapshot from './fixtures/normalized-snapshot.json';
import { formatFeaturedGameState, formatSnapshotUpdatedAt, summarizeSnapshot } from './snapshotSummary';
import type { Snapshot } from './types';

const normalizedSnapshot = snapshot as Snapshot;
const richSnapshot: Snapshot = {
  ...normalizedSnapshot,
  leaguePhase: 'playIn',
  featuredPlayers: [
    {
      playerId: 1629029,
      name: 'Luka Doncic',
      teamAbbreviation: 'LAL',
      points: 33.5,
      rebounds: 7.7,
      assists: 8.3,
      minutes: 35.8
    },
    {
      playerId: 1,
      name: 'Second Player',
      teamAbbreviation: 'BOS',
      points: 25,
      rebounds: 5,
      assists: 5,
      minutes: 32
    },
    {
      playerId: 2,
      name: 'Third Player',
      teamAbbreviation: 'DEN',
      points: 24,
      rebounds: 4,
      assists: 4,
      minutes: 31
    },
    {
      playerId: 3,
      name: 'Fourth Player',
      teamAbbreviation: 'GSW',
      points: 23,
      rebounds: 3,
      assists: 3,
      minutes: 30
    },
    {
      playerId: 4,
      name: 'Fifth Player',
      teamAbbreviation: 'MIA',
      points: 22,
      rebounds: 2,
      assists: 2,
      minutes: 29
    }
  ]
};

describe('snapshot summary', () => {
  it('collects page-level facts from a snapshot behind one interface', () => {
    const summary = summarizeSnapshot(richSnapshot);

    expect(summary.liveCount).toBe(1);
    expect(summary.scheduledCount).toBe(1);
    expect(summary.finalCount).toBe(0);
    expect(summary.featuredGame?.id).toBe('001');
    expect(summary.leadPlayer?.name).toBe('Luka Doncic');
    expect(summary.eastLeader?.team).toBe('Boston Celtics');
    expect(summary.westLeader?.team).toBe('Denver Nuggets');
    expect(summary.railPlayers).toHaveLength(4);
    expect(summary.phaseLabel).toBe('Play-in race');
    expect(summary.heroPhaseLabel).toBe('Play-in command center');
  });

  it('formats featured game state for missing, scheduled, and live games', () => {
    expect(formatFeaturedGameState('playoffs', undefined)).toBe('Tracking the playoff command center.');
    expect(formatFeaturedGameState('playoffs', normalizedSnapshot.games[1])).toBe('Tonight · Boston Celtics at Miami Heat');
    expect(formatFeaturedGameState('playoffs', normalizedSnapshot.games[0])).toBe(
      'Q4 · 03:41 · Golden State Warriors at Los Angeles Lakers'
    );
  });

  it('keeps timestamp labels stable when source data is malformed', () => {
    expect(formatSnapshotUpdatedAt('2026-04-27T11:08:15.112Z', () => 'Apr 27, 2026')).toBe('Updated Apr 27, 2026');
    expect(formatSnapshotUpdatedAt('not-a-date')).toBe('Updated time unavailable');
  });
});
