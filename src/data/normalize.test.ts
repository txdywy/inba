import { describe, expect, it } from 'vitest';
import raw from './fixtures/raw-provider-sample.json';
import expected from './fixtures/normalized-snapshot.json';
import { normalizeProviderSnapshot } from './normalize';

describe('normalizeProviderSnapshot', () => {
  it('maps provider payloads into the project snapshot contract', () => {
    expect(normalizeProviderSnapshot(raw)).toEqual(expected);
  });

  it('accepts an already-normalized published snapshot', () => {
    expect(normalizeProviderSnapshot(expected)).toEqual(expected);
  });

  it('gracefully degrades to empty data when core sections are missing', () => {
    const result = normalizeProviderSnapshot({});
    expect(result.games).toEqual([]);
    expect(result.standings.east).toEqual([]);
    expect(result.standings.west).toEqual([]);
    expect(result.playoffPicture.east).toEqual([]);
    expect(result.playoffPicture.west).toEqual([]);
    expect(result.featuredPlayers).toEqual([]);
  });
});
