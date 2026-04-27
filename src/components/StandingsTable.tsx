import type { StandingRow } from '../data/types';
import { hideBrokenImage } from '../lib/imageFallback';
import { createTeamLogoUrl } from '../lib/teamArtwork';
import Section from './Section';

interface StandingsTableProps {
  title: string;
  rows: StandingRow[];
}

function getSeedZone(rank: number) {
  if (rank === 1) return 'top-seed';
  if (rank <= 6) return 'playoff';
  if (rank <= 10) return 'play-in';
  return 'chase';
}

export default function StandingsTable({ title, rows }: StandingsTableProps) {
  const leader = rows[0];
  const leaderArtwork = leader ? createTeamLogoUrl(leader.abbreviation) : '';

  return (
    <Section eyebrow="League table" title={title} subtitle="Ranked by current snapshot data.">
      <div className="table-wrap">
        {leader ? (
          <div className="table-lead">
            <img className="table-lead__art" src={leaderArtwork} alt="" aria-hidden="true" loading="lazy" onError={hideBrokenImage} />
            <div>
              <span>Front-runner</span>
              <strong>
                {leader.team} · {leader.wins}-{leader.losses}
              </strong>
            </div>
          </div>
        ) : null}
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>W</th>
              <th>L</th>
              <th>GB</th>
              <th>Streak</th>
              <th>Last 10</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className={`standings-row standings-row--${getSeedZone(row.rank)}`} key={`${title}-${row.abbreviation}`}>
                <td>{row.rank}</td>
                <td>
                  <span className="table-team-mark">
                    <img src={createTeamLogoUrl(row.abbreviation)} alt="" aria-hidden="true" loading="lazy" onError={hideBrokenImage} />
                  </span>
                  <span className="table-team-copy">
                    <strong>{row.team}</strong>
                    <span>{row.abbreviation}</span>
                  </span>
                </td>
                <td>{row.wins}</td>
                <td>{row.losses}</td>
                <td>{row.gamesBehind}</td>
                <td>{row.streak}</td>
                <td>{row.last10}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
