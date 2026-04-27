import { writeLatestSnapshotFile } from '../src/data/writeLatestSnapshot.ts';

export { writeLatestSnapshotFile };

if (import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const [, , filePath] = process.argv;

  if (!filePath) {
    console.error('Usage: tsx scripts/write-latest-snapshot.mjs <file-path>');
    process.exit(1);
  }

  const snapshot = JSON.parse(process.env.NBA_SNAPSHOT_JSON ?? '{}');

  writeLatestSnapshotFile(filePath, snapshot)
    .then(() => {
      console.log(`Wrote snapshot to ${filePath}`);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}