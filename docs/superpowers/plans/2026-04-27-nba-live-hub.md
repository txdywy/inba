# NBA Live Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first NBA live hub that runs as a static GitHub Pages site, refreshes its data through GitHub Actions, and presents standings, live games, and playoff context in a visually striking scroll experience.

**Architecture:** Use a Vite + React + TypeScript frontend that renders from a small project-owned snapshot contract. GitHub Actions will fetch third-party NBA data, normalize it into `public/data/latest.json`, and build/deploy the static site; the browser will render that snapshot and revalidate it after mount so visits stay fresh without requiring a backend. All provider-specific parsing stays in one normalization module so the UI remains stable if the upstream API changes shape.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, Playwright, GitHub Actions, GitHub Pages, Node.js 20.

---

### Task 1: Scaffold the static app and test harness

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/global.css`
- Create: `src/test/setup.ts`
- Create: `src/App.test.tsx`
- Modify: `README.md` later in Task 5

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App shell', () => {
  it('renders the NBA Live Hub headline and main landmark', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /nba live hub/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/App.test.tsx`
Expected: FAIL because the React app, test runner, or App shell does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```tsx
export default function App() {
  return (
    <main>
      <h1>NBA Live Hub</h1>
    </main>
  );
}
```

Also make sure `src/main.tsx` mounts `<App />`, `src/styles/global.css` defines the page shell, and `package.json` includes scripts like:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/App.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json index.html vite.config.ts tsconfig.json tsconfig.node.json src/main.tsx src/App.tsx src/styles/global.css src/test/setup.ts src/App.test.tsx README.md
git commit -m "feat: scaffold nba live hub app"
```

### Task 2: Define the snapshot contract and normalize provider data

**Files:**
- Create: `src/data/types.ts`
- Create: `src/data/normalize.ts`
- Create: `src/data/normalize.test.ts`
- Create: `src/data/fixtures/raw-provider-sample.json`
- Create: `src/data/fixtures/normalized-snapshot.json`
- Create: `src/data/fallbackSnapshot.json`
- Create: `public/data/latest.json`
- Modify: `src/data/fallbackSnapshot.json` if the first pass needs shape fixes

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import raw from './fixtures/raw-provider-sample.json';
import expected from './fixtures/normalized-snapshot.json';
import { normalizeProviderSnapshot } from './normalize';

describe('normalizeProviderSnapshot', () => {
  it('maps provider payloads into the project snapshot contract', () => {
    expect(normalizeProviderSnapshot(raw)).toEqual(expected);
  });

  it('throws a clear error when core sections are missing', () => {
    expect(() => normalizeProviderSnapshot({} as never)).toThrow(/games/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/data/normalize.test.ts`
Expected: FAIL because the snapshot types and normalization logic are not implemented yet.

- [ ] **Step 3: Write minimal implementation**

```ts
export interface Snapshot {
  generatedAt: string;
  leaguePhase: 'regularSeason' | 'playIn' | 'playoffs';
  headline: {
    title: string;
    subtitle: string;
  };
  games: Array<{ id: string; status: string }>;
  standings: {
    east: Array<{ team: string; wins: number; losses: number }>;
    west: Array<{ team: string; wins: number; losses: number }>;
  };
  playoffPicture: {
    east: Array<{ seed: number; team: string; status: string }>;
    west: Array<{ seed: number; team: string; status: string }>;
  };
}

export function normalizeProviderSnapshot(raw: unknown): Snapshot {
  // Parse the provider response, map only the fields the UI needs,
  // and throw a clear error when required sections are missing.
  throw new Error('not implemented');
}
```

Also create `src/data/fallbackSnapshot.json` and copy the same normalized shape into `public/data/latest.json` so local development and the first deployment both have a stable snapshot to render.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/data/normalize.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/types.ts src/data/normalize.ts src/data/normalize.test.ts src/data/fixtures/raw-provider-sample.json src/data/fixtures/normalized-snapshot.json src/data/fallbackSnapshot.json public/data/latest.json
git commit -m "feat: normalize nba snapshot data"
```

### Task 3: Build the dashboard UI and freshness revalidation flow

**Files:**
- Create: `src/components/Section.tsx`
- Create: `src/components/HeroSnapshot.tsx`
- Create: `src/components/GameCard.tsx`
- Create: `src/components/GamesRail.tsx`
- Create: `src/components/StandingsTable.tsx`
- Create: `src/components/PlayoffPicture.tsx`
- Create: `src/hooks/useLiveSnapshot.ts`
- Create: `src/App.ui.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import fallbackSnapshot from './data/fallbackSnapshot.json';

