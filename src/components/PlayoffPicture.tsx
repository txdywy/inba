import type { PlayoffRow } from '../data/types';
import { createConferenceArtwork } from '../lib/teamArtwork';
import Section from './Section';

interface PlayoffPictureProps {
  east: PlayoffRow[];
  west: PlayoffRow[];
}

function ConferenceBracket({ title, rows }: { title: string; rows: PlayoffRow[] }) {
  return (
    <div className="bracket-column">
      <div className="bracket-column__header">
        <div>
          <span>{title} conference</span>
          <h3>{title}</h3>
        </div>
        <span>{rows.length} seeds</span>
      </div>
      {rows.length === 0 ? <p className="empty-state">Bracket will appear here once teams are seeded.</p> : null}
      <div className="bracket-stack">
        {rows.map((row) => (
          <article className={`bracket-card bracket-card--${row.status}`} key={`${title}-${row.seed}`}>
            <div className="bracket-card__top">
              <span className="bracket-seed">#{row.seed}</span>
              <strong>{row.team}</strong>
            </div>
            <p>{row.status}</p>
            {row.matchup ? <span>{row.matchup}</span> : null}
          </article>
        ))}
      </div>
    </div>
  );
}

export default function PlayoffPicture({ east, west }: PlayoffPictureProps) {
  return (
    <Section
      eyebrow="Postseason"
      title="Playoff picture"
      subtitle="Who each conference would face right now, based on the latest snapshot."
    >
      <div className="bracket-grid">
        <ConferenceBracket title="East" rows={east} />
        <ConferenceBracket title="West" rows={west} />
      </div>
    </Section>
  );
}
