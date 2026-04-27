# NBA Broadcast Theater Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the NBA live hub into a premium broadcast-theater homepage with a cinematic hero, stronger matchup/game cards, polished playoff studio sections, and readable standings.

**Architecture:** Keep the existing static React/Vite architecture and normalized snapshot contract. Update component markup only where it gives CSS reliable hooks, then concentrate the new visual system in `src/styles/global.css` with responsive and reduced-motion safeguards.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, Testing Library, Playwright, CSS.

---

## File Structure

- Modify `src/App.test.tsx`: add coverage for the broadcast-stage labels that should exist after the redesign.
- Modify `tests/e2e/home.spec.ts`: add one browser-level assertion for the new broadcast stage.
- Modify `src/components/HeroSnapshot.tsx`: add ticker structure, matchup board semantics, and stronger class hooks.
- Modify `src/App.tsx`: refine feature strip copy/classes without changing data flow.
- Modify `src/components/GameCard.tsx`: add team mark clusters and score state hooks for richer game cards.
- Modify `src/components/PlayoffPicture.tsx`: add bracket-studio and rank-zone hooks.
- Modify `src/components/FeaturedPlayersRail.tsx`: add broadcast stat grouping hooks.
- Modify `src/components/StandingsTable.tsx`: add seed-zone classes and cleaner team-label markup.
- Modify `src/styles/global.css`: implement the broadcast theater visual system, responsive layout, stable dimensions, hover/focus states, and reduced-motion compatibility.

## Task 1: Add Redesign Behavior Tests

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `tests/e2e/home.spec.ts`

- [ ] **Step 1: Write the failing unit test assertions**

Add these assertions to the existing homepage render test in `src/App.test.tsx`, after the current major-section assertions:

```tsx
expect(screen.getByText(/broadcast theater/i)).toBeInTheDocument();
expect(screen.getByText(/matchup board/i)).toBeInTheDocument();
expect(screen.getByText(/studio desk/i)).toBeInTheDocument();
```

- [ ] **Step 2: Run the unit test and verify it fails**

Run: `npm run test -- src/App.test.tsx`

Expected: FAIL because the current UI does not render `broadcast theater`, `matchup board`, or `studio desk`.

- [ ] **Step 3: Write the failing E2E assertion**

Add this assertion to `tests/e2e/home.spec.ts` after the existing hero assertion:

```ts
await expect(page.getByText(/broadcast theater/i)).toBeVisible();
```

- [ ] **Step 4: Run the E2E test and verify it fails**

Run: `npm run test:e2e -- tests/e2e/home.spec.ts`

Expected: FAIL because the current page does not render the broadcast theater label.

## Task 2: Rebuild The Hero As A Broadcast Stage

