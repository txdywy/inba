import { useMemo } from 'react';
import BriefingBand from './components/BriefingBand';
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
  const summary = useMemo(() => summarizeSnapshot(snapshot), [snapshot]);

  return (
    <main className="app-shell">
      <HeroSnapshot snapshot={snapshot} summary={summary} isRefreshing={isRefreshing} />

      <div className="content-stack">
        <BriefingBand summary={summary} />

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
