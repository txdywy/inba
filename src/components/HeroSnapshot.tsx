import type { FeaturedPlayer, LeaguePhase, Snapshot } from '../data/types';
import { createPlayerHeadshotUrl, createTeamInitials, createTeamLogoUrl } from '../lib/teamArtwork';

interface HeroSnapshotProps {
  snapshot: Snapshot;
  liveCount: number;
  scheduledCount: number;
  finalCount: number;
  isRefreshing: boolean;
  featuredPlayers: FeaturedPlayer[];
}

const phaseLabels: Record<LeaguePhase, string> = {
  regularSeason: 'Regular season desk',
  playIn: 'Play-in command center',
  playoffs: 'Playoff command center'
};

function formatGameState(snapshot: Snapshot, game: Snapshot['games'][number] | undefined) {
  if (!game) {
    return `Tracking the ${phaseLabels[snapshot.leaguePhase].toLowerCase()}.`;
  }

  if (game.status === 'scheduled') {
    return `${game.periodLabel} · ${game.awayTeam.name} at ${game.homeTeam.name}`;
  }

  return `${game.periodLabel} · ${game.clock} · ${game.awayTeam.name} at ${game.homeTeam.name}`;
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
  const eastLeader = snapshot.standings.east[0];
  const westLeader = snapshot.standings.west[0];
  const leftLogo = featuredGame ? createTeamLogoUrl(featuredGame.awayTeam.abbreviation) : '';
  const rightLogo = featuredGame ? createTeamLogoUrl(featuredGame.homeTeam.abbreviation) : '';
  const leftInitials = featuredGame ? createTeamInitials(featuredGame.awayTeam.name) : 'NBA';
  const rightInitials = featuredGame ? createTeamInitials(featuredGame.homeTeam.name) : 'LIVE';
  const phaseLabel = phaseLabels[snapshot.leaguePhase];

  return (
    <header className="hero-panel">
      <div className="hero-stage">
        <div className="hero-copywrap">
          <div className="hero-meta">
            <div>
              <p className="eyebrow">NBA live desk</p>
              <span className="hero-kicker">Broadcast editorial briefing</span>
            </div>
            <div className="hero-meta__badges">
              <span className="hero-phase-pill">{phaseLabel}</span>
              <span className={`hero-timestamp hero-timestamp--${isRefreshing ? 'refreshing' : 'ready'}`}>
                <span className="hero-timestamp__dot" aria-hidden="true" />
                {isRefreshing ? 'Refreshing live snapshot…' : `Updated ${new Date(snapshot.generatedAt).toLocaleString()}`}
              </span>
            </div>
          </div>

          <div className="hero-copystack">
            <div>
              <h1>{snapshot.headline.title}</h1>
              <p className="hero-copy">{snapshot.headline.subtitle}</p>
            </div>

            <div className="hero-scoreline" aria-label="Current NBA summary">
              <span>
                <strong>{liveCount}</strong>
                live now
              </span>
              <span>
                <strong>{scheduledCount}</strong>
                next windows
              </span>
              <span>
                <strong>{finalCount}</strong>
                already final
              </span>
              <span>
                <strong>{snapshot.leaguePhase}</strong>
                editorial frame
              </span>
            </div>
          </div>

          <div className="hero-briefs">
            <article className="hero-brief-card">
              <span className="hero-brief-card__eyebrow">Lead matchup</span>
              <strong>{featuredGame ? `${featuredGame.awayTeam.abbreviation} at ${featuredGame.homeTeam.abbreviation}` : 'Spotlight to come'}</strong>
              <span>{formatGameState(snapshot, featuredGame)}</span>
            </article>
            <article className="hero-brief-card">
              <span className="hero-brief-card__eyebrow">Pressure line</span>
              <strong>
                {eastLeader && westLeader ? `${eastLeader.abbreviation} / ${westLeader.abbreviation}` : 'Standings incoming'}
              </strong>
              <span>
                {eastLeader && westLeader
                  ? `East leader ${eastLeader.team} · West leader ${westLeader.team}`
                  : 'Conference leaders will appear once standings load.'}
              </span>
            </article>
            <article className="hero-brief-card">
              <span className="hero-brief-card__eyebrow">Shot creator</span>
              <strong>{leadPlayer ? leadPlayer.name : 'Awaiting stats board'}</strong>
              <span>
                {leadPlayer
                  ? `${leadPlayer.teamAbbreviation} · ${leadPlayer.points.toFixed(1)} PTS · ${leadPlayer.assists.toFixed(1)} AST`
                  : 'Player spotlight returns when league stats are available.'}
              </span>
            </article>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-marquee">
            <span className="hero-marquee__eyebrow">Spotlight window</span>
            <strong>{featuredGame ? `${featuredGame.awayTeam.name} at ${featuredGame.homeTeam.name}` : 'League night in focus'}</strong>
            <span>{formatGameState(snapshot, featuredGame)}</span>
          </div>

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

          <div className="hero-scorebug">
            <span className="hero-scorebug__eyebrow">Desk callout</span>
            <div className="hero-scorebug__row">
              <strong>{featuredGame ? featuredGame.awayTeam.name : 'Away team'}</strong>
              <span>{featuredGame?.awayTeam.score ?? '—'}</span>
            </div>
            <div className="hero-scorebug__row">
              <strong>{featuredGame ? featuredGame.homeTeam.name : 'Home team'}</strong>
              <span>{featuredGame?.homeTeam.score ?? '—'}</span>
            </div>
          </div>

          {leadPlayer ? (
            <div className="hero-spotlight">
              <img className="hero-spotlight__photo" src={createPlayerHeadshotUrl(leadPlayer.playerId)} alt="" aria-hidden="true" loading="lazy" />
              <div className="hero-spotlight__body">
                <span className="hero-spotlight__eyebrow">Featured scorer</span>
                <strong>{leadPlayer.name}</strong>
                <span>
                  {leadPlayer.teamAbbreviation} · {leadPlayer.points.toFixed(1)} PTS · {leadPlayer.rebounds.toFixed(1)} REB ·{' '}
                  {leadPlayer.assists.toFixed(1)} AST
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