**Files:**
- Modify: `src/components/HeroSnapshot.tsx`
- Modify: `src/styles/global.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Update hero markup**

Replace the contents returned by `HeroSnapshot` with this structure, preserving the existing imports and derived constants:

```tsx
return (
  <header className="hero-panel hero-panel--broadcast">
    <div className="broadcast-ticker" aria-label="Broadcast theater status">
      <span className="broadcast-ticker__label">Broadcast theater</span>
      <span className={`hero-timestamp hero-timestamp--${isRefreshing ? 'refreshing' : 'ready'}`}>
        <span className="hero-timestamp__dot" aria-hidden="true" />
        {isRefreshing ? 'Refreshing live snapshot...' : `Updated ${new Date(snapshot.generatedAt).toLocaleString()}`}
      </span>
      <span>{snapshot.leaguePhase}</span>
      <span>{liveCount} live</span>
      <span>{scheduledCount} upcoming</span>
      <span>{finalCount} final</span>
    </div>

    <div className="hero-stage">
      <div className="hero-copywrap">
        <div className="hero-meta">
          <div>
            <p className="eyebrow">NBA live hub</p>
            <span className="hero-kicker">Playoff broadcast briefing</span>
          </div>
        </div>

        <div className="hero-copystack">
          <div>
            <h1>{snapshot.headline.title}</h1>
            <p className="hero-copy">{snapshot.headline.subtitle}</p>
          </div>

          <div className="hero-scoreline" aria-label="Current NBA summary">
            <span>
              <strong>{liveCount}</strong>
              live
            </span>
            <span>
              <strong>{scheduledCount}</strong>
              upcoming
            </span>
            <span>
              <strong>{finalCount}</strong>
              final
            </span>
            <span>
              <strong>{snapshot.leaguePhase}</strong>
              phase
            </span>
          </div>
        </div>
      </div>

      <div className="hero-visual hero-visual--matchup" aria-label="Matchup board">
        <div className="hero-visual__art hero-visual__art--left" aria-hidden="true">
          {featuredGame ? <img className="hero-visual__logo" src={leftLogo} alt="" aria-hidden="true" loading="lazy" /> : null}
          <span className="hero-visual__label">{leftInitials}</span>
        </div>
        <div className="hero-visual__center" aria-hidden="true">
          <span className="hero-visual__ring" />
          <span className="hero-visual__ring hero-visual__ring--outer" />
          <span className="hero-visual__center-text">VS</span>
        </div>
        <div className="hero-visual__art hero-visual__art--right" aria-hidden="true">
          {featuredGame ? <img className="hero-visual__logo" src={rightLogo} alt="" aria-hidden="true" loading="lazy" /> : null}
          <span className="hero-visual__label">{rightInitials}</span>
        </div>

        {leadPlayer ? (
          <div className="hero-spotlight hero-spotlight--lower-third">
            <img className="hero-spotlight__photo" src={createPlayerHeadshotUrl(leadPlayer.playerId)} alt="" aria-hidden="true" loading="lazy" />
            <div className="hero-spotlight__body">
              <span className="hero-spotlight__eyebrow">Featured scorer</span>
              <strong>{leadPlayer.name}</strong>
              <span>
                {leadPlayer.teamAbbreviation} · {leadPlayer.points.toFixed(1)} PTS · {leadPlayer.rebounds.toFixed(1)} REB · {leadPlayer.assists.toFixed(1)} AST
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  </header>
);
```

- [ ] **Step 2: Add hero CSS hooks**

Add these blocks to `src/styles/global.css` near the existing hero styles:

```css
.hero-panel--broadcast {
  padding-top: 14px;
}

.broadcast-ticker {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(235, 222, 184, 0.12);
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
  color: rgba(245, 238, 224, 0.76);
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.11em;
}

.broadcast-ticker__label {
  color: #fff4d2;
  font-weight: 700;
}

.hero-visual--matchup {
  border: 1px solid rgba(235, 222, 184, 0.13);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.035), 0 28px 80px rgba(0, 0, 0, 0.38);
}

.hero-spotlight--lower-third {
  border-left: 3px solid rgba(243, 192, 93, 0.82);
}
```

- [ ] **Step 3: Run the unit test**

Run: `npm run test -- src/App.test.tsx`

Expected: PASS for the new broadcast-stage labels.

## Task 3: Upgrade Feature Strip And Game Cards

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/GameCard.tsx`
- Modify: `src/styles/global.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Rename feature strip aria label and card labels**

In `src/App.tsx`, change the feature strip section opening to:

```tsx
<section className="feature-strip feature-strip--studio" aria-label="Studio desk">
```

Change the second feature card eyebrow from `Broadcast desk` to:

```tsx
<span className="feature-card__eyebrow">Studio desk</span>
```

- [ ] **Step 2: Add game card state hooks**

In `src/components/GameCard.tsx`, compute score readiness before the return:

```tsx
const hasScore = game.awayTeam.score !== null && game.awayTeam.score !== undefined && game.homeTeam.score !== null && game.homeTeam.score !== undefined;
```

Then change the article class to:

```tsx
<article className={`game-card game-card--${game.status} game-card--tone-${index % 3} ${hasScore ? 'game-card--scored' : 'game-card--pregame'}`}>
```

- [ ] **Step 3: Add feature and game CSS**

Add this CSS near the existing feature/game card styles:

```css
.feature-strip--studio .feature-card {
  isolation: isolate;
}

.feature-strip--studio .feature-card::after {
  content: '';
  position: absolute;
  left: 18px;
  right: 18px;
  top: 0;
  height: 2px;
  background: linear-gradient(90deg, rgba(243, 192, 93, 0.85), rgba(58, 96, 255, 0.55), rgba(255, 69, 96, 0.6));
  opacity: 0.75;
}

.game-card--pregame .game-card__teams strong {
  color: rgba(245, 238, 224, 0.54);
}

.game-card--scored .game-card__teams strong {
  color: #fff4d2;
}

.game-card__poster-glow {
  position: absolute;
  inset: 18% 28%;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(243, 192, 93, 0.22), transparent 64%);
  filter: blur(8px);
}
```

- [ ] **Step 4: Run the unit test**

Run: `npm run test -- src/App.test.tsx`

Expected: PASS, including the new `Studio desk` assertion.

## Task 4: Polish Playoff, Player, And Standings Surfaces

**Files:**
- Modify: `src/components/PlayoffPicture.tsx`
- Modify: `src/components/FeaturedPlayersRail.tsx`
- Modify: `src/components/StandingsTable.tsx`
- Modify: `src/styles/global.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Add standings seed-zone classes**

