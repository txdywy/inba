import { fileURLToPath } from 'node:url';
import { normalizeProviderSnapshot } from '../src/data/normalize.ts';
import { fetchNbaStatsRawSnapshot } from '../src/data/providers/nbaStats.ts';
import { writeLatestSnapshotFile } from './write-latest-snapshot.mjs';

const outputPath = fileURLToPath(new URL('../public/data/latest.json', import.meta.url));

async function main() {
  try {
    const rawSnapshot = await fetchNbaStatsRawSnapshot();
    const snapshot = normalizeProviderSnapshot(rawSnapshot);
    await writeLatestSnapshotFile(outputPath, snapshot);
    console.log('Wrote snapshot to public/data/latest.json');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
