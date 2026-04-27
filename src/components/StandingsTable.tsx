import { useMemo, useState } from 'react';
import type { StandingRow } from '../data/types';
import { createTeamLogoUrl } from '../lib/teamArtwork';
import Section from './Section';

type ConferenceKey = 'east' | 'west';

interface StandingsTableProps {
  eastRows: StandingRow[];
  westRows: StandingRow[];
}

function renderRecord(row: StandingRow) {
  return `${row.wins}-${row.losses}`;
}

export default function StandingsTable({ eastRows, westRows }: StandingsTableProps) {
  const [activeConference, setActiveConference] = useState<ConferenceKey>('east');

  const conference = useMemo(() => {
    return activeConference === 'east'
      ? { key: 'east' as const, label: 'East', rows: eastRows }
      : { key: 'west' as const, label: 'West', rows: westRows };
  }, [activeConference, eastRows, westRows]);

  const leader = conference.rows[0];
  const leaderArtwork = leader ? createTeamLogoUrl(leader.abbreviation) : '';

  return (
    <Section eyebrow="League table" title="Standings" subtitle="Toggle between conferences without leaving the right rail.">
      <div className="standings-switcher" role="tablist" aria-label="Conference standings">
        <button
          type="button"
          role="tab"
          aria-selected={activeConference === 'east'}
          className={`standings-switcher__tab standings-switcher__tab--${activeConference === 'east' ? 'active' : 'idle'}`}
          onClick={() => setActiveConference('east')}
        >
          East
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeConference === 'west'}
          className={`standings-switcher__tab standings-switcher__tab--${activeConference === 'west' ? 'active' : 'idle'}`}
          onClick={() => setActiveConference('west')}
        >
          West
        </button>
      </div>

      <div className="table-wrap" role="tabpanel" aria-label={`${conference.label} standings`}>
        {leader ? (
          <div className="table-lead">
            <img className="table-lead__art" src={leaderArtwork} alt="" aria-hidden="true" loading="lazy" />
            <div>
              <span>{conference.label} leader</span>
              <strong>
                {leader.team} · {renderRecord(leader)}
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
            {conference.rows.map((row) => (
              <tr key={`${conference.key}-${row.abbreviation}`}>
                <td>{row.rank}</td>
                <td>
                  <span className="table-team-mark">
                    <img src={createTeamLogoUrl(row.abbreviation)} alt="" aria-hidden="true" loading="lazy" />
                  </span>
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
