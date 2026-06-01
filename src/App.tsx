import FeaturedPlayersRail from './components/FeaturedPlayersRail';
import GamesRail from './components/GamesRail';
import HeroSnapshot from './components/HeroSnapshot';
import PlayoffPicture from './components/PlayoffPicture';
import StandingsTable from './components/StandingsTable';
import fallbackSnapshot from './data/fallbackSnapshot.json';
import { summarizeSnapshot } from './data/snapshotSummary';
import type { Snapshot } from './data/types';
import { useLiveSnapshot } from './hooks/useLiveSnapshot';

interface AppProps {
  initialSnapshot?: Snapshot;
}

export default function App({ initialSnapshot = fallbackSnapshot as Snapshot }: AppProps) {
  const { snapshot, isRefreshing } = useLiveSnapshot(initialSnapshot);
  const summary = summarizeSnapshot(snapshot);

  return (
    <main className="app-shell">
      <HeroSnapshot snapshot={snapshot} summary={summary} isRefreshing={isRefreshing} />

      <div className="content-stack">
        <section className="briefing-band" aria-label="Editorial briefing">
          <article className="briefing-card briefing-card--story">
            <span className="briefing-card__eyebrow">Tonight&apos;s angle</span>
            <h2>What the desk is watching</h2>
            <p>
              The page now opens with one central storyline, then hands off to playoff pressure, live scoreboard movement, and
              the players most likely to bend the night.
            </p>
            <ul className="briefing-card__list">
              <li>{summary.featuredGame ? `${summary.featuredGame.awayTeam.name} at ${summary.featuredGame.homeTeam.name} anchors the lead window.` : 'No spotlight matchup is currently set.'}</li>
              <li>{summary.leadPlayer ? `${summary.leadPlayer.name} enters as the featured shot-creator at ${summary.leadPlayer.points.toFixed(1)} points per game.` : 'Player spotlight returns when the scoring board is available.'}</li>
              <li>{summary.phaseLabel} remains the framing device across every module on the page.</li>
            </ul>
          </article>

          <article className="briefing-card briefing-card--pulse">
            <span className="briefing-card__eyebrow">Live pulse</span>
            <h2>Snapshot rhythm</h2>
            <div className="briefing-card__metrics" aria-label="Snapshot rhythm metrics">
              <div>
                <strong>{summary.liveCount}</strong>
                <span>live windows</span>
              </div>
              <div>
                <strong>{summary.scheduledCount}</strong>
                <span>still to tip</span>
              </div>
              <div>
                <strong>{summary.finalCount}</strong>
                <span>already wrapped</span>
              </div>
            </div>
            <p className="briefing-card__note">Updated on publish cadence so the page reads like a live production rundown instead of a static slate.</p>
          </article>

          <article className="briefing-card briefing-card--leaders">
            <span className="briefing-card__eyebrow">Conference leaders</span>
            <h2>Where the weight sits</h2>
            <div className="briefing-card__leaders">
              <div>
                <span>East</span>
                <strong>{summary.eastLeader ? summary.eastLeader.team : 'Waiting on standings'}</strong>
                <small>{summary.eastLeader ? `${summary.eastLeader.wins}-${summary.eastLeader.losses} · ${summary.eastLeader.last10} last 10` : 'Standings not available'}</small>
              </div>
              <div>
                <span>West</span>
                <strong>{summary.westLeader ? summary.westLeader.team : 'Waiting on standings'}</strong>
                <small>{summary.westLeader ? `${summary.westLeader.wins}-${summary.westLeader.losses} · ${summary.westLeader.last10} last 10` : 'Standings not available'}</small>
              </div>
            </div>
            <p className="briefing-card__note">These are the clubs every downstream module should feel oriented around.</p>
          </article>
        </section>

        <div className="editorial-grid">
          <div className="editorial-grid__lead">
            <PlayoffPicture
              east={snapshot.playoffPicture.east}
              west={snapshot.playoffPicture.west}
              standings={snapshot.standings}
              featuredPlayers={summary.featuredPlayers}
            />
            <GamesRail games={snapshot.games} />
          </div>

          <aside className="editorial-grid__rail" aria-label="League context">
            <StandingsTable eastRows={snapshot.standings.east} westRows={snapshot.standings.west} />
            <FeaturedPlayersRail players={summary.railPlayers} />
          </aside>
        </div>
      </div>
    </main>
  );
}
