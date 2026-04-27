import type { GameCard as GameCardData } from '../data/types';
import GameCard from './GameCard';
import Section from './Section';

interface GamesRailProps {
  games: GameCardData[];
}

export default function GamesRail({ games }: GamesRailProps) {
  return (
    <Section
      eyebrow="Live feed"
      title="Today's games"
      subtitle="The newest game state is shown first and updates with the latest published snapshot."
    >
      <div className="games-grid">
        {games.length === 0 ? <p className="empty-state">No games are currently listed.</p> : null}
        {games.map((game, index) => (
          <GameCard key={game.id} game={game} index={index} />
        ))}
      </div>
    </Section>
  );
}
