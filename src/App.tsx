import FeaturedPlayersRail from './components/FeaturedPlayersRail';
import GamesRail from './components/GamesRail';
import HeroSnapshot from './components/HeroSnapshot';
import PlayoffPicture from './components/PlayoffPicture';
import Section from './components/Section';
import StandingsTable from './components/StandingsTable';
import { useLiveSnapshot } from './hooks/useLiveSnapshot';
import fallbackSnapshot from './data/fallbackSnapshot.json';
import type { Snapshot } from './data/types';

interface AppProps {
  initialSnapshot?: Snapshot;
}

export default function App({ initialSnapshot = fallbackSnapshot as Snapshot }: AppProps) {
  const { snapshot, isRefreshing } = useLiveSnapshot(initialSnapshot);
  const liveCount = snapshot.games.filter((game) => game.status === 'live').length;
  const scheduledCount = snapshot.games.filter((game) => game.status === 'scheduled').length;
  const finalCount = snapshot.games.filter((game) => game.status === 'final').length;

  return (
    <main className="app-shell">
      <HeroSnapshot
        snapshot={snapshot}
        liveCount={liveCount}
        scheduledCount={scheduledCount}
        finalCount={finalCount}
        isRefreshing={isRefreshing}
      />

      <div className="content-stack">
        <section className="feature-strip" aria-label="NBA feature highlights">
          <article className="feature-card feature-card--cover">
            <span className="feature-card__eyebrow">Tonight</span>
            <h2>{snapshot.headline.title}</h2>
            <p>{snapshot.headline.subtitle}</p>
          </article>

          <article className="feature-card feature-card--image feature-card--pulse">
            <span className="feature-card__eyebrow">Broadcast</span>
            <div className="feature-card__art feature-card__art--arena" aria-hidden="true" />
            <div>
              <strong>{liveCount}</strong>
              <span>games live now</span>
            </div>
          </article>

          <article className="feature-card feature-card--image feature-card--stats">
            <span className="feature-card__eyebrow">Snapshot</span>
            <div className="feature-card__art feature-card__art--hoops" aria-hidden="true" />
            <div className="feature-card__stats">
              <span>{scheduledCount} upcoming</span>
              <span>{finalCount} final</span>
            </div>
          </article>
        </section>

        <FeaturedPlayersRail players={snapshot.featuredPlayers ?? []} />
        <GamesRail games={snapshot.games} />

        <div className="conference-stack">
          <StandingsTable title="Standings — East" rows={snapshot.standings.east} />
          <StandingsTable title="Standings — West" rows={snapshot.standings.west} />
        </div>

        <PlayoffPicture
          east={snapshot.playoffPicture.east}
          west={snapshot.playoffPicture.west}
          standings={snapshot.standings}
          featuredPlayers={snapshot.featuredPlayers}
        />

        <Section
          eyebrow="Focus"
          title="Favorite teams"
          subtitle="Reserved for a future watchlist without changing the main layout."
        >
          <p className="empty-state">A future version can pin selected teams here without changing the snapshot contract.</p>
        </Section>
      </div>
    </main>
  );
}
