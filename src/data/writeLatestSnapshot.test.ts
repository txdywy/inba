import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { Snapshot } from './types';
import { writeLatestSnapshotFile } from './writeLatestSnapshot';

const snapshot: Snapshot = {
  generatedAt: '2026-04-27T00:00:00Z',
  leaguePhase: 'regularSeason',
  headline: {
    title: 'Tonight in the NBA',
    subtitle: '8 games on deck'
  },
  games: [],
  standings: { east: [], west: [] },
  playoffPicture: { east: [], west: [] }
};

describe('writeLatestSnapshotFile', () => {
  it('writes prettified json for the published snapshot', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'nba-hub-'));
    const file = join(dir, 'latest.json');

    await writeLatestSnapshotFile(file, snapshot);

    const contents = await readFile(file, 'utf8');
    expect(contents).toContain('\n  "generatedAt": "2026-04-27T00:00:00Z",\n');
    expect(JSON.parse(contents)).toEqual(snapshot);
  });
});