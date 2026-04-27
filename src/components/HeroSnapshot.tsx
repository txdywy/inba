import type { Snapshot } from '../data/types';

interface HeroSnapshotProps {
  snapshot: Snapshot;
}

export default function HeroSnapshot({ snapshot }: HeroSnapshotProps) {
  const liveCount = snapshot.games.filter((game) => game.status === 'live').length;
  const upcomingCount = snapshot.games.filter((game) => game.status === 'scheduled').length;

  return (
    <header className="hero-panel">
      <div className="hero-meta">
        <p className="eyebrow">NBA live hub</p>
        <span className="hero-timestamp">Updated {new Date(snapshot.generatedAt).toLocaleString()}</span>
      </div>
      <h1>{snapshot.headline.title}</h1>
      <p className="hero-copy">{snapshot.headline.subtitle}</p>
      <div className="status-chips" aria-label="Current NBA summary">
        <span className="chip chip-live">{liveCount} live</span>
        <span className="chip chip-upcoming">{upcomingCount} upcoming</span>
        <span className="chip chip-phase">{snapshot.leaguePhase}</span>
      </div>
    </header>
  );
}