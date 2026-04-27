import type { Snapshot } from '../data/types';
import { createTeamArtwork, createTeamInitials } from '../lib/teamArtwork';

interface HeroSnapshotProps {
  snapshot: Snapshot;
  liveCount: number;
  scheduledCount: number;
  finalCount: number;
}

export default function HeroSnapshot({ snapshot, liveCount, scheduledCount, finalCount }: HeroSnapshotProps) {
  const featuredGame = snapshot.games[0];
  const leftArtwork = featuredGame ? createTeamArtwork(featuredGame.awayTeam.name, featuredGame.awayTeam.abbreviation) : '';
  const rightArtwork = featuredGame ? createTeamArtwork(featuredGame.homeTeam.name, featuredGame.homeTeam.abbreviation) : '';
  const leftInitials = featuredGame ? createTeamInitials(featuredGame.awayTeam.name) : 'NBA';
  const rightInitials = featuredGame ? createTeamInitials(featuredGame.homeTeam.name) : 'LIVE';

  return (
    <header className="hero-panel">
      <div className="hero-visual" aria-hidden="true">
        <div className="hero-visual__art hero-visual__art--left" style={{ backgroundImage: `url(${leftArtwork})` }}>
          <span className="hero-visual__label">{leftInitials}</span>
        </div>
        <div className="hero-visual__center">
          <span className="hero-visual__ring" />
          <span className="hero-visual__ring hero-visual__ring--outer" />
          <span className="hero-visual__center-text">VS</span>
        </div>
        <div className="hero-visual__art hero-visual__art--right" style={{ backgroundImage: `url(${rightArtwork})` }}>
          <span className="hero-visual__label">{rightInitials}</span>
        </div>
      </div>

      <div className="hero-meta">
        <div>
          <p className="eyebrow">NBA live hub</p>
          <span className="hero-kicker">Cinematic snapshot briefing</span>
        </div>
        <span className="hero-timestamp">Updated {new Date(snapshot.generatedAt).toLocaleString()}</span>
      </div>

      <div className="hero-copywrap">
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
    </header>
  );
}
