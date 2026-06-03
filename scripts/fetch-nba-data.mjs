import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { normalizeProviderSnapshot } from '../src/data/normalize.ts';
import { fetchNbaStatsRawSnapshot } from '../src/data/providers/nbaStats.ts';
import { writeLatestSnapshotFile } from './write-latest-snapshot.mjs';

const outputPath = fileURLToPath(new URL('../public/data/latest.json', import.meta.url));
const fallbackPath = fileURLToPath(new URL('../src/data/fallbackSnapshot.json', import.meta.url));

async function readSnapshot(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function loadFallbackSnapshot() {
  try {
    return await readSnapshot(outputPath);
  } catch {
    return readSnapshot(fallbackPath);
  }
}

async function loadFeaturedPlayersFallback() {
  for (const path of [outputPath, fallbackPath]) {
    try {
      const snapshot = await readSnapshot(path);
      if (Array.isArray(snapshot.featuredPlayers) && snapshot.featuredPlayers.length > 0) {
        return snapshot.featuredPlayers;
      }
    } catch {
      // keep trying the next source
    }
  }

  return [];
}

async function main() {
  try {
    const rawSnapshot = await fetchNbaStatsRawSnapshot();
    let snapshot = normalizeProviderSnapshot(rawSnapshot);

    if (snapshot.featuredPlayers.length === 0) {
      const featuredPlayers = await loadFeaturedPlayersFallback();
      if (featuredPlayers.length > 0) {
        snapshot = { ...snapshot, featuredPlayers };
        console.warn('NBA player stats unavailable; preserved featured players from the last good snapshot.');
      }
    }

    await writeLatestSnapshotFile(outputPath, snapshot);
    console.log('Wrote snapshot to public/data/latest.json');
  } catch (error) {
    const fallbackSnapshot = await loadFallbackSnapshot();
    await writeLatestSnapshotFile(outputPath, fallbackSnapshot);
    console.warn(`NBA refresh failed; kept fallback snapshot. ${error instanceof Error ? error.message : String(error)}`);
  }
}

main();
