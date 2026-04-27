import { describe, expect, it } from 'vitest';
import { fetchNbaStatsRawSnapshot } from './nbaStats';

const scoreboardFixture = {
  resultSets: [
    {
      name: 'GameHeader',
      headers: [
        'GAME_ID',
        'GAME_STATUS_ID',
        'GAME_STATUS_TEXT',
        'HOME_TEAM_ID',
        'VISITOR_TEAM_ID',
        'LIVE_PERIOD',
        'LIVE_PC_TIME'
      ],
      rowSet: [
        ['001', 2, 'In Progress', 1610612747, 1610612744, 4, '03:41'],
        ['002', 1, '7:30 PM ET', 1610612748, 1610612738, 0, '']
      ]
    },
    {
      name: 'LineScore',
      headers: ['GAME_ID', 'TEAM_ID', 'TEAM_ABBREVIATION', 'TEAM_CITY_NAME', 'TEAM_NICKNAME', 'PTS'],
      rowSet: [
        ['001', 1610612744, 'GSW', 'Golden State', 'Warriors', 108],
        ['001', 1610612747, 'LAL', 'Los Angeles', 'Lakers', 112],
        ['002', 1610612738, 'BOS', 'Boston', 'Celtics', null],
        ['002', 1610612748, 'MIA', 'Miami', 'Heat', null]
      ]
    }
  ]
};

const standingsFixture = {
  resultSets: [
    {
      name: 'Standings',
      headers: [
        'CONFERENCE',
        'TEAM_CITY',
        'TEAM_NAME',
        'TEAM_ABBREVIATION',
        'WINS',
        'LOSSES',
        'GB',
        'STRK',
        'L10',
        'CONFERENCE_RANK'
      ],
      rowSet: [
        ['East', 'Boston', 'Celtics', 'BOS', 60, 22, 0, 'W3', '8-2', 1],
        ['East', 'New York', 'Knicks', 'NYK', 58, 24, 2, 'W1', '7-3', 2],
        ['West', 'Denver', 'Nuggets', 'DEN', 57, 25, 0, 'W1', '7-3', 1],
        ['West', 'Oklahoma City', 'Thunder', 'OKC', 56, 26, 1, 'L1', '6-4', 2],
        ['West', 'Minnesota', 'Timberwolves', 'MIN', 55, 27, 2, 'W2', '8-2', 3],
        ['West', 'Los Angeles', 'Clippers', 'LAC', 54, 28, 3, 'L2', '5-5', 4],
        ['West', 'Dallas', 'Mavericks', 'DAL', 53, 29, 4, 'W1', '6-4', 5],
        ['West', 'Phoenix', 'Suns', 'PHX', 52, 30, 5, 'L1', '4-6', 6],
        ['West', 'Sacramento', 'Kings', 'SAC', 51, 31, 6, 'W1', '5-5', 7],
        ['West', 'New Orleans', 'Pelicans', 'NOP', 50, 32, 7, 'L3', '3-7', 8]
      ]
    }
  ]
};

describe('fetchNbaStatsRawSnapshot', () => {
  it('combines scoreboard and standings payloads into the raw snapshot contract', async () => {
    const fetchImpl: typeof fetch = async (input) => {
      const payload = String(input).includes('scoreboardv2') ? scoreboardFixture : standingsFixture;
      return {
        ok: true,
        json: async () => payload
      } as Response;
    };

    const snapshot = await fetchNbaStatsRawSnapshot({ fetchImpl });

    expect(snapshot.scoreboard).toHaveLength(2);
    expect(snapshot.standings.east[0]).toMatchObject({ team: 'Boston Celtics', abbreviation: 'BOS' });
    expect(snapshot.standings.west[0]).toMatchObject({ team: 'Denver Nuggets', abbreviation: 'DEN' });
    expect(snapshot.playoffs.west[0]).toMatchObject({ seed: 1, matchup: 'vs. 8 seed' });
    expect(snapshot.top_story.title).toMatch(/game/i);
  });
});