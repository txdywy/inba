import FeaturedPlayersRail from './components/FeaturedPlayersRail';
import GamesRail from './components/GamesRail';
import HeroSnapshot from './components/HeroSnapshot';
import PlayoffPicture from './components/PlayoffPicture';
import StandingsTable from './components/StandingsTable';
import fallbackSnapshot from './data/fallbackSnapshot.json';
import type { LeaguePhase, Snapshot } from './data/types';
import { useLiveSnapshot } from './hooks/useLiveSnapshot';

interface AppProps {
  initialSnapshot?: Snapshot;
}

const phaseLabels: Record<LeaguePhase, string> = {
  regularSeason: 'Regular season',
  playIn: 'Play-in race',
  playoffs: 'Playoffs'
};

export default function App({ initialSnapshot = fallbackSnapshot as Snapshot }: AppProps) {
  const { snapshot, isRefreshing } = useLiveSnapshot(initialSnapshot);
  const featuredPlayers = snapshot.featuredPlayers ?? [];
  const liveCount = snapshot.games.filter((game) => game.status === 'live').length;
  const scheduledCount = snapshot.games.filter((game) => game.status === 'scheduled').length;
  const finalCount = snapshot.games.filter((game) => game.status === 'final').length;
  const featuredGame = snapshot.games[0];
  const leadPlayer = featuredPlayers[0];
  const eastLeader = snapshot.standings.east[0];
  const westLeader = snapshot.standings.west[0];
  const phaseLabel = phaseLabels[snapshot.leaguePhase];
  const railPlayers = featuredPlayers.slice(0, 4);

  return (
    <main className="app-shell">
      <HeroSnapshot
        snapshot={snapshot}
        liveCount={liveCount}
        scheduledCount={scheduledCount}
        finalCount={finalCount}
        isRefreshing={isRefreshing}
        featuredPlayers={featuredPlayers}
      />

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
              <li>{featuredGame ? `${featuredGame.awayTeam.name} at ${featuredGame.homeTeam.name} anchors the lead window.` : 'No spotlight matchup is currently set.'}</li>
              <li>{leadPlayer ? `${leadPlayer.name} enters as the featured shot-creator at ${leadPlayer.points.toFixed(1)} points per game.` : 'Player spotlight returns when the scoring board is available.'}</li>
              <li>{phaseLabel} remains the framing device across every module on the page.</li>
            </ul>
          </article>

          <article className="briefing-card briefing-card--pulse">
            <span className="briefing-card__eyebrow">Live pulse</span>
            <h2>Snapshot rhythm</h2>
            <div className="briefing-card__metrics" aria-label="Snapshot rhythm metrics">
              <div>
                <strong>{liveCount}</strong>
                <span>live windows</span>
              </div>
              <div>
                <strong>{scheduledCount}</strong>
                <span>still to tip</span>
              </div>
              <div>
                <strong>{finalCount}</strong>
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
                <strong>{eastLeader ? eastLeader.team : 'Waiting on standings'}</strong>
                <small>{eastLeader ? `${eastLeader.wins}-${eastLeader.losses} · ${eastLeader.last10} last 10` : 'Standings not available'}</small>
              </div>
              <div>
                <span>West</span>
                <strong>{westLeader ? westLeader.team : 'Waiting on standings'}</strong>
                <small>{westLeader ? `${westLeader.wins}-${westLeader.losses} · ${westLeader.last10} last 10` : 'Standings not available'}</small>
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
              featuredPlayers={featuredPlayers}
            />
            <GamesRail games={snapshot.games} />
          </div>

          <aside className="editorial-grid__rail" aria-label="League context">
            <StandingsTable eastRows={snapshot.standings.east} westRows={snapshot.standings.west} />
            <FeaturedPlayersRail players={railPlayers} />
          </aside>
        </div>
      </div>
    </main>
  );
}
