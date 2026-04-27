# NBA Broadcast Theater Redesign Design

## Goal
Upgrade the NBA live hub into a richer, more cinematic information experience: the first viewport should feel like a playoff broadcast open, while the rest of the page should read like a premium NBA studio desk with clear games, star, standings, and playoff context.

## Design Direction
The approved direction is **NBA Playoff Broadcast Theater**.

It combines three visual modes:
- **Playoff movie-poster hero** for the opening impact
- **Broadcast desk UI** for game status, matchup cards, and live summaries
- **Premium data magazine polish** for standings, bracket paths, and player information

The page should be cooler and more polished, but it must still work as a fast static NBA information surface. Visual drama supports the data instead of replacing it.

## Product Principles
- The first screen must answer what matters today: current league phase, headline, marquee matchup, and live/upcoming/final counts.
- Every major section must feel like part of one NBA broadcast package, not unrelated cards.
- Team logos, player headshots, status labels, records, and start times should carry the visual system.
- Motion should make the page feel alive, especially in live and scheduled states, without reducing readability.
- The site remains static-host friendly and consumes the existing normalized snapshot contract.

## First Viewport
### Hero Broadcast Stage
The hero becomes a polished arena-broadcast scene:
- A thin top ticker shows freshness, league phase, live count, upcoming count, and final count.
- The headline stays large and editorial, but its layout should avoid colliding with metric chips.
- The featured matchup becomes a central broadcast board with oversized team marks, a stronger VS core, and subtle energy rings.
- The featured scorer module becomes a lower-third style spotlight, with portrait, team, and stat line.
- The next section should remain hinted below the fold so the page invites scrolling.

### Visual Treatment
Use a dark arena base with controlled accents:
- Warm gold for playoff importance and premium editorial emphasis
- NBA red/blue energy for matchup tension
- Small cyan or teal data highlights for freshness and live state
- Soft court-line, scoreboard, or light-rig textures where they reinforce the broadcast mood

Avoid decorative clutter, large empty glow blobs, or fake controls that do not communicate NBA information.

## Main Content
### Feature Strip
The existing feature strip becomes a studio desk:
- **Lead Story**: editorial headline plus matchup chips
- **Broadcast Desk**: today's status board, slate count, league phase
- **Star Watch**: lead player with photo, team mark, and key stats

Cards should share a stronger component language: status rails, small broadcast labels, team/logo watermarks, and consistent spacing. The cards should feel premium but compact.

### Today's Games
Game cards should feel closer to televised matchup panels:
- Larger team identities in the poster area
- Clear scheduled/live/final status
- Stronger time and period treatment
- Better differentiation for live, scheduled, and final games
- Hover and focus states that feel tactile without changing layout size

If a game has no score yet, the card should still feel intentional instead of empty.

### Playoff Picture
The playoff section becomes a bracket studio:
- East and West remain side by side on desktop and stacked on mobile.
- Each conference has a visual header, locked/play-in counts, key result, momentum, and star highlight.
- Seed paths should look like an intentional playoff tree, with clearer locked vs play-in styling.
- Empty or missing team artwork should degrade gracefully without leaving obvious blank blocks.

### Featured Players
Player cards should become a star rail:
- Player portrait remains dominant.
- Team mark and rank are easy to scan.
- Stats are grouped as broadcast stat chips.
- The rail should stay readable in the sticky desktop column and compact on mobile.

### Standings
Standings remain table-first for readability:
- Each conference table starts with a front-runner banner.
- Team logos align cleanly with team names and abbreviations.
- Key rank zones can be subtly marked: top seed, playoff, play-in, outside picture.
- Horizontal overflow on mobile remains supported.

## Component Boundaries
Implementation should keep current component ownership:
- `HeroSnapshot` owns the first viewport broadcast stage.
- `App` owns section ordering and feature strip composition.
- `GameCard` owns matchup card presentation.
- `PlayoffPicture` owns conference tree and playoff signals.
- `FeaturedPlayersRail` owns player card presentation.
- `StandingsTable` owns standings table and conference leader banner.
- `global.css` owns the visual system, layout, motion, and responsive behavior.

No new backend, routing system, database, or authentication is needed.

## Data Flow
Use the existing snapshot fields:
- `generatedAt`
- `leaguePhase`
- `headline`
- `games`
- `standings`
- `playoffPicture`
- `featuredPlayers`

The redesign should not require new provider fields. If a visual treatment needs missing data, derive it from existing fields or render a graceful fallback.

## Responsive Rules
- Mobile remains a single-column reading experience.
- Desktop uses a dramatic hero split and a content/sticky-rail layout.
- Fixed-format elements such as hero matchup boards, game posters, stat chips, and table marks need stable dimensions to prevent layout shift.
- Text must not overlap inside hero, chips, cards, or tables.
- The page should remain readable at narrow mobile widths without shrinking text through viewport-based font tricks.

## Accessibility
- Decorative logos and portraits that duplicate visible text remain `aria-hidden`.
- Headings preserve the page outline.
- Live/status information is text, not only color.
- Motion respects `prefers-reduced-motion`.
- Focus and hover states should not be the only way to discover information.

## Testing
Verification should include:
- `npm run typecheck`
- `npm run test`
- `npm run build`
- Existing Playwright homepage test
- Browser visual checks on desktop and mobile

Visual QA should specifically check:
- Hero text and metric chips do not overlap.
- Team logos and player headshots load and are framed correctly.
- Today's games, playoff picture, featured players, and standings remain visible.
- Mobile layout does not produce horizontal page overflow beyond intentional table scrolling.
- Reduced motion mode does not rely on long-running animations.

## Out of Scope
- New data provider work
- Real-time WebSocket updates
- User accounts, saved teams, betting, fantasy, or predictions
- Multi-page navigation
- Replacing the existing normalized snapshot contract

## Success Criteria
- The page feels like a premium NBA broadcast and playoff information surface.
- The hero has a stronger first impression than the current implementation.
- The main sections feel visually unified, not like separate card experiments.
- The data remains clear enough to scan quickly.
- The existing static deployment model and tests remain intact.
