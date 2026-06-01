import { useEffect, useState } from 'react';
import { normalizeProviderSnapshot } from '../data/normalize';
import type { Snapshot } from '../data/types';

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

interface UseLiveSnapshotOptions {
  sourceUrl?: string;
  fetchImpl?: FetchLike;
  normalize?: (raw: unknown) => Snapshot;
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === 'AbortError';
}

export function useLiveSnapshot(
  initialSnapshot: Snapshot,
  {
    sourceUrl = `${import.meta.env.BASE_URL}data/latest.json`,
    fetchImpl = fetch,
    normalize = normalizeProviderSnapshot
  }: UseLiveSnapshotOptions = {}
) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    setIsRefreshing(true);

    fetchImpl(sourceUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load snapshot: ${response.status}`);
        }

        return response.json() as Promise<unknown>;
      })
      .then((rawSnapshot) => normalize(rawSnapshot))
      .then((nextSnapshot) => {
        if (!cancelled) {
          setSnapshot(nextSnapshot);
        }
      })
      .catch((error) => {
        if (isAbortError(error)) {
          return;
        }

        // Keep the static snapshot visible when the refresh request fails.
      })
      .finally(() => {
        if (!cancelled) {
          setIsRefreshing(false);
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [fetchImpl, normalize, sourceUrl]);

  return { snapshot, isRefreshing };
}
