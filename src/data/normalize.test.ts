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

  it('throws a clear error when core sections are missing', () => {
    expect(() => normalizeProviderSnapshot({} as never)).toThrow(/games/i);
  });
});
