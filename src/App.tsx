import FeaturedPlayersRail from './components/FeaturedPlayersRail';
import GamesRail from './components/GamesRail';
import HeroSnapshot from './components/HeroSnapshot';
import PlayoffPicture from './components/PlayoffPicture';
import StandingsTable from './components/StandingsTable';
import fallbackSnapshot from './data/fallbackSnapshot.json';
import type { Snapshot } from './data/types';
import { useLiveSnapshot } from './hooks/useLiveSnapshot';
import { createPlayerHeadshotUrl, createTeamLogoUrl } from './lib/teamArtwork';

interface AppProps {
  initialSnapshot?: Snapshot;
}

export default function App({ initialSnapshot = fallbackSnapshot as Snapshot }: AppProps) {
  const { snapshot, isRefreshing } = useLiveSnapshot(initialSnapshot);
  const liveCount = snapshot.games.filter((game) => game.status === 'live').length;
  const scheduledCount = snapshot.games.filter((game) => game.status === 'scheduled').length;
  const finalCount = snapshot.games.filter((game) => game.status === 'final').length;
  const featuredGame = snapshot.games[0];
  const leadPlayer = snapshot.featuredPlayers[0];

  return (
    <main className="app-shell">
      <HeroSnapshot
        snapshot={snapshot}
        liveCount={liveCount}
        scheduledCount={scheduledCount}
        finalCount={finalCount}
        isRefreshing={isRefreshing}
        featuredPlayers={snapshot.featuredPlayers ?? []}
      />

      <div className="content-stack">
        <section className="feature-strip" aria-label="NBA feature highlights">
          <article className="feature-card feature-card--cover feature-card--lead">
            <span className="feature-card__eyebrow">Lead story</span>
            <h2>{snapshot.headline.title}</h2>
            <p>{snapshot.headline.subtitle}</p>
            {featuredGame ? (
              <div className="feature-card__matchup">
                <div className="feature-card__matchup-team">
                  <img src={createTeamLogoUrl(featuredGame.awayTeam.abbreviation)} alt="" aria-hidden="true" loading="lazy" />
                  <span>{featuredGame.awayTeam.name}</span>
                </div>
                <span className="feature-card__matchup-divider">vs</span>
                <div className="feature-card__matchup-team">
                  <img src={createTeamLogoUrl(featuredGame.homeTeam.abbreviation)} alt="" aria-hidden="true" loading="lazy" />
                  <span>{featuredGame.homeTeam.name}</span>
                </div>
              </div>
            ) : null}
          </article>

          <article className="feature-card feature-card--image feature-card--pulse">
            <span className="feature-card__eyebrow">Broadcast desk</span>
            <div className="feature-card__art feature-card__art--arena" aria-hidden="true" />
            <div className="feature-card__stats">
              <span>{liveCount} live now</span>
              <span>{scheduledCount} on deck</span>
              <span>{finalCount} wrapped</span>
              <span>{snapshot.leaguePhase}</span>
            </div>
          </article>

          <article className="feature-card feature-card--player">
            <span className="feature-card__eyebrow">Star watch</span>
            {leadPlayer ? (
              <div className="feature-card__player-wrap">
                <div className="feature-card__player-media">
                  <img
                    className="feature-card__player-photo"
                    src={createPlayerHeadshotUrl(leadPlayer.playerId)}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                  />
                  <img
                    className="feature-card__player-logo"
                    src={createTeamLogoUrl(leadPlayer.teamAbbreviation)}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                  />
                </div>
                <div className="feature-card__player-copy">
                  <strong>{leadPlayer.name}</strong>
                  <span>{leadPlayer.teamAbbreviation} lead option</span>
                  <div className="feature-card__stats">
                    <span>{leadPlayer.points.toFixed(1)} PTS</span>
                    <span>{leadPlayer.rebounds.toFixed(1)} REB</span>
                    <span>{leadPlayer.assists.toFixed(1)} AST</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="empty-state">Player spotlight will appear when the league stats board is available.</p>
            )}
          </article>
        </section>

        <div className="editorial-grid">
          <div className="editorial-grid__lead">
            <PlayoffPicture
              east={snapshot.playoffPicture.east}
              west={snapshot.playoffPicture.west}
              standings={snapshot.standings}
              featuredPlayers={snapshot.featuredPlayers}
            />
            <GamesRail games={snapshot.games} />
          </div>

          <div className="editorial-grid__rail">
            <FeaturedPlayersRail players={snapshot.featuredPlayers ?? []} />
            <div className="standings-stack">
              <StandingsTable title="Standings — East" rows={snapshot.standings.east} />
              <StandingsTable title="Standings — West" rows={snapshot.standings.west} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
