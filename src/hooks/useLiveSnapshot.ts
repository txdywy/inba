import { useEffect, useState } from 'react';
import type { Snapshot } from '../data/types';

export function useLiveSnapshot(initialSnapshot: Snapshot) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);

  useEffect(() => {
    let cancelled = false;

    fetch(`${import.meta.env.BASE_URL}data/latest.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load snapshot: ${response.status}`);
        }

        return response.json() as Promise<Snapshot>;
      })
      .then((nextSnapshot) => {
        if (!cancelled) {
          setSnapshot(nextSnapshot);
        }
      })
      .catch(() => {
        // Keep the static snapshot visible when the refresh request fails.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return snapshot;
}