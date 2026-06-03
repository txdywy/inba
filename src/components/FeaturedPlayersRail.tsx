import { memo } from 'react';
import type { FeaturedPlayer } from '../data/types';
import { hideBrokenImage } from '../lib/imageFallback';
import { createPlayerHeadshotUrl, createTeamLogoUrl } from '../lib/teamArtwork';
import Section from './Section';

interface FeaturedPlayersRailProps {
  players: FeaturedPlayer[];
}

function formatStat(value: number, label: string) {
  return `${value.toFixed(1)} ${label}`;
}

const FeaturedPlayersRail = memo(function FeaturedPlayersRail({ players }: FeaturedPlayersRailProps) {
  return (
    <Section
      eyebrow="Spotlight"
      title="Featured players"
      subtitle="Top league scorers are surfaced with official headshots and team marks."
    >
      {players.length === 0 ? (
        <p className="empty-state">Player spotlight will appear when the league stats board is available.</p>
      ) : (
        <div className="player-grid player-grid--rail player-grid--broadcast">
          {players.map((player, index) => (
            <article className={`player-card player-card--tone-${index % 3}`} key={player.playerId}>
              <div className="player-card__portrait">
                <img
                  className="player-card__headshot"
                  src={createPlayerHeadshotUrl(player.playerId)}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  onError={hideBrokenImage}
                />
                <span className="player-card__rank">#{index + 1}</span>
                <img
                  className="player-card__teammark"
                  src={createTeamLogoUrl(player.teamAbbreviation)}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  onError={hideBrokenImage}
                />
              </div>
              <div className="player-card__body">
                <strong>{player.name}</strong>
                <span>{player.teamAbbreviation}</span>
                <div className="player-card__stats">
                  <span>{formatStat(player.points, 'PTS')}</span>
                  <span>{formatStat(player.rebounds, 'REB')}</span>
                  <span>{formatStat(player.assists, 'AST')}</span>
                  <span>{formatStat(player.minutes, 'MIN')}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
});

export default FeaturedPlayersRail;
