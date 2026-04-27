import type { FeaturedPlayer, Snapshot } from '../data/types';
import { createPlayerHeadshotUrl, createTeamInitials, createTeamLogoUrl } from '../lib/teamArtwork';

interface HeroSnapshotProps {
  snapshot: Snapshot;
  liveCount: number;
  scheduledCount: number;
  finalCount: number;
  isRefreshing: boolean;
  featuredPlayers: FeaturedPlayer[];
}

export default function HeroSnapshot({
  snapshot,
  liveCount,
  scheduledCount,
  finalCount,
  isRefreshing,
  featuredPlayers
}: HeroSnapshotProps) {
  const featuredGame = snapshot.games[0];
  const leadPlayer = featuredPlayers[0];
  const leftLogo = featuredGame ? createTeamLogoUrl(featuredGame.awayTeam.abbreviation) : '';
  const rightLogo = featuredGame ? createTeamLogoUrl(featuredGame.homeTeam.abbreviation) : '';
  const leftInitials = featuredGame ? createTeamInitials(featuredGame.awayTeam.name) : 'NBA';
  const rightInitials = featuredGame ? createTeamInitials(featuredGame.homeTeam.name) : 'LIVE';

  return (
    <header className="hero-panel">
      <div className="hero-stage">
        <div className="hero-copywrap">
          <div className="hero-meta">
            <div>
              <p className="eyebrow">NBA live hub</p>
              <span className="hero-kicker">Editorial playoff briefing</span>
            </div>
            <span className={`hero-timestamp hero-timestamp--${isRefreshing ? 'refreshing' : 'ready'}`}>
              <span className="hero-timestamp__dot" aria-hidden="true" />
              {isRefreshing ? 'Refreshing live snapshot…' : `Updated ${new Date(snapshot.generatedAt).toLocaleString()}`}
            </span>
          </div>

          <div className="hero-copystack">
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
        </div>

        <div className="hero-visual">
          <div className="hero-visual__art hero-visual__art--left" aria-hidden="true">
            {featuredGame ? <img className="hero-visual__logo" src={leftLogo} alt="" aria-hidden="true" loading="lazy" /> : null}
            <span className="hero-visual__label">{leftInitials}</span>
          </div>
          <div className="hero-visual__center" aria-hidden="true">
            <span className="hero-visual__ring" />
            <span className="hero-visual__ring hero-visual__ring--outer" />
            <span className="hero-visual__center-text">VS</span>
          </div>
          <div className="hero-visual__art hero-visual__art--right" aria-hidden="true">
            {featuredGame ? <img className="hero-visual__logo" src={rightLogo} alt="" aria-hidden="true" loading="lazy" /> : null}
            <span className="hero-visual__label">{rightInitials}</span>
          </div>

          {leadPlayer ? (
            <div className="hero-spotlight">
              <img className="hero-spotlight__photo" src={createPlayerHeadshotUrl(leadPlayer.playerId)} alt="" aria-hidden="true" loading="lazy" />
              <div className="hero-spotlight__body">
                <span className="hero-spotlight__eyebrow">Featured scorer</span>
                <strong>{leadPlayer.name}</strong>
                <span>
                  {leadPlayer.teamAbbreviation} · {leadPlayer.points.toFixed(1)} PTS · {leadPlayer.rebounds.toFixed(1)} REB · {leadPlayer.assists.toFixed(1)} AST
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