In `src/components/StandingsTable.tsx`, add this helper above the component:

```tsx
function getSeedZone(rank: number) {
  if (rank === 1) return 'top-seed';
  if (rank <= 6) return 'playoff';
  if (rank <= 10) return 'play-in';
  return 'chase';
}
```

Then change each table row to:

```tsx
<tr className={`standings-row standings-row--${getSeedZone(row.rank)}`} key={`${title}-${row.abbreviation}`}>
```

Change the team cell content to:

```tsx
<span className="table-team-mark">
  <img src={createTeamLogoUrl(row.abbreviation)} alt="" aria-hidden="true" loading="lazy" />
</span>
<span className="table-team-copy">
  <strong>{row.team}</strong>
  <span>{row.abbreviation}</span>
</span>
```

- [ ] **Step 2: Add bracket studio class hooks**

In `src/components/PlayoffPicture.tsx`, change the conference article class to:

```tsx
<article className="bracket-column bracket-column--tree bracket-column--studio">
```

Change the section subtitle to:

```tsx
subtitle="Bracket studio with seed paths, momentum cards, and star watch."
```

- [ ] **Step 3: Add player rail hook**

In `src/components/FeaturedPlayersRail.tsx`, change the player grid class to:

```tsx
<div className="player-grid player-grid--rail player-grid--broadcast">
```

- [ ] **Step 4: Add CSS for rank zones and studio polish**

Add this CSS near the table, bracket, and player styles:

```css
.bracket-column--studio {
  border-radius: 24px;
}

.bracket-column--studio .tree-node--locked {
  border-color: rgba(243, 192, 93, 0.18);
}

.bracket-column--studio .tree-node--play-in {
  border-color: rgba(126, 240, 220, 0.18);
}

.player-grid--broadcast .player-card {
  border-left: 2px solid rgba(243, 192, 93, 0.28);
}

.standings-row--top-seed {
  background: rgba(243, 192, 93, 0.045);
}

.standings-row--play-in {
  background: rgba(126, 240, 220, 0.026);
}

.table-team-copy {
  display: inline-grid;
  gap: 2px;
  vertical-align: middle;
}

.table-team-copy span {
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

- [ ] **Step 5: Run unit tests**

Run: `npm run test -- src/App.test.tsx`

Expected: PASS.

## Task 5: Full Visual System Pass And Verification

**Files:**
- Modify: `src/styles/global.css`
- Test: `src/App.test.tsx`
- Test: `tests/e2e/home.spec.ts`

- [ ] **Step 1: Add final responsive safeguards**

Add these CSS rules near the media queries:

```css
@media (max-width: 759px) {
  .broadcast-ticker {
    border-radius: 18px;
    align-items: flex-start;
  }

  .hero-visual {
    grid-template-columns: 1fr;
  }

  .hero-visual__center {
    width: 104px;
    height: 104px;
    justify-self: center;
    margin: -52px 0;
  }

  .hero-spotlight {
    position: relative;
    right: auto;
    bottom: auto;
    width: 100%;
    margin-top: 12px;
  }

  .feature-card__player-wrap,
  .player-card {
    grid-template-columns: 112px minmax(0, 1fr);
  }
}
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`

Expected: PASS with no TypeScript errors.

- [ ] **Step 3: Run full unit tests**

Run: `npm run test`

Expected: PASS.

- [ ] **Step 4: Run production build**

Run: `npm run build`

Expected: PASS and `dist/` generated.

- [ ] **Step 5: Run E2E homepage test**

Run: `npm run test:e2e -- tests/e2e/home.spec.ts`

Expected: PASS.

- [ ] **Step 6: Browser visual QA**

Start the app:

```bash
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173/` and verify:
- Hero text and metric chips do not overlap.
- `Broadcast theater`, `Matchup board`, and `Studio desk` are present.
- Team logos and player photos are framed correctly.
- Today's games, playoff picture, featured players, and standings remain visible.
- Mobile width does not create page overflow except intentional table scrolling.

## Self-Review Notes

- Spec coverage: hero broadcast stage, ticker, game cards, feature strip, playoff studio, player rail, standings, responsive rules, accessibility, and verification are each covered by tasks.
- Placeholder scan: no `TBD`, `TODO`, or vague future implementation steps remain.
- Type consistency: all class names and helper names are defined before use in the relevant tasks.
