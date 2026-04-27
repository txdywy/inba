import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App shell', () => {
  it('renders the NBA Live Hub headline and main landmark', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /playoff picture taking shape/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /featured players/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/bracket studio with seed paths, momentum cards, and star watch/i)).toBeInTheDocument();
    expect(screen.getByText(/broadcast theater/i)).toBeInTheDocument();
    expect(screen.getByText(/matchup board/i)).toBeInTheDocument();
    expect(screen.getByText(/studio desk/i)).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
