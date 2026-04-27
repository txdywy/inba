import type { GameCard as GameCardData } from '../data/types';
import { createMatchupArtwork, createTeamInitials } from '../lib/teamArtwork';

interface GameCardProps {
  game: GameCardData;
  index: number;
}

export default function GameCard({ game, index }: GameCardProps) {
  const artwork = createMatchupArtwork(
    game.awayTeam.name,
    game.awayTeam.abbreviation,
    game.homeTeam.name,
    game.homeTeam.abbreviation,
  );
  const awayInitials = createTeamInitials(game.awayTeam.name);
  const homeInitials = createTeamInitials(game.homeTeam.name);

  return (
    <article className={`game-card game-card--${game.status} game-card--tone-${index % 3}`}>
      <div className="game-card__poster" aria-hidden="true" style={{ backgroundImage: `url(${artwork})` }}>
        <span className="game-card__poster-glow" />
        <div className="game-card__poster-badge game-card__poster-badge--away">{awayInitials}</div>
        <div className="game-card__poster-badge game-card__poster-badge--home">{homeInitials}</div>
      </div>
      <div className="game-card__meta">
        <span className={`status-pill status-pill--${game.status}`}>{game.status}</span>
        <span>{game.periodLabel}</span>
        <span>{game.clock}</span>
      </div>
      <div className="game-card__teams">
        <div>
          <p className="team-name">{game.awayTeam.name}</p>
          <span>{game.awayTeam.abbreviation}</span>
        </div>
        <strong>{game.awayTeam.score ?? '-'}</strong>
      </div>
      <div className="game-card__teams">
        <div>
          <p className="team-name">{game.homeTeam.name}</p>
          <span>{game.homeTeam.abbreviation}</span>
        </div>
        <strong>{game.homeTeam.score ?? '-'}</strong>
      </div>
    </article>
  );
}
