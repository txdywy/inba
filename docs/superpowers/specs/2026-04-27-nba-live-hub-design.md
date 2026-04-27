# NBA Live Hub Design

## Goal
Build a mobile-first NBA homepage that feels like a live sports briefing: on each visit it shows the newest available game status, standings, and playoff bracket context, while remaining deployable as a static site on GitHub Pages.

## Decision
Use a static frontend hosted on GitHub Pages, with GitHub Actions fetching and normalizing third-party NBA data on a schedule. The site will render a vertically scrolling, sectioned dashboard that presents a global league snapshot first and then expands into rankings, playoff status, and game detail.

## Scope
### In scope
- A static NBA homepage with a bold, high-motion visual style
- Mobile-first vertical scrolling layout
- Today’s games and recent game progress
- League standings, including East/West ordering
- Playoff state, including current bracket and matchup status
- A “watchlist” or favorite-team section in a later iteration, if needed
- GitHub Actions that refresh data and publish static artifacts

### Out of scope
- A custom backend service
- User accounts or authentication
- Betting features, predictions, or fantasy integration
- Live play-by-play streaming with sub-minute latency
- Data storage beyond generated static files

## Product shape
The homepage should feel like one continuous live sports feed rather than a dashboard of unrelated tabs. The top of the page should answer three questions quickly:
1. What is happening right now?
2. How does it affect the standings?
3. What does it mean for the playoff picture?

The rest of the page should deepen the answer with ranked tables, matchup context, and event cards.

## Architecture
### High-level structure
The app is split into two layers:
- **Data pipeline layer**: GitHub Actions fetches NBA data from a third-party API, normalizes it into a stable JSON shape, and commits or publishes the generated output.
- **Presentation layer**: The frontend reads the generated snapshot and renders it into responsive sections.

### Why this shape works
- It keeps the site compatible with GitHub Pages.
- It avoids CORS and backend maintenance problems.
- It makes the UI resilient to upstream API shape changes because the frontend consumes a normalized snapshot instead of raw provider responses.

## Data flow
1. GitHub Actions runs on a schedule and on manual dispatch.
2. The workflow requests current NBA data from the chosen third-party provider.
3. A normalization step converts provider-specific responses into a project-owned snapshot format.
4. The workflow writes the snapshot to static assets used by the frontend.
5. The browser loads the latest published snapshot and renders the dashboard.
6. The client may optionally refresh lightweight data after page load, but the page must still work fully from static artifacts.

## UI structure
### Section order
1. **Hero snapshot**
   - Date, season phase, and a visually dominant headline summary
   - Quick status chips for live games, upcoming games, and playoff mode

2. **Today’s games / live progress**
   - Cards for each relevant matchup
   - Current score, quarter/clock, and momentum indicator
   - Game state labels such as final, live, scheduled, postponed

3. **Standings**
   - East and West tables
   - Win/loss, games behind, streak, and last-10 style summary if available from the data source

4. **Playoff picture**
   - Current seeding and play-in/playoff state
   - Matchup cards or bracket rows showing who would face whom right now
   - Clear labeling for unresolved play-in positions

5. **Focus section**
   - A future-friendly slot for user-selected teams or favorite teams
   - Not required for the first implementation, but the layout should leave room for it

### Layout rules
- One-column mobile-first stacking by default
- Desktop can expand into denser columns, but without changing the reading order
- The top section should remain visually dominant and feel animated or “alive” without requiring heavy client-side interactivity
- Cards should use strong typography, color-coded status chips, and restrained motion

## Data model
The frontend should not depend on raw API payloads. Instead, it should consume a project-owned snapshot with predictable keys.

### Core snapshot shape
- `generatedAt`
- `leaguePhase`
- `headline`
- `games[]`
- `standings.east[]`
- `standings.west[]`
- `playoffPicture`
- `favorites[]` or `watchlist[]` if added later

### Design rule
If the upstream provider changes, only the normalization layer should need updates. The rendered UI should remain stable as long as the snapshot contract is preserved.

## GitHub Actions workflow
### Responsibilities
- Fetch NBA data on a schedule
- Normalize the response into the snapshot contract
- Publish the generated static output
- Fail visibly if the provider schema changes enough to break normalization

### Suggested cadence
- Frequent polling during game windows
- Slower polling outside game windows
- Manual dispatch for debugging and forced refreshes

### Failure behavior
- If fresh data cannot be fetched, keep the last successful published snapshot available
- Surface a clear build failure in Actions so the issue is visible
- Avoid silently publishing partial or malformed data

## Error handling and resilience
- Show stale-data timestamps in the UI so users understand freshness
- Handle missing game fields by rendering a simplified fallback card rather than breaking the whole page
- Treat the standings and playoff sections as independently renderable so one broken data area does not blank the rest of the homepage
- Keep all provider-specific parsing in one place so error handling is centralized

## Testing strategy
### Data pipeline tests
- Validate that raw provider responses normalize into the expected snapshot contract
- Verify that malformed or partial responses fail loudly during the workflow
- Ensure standings and playoff mapping logic produce stable output for known cases

### UI tests
- Verify the homepage renders the major sections from a sample snapshot
- Verify empty, live, final, and postponed game states
- Verify standings and playoff sections still render when one subsection is empty

### Workflow tests
- Run the fetch/normalize job locally or in CI against a fixture set
- Confirm the GitHub Actions workflow can publish generated static artifacts without a backend

## Implementation boundaries
### Must remain true
- No always-on backend service
- No user authentication in the first version
- No database
- No dependency on live browser-only fetching for the core experience

### May change later
- Exact third-party data provider
- Visual theme and animation language
- Whether favorites are stored in local storage or in generated config
- Whether the app is a single page or a small set of static pages

## Recommended first implementation slice
1. Define the snapshot contract.
2. Build the normalization layer for one data provider.
3. Render the homepage sections from fixture data.
4. Add the GitHub Actions refresh workflow.
5. Add status messaging for freshness and stale data.

## Open questions resolved by this design
- **Pure frontend vs backend:** resolved in favor of static frontend plus GitHub Actions.
- **Freshness target:** near-live during games, but not sub-minute real-time.
- **Information hierarchy:** resolved in favor of a mobile-first scroll experience with global summary first.
- **Data source strategy:** resolved in favor of a third-party API with normalization.

## Risks
- Public sports APIs may change schema or rate limits without notice.
- Playoff and play-in logic can be easy to misrepresent if it is derived directly from raw records without validation.
- A heavy visual treatment can obscure important live information if the hierarchy is not disciplined.

## Mitigations
- Keep provider parsing isolated behind the snapshot contract.
- Test playoff mapping with fixed historical fixtures.
- Preserve readable typography and explicit labels even when using motion-heavy visuals.