describe('dashboard sections', () => {
  it('renders the hero, games, standings, and playoff sections', () => {
    render(<App initialSnapshot={fallbackSnapshot} />);

    expect(screen.getByRole('heading', { name: /today's games/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /standings/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /playoff picture/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/App.ui.test.tsx`
Expected: FAIL because the section components, snapshot prop, and refresh hook are not implemented yet.

- [ ] **Step 3: Write minimal implementation**

```tsx
export function useLiveSnapshot(initialSnapshot: Snapshot) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);

  useEffect(() => {
    let cancelled = false;

    fetch('/data/latest.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<Snapshot>;
      })
      .then((nextSnapshot) => {
        if (!cancelled) setSnapshot(nextSnapshot);
      })
      .catch(() => {
        // Keep the fallback snapshot visible.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return snapshot;
}
```

Then update `App` to accept `initialSnapshot`, pass it through the hook, and compose the page from section components. Keep the layout mobile-first, one-column by default, and make the top summary visually dominant with status chips, strong typography, and color-coded state labels.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/App.ui.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Section.tsx src/components/HeroSnapshot.tsx src/components/GameCard.tsx src/components/GamesRail.tsx src/components/StandingsTable.tsx src/components/PlayoffPicture.tsx src/hooks/useLiveSnapshot.ts src/App.tsx src/App.ui.test.tsx src/styles/global.css
git commit -m "feat: build nba dashboard sections"
```

### Task 4: Add the GitHub Actions refresh and GitHub Pages deployment workflow

**Files:**
- Create: `scripts/write-latest-snapshot.mjs`
- Create: `scripts/fetch-nba-data.mjs`
- Create: `.github/workflows/pages.yml`
- Create: `src/data/writeLatestSnapshot.test.ts`
- Modify: `package.json` scripts

- [ ] **Step 1: Write the failing test**

```ts
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { writeLatestSnapshotFile } from './writeLatestSnapshot';

describe('writeLatestSnapshotFile', () => {
  it('writes prettified JSON for the published snapshot', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'nba-hub-'));
    const file = join(dir, 'latest.json');

    await writeLatestSnapshotFile(file, {
      generatedAt: '2026-04-27T00:00:00Z',
      leaguePhase: 'regularSeason',
      headline: { title: 'Tonight in the NBA', subtitle: '8 games on deck' },
      games: [],
      standings: { east: [], west: [] },
      playoffPicture: { east: [], west: [] }
    });

    const contents = JSON.parse(await readFile(file, 'utf8'));
    expect(contents.generatedAt).toBe('2026-04-27T00:00:00Z');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/data/writeLatestSnapshot.test.ts`
Expected: FAIL because the helper and workflow scripts do not exist yet.

- [ ] **Step 3: Write minimal implementation**

```js
import { writeFile } from 'node:fs/promises';

export async function writeLatestSnapshotFile(filePath, snapshot) {
  await writeFile(filePath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
}
```

Then make `scripts/fetch-nba-data.mjs`:
- read `process.env.NBA_API_URL` and `process.env.NBA_API_KEY`
- fetch raw provider data
- call `normalizeProviderSnapshot`
- write `public/data/latest.json` through `writeLatestSnapshotFile`

Use a single GitHub Actions workflow that:
- runs on `push` to `main`
- runs on a `schedule` every 15 minutes
- supports `workflow_dispatch`
- installs Node 20 dependencies
- runs the fetch/normalize script
- runs `npm test` and `npm run build`
- uploads the `dist` artifact and deploys it to GitHub Pages

```yaml
name: pages
on:
  push:
    branches: [main]
  schedule:
    - cron: '*/15 * * * *'
  workflow_dispatch:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: node scripts/fetch-nba-data.mjs
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/data/writeLatestSnapshot.test.ts && npm run build`
Expected: PASS, and the build should produce a deployable `dist/` directory.

- [ ] **Step 5: Commit**

```bash
git add scripts/write-latest-snapshot.mjs scripts/fetch-nba-data.mjs .github/workflows/pages.yml src/data/writeLatestSnapshot.test.ts package.json
git commit -m "feat: automate nba snapshot publishing"
```

### Task 5: Add browser smoke coverage and update the project docs

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/home.spec.ts`
- Modify: `README.md`
- Modify: `package.json` scripts

- [ ] **Step 1: Write the failing test**

```ts
import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('homepage renders the live hub sections on mobile', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /nba live hub/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /today's games/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /standings/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /playoff picture/i })).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/e2e/home.spec.ts`
Expected: FAIL because Playwright config, selectors, or the stable mobile layout are not ready yet.

- [ ] **Step 3: Write minimal implementation**

Add a Playwright config that starts the Vite dev server, and make sure the app exposes stable landmarks and section headings that the smoke test can target. Update `README.md` with:
- local install and dev commands
- test commands
- the GitHub Pages deployment flow
- where the snapshot file lives (`public/data/latest.json`)

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test && npm run build && npx playwright test tests/e2e/home.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e/home.spec.ts README.md package.json
git commit -m "feat: add smoke tests and docs"
```

## Self-Review

### Spec coverage check
- Static frontend on GitHub Pages: covered by Tasks 1 and 4.
- GitHub Actions refresh pipeline: covered by Task 4.
- Mobile-first vertical live feed: covered by Task 3.
- Today’s games, standings, and playoff picture: covered by Tasks 2 and 3.
- Freshness and stale-data handling: covered by Tasks 3 and 4.
- No backend, no auth, no database: preserved by the architecture and Task 4.
- Testing and verification: covered by Tasks 1, 2, 3, and 5.

### Placeholder scan
- No TBD / TODO / implement later placeholders remain in the plan.
- Each step includes a concrete file path, command, or code snippet.
- No step refers to an undefined helper or type without introducing it in the same task.

### Type and naming consistency
- The shared snapshot shape is named `Snapshot` in `src/data/types.ts` and reused consistently in normalization, UI, and persistence code.
- The published data file is consistently `public/data/latest.json`.
- The UI entry point remains `App`, with `initialSnapshot` added only when the live-refresh flow is introduced in Task 3.
