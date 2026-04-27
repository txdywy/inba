import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { Snapshot } from './types';

export async function writeLatestSnapshotFile(filePath: string, snapshot: Snapshot) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
}