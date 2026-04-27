import type { StandingRow } from '../data/types';
import { createTeamArtwork, createTeamInitials } from '../lib/teamArtwork';
import Section from './Section';

interface StandingsTableProps {
  title: string;
  rows: StandingRow[];
}

export default function StandingsTable({ title, rows }: StandingsTableProps) {
  const leader = rows[0];
  const leaderArtwork = leader ? createTeamArtwork(leader.team, leader.abbreviation) : '';

  return (
    <Section eyebrow="League table" title={title} subtitle="Ranked by current snapshot data.">
      <div className="table-wrap">
        {leader ? (
          <div className="table-lead">
            <img className="table-lead__art" src={leaderArtwork} alt="" aria-hidden="true" />
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
              <tr key={`${title}-${row.abbreviation}`}>
                <td>{row.rank}</td>
                <td>
                  <span className="table-team-mark">{createTeamInitials(row.team)}</span>
                  <strong>{row.team}</strong>
                  <span>{row.abbreviation}</span>
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
