import type { Snapshot } from '../data/types';
import { createTeamInitials, createTeamLogoUrl } from '../lib/teamArtwork';

interface HeroSnapshotProps {
  snapshot: Snapshot;
  liveCount: number;
  scheduledCount: number;
  finalCount: number;
  isRefreshing: boolean;
}

export default function HeroSnapshot({ snapshot, liveCount, scheduledCount, finalCount, isRefreshing }: HeroSnapshotProps) {
  const featuredGame = snapshot.games[0];
  const leftLogo = featuredGame ? createTeamLogoUrl(featuredGame.awayTeam.abbreviation) : '';
  const rightLogo = featuredGame ? createTeamLogoUrl(featuredGame.homeTeam.abbreviation) : '';
  const leftInitials = featuredGame ? createTeamInitials(featuredGame.awayTeam.name) : 'NBA';
  const rightInitials = featuredGame ? createTeamInitials(featuredGame.homeTeam.name) : 'LIVE';

  return (
    <header className="hero-panel">
      <div className="hero-visual" aria-hidden="true">
        <div className="hero-visual__art hero-visual__art--left">
          <img className="hero-visual__logo" src={leftLogo} alt="" aria-hidden="true" />
          <span className="hero-visual__label">{leftInitials}</span>
        </div>
        <div className="hero-visual__center">
          <span className="hero-visual__ring" />
          <span className="hero-visual__ring hero-visual__ring--outer" />
          <span className="hero-visual__center-text">VS</span>
        </div>
        <div className="hero-visual__art hero-visual__art--right">
          <img className="hero-visual__logo" src={rightLogo} alt="" aria-hidden="true" />
          <span className="hero-visual__label">{rightInitials}</span>
        </div>
      </div>

      <div className="hero-meta">
        <div>
          <p className="eyebrow">NBA live hub</p>
          <span className="hero-kicker">Cinematic snapshot briefing</span>
        </div>
        <span className={`hero-timestamp hero-timestamp--${isRefreshing ? 'refreshing' : 'ready'}`}>
          <span className="hero-timestamp__dot" aria-hidden="true" />
          {isRefreshing ? 'Refreshing live snapshot…' : `Updated ${new Date(snapshot.generatedAt).toLocaleString()}`}
        </span>
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
