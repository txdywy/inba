import { useCallback, useEffect, useRef, useState } from 'react';
import { normalizeProviderSnapshot } from '../data/normalize';
import type { Snapshot } from '../data/types';

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

interface UseLiveSnapshotOptions {
  sourceUrl?: string;
  fetchImpl?: FetchLike;
  normalize?: (raw: unknown) => Snapshot;
  /** Polling interval in milliseconds. Defaults to 30 000 (30 s). Set to 0 to disable. */
  refreshInterval?: number;
}

const DEFAULT_REFRESH_INTERVAL = 30_000;

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === 'AbortError';
}

export function useLiveSnapshot(
  initialSnapshot: Snapshot,
  {
    sourceUrl = `${import.meta.env.BASE_URL}data/latest.json`,
    fetchImpl = fetch,
    normalize = normalizeProviderSnapshot,
    refreshInterval = DEFAULT_REFRESH_INTERVAL
  }: UseLiveSnapshotOptions = {}
) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Keep a ref to the latest abort controller so we can cancel in-flight requests
  const controllerRef = useRef<AbortController | null>(null);

  const refresh = useCallback(() => {
    // Abort any in-flight request before starting a new one
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsRefreshing(true);
    setError(null);

    fetchImpl(sourceUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load snapshot: ${response.status}`);
        }

        return response.json() as Promise<unknown>;
      })
      .then((rawSnapshot) => normalize(rawSnapshot))
      .then((nextSnapshot) => {
        if (!controller.signal.aborted) {
          setSnapshot(nextSnapshot);
          setError(null);
        }
      })
      .catch((caughtError) => {
        if (isAbortError(caughtError)) {
          return;
        }

        if (!controller.signal.aborted) {
          setError(caughtError instanceof Error ? caughtError : new Error(String(caughtError)));
        }
        // Keep the previous snapshot visible when the refresh request fails.
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsRefreshing(false);
        }
      });
  }, [fetchImpl, normalize, sourceUrl]);

  // Initial fetch + polling interval
  useEffect(() => {
    refresh();

    if (refreshInterval <= 0) {
      return () => {
        controllerRef.current?.abort();
      };
    }

    const intervalId = setInterval(refresh, refreshInterval);

    return () => {
      clearInterval(intervalId);
      controllerRef.current?.abort();
    };
  }, [refresh, refreshInterval]);

  // Pause polling when tab is hidden; refresh immediately when it becomes visible
  useEffect(() => {
    if (refreshInterval <= 0) return;

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refresh, refreshInterval]);

  return { snapshot, isRefreshing, error };
}
