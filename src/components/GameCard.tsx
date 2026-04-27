import type { GameCard as GameCardData } from '../data/types';

interface GameCardProps {
  game: GameCardData;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <article className={`game-card game-card--${game.status}`}>
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