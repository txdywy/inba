import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import rawSnapshot from '../data/fixtures/raw-provider-sample.json';
import fallbackSnapshot from '../data/fallbackSnapshot.json';
import type { Snapshot } from '../data/types';
import { useLiveSnapshot } from './useLiveSnapshot';

function HookHarness({ fetchImpl }: { fetchImpl: typeof fetch }) {
  const { snapshot, isRefreshing } = useLiveSnapshot(fallbackSnapshot as Snapshot, {
    fetchImpl,
    sourceUrl: '/data/latest.json'
  });

  return (
    <output data-testid="snapshot" data-refreshing={String(isRefreshing)}>
      {snapshot.headline.title}
    </output>
  );
}

describe('useLiveSnapshot', () => {
  it('normalizes the fetched snapshot before publishing it to the UI', async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => rawSnapshot
    })) as unknown as typeof fetch;

    render(<HookHarness fetchImpl={fetchImpl} />);

    await waitFor(() => expect(screen.getByTestId('snapshot')).toHaveTextContent('Playoff race tightens'));
    await waitFor(() => expect(screen.getByTestId('snapshot')).toHaveAttribute('data-refreshing', 'false'));
    expect(fetchImpl).toHaveBeenCalledWith('/data/latest.json', expect.objectContaining({ signal: expect.any(AbortSignal) }));
  });

  it('aborts the refresh when the consumer unmounts', () => {
    let signal: AbortSignal | undefined;
    const fetchImpl = vi.fn((_input, init) => {
      signal = init?.signal as AbortSignal;
      return new Promise<Response>(() => undefined);
    }) as unknown as typeof fetch;

    const { unmount } = render(<HookHarness fetchImpl={fetchImpl} />);

    unmount();

    expect(signal?.aborted).toBe(true);
  });
});
