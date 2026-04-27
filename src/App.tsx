import HeroSnapshot from './components/HeroSnapshot';
import GamesRail from './components/GamesRail';
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
  const snapshot = useLiveSnapshot(initialSnapshot);

  return (
    <main className="app-shell">
      <HeroSnapshot snapshot={snapshot} />

      <div className="content-stack">
        <GamesRail games={snapshot.games} />

        <div className="conference-stack">
          <StandingsTable title="Standings — East" rows={snapshot.standings.east} />
          <StandingsTable title="Standings — West" rows={snapshot.standings.west} />
        </div>

        <PlayoffPicture east={snapshot.playoffPicture.east} west={snapshot.playoffPicture.west} />

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