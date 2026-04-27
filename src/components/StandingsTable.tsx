import type { StandingRow } from '../data/types';
import Section from './Section';

interface StandingsTableProps {
  title: string;
  rows: StandingRow[];
}

export default function StandingsTable({ title, rows }: StandingsTableProps) {
  return (
    <Section eyebrow="League table" title={title} subtitle="Ranked by current snapshot data.">
      <div className="table-wrap">
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