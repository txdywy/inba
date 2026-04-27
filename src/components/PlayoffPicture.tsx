import type { FeaturedPlayer, PlayoffRow, StandingRow } from '../data/types';
import { createConferenceArtwork, createPlayerHeadshotUrl, createTeamLogoUrl } from '../lib/teamArtwork';
import Section from './Section';

interface PlayoffPictureProps {
  east: PlayoffRow[];
  west: PlayoffRow[];
  standings: {
    east: StandingRow[];
    west: StandingRow[];
  };
  featuredPlayers: FeaturedPlayer[];
}

function formatRecord(row: StandingRow) {
  return `${row.wins}-${row.losses}`;
}

function calculateFormScore(last10: string) {
  const [wins, losses] = last10.split('-').map((part) => Number(part));
  return Number.isFinite(wins) && Number.isFinite(losses) ? wins - losses : 0;
}

function pickConferencePlayer(players: FeaturedPlayer[], conferenceTeams: Set<string>) {
  return [...players]
    .filter((player) => conferenceTeams.has(player.teamAbbreviation.toUpperCase()))
    .sort((left, right) => right.points - left.points || right.minutes - left.minutes)[0];
}

function ConferenceTree({
  title,
  rows,
  standingsRows,
  featuredPlayers
}: {
  title: string;
  rows: PlayoffRow[];
  standingsRows: StandingRow[];
  featuredPlayers: FeaturedPlayer[];
}) {
  const artwork = createConferenceArtwork(title);
  const standingsByTeam = new Map(standingsRows.map((row) => [row.team, row] as const));
  const conferenceTeams = new Set(standingsRows.map((row) => row.abbreviation.toUpperCase()));
  const topSeed = rows[0];
  const lockedCount = rows.filter((row) => row.status === 'locked').length;
  const playInCount = rows.filter((row) => row.status === 'play-in').length;
  const bestForm = [...standingsRows].sort(
    (left, right) => calculateFormScore(right.last10) - calculateFormScore(left.last10) || right.wins - left.wins || left.rank - right.rank
  )[0];
  const star = pickConferencePlayer(featuredPlayers, conferenceTeams);
  const topSeedStanding = topSeed ? standingsByTeam.get(topSeed.team) : undefined;
  const bestFormStanding = bestForm;

  return (
    <article className="bracket-column bracket-column--tree">
      <div className="bracket-column__art tree-column__art" aria-hidden="true" style={{ backgroundImage: `url(${artwork})` }} />
      <div className="tree-column__header">
        <div>
          <span>{title} conference</span>
          <h3>{title} playoff tree</h3>
        </div>
        <div className="tree-column__chips">
          <span>{lockedCount} locked</span>
          <span>{playInCount} play-in</span>
        </div>
      </div>

      <div className="tree-column__signals">
        <article className="tree-signal tree-signal--result">
          <span className="tree-signal__eyebrow">Key result</span>
          {topSeed ? (
            <div className="tree-signal__row">
              <img
                className="tree-signal__logo"
                src={createTeamLogoUrl(topSeedStanding?.abbreviation ?? topSeed.team)}
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <div>
                <strong>{topSeed.team}</strong>
                <span>
                  #{topSeed.seed} · {topSeedStanding ? formatRecord(topSeedStanding) : 'Record unavailable'} · {topSeed.matchup}
                </span>
              </div>
            </div>
          ) : (
            <p className="empty-state">Seeding will appear here once the bracket is populated.</p>
          )}
        </article>

        <article className="tree-signal tree-signal--form">
          <span className="tree-signal__eyebrow">Momentum</span>
          {bestForm ? (
            <div className="tree-signal__row">
              <img
                className="tree-signal__logo"
                src={createTeamLogoUrl(bestForm.abbreviation)}
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <div>
                <strong>{bestForm.team}</strong>
                <span>
                  {bestForm.last10} last 10 · {formatRecord(bestForm)}
                </span>
              </div>
            </div>
          ) : (
            <p className="empty-state">Form notes will appear here once standings are available.</p>
          )}
        </article>

        <article className="tree-signal tree-signal--star">
          <span className="tree-signal__eyebrow">Star highlight</span>
          {star ? (
            <div className="tree-signal__player">
              <img className="tree-signal__portrait" src={createPlayerHeadshotUrl(star.playerId)} alt="" aria-hidden="true" loading="lazy" />
              <div>
                <strong>{star.name}</strong>
                <span>
                  {star.teamAbbreviation} · {star.points.toFixed(1)} PTS · {star.rebounds.toFixed(1)} REB · {star.assists.toFixed(1)} AST
                </span>
              </div>
            </div>
          ) : (
            <p className="empty-state">Star watch will appear when player stats are available.</p>
          )}
        </article>
      </div>

      {rows.length === 0 ? <p className="empty-state">Bracket will appear here once teams are seeded.</p> : null}

      <div className="tree-column__path" aria-label={`${title} playoff tree`}>
        {rows.map((row) => {
          const standing = standingsByTeam.get(row.team);
          const abbreviation = standing?.abbreviation ?? 'UNK';
          return (
            <article className={`tree-node tree-node--${row.status}`} key={`${title}-${row.seed}`}>
              <span className="tree-node__seed">#{row.seed}</span>
              <div className="tree-node__team">
                <img className="tree-node__logo" src={createTeamLogoUrl(abbreviation)} alt="" aria-hidden="true" loading="lazy" />
                <div>
                  <strong>{row.team}</strong>
                  <span>{standing ? formatRecord(standing) : 'Record unavailable'}</span>
                </div>
              </div>
              <div className="tree-node__details">
                <span>{row.status === 'locked' ? 'Locked in' : 'Play-in watch'}</span>
                <span>{row.matchup ?? 'play-in'}</span>
              </div>
            </article>
          );
        })}
      </div>

      {bestFormStanding ? (
        <p className="tree-column__note">
          {bestFormStanding.team} is carrying the sharpest recent form in the {title} field.
        </p>
      ) : null}
    </article>
  );
}

export default function PlayoffPicture({ east, west, standings, featuredPlayers }: PlayoffPictureProps) {
  return (
    <Section
      eyebrow="Postseason"
      title="Playoff picture"
      subtitle="Bracket tree, momentum cards, and star watch."
    >
      <div className="bracket-grid bracket-grid--tree">
        <ConferenceTree title="East" rows={east} standingsRows={standings.east} featuredPlayers={featuredPlayers} />
        <ConferenceTree title="West" rows={west} standingsRows={standings.west} featuredPlayers={featuredPlayers} />
      </div>
    </Section>
  );
}
