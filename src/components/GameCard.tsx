import type { GameCard as GameCardData } from '../data/types';
import { hideBrokenImage } from '../lib/imageFallback';
import { createTeamLogoUrl } from '../lib/teamArtwork';

interface GameCardProps {
  game: GameCardData;
  index: number;
}

export default function GameCard({ game, index }: GameCardProps) {
  const awayLogo = createTeamLogoUrl(game.awayTeam.abbreviation);
  const homeLogo = createTeamLogoUrl(game.homeTeam.abbreviation);
  const hasScore =
    game.awayTeam.score !== null &&
    game.awayTeam.score !== undefined &&
    game.homeTeam.score !== null &&
    game.homeTeam.score !== undefined;

  return (
    <article className={`game-card game-card--${game.status} game-card--tone-${index % 3} ${hasScore ? 'game-card--scored' : 'game-card--pregame'}`}>
      <div className="game-card__poster" aria-hidden="true">
        <img className="game-card__poster-logo game-card__poster-logo--away" src={awayLogo} alt="" aria-hidden="true" onError={hideBrokenImage} />
        <span className="game-card__poster-vs">VS</span>
        <img className="game-card__poster-logo game-card__poster-logo--home" src={homeLogo} alt="" aria-hidden="true" onError={hideBrokenImage} />
        <span className="game-card__poster-glow" />
      </div>
      <div className="game-card__meta">
        <span className={`status-pill status-pill--${game.status}`}>{game.status}</span>
        <span className="game-card__period">{game.periodLabel}</span>
        <span className="game-card__clock">{game.clock}</span>
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
